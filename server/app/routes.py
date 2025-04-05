from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from pathlib import Path
import os
import json
from datetime import datetime
from config import Config
from app.utils.ocr_processor import OCRProcessor
from app.utils.verification import DocumentVerifier
from app.utils.blockchain import BlockchainService

bp = Blueprint('main', __name__)

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
        # 1. Save and process file
        filename = secure_filename(file.filename)
        filepath = Config.UPLOAD_FOLDER / filename
        file.save(filepath)
        
        # 2. OCR Processing
        ocr_processor = OCRProcessor()
        result = ocr_processor.extract_text(str(filepath))
        if not result or 'text' not in result:
            return jsonify({'error': 'OCR processing failed'}), 500

        # 3. Document Verification
        is_verified, message = DocumentVerifier.verify(result['text'], doc_type)
        if not is_verified:
            return jsonify({'error': message}), 400

        # 4. Create verified record
        record, content_hash = DocumentVerifier.create_verified_record(
            result['text'], doc_type, filename
        )
        verified_filename = f"verified_{content_hash[:8]}.json"
        verified_path = Config.VERIFIED_DOCS_FOLDER / verified_filename
        with open(verified_path, 'w') as f:
            json.dump(record, f, indent=2)

        # 5. Store hash in blockchain
        blockchain = BlockchainService.get_instance()
        blockchain_receipt = blockchain.store_hash(content_hash, doc_type)
        if blockchain_receipt['status'] != 'success':
            return jsonify({
                'error': 'Blockchain storage failed',
                'details': blockchain_receipt
            }), 500

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
        if 'filepath' in locals() and filepath.exists():
            filepath.unlink()