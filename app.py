from flask import Flask, abort, request, jsonify
from tempfile import NamedTemporaryFile
import whisper
import torch
import re
# Check if NVIDIA GPU is available
torch.cuda.is_available()
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MODEL = "base"
# Load the Whisper model:
model = whisper.load_model(MODEL, device=DEVICE)

app = Flask(__name__)

@app.route("/")
def hello():
    return "Whisper Hello World!"


@app.route('/whisper', methods=['POST'])
def whisper_handler():
    if not request.files:
        # If the user didn't submit any files, return a 400 (Bad Request) error.
        abort(400)
        
    # Load a different model if provided
    models = ["tiny", "base", "small", "medium", "large"]
    request_model = request.form['model']

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

    # This will be automatically converted to JSON.
    return {'results': results, 'model': model_name}


@app.route('/generatemeta', methods=['POST'])
def generate_meta_handler():
            data = request.json 
            if 'transcript' not in data or 'prompt' not in data:
                abort(400)
            
            # TODO: use the GPT here to receive metadata
            
            # Perform your logic using the JSON data
            transcript = data['transcript']
            prompt = data['prompt']
            response = {'message': 'success', 'transcript': transcript, 'prompt': prompt}
            return jsonify(response)
            

