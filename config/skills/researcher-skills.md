# Researcher Skills

## document-reader

**Purpose:** Parse and extract content from various document formats.

**Input:**
- File path or URL
- Document type (PDF, MD, DOCX, HTML, etc.)

**Process:**
1. Detect document format
2. Extract text content
3. Preserve structure (headings, lists, code blocks)
4. Extract metadata (author, date, title)

**Output:**
- Structured text content
- Document metadata
- Extracted images/diagrams (if applicable)

**Implementation:** `src/agents/researcher/skills/document-reader.ts`

---

## vector-search

**Purpose:** Query Pinecone vector DB for semantically similar content in library.

**Input:**
- Query text or topic
- Optional: metadata filters (category, tags, date range)
- Top K results (default: 10)

**Process:**
1. Create embedding for query
2. Query Pinecone index
3. Filter by metadata if specified
4. Rank by relevance score
5. Return top K results

**Output:**
- Array of matching documents with:
  - Document ID
  - Content snippet
  - Relevance score
  - Metadata
  - Category path

**Implementation:** `src/agents/researcher/skills/vector-search.ts`

**MCP Tool:** `mcp__library__vector_search`

---

## synthesizer

**Purpose:** Combine multiple sources into coherent, comprehensive summary.

**Input:**
- New document content
- Array of existing library content
- Topic/subject area

**Process:**
1. Identify key concepts from new document
2. Find overlaps with existing content
3. Identify new information
4. Combine into structured summary:
   - What's already in library
   - What's new/updated
   - How it connects to existing knowledge
5. Maintain citations

**Output:**
- Structured knowledge document
- Key insights
- Source citations
- Suggested category/tags

**Implementation:** `src/agents/researcher/skills/synthesizer.ts`

---

## citation-formatter

**Purpose:** Properly cite sources and maintain reference integrity.

**Input:**
- Source information (URL, title, author, date)
- Citation style (APA, MLA, Chicago)

**Process:**
1. Extract source metadata
2. Format according to style guide
3. Create unique citation ID
4. Track citation in document

**Output:**
- Formatted citation
- Citation ID for reference
- Bibliography entry

**Implementation:** `src/agents/researcher/skills/citation-formatter.ts`
