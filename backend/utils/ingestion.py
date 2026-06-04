import os
from typing import List
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document

def process_pdf(file_path: str) -> List[Document]:
    """
    Loads a PDF file and splits it into pages/chunks using standard PyPDFLoader.
    """
    if not os.path.exists(file_path):
        return []
    try:
        loader = PyPDFLoader(file_path)
        return loader.load()
    except Exception as e:
        print(f"Error processing PDF {file_path}: {str(e)}")
        return []

def process_image(file_path: str, client) -> List[Document]:
    """
    Uses the Google GenAI client to extract structured handwritten or visual text 
    from image notes, wrapping the result inside a LangChain Document structure.
    """
    if not os.path.exists(file_path):
        return []
    try:
        # Prompting Gemini to act as an OCR text extractor
        prompt = "You are an expert OCR engine. Extract all readable text, formulas, headings, and notes from this study image exactly as they appear."
        
        # Uploading the image temporary file path using the GenAI File API
        uploaded_file = client.files.upload(file=file_path)
        
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=[uploaded_file, prompt]
        )
        
        # Clean up the file from Google's servers after processing
        client.files.delete(name=uploaded_file.name)
        
        if response.text:
            return [Document(page_content=response.text, metadata={"source": file_path})]
        return []
    except Exception as e:
        print(f"Error processing image {file_path}: {str(e)}")
        return []