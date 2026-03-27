"""
Knowledge base retrieval for Cơ.

Retrieval tiers:
  Tier 2 (default): BM25 keyword ranking via rank_bm25
  Tier 3 (fallback): Deterministic keyword matching if rank_bm25 unavailable
  Tier 1 (future): PhoBERT + vector store (not yet implemented)
"""
import re
import logging
from pathlib import Path
from bot import config

log = logging.getLogger(__name__)

# --- BM25 availability detection ---
try:
    from rank_bm25 import BM25Okapi
    _BM25_AVAILABLE = True
except ImportError:
    log.warning(
        "rank_bm25 not installed — falling back to keyword search (Tier 3). "
        "Install with: pip install rank_bm25"
    )
    _BM25_AVAILABLE = False


# --- BM25 index (lazy, module-level cache) ---
_bm25_chunks: list[dict] = []
_bm25_index = None
_bm25_built = False

# --- Lexicon index (lazy) ---
_lexicon_chunks: list[dict] = []
_lexicon_index = None
_lexicon_built = False

# --- Legacy keyword index (Tier 3) ---
_keyword_map: dict[str, list[str]] = {}
_index_loaded = False


def _tokenize(text: str) -> list[str]:
    """Simple whitespace + punctuation tokenizer for BM25."""
    return re.findall(r"\w+", text.lower())


# ── Tier 2: BM25 ──────────────────────────────────────────────────────────────

def _build_bm25_index() -> None:
    """Build BM25 index from all knowledge .md files, chunked on ## headers."""
    global _bm25_chunks, _bm25_index, _bm25_built
    if _bm25_built:
        return

    knowledge_dir = config.KNOWLEDGE_DIR
    md_files = [
        p for p in knowledge_dir.rglob("*.md")
        if p.name != "INDEX.md" and "terminology" not in str(p)
    ]

    chunks = []
    for filepath in sorted(md_files):
        try:
            content = filepath.read_text(encoding="utf-8")
        except Exception:
            continue
        # Split on ## headers (each section becomes a chunk)
        sections = re.split(r"(?=^## )", content, flags=re.MULTILINE)
        for section in sections:
            section = section.strip()
            if len(section) < 30:
                continue
            header_match = re.match(r"^##\s+(.+)", section)
            header = header_match.group(1).strip() if header_match else filepath.stem
            chunks.append({
                "text": section,
                "source": filepath,
                "header": header,
            })

    if not chunks:
        _bm25_built = True
        return

    _bm25_chunks = chunks
    _bm25_index = BM25Okapi([_tokenize(c["text"]) for c in chunks])
    _bm25_built = True


def _build_lexicon_index() -> None:
    """Build BM25 index from the domain terminology lexicon."""
    global _lexicon_chunks, _lexicon_index, _lexicon_built
    if _lexicon_built:
        return

    lexicon_path = config.KNOWLEDGE_DIR / "terminology" / "viet-domain-lexicon.md"
    if not lexicon_path.exists():
        _lexicon_built = True
        return

    try:
        content = lexicon_path.read_text(encoding="utf-8")
    except Exception:
        _lexicon_built = True
        return

    chunks = []
    for line in content.splitlines():
        line = line.strip()
        if (
            line.startswith("|")
            and not line.startswith("| Vietnamese")
            and "---" not in line
            and line.count("|") >= 4
        ):
            chunks.append({"text": line, "source": lexicon_path, "header": "lexicon"})

    if not chunks:
        _lexicon_built = True
        return

    _lexicon_chunks = chunks
    _lexicon_index = BM25Okapi([_tokenize(c["text"]) for c in chunks])
    _lexicon_built = True


def search_lexicon(query: str, top_n: int = 5) -> str:
    """
    Search the domain terminology lexicon for terms relevant to the query.
    Returns a formatted markdown table of matching entries, or empty string.
    """
    if not _BM25_AVAILABLE:
        return ""
    _build_lexicon_index()
    if not _lexicon_chunks or _lexicon_index is None:
        return ""

    tokens = _tokenize(query)
    results = _lexicon_index.get_top_n(tokens, _lexicon_chunks, n=top_n)
    lines = [c["text"] for c in results if c["text"].strip()]
    if not lines:
        return ""

    header = "| Vietnamese | English | Domain | Register Note | Fixed |"
    separator = "|------------|---------|--------|---------------|-------|"
    return "\n".join([header, separator] + lines)


def _bm25_search(query: str, top_n: int = 5) -> list[dict]:
    """Run BM25 retrieval over chunked knowledge files."""
    _build_bm25_index()
    if not _bm25_chunks or _bm25_index is None:
        return []
    tokens = _tokenize(query)
    return _bm25_index.get_top_n(tokens, _bm25_chunks, n=top_n)


# ── Tier 3: Legacy keyword fallback ───────────────────────────────────────────

def _load_index() -> None:
    global _index_loaded
    if _index_loaded:
        return
    index_path = config.KNOWLEDGE_DIR / "INDEX.md"
    if not index_path.exists():
        return
    content = index_path.read_text(encoding="utf-8")
    for line in content.splitlines():
        match = re.search(r"-\s+(.+?):\s+`([^`]+)`", line)
        if match:
            topic = match.group(1).lower().strip()
            filepath = match.group(2).strip()
            _keyword_map.setdefault(topic, [])
            if filepath not in _keyword_map[topic]:
                _keyword_map[topic].append(filepath)
        elif "`" in line:
            files_in_line = re.findall(r"`([^`]+\.md)`", line)
            topic_match = re.match(r"-\s+(.+?):", line)
            if topic_match and files_in_line:
                topic = topic_match.group(1).lower().strip()
                for f in files_in_line:
                    _keyword_map.setdefault(topic, [])
                    if f not in _keyword_map[topic]:
                        _keyword_map[topic].append(f)
    _index_loaded = True


def _find_relevant_files(query: str) -> list[Path]:
    """Tier 3: keyword-based file selection."""
    _load_index()
    query_lower = query.lower()
    matched: dict[str, int] = {}

    for topic, files in _keyword_map.items():
        topic_words = set(re.findall(r"\w+", topic))
        query_words = set(re.findall(r"\w+", query_lower))
        overlap = topic_words & query_words
        if overlap:
            for f in files:
                matched[f] = matched.get(f, 0) + len(overlap)

    domain_keywords = {
        "iching": ["iching/hexagrams-01-32.md", "iching/hexagrams-33-64.md", "iching/methods.md", "iching/trigrams.md"],
        "kinh dịch": ["iching/hexagrams-01-32.md", "iching/hexagrams-33-64.md", "iching/methods.md"],
        "quẻ": ["iching/hexagrams-01-32.md", "iching/hexagrams-33-64.md"],
        "hexagram": ["iching/hexagrams-01-32.md", "iching/hexagrams-33-64.md"],
        "numerology": ["numerology/life-path.md", "numerology/birth-date.md", "numerology/name-numerology.md"],
        "nhân số": ["numerology/life-path.md", "numerology/birth-date.md", "numerology/name-numerology.md"],
        "số học": ["numerology/life-path.md", "numerology/birth-date.md"],
        "life path": ["numerology/life-path.md"],
        "tarot": ["tarot/major-arcana.md", "tarot/minor-arcana.md", "tarot/spreads.md"],
        "bài tarot": ["tarot/major-arcana.md", "tarot/minor-arcana.md"],
        "astrology": ["astrology/fundamentals.md"],
        "chiêm tinh": ["astrology/fundamentals.md"],
        "zodiac": ["astrology/fundamentals.md"],
    }
    for kw, files in domain_keywords.items():
        if kw in query_lower:
            for f in files:
                matched[f] = matched.get(f, 0) + 5

    sorted_files = sorted(matched.items(), key=lambda x: x[1], reverse=True)[:3]
    result = []
    for rel_path, _ in sorted_files:
        full_path = config.KNOWLEDGE_DIR / rel_path
        if full_path.exists():
            result.append(full_path)
    return result


def _extract_sections(filepath: Path, query: str, context_lines: int = 30) -> str:
    """Tier 3: keyword-based section extraction."""
    content = filepath.read_text(encoding="utf-8")
    lines = content.splitlines()
    query_words = set(re.findall(r"\w+", query.lower()))

    match_indices = set()
    for i, line in enumerate(lines):
        line_words = set(re.findall(r"\w+", line.lower()))
        if query_words & line_words:
            match_indices.add(i)

    if not match_indices:
        return "\n".join(lines[:60])

    expanded = set()
    for idx in match_indices:
        for j in range(max(0, idx - 5), min(len(lines), idx + context_lines)):
            expanded.add(j)

    selected = sorted(expanded)
    extracted = []
    prev = -2
    for idx in selected:
        if idx > prev + 1:
            extracted.append(f"\n[... từ {filepath.name} ...]")
        extracted.append(lines[idx])
        prev = idx

    return "\n".join(extracted)


# ── Main entry point ───────────────────────────────────────────────────────────

def search_knowledge(query: str, max_chars: int = 8000) -> str:
    """
    Main entry point for Cơ's knowledge tool.

    Tier 2 (BM25): rank_bm25 available → semantic keyword ranking over chunked files,
                   prepended with a [TERMINOLOGY REFERENCE] block from the domain lexicon.
    Tier 3 (fallback): rank_bm25 not available → legacy keyword + file matching.

    Returns knowledge content capped at max_chars.
    """
    # ── Tier 2: BM25 ──
    if _BM25_AVAILABLE:
        results = _bm25_search(query, top_n=5)
        parts = []
        total_chars = 0

        lexicon_block = search_lexicon(query)
        if lexicon_block:
            section = "[TERMINOLOGY REFERENCE]\n" + lexicon_block
            parts.append(section)
            total_chars += len(section)

        for chunk in results:
            try:
                rel = chunk["source"].relative_to(config.KNOWLEDGE_DIR)
            except ValueError:
                rel = chunk["source"].name
            header = f"\n\n=== {rel} — {chunk['header']} ===\n"
            entry = header + chunk["text"]
            if total_chars + len(entry) > max_chars:
                remaining = max_chars - total_chars
                if remaining > 200:
                    parts.append(entry[:remaining] + "\n[... truncated ...]")
                break
            parts.append(entry)
            total_chars += len(entry)

        if parts:
            return "\n".join(parts).strip()
        return "Không tìm thấy thông tin liên quan trong kho kiến thức."

    # ── Tier 3: Legacy keyword fallback ──
    files = _find_relevant_files(query)
    if not files:
        return "Không tìm thấy thông tin liên quan trong kho kiến thức."

    parts = []
    total_chars = 0
    for filepath in files:
        section = _extract_sections(filepath, query)
        header = f"\n\n=== {filepath.relative_to(config.KNOWLEDGE_DIR)} ===\n"
        chunk = header + section
        if total_chars + len(chunk) > max_chars:
            remaining = max_chars - total_chars
            if remaining > 200:
                parts.append(chunk[:remaining] + "\n[... truncated ...]")
            break
        parts.append(chunk)
        total_chars += len(chunk)

    return "\n".join(parts).strip() if parts else "Không tìm thấy thông tin liên quan."
