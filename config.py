import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

class Config:
    # Using only spaces for indentation to prevent TabError
    QDRANT_URL = os.getenv("QDRANT_URL")
    QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
    OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL")
    OLLAMA_API_KEY = os.getenv("OLLAMA_API_KEY")
    EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL")
    REASONING_MODEL = os.getenv("REASONING_MODEL")
    COLLECTION_NAME = "knowledge_base"
