import os
import uuid
from flask import Flask, request, send_file, jsonify
from werkzeug.utils import secure_filename
from elevenlabs import ElevenLabs
from dotenv import load_dotenv
from pydub import AudioSegment
from contextlib import ExitStack
from flask_cors import CORS
import google.generativeai as genai
import sys
sys.path.append('./model_code')

from inference import FingerspellingInference

# Load .env variables
load_dotenv()

# Get the API keys
ELEVEN_API_KEY = os.getenv("ELEVENLABS_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = ElevenLabs(
    base_url="https://api.elevenlabs.io/",
    api_key=ELEVEN_API_KEY
)

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB

CORS(app, resources={
    r"/tts": {"origins": "http://localhost:3000"}, 
    r"/ivc": {"origins": "http://localhost:3000"},
    r"/fingerspelling-to-speech": {"origins": "http://localhost:3000"}
})

# Config
UPLOAD_FOLDER = "./static/uploads"
VIDEO_FOLDER = "./static/videos"

# Initialize fingerspelling model (LOAD ONCE AT STARTUP)
MODEL_PATH = "./models/MiCT-RANet34-CFSWP.pth"
CHAR_MAPPINGS_PATH = "./processed_data/char_mappings.json"

print("Loading fingerspelling model...")
fingerspelling_model = FingerspellingInference(MODEL_PATH, CHAR_MAPPINGS_PATH)
print("Model loaded successfully!")

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
    

@app.route("/fingerspelling-to-speech", methods=["POST"])
def fingerspelling_to_speech():
    """
    Complete pipeline: Video -> Model -> Gemini -> TTS
    """
    # Check if video file is present
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400
    
    video_file = request.files['video']
    voice_id = request.form.get('voice_id')
    
    if not voice_id:
        return jsonify({"error": "Missing 'voice_id'"}), 400
    
    if video_file.filename == '':
        return jsonify({"error": "No video file selected"}), 400
    
    # Check file size
    video_file.seek(0, os.SEEK_END)
    file_size = video_file.tell()
    video_file.seek(0)
    
    max_size = 100 * 1024 * 1024  # 100 MB
    if file_size > max_size:
        return jsonify({"error": f"File too large. Maximum size is {max_size / (1024*1024)}MB"}), 413
    
    try:
        # Step 1: Save the uploaded video
        os.makedirs(VIDEO_FOLDER, exist_ok=True)
        video_filename = secure_filename(f"{uuid.uuid4().hex}_{video_file.filename}")
        video_path = os.path.join(VIDEO_FOLDER, video_filename)
        video_file.save(video_path)
        
        # Step 2: Process video through your ML model
        print(f"Processing video: {video_filename}")
        detected_text = fingerspelling_model.predict(video_path)
        print(f"Detected text: {detected_text}")
        
        # Step 3: Format detected text with Gemini
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f"""Analyze the provided ASL fingerspelling sequence: {detected_text}. This sequence is based on the inaccurate output of an ASL recognition model. Considering common ASL fingerspelling visual confusions (e.g., S/A/T, C/O, R/U, K/P), identify the most plausible, meaningful English word(s) the sequence could represent. Return only the sentence or word, with absolutely no additional commentary, explanation, or introduction."""
        
        gemini_response = model.generate_content(prompt)
        formatted_text = gemini_response.text.strip()
        
        # Step 4: Generate audio with ElevenLabs
        audio_filename = f"{uuid.uuid4().hex}.mp3"
        audio_filepath = os.path.join("static", "audio", audio_filename)
        os.makedirs(os.path.dirname(audio_filepath), exist_ok=True)

        audio_stream = client.text_to_speech.convert(
            voice_id=voice_id,
            output_format="mp3_44100_128",
            text=formatted_text,
            model_id="eleven_multilingual_v2"
        )

        # Write audio chunks to file
        with open(audio_filepath, "wb") as f:
            for chunk in audio_stream:
                f.write(chunk)
        
        # Clean up video file after processing
        os.remove(video_path)
        
        return jsonify({
            "detected_text": detected_text,
            "formatted_text": formatted_text,
            "audio_filename": audio_filename,
            "audio_url": f"/static/audio/{audio_filename}",
        })
        
    except Exception as e:
        print(f"Error in fingerspelling_to_speech: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify({"error": "File too large. Maximum upload size exceeded."}), 413
    

if __name__ == "__main__":
    app.run(debug=True)