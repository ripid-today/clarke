---
name: extract-doc
description: Extract text and metadata from documents (PDF, DOCX, PPTX, XLSX, images) using liteparse. CLI tool for manual document processing with support for OCR, page selection, and JSON output.
triggers:
  - "extract text from"
  - "parse document"
  - "extract pdf"
  - "parse docx"
  - "extract content from"
  - "read pdf"
  - "document to text"
version: 1.0.0
---

# extract-doc Skill

Extract text, metadata, and bounding box information from documents. Supports PDF natively, plus Word, PowerPoint, Excel, and images via LibreOffice/ImageMagick conversion.

## Supported Formats

| Format | Support | Notes |
|--------|---------|-------|
| PDF | Native | Best performance, full bounding box data |
| DOCX, DOC | Via LibreOffice | Converted to PDF first |
| PPTX, PPT | Via LibreOffice | Converted to PDF first |
| XLSX, XLS, CSV | Via LibreOffice | Converted to PDF first |
| Images (PNG, JPG, etc.) | Via ImageMagick | OCR available with `--ocr` flag |

## Usage

### Basic Text Extraction

```bash
npx tsx .claude/skills/extract-doc/src/index.ts document.pdf
```

### Save to File

```bash
npx tsx .claude/skills/extract-doc/src/index.ts document.pdf -o output.txt
```

### Extract with OCR (for scanned documents)

```bash
npx tsx .claude/skills/extract-doc/src/index.ts scanned.pdf --ocr
```

### Extract Specific Pages

```bash
npx tsx .claude/skills/extract-doc/src/index.ts document.pdf --pages 1,5,10
```

### Output as JSON (with metadata)

```bash
npx tsx .claude/skills/extract-doc/src/index.ts document.pdf --json
```

### Combined Options

```bash
npx tsx .claude/skills/extract-doc/src/index.ts scanned.pdf --ocr --pages 1-3 --json -o result.json
```

## Output Formats

### Plain Text (default)
Returns the full extracted text as a single string.

### JSON (--json flag)
```json
{
  "text": "Full document text...",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Page 1 text...",
      "boundingBoxes": [
        {
          "text": "word",
          "x": 100,
          "y": 200,
          "width": 50,
          "height": 20
        }
      ]
    }
  ],
  "metadata": {
    "title": "Document Title",
    "author": "Author Name",
    "pageCount": 10
  }
}
```

## Prerequisites

1. **Node.js**: Version 18 or higher
2. **LibreOffice**: Required for DOCX/PPTX/XLSX support
   - Windows: `choco install libreoffice` or download from libreoffice.org
   - macOS: `brew install libreoffice`
   - Linux: `apt install libreoffice`

## Installation

```bash
cd .claude/skills/extract-doc
npm install
```

## API Usage (Programmatic)

```typescript
import { extractDocument } from './src/extract.js';

const result = await extractDocument('document.pdf', {
  ocrEnabled: true,
  pages: [1, 2, 3]
});

console.log(result.text);
```

## Error Handling

Common errors and solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| `LibreOffice not found` | LibreOffice not in PATH | Install LibreOffice and ensure `soffice` is available |
| `File not found` | Incorrect path | Check file path and try absolute path |
| `OCR failed` | ImageMagick not installed | Install ImageMagick for OCR support |
| `Empty output` | Scanned PDF without OCR | Use `--ocr` flag |

## Reference Index

| File | Load When |
|------|-----------|
| `src/extract.ts` | Implementing document extraction in code |
| `src/types.ts` | Need TypeScript interfaces |
