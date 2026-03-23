# Squad Routing — Commander Reference

This document defines the complete routing decision tree for Commander. Before taking any action on an investment request, Commander reads this file and identifies the correct routing path.

---

## 1. The Routing Decision Tree

Routing is determined by identifying observable conditions — specific words, phrases, or combinations present in Clarke's request. The goal is deterministic routing: the same request always produces the same routing decision.

---

### FULL INVESTMENT CHAIN

**Invoke:** Scout (macro-analyst + micro-analyst + technical-analyst) → Seer + Planner → Commander synthesis

**Trigger keywords:** "buy", "sell", "invest in", "analyze [ticker]", "should I get [ticker]", "is [ticker] a buy", "worth buying", "good time to enter", "position in [ticker]", "portfolio fit"

**Trigger condition:** Any ticker symbol present AND any investment intent expressed (explicit or implied)

**Informal examples that still trigger full chain:**
- "What about HPG?" (implied investment interest in the context of an ongoing investment discussion)
- "Is VNM still worth holding?" (hold/sell question = investment intent)
- "Tell me about VHM" (ambiguous but ticker present — default to full chain per Ambiguous rule)

**Protocol:**
1. Invoke macro-analyst, micro-analyst, and technical-analyst IN PARALLEL. Do not wait for one to finish before starting the others.
2. Wait for all 3 Scout results.
3. Invoke Seer AND Planner IN PARALLEL, each receiving the complete Scout package (all 3 analyst outputs).
4. Wait for both Seer and Planner results.
5. Apply references/01-investment-synthesis.md to produce Commander's verdict.
6. Format output per references/04-communication-standards.md.

**Expected output to Clarke:** Full 4-section structured report (Scout summary + Seer bull case + Planner bear case + Commander verdict with position size)

---

### TARGETED MACRO

**Invoke:** macro-analyst only

**Trigger keywords:** "macro", "outlook", "interest rate", "SBV", "inflation", "CPI", "GDP", "VND", "monetary policy", "credit growth", "FDI", "foreign direct investment", "economic environment", "Vietnam economy"

**Trigger condition:** One or more macro keywords present AND no ticker symbol present

**Examples:**
- "What's the macro outlook for Vietnam this quarter?"
- "Is SBV likely to cut rates?"
- "How is credit growth looking?"

**Protocol:**
1. Invoke macro-analyst.
2. Present result directly — no Seer or Planner involvement needed.
3. Note: if Clarke follows up with "so should I buy [ticker]?" after a targeted macro analysis, route the new question through the Full Investment Chain using the macro result already obtained.

**Expected output to Clarke:** Direct 2-4 paragraph macro assessment, no structured investment report

---

### TARGETED FUNDAMENTALS

**Invoke:** micro-analyst only

**Trigger keywords:** "earnings", "P/E", "P/B", "ROE", "balance sheet", "revenue", "EPS", "valuation", "EBITDA", "profit margin", "FCF", "free cash flow", "financial results", "quarterly results"

**Trigger condition:** Ticker present AND one or more fundamental keywords present AND no clear buy/sell intent expressed

**Examples:**
- "What are VNM's P/E and ROE?"
- "Show me HPG's balance sheet"
- "How is MBB's earnings growth looking?"

**The distinction from Full Chain:** "Tell me HPG's P/E" is targeted fundamentals. "Is HPG a buy based on its P/E?" is full chain — investment intent is explicit.

**Protocol:**
1. Invoke micro-analyst.
2. Present result directly — no Seer or Planner involvement needed unless Clarke adds investment intent.

**Expected output to Clarke:** Direct financial summary, tables or metrics as appropriate

---

### TARGETED TECHNICAL

**Invoke:** technical-analyst only

**Trigger keywords:** "chart", "RSI", "MACD", "support", "resistance", "technical", "breakout", "SMA", "moving average", "overbought", "oversold", "trend", "candlestick", "volume", "Bollinger"

**Trigger condition:** Ticker present AND one or more technical keywords present AND no fundamental or buy/sell intent expressed

**Examples:**
- "What does VIC's chart look like?"
- "Is HPG above its 200-day SMA?"
- "Where's the nearest support for VHM?"

**Protocol:**
1. Invoke technical-analyst.
2. Present result directly.

**Expected output to Clarke:** Direct technical summary with key levels and chart posture

---

### TII PRODUCT ROUTING

**Invoke:** product-analyst (Tinker squad entry point)

**Trigger keywords in PRODUCT context:** "TII", "the intelligent investor app", "brief", "pipeline", "article", "UI", "feature", "bug fix", "deploy", "page layout", "news feed", "homepage", "daily briefing", "data ingestion"

**Critical distinction:** The word "brief" in "give me a brief on HPG" is an investment request. The word "brief" in "the daily brief isn't showing" is a TII product request. Context determines routing.

**Protocol:**
1. State the routing: "Routing to product-analyst (Tinker squad) because [product-related condition] in your request."
2. Hand off to product-analyst.

**Expected output to Clarke:** Product-analyst response (PRD, bug analysis, feature design, etc.)

---

### SYSTEM/MEMORY ROUTING

**Invoke:** orchestrator (Libra squad entry point)

**Trigger keywords:** "memory", "correction", "agent", "skill", "improve the system", "update patterns", "CLAUDE.md", "routing error", "fix Commander", "remember this", "update memory", "learn from this"

**Protocol:**
1. State the routing: "Routing to Libra (orchestrator) because [system-related condition] in your request."
2. Hand off to orchestrator.

**Expected output to Clarke:** Orchestrator response (memory update, agent correction, skill improvement)

---

## 2. Parallel Invocation Rules

### Scout Agents Are Always Parallel

When a Full Investment Chain is triggered, Commander ALWAYS invokes all three Scout agents simultaneously. Sequential Scout invocation is an error — it wastes time and introduces ordering bias (the first result could unconsciously anchor the others).

**Correct sequence:**
```
T=0: Invoke macro-analyst, micro-analyst, technical-analyst (simultaneous)
T=Scout-complete: All 3 results received
T=Scout-complete+0: Invoke Seer AND Planner (simultaneous, both receive full Scout package)
T=Analysis-complete: Both Seer and Planner results received
T=Analysis-complete+0: Commander synthesizes
```

**Why this matters:** Seer and Planner must each receive the complete Scout package — not a summary, not just one analyst's output. Both are parallel: neither should wait for the other. This is the correct architecture for unbiased analysis.

### What to Do When a Scout Agent Returns Incomplete Results

If one Scout agent returns incomplete data (e.g., micro-analyst cannot find financial data for the ticker), Commander does NOT silently proceed. The gap must be flagged explicitly in the final report.

**In Section 1 of the report:** Note the missing data and its implication. Example: "Micro-analyst was unable to retrieve complete financial data for [TICKER]. Seer and Planner have scored this opportunity without full fundamental confirmation — conviction and risk scores should be treated as preliminary."

**Do not:** Replace missing data with estimates. Do not ask Clarke to wait while you search for supplemental data (unless Clarke explicitly asks for a deeper search). Flag the gap and proceed with what is available.

---

## 3. Cross-Squad Request Handling

### Splitting Mixed Requests

Some of Clarke's requests combine investment intent with product or system work. These must be split and routed separately.

**Examples:**
- "Fix the TII article display and tell me if VNM is a buy" → Split: product piece to Tinker; investment piece through Full Investment Chain
- "Remember that last week's HPG call was wrong, and now I want to look at MSN" → Split: memory update to Libra; investment analysis through Full Investment Chain
- "Update the agent and analyze SSI while you're at it" → Split: agent update to Libra; investment analysis through Full Investment Chain

**Protocol for splits:**
1. Identify both tasks explicitly
2. Confirm the split with Clarke before proceeding: "I see two tasks here: [task 1] which I'll route to [agent], and [task 2] which I'll route through [chain]. Confirm?"
3. Route both tasks after confirmation
4. Present results together, clearly labeled by task

**Why confirm before splitting:** A split changes the scope of the work. Clarke should know both tracks are being activated — this prevents surprises and ensures she hasn't mentally bundled them as one task.

---

## 4. Routing Confidence Threshold

### The 95% Rule

Commander routes immediately when routing confidence is ≥95%. Below this threshold, ask ONE clarifying question before routing.

**Low-confidence scenarios:**
- Request contains a ticker and ambiguous verbs ("look at", "check", "what do you think about") — could be full-chain or targeted
- Request mentions a sector without a specific ticker — could be targeted macro or an implicit "is this sector a buy?"
- Request has mixed signals (fundamental keyword + casual investment phrasing)

**The one-question format:**
"Before I route this, one question: are you looking for a full investment analysis of [ticker] with a buy/sell recommendation, or just [specific type — fundamentals / technical / macro context]?"

**After receiving the answer:** Route immediately. Do not ask a follow-up question. If still ambiguous after the answer, default to Full Investment Chain.

**Default rule:** When in doubt, route to Full Investment Chain. A full analysis is always informative even when targeted was intended. The reverse is not true — a targeted response to a full-chain question is incomplete.

---

## 5. Routing Confirmation Format

Commander always states the routing decision explicitly before executing it. This creates a clear record and allows Clarke to correct a routing error before resources are spent.

**Required format:**

> "Routing to [agent/squad] because [observable condition] in your request.
> Expected output: [what Clarke will receive].
> ETA: [complexity estimate — simple / moderate / complex]."

**Complexity estimates:**
- Simple (targeted single-analyst query): 1-2 minutes
- Moderate (full-chain with standard data availability): 3-5 minutes
- Complex (full-chain with partial data, unusual sector, or cross-squad split): 5-10 minutes

**Examples:**

> "Routing to Full Investment Chain (Scout×3 → Seer + Planner → Commander synthesis) because 'should I buy VNM' contains a ticker and explicit investment intent.
> Expected output: 4-section structured investment report with conviction score, risk score, and position size recommendation.
> ETA: 3-5 minutes."

> "Routing to macro-analyst because your question is about SBV interest rate policy with no specific ticker mentioned.
> Expected output: 2-4 paragraph macro assessment covering Vietnam macro environment and SBV trajectory.
> ETA: 1-2 minutes."

> "Routing to Tinker (product-analyst) because your request references the TII daily brief pipeline, which is a product issue, not an investment question.
> Expected output: product-analyst's assessment and recommended action.
> ETA: 2-3 minutes."

---

## 6. Routing Errors — How to Handle

If Clarke tells Commander that a routing decision was wrong (e.g., "I wanted a full analysis, not just the technicals"), Commander:

1. Acknowledges the error without defensiveness
2. States what observable condition triggered the incorrect routing
3. Initiates the correct routing path immediately
4. After the correct analysis is complete, notes the routing trigger ambiguity for Libra to record in memory/corrections.md

**Format:**
"I routed to [incorrect path] because [what I observed]. You wanted [correct path]. Correcting now — routing to [correct agent]. [State the correct routing confirmation.]

After this analysis, I'll flag the ambiguous trigger for Libra to update my routing memory."
