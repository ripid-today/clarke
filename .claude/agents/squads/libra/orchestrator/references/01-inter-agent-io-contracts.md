# Inter-Agent I/O Contracts

**Purpose:** Defines the universal input and output contract every agent in Clarke's system must honor. The orchestrator validates all handoffs against this standard before allowing a pipeline to proceed.

---

## 1. Universal Input Contract Schema

Every agent task invocation must supply these fields. Missing any required field = orchestrator returns the handoff to the sender with a specific resolution request.

### 1.1 Required Fields

**`task_description`** (required — reject if absent)
- Clear statement of what the receiving agent must produce
- Must be unambiguous enough that another agent could read it and start immediately without asking questions
- Bad: "Look at the company" — no output specified
- Good: "Produce a micro-research report for VIC including: thesis, anti-thesis, 5-year revenue table, catalyst, and all 8 required header metrics"

**`context_pointers`** (required — reject if absent)
- File paths, Firestore collection paths, or inline data the agent needs to begin work
- If referencing a PRD: must include exact path (e.g., `library/requirements/PRDs/tii-homepage-redesign.md`)
- If referencing a ticker: include the exchange prefix (e.g., `HOSE:VIC`, not just `VIC`)
- If no files exist yet: state "no prior context — agent must create from scratch"
- Orchestrator action if absent: return to sender with "Specify file paths or data inputs before handing off"

**`breaking_change_flag`** (required for all Tinker tasks; required for any task touching API, schema, or approved PRD)
- Values: `yes` or `no` — never absent
- `yes` means: product-analyst must review before the implementation proceeds; any deviation from the approved PRD is a breaking change
- `no` means: implementation proceeds within existing approved scope
- Orchestrator action if absent: flag as undeclared and require product-analyst confirmation before proceeding

**`expected_output`** (required — reject if absent)
- Format of what "done" looks like: file path written, structured data schema, or specific report format
- Must be specific enough to verify completion (not "produce analysis" but "produce 4-section Commander report at output/VIC-synthesis.md")
- Orchestrator action if absent: return to sender with "Specify what the receiving agent must produce and where"

**`handoff_agent`** (required for chain tasks; optional for terminal tasks)
- The agent that receives this agent's output when done
- Format: `{squad}/{agent}` (e.g., `tinker/quality-engineer`, `libra/orchestrator`)
- Terminal tasks (output goes directly to Clarke): field can be omitted or set to `"commander"`
- Chain tasks: must be specified — orchestrator uses this to route the output

### 1.2 Optional Fields

**`priority`**: `critical` / `high` / `normal` — defaults to `normal` if absent
**`deadline`**: ISO 8601 timestamp if time-sensitive; absent means no constraint
**`parallel_with`**: list of other agents running concurrently whose outputs this agent depends on

---

## 2. Universal Output Contract Schema

Every agent must produce these fields when completing a task. The orchestrator checks all outgoing outputs against this schema before routing to the next agent.

### 2.1 Required Fields

**`deliverable_path`** (required)
- File path(s) where output was written
- Use `"inline"` only when the output is a response message (no files written)
- For multiple files: comma-separated list of absolute paths
- Orchestrator action if absent: return to agent with "Specify where the output was written"

**`files_modified`** (required)
- Exhaustive list of every file created, edited, or deleted during this task
- Must list specific file paths, not directory names ("projects/tii/app/page.tsx" not "projects/tii/app/")
- If no files were modified (inline response only): state "none"
- Orchestrator action if vague: return with "List specific file paths, not directory names"

**`done_signal_checklist`** (required)
- Each item from the agent's Done Signal section — checked (✅) or not (❌)
- Unchecked items must have an explanation of why they are not complete
- An output with any unexplained ❌ is an incomplete handoff — orchestrator returns it
- Orchestrator action: return unchecked items to agent with "Complete all Done Signal items before handing off"

**`handoff_message`** (required for chain tasks)
- Labeled message formatted for the receiving agent
- Format: `[RECEIVING_AGENT] Output: [TICKER/TASK_NAME] — [one-sentence summary of what was produced]`
- Example: `[quality-engineer] Output: TII-homepage-redesign — frontend implementation complete; 4 files modified; PRD acceptance criteria met`
- Terminal tasks (output to Clarke): field can be omitted

**`open_issues`** (required)
- Any unresolved items that affect the receiving agent's ability to proceed
- Empty list = clean handoff
- Non-empty: each issue must include: what it is, why it's unresolved, and whether it blocks the next agent
- Example: "Firebase index for `publishedAt DESC` query not yet created — does NOT block frontend build but will block QA testing"

---

## 3. I/O Validation Checklist

The orchestrator runs this checklist on every incoming handoff before routing it. Each item is binary — pass or fail. Any fail = orchestrator returns handoff to sender with specific action required.

### 3.1 Input Validation (before agent starts work)

- [ ] **Unambiguous task_description:** Can another agent read this and start immediately without questions?
- [ ] **Reachable context_pointers:** Do all referenced file paths exist? Is referenced data available?
- [ ] **Explicit breaking_change_flag:** Is it explicitly `yes` or `no`? (Never absent for Tinker tasks)
- [ ] **Specific expected_output:** Does it specify format and location, not just "produce analysis"?
- [ ] **Valid handoff_agent:** For chain tasks, is the receiving agent correctly identified?

### 3.2 Output Validation (before routing to next agent)

- [ ] **Specific deliverable_path:** Is the output location stated (not "inline" for file-producing tasks)?
- [ ] **Complete files_modified list:** Are specific file paths listed (not directory names)?
- [ ] **All done_signal items checked:** Are there any unexplained ❌ items?
- [ ] **Correct handoff_message format:** Is it labeled for the receiving agent with the standard format?
- [ ] **Open issues documented:** Are blocking issues flagged before the next agent starts?

---

## 4. Common I/O Failure Modes and Fixes

### 4.1 Missing PRD path
- **Symptom:** Tinker handoff from product-analyst to frontend-engineer with no PRD file path in `context_pointers`
- **Orchestrator action:** Return to product-analyst: "Provide the PRD path before handing off to frontend-engineer. Expected: `library/requirements/PRDs/{filename}.md`"
- **Prevention:** product-analyst Done Signal must include "PRD written to correct path"

### 4.2 No done signal checklist
- **Symptom:** Agent output has deliverable but no checklist verification
- **Orchestrator action:** Return to agent: "Complete and attach done_signal_checklist. Unverified items: [list specific checklist items from agent's CLAUDE.md]"
- **Prevention:** Every agent CLAUDE.md must have a Done Signal section; orchestrator reads the agent's CLAUDE.md to know what to check

### 4.3 Undeclared breaking change
- **Symptom:** `breaking_change_flag` absent or `no` when change modifies an existing API endpoint, Firestore schema, or approved PRD acceptance criterion
- **Orchestrator action:** Flag immediately to Clarke: "Undeclared breaking change detected: [specific change]. Requires product-analyst review before Tinker proceeds."
- **Detection rule:** If `files_modified` contains any file matching `app/api/**`, `lib/firebase/`, or `library/requirements/PRDs/`, orchestrator checks breaking_change_flag

### 4.4 Ambiguous file list
- **Symptom:** `files_modified` contains directory names like "projects/tii/components/" instead of specific file paths
- **Orchestrator action:** Return to agent: "List specific file paths, not directory names. Replace 'projects/tii/components/' with the individual files modified within that directory."
- **Why it matters:** quality-engineer and memory-curator need exact file paths to run verification and write memory

### 4.5 Seer output missing EV%
- **Symptom:** Seer output has conviction score and price target but no EV% calculation with stated probabilities
- **Orchestrator action:** Return to Seer: "Required field missing: expected value calculation. Must include: bull probability %, bull target, bear probability %, bear target, EV% formula result."
- **Format required:** `EV% = (P_bull × target_upside%) + (P_bear × target_downside%) = [result]%`

### 4.6 Missing Planner bear case price
- **Symptom:** Planner output has risk score and risk list but no bear case price calculation
- **Orchestrator action:** Return to Planner: "Required field missing: bear case price target with methodology. Must state: 'Under bear scenario [X], price declines to [Y] representing [Z]% downside from current.'"

### 4.7 Parallel agent timeout
- **Symptom:** One of three parallel Scout agents has not returned output while the other two have completed
- **Orchestrator action:** Wait one additional cycle, then escalate to Clarke: "[Agent] has not returned output after 2 cycles. Recommend: (a) re-invoke [agent] with same task, or (b) proceed with partial analysis flagged as incomplete."
- **Never:** proceed to Commander synthesis with undeclared missing Scout output

### 4.8 Contradiction between input task and received output
- **Symptom:** task_description requested a specific format but agent delivered a different format
- **Orchestrator action:** Return to agent: "Output format mismatch. Requested: [expected_output from task]. Received: [actual format]. Please revise to match the requested format."

---

## 5. Sources and Frameworks

### MetaGPT `RoleDefinition` Patterns
- Source: github.com/geekan/MetaGPT
- Relevant concepts: role-based agent architecture where each role has explicit `_watch` (input) and `_act` (output) contracts; agents do not proceed without their required inputs
- Clarke adaptation: every agent CLAUDE.md has "Input Contract" and "Output Contract" sections mirroring MetaGPT's role definition pattern

### Anthropic "Building Effective Agents"
- Source: anthropic.com/research/building-effective-agents
- Relevant concepts: orchestrator-subagent patterns; the orchestrator validates subagent outputs before routing; error handling through explicit rejection (return to sender) rather than silent correction
- Clarke adaptation: orchestrator never silently discards or corrects incomplete outputs — always returns to sender with specific missing fields

### Clarke CLAUDE.md I/O Standards
- Source: `CLAUDE.md` in project root — Section 2 (Confidence Protocol) and Section 3 (Subagent Strategy)
- Relevant: "Assign one clear task per subagent with explicit scope" — the `task_description` field enforces this
- Relevant: "Integrate their outputs before presenting a consolidated plan" — the orchestrator's synthesis role

### Clarke Coding Standards
- Source: `.claude/rules/coding-standards.md`
- Relevant: file naming conventions (kebab-case routes, PascalCase components) — used in `files_modified` validation
- Relevant: "Route handlers thin — delegate to service layer" — helps identify when a breaking change touches architectural boundaries

### Clarke API Conventions
- Source: `.claude/rules/api-conventions.md`
- Relevant: any change to `app/api/**` routes triggers breaking_change_flag = yes
- Relevant: response format standard (`{ data: {} }` / `{ error: "" }`) — quality-engineer validates this in API output checks
