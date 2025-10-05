import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "../api";

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
      const form = new FormData();
      form.append("text", text);
      form.append("voice_id", voiceId);

      const res = await api.post("/elevenlabs/speak", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const url = URL.createObjectURL(res.data);
      setAudioUrl(url);
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
      <input
        placeholder="Voice ID"
        value={voiceId}
        onChange={(e) => setVoiceId(e.target.value)}
      />
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
