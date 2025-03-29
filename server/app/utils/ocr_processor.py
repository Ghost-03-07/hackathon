import os
import pytesseract
from PIL import Image
from pdf2image import convert_from_path
from datetime import datetime

class OCRProcessor:
    def __init__(self, upload_folder, output_folder):
        self.upload_folder = upload_folder
        self.output_folder = output_folder
        # Create output folder if it doesn't exist
        os.makedirs(output_folder, exist_ok=True)

    def save_to_text_file(self, text, original_filename):
        """Save extracted text to a file"""
        try:
            # Create a timestamp for unique filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            # Create output filename based on original filename
            base_name = os.path.splitext(original_filename)[0]
            output_filename = f"{base_name}_{timestamp}.txt"
            output_path = os.path.join(self.output_folder, output_filename)
            
            with open(output_path, 'w', encoding='utf-8') as file:
                file.write(text)
            print(f"Text file saved successfully: {output_path}")
            return output_filename
        except Exception as e:
            print(f"Error saving text file: {str(e)}")
            raise Exception(f"Error saving text file: {str(e)}")

    def process_image(self, filename):
        """Process JPG/PNG files"""
        try:
            image_path = os.path.join(self.upload_folder, filename)
            print(f"Processing image: {image_path}")
            
            image = Image.open(image_path)
            text = pytesseract.image_to_string(image)
            # Save extracted text to file
            output_file = self.save_to_text_file(text, filename)
            return text.strip(), output_file
        except Exception as e:
            print(f"Error processing image: {str(e)}")
            return f"Error processing image: {str(e)}", None

    def process_pdf(self, filename):
        """Process PDF files"""
        try:
            pdf_path = os.path.join(self.upload_folder, filename)
            print(f"Processing PDF: {pdf_path}")
            
            images = convert_from_path(pdf_path)
            text_content = []
            
            for page_num, image in enumerate(images, 1):
                print(f"Processing page {page_num}")
                text = pytesseract.image_to_string(image)
                text_content.append(text)
            
            full_text = '\n\n'.join(text_content).strip()
            # Save extracted text to file
            output_file = self.save_to_text_file(full_text, filename)
            return full_text, output_file
        except Exception as e:
            print(f"Error processing PDF: {str(e)}")
            return f"Error processing PDF: {str(e)}", None

    def process_file(self, filename):
        """Main processing function"""
        try:
            file_extension = filename.lower().split('.')[-1]
            print(f"Processing file: {filename} with extension: {file_extension}")
            
            if file_extension in ['jpg', 'jpeg', 'png']:
                return self.process_image(filename)
            elif file_extension == 'pdf':
                return self.process_pdf(filename)
            else:
                print(f"Unsupported file format: {file_extension}")
                return "Unsupported file format", None
        except Exception as e:
            print(f"Error in process_file: {str(e)}")
            return f"Processing error: {str(e)}", None