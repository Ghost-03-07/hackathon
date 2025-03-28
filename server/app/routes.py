from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app.utils.ocr_processor import process_file
import os
from config import Config

bp = Blueprint('main', __name__)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

@bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        try:
            result = process_file(filepath)
            return jsonify({
                'success': True,
                'filename': filename,
                'text': result['text'],
                'metadata': result['metadata']
            })
        except Exception as e:
            return jsonify({
                'error': f'OCR processing failed: {str(e)}'
            }), 500
        finally:
            # Clean up - remove the uploaded file after processing
            if os.path.exists(filepath):
                os.remove(filepath)
    
    return jsonify({'error': 'File type not allowed'}), 400

@bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})