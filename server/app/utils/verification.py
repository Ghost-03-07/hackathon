import re
import hashlib
import json
from datetime import datetime
from pathlib import Path
from app.utils.blockchain import BlockchainService

class DocumentVerifier:
    DOCUMENT_RULES = {
        'aadhar': {
            'patterns': [r'\b\d{4}\s\d{4}\s\d{4}\b'],
            'required_fields': ['name', 'dob', 'gender']
        },
        'pan': {
            'patterns': [r'[A-Z]{5}\d{4}[A-Z]{1}'],
            'required_fields': ['name', 'father', 'dob']
        },
        'passport': {
            'patterns': [r'[A-PR-WYa-pr-wy][1-9]\d\s?\d{4}[1-9]'],
            'required_fields': ['name', 'nationality', 'dob']
        }
    }

    @classmethod
    def verify(cls, text, doc_type):
        """Verify document content against rules"""
        rules = cls.DOCUMENT_RULES.get(doc_type.lower())
        if not rules:
            return False, "Invalid document type"
        
        # Check for document number pattern
        if not any(re.search(pattern, text) for pattern in rules['patterns']):
            return False, "Document number not found"
            
        # Check for required fields
        text_lower = text.lower()
        missing_fields = [
            field for field in rules['required_fields'] 
            if field not in text_lower
        ]
        if missing_fields:
            return False, f"Missing fields: {', '.join(missing_fields)}"
            
        return True, "Document verified"

    @classmethod
    def create_verified_record(cls, text, doc_type, original_filename):
        """Create verified document record with hash"""
        content_hash = hashlib.sha256(text.encode()).hexdigest()
        record = {
            'metadata': {
                'document_type': doc_type,
                'original_file': original_filename,
                'verification_time': datetime.utcnow().isoformat(),
                'content_hash': content_hash
            },
            'extracted_text': text
        }
        return record, content_hash

def verify_on_blockchain(content_hash):
    blockchain = BlockchainService.get_instance()
    try:
        result = blockchain.contract.functions.documents(content_hash).call()
        return result[1] > 0  # Returns True if timestamp exists
    except:
        return False