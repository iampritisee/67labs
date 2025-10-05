import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "../api";

export default function VoiceClone() {
  const { getAccessTokenSilently } = useAuth0();
  const [file, setFile] = useState(null);
  const [voiceName, setVoiceName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Voice tag display
  const displayVoiceName = "Cheryl";
  const displayVoiceIcon = "🎤";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const form = new FormData();
      form.append("name", voiceName);
      form.append("file", file);

      const res = await api.post("/elevenlabs/clone", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error cloning voice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Clone Your Voice</h3>
      
      {/* Voice Name Tag */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1.25rem',
        background: '#f1f5f9',
        color: '#0f172a',
        fontSize: '0.875rem',
        fontWeight: '600',
        borderRadius: '20px',
        marginBottom: '1.5rem',
        border: '1px solid #e2e8f0'
      }}>
        <span style={{ fontSize: '1.125rem' }}>{displayVoiceIcon}</span>
        <span>{displayVoiceName}</span>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          
        </div>

        <div className="form-group">
          <label className="form-label">Upload Audio Sample</label>
          <div className="file-upload-container">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              required
              id="file-input"
              style={{ display: 'none' }}
            />
            <label htmlFor="file-input" className="file-upload-label">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              {file ? 'Change File' : 'Choose Audio File'}
            </label>
            {file && (
              <div className="file-info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                <span className="file-name">{file.name}</span>
                <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          className={`btn btn-primary btn-full ${loading ? 'btn-loading' : ''}`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "🚀 Upload & Clone Voice"}
        </button>
      </form>

      {result && (
        <div className="result-box">
          <p><strong>✓ Voice cloned successfully!</strong></p>
          {result.voice_id && (
            <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
              Voice ID: <code style={{ 
                background: 'var(--bg-secondary)', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '4px',
                fontFamily: 'monospace'
              }}>{result.voice_id}</code>
            </p>
          )}
        </div>
      )}
    </div>
  );
}