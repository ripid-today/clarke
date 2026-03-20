# Clarke's Knowledge Library

## Project Overview

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Firebase/Firestore
**Directory Structure:**
- `projects/the-intelligent-investor/` - The Intelligent Investor app (daily news briefings, deployed at clarke.ripid.vn)
- `projects/financial-tracker/` - Financial Tracker app (personal finance tracking)
- `library/` - Documentation (`requirements/PRDs/` for WHAT/WHY, `guidelines/` for HOW)
- `.claude/` - Agent definitions, skills, rules, and agent memory

**Common Commands:**
```
npm run dev      # Start dev server
npm run build    # Production build
npm test         # Run tests
```

**Documentation System:** PRDs define WHAT to build and WHY (2-3 pages max). Technical Guidelines (`library/guidelines/`) define HOW: backend-guideline.md, frontend-guideline.md, deployment-guideline.md. Always read guidelines FIRST before analyzing codebase.

---

## Workflow Orchestration

### 0. Session Initialization

At the start of every session, before accepting the first task:
1. Read `.claude/agent-memory/` for relevant agents to load prior patterns and decisions
2. Check TaskList for any active tasks from a prior session; re-establish context if resuming
3. Review the applicable rules in `.claude/rules/` that apply to the expected task type

### 1. Plan Mode Always On

**Enter plan mode for every task.** This applies even when bypass permissions mode is enabled.

- Write detailed specs upfront in plan mode to reduce ambiguity
- Use AskUserQuestion in plan mode to fill knowledge gaps before finalizing the plan
- If something goes sideways mid-execution, STOP and re-plan immediately — do not keep pushing

### 2. Confidence Protocol (95% Threshold)

Before finalizing any plan, parse the prompt to extract:
- Primary objective (main deliverable)
- Constraints (time, quality, scope, format)
- Expected deliverables (what "done" looks like)

Then assess confidence across 5 dimensions:

| Dimension | Weight | Question |
|-----------|--------|----------|
| Clarity | 20% | Is the primary objective unambiguous? |
| Context | 20% | Do I have enough codebase / domain context? |
| Capability | 20% | Can I execute without guessing at patterns? |
| Precedent | 20% | Have I seen this pattern in this codebase before? |
| Completeness | 20% | Are all acceptance criteria defined? |

| Score | Action |
|-------|--------|
| 95–100% | Proceed to implementation |
| 70–94% | Use AskUserQuestion (3–5 per round, discrete options + "Other", ordered by highest-impact gap); iterate until ≥95% |
| <70% | Ask user to restate with more context before planning |

### 3. Subagent Strategy

Launch a read-only **Explore** subagent when codebase exploration requires reading more than 3 files before a plan can be formed, or when research can run in parallel with planning.

Launch a **general-purpose** subagent when the subagent needs to create or edit files.

Assign one clear task per subagent with explicit scope. For complex tasks, launch up to 3 subagents in parallel. Integrate their outputs before presenting a consolidated plan or result.

### 4. Self-Improvement Loop and Change Permission Protocol

After any correction or new learning from the user:
1. Identify which skill, agent definition, rule, or CLAUDE.md section caused the gap
2. Propose the specific improvement: describe the exact diff and why it improves future performance
3. Present the proposal and wait for explicit user approval before editing anything
4. Once approved, update the relevant file directly

**Requires explicit user approval before editing:**
- `.claude/agents/*.md`
- `.claude/skills/**/*.md`
- `.claude/rules/*.md`
- `CLAUDE.md`
- `.claude/output-styles/`

**Does NOT require approval (save immediately when instructed):**
- `.claude/agent-memory/{agent-name}/` — update on explicit user instruction or confirmed learning; remove entries when asked to forget

Do NOT create new standalone lesson files or todo files. Integrate every learning into an existing skill, rule, agent definition, or memory file.

### 5. Verification Before Done

Never mark a task complete without verification appropriate to the task type:

- **Code changes:** TypeScript compiles, `npm test` passes, qa-tester validates against acceptance criteria
- **Content additions:** knowledge-organizer confirms no duplicates and metadata is complete
- **PRD writing:** all acceptance criteria are testable and specific (Given/When/Then format)
- **Config or rule changes:** confirm no conflict with existing rules or agent definitions

For all user-facing changes: run the Pre-Deployment Checklist from `library/guidelines/deployment-guideline.md` before declaring done.

### 6. Elegance Check

After a draft implementation is complete and before presenting results, ask: "Is there a simpler approach that achieves the same outcome?" If yes, implement the simpler approach. Skip for single-file fixes under 20 lines. Do not use this as a reason to over-engineer or expand scope.

### 7. Autonomous Bug Fixing

When given a well-described bug report:
1. Read the relevant logs, errors, and failing tests
2. Identify the root cause before touching any code
3. Implement the minimal fix that resolves the root cause
4. Verify the fix passes tests without introducing regressions
5. Report findings and changes — do not request step-by-step guidance

**Escalate to the user** if the root cause requires changes across more than 3 files, or requires architectural decisions outside existing patterns.

---

## Task Management

Track tasks using built-in task tools — NOT separate markdown files.

1. **Plan First:** Create tasks with TaskCreate before starting any multi-step work
2. **Verify Plan:** Present the task list and confirm before implementation begins
3. **Track Progress:** Mark tasks `in_progress` before starting, `completed` when done; delete subtasks as they finish
4. **Explain Changes:** Provide a high-level summary at each major step
5. **Save to Memory:** Record outcomes, decisions, and lessons in `.claude/agent-memory/` — never in standalone files

---

## Task Orchestration

Every task follows this sequence:

**Step 1 — Enter Plan Mode.** Always. Even for simple requests.

**Step 2 — Apply Confidence Protocol.** Achieve 95% before implementation. Use AskUserQuestion to close gaps.

**Step 3 — Select Agent and Route.**
Check `.claude/agents/` for available agents and their descriptions. Match the task type to the agent best suited for it. For tasks spanning multiple agents, assign sequentially or in parallel based on dependencies. For complex changes (3+ agents or 5+ steps), present the full execution plan before starting.

---

## Agent Memory Protocol

Each agent has persistent memory at `.claude/agent-memory/{agent-name}/`.

**MEMORY.md Guidelines:**
- Max 200 lines (lines after 200 are truncated from system prompt)
- Acts as an index; link to separate topic files for details (e.g., `debugging.md`, `patterns.md`)
- Organize semantically by topic, not chronologically
- Update or remove memories that become wrong or outdated

**What to save:**
- Stable patterns and conventions confirmed across multiple interactions
- Key architectural decisions, important file paths, project structure
- User preferences for workflow, tools, and communication style
- Solutions to recurring problems and debugging insights

**What NOT to save:**
- Session-specific context (current task details, in-progress work, temporary state)
- Incomplete or unverified information
- Anything duplicating or contradicting CLAUDE.md instructions
- Speculative conclusions from reading a single file

**Explicit user requests:** When the user asks to remember something, save immediately to the relevant agent memory file. When asked to forget, remove the entry.

**Searching past context:** Search topic files first (Grep in `.claude/agent-memory/{agent-name}/`), then session transcripts as a last resort. Use narrow search terms: error messages, file paths, function names.

---

## Project Conventions

- Read Technical Guidelines FIRST before analyzing or modifying codebase
- Prefer existing patterns over new abstractions
- Minimal changes only — do not refactor beyond what is requested
- No duplicates in library — search before creating, merge or link instead
- Always update metadata when adding or modifying library content
- Consult `.claude/output-styles/` for formatting and presentation standards when producing deliverables
