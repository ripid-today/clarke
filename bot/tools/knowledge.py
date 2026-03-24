"""
Knowledge base retrieval for Co.
Reads INDEX.md to identify relevant files, then extracts matching sections.
No LLM call — deterministic keyword matching.
"""
import re
from pathlib import Path
from bot import config

# Map from keyword → list of relative file paths (populated from INDEX.md at startup)
_keyword_map: dict[str, list[str]] = {}
_index_loaded = False


def _load_index() -> None:
    global _index_loaded
    if _index_loaded:
        return
    index_path = config.KNOWLEDGE_DIR / "INDEX.md"
    if not index_path.exists():
        return
    content = index_path.read_text(encoding="utf-8")
    # Parse lines like: `- Keyword text: `path/to/file.md``
    for line in content.splitlines():
        match = re.search(r"-\s+(.+?):\s+`([^`]+)`", line)
        if match:
            topic = match.group(1).lower().strip()
            filepath = match.group(2).strip()
            _keyword_map.setdefault(topic, [])
            if filepath not in _keyword_map[topic]:
                _keyword_map[topic].append(filepath)
        # Also parse multi-file entries: `path1.md`, `path2.md`
        elif "`" in line:
            files_in_line = re.findall(r"`([^`]+\.md)`", line)
            # Extract topic from beginning
            topic_match = re.match(r"-\s+(.+?):", line)
            if topic_match and files_in_line:
                topic = topic_match.group(1).lower().strip()
                for f in files_in_line:
                    _keyword_map.setdefault(topic, [])
                    if f not in _keyword_map[topic]:
                        _keyword_map[topic].append(f)
    _index_loaded = True


def _find_relevant_files(query: str) -> list[Path]:
    """Return knowledge file paths most relevant to the query."""
    _load_index()
    query_lower = query.lower()
    matched: dict[str, int] = {}  # filepath → match score

    for topic, files in _keyword_map.items():
        # Check if any word in topic appears in query or vice versa
        topic_words = set(re.findall(r"\w+", topic))
        query_words = set(re.findall(r"\w+", query_lower))
        overlap = topic_words & query_words
        if overlap:
            for f in files:
                matched[f] = matched.get(f, 0) + len(overlap)

    # Fallback: match domain keywords directly
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

    # Sort by score, return top 3 files
    sorted_files = sorted(matched.items(), key=lambda x: x[1], reverse=True)[:3]
    result = []
    for rel_path, _ in sorted_files:
        full_path = config.KNOWLEDGE_DIR / rel_path
        if full_path.exists():
            result.append(full_path)
    return result


def _extract_sections(filepath: Path, query: str, context_lines: int = 30) -> str:
    """Extract sections from a file that are relevant to the query."""
    content = filepath.read_text(encoding="utf-8")
    lines = content.splitlines()
    query_words = set(re.findall(r"\w+", query.lower()))

    # Find matching line indices
    match_indices = set()
    for i, line in enumerate(lines):
        line_words = set(re.findall(r"\w+", line.lower()))
        if query_words & line_words:
            match_indices.add(i)

    if not match_indices:
        # Return first 60 lines as fallback
        return "\n".join(lines[:60])

    # Expand to context window around matches
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


def search_knowledge(query: str, max_chars: int = 8000) -> str:
    """
    Main entry point for Co's knowledge tool.
    Returns relevant knowledge content as a string, capped at max_chars.
    """
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
