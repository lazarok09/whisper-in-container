from flask import Flask, abort, request, jsonify
from tempfile import NamedTemporaryFile
import whisper
import torch
from whisper.utils import get_writer
import base64
import os
# Check if NVIDIA GPU is available
torch.cuda.is_available()
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MODEL = "base"
# Load the Whisper model:
model = whisper.load_model(MODEL, device=DEVICE)


app = Flask(__name__)
# Development mode 
app.run(debug=True)

@app.route("/")
def hello():
    return "Whisper Hello World!"


@app.route('/whisper', methods=['POST'])
def whisper_handler():
    if not request.files:
        # If the user didn't submit any files, return a 400 (Bad Request) error.
       return jsonify({
            'error': 'Invalid request. You need to send a audio file',
        }), 422
    
    # Get the model name from the form data
    models = ["tiny", "base", "small", "medium", "large"]
    request_model = request.form.get('model', '').lower()

    # Check if the model name is empty or not in the available models
    if not request_model or request_model not in models:
        return jsonify({
            'error': 'Invalid or no model name provided in the request.',
            'available_models': models
        }), 422

    
    # Load a different model if provided
    for model_name in models:
        if model_name in request_model:
            model = whisper.load_model(model_name, device=DEVICE)
            break


        
    # For each file, let's store the results in a list of dictionaries.
    results = []

    # Load a different model
    
    
    # Loop over every file that the user submitted.
    for filename, handle in request.files.items():
        # Create a temporary file.
        # The location of the temporary file is available in `temp.name`.
        temp = NamedTemporaryFile()
        # Write the user's uploaded file to the temporary file.
        # The file will get deleted when it drops out of scope.
        handle.save(temp)
        # Let's get the transcript of the temporary file.
        result = model.transcribe(temp.name)
        # Now we can store the result object for this file.
        results.append({
            'filename': filename,
            'transcript': result['text'],
        })
        
        # Subtitles
        
         # Create a permanent VTT file
        vtt_filename = os.path.splitext(filename)[0] + ".vtt"
        vtt_file_path = os.path.join(".", vtt_filename)
         # Create a permanent SRT file
        srt_filename = os.path.splitext(filename)[0] + ".srt"
        srt_file_path = os.path.join(".", srt_filename)

        # Write the .vtt file using srt_writer
        srt_writer = get_writer("vtt", os.path.dirname(vtt_file_path))
        # Write the .vtt file using srt_writer
        srt_writer = get_writer("srt", os.path.dirname(srt_file_path))

        # Write the .srt file using srt_writer
        word_options = {
        "highlight_words": True,
        "max_line_count": 50,
        "max_line_width": 3
        }
        srt_writer(result, vtt_file_path, word_options)
        
        # Convert VTT file to base64 and return
        with open(vtt_file_path, "r", encoding="utf-8") as file:
            subtitle_vtt_converted_into_base64 = base64.b64encode(file.read().encode("utf-8")).decode("utf-8")
            results.append({
            'filename': filename,
            'transcript': result['text'],
            'vtt':subtitle_vtt_converted_into_base64,
            })
        # Convert SRT file to base64 and return
        with open(vtt_file_path, "r", encoding="utf-8") as file:
            subtitle_srt_converted_into_base64 = base64.b64encode(file.read().encode("utf-8")).decode("utf-8")
            results.append({
            'filename': filename,
            'transcript': result['text'],
            'vtt':subtitle_vtt_converted_into_base64,
            'srt': subtitle_srt_converted_into_base64,
            })
    # This will be automatically converted to JSON.
    return {'results': results, 'model': model_name}