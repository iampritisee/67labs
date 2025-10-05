import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';


export default function VoiceClone() {
  const { getAccessTokenSilently } = useAuth0();
  const [files, setFiles] = useState([]);
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

      // Append all selected files
      files.forEach((file) => {
        form.append("files", file);  // backend must accept "files" as array
      });

      const res = await axios.post("http://127.0.0.1:5000/ivc", form, {
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
          <label className="form-label">Upload Audio Samples</label>
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
            required
          />
          {files.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <strong>Selected files ({files.length}):</strong>
              <ul>
                {files.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
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