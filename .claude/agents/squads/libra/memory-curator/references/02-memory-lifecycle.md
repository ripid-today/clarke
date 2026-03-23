# Memory Lifecycle

**Purpose:** Defines when memory entries are written, how they are updated, when they are archived, and what the approval flow looks like. Covers the full lifecycle from "something happened in a conversation" to "persistent knowledge in a memory file."

---

## 1. Write Triggers and Approval Requirements

Memory is never written speculatively. Every write has a trigger event and requires explicit Clarke approval. This section defines both.

### 1.1 patterns.md Write Triggers

A pattern entry is written when:

1. **Repetition confirmed:** An agent approach was used successfully 2+ times without Clarke correcting it
2. **Clarke's instruction:** Clarke explicitly says "remember that", "save that", "always do X when Y"
3. **Orchestrator proposal accepted:** Orchestrator proposes a pattern after observing success; Clarke says "approved" or equivalent

**Who proposes:** Orchestrator identifies the pattern and proposes the entry in the correct format to Clarke.
**Who writes:** Memory-curator writes the entry after Clarke's approval.
**Who initiates:** Any agent can notice a pattern and tell orchestrator; orchestrator structures the proposal.

### 1.2 corrections.md Write Triggers

A correction entry is written when:

1. **Explicit correction:** User corrects an agent's output directly ("No, don't do that — do X instead")
2. **QA failure:** quality-engineer identifies a repeated issue across multiple PRs or sessions
3. **Agent escalation:** An agent reports it encountered a situation its guidelines didn't cover correctly

**Who proposes:** Orchestrator structures the correction entry from the observed mistake and fix.
**Who writes:** Memory-curator writes after Clarke confirms the correction is accurate.
**Required clarity:** Orchestrator must confirm with Clarke whether the failure was a one-time mistake (don't save) or a pattern that needs correction (save).

### 1.3 Approval Signal Recognition

Memory-curator writes ONLY when it receives one of these explicit approval signals:

| Signal | Interpretation |
|--------|---------------|
| "approved" | Write immediately |
| "yes write it" | Write immediately |
| "save that" | Write immediately |
| "remember that" | Write immediately |
| "yes that's right" (after a proposed entry) | Write immediately |
| "go ahead" (after a proposed entry) | Write immediately |

**Ambiguous signals that require a follow-up question:**
- "sounds right" — ask "Should I save this to memory?"
- "good" — ask "Should I write this to [agent]'s patterns.md?"
- "ok" — ask "Confirm: write this to memory?"

**Not approval:**
- Silence (Clarke did not respond)
- Changing the subject after memory-curator proposes an entry
- "maybe" or "I'll think about it"

### 1.4 Proposal Format

When orchestrator proposes a memory entry for Clarke's approval, it uses this format:

```
Proposed memory entry for [agent-name]/memory/[file]:

[YYYY-MM-DD] Pattern/Correction: [content in correct format]

Write to memory? (yes/no)
```

Memory-curator waits for explicit approval before writing. If Clarke does not respond to the proposal within the same conversation turn, memory-curator does not write.

---

## 2. Update vs. Append Rules

Memory files grow through appending. Updates are handled through the supersession mechanism — not by editing old entries.

### 2.1 When to Append a New Entry

- New pattern or correction that does not overlap with existing entries: append at bottom of file
- New pattern that extends or refines an existing one: append new entry; optionally cross-reference the old one
- New date, same topic: append new entry — each entry is its own record

### 2.2 When to Supersede (Not Delete)

A pattern is superseded when a better approach is confirmed:
- Scenario: "Always route Seer EV% issues back to Seer" was the old pattern; new pattern is "Route EV% issues to Seer for self-correction unless EV% is structurally wrong, in which case escalate to Clarke"

Old entry gets this appended: `[SUPERSEDED by 2026-04-15]`
New entry ends with: `[SUPERSEDES 2026-03-12 entry]`

A correction is superseded when the correction itself was incorrect:
- Scenario: "Never proceed without Planner output" was a correction; new learning is "Proceed without Planner only when Clarke explicitly instructs it"

Same mechanism: append `[SUPERSEDED by YYYY-MM-DD]` to old; append `[SUPERSEDES YYYY-MM-DD correction]` to new.

### 2.3 What Never Changes

- The content of existing entries is never edited
- The date on an existing entry is never changed
- Entries are never deleted (even incorrect ones — the correction entry is what supersedes them)

**Why:** The history of what failed and when is as valuable as the history of what worked. A sequence of `[SUPERSEDED]` entries shows an evolving understanding — that is useful context.

---

## 3. Archive and Cleanup Rules

### 3.1 What "Archived" Means

An entry is archived when it is no longer relevant to current work AND has not been referenced in 6+ months. Archived does not mean deleted.

**Append to the entry:** `[ARCHIVED YYYY-MM-DD — no longer relevant: {reason}]`

Memory-curator does NOT archive entries unilaterally. Archive proposals follow the same approval requirement as write proposals — propose to Clarke first, wait for "approved" before adding the archived tag.

### 3.2 Stale Detection

An entry is potentially stale when it references:
- A file path that no longer exists in the codebase
- A function, component, or module that has been renamed or deleted
- A workflow step that was removed from an agent's CLAUDE.md

**Stale detection process:**
1. memory-curator reads the entry's file path references
2. Checks if the path exists: `Glob("the/referenced/path")`
3. If not found: flag as potentially stale; report to Clarke with "This memory entry references [path] which no longer exists. Verify if this pattern still applies."
4. Do not auto-archive stale entries — Clarke decides

### 3.3 MEMORY.md Approaching 200 Lines

When MEMORY.md is at 175+ lines (within 25 lines of limit):

**Step 1:** Identify the densest topic cluster in the index table (which topic has the most index rows?)
**Step 2:** Create a new topic file for that cluster: `{topic}-{type}.md` (e.g., `vietnam-analysis-patterns.md`)
**Step 3:** Move the actual entries from patterns.md or corrections.md that belong to this topic into the new file
**Step 4:** Update MEMORY.md index: replace multiple rows for this topic with one row pointing to the new file
**Step 5:** Verify MEMORY.md is now under 180 lines

**What memory-curator does NOT do:**
- Does not delete existing patterns.md entries (they stay in patterns.md, linked from the new file)
- Does not create new files speculatively — only when the 175-line trigger is reached
- Does not reorganize the entire MEMORY.md structure without Clarke's instruction

---

## 4. New Agent Setup Protocol

When a new squad agent is created, memory-curator runs this setup protocol. All 4 steps must complete before the agent's memory is considered initialized.

### Step 1: Create memory directory

Path: `.claude/agents/squads/{squad}/{agent}/memory/`

### Step 2: Create MEMORY.md

```markdown
# MEMORY — [Agent Name]

## Index
| File | Keywords | Summary |
|------|----------|---------|
| `patterns.md` | [3-5 agent-relevant keywords] | Approved patterns confirmed across multiple interactions. |
| `corrections.md` | [3-5 agent-relevant keywords] | Confirmed corrections to recurring agent mistakes. |

## Related Files
- [patterns](./patterns.md)
- [corrections](./corrections.md)
```

**Keywords for the index table:** choose terms that would appear naturally in a search for this agent's domain. For orchestrator: "handoff, synthesis, coordination, I/O, contract". For micro-analyst: "fundamentals, revenue, thesis, anti-thesis, financial, valuation".

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

### What memory-curator verifies after setup:

- [ ] `memory/MEMORY.md` exists and follows the standard template
- [ ] `memory/patterns.md` exists with the format comment header
- [ ] `memory/corrections.md` exists with the format comment header
- [ ] No entries pre-populated (start clean — entries are earned through confirmed interactions)
- [ ] MEMORY.md keywords are specific to the agent's domain

---

## 5. Memory Quality Health Check

Memory-curator runs this checklist during a memory audit. Each item has a binary pass/fail result.

### 5.1 Structural Health

| Check | Pass Condition | Fail Action |
|-------|---------------|-------------|
| MEMORY.md under 200 lines | `wc -l MEMORY.md` ≤ 200 | Trigger topic file extraction |
| All files in MEMORY.md index exist | Each referenced file path resolves | Flag missing files to Clarke |
| patterns.md has format comment header | First line starts with `<!--` | Add missing header |
| corrections.md has format comment header | First line starts with `<!--` | Add missing header |
| No MEMORY.md files over 200 lines | Verify all agent MEMORY.md files | Trigger extraction for any that exceed |

### 5.2 Content Health

| Check | Pass Condition | Fail Action |
|-------|---------------|-------------|
| No duplicate entries | No two entries with same date + same pattern/correction content | Flag duplicates to Clarke for review |
| No stale file path references | All referenced file paths in entries resolve to existing files | Flag stale entries to Clarke |
| All superseded entries are marked | Old entries have [SUPERSEDED] tag when newer entry supersedes them | Propose adding the tag |
| Entries follow format | Date in [YYYY-MM-DD], Pattern/Correction keyword present | Flag format violations |

### 5.3 Governance Health

| Check | Pass Condition | Fail Action |
|-------|---------------|-------------|
| No entries without date | Every entry has [YYYY-MM-DD] | Flag undated entries |
| No entries without context (patterns) | Every pattern has "Context:" clause | Flag and propose fix |
| No entries without trigger (corrections) | Every correction has "Trigger:" clause | Flag and propose fix |

### 5.4 Audit Report Format

When memory-curator completes a health audit, it reports:

```
Memory Health Audit — [YYYY-MM-DD]

Files audited: [N]
Total entries: [N patterns] / [N corrections]

Structural health: ✅ / ❌ [N issues]
  - [specific issue if any]

Content health: ✅ / ❌ [N issues]
  - [specific issue if any]

Governance health: ✅ / ❌ [N issues]
  - [specific issue if any]

Recommended actions:
1. [specific action with file path]
2. [specific action with file path]
```
