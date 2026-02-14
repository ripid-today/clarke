# Knowledge Ingestion Pipeline

## Workflow ID
knowledge-ingestion

## Purpose
Transform user-provided documents into organized, searchable knowledge in Clarke's Library.

## Trigger
User attaches documents and requests analysis/summarization/research.

## Stages

### Stage 1: Research
**Agent:** Researcher

**Skills Used:**
- document-reader
- vector-search
- synthesizer
- citation-formatter

**Input:**
- `documents`: User-provided files/URLs
- `topic`: Main topic or subject area

**Process:**
1. Read and parse documents
2. Query vector DB for existing related content
3. Synthesize new + existing knowledge
4. Create structured summary

**Output:**
- `summary`: Structured knowledge document
- `sources`: Array of source citations
- `suggestedCategory`: Recommended placement

**Dependencies:** None (first stage)

**Timeout:** 5 minutes

---

### Stage 2: Organization
**Agent:** Knowledge Organizer

**Skills Used:**
- taxonomy-manager
- categorizer
- file-operations
- metadata-tagger

**Input:**
- `knowledgeDocument`: ${stages.research.output.summary}
- `sources`: ${stages.research.output.sources}
- `suggestedCategory`: ${stages.research.output.suggestedCategory}

**Process:**
1. Read current library taxonomy
2. Analyze knowledge and relationships
3. Decide placement (new category vs. update existing)
4. Create/update files
5. Update metadata and taxonomy

**Output:**
- `libraryUpdate`: Description of changes made
- `categoryPath`: Path where knowledge was placed
- `filesModified`: List of created/updated files

**Dependencies:** research (must complete first)

**Timeout:** 3 minutes

---

## Success Criteria
- Knowledge properly categorized
- No duplication of existing content
- Metadata complete and accurate
- Library taxonomy remains coherent

## Error Handling
- If research fails: Notify user, provide partial results if any
- If organization fails: Knowledge saved to staging area for manual review
