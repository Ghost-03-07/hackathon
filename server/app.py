import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from app.utils.ocr_processor import OCRProcessor

app = Flask(__name__)
CORS(app, resources={r"/upload": {"origins": "http://localhost:1234"}})

UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = os.path.join(UPLOAD_FOLDER, 'ocr_results')
ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'document' not in request.files:
            return jsonify({"error": "No file part"}), 400
        
        file = request.files['document']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        doc_type = request.form.get('type')
        if not doc_type:
            return jsonify({"error": "Document type missing"}), 400

        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type"}), 400

        filename = secure_filename(file.filename)
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(save_path)

        ocr_processor = OCRProcessor(app.config['UPLOAD_FOLDER'], app.config['OUTPUT_FOLDER'])
        extracted_text, output_filename = ocr_processor.process_file(filename)

        if output_filename:
            return jsonify({
                "success": True,
                "filename": filename,
                "type": doc_type,
                "text": extracted_text,
                "text_file": output_filename,
                "download_url": f'/download/{output_filename}'
            })
        else:
            return jsonify({"error": "OCR processing failed"}), 500

    except Exception as e:
        print(f"Error processing upload: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/download/<filename>')
def download_file(filename):
    return send_from_directory(app.config['OUTPUT_FOLDER'], filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
