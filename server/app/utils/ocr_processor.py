import pytesseract
from PIL import Image
import PyPDF2
import io

class OCRProcessor:
    @staticmethod
    def extract_text(filepath):
        """Extract text from image or PDF"""
        try:
            if filepath.endswith('.pdf'):
                with open(filepath, 'rb') as f:
                    reader = PyPDF2.PdfReader(f)
                    text = "\n".join([page.extract_text() for page in reader.pages])
            else:
                text = pytesseract.image_to_string(Image.open(filepath))
            return text.strip()
        except Exception as e:
            raise Exception(f"OCR processing failed: {str(e)}")

    @staticmethod
    def save_ocr_result(text, original_filename):
        """Save OCR result to ocr_result folder"""
        output_path = Config.OCR_RESULT_FOLDER / f"{original_filename}.txt"
        with open(output_path, 'w') as f:
            f.write(text)
        return output_path