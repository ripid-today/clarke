# TII Content Synthesis and Daily Pipeline

## 1. TII as Primary Market Data Source

### What TII Is
The Intelligent Investor (clarke.ripid.vn) publishes 200-300 word briefs on Vietnam market events and economic developments, compiled from curated RSS sources and synthesized by AI. These briefs represent a curated, AI-processed wire service for Vietnam investment-relevant news.

For macro-analyst, TII serves as the primary "market wire" — a continuously updated feed of synthesized intelligence that removes noise and highlights what matters for investors.

### Reading TII Content for Investment Signal
**Signal vs. Noise Framework:**
- **1-2 briefs on a theme:** noteworthy but not investable — could be one-off event or preliminary data
- **3-4 briefs on a theme over 2 weeks:** emerging signal — worth incorporating into macro view with appropriate uncertainty
- **5+ briefs on a same macro theme over 30 days:** persistent signal — indicates structural development, not noise; incorporate as a confirmed data point
- **0 briefs on an important theme:** coverage gap — macro-analyst must note the absence and rely on external sources; higher uncertainty

### Pattern Identification from TII Content
When synthesizing TII briefs, look for these signal patterns:

**Monetary policy signal:**
- Multiple briefs mentioning SBV rate language, OMO operations, or credit quota signals → synthesize into "monetary policy trajectory" call
- Conflicting briefs (one citing SBV easing signals, another citing inflation concerns) → flag contradiction explicitly; assess which is more recent

**Sector rotation signal:**
- Cluster of briefs mentioning specific sector (banking, RE, steel) in positive/negative context → identify whether it's sentiment or fundamental
- Cross-reference with macro data in briefs (credit growth cited, GDP component, FDI data) to determine if sentiment is fundamental-based

**Macro data anomaly:**
- TII brief cites a GSO data point that contradicts prior expectation → note as "TII flagged data surprise" with source and date
- Use the brief's publication date as the anchor; if brief is stale (>45 days) on fast-moving data, note the staleness

### Gap Identification
Gaps in TII coverage are as informative as the coverage itself:
- If SBV has published OMO data but TII hasn't covered it → macro-analyst must access sbv.gov.vn directly
- If major global macro event (Fed FOMC, China PMI) hasn't been synthesized into TII → note this explicitly in output to Commander
- Gap language for output: "Note: TII has not covered [topic] since [date]. Macro-analyst is relying on [external source] for this data point. Confidence: medium."

---

## 2. Daily Pipeline Ownership

### Pipeline Overview
Macro-analyst owns the TII content pipeline — the system that keeps TII fresh with daily Vietnam market briefs. This is a critical operational responsibility, not just an analytical one. A broken pipeline means Commander, Seer, and Planner receive stale intelligence.

### Trigger and Schedule
- **Trigger:** 9AM GMT+7 daily (Trigger.dev cron job in the TII system; may also be manually triggered)
- **Frequency:** Every calendar day including weekends (Vietnam market news continues; global macro news doesn't stop)
- **Manual trigger:** User or Commander can trigger outside of schedule with explicit instruction

### Step-by-Step Pipeline Execution

**Step 1: Invoke `research-news` skill**
- Input: RSS feed list (configured in TII system; covers VnExpress, CafeF, VnEconomy, Reuters Vietnam, Bloomberg ASEAN)
- Action: Skill fetches yesterday's articles from RSS feeds, filters for investment-relevant content, and generates 200-300 word AI-synthesized briefs for each story
- Expected output: Batch of summarized briefs (typically 5-20 depending on news volume)
- Quality check: Each brief must be 200-300 words; must have a clear headline; must have an identifiable macro or market angle

**Step 2: Invoke `brief-daily-news` skill**
- Input: Summarized briefs from Step 1
- Action: Skill matches each incoming brief against existing Firestore content to identify duplicates; filters out duplicates; publishes unique new briefs to Firestore `articles` collection
- Expected output: Confirmed list of published articles (with Firestore document IDs) + dedup log
- Quality check: No duplicate titles in same folder; article count reasonable (if 0 articles publish, investigate; if >30 articles publish, verify quality)

### Pre-Pipeline Dedup Check (CRITICAL)
**NEVER skip this check.** Before triggering the pipeline:
1. Query Firestore `articles` collection for the target daily-news folder to see yesterday's content
2. Confirm no articles from today's date already exist (prevents re-run duplication)
3. If articles already exist from today: pipeline has already run; do NOT re-trigger without explicit user instruction

**Why this matters:** Duplicate articles in TII are a critical quality failure — Commander and Seer may see the same story twice and double-count signals. The brief-daily-news skill has dedup logic, but pre-check prevents unnecessary processing and catches skill-level dedup failures.

### Pipeline Output Documentation
After each pipeline run, produce the following log:
```
TII Pipeline Run Log — [Date] [Time GMT+7]
Articles fetched from RSS: [N]
Articles after dedup filter: [N]
Articles published to Firestore: [N]
Dedup rejections: [N] (list titles if any)
Firestore confirmation: [document IDs or "confirmed"]
Quality check: [PASS/FAIL] — [note if fail]
```

### Pipeline Failure Handling
| Failure Mode | Diagnostic Step | Recovery Action |
|-------------|-----------------|-----------------|
| research-news skill errors | Check RSS feed connectivity; check skill configuration | Retry once; if fails, report to Commander |
| brief-daily-news skill errors | Check Firestore credentials; check for schema mismatch | Check API logs; retry; escalate if structural |
| 0 articles published | Check if news volume genuinely low OR if dedup over-filtered | Review dedup log; manually verify 1-2 articles should have published |
| Duplicate articles appear in Firestore | Dedup logic failed | Flag immediately; do NOT re-run; investigate brief-daily-news skill behavior |
| Pipeline already ran today | Check pre-pipeline dedup | Do NOT re-trigger; report status to Commander |

---

## 3. TII Content Synthesis Method

### Step 1: Collect and Group
1. Access TII content from clarke.ripid.vn (or Firestore directly if authenticated)
2. Filter to desired date range (default: last 30 days for macro synthesis; last 7 days for weekly brief)
3. Group briefs by macro theme:
   - **Monetary policy group:** SBV actions, credit growth, interest rates, banking sector
   - **Currency and trade group:** VND movements, trade data, FDI, remittances
   - **Market structure group:** VN-Index levels, foreign flow data, stock-specific events
   - **Sector-specific groups:** Real estate, banking, manufacturing, consumer

### Step 2: Extract Data Points
From each brief, extract:
- Specific numeric data (GDP %, CPI %, interest rate %, trade balance VND/USD)
- Source cited in the brief (GSO, SBV, MoF, IMF, Bloomberg)
- Date of original data (not publication date of brief)
- Directional statement (improving/stable/deteriorating)

Build a data point table:
| Data | Value | Source | Data Date | Direction |
|------|-------|--------|-----------|-----------|
| CPI MoM | +0.3% | GSO | [Month] | Stable |
| Credit growth YTD | 8.2% | SBV | [Month] | Lagging target |

### Step 3: Identify Trajectory
For each macro theme group:
- Is the data accelerating (improving condition getting better)?
- Is it stable (consistent readings, no clear direction)?
- Is it reversing (positive trend showing weakness or vice versa)?
- How confident is the trajectory call? (High = 3+ consistent data points; Medium = 1-2 consistent points; Low = contradictory data)

### Step 4: Flag Contradictions
When two TII briefs cite conflicting data or interpretations:
1. Identify which brief is more recent (newer source typically more authoritative for fast-moving data)
2. Check if the data points are for different time periods (apparent contradiction but different reference dates)
3. If genuinely contradictory: note both, state which is likely more accurate and why, and lower confidence to Medium for that theme

### Step 5: Synthesize Macro Score Contribution
Each theme group contributes to the final Macro Score:
- Monetary policy easing + credit acceleration = +1 toward Bullish
- VND stable or appreciating + adequate reserves = +1 toward Bullish
- CPI within target + no SBV tightening risk = +1 toward Bullish
- GDP growth meeting/exceeding target = +1 toward Bullish
- Global context favorable (DXY low, EM inflows) = +1 toward Bullish

**Score mapping:**
- 4-5 positive themes = Bullish
- 2-3 positive themes (no severe negative) = Neutral
- Any severe negative (macro crisis signal) OR 0-1 positive themes = Bearish

---

## 4. Output Format for Investment Analysis Mode

### TII Macro Theme Summary Structure
When generating a macro synthesis from TII content for investment analysis:

```
TII Macro Theme Summary — [Date range covered]
Generated: [Date]

THEME 1: [Label, e.g., "Monetary Policy — Easing Bias"]
- Key signal: [one sentence from TII content]
- Data point: [specific number + source + date]
- Trajectory: Accelerating / Stable / Reversing
- Confidence: High / Medium / Low
- TII brief dates: [list of brief dates that support this]

THEME 2: [Label]
[same structure]

THEME 3: [Label]
[same structure]

GAPS IDENTIFIED:
- [Topic] not covered in TII since [date]; relying on [external source]
- [Topic] with <2 briefs in period; limited TII data support

MACRO SCORE CONTRIBUTION FROM TII:
- Positive themes: [N]
- Negative themes: [N]
- TII-based contribution: Bullish / Neutral / Bearish lean
- External data override needed: Yes / No — [reason if yes]
```

### Integration with External Data
TII content is the primary source but NOT the only source. Macro-analyst must supplement TII with:
- GSO official releases (for CPI, trade data confirmation)
- SBV policy announcements (for OMO and rate changes)
- World Bank and IMF updates (for structural macro context)

When TII and external sources conflict: state both and assess which is more reliable given data vintage and source credibility.
