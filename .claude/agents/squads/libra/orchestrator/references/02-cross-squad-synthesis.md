# Cross-Squad Synthesis

**Purpose:** Defines how the orchestrator assembles outputs from multiple parallel agents into a unified package for Commander or the next pipeline stage. Covers the investment decision workflow, the Tinker build pipeline, partial result handling, contradiction resolution, and the final aggregated output format.

---

## 1. Investment Decision Workflow Synthesis

The orchestrator assembles the full investment package after all Scout, Seer, and Planner agents have delivered their outputs. Commander receives a single synthesis report — never raw agent outputs.

### 1.1 Assembly Sequence (in order)

**STEP 1: Verify all Scout outputs received**

Before proceeding, confirm each of the three Scout outputs is present and complete:

| Scout Agent | Required Output Fields |
|-------------|----------------------|
| macro-analyst | macro score (0-10), 3 data points with sources, 1 risk, 1 Vietnam-specific note |
| micro-analyst | all 8 header metrics, thesis, anti-thesis, catalyst, 5-year financials table |
| technical-analyst | technical score (0-10), trend direction, RSI, MACD, entry zone, price target, stop loss |

If any Scout output is missing or incomplete: halt synthesis, return to the specific Scout agent with the list of missing fields. Do NOT proceed with partial Scout data.

**STEP 2: Verify Seer bull case received**

Required Seer fields before proceeding:
- Conviction score (0-10)
- EV% calculation with stated probabilities (P_bull, P_bear, target_upside, target_downside)
- Entry zone (price range, not a single point)
- Price target and timeframe
- Stop loss level with rationale
- Confirmation that Planner check was completed (Seer must note the Planner's risk score before finalizing)

**STEP 3: Verify Planner bear case received**

Required Planner fields before proceeding:
- Risk score (0-10)
- Top 3 risks with evidence (not assertions — each risk must cite a specific data point or precedent)
- Bear case price target with methodology ("Under [scenario X], price declines to [Y] = [Z]% downside")
- Maximum position recommendation (% of portfolio)

**STEP 4: Assemble the Commander synthesis report**

The synthesis report has 4 labeled sections, assembled in this order:

```
# Investment Synthesis: [TICKER] — [DATE]

## Section 1: Scout Consensus
[Macro score] | [Micro summary: 1 sentence] | [Technical score]
[1 paragraph integrating the three Scout views — where they align and where they diverge]

## Section 2: Seer Bull Case
Conviction: [X]/10 | EV%: [Y]% | Entry: [zone] | Target: [price] | Stop: [price]
[EV% calculation shown explicitly]
[2-3 sentences on Seer's bull thesis]

## Section 3: Planner Bear Case
Risk Score: [X]/10 | Max Position: [Y]%
Top Risks: 1. [risk + evidence] 2. [risk + evidence] 3. [risk + evidence]
Bear Case Target: [price] ([Z]% downside) — [methodology]

## Section 4: Contradictions and Open Questions
[Any Scout data point that contradicts Seer or Planner's claims — listed specifically]
[Any unresolved question Commander should address before deciding]
```

**STEP 5: Contradiction check**

Before delivering to Commander, scan for contradictions:
- Macro score ≥7 (bullish) + Planner risk score ≥8: flag as standoff — do not resolve
- Micro positive on fundamentals + Technical bearish on price trend: note as potential divergence signal (fundamentals/price divergence can be a catalyst signal, not a disqualifier)
- Seer's entry zone does not overlap with Technical's entry zone: flag discrepancy with both zones stated
- Any Scout data point (e.g., revenue growth rate) that differs from a figure cited in Seer's bull case: flag for Commander to resolve

---

## 2. Tinker Pipeline Synthesis

The Tinker build pipeline is sequential-with-parallel: product-analyst always runs first, then frontend/backend run in parallel if both are needed, then quality-engineer.

### 2.1 Standard Pipeline Flow

```
product-analyst
    ↓ PRD + acceptance criteria
    ├─→ frontend-engineer (if UI changes)
    └─→ backend-engineer (if API/data changes)
          ↓ both complete
          quality-engineer
              ↓ approval or issues
              Commander (approval) OR back to frontend/backend (issues)
```

### 2.2 What Orchestrator Ensures at Each Handoff

**product-analyst → frontend-engineer:**
- PRD path is in context_pointers
- Acceptance criteria are in Given/When/Then format (not vague)
- breaking_change_flag is declared
- frontend-engineer knows which components to create/modify (specific file scope)

**product-analyst → backend-engineer:**
- PRD path is in context_pointers
- Schema changes (if any) are documented with migration plan reference
- breaking_change_flag = yes if any API endpoint or Firestore schema changes
- backend-engineer knows which API routes and service files are in scope

**frontend-engineer + backend-engineer → quality-engineer:**
- quality-engineer receives BOTH outputs (not just one)
- quality-engineer has access to: PRD path, all modified file paths, acceptance criteria
- Neither frontend nor backend has open blocking issues in their open_issues field
- If one of the two is blocked, orchestrator holds the quality-engineer handoff — no partial QA

**quality-engineer → Commander:**
- All 3 QA scopes completed (UI + data integrity + API, as applicable)
- Zero P0 blockers in the output
- Specific acceptance criteria verified (each AC item checked ✅ or ❌ with evidence)

### 2.3 Parallel Coordination Rules

When frontend-engineer and backend-engineer run in parallel:
- They must NOT modify the same files — orchestrator checks `files_modified` for overlap before accepting both outputs
- If file overlap found: flag to Clarke with "Both agents modified [file]. Resolve merge conflict before quality-engineer proceeds."
- Orchestrator does not attempt to auto-merge — escalate to Clarke

---

## 3. Partial Result Handling

### 3.1 One Scout Agent Returns Incomplete Results

Scenario: macro-analyst and technical-analyst complete; micro-analyst returns output missing anti-thesis and financials table.

**Orchestrator action:**
1. Do NOT proceed with synthesis — missing micro fields affect Commander's decision quality
2. Return to micro-analyst: "Output incomplete. Missing required fields: anti-thesis, 5-year financials table. Deliver complete output before synthesis proceeds."
3. Hold macro and technical outputs — they remain valid; do not re-invoke them

**What to tell Clarke:**
"Synthesis paused: micro-analyst output is missing [specific fields]. Awaiting corrected output before delivering Commander package."

**Never:** Deliver synthesis to Commander flagged as "partial analysis" — Commander must receive a complete package or nothing. Exception: Clarke explicitly instructs to proceed with partial analysis (Commander will note the gap explicitly).

### 3.2 One Seer or Planner Output Missing

Scenario: Seer delivers bull case; Planner has not responded.

**Orchestrator action:**
- Do NOT synthesize with only one side — Commander needs both bull and bear cases to decide
- Escalate to Clarke after one waiting cycle: "[Planner] has not delivered bear case for [TICKER]. Recommend re-invoking Planner."
- Do not prompt Clarke every few minutes — escalate once, then wait for Clarke's direction

### 3.3 Timeout in Tinker Pipeline

Scenario: backend-engineer has not responded while frontend-engineer has completed.

**Orchestrator action:**
- Wait one additional cycle
- After 2 cycles without response: escalate to Clarke: "[backend-engineer] has not responded. Options: (a) re-invoke backend-engineer with same task, (b) proceed with frontend-only if backend changes are not required for the acceptance criteria, (c) hold until backend-engineer responds."
- Present options — never choose unilaterally

---

## 4. Conflict Resolution Rules

### 4.1 Scout Macro Bullish + Planner Risk High

Example: macro score = 8, Planner risk score = 9

**Orchestrator handling:** Surface both clearly in Section 4 (Contradictions). Do NOT average them, smooth them, or explain them away.

Synthesis note format:
"Standoff: macro-analyst scores [8]/10 bullish based on [macro data]; Planner scores risk [9]/10 based on [risk evidence]. These represent a genuine standoff. Commander must weigh macro tailwind against specific risk factors."

### 4.2 Seer Conviction 9 + Planner Risk 9

**Orchestrator handling:** Present as genuine standoff with BOTH full cases intact. Label clearly:
- "Seer's bull case (Conviction 9/10): [EV% calculation, entry, target]"
- "Planner's bear case (Risk 9/10): [top risks, bear target, max position]"
- Add: "Commander must decide — orchestrator cannot resolve a conviction/risk standoff."

**Never:** Blend the two into a "moderate" view. A 9/9 standoff is information — it tells Commander this is a high-uncertainty decision.

### 4.3 Micro-Analyst Fundamental Data vs. Technical-Analyst Price Trend

Example: micro reports 30% revenue growth (bullish); technical reports RSI oversold, price breaking below 200MA (bearish).

**Orchestrator handling:** Note as potential divergence signal, not a contradiction to resolve:
"Fundamental-price divergence: micro-analyst reports [30% revenue growth], suggesting fundamental value. technical-analyst reports [price below 200MA, RSI=28], suggesting near-term price weakness. Divergence between fundamentals and price trend can signal: (a) market mispricing — catalyst may unlock value, or (b) fundamental analysis missing a risk the market is pricing in. Seer's EV calculation should account for this divergence."

### 4.4 Contradictory Data Points Between Agents

Example: micro-analyst states P/E = 15.2x; Seer cites P/E = 18.7x in the bull thesis.

**Orchestrator handling:** Flag explicitly in Section 4:
"Data discrepancy: micro-analyst reports P/E = 15.2x; Seer cites P/E = 18.7x. These cannot both be correct. Orchestrator has not resolved this discrepancy — Commander should verify against source data before deciding."

---

## 5. Aggregated Output Format

### 5.1 Machine-Readable Format (for agent-to-agent handoffs)

When orchestrator passes the synthesis package to Commander programmatically:

```json
{
  "ticker": "HOSE:VIC",
  "synthesis_date": "2026-03-22",
  "scout": {
    "macro": {
      "score": 7,
      "data_points": ["...", "...", "..."],
      "risk": "...",
      "vietnam_note": "..."
    },
    "micro": {
      "thesis": "...",
      "anti_thesis": "...",
      "catalyst": "...",
      "header_metrics": {}
    },
    "technical": {
      "score": 6,
      "trend": "...",
      "entry_zone": "...",
      "target": "...",
      "stop": "..."
    }
  },
  "seer_case": {
    "conviction": 8,
    "ev_pct": 22,
    "entry_zone": "...",
    "target": "...",
    "stop": "..."
  },
  "planner_case": {
    "risk_score": 7,
    "top_risks": ["...", "...", "..."],
    "bear_target": "...",
    "max_position_pct": 5
  },
  "contradictions": ["...", "..."],
  "open_questions": ["..."]
}
```

### 5.2 Written Synthesis Format (for Commander-facing report)

Use the 4-section Commander report defined in Section 1.4 above. Key rules:
- Every figure must be attributed to its source agent ("micro-analyst reports:", "Seer's EV calculation:", "Planner states:")
- Never blend outputs without attribution — Commander must know which agent said what
- Contradictions in Section 4 must be stated as found, not interpreted or resolved

### 5.3 Attribution Standard

All synthesis content uses this attribution format:
- Data from a Scout agent: "[agent-name] reports: [data]"
- Seer calculation: "Seer calculates: EV% = [formula] = [result]%"
- Planner assessment: "Planner assesses: [risk or position recommendation]"
- Orchestrator note: "Orchestrator flags: [discrepancy or contradiction]"

Orchestrator never adds its own analytical conclusions — it coordinates and flags, Commander decides.
