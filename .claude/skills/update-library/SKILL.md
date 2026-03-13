---
name: update-library
description: "Library content management toolkit for adding, updating, or removing knowledge articles in Clarke's Library. Use when asked to add/update/remove articles, modules, or content in the knowledge base. Searches existing content, plans changes, and updates Firebase database directly. Use even if the user says 'save this to the library' or 'add this article' without specifying a formal operation."
user-invokable: true
---

# Update Library Skill

Add, update, or remove knowledge articles in Clarke's Knowledge Library with intelligent content analysis and Firebase integration.

---

## When to Use This Skill

**Trigger Phrases:**
- "Add [topic] to the library"
- "Update article about [topic]"
- "Add new module for [subject]"
- "Remove article [name]"
- "Update content in [module/article]"

**Use Cases:**
1. Adding new articles to existing modules/folders
2. Updating existing article content
3. Creating new modules/folders with articles
4. Removing outdated or duplicate content
5. Bulk content operations (migrate, populate, reorganize)

**For masterclass operations** (creating/rebuilding structured educational content), see `references/masterclass-operations.md`.

---

## Required Input Clarification

**CRITICAL: Before proceeding, you MUST have clear answers to:**

### 1. What Content? (Knowledge Input)
- **If adding/updating:** What is the actual content to add?
  - Full article markdown?
  - Topic outline to generate content from?
  - External document/source to import?
  - Bullet points to expand?

### 2. Where to Add? (Location)
- **Module/Folder:** Which folder should contain this content?
  - Existing folder name or ID
  - New folder to create (provide name, description)
- **Article Position:** Where in the module?
  - Specific article to update (by title or ID)
  - New article (provide title)
  - Order/position in module (beginning, end, after article X)

### 3. What Operation? (Action)
- **Add:** Create new article or folder
- **Update:** Modify existing content (replace, append, merge)
- **Remove:** Delete article or folder
- **Replace:** Remove old content and add new content atomically

### Clarification Process

**If any required input is missing or unclear:**

```
Use AskUserQuestion tool with specific options:

Question 1: "What content should I add to the library?"
Options:
- "Full markdown article (I'll provide it)"
- "Generate from topic outline (I'll provide structure)"
- "Import from external document (I'll provide URL/file)"
- "Other (specify)"

Question 2: "Where should this content go?"
Options:
- "Existing module: [Module Name]"
- "New module (I'll provide details)"
- "Replace existing article: [Article Title]"
- "Other (specify location)"
```

**Do NOT proceed until you have:**
- Clear content or content source
- Specific location (folder + article)
- Defined operation (add/update/remove/replace)

**Schema Reference:** See `database-schema.md` rule for Folder/Article collection schemas and validation rules.

---

## Process: Update Library Content

### Step 1: Understand Request

Parse the user's request to identify:
1. **Operation type:** Add, update, remove, or replace
2. **Target:** Folder, article, or bulk operation
3. **Content source:** Direct content, outline, external source, or generation required

### Step 2: Search Existing Content

**Before making any changes, search for existing content:**

- Existing folder with same/similar name
- Existing article with same/similar title
- Related content in the same module
- Duplicate or overlapping topics

### Step 3: Plan Changes

Create explicit change plan based on findings:

**If content exists:**
```
PLAN: Update Existing Article
─────────────────────────────
Existing Article: "[Title]" (ID: [id])
Current Content: [word count] words, status: "[status]"
Folder: [Folder Name] (ID: [folder-id])

Proposed Changes:
├─ [REMOVE/ADD/UPDATE]: [description]
└─ Metadata Updates: wordCount, updatedAt, version

Action: UPDATE (not replace)
```

**If content doesn't exist:**
```
PLAN: Create New Article
────────────────────────
New Article: "[Title]"
Target Folder: [Folder Name] (ID: [folder-id])
Position: [order]
Content: [source/generation plan]
Status: "published"
Action: CREATE
```

### Step 4: Confirm Plan (if major changes)

**Auto-proceed (no confirmation) for:**
- Adding new article to empty folder
- Updating article metadata only (no content change)
- Minor content additions (<100 words)

**Require confirmation for:**
- Replacing entire article content
- Deleting articles or folders
- Bulk operations (>5 articles)
- Changes to featured/published content

### Step 5: Execute Firebase Update

Use Firebase Admin SDK via TypeScript script. For code templates, see `references/firebase-code-templates.md`.

→ See `references/firebase-code-templates.md` for code patterns.

### Step 6: Update Folder Metadata

If article count changed, update parent folder.

→ See `references/firebase-code-templates.md` for folder metadata update patterns.

### Step 7: Verify Changes

**Post-update verification checklist:**
- [ ] Article content updated in Firestore
- [ ] Metadata calculated correctly (wordCount, readingTime)
- [ ] Article status appropriate (draft/published/archived)
- [ ] Folder articleCount updated if needed
- [ ] No Firebase errors in console
- [ ] Content visible on website (if published)

---

## Content Generation Guidelines

**If user provides topic outline instead of full content, generate articles with this structure:**

```markdown
# [Article Title]
## Introduction (2-3 paragraphs)
## Key Concepts (definitions, frameworks)
## Practical Application (step-by-step)
## Examples (2-3 concrete scenarios)
## Common Challenges (3-5 obstacles + solutions)
## Best Practices (industry-standard recommendations)
## Key Takeaways (bullet-point summary)
```

**Quality Standards:**
- **Length:** 400-600 words minimum, 1500-2000 words ideal
- **Tone:** Professional, educational, actionable
- **Format:** Markdown with clear headings, lists, and emphasis
- **Depth:** Practical guidance, not just definitions
- **Citations:** Reference industry frameworks (BABOK, PMI, Agile) when applicable

---

## Safety & Error Handling

**Pre-flight checks:**
- Content input validated (not empty, proper markdown format)
- Target folder/article exists in Firebase
- No duplicate slugs created
- Description within 200 character limit (articles) / 300 chars (folders)
- Slug matches pattern `/^[a-z0-9-]+$/`

**All scripts must be idempotent** (safe to run multiple times):
- Check if article exists before creating
- Use `update()` instead of `set()` when modifying existing
- Batch operations with proper error handling
- Log success/failure for each operation

**Common errors:**
- **"Permission denied"** → Check Firebase Admin SDK credentials in `.env.local`
- **"Document not found"** → Verify article/folder ID exists
- **"Invalid slug format"** → Ensure slug matches `/^[a-z0-9-]+$/`
- **"Description too long"** → Truncate to 200 chars (articles) or 300 chars (folders)

---

## Example: Add New Article

**User Request:** "Add an article about 'Stakeholder Mapping' to the Business Analysis Masterclass"

**Execution Plan:**
```
PLAN: Create New Article
────────────────────────
Article: "Stakeholder Mapping and Analysis"
Folder: Business Analysis Masterclass (ba-masterclass)
Position: After "Requirements Elicitation" (order: 5)
Content: Generate ~1,200 words (Power/Interest Grid, RACI Matrix, Influence Mapping)
Status: "published", Priority: "high"
Action: CREATE article via Firebase Admin SDK
```

After creation, update folder articleCount and verify on website.

---

## Success Criteria

**Operation successful when:**
- Content added/updated in Firebase without errors
- Metadata calculated correctly (wordCount, readingTime)
- Folder articleCount updated if articles added/removed
- Content follows quality standards (structure, length, tone)
- No duplicate articles or folders created
- Changes visible on website (if published status)
- All validation rules satisfied (slug format, character limits)

---

## Reference Index

| File | Contents | Load When |
|---|---|---|
| `references/firebase-code-templates.md` | TypeScript patterns for article update, folder metadata update, and batch operations | Step 5: Execute Firebase Update |
| `references/masterclass-operations.md` | Patterns for creating/rebuilding structured educational content (modules, bulk article creation) | When performing masterclass or course-level operations |
