from core import DeepAgentCore
from ingestion import IngestionManager
import os

def main():
    print("Initializing Deep Agent Core...")
    core = DeepAgentCore()

    manager = IngestionManager(core)

    data_folder = "raw_data"
    if not os.path.exists(data_folder):
        os.makedirs(data_folder)
        print(f"Created {data_folder} folder. Please put your PDFs/MDs there.")
        return

    for filename in os.listdir(data_folder):
        if filename.endswith((".pd", ".md")):
            file_path = os.path.join(data_folder, filename)
            manager.ingest_file(file_path)

    print("\n" + "="*30)
    print("INGESTION REPORT")
    print(f"Files Processed: {manager.stats['processed_files']}")
    print(f"New Concepts: {manager.stats['nodes_created']}"_
    print(f"Merged Concepts: {manager.stats['nodes_merged']}")
    print("="*30)

if __name__ = "__main__":
    main()