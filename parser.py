import os
import re
from markitdown import MarkItDown

class DocumentProcessor:
    def __init__(self):
        self.md_converter = MarkItDown()

def audit_document_structure(self, text, core):
    brain = core.get_brain()
    sample = text

    prompt = (
        f"Analyze the following document start: \n\n{sample}\n\n"
        f"Is this document a multi-chapter textbook/book or a single-article/essay? Recognize by the header with the chapter number. You only need to read the text until you've identified the chapter number."
        f"Respond ONLY with one of these two words: 'MULTIPLE' or 'SINGLE'."
    )

    response = brain.invoke(prompt)
    return response.content.strip().upper()

def identify_chapter_markers(self, text, core):
    brain = core.get_brain()
    sample = text
    prompt = (
        f"Identify if the text starts with unnecessary noise (Forewords, Preface, a long Table of Contents), then ignore these content in your output."
        f"Analyze this markdown text:\n\n{sample}\n\n"
        f"Identify every chapter heading in this document. Then format your response as a list of EXACT phrases that start each chapter (e.g., '# Chapter 1: Introduction'), one phrase per line, with no numbers or bullets.\n"

    response = brain.invoke(prompt)
    markers = [line.strip() for line in response.content.split('\n') if line.strip()]
    return markers

def process_full_document(self, file_path, core):
    result = self.md_converter.convert(file_path)
    raw_text = result.text

    structure = self.audit_document_structure(raw_text, core)

    if "SINGLE" in structure:
        print("Document identified as a single article. Skipping chapter split.")
    
    if "MULTIPLE" in structure:
        print("Document identified as multi-chapter. Splitting chapters...")
        markers = self.identify_chapter_markers(raw_text, core)

        if not markers:
            print("No clear markers found, treating as single document.")
            return [raw_text]

        chapters = []
        current_pos = raw_text.find(markers[0])

        for i in range(len(markers)):
            start_marker = markers[i]
            start_idx = raw_text.find(start_marker)

            if i + 1 < len(markers):
                next_marker = markers[i+1]
                end_idx = raw_text.find(next_marker)
            else:
                end_idx = len(raw_text)

            chapters.append(raw_text[start_idx:end_idx].strip())

        return chapters