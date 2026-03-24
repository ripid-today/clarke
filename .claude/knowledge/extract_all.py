#!/usr/bin/env python3
"""
extract_all.py — Universal text extractor for PDF, EPUB, DOCX
Usage: py -3.13 extract_all.py <source_path> <output_path> [--pages-from N] [--pages-to M]

Notes:
- PDF: uses pdftotext (must be in PATH). Copies source to temp ASCII path to work around
  Unicode filename limitation in mingw64 pdftotext binary.
- EPUB: uses zipfile + BeautifulSoup. Reads OPF spine for correct reading order.
- DOCX: uses zipfile + xml.etree. Extracts paragraphs from word/document.xml.
"""
import sys, os, shutil, tempfile, subprocess, zipfile
import xml.etree.ElementTree as ET
from pathlib import Path


def extract_pdf(src, out, pages_from=None, pages_to=None):
    """Extract text from PDF using pdftotext, with Unicode path workaround."""
    tmp = os.path.join(tempfile.gettempdir(), f'extract_tmp_{os.getpid()}.pdf')
    shutil.copy2(src, tmp)
    try:
        cmd = ['pdftotext', '-enc', 'UTF-8']
        if pages_from:
            cmd += ['-f', str(pages_from)]
        if pages_to:
            cmd += ['-l', str(pages_to)]
        cmd += [tmp, '-']
        result = subprocess.run(cmd, capture_output=True, timeout=300)
        if result.returncode != 0:
            err = result.stderr.decode('utf-8', errors='replace')
            print(f"pdftotext error: {err}", file=sys.stderr)
        text = result.stdout.decode('utf-8', errors='replace')
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)
    Path(out).write_text(text, encoding='utf-8')
    print(f"PDF extracted: {len(text):,} chars -> {out}")


def extract_epub(src, out):
    """Extract text from EPUB using OPF spine order."""
    try:
        from bs4 import BeautifulSoup
    except ImportError:
        print("bs4 not found — install with: py -3.13 -m pip install beautifulsoup4", file=sys.stderr)
        sys.exit(1)

    texts = []
    with zipfile.ZipFile(src) as z:
        # Step 1: Find OPF path from META-INF/container.xml
        try:
            container_xml = z.read('META-INF/container.xml')
            container = ET.fromstring(container_xml)
            opf_path = container.find(
                './/{urn:oasis:names:tc:opendocument:xmlns:container}rootfile'
            ).get('full-path')
        except Exception as e:
            print(f"Warning: Could not parse container.xml ({e}), falling back to manifest scan", file=sys.stderr)
            opf_path = next((n for n in z.namelist() if n.endswith('.opf')), None)
            if not opf_path:
                # Last resort: sort all HTML files
                html_files = sorted(n for n in z.namelist()
                                    if n.endswith(('.xhtml', '.html', '.htm')))
                for hf in html_files:
                    try:
                        content = z.read(hf).decode('utf-8', errors='replace')
                        soup = BeautifulSoup(content, 'html.parser')
                        texts.append(soup.get_text(separator='\n'))
                    except Exception as he:
                        texts.append(f"[Error reading {hf}: {he}]")
                text = '\n\n'.join(texts)
                Path(out).write_text(text, encoding='utf-8')
                print(f"EPUB extracted (fallback): {len(text):,} chars -> {out}")
                return

        # Step 2: Parse OPF for manifest + spine
        opf_dir = str(Path(opf_path).parent)
        opf = ET.fromstring(z.read(opf_path))
        ns = {'opf': 'http://www.idpf.org/2007/opf'}

        manifest = {}
        for item in opf.findall('.//opf:item', ns):
            if item.get('media-type') in ('application/xhtml+xml', 'text/html', 'text/xhtml'):
                manifest[item.get('id')] = item.get('href')

        spine_ids = [ref.get('idref') for ref in opf.findall('.//opf:itemref', ns)]

        # Step 3: Read content in spine order
        for sid in spine_ids:
            if sid not in manifest:
                continue
            href = manifest[sid]
            # Try relative path from OPF dir, then bare href
            candidates = []
            if opf_dir and opf_dir != '.':
                candidates.append((Path(opf_dir) / href).as_posix().lstrip('/'))
            candidates.append(href)

            content = None
            for candidate in candidates:
                if candidate in z.namelist():
                    try:
                        content = z.read(candidate).decode('utf-8', errors='replace')
                        break
                    except Exception:
                        pass

            if content is None:
                texts.append(f"[Could not read spine item: {href}]")
                continue

            try:
                soup = BeautifulSoup(content, 'html.parser')
                texts.append(soup.get_text(separator='\n'))
            except Exception as e:
                texts.append(f"[Parse error in {href}: {e}]")

    text = '\n\n'.join(texts)
    Path(out).write_text(text, encoding='utf-8')
    print(f"EPUB extracted: {len(text):,} chars -> {out}")


def extract_docx(src, out):
    """Extract paragraph text from DOCX word/document.xml."""
    texts = []
    with zipfile.ZipFile(src) as z:
        xml_content = z.read('word/document.xml')

    root = ET.fromstring(xml_content)
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

    for para in root.findall('.//w:p', ns):
        runs = [r.text or '' for r in para.findall('.//w:t', ns)]
        line = ''.join(runs)
        texts.append(line)

    text = '\n'.join(texts)
    Path(out).write_text(text, encoding='utf-8')
    print(f"DOCX extracted: {len(text):,} chars -> {out}")


def main():
    args = sys.argv[1:]

    if len(args) < 2:
        print("Usage: py -3.13 extract_all.py <source_path> <output_path> [--pages-from N] [--pages-to M]",
              file=sys.stderr)
        sys.exit(1)

    src = args[0]
    out = args[1]

    pages_from = None
    pages_to = None
    if '--pages-from' in args:
        idx = args.index('--pages-from')
        pages_from = args[idx + 1]
    if '--pages-to' in args:
        idx = args.index('--pages-to')
        pages_to = args[idx + 1]

    if not os.path.exists(src):
        print(f"Source file not found: {src}", file=sys.stderr)
        sys.exit(1)

    # Ensure output directory exists
    Path(out).parent.mkdir(parents=True, exist_ok=True)

    ext = Path(src).suffix.lower()
    if ext == '.pdf':
        extract_pdf(src, out, pages_from, pages_to)
    elif ext == '.epub':
        extract_epub(src, out)
    elif ext == '.docx':
        extract_docx(src, out)
    else:
        print(f"Unsupported file type: {ext}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
