import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

# Initialize the client
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

try:
    # UPDATED: Using the 'preview' alias which is the standard for Gemini 3 Flash
    response = client.models.generate_content(
        model="gemini-3-flash-preview", 
        contents="Hello! Confirming the connection for the DecodeX hackathon."
    )
    print("✅ Success! Gemini replied:")
    print(response.text)
except Exception as e:
    print(f"❌ Connection failed: {e}")