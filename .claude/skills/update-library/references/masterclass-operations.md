# Masterclass Operations Reference

Advanced workflows for creating and managing structured educational content collections (masterclasses) in Clarke's Library. Load this reference when performing masterclass creation, rebuild, or sync operations.

---

## A. What is a Masterclass?

A **Masterclass** is a structured educational content collection organized as a three-level hierarchy in Firebase:

```
Masterclass Folder (root)          → folders collection, parentId: [root-folder-id]
  └─ Module Folders (10-15)        → folders collection, parentId: [masterclass-id]
      └─ Articles (2-5 per module) → articles collection, folderId: [module-slug]
```

**Firebase Schema Mapping:**

| Concept | Collection | Key Fields |
|---------|-----------|------------|
| Masterclass | `folders` | `parentId: [root-id]`, `slug: "business-analysis-masterclass"` |
| Module | `folders` | `parentId: [masterclass-id]`, `path: [masterclass-slug, module-slug]` |
| Article | `articles` | `folderId: [module-slug]`, `folderPath: [masterclass-slug, module-slug]` |
| Search Entry | `search_index` | `articleId`, `title` (lowercase), `description` (lowercase), `folderPath` |

## B. Reading an Outline File

Parse a masterclass outline file to extract module and article structure.

**Pattern Matching:**
```
### Module N: [Module Name]          → /^### Module \d+: (.+)$/
**N.M [Article Title]**             → /^\*\*\d+\.\d+ (.+)\*\*$/
[Description text on next line]     → Article description
```

**Slug Generation:**
```typescript
function slug(title: string): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
```

**Validation:**
- Slugs must match `/^[a-z0-9-]+$/`
- Article descriptions ≤ 200 characters, folder descriptions ≤ 300 characters
- Every module must have at least 1 article
- No duplicate slugs within the same module

## C. Sync to Database

Compare parsed outline against current Firebase state and present a change plan.

**Process:**
1. Fetch current state from Firebase (all module folders + articles)
2. Diff with outline: match by slug (primary) or name similarity (fallback)
3. Classify each item as CREATE, UPDATE, DELETE, or UNCHANGED
4. Present change plan to user

**Confirmation Rules:**
- CREATEs and UPDATEs: auto-proceed
- DELETEs: **always require explicit user confirmation**
- If >20 articles affected: require confirmation for full plan

## D. Content Input Patterns

**Pattern 1: Inline Markdown** — Provide content directly. Best for 1-5 articles.

**Pattern 2: JSON Content File** — Write to `website/scripts/moduleN-content.json`:
```json
{
  "article-slug-one": "## Heading\n\nFull markdown content...",
  "article-slug-two": "## Heading\n\nFull markdown content..."
}
```
Best for 6+ articles per module.

**Pattern 3: Placeholder Content** — For articles without content yet:
```markdown
# [Article Title]
*Content coming soon.*
[Article description from outline]
```

## E. Script Pattern Reference

The proven 5-phase rebuild pattern:

**Phase 1: Clean Folders** — Delete all module folders under masterclass (preserve masterclass folder and root folder).

**Phase 2: Delete Articles and Search Index** — Batch-delete all articles and search_index entries. Commit every 400 operations.

**Phase 3: Create Module Folders** — Create each module as a folder document with explicit ID (using slug as doc ID).

**Phase 4: Create Articles with Content Lookup** — For each article, look up content from JSON file by slug. Fall back to placeholder if not found.

**Phase 5: Update Masterclass Metadata** — Update masterclass folder with total article count.

**Batch Limit:** 400 operations per batch (Firestore allows 500; 400 provides safety margin).

See `firebase-code-templates.md` for full TypeScript code examples of each phase.

## F. Incremental Update Pattern

For updating specific modules/articles without a full rebuild.

**Update Existing Article:**
```typescript
await articleRef.update({
  content: newContent,
  updatedAt: FieldValue.serverTimestamp(),
  metadata: {
    wordCount, readingTime: Math.ceil(wordCount / 200),
    lastModifiedBy: 'claude-agent',
    version: FieldValue.increment(1)
  }
});
```

**Add New Article to Existing Module:**
1. Create article document with `db.collection('articles').doc(articleId).set({...})`
2. Recalculate folder articleCount
3. Update masterclass total articleCount

**Add New Module:**
1. Create module folder document
2. Create articles within the module
3. Update module articleCount
4. Update masterclass total articleCount

## G. Verification

After any masterclass operation:

| Check | Expected |
|-------|----------|
| Module count | Matches outline module count |
| Article count per module | Matches outline article count |
| Total article count | Matches masterclass `articleCount` field |
| Content populated | 1000+ words, not placeholder |
| Descriptions valid | ≤ 200 chars, not empty |
| Slugs valid | Matches `/^[a-z0-9-]+$/` |
| Production URL | Modules and articles render correctly |

## H. End-to-End Workflow

1. **User provides inputs:** NotebookLM source, outline file, intent (create/update/enrich)
2. **Research toolkit creates content:** Parse outline → confidence assessment → query NotebookLM → synthesize into articles → write content files
3. **Update-library pushes to Firebase:** Read outline → read content files → execute rebuild/update script → batch operations
4. **Verify on production:** Run verification → sample content check → visit production URL
5. **Report to user:** Summary of modules/articles created, word counts, production URL, next steps
