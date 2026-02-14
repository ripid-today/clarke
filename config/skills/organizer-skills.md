# Knowledge Organizer Skills

## taxonomy-manager

**Purpose:** Maintain and evolve the library's category structure.

**Input:**
- Current taxonomy structure
- New knowledge topic
- Existing categories

**Process:**
1. Read taxonomy.json
2. Analyze knowledge relationships
3. Evaluate fit with existing categories
4. Decide: use existing category OR create new one
5. Update taxonomy if needed
6. Maintain hierarchy coherence

**Output:**
- Updated taxonomy structure
- Category decision with reasoning
- Hierarchy path

**Implementation:** `src/agents/knowledge-organizer/skills/taxonomy-manager.ts`

**MCP Tool:** `mcp__library__update_taxonomy`

---

## categorizer

**Purpose:** Determine optimal placement for knowledge in library.

**Input:**
- Knowledge document
- Current library structure
- Taxonomy

**Process:**
1. Extract topic, keywords, concepts
2. Compare with existing categories
3. Check for related content
4. Assess placement options:
   - Standalone in existing category
   - New subcategory
   - Merge with existing document
   - New top-level category
5. Select optimal placement

**Output:**
- Category path (e.g., "Technology/AI/Machine-Learning")
- Placement strategy (new file vs. merge)
- Related documents to link

**Implementation:** `src/agents/knowledge-organizer/skills/categorizer.ts`

---

## metadata-tagger

**Purpose:** Create and manage tags, relationships, and metadata.

**Input:**
- Knowledge content
- Category placement
- Existing tags

**Process:**
1. Extract key concepts and terms
2. Identify existing relevant tags
3. Create new tags if needed (avoid duplication)
4. Establish relationships to other documents
5. Add temporal metadata (created, updated)
6. Generate search keywords

**Output:**
- Tag array
- Related document IDs
- Complete metadata object

**Implementation:** `src/agents/knowledge-organizer/skills/metadata-tagger.ts`

---

## file-operations

**Purpose:** Create folders, write files, organize library structure.

**Input:**
- Category path
- Knowledge content
- Metadata
- File operation type (create, update, merge)

**Process:**
1. Verify category path exists (create if needed)
2. Generate appropriate filename
3. Format content as Markdown
4. Write file with frontmatter metadata
5. Update index.json
6. Update category metadata.json

**Output:**
- Created/updated file path
- Success confirmation
- Updated index

**Implementation:** `src/agents/knowledge-organizer/skills/file-operations.ts`

**MCP Tools:**
- `mcp__library__create_category`
- `mcp__library__write_file`
- `mcp__library__update_metadata`
