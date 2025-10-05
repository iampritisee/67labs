import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios"

export default function TextToSpeech() {
  const { getAccessTokenSilently } = useAuth0();
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const voiceId = "voice_cheryl_id";  // Change this to your actual voice ID

  const handleSpeak = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      console.log(text)
      
      const res = await axios.post('http://127.0.0.1:5000/tts', {
        text: text,
        voice_id: "9yaM1hISjlRJmYPNIIsm"  // Hardcoded voice ID
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      // The response contains the filename and URL
      const backendBaseUrl = 'http://127.0.0.1:5000';  // your backend base URL

      const audioUrl = backendBaseUrl + res.data.url;
      setAudioUrl(audioUrl);
    } catch (err) {
      console.error(err);
      alert("Error generating speech");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Text to Speech</h3>

      <div className="form-group">
        <label className="form-label">Your Message</label>
        <textarea
          placeholder="Type the text you want to convert to speech..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <button 
        onClick={handleSpeak} 
        className={`btn btn-primary btn-full ${loading ? 'btn-loading' : ''}`}
        disabled={loading}
      >
        {loading ? "Generating..." : "🔊 Generate Speech"}
      </button>

      {audioUrl && (
        <div className="audio-container">
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
}