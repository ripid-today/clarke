from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from config import Config

class DeepAgentCore:
    def __init__(self):
        self.embeddings = OllamaEmbeddings(model=Config.EMBEDDING_MODEL,base_url=Config.OLLAMA_BASE_URL)
        self.llm = ChatOllama(model=Config.REASONING_MODEL,base_url=Config.OLLAMA_BASE_URL,temperature=0)
        self.client = QdrantClient(url=Config.QDRANT_URL,api_key=Config.QDRANT_API_KEY)
        self.vector_store = QdrantVectorStore(client=self.client,collection_name=Config.COLLECTION_NAME,embedding=self.embeddings)

    def get_brain(self):
        return self.llm

    def get_memory(self):
        return self.vector_store