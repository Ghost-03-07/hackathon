import pytesseract
from PIL import Image
import PyPDF2
import io
import os
from config import Config
import datetime

pytesseract.pytesseract.tesseract_cmd = Config.TESSERACT_CMD

def extract_text_from_image(filepath):
    try:
        with Image.open(filepath) as img:
            text = pytesseract.image_to_string(img)
            return {
                'text': text,
                'metadata': {
                    'type': 'image',
                    'pages': 1,
                    'dimensions': img.size
                }
            }
    except Exception as e:
        raise Exception(f"Image processing failed: {str(e)}")

def extract_text_from_pdf(filepath):
    try:
        text = ""
        with open(filepath, 'rb') as f:
            pdf_reader = PyPDF2.PdfReader(f)
            num_pages = len(pdf_reader.pages)
            
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n\n"
            
            return {
                'text': text.strip(),
                'metadata': {
                    'type': 'pdf',
                    'pages': num_pages
                }
            }
    except Exception as e:
        raise Exception(f"PDF processing failed: {str(e)}")

def process_file(filepath):
    file_ext = filepath.rsplit('.', 1)[1].lower()
    
    if file_ext in ['png', 'jpg', 'jpeg']:
        return extract_text_from_image(filepath)
    elif file_ext == 'pdf':
        return extract_text_from_pdf(filepath)
    else:
        raise Exception("Unsupported file type")