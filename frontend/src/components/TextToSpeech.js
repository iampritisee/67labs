import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';

export default function TextToSpeech() {
  const { getAccessTokenSilently } = useAuth0();
  const [voiceId, setVoiceId] = useState("");
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

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
      <h3>Text to Speech (6 7 Labs)</h3>
      <textarea
        placeholder="Type something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSpeak} disabled={loading}>
        {loading ? "Generating..." : "Generate Speech"}
      </button>
      {audioUrl && (
        <div style={{ marginTop: 16 }}>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
}
