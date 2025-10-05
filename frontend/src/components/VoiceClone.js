import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "../api";

export default function VoiceClone() {
  const { getAccessTokenSilently } = useAuth0();
  const [file, setFile] = useState(null);
  const [voiceName, setVoiceName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
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
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}