---
name: organizer-toolkit
description: "Knowledge organization toolkit providing content categorization, taxonomy management, metadata tagging, and file operations for Clarke's Knowledge Library. Use when organizing, categorizing, or filing knowledge content, managing library structure, or updating metadata and tags — trigger phrases include 'categorize this article', 'organize library content', 'add tags to...', and 'where should X go'. Use even if the user only mentions 'filing' or 'sorting' without specifying a formal organization task."
user-invokable: false
---

# Organizer Toolkit

Structure and categorize knowledge in Clarke's Library with integrity. Every step enforces MECE placement, consistent metadata, and a taxonomy that stays clean as the library grows.

---

## Step 1: Categorize Content

Determine optimal placement for new knowledge before creating or moving anything.

### Process

1. Extract topic, keywords, and key concepts from the document
2. Compare with existing categories using Glob and Grep
3. Check for related content (potential duplicates or merge candidates)
4. Assess placement options:
   - Standalone in existing category (most common)
   - New subcategory (when topic is distinct enough)
   - Merge with existing document (when content overlaps significantly)
   - New top-level category (rare, requires approval)
5. Select optimal placement and justify

### Output

- Category path (e.g., "Business/Strategy/Competitive-Analysis")
- Placement strategy (new file, merge, or subcategory)
- Related documents to link
- Justification for placement decision

---

## Step 2: Manage Taxonomy

Maintain and evolve the library's category structure — only propose changes when existing categories genuinely don't fit.

### Process

1. Read current taxonomy structure (folder hierarchy + any taxonomy config files)
2. Analyze knowledge relationships for the new content
3. Evaluate fit with existing categories
4. Decide: use existing category OR propose new one
5. If proposing new category: require Clarke's approval before creating
6. Update taxonomy structure, maintaining hierarchy coherence

### Top-Level Architecture (MECE)

```
Clarke's Knowledge Library
├── Business                    (HOW to do business)
├── Economics & Finance         (HOW value works)
├── Sciences                    (HOW the world works)
├── Philosophy & Humanities     (HOW to think)
└── Industry Knowledge          (WHERE you apply it)
```

### Rules

- Categories must be MECE (mutually exclusive, collectively exhaustive)
- Max 3 levels of nesting before splitting
- Each category must have a clear, distinct scope

---

## Step 3: Tag Metadata

Create and manage tags, relationships, and metadata for library content.

### Metadata Block Format

Apply this metadata block at the top of each knowledge page:

```
Status: [Not Started | Building | Review | Complete]
Priority: [High | Medium | Low]
Keywords: [comma-separated terms]
Last Updated: [YYYY-MM-DD]
Source: [book | experience | research | synthesis]
```

### Process

1. Extract key concepts and terms from content
2. Identify existing relevant tags (reuse before creating new ones)
3. Create new tags only if no existing tag fits
4. Establish relationships to other documents (links, see-also)
5. Add temporal metadata (created date, last updated)
6. Generate search keywords

### Rules

- Reuse existing tags before creating new ones
- Max 10 tags per document
- Tags should be specific enough to be useful for filtering

---

## Step 4: File Operations

For library file operations (creating folders/articles in Firebase), use the `/update-library` skill.

### Naming Rules

- Slugs: lowercase with hyphens (no spaces, no underscores)
- Descriptive but concise (max 50 characters)
- Folder names: title case ("Business Analysis")
- Article titles: title case ("What is Business Analysis")
