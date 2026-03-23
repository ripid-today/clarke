# Macro Output Format for Commander, Seer, and Planner

## 1. Standard Macro Output Structure

Every macro output for Commander, Seer, or Planner follows this exact format. No exceptions — consistency is critical for Commander's synthesis and Seer's scoring.

### Header
```
MACRO ANALYSIS
Ticker context: [TICKER] or "Market-wide" if no specific ticker
Date: [YYYY-MM-DD]
Analyst: macro-analyst
```

### Macro Score (Required — First Item)
```
MACRO SCORE: [BULLISH / NEUTRAL / BEARISH]
```

**Scoring rules:**
- Choose exactly one: Bullish, Neutral, or Bearish. No qualifiers ("mildly bullish", "cautiously bearish") — take a position.
- Bullish: Macro environment actively supports the investment thesis; tailwinds outweigh headwinds
- Neutral: No strong directional macro signal; neither tailwind nor headwind; fundamental and technical analysis must carry the investment decision
- Bearish: Macro environment creates meaningful headwinds; the thesis must overcome macro friction to succeed

**Score must rest on at least 3 observable data points** — see Supporting Data section below.

### Supporting Data Points (Required — Minimum 3)
```
SUPPORTING DATA:
1. [Data point] — Source: [source name] — Date: [data date]
   Interpretation: [one sentence on directional meaning for investment]

2. [Data point] — Source: [source name] — Date: [data date]
   Interpretation: [one sentence on directional meaning for investment]

3. [Data point] — Source: [source name] — Date: [data date]
   Interpretation: [one sentence on directional meaning for investment]
```

**Rules for data points:**
- Every data point must have a named source. Never cite "market estimates" or "general knowledge."
- State the data date (not the analysis date) — markets run on real-time data; readers need to know how fresh the number is.
- Interpretation must be directional: does this support or undermine the Macro Score?
- If a data point contradicts the Macro Score: still include it and explain why it doesn't change the overall assessment (e.g., lagging indicator, offset by other factors)

### Key Risk (Required — Exactly 1)
```
KEY RISK: [one sentence — the single most important macro risk to this investment]
Risk magnitude: High / Medium / Low
Probability: High / Medium / Low
```

**Selection criteria for Key Risk:**
- Choose the risk with the highest combination of magnitude × probability
- Do NOT list all risks — pick the one that would most change the investment outcome if it materialized
- Macro risks only — company-specific risks go in micro-analyst's output

### Vietnam-Specific Note (Required — Exactly 1)
```
VIETNAM NOTE: [one sentence — local market nuance that external data misses]
```

**What belongs here:**
- Regulatory risk or opportunity not reflected in public data (e.g., "FOL cap near limit for this ticker; foreign buying may be restricted")
- Local market microstructure note (e.g., "T+3 settlement means stop-loss cannot be placed immediately post-entry")
- Political economy nuance (e.g., "This sector is sensitive to state ownership policy; any privatization announcement would be a catalyst")
- VAS accounting nuance affecting interpretation of the micro-analyst's numbers

---

## 2. Full Required Sections

### GDP Trajectory
```
GDP TRAJECTORY: [Growing / Stable / Slowing]
Current rate: [X%] ([period])
Source: [GSO / World Bank / IMF]
Outlook: [one sentence on next 2 quarters]
```

### Inflation Outlook
```
INFLATION:
CPI (latest): [X% YoY] — [Month/Year] — Source: GSO
Trend: [Rising / Stable / Falling]
SBV likely response: [Tighten / Hold / Ease] — [brief rationale]
Risk to thesis: [how CPI surprise would affect investment]
```

### Monetary Policy Direction
```
MONETARY POLICY: [Tightening / Neutral / Easing]
Current policy rate: [X%] (SBV refinancing rate)
Estimated neutral rate: ~5.5-6.0% (long-run; based on nominal GDP growth target)
Direction: [toward tighter / stable / toward easier]
Last SBV action: [describe and date]
Next expected action: [describe or "no change expected"]
```

### Currency Outlook
```
CURRENCY (VND):
Trend: [Stable / Under pressure / Appreciating]
DXY level: [X] — [Favorable / Neutral / Adverse for VND]
SBV reserves: ~$[X]B ([months] import cover)
Investment impact for [TICKER]: [exporters benefit from weak VND / importers suffer / neutral]
```

### Global Context
```
GLOBAL CONTEXT (2-3 sentences):
Fed: [current stance and market expectation]
China: [PMI / economic momentum / Vietnam-specific China impact]
EM flows: [net inflow / net outflow / neutral — source and period]
```

---

## 3. How Macro Score Feeds Seer and Planner

### Seer Integration
Seer uses the Macro Score as an input to its catalyst quality scoring:

| Macro Score | Seer Adjustment |
|-------------|-----------------|
| Bullish | +1 to catalyst quality score (Seer has more conviction in timing the upside) |
| Neutral | 0 adjustment — Seer relies entirely on company-specific thesis and technical signal |
| Bearish | Seer must explicitly acknowledge macro headwind; Seer's maximum overall conviction score is reduced by 1 |

Seer must reference the macro score in its output: "Macro environment is [score] — [brief implication for thesis]."

### Planner Integration
Planner uses the Macro Score as a risk adjustment:

| Macro Score | Planner Adjustment |
|-------------|-------------------|
| Bullish | No adjustment to risk score (macro is a tailwind, not a reducer of company-specific risk) |
| Neutral | No adjustment |
| Bearish | +1 to risk score automatically; Planner notes macro risk in the risk log |

**Critical threshold rule:** If macro score is Bearish AND Planner's baseline risk score is already ≥ 7 (out of 10): Commander must flag this as a high-risk environment and require exceptional fundamental strength from micro-analyst before proceeding.

### Commander Integration
Commander receives the full research package (macro + micro + technical). Macro score is the first item Commander reads. Commander uses it to:
1. Set the risk tolerance for the session: Bearish macro = tighter position sizing, stricter stop losses
2. Prioritize analyst outputs: if macro is Bearish, anti-thesis bullets from micro get more weight than thesis bullets
3. Decide whether to request additional analysis: macro Bearish + technical Neutral = Commander may pause and request updated macro data before proceeding

---

## 4. Macro Output Quality Checklist

Before submitting any macro output to Commander, verify:
- [ ] Macro Score clearly stated (one of three; no hedging language)
- [ ] Exactly 3 supporting data points with named source and data date
- [ ] At least one data point for each of: domestic macro, monetary policy, global context
- [ ] Key Risk stated with magnitude and probability
- [ ] Vietnam-Specific Note included and not just a restatement of the key risk
- [ ] All four required sections present: GDP, Inflation, Monetary Policy, Currency
- [ ] Global Context section covers Fed, China, and EM flows — all three
- [ ] No fabricated data — every number has a named source
- [ ] If any data is estimated or lagged: stated explicitly with confidence level

---

## 5. Example Macro Output (Template)

```
MACRO ANALYSIS
Ticker context: HPG
Date: 2024-11-15
Analyst: macro-analyst

MACRO SCORE: NEUTRAL

SUPPORTING DATA:
1. CPI 3.8% YoY (Oct 2024) — Source: GSO — Data date: Oct 2024
   Interpretation: Within SBV 4.5% target; no inflation pressure forcing tightening.

2. SBV refinancing rate held at 4.5% (unchanged Q3 2024) — Source: SBV press release — Data date: Oct 2024
   Interpretation: Accommodative policy continues; credit availability supports domestic steel demand.

3. DXY at 104.5 (mid-Nov 2024) — Source: Bloomberg — Data date: Nov 14, 2024
   Interpretation: USD elevated but below 107 threshold; moderate headwind for foreign equity flows.

KEY RISK: China steel overcapacity dumping into Vietnam — Chinese HRC export prices 15% below Vietnam domestic — Source: WorldSteel — could compress HPG's domestic margins regardless of SBV policy.
Risk magnitude: High | Probability: Medium

VIETNAM NOTE: HPG's Q4 seasonality is typically weak in Vietnam construction sector (dry season gap); any Q4 earnings beat against depressed consensus would be a positive catalyst.

GDP TRAJECTORY: Growing
Current rate: 6.8% (YTD Q3 2024) — Source: GSO
Outlook: On track to meet 6.5-7% full-year target; construction recovery supporting materials demand.

INFLATION:
CPI (latest): 3.8% YoY — October 2024 — Source: GSO
Trend: Stable (range-bound 3.5-4.0% for 6 months)
SBV likely response: Hold — no trigger for tightening; no room to cut further
Risk to thesis: Food price spike from weather event could push CPI toward 4.5% ceiling

MONETARY POLICY: Neutral (slightly accommodative)
Current policy rate: 4.5% (SBV refinancing rate)
Estimated neutral rate: ~5.5-6.0%
Direction: Stable — no change expected in next 2 quarters
Last SBV action: Hold, September 2024
Next expected action: Hold through Q1 2025

CURRENCY (VND):
Trend: Under mild pressure
DXY level: 104.5 — Adverse (above neutral 100 threshold)
SBV reserves: ~$91B (3.5 months import cover)
Investment impact for HPG: Mixed — HPG imports coking coal in USD (VND weakness increases input costs); but also sells some output in USD (partial natural hedge)

GLOBAL CONTEXT:
Fed: On hold; market pricing one cut in H1 2025; no near-term USD catalyst.
China: Caixin PMI 50.3 (Oct 2024) — borderline expansion; Chinese steel exports elevated — direct competitive pressure on HPG.
EM flows: Net neutral in Vietnam — foreign buying in large caps offset by selling in mid-caps (data: HOSE daily foreign flow, 30-day aggregate).
```
