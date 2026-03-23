# Memory Architecture

**Purpose:** Defines the structure, hierarchy, and file conventions of Clarke's persistent memory system. Every agent that reads or writes memory must follow these standards. Memory-curator enforces them.

---

## 1. The 3-Level Memory Hierarchy

Clarke's memory system has three levels, each scoped to a different granularity of the agent ecosystem.

### 1.1 Global Level — `.claude/agent-memory/`

**Scope:** Cross-squad, project-wide decisions, Clarke's preferences, architectural choices that affect all agents.

**Loaded by:** SessionStart hook — injected at the beginning of every conversation for every agent.

**What lives here:**
- Clarke's workflow preferences (confirmed across 2+ interactions)
- Key architectural decisions with rationale (e.g., "Firebase Admin SDK is canonical — not REST API")
- Project structure facts that all agents need (paths, squad layout, naming conventions)
- Recurring patterns confirmed across multiple squads or sessions

**File structure:**
```
.claude/agent-memory/
  MEMORY.md          ← index file (under 200 lines)
  project-structure.md
  decisions.md
  preferences.md
  runbooks.md
  constraints.md
  session-summary.md
  business-analysis.md
```

**Legacy note:** `.claude/agent-memory/` was created before squad architecture. It remains active and is the canonical global memory location. Do not migrate its content — it is read by SessionStart hooks and moving files would break injection.

### 1.2 Squad Level — `.claude/agents/squads/{squad}/memory/`

**Scope:** Cross-agent patterns within a single squad that are too specific for global memory but too broad for a single agent.

**Status:** CURRENTLY NOT IMPLEMENTED — reserved for future use. Do not create squad-level memory files unless Clarke explicitly instructs it and a clear cross-agent pattern within a squad has emerged. Creating squad-level memory speculatively adds complexity without value.

**When to create:**
- Multiple agents within the same squad are making the same coordination decision repeatedly
- The pattern is specific to the squad's domain (e.g., Scout agents all needing to handle the same Vietnam data source gap)
- The pattern is NOT useful at the global level (other squads don't need it)

### 1.3 Agent Level — `.claude/agents/squads/{squad}/{agent}/memory/`

**Scope:** Individual agent corrections and confirmed patterns specific to one agent's behavior.

**Loaded by:** SubagentStart hook — injected when the specific agent is invoked.

**What lives here:**
- Corrections to this agent's recurring mistakes (confirmed by Clarke)
- Approved analytical patterns specific to this agent's domain
- Edge cases this agent has encountered and handled correctly

**File structure (standard for every agent):**
```
{agent}/memory/
  MEMORY.md          ← index file (under 200 lines)
  patterns.md        ← approved patterns (append-only)
  corrections.md     ← confirmed corrections (append-only, supersede not delete)
```

**Additional topic files** (create only when patterns.md or corrections.md exceed 100 entries, or when a distinct recurring topic needs its own file):
```
{agent}/memory/
  sector-analysis-patterns.md    ← example: micro-analyst accumulates sector-specific patterns
  vietnam-data-corrections.md    ← example: recurring Vietnam-specific data handling
```

---

## 2. MEMORY.md Index Structure

MEMORY.md is an index file only. Memory content lives in topic files. MEMORY.md must stay under 200 lines.

### 2.1 Required Sections

**Header:**
```markdown
# MEMORY — [Agent Name]
```

**Index table:**
```markdown
## Index
| File | Keywords | Summary |
|------|----------|---------|
| `patterns.md` | [comma-separated keywords] | [one-sentence description] |
| `corrections.md` | [comma-separated keywords] | [one-sentence description] |
```

**Keywords:** comma-separated terms likely to appear in a search or prompt when this file is relevant. Think: what words would Clarke say when she needs this information?

**Summary:** One sentence. Describes what the file contains, not what kind of file it is. Bad: "A file containing patterns." Good: "Coordination patterns that resolved complex inter-agent handoffs."

**Key decisions section** (optional — only for agent-level MEMORY.md that benefits from a quick-reference):
```markdown
## Key Decisions
- [One-line summary of most important persistent decision]
- [Another key decision]
```

**Related files section:**
```markdown
## Related Files
- [patterns](./patterns.md)
- [corrections](./corrections.md)
```

### 2.2 Index Overflow Rule

When MEMORY.md approaches 180 lines (20-line buffer before the 200-line limit):
1. Identify the densest section (most index entries for a single topic)
2. Create a new topic file for that content
3. Replace the individual entries in MEMORY.md with a single-line reference: `| [new-file.md] | [keywords] | [summary] |`
4. Move the detailed index entries into the new topic file's own header

---

## 3. File Naming Conventions

### 3.1 Core Files (always present)
- `MEMORY.md` — index (PascalCase by convention, not kebab-case)
- `patterns.md` — approved patterns
- `corrections.md` — confirmed corrections

### 3.2 Additional Topic Files
- Always kebab-case
- Always descriptive of the topic, not the date: `sector-analysis-patterns.md` not `2026-03-patterns.md`
- Noun-first naming: describe what the content IS, not when it was written
- Created organically, not speculatively — create when content exists to fill them

### 3.3 Prohibited File Names
- `session-YYYY-MM-DD.md` — date-based session logs belong in global `session-summary.md`
- `todo.md` or `pending.md` — active tasks belong in Clarke's task tools, not memory files
- `notes.md` — too vague; use a specific topic name
- `temp.md` or `scratch.md` — memory files are permanent, not temporary

---

## 4. Content Standards for patterns.md and corrections.md

### 4.1 patterns.md Format

**Header (keep at top of file):**
```markdown
<!-- Format: [YYYY-MM-DD] Pattern: [description]. Context: [when it applies]. Confidence: [high/medium] -->
```

**Entry format:**
```
[YYYY-MM-DD] Pattern: [description of what works]. Context: [specific situation when this pattern applies]. Confidence: [high/medium]
```

**Example entries:**
```
[2026-03-15] Pattern: When synthesizing 3 Scout outputs, check for fundamental/price divergence before writing Section 1 — it changes the Section 4 contradiction framing. Context: Investment decision workflow synthesis when macro bullish and technical bearish. Confidence: high

[2026-03-18] Pattern: Return incomplete Seer output to Seer (not Clarke) when EV% formula inputs are missing — Seer can self-correct without escalation. Context: Seer delivers conviction score without stating probabilities. Confidence: medium
```

**What makes a good pattern entry:**
- Specific: another agent could follow it without asking questions
- Context-scoped: states WHEN the pattern applies (not "always do X")
- Confirmed: appeared successfully in 2+ interactions before being written to memory

### 4.2 corrections.md Format

**Header (keep at top of file):**
```markdown
<!-- Format: [YYYY-MM-DD] Correction: [what was wrong]. Fix: [what to do instead]. Trigger: [situation that causes this] -->
```

**Entry format:**
```
[YYYY-MM-DD] Correction: [what the agent did wrong]. Fix: [what to do instead]. Trigger: [specific situation that causes this mistake]
```

**Example entries:**
```
[2026-03-12] Correction: Orchestrator attempted to resolve a Seer/Planner standoff by averaging scores instead of presenting both. Fix: Always present both positions with full supporting data; never average or blend. Trigger: Both Seer conviction and Planner risk score are ≥8.

[2026-03-20] Correction: Memory-curator wrote patterns.md entry without Clarke's explicit approval. Fix: Always propose the entry first and wait for "approved", "yes write it", or "save that". Trigger: Conversation end with an implicit learning but no explicit approval signal.
```

### 4.3 Supersession Rules

When a correction is itself corrected (the old correction was wrong):
- Append `[SUPERSEDED by YYYY-MM-DD]` to the end of the old entry
- Add new entry normally at the bottom — include `[SUPERSEDES YYYY-MM-DD entry]` at the end

When a pattern is replaced by a better one:
- Leave old pattern as-is (do not delete)
- Add new entry: `[YYYY-MM-DD] Pattern: [new pattern]. Context: [context]. Confidence: high [SUPERSEDES YYYY-MM-DD entry]`

**Never delete memory entries.** The history of corrections is itself valuable — it shows what failed before and why.

---

## 5. What Should Be Saved vs. NOT Saved

### 5.1 Save to Memory

| Type | Example | Where |
|------|---------|-------|
| User preference confirmed 2+ times | "Clarke always wants commit pushed immediately after bug fix" | Global `preferences.md` |
| Routing decision that worked | "Route P0 API failures to backend-engineer, not quality-engineer" | Agent `patterns.md` |
| Analytical approach that proved accurate | "EV% standoff (Seer 9 + Planner 9) should be presented as-is to Commander, not averaged" | Agent `patterns.md` |
| Confirmed mistake + fix | "Seer output missing EV% inputs — return to Seer, not escalate" | Agent `corrections.md` |
| Architectural decision with rationale | "Firebase Admin SDK not REST API — REST has auth complexity without benefit" | Global `decisions.md` |

### 5.2 Do NOT Save to Memory

| Type | Reason |
|------|--------|
| Code patterns (e.g., React component structure) | Derivable from codebase — reading the code is more reliable than memory |
| Git history (who changed what when) | Use `git log` — memory becomes stale as codebase evolves |
| Current session context | Session-specific; irrelevant next session |
| Content already in CLAUDE.md | Duplicate — CLAUDE.md is always loaded; memory file creates conflict risk |
| Speculation from a single interaction | Needs confirmation in 2+ interactions before memory entry |
| PRD content or specific analysis results | These belong in their own files, not agent memory |
| Session-specific task details | "Working on TII homepage today" — not persistent knowledge |

---

## 6. New Agent Setup Protocol

When a new agent is created, memory-curator sets up its memory directory following this exact sequence:

### Step 1: Create the directory
```
{agent-directory}/memory/
```

### Step 2: Create MEMORY.md with standard header
```markdown
# MEMORY — [Agent Name]

## Index
| File | Keywords | Summary |
|------|----------|---------|
| `patterns.md` | [agent-specific keywords] | Approved patterns confirmed across multiple interactions. |
| `corrections.md` | [agent-specific keywords] | Confirmed corrections to recurring mistakes. |

## Related Files
- [patterns](./patterns.md)
- [corrections](./corrections.md)
```

### Step 3: Create patterns.md
```markdown
<!-- Format: [YYYY-MM-DD] Pattern: [description]. Context: [when it applies]. Confidence: [high/medium] -->

<!-- No entries yet. Entries are added only after Clarke explicitly approves a pattern. -->
```

### Step 4: Create corrections.md
```markdown
<!-- Format: [YYYY-MM-DD] Correction: [what was wrong]. Fix: [what to do instead]. Trigger: [situation that causes this] -->

<!-- No entries yet. Entries are added only after Clarke explicitly approves a correction. -->
```

### What memory-curator does NOT do at setup:
- Does not pre-populate entries — no speculative patterns
- Does not create additional topic files (those emerge organically)
- Does not modify the agent's CLAUDE.md (that's the agent definition, not memory)
