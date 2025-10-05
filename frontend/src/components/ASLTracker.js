import React, { useState, useRef } from 'react';
import { Upload, Video, Mic, Loader, CheckCircle, XCircle, Play } from 'lucide-react';
import axios from "axios";

export default function ASLInterpreter() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setError("File size must be less than 100MB");
        return;
      }
      
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setError(null);
      setResult(null);
      setAudioUrl(null);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm'
      });

      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: 'video/webm'
        });
        const file = new File([blob], 'recorded-video.webm', { type: 'video/webm' });
        
        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(blob));
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
      setResult(null);
      setAudioUrl(null);
    } catch (err) {
      setError("Could not access camera: " + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };

  const handleSubmit = async () => {
    if (!videoFile) {
      setError("Please select or record a video first");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);
    setAudioUrl(null);

    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      // Use axios.post correctly
      const response = await axios.post(
        'http://127.0.0.1:5000/fingerspelling-to-speech',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const data = response.data;
      setResult(data);
      setAudioUrl(`http://127.0.0.1:5000${data.audio_url}`);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to process video';
      setError(errorMessage);
      console.error('Error details:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '0.5rem'
        }}>
          ASL Fingerspelling Interpreter
        </h2>
        <div style={{
        }}>
        </div><p style={{ 
          color: '#64748b', 
          fontSize: '1rem', 
          marginTop: '1rem'
        }}>
          Upload or record ASL fingerspelling to convert to speech
        </p>
      </div>

      {/* Video Input Section */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '2px solid #e2e8f0',
        padding: '2rem',
        marginBottom: '1.5rem'
      }}>
        {!videoPreview && !isRecording && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
              >
                <Upload size={20} />
                Upload Video
              </button>

              <button
                onClick={startRecording}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
                onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
              >
                <Video size={20} />
                Record Video
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            <p style={{ 
              color: '#94a3b8', 
              fontSize: '0.875rem',
              margin: 0
            }}>
              Max file size: 100MB
            </p>
          </div>
        )}

        {isRecording && (
          <div style={{ textAlign: 'center' }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              style={{
                width: '100%',
                maxWidth: '500px',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}
            />
            <button
              onClick={stopRecording}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Stop Recording
            </button>
          </div>
        )}

        {videoPreview && !isRecording && (
          <div style={{ textAlign: 'center' }}>
            <video
              src={videoPreview}
              controls
              style={{
                width: '100%',
                maxWidth: '500px',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: isProcessing ? '#94a3b8' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isProcessing ? 'not-allowed' : 'pointer'
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader size={20} className="spinner" />
                    Processing...
                  </>
                ) : (
                  'Convert to Speech'
                )}
              </button>

              <button
                onClick={() => {
                  setVideoFile(null);
                  setVideoPreview(null);
                  setResult(null);
                  setAudioUrl(null);
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#f1f5f9',
                  color: '#0f172a',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          <XCircle size={20} color="#dc2626" />
          <span style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</span>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <CheckCircle size={24} color="#16a34a" />
            <h3 style={{ 
              margin: 0, 
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#0f172a'
            }}>
              Processing Complete
            </h3>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#64748b',
              marginBottom: '0.25rem',
              fontWeight: '600'
            }}>
              Raw Detection:
            </p>
            <p style={{ 
              fontSize: '1rem', 
              color: '#334155',
              margin: 0,
              fontFamily: 'monospace',
              background: '#ffffff',
              padding: '0.5rem',
              borderRadius: '4px'
            }}>
              {result.detected_text}
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#64748b',
              marginBottom: '0.25rem',
              fontWeight: '600'
            }}>
              Interpreted Text:
            </p>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#0f172a',
              margin: 0,
              fontWeight: '600'
            }}>
              {result.formatted_text}
            </p>
          </div>

          {audioUrl && (
            <button
              onClick={playAudio}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Play size={20} />
              Play Audio
            </button>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}