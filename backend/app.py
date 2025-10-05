import os
import uuid
from flask import Flask, request, send_file, jsonify
from werkzeug.utils import secure_filename
from elevenlabs import ElevenLabs
from dotenv import load_dotenv
from pydub import AudioSegment
from contextlib import ExitStack
from flask_cors import CORS

# Load .env variables
load_dotenv()

# Get the API key
ELEVEN_API_KEY = os.getenv("ELEVENLABS_API_KEY")

client = ElevenLabs(
    base_url="https://api.elevenlabs.io/",
    api_key=ELEVEN_API_KEY
)


app = Flask(__name__)
CORS(app, resources={r"/tts": {"origins": "http://localhost:3000"}, r"/ivc": {"origins": "http://localhost:3000"}})


# Initialize ElevenLabs client
client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

@app.route("/tts", methods=["POST"])
def tts():
    data = request.json
    text = data.get("text")
    voice_id = data.get("voice_id")

    if not text or not voice_id:
        return jsonify({"error": "Missing 'text' or 'voice_id'"}), 400

    # Generate random filename
    filename = f"{uuid.uuid4().hex}.mp3"
    filepath = os.path.join("static", "audio", filename)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    try:
        # Get audio as generator
        audio_stream = client.text_to_speech.convert(
            voice_id=voice_id,
            output_format="mp3_44100_128",
            text=text,
            model_id="eleven_multilingual_v2"
        )

        # Write chunks to file
        with open(filepath, "wb") as f:
            for chunk in audio_stream:
                f.write(chunk)

        return jsonify({
            "filename": filename,
            "url": f"/static/audio/{filename}"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Config
UPLOAD_FOLDER = "./static/uploads"

@app.route("/ivc", methods=["POST"])
def ivc():
    name = request.form.get("name")
    files = request.files.getlist("files")  # Get multiple files
    
    if not name or not files:
        return jsonify({"error": "Missing 'name' or 'files'"}), 400
    
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    
    try:
        # Save files temporarily and collect file objects
        file_objects = []
        saved_paths = []
        
        for file in files:
            filename = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            saved_paths.append(filepath)
        
        # Open all files for ElevenLabs
        with ExitStack() as stack:
            file_objects = [stack.enter_context(open(path, 'rb')) for path in saved_paths]
            
            # Send to ElevenLabs
            response = client.voices.ivc.create(
                name=name,
                files=file_objects,
                description="Voice cloned from uploaded audio files"
            )
        
        # Optionally delete temp files after cloning
        # for path in saved_paths:
        #     os.remove(path)
        
        return jsonify({
            "message": "Voice cloned successfully",
            "voice": response.dict() if hasattr(response, 'dict') else str(response)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(debug=True)
