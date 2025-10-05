
import os
import requests
from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv


load_dotenv()
ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")

app = FastAPI()

@app.get("/")
def root():
    return {"message": "6 7 labs backend running"}


# ElevenLabs/Clone Voice
@app.post("/elevenlabs/clone")
async def clone_voice(name: str = Form(...), file: UploadFile = None):
    headers = {"xi-api-key": ELEVEN_API_KEY}
    files = {"files": (file.filename, await file.read(), "audio/mpeg")}
    data = {"name": name}
    response = requests.post(
        "https://api.elevenlabs.io/v1/voices/add",
        headers=headers,
        data=data,
        files=files
    )
    return response.json()


# ElevenLabs/Text-to-Speech
@app.post("/elevenlabs/speak")
async def speak(text: str = Form(...), voice_id: str = Form(...)):
    headers = {
        "xi-api-key": ELEVEN_API_KEY,
        "Accept": "audio/mpeg",
        "Content-Type": "application/json"
    }
    payload = {
        "text": text,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    r = requests.post(url, json=payload, headers=headers)
    return StreamingResponse(r.iter_content(chunk_size=1024), media_type="audio/mpeg")
