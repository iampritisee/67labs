import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

export default function VoiceClone() {
  const { getAccessTokenSilently } = useAuth0();
  const [files, setFiles] = useState([]);
  const [voiceName, setVoiceName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    try {
      const token = await getAccessTokenSilently();
      const form = new FormData();
      form.append("name", voiceName);
      
      // Append all files with the key "files" to match backend
      files.forEach((file) => {
        form.append("files", file);
      });

      const res = await axios.post("http://127.0.0.1:5000/ivc", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error cloning voice");
    } finally {
      setLoading(false);
    }
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <div>
      <h3>Clone Your Voice</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Voice Name</label>
          <input
            type="text"
            placeholder="Enter a name for your voice"
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Upload Audio Samples (Multiple files supported)</label>
          <div className="file-upload-container">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              required
              id="file-input"
              multiple
              style={{ display: 'none' }}
            />
            <label htmlFor="file-input" className="file-upload-label">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              {files.length > 0 ? `Add More Files (${files.length} selected)` : 'Choose Audio Files'}
            </label>
            
            {files.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>
                  Selected Files ({files.length}) - Total: {(totalSize / 1024 / 1024).toFixed(2)} MB
                </div>
                {files.map((file, index) => (
                  <div 
                    key={index} 
                    className="file-info"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem',
                      padding: '0.5rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                        <polyline points="13 2 13 9 20 9"></polyline>
                      </svg>
                      <span className="file-name" style={{ fontWeight: '500' }}>{file.name}</span>
                      <span className="file-size" style={{ color: 'var(--text-secondary)' }}>
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--bg-tertiary)';
                        e.currentTarget.style.color = '#ef4444';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            color: 'var(--text-primary)'
          }}>
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              required
              style={{
                width: '18px',
                height: '18px',
                cursor: 'pointer'
              }}
            />
            <span>
              I agree to the{' '}
              <a 
                href="/terms" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: 'var(--primary)', 
                  textDecoration: 'underline',
                  fontWeight: '600'
                }}
              >
                Terms and Conditions
              </a>
            </span>
          </label>
        </div>

        <button 
          type="submit" 
          className={`btn btn-primary btn-full ${loading ? 'btn-loading' : ''}`}
          disabled={loading || !agreedToTerms || files.length === 0}
        >
          {loading ? "Uploading..." : "🚀 Upload & Clone Voice"}
        </button>
      </form>

      {result && (
        <div className="result-box">
          <p><strong>✓ Voice cloned successfully!</strong></p>
          {result.message && (
            <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
              {result.message}
            </p>
          )}
          {result.voice && (
            <details style={{ 
              marginTop: '0.75rem',
              padding: '0.5rem',
              background: 'var(--bg-secondary)',
              borderRadius: '6px'
            }}>
              <summary style={{ 
                cursor: 'pointer', 
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                View Voice Details
              </summary>
              <pre style={{ 
                marginTop: '0.5rem',
                padding: '0.75rem',
                background: 'var(--bg-tertiary)',
                borderRadius: '4px',
                fontSize: '0.75rem',
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                {JSON.stringify(result.voice, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}