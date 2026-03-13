# Skill Patterns Reference

Five canonical patterns for skill architecture. Use the decision matrix to pick one before writing.

---

## Decision Matrix

Score one point per "yes":

| Question | Yes → Pattern signal |
|----------|----------------------|
| Does it need large reference docs / domain knowledge? | Reference-based |
| Does it transform files or run repeatable operations? | Script-bundled |
| Does it require multiple specialized agent roles? | Agent-orchestrated |
| Is the task simple / single-purpose with no files? | Prompt-only |
| Multiple "yes" above? | Hybrid |

**Tie-breaker:** ask the user — "Should this skill bundle external files, or operate purely from instructions?"

---

## Pattern 1: Prompt-Only

**Use when:** Single-purpose, no external files, fits in ~200 lines.

**Structure:**
```
skill-name/
└── SKILL.md
```

**Frontmatter:**
```yaml
name: skill-name
description: "What it does. When to use it — include specific phrases that should trigger it."
```

**Real example:** `write-prd` — a set of instructions for producing PRDs. No external deps.

**When NOT to use:** If your instructions exceed ~300 lines, split into reference files.

---

## Pattern 2: Reference-Based

**Use when:** Rich domain knowledge that would bloat SKILL.md if inlined (design system docs, API specs, framework guides).

**Structure:**
```
skill-name/
├── SKILL.md           # Workflow + pointers to refs
└── references/
    ├── 01-topic-a.md
    ├── 02-topic-b.md
    └── schemas.md
```

**Key practice — progressive disclosure:**
- SKILL.md tells Claude *when* to read each reference (not "read all references upfront")
- Reference files >300 lines should have a table of contents

**Real example:** `dev-toolkit` — SKILL.md orchestrates the workflow; reference files hold React patterns, API conventions, Firebase schemas.

**Real example (this skill):** `skill-creator` — SKILL.md is ~220 lines; patterns/writing/eval/resources split into `references/`.

---

## Pattern 3: Script-Bundled

**Use when:** Deterministic file operations that would be wasteful to re-derive each time (PDF manipulation, Excel transformation, image resizing).

**Structure:**
```
skill-name/
├── SKILL.md           # Workflow: when to call which script
└── scripts/
    ├── main.py        # Or .sh, .ts — whatever runtime is available
    └── utils.py
```

**Key practice:** Scripts handle the mechanical work; SKILL.md handles user interaction, validation, and error messaging.

**Frontmatter addition:**
```yaml
allowed-tools: Bash, Read, Write
```

**Real example:** `xlsx` — Python script handles workbook manipulation; SKILL.md handles the user-facing workflow.

**Real example:** `pdf` — scripts/ contains PDF manipulation utilities; SKILL.md orchestrates.

---

## Pattern 4: Agent-Orchestrated

**Use when:** The task naturally decomposes into parallel or sequential roles (researcher + writer + reviewer; backend + frontend).

**Structure:**
```
skill-name/
├── SKILL.md           # Orchestration logic
└── agents/
    ├── researcher.md  # Subagent-specific instructions
    ├── writer.md
    └── reviewer.md
```

**Frontmatter:**
```yaml
context: fork          # Run in isolated subagent context
agent: Explore         # Which subagent type (optional override)
```

**Key practice:** SKILL.md defines when to spawn each subagent and how outputs feed forward. Read the relevant `agents/` file just-in-time, not upfront.

**Real example:** `deep-research` — researcher maps sources, writer drafts, critiquer reviews, writer revises.

---

## Pattern 5: Hybrid

**Use when:** Multiple patterns apply — e.g., domain knowledge (Reference-based) + file operations (Script-bundled).

**Structure:**
```
skill-name/
├── SKILL.md
├── references/
│   └── domain-knowledge.md
└── scripts/
    └── transform.py
```

**Key practice:** Don't over-engineer. Only add what's needed. A reference file + one script is a fine hybrid. Four agents + three scripts + reference files is usually over-engineered.

**Real example:** `skill-creator` — references/ for knowledge, scripts/ for eval/packaging, agents/ for specialized grading/comparison.

---

## Pattern Selection Cheat Sheet

| User says... | Pattern |
|-------------|---------|
| "a skill that summarizes Slack threads" | Prompt-only |
| "a skill for writing PRDs in our format" | Prompt-only or Reference-based |
| "a skill that processes Excel files into charts" | Script-bundled |
| "a skill that researches and writes long reports" | Agent-orchestrated |
| "a skill that follows our design system" | Reference-based |
| "a skill that runs tests and files GitHub issues" | Script-bundled or Hybrid |

---

## Anti-Patterns to Avoid

- **God SKILL.md:** 800+ lines trying to cover everything. Split into references/.
- **Premature abstraction:** Three subagents for a task one agent handles fine.
- **Dead scripts:** Bundled scripts that SKILL.md never references.
- **Upfront loading:** "Read all references before starting" — defeats progressive disclosure.
- **Vague descriptions:** "A general-purpose assistant." — won't trigger reliably.
