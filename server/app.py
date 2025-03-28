import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app, resources={r"/upload": {"origins": "http://localhost:1234"}})

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        # Verify file exists in request
        if 'document' not in request.files:
            return jsonify({"error": "No file part"}), 400
            
        file = request.files['document']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Verify document type
        doc_type = request.form.get('type')
        if not doc_type:
            return jsonify({"error": "Document type missing"}), 400

        # Validate file type
        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type"}), 400

        # Secure filename and save
        filename = secure_filename(file.filename)
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(save_path)

        # Debug logging
        print(f"Saved {filename} to {save_path}")

        # Here you would typically add your OCR processing
        # For now returning mock response
        return jsonify({
            "success": True,
            "filename": filename,
            "type": doc_type,
            "text": "Sample OCR text",
            "path": save_path  # Returning path for debugging
        })

    except Exception as e:
        # Log the full error
        print(f"Error processing upload: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)