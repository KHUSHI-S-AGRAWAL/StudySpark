import os
from typing import List
import pypdf  # Fast, native PDF binary parser
from langchain_core.documents import Document

def process_pdf(file_path: str) -> List[Document]:
    """
    Loads a PDF file and splits it into pages/chunks rapidly using native pypdf text streams.
    Implements a page cap safety barrier to prevent Render 502 gateway request timeouts.
    """
    if not os.path.exists(file_path):
        return []
    try:
        documents = []
        with open(file_path, "rb") as f:
            reader = pypdf.PdfReader(f)
            total_pages = len(reader.pages)
            
            # 🛡️ REQUEST TIMEOUT SAFEGUARD:
            # Cap processing to a maximum of 8 pages to guarantee responses stay under 15 seconds.
            max_pages = min(total_pages, 8)
            
            for page_num in range(max_pages):
                page = reader.pages[page_num]
                text = page.extract_text()
                if text and text.strip():
                    # Create standard LangChain Document blocks matching your existing main.py structure
                    documents.append(
                        Document(
                            page_content=text, 
                            metadata={"source": file_path, "page": page_num + 1}
                        )
                    )
                    
        return documents
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
        
        # 🚀 Model parameter updated to use the production-ready gemini-2.5-flash standard keyword argument
        response = client.models.generate_content(
            model="gemini-2.5-flash",
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