from flask import Flask, request, jsonify, send_from_directory, Blueprint
from flask_cors import CORS
from werkzeug.utils import secure_filename
from pathlib import Path
import os
import json
import hashlib
from datetime import datetime
from config import Config
from app.routes import bp as main_bp
from app.utils.ocr_processor import OCRProcessor
from app.utils.verification import DocumentVerifier
from app.utils.blockchain import BlockchainService

bp = Blueprint('main', __name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

@bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    doc_type = request.form.get('type')
    if not doc_type:
        return jsonify({'error': 'Document type missing'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400

    try:
        filename = secure_filename(file.filename)
        filepath = Config.UPLOAD_FOLDER / filename
        file.save(filepath)
        
        # OCR Processing
        ocr_text = OCRProcessor.extract_text(str(filepath))
        result = {'text': ocr_text}  # Ensuring compatibility with existing code

        if not result or 'text' not in result:
            return jsonify({'error': 'OCR processing failed'}), 500

        # Document Verification
        is_verified, message = DocumentVerifier.verify(result['text'], doc_type)
        if not is_verified:
            return jsonify({'error': message}), 400

        # Create Verified Record
        content_hash = hashlib.sha256(result['text'].encode()).hexdigest()
        verified_filename = f"verified_{content_hash[:8]}.json"
        verified_path = Config.VERIFIED_DOCS_FOLDER / verified_filename
        
        record = {
            'metadata': {
                'document_type': doc_type,
                'original_file': filename,
                'verification_time': datetime.utcnow().isoformat(),
                'content_hash': content_hash
            },
            'extracted_text': result['text']
        }
        
        with open(verified_path, 'w') as f:
            json.dump(record, f, indent=2)

        # Store hash in blockchain
        blockchain = BlockchainService.get_instance()
        blockchain_receipt = blockchain.store_hash(content_hash, doc_type)
        
        if blockchain_receipt['status'] != 'success':
            return jsonify({'error': 'Blockchain storage failed', 'details': blockchain_receipt}), 500

        return jsonify({
            'success': True,
            'filename': filename,
            'document_type': doc_type,
            'verification': message,
            'content_hash': content_hash,
            'blockchain_receipt': blockchain_receipt,
            'verified_path': str(verified_path)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    finally:
        if filepath.exists():
            filepath.unlink()

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "http://localhost:1234"}})
    app.config.from_object(Config)
    Config.init_app(app)

    app.register_blueprint(main_bp)

    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)