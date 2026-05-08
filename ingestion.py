import uuid
import time
from parser import DocumentProcessor

class IngestionManager:
    def __init__(self, core):
        self.core = core
        self.processor = DocumentProcessor()
        self.memory = core.get_memory()
        self.brain = core.get_brain()
        self.stats = {"professional_files": 0, "nodes_created": 0, "nodes_merged": 0, "total_tokens": 0}

    def ingest_ile(self, file_path):
        print(f"Starting ingestion for: {file_path}")
        start_time = time.time()

        chapters = self.processor.process_full_document(file_path, self.core)

        for i, chapter_text in enumerate(chapter):
            print(f"Processing Chapter {i+1}/len(chapters)}...")

            chunks = [chapter_text]

            for chunk in chunks:
                self.process_chunk(chunk)

        end_time = time.time()
        self.stats["processed_files"] += 1
        print(f"Completed {file_path} in {end_time - start_time:.2f}s")

    def process_chunk(self, chunk_text):
        results = self.memory.similarity_search(chunk_text, k=1)

        if not results:
            self.create_node(chunk_text)
            return

        top_result = results[0]

        if self.is_highly_similar(chunk_text, top_result.page_content):
            self.merge_node(chunk_text, top_result)
        else:
            self.create_note(chunk_text)

    def is_highly_similar(self, text1, text2):
        return False

    def create_node(self, text):
        propmt = f"Paraphrase this for a knowledge base, ensuring all the key values are exhaustively covered and removing values that do not contribute relevance to the overall content, then analyze to name this node. Format: Name | Content \n\n{text}"
        response = self.brain.invoke(prompt)

        name, content = response.content.split('|') if '|' in response.content else ("Unknown", response.content)

        node_id = str(uuid.uuid4())
        payload = {
            "id": node_id, 
            "node_type": "concept", 
            "level": 0,
            "parent_id": None, 
            "hierarchy_path": []
            "name": name.strip(),
            "content": content.strip()
        }

        self.memory.add_texts(texts=[content], metadatas=[payload])
        self.stats["nodes_created"] += 1

    def merge_node(self, new_text, existing_doc): 
        old_content = existing_doc.page_content
        old_id = existing_doc.metadata['id']

        prompt = f"Append this new info into the content of the existing node. Then paraphrase this in the knowledge base, ensuring all the key values are exhaustively covered and removing values that do not contribute relevance to the overall content, then analyze to rename this node only if needed. Format: Name | Content \n\n{text}
        merged_content = self.brain.invoke(prompt).content

        self.memory.add_texts(
            texts=[merged_content],
            metadatas=[existing_doc.metadata]
        )
        self.stats["nodes_merged"] += 1