---
name: deep-research
description: "Deep research skill for transforming reference materials into complete educational content. Use when writing masterclass modules, course content, or any structured educational material from source references — trigger phrases include 'write module content', 'research and write articles', and 'create educational content from references'. Follows a 4-step workflow: Research & Map, Write, Critique, Revise. Use even if the user provides an outline rather than references."
user-invokable: false
---

# Deep Research

Transform reference materials + an outline into complete, publication-ready educational content.

## Inputs (provided by the user or calling agent)

| Input | Description |
|-------|-------------|
| **References** | Source material (books, documents, extracted text) |
| **Outline** | Target structure — modules, sub-modules, articles with titles |
| **Scope** | Which module/sub-module to write (e.g., "Module 1: Foundations") |
| **Adjacent scope** | Titles of neighboring modules (to enforce MECE boundaries) |

## Output

Complete markdown articles for every article in the assigned scope, organized by sub-module.

---

## Step 1: Research & Map

Read the references and outline. Build a source map before writing anything.

### Process

1. Read the full outline to understand the complete structure
2. Read the assigned scope's articles — note each article title and its learning intent
3. Read the adjacent scope titles — these define what is OUT of bounds
4. Scan references for content relevant to the assigned scope
5. For each article, list which reference sections/pages will serve as primary sources

### Deliverable

A source map (internal working document, not output to user):

```
Article: "[title]"
  Primary: [Reference name], pages/sections X-Y
  Secondary: [Reference name], section Z
  Adjacent (DO NOT cover): [topics belonging to other modules]
```

### Rules

- Every article must have at least one primary source identified
- Flag any outline article where references provide insufficient coverage
- Note topics that appear in references but belong to adjacent modules — these are exclusions

---

## Step 2: Write First Draft

Write all articles in the assigned scope using the source map.

### Writing Rules

1. **MECE** — Each article covers a distinct, non-overlapping topic. No concept appears in two articles. If a concept bridges articles, define it once and cross-reference.
2. **Source-faithful** — Every claim, framework, and example must come from the references. No external knowledge. No invented examples. If the references don't cover something, note the gap rather than filling it.
3. **Quality keywords only** — Open each article with the substantive content. No "In this article, we will explore..." introductions. No "In conclusion, we have learned..." summaries. No transitional filler between sections.
4. **Define on first use** — Every technical term, acronym, or framework name is defined the first time it appears. Use the definition from the references.
5. **Named frameworks** — When the references describe a model, process, or framework by name, use that name and attribute it (e.g., "BABOK's Business Analysis Core Concept Model (BACCM)").
6. **Concrete examples** — Include examples, scenarios, and case studies from the references. Do not invent hypothetical examples.
7. **Structured headings** — Use H2 for major sections, H3 for subsections. Keep heading hierarchy consistent across all articles.
8. **No length limit** — Write as long as the topic requires. Cover every concept completely. Do not compress, summarize prematurely, or cut important knowledge to meet a word count. Depth and completeness over brevity.

### Article Format

```markdown
# [Article Title]

[Opening paragraph — direct statement of what this article covers and why it matters]

## [First Major Section]

[Content with specific claims, definitions, frameworks from references]

### [Subsection if needed]

[Detailed content]

## [Second Major Section]

[Content]

## Key Takeaways

- [3-5 bullet points summarizing the core concepts]
```

---

## Step 3: Critique

After completing all articles, perform a second-pass review evaluating against 8 criteria.

### Critique Criteria

| # | Criterion | What to Check |
|---|-----------|---------------|
| 1 | **Professionalism** | Tone is authoritative and educational. No casual language, hedging, or filler. Reads like a professional reference, not a blog post. |
| 2 | **Coherence** | Each article flows logically from section to section. Ideas build on each other. No orphaned concepts or abrupt topic shifts. |
| 3 | **Learning Outcomes** | A reader finishing each article can clearly state what they learned. Key takeaways match the article's content. |
| 4 | **MECE Structure** | No concept duplication across articles. No gaps where a topic falls between articles without being covered. Every outline topic is addressed. |
| 5 | **Exam Coverage** | For certification-oriented content: key terms, processes, and frameworks that would appear on an exam are explicitly covered with sufficient depth. |
| 6 | **Keyword Density** | Articles open with substance, not filler. Technical terms are used naturally and consistently. Section headings are descriptive and scannable. |
| 7 | **Source Fidelity** | Every claim traces to reference material. No unsourced assertions. Frameworks and models are attributed correctly. Definitions match the source. |
| 8 | **Completeness** | The assigned scope is fully covered. No outline articles are missing or under-developed. Every concept is explained with sufficient depth — flag any article that feels compressed or rushed. |

### Critique Output Format

For each article, produce:

```
Article: "[title]"
  Overall: PASS / NEEDS REVISION
  Issues:
    - [CRITICAL/MAJOR/MINOR] [Criterion #]: [Specific issue and what to fix]
```

---

## Step 4: Revise

Apply critique findings to produce the final version.

### Revision Process

1. Address all CRITICAL issues first (factual errors, missing content, MECE violations)
2. Address MAJOR issues (coherence problems, weak sections, attribution gaps)
3. Address MINOR issues (wording, formatting, consistency)
4. Re-verify MECE: scan all article titles and headings — confirm no overlaps, no gaps
5. Completeness check: every article fully covers its topic without compression. If any section feels rushed or summarized, expand it.
6. Output the complete revised articles as the final deliverable

### Verification Table (Deliver)

After revisions are complete, produce this verification table before outputting the final content:

| Criterion | Result |
|---|---|
| Total articles | [count] |
| Sub-modules | [count] |
| Total words | [count] |
| Words per article | [min]-[max] (no upper limit — length determined by content) |
| Sources per article | [range] |
| Adjacent module overlap | None / [issues] |
| Bold-opener format | Consistent / [issues] |
| Cross-references | Accurate / [issues] |
| Exam relevance notes | Present in [N] articles |
| Markdown structure | Clean / [issues] |

Only output the final content after this table confirms all rows show no issues.
