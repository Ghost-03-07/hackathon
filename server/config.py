import os
from dotenv import load_dotenv
from pathlib import Path

basedir = Path(__file__).parent
load_dotenv(basedir / '.env')

class Config:
    # File storage
    UPLOAD_FOLDER = basedir / 'uploads'
    OCR_RESULT_FOLDER = UPLOAD_FOLDER / 'ocr_results'
    VERIFIED_DOCS_FOLDER = basedir / 'verified_docs'
    
    # Document processing
    ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
    
    # OCR
    TESSERACT_CMD = os.getenv('TESSERACT_CMD', '/usr/bin/tesseract')
    
    # Blockchain
    BLOCKCHAIN_PROVIDER = os.getenv('BLOCKCHAIN_PROVIDER')
    CONTRACT_ADDRESS = os.getenv('CONTRACT_ADDRESS')
    WALLET_ADDRESS = os.getenv('WALLET_ADDRESS')
    PRIVATE_KEY = os.getenv('PRIVATE_KEY')
    
    @classmethod
    def init_app(cls, app):
        # Create required directories
        cls.OCR_RESULT_FOLDER.mkdir(parents=True, exist_ok=True)
        cls.VERIFIED_DOCS_FOLDER.mkdir(parents=True, exist_ok=True)