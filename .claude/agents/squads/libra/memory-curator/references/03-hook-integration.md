# Hook Integration

**Purpose:** Documents the 5-hook memory system that powers Clarke's persistent memory across conversations. Explains what each hook does, when it fires, and how memory-curator's file organization affects hook effectiveness.

---

## 1. Overview: The 5-Hook System

Clarke's memory persistence is implemented through hooks — scripts that fire automatically at specific events in the conversation lifecycle. Memory-curator does not control the hooks directly (they are infrastructure), but memory-curator's file organization decisions directly determine whether the hooks inject useful or noisy context.

| Hook | Trigger | What It Does |
|------|---------|-------------|
| UserPromptSubmit | Every new Clarke prompt | Searches memory for relevant context; injects into conversation |
| Stop | Every conversation turn end | Writes session summary |
| PreCompact | Before context compression | Saves critical context that would be lost |
| SessionStart | Every session start (new, resume, compact) | Loads global project state |
| SubagentStart | Every agent invocation | Injects agent-specific memory |

**Hook implementation location:** `~/.claude/hooks/` (outside the project repository — system-level)

---

## 2. UserPromptSubmit Hook

### 2.1 What It Does

Fires when Clarke submits a new prompt. The hook searches `.claude/agent-memory/` for content relevant to the keywords in the prompt and injects matching content into the conversation context before the model sees the prompt.

**Implementation file:** `~/.claude/hooks/memory_search.py` (system-level)

**Mechanism:**
1. Extract keywords from Clarke's prompt
2. Search MEMORY.md indexes for matching keywords
3. Load the first N lines of matching topic files (to stay within token budget)
4. Inject as system context before Clarke's prompt is processed

### 2.2 Memory-Curator's Role

The search quality depends entirely on how well the MEMORY.md keyword columns are populated.

**High-quality keyword entry:**
```
| `decisions.md` | firebase, admin, sdk, rest, approach, chosen, architecture | Key architectural decisions with rationale |
```
When Clarke asks "why are we using Firebase Admin SDK?", "firebase" and "admin" match → decisions.md loads.

**Low-quality keyword entry:**
```
| `decisions.md` | decisions | Key decisions |
```
Too vague — "decisions" matches nothing specific; the file won't load for most relevant prompts.

**Memory-curator rule:** Keywords must include domain terms, not category terms. "firebase, admin, sdk" (domain) not "decisions, architecture" (category).

### 2.3 Optimization Guidelines

- Keep each topic file focused: a file with mixed topics reduces search relevance
- Limit topic file size: the hook loads N lines; a 500-line file will be truncated before relevant content is reached
- Prefer multiple focused files over one large file: `firebase-decisions.md` + `deployment-decisions.md` > one `decisions.md` with everything

---

## 3. Stop Hook

### 3.1 What It Does

Fires at the end of every conversation turn (when the model stops responding). Writes a session summary to the global `session-summary.md` file capturing what was worked on.

**Implementation file:** `~/.claude/hooks/memory_save.py` (system-level)

**What it writes:**
- Date and session identifier
- Main task or question addressed
- Key decisions made
- Files modified (if any)
- Open items for next session

### 3.2 Memory-Curator's Role

Session-summary.md must follow a consistent format for the SessionStart hook (next session) to load it usefully.

**Format that SessionStart can use:**
```markdown
## [YYYY-MM-DD] Session
Task: [1-sentence description of what was worked on]
Decisions: [bullet list of key decisions]
Files: [list of modified files]
Open: [any unresolved items]
```

**What memory-curator monitors:**
- session-summary.md should not exceed ~50 entries before archiving older sessions
- Archive trigger: when session-summary.md exceeds 100 lines, propose archiving sessions older than 30 days to Clarke

**What memory-curator does NOT do:**
- Does not rewrite session-summary.md entries after the hook writes them
- Does not add analysis or interpretation to session summaries — they are factual records

---

## 4. PreCompact Hook

### 4.1 What It Does

Fires before the conversation context is compressed to save tokens (when context window is filling up). The hook identifies content that should be preserved and writes it to memory files before compression discards it.

**Implementation file:** `~/.claude/hooks/pre_compact.py` (system-level)

**What it targets:**
- Decisions made during the current conversation that are not yet in memory
- Patterns confirmed during the current conversation
- File paths of things created or modified

### 4.2 Memory-Curator's Role

PreCompact can write to memory files before Clarke has approved the content. This is a risk — it can result in speculative or session-specific content ending up in persistent memory.

**Memory-curator's stance on PreCompact-written entries:**
- Treat PreCompact-written entries as PROPOSED, not approved
- When memory-curator audits memory files, flag entries that appear to have been written without explicit Clarke approval
- Pattern for identification: entries that describe in-progress work ("working on", "planning to") are likely PreCompact artifacts
- Propose to Clarke: "This entry appears to have been written automatically during context compression: [entry]. Should it remain in memory?"

**What PreCompact SHOULD write to memory:**
- Confirmed decisions: "Decided: Firebase Admin SDK is canonical approach"
- Confirmed patterns: "Pattern confirmed: always propose memory before writing"
- File paths created: new CLAUDE.md files, reference files (these are useful for SessionStart)

**What PreCompact should NOT write:**
- Current session task details: "Currently building Libra squad"
- Speculative learnings: "May want to add EV% validation later"
- Temporary state: "Waiting for Clarke's approval on proposed pattern"

---

## 5. SessionStart Hook

### 5.1 What It Does

Fires at the beginning of every session — whether starting fresh, resuming from a previous conversation, clearing context, or after a compact operation. Loads global project state to orient the model before Clarke's first message.

**Implementation:** Can be a script at `~/.claude/hooks/session_start.py` OR injected as a system reminder message. Clarke's current setup uses the system reminder approach (content appears as `<system-reminder>` in context).

**What it loads:**
1. `CLAUDE.md` (project root) — always loaded as project instructions
2. `.claude/agent-memory/MEMORY.md` — global memory index
3. Relevant topic files from global memory based on the index

### 5.2 Memory-Curator's Role

SessionStart loads the global MEMORY.md index first. The quality of SessionStart context depends entirely on the MEMORY.md index quality.

**High-quality MEMORY.md (SessionStart loads useful context):**
- Index table with specific keywords per file
- Short summaries that tell the model what's in each file (not just the file's name)
- Files organized by topic (not by date)
- Total size under 200 lines (hook loads the whole file)

**Low-quality MEMORY.md (SessionStart loads noise):**
- Generic keywords ("notes", "misc", "other")
- Vague summaries ("This file has information")
- 200+ lines forcing truncation before all files are indexed
- Old or stale files still indexed (loads outdated context)

**Memory-curator's ongoing responsibility:**
- Monthly review: verify all indexed files are still relevant and non-stale
- After any architectural change: update keywords in MEMORY.md if the change affects what words Clarke uses to reference things
- Before any MEMORY.md reaches 200 lines: proactively propose extraction to Clarke

---

## 6. SubagentStart Hook

### 6.1 What It Does

Fires when a subagent is invoked (via `run_agent`, `Agent` tool, or similar invocation). Injects the specific agent's memory files into the subagent's context before it begins work.

**Implementation file:** `~/.claude/hooks/subagent_inject.py` (system-level)

**What it loads:**
1. The agent's `memory/MEMORY.md` — agent-specific index
2. `memory/patterns.md` — approved patterns for this agent
3. `memory/corrections.md` — confirmed corrections for this agent

**Location requirement:** For SubagentStart to locate an agent's memory, the agent must be at a known path. Clarke's schema:
```
.claude/agents/squads/{squad}/{agent}/memory/
```
If memory is not at this path, the hook cannot find it — SubagentStart injection fails silently.

### 6.2 Memory-Curator's Role

Memory-curator ensures that every agent's memory directory follows the correct path schema so SubagentStart can locate and inject it.

**Path validation checklist:**
- [ ] Memory directory is at `{agent-directory}/memory/` (not `{agent-directory}/memories/` or `{agent-directory}/mem/`)
- [ ] MEMORY.md is named exactly `MEMORY.md` (PascalCase — not `memory.md` or `index.md`)
- [ ] patterns.md and corrections.md are named exactly as specified

**When a new agent is created:**
Memory-curator creates the memory directory immediately as part of new agent setup protocol — never deferred. An agent without a memory directory will have SubagentStart injection fail with no error message.

### 6.3 Token Budget Awareness

SubagentStart injects all three memory files into the subagent's context. If these files are large, they consume the subagent's context budget before it can do work.

**Memory-curator's size targets:**
| File | Target Size | Maximum |
|------|------------|---------|
| MEMORY.md | Under 100 lines | 200 lines |
| patterns.md | Under 100 entries | No hard limit, but >100 triggers topic file extraction |
| corrections.md | Under 50 entries | No hard limit, but >50 triggers topic file extraction |

**Why these targets matter:** A subagent with 300 lines of memory injection + its task context has ~30% less working context for actual analysis. Keep memory files focused and concise.

---

## 7. Hook System Dependency Map

Memory-curator needs to understand how the 5 hooks depend on each other and on memory file organization:

```
SessionStart
  └── loads: global MEMORY.md → global topic files
        └── quality depends on: MEMORY.md keyword density, file organization

UserPromptSubmit
  └── searches: global .claude/agent-memory/
        └── quality depends on: MEMORY.md keyword columns, topic file focus

SubagentStart
  └── loads: {agent}/memory/MEMORY.md + patterns.md + corrections.md
        └── quality depends on: file location correctness, file sizes, keyword quality

Stop
  └── writes: global session-summary.md
        └── format depends on: memory-curator maintaining format standard

PreCompact
  └── writes: any memory file (potentially without approval)
        └── quality depends on: memory-curator auditing for unapproved entries
```

**The critical insight:** Every hook's effectiveness is downstream of memory-curator's file organization decisions. Poor keyword columns → UserPromptSubmit loads wrong files. Wrong file paths → SubagentStart fails silently. Bloated MEMORY.md → SessionStart loads truncated context. Memory-curator is the single point of quality control for the entire hook system.
