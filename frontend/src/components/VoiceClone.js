import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "../api";

export default function VoiceClone() {
  const { getAccessTokenSilently } = useAuth0();
  const [file, setFile] = useState(null);
  const [voiceName, setVoiceName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
          disabled={loading || !agreedToTerms}
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