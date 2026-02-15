---
name: research-toolkit
description: "Research toolkit providing document reading, content search, knowledge synthesis, and citation formatting capabilities. Use when reading and analyzing documents, searching for related content, synthesizing multiple sources into knowledge summaries, or formatting citations and references."
user-invokable: false
---

# Research Toolkit

## Document Reader

Parse and extract content from various document formats.

### Supported Formats

- Markdown (.md, .mdx)
- PDF (.pdf) - use Read tool with pages parameter for large files
- Plain text (.txt)
- HTML - use WebFetch for URLs
- JSON/YAML - structured data extraction

### Process

1. Detect document format from extension or content
2. Extract text content preserving structure (headings, lists, code blocks)
3. Extract metadata when available (title, author, date, source)
4. For large documents (>100 pages): process in chunks, summarize each chunk

### Output

- Structured text content with hierarchy preserved
- Document metadata (title, author, date, source URL)
- Word count and structural overview

## Vector Search

Search existing library content for semantically related knowledge.

> Note: Pinecone vector DB integration is planned but not yet configured.
> Until then, use Glob and Grep as fallback search methods.

### Fallback Search Strategy

1. **Keyword search**: Use Grep to find exact term matches across library
2. **File pattern search**: Use Glob to find files by topic in category folders
3. **Fuzzy matching**: Search for synonyms and related terms
4. **Category browsing**: Navigate taxonomy structure to find related content

### Search Patterns

```
# Search by keyword across all library content
Grep pattern="[keyword]" path="[library-root]" glob="*.md"

# Search by category
Glob pattern="[category]/**/*.md" path="[library-root]"

# Search metadata blocks for tags
Grep pattern="Keywords:.*[term]" path="[library-root]" glob="*.md"
```

### Output

- Matching documents with file paths
- Relevant content snippets
- Category location for each match

## Synthesizer

Combine multiple sources into a coherent, comprehensive knowledge summary.

### Process

1. Identify key concepts from the new document
2. Find overlaps with existing library content (using search skills above)
3. Identify genuinely new information not yet in library
4. Structure the synthesis:
   - **Already Known**: What the library already covers on this topic
   - **New Insights**: What the new source adds
   - **Updated Understanding**: Where existing knowledge needs revision
   - **Connections**: How this links to other library topics
5. Maintain citations throughout

### Synthesis Quality Criteria

- Every claim traces to a source
- Distinguish facts from interpretations from opinions
- Preserve nuance - do not oversimplify
- Note confidence level for synthesized conclusions
- Flag contradictions between sources explicitly

### Output

- Structured knowledge document (see researcher agent output format)
- Clearly labeled sections for existing vs new knowledge
- Numbered source citations

## Citation Formatter

Format and maintain source citations consistently.

### Citation Format

Use numbered references in text with a bibliography at the end:

**In-text:** "According to [1], competitive advantage requires..."

**Bibliography entry:**
```
[1] Author Last, First. "Title." Source/Publisher, Date. URL (if applicable).
```

### Process

1. Extract source metadata (author, title, date, URL, publisher)
2. Assign sequential citation number
3. Format bibliography entry
4. Insert in-text reference markers

### Rules

- Every factual claim must have a citation
- URLs must be included for web sources
- Access date required for web sources
- If author unknown, use organization name or "Unknown"
- If date unknown, use "n.d."
