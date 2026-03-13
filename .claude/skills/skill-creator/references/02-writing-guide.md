# Skill Writing Guide

A reference for drafting high-quality SKILL.md files. Read this when you need guidance on anatomy, frontmatter fields, style, or progressive disclosure.

---

## Anatomy of a SKILL.md

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description required)
│   └── Markdown instructions
└── Bundled Resources (optional)
    ├── scripts/    - Executable code for deterministic/repetitive tasks
    ├── references/ - Docs loaded into context as needed
    └── assets/     - Files used in output (templates, icons, fonts)
```

### Three Loading Levels

1. **Metadata** (name + description) — Always in context (~100 words)
2. **SKILL.md body** — In context whenever skill triggers (<500 lines ideal, ~200-300 lines is best)
3. **Bundled resources** — On-demand (unlimited; scripts can execute without loading)

Keep SKILL.md under 500 lines. When approaching that limit, add an additional layer of hierarchy with clear pointers to where Claude should look next.

---

## Frontmatter Field Guide

**Required fields:**
```yaml
name: skill-id              # kebab-case, matches folder name, max 64 chars
description: "..."          # Triggering mechanism — see "Writing the Description" below
```

**Optional fields:**
```yaml
disable-model-invocation: true  # Only user can invoke (side-effect skills like /deploy, /commit)
user-invocable: false           # Only Claude can invoke; never shown in slash-command menu
argument-hint: [hint-text]      # Shown in autocomplete when user types /skill-name
allowed-tools: Read, Grep       # Grant access without per-use approval when skill is active
context: fork                   # Run in isolated subagent context
agent: Explore                  # Which subagent type to use (requires context: fork)
model: claude-opus-4-6          # Model override for this skill
```

**When to use `disable-model-invocation: true`:**
Side-effect skills that should only run when the user explicitly asks (deployment, messaging, git operations). Prevents accidental auto-invocation.

**When to use `user-invocable: false`:**
Pure reference material that Claude should read but never surface in the slash-command menu (e.g., legacy system context, framework docs).

---

## Writing the Description (Critical)

The description is the **primary triggering mechanism**. Claude decides whether to consult a skill based on this field alone.

**Include both:**
1. What the skill does
2. When to use it (specific phrases + contexts)

**Anti-undertriggering:** Claude tends to "undertrigger" — to not use skills when they'd be helpful. Make descriptions a little bit "pushy":

Bad:
```yaml
description: "How to build dashboards for internal data."
```

Good:
```yaml
description: "Build internal data dashboards with live metrics. Use whenever the user mentions dashboards, data visualization, internal metrics, or wants to display any company data — even if they don't explicitly ask for a 'dashboard'."
```

**Keyword-rich description pattern:**
1. State the core capability (verb + noun)
2. List specific trigger phrases (comma-separated)
3. Add edge cases the skill covers
4. Add a "use even if..." clause for near-misses

---

## Progressive Disclosure in Practice

Reference files should be loaded **just in time**, not upfront.

**Bad pattern:**
```markdown
Before starting, read all files in references/.
```

**Good pattern:**
```markdown
## Step 1: Intake
Gather the 5 required fields (see below).

## Step 2: Pattern Selection
→ If script-based, read `references/01-skill-patterns.md` for the Script-bundled pattern.
→ If domain-heavy, read `references/02-writing-guide.md` for frontmatter options.

## Step 3: Draft
Write the SKILL.md. For eval setup, read `references/03-eval-guide.md`.
```

This keeps context lean. Claude reads only what it needs, when it needs it.

---

## Defining Output Formats

Explicit templates reduce variance and improve consistency:

```markdown
## Output template
ALWAYS use this exact structure:

---
name: [skill-id]
description: "[What it does. When to use it — specific phrases + edge cases.]"
---

# [Skill Title]

[2-sentence overview]

## Step 1: [First step]
...
```

---

## Writing Style Rules

1. **Imperative form** for instructions: "Read the file" not "You should read the file"
2. **Explain the why** — "Keep SKILL.md under 500 lines so it fits in context without eating token budget" beats "SKILL.md must be under 500 lines"
3. **Theory of mind** — Explain *why* things are important so Claude can generalize, not just follow rules mechanically
4. **Avoid MUST/ALWAYS/NEVER** when you can explain the reasoning instead
5. **Draft, then revise** — Write a draft, look at it fresh, improve flow and remove redundancy
6. **No filler sections** — Every section should be load-bearing. Remove sections Claude would skip anyway.

---

## Examples Pattern

When examples help, format them consistently:

```markdown
## Commit message format
**Example 1:**
Input: Added user authentication with JWT tokens
Output: feat(auth): implement JWT-based authentication

**Example 2:**
Input: Fixed crash when file is empty
Output: fix(parser): handle empty file edge case
```

If "Input" and "Output" feel mechanical for your use case, adapt the labels.

---

## Reference Files: When to Create Them

Create a `references/` file when:
- Content exceeds ~100 lines and is domain-specific (not core workflow)
- Content is only needed for a specific branch of the workflow
- Multiple skills could share the reference

Reference files >300 lines should start with a table of contents.

---

## Checklist Before Finalizing

- [ ] SKILL.md under 300 lines (under 500 is acceptable)
- [ ] Description includes what + when + trigger phrases
- [ ] Reference files loaded just-in-time, not upfront
- [ ] Each step explains why (not just what)
- [ ] Output format is explicit (template or example)
- [ ] `disable-model-invocation` set for side-effect skills
- [ ] `user-invocable: false` set for pure reference skills
