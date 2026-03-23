# Skill Architecture Standards

**Purpose:** Defines the structure, content standards, and file conventions for all skills in Clarke's system. Every skill skill-builder creates or modifies must comply with this standard. Read this file before writing any skill.

**Pre-read required:** Before writing any skill, read `.claude/skills/skill-creator/references/02-writing-guide.md` for the canonical internal writing guide. This file extends and applies those standards to Clarke's specific context.

---

## 1. SKILL.md Frontmatter Fields

Every SKILL.md must have a frontmatter block at the top. All fields are required unless marked optional.

```yaml
---
name: kebab-case-skill-name
description: "Full trigger description — see Section 2 for writing rules"
argument-hint: "Optional: how Clarke should invoke this skill (e.g., 'Pass ticker symbol as argument')"
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
disable-model-invocation: false
user-invocable: true
---
```

### 1.1 `name` Field Rules

- kebab-case, all lowercase, no spaces
- Verb-noun structure preferred: `research-news`, `write-prd`, `brief-daily-news`
- Descriptive enough to distinguish from related skills: `fetch-rss-feeds` not `fetch`
- Max 4 words: `research-vietnam-macro` not `research-vietnam-macro-economic-indicators`

**Naming anti-patterns:**
- `news` — too short, not descriptive
- `doNews` — camelCase not allowed
- `THE_DAILY_NEWS_SKILL` — uppercase not allowed
- `skill1` — no meaning

### 1.2 `description` Field Rules (the most important field)

The description determines when the skill triggers. This is covered in depth in Section 2.

### 1.3 `argument-hint` (optional)

Include when the skill is invoked with a parameter (ticker symbol, file path, date). Omit when the skill operates without arguments.

Examples:
- `"Pass the stock ticker as argument: /research-news VIC"`
- `"Pass date as YYYY-MM-DD: /brief-daily-news 2026-03-22"`
- Omit entirely for skills that operate without arguments

### 1.4 `allowed-tools`

List every tool this skill uses. Common combinations:

| Skill Type | Typical Tool Set |
|-----------|-----------------|
| Read-only research | `[Read, Glob, Grep]` |
| File-producing | `[Read, Write, Edit, Glob, Grep]` |
| Pipeline with external calls | `[Read, Write, Edit, Bash, Glob, Grep]` |
| Code generation | `[Read, Write, Edit, Bash, Glob, Grep]` |

**Rule:** Do not include tools the skill doesn't use — unnecessary tool access increases risk surface.

### 1.5 `disable-model-invocation`

Set to `true` ONLY for purely procedural skills that run scripts without LLM reasoning (e.g., a shell script runner). Default is `false` — most skills need LLM reasoning.

### 1.6 `user-invocable`

`true`: Clarke can invoke with `/skill-name` — appears in the skill menu
`false`: Agent-only, not intended for direct user invocation

---

## 2. Description Writing Rules (the trigger is everything)

The `description` field is the most critical part of a SKILL.md. It determines when the skill triggers. A poorly written description causes the skill to either never fire or fire at wrong times.

### 2.1 The Five Rules

**RULE 1: Start with a verb + object capability statement**
- The first clause must state what the skill PRODUCES, not what it helps with
- Good: "Fetches yesterday's RSS news sources and generates 200-300 word investment briefs"
- Bad: "Helps with news and briefing tasks"
- Bad: "A skill for daily news pipeline work"

**RULE 2: Include at least 3 specific trigger phrases**
- Phrases that Clarke would naturally say when she needs this skill
- "Use when:" followed by a comma-separated list of natural language triggers
- Cover synonyms and paraphrases — Clarke doesn't use the same words every time
- Example: "Use when: running the TII daily pipeline, generating news briefs, fetching RSS feeds, starting the morning briefing"

**RULE 3: Include a "use even if" clause**
- Identifies the most common near-miss case where the skill still applies
- Prevents false negatives on slightly imprecise requests
- Example: "Use even if only some RSS sources are available."
- Example: "Use even if the user says 'investment research' instead of 'macro analysis'."

**RULE 4: Include a scope boundary (what this skill does NOT do)**
- Prevents the skill from being overloaded with unrelated responsibilities
- Format: "Does NOT [out-of-scope action] — that is handled by [other skill/agent]."
- Example: "Does NOT publish to Firestore (that's brief-daily-news). Does NOT analyze valuation (that's micro-analyst)."

**RULE 5: Be specific about output format**
- State what the skill produces: file format, location, length, structure
- Avoid vague language ("produces a report" → "produces a 4-section markdown report written to output/{ticker}-synthesis.md")

### 2.2 Template Description

Use this template, filling in the bracketed sections:

```
[VERB] [SPECIFIC OUTPUT] for [DOMAIN/CONTEXT]. Use when: [trigger phrase 1], [trigger phrase 2], [trigger phrase 3]. Use even if [near-miss condition — skill still applies]. Does NOT [out-of-scope action] — that is [other skill]. Produces: [specific output format and location].
```

### 2.3 Good Description Example

```
Fetches yesterday's RSS news sources and generates 200-300 word investment briefs for each story, tagged by sector and market impact. Use when: running the TII daily pipeline, generating news briefs, fetching RSS feeds, starting the morning news process. Use even if only some RSS sources are available — partial results are expected and handled. Does NOT publish to Firestore (that's brief-daily-news). Does NOT analyze individual stocks in depth (that's micro-analyst). Produces: array of brief objects written to daily-news collection in Firestore.
```

### 2.4 Bad Description Examples

| Bad Description | Problem | Fix |
|----------------|---------|-----|
| "Helps with news tasks" | No verb+object; no triggers; no scope | Rewrite with all 5 rules |
| "Use when user asks about news" | No output specified; one vague trigger | Add 3 specific trigger phrases + output format |
| "Fetches RSS and does analysis and writes to Firestore and sends alerts" | Scope too broad — one skill, four responsibilities | Split into focused skills |
| "Research skill for investment work" | No verb+object; no triggers; no scope boundary | Rewrite with all 5 rules |

---

## 3. Progressive Disclosure Structure

Skills must be structured to stay concise at the core level while allowing deep content in references.

### 3.1 Core SKILL.md Size Limit

**Target:** Under 300 lines total (including frontmatter)
**Rationale:** The skill is loaded into context when triggered. A 600-line skill consumes ~15% of the model's context window before work begins.

**What lives in core SKILL.md:**
- Frontmatter
- Identity/purpose (2-3 sentences)
- Main workflow (numbered steps — the essential happy path)
- Output format (exact format of what the skill produces)
- Reference index (table of references and when to load them)

**What does NOT live in core SKILL.md:**
- Edge cases with detailed handling instructions (→ references/)
- Example outputs (→ references/)
- Full validation rules (→ references/)
- Background context or rationale (→ references/)

### 3.2 references/ Directory

Create a `references/` subdirectory when:
- Edge cases need detailed handling (not just a note)
- Examples of correct output need to be shown
- Background knowledge is needed for less common cases

**Reference file naming:** `01-{topic}.md`, `02-{topic}.md` — numbered for loading order

**Loading condition:** Each reference file must have a loading condition in the reference index. The agent loads a reference file only when the condition is met — not by default.

### 3.3 Reference Index Format

At the bottom of the core SKILL.md, include a table:

```markdown
## Reference Index
| File | Load When |
|------|-----------|
| `references/01-edge-cases.md` | RSS source unavailable, dedup collision, empty content |
| `references/02-output-examples.md` | Writing first brief for a new category, output format unclear |
```

---

## 4. Required SKILL.md Sections

In order:

1. **Frontmatter** — all required fields
2. **Identity** — 1-2 sentences: what this skill produces and for what purpose
3. **Trigger Conditions** — specific situations where this skill applies (use the "Use when" list from the description, expanded with context)
4. **Main Workflow** — numbered steps for the essential path; each step has a specific action and expected outcome
5. **Output Format** — exact format of what the skill produces; field names, file paths, schema if applicable
6. **Reference Index** — table of `references/` files and their loading conditions (omit if no references/)

### 4.1 Main Workflow Step Format

Each step must be specific enough to execute without interpretation:

**Good step:**
```
3. For each article, generate a brief:
   - Length: 200-300 words
   - Format: Lead sentence (most important fact), 2-3 body paragraphs (context + implication), 1 closing sentence (investor relevance)
   - Tag: sector (from predefined list), market_impact (high/medium/low)
   - Skip if article body < 50 words (mark as insufficient_content)
```

**Bad step:**
```
3. Generate news briefs from the articles
```

### 4.2 Output Format Section

Must specify:
- For file output: exact file path template, file format (JSON/markdown/etc.)
- For Firestore output: collection name, document structure with field types
- For inline output: markdown structure with labeled sections
- For handoff output: format received by the next agent + handoff_message format

---

## 5. Sources

### Internal Writing Guide (read before any skill work)
- `.claude/skills/skill-creator/references/02-writing-guide.md` — Clarke's internal skill writing standard; this file extends those principles

### Internal Evaluation Guide
- `.claude/skills/skill-creator/references/03-eval-guide.md` — how to evaluate skill quality with test sets

### Skill Creator Skill
- `.claude/skills/skill-creator/SKILL.md` — the meta-skill for creating skills; review its structure as an exemplar

### Prompt Engineering References
- `skill-builder/references/03-prompt-engineering-patterns.md` — patterns for improving skill and reference file quality
- `skill-builder/references/02-skill-quality-evaluation.md` — test methodology for trigger precision
