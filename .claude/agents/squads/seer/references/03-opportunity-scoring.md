# Opportunity Scoring — Seer Reference

Conviction scoring is Seer's most important output. A conviction score assigns a number (1-10) to how strongly the evidence supports the bull thesis. The score determines whether the thesis is presented to Commander, at what position size, and with what caveats.

---

## 1. The Conviction Score Scale

### 1-3: Do Not Present

Scores in this range indicate insufficient evidence for a credible bull thesis. The idea may be interesting, but there is not enough catalyst clarity, valuation support, or technical alignment to build a responsible recommendation.

**What to do:** Note the opportunity in Seer's working notes. Identify what is missing (which scoring component is weakest) and define the condition that would raise it to 4+ (e.g., "revisit if Q3 earnings show margin recovery" or "revisit if stock breaks above SMA200").

**Never present a conviction <4 thesis to Commander.** This is a hard guardrail. A weak thesis wastes Commander's synthesis resources and — more importantly — risks recommending a trade that Clarke should not be taking.

### 4-6: Moderate Conviction — Present with Explicit Caveats

Scores in this range represent a genuine opportunity but with meaningful uncertainty. Seer presents these theses with:

1. The specific caveat that reduced the score (e.g., "catalyst is 9-12 months away" or "technical chart is neutral, not yet bullish")
2. A conditional entry recommendation (e.g., "enter only if macro-analyst confirms Bullish or Neutral environment")
3. A smaller position recommendation than high-conviction theses

A score of 4-6 does not mean the idea is bad — it means the timing is uncertain, the evidence is incomplete, or one dimension is underperforming the others. Present with full transparency.

### 7-9: High Conviction — Full Bull Case Required

Scores in this range require the complete bull case document (references/04-bull-case-construction.md) before submission. This includes:

- The pre-submission Planner objection check (all 5 questions answered)
- Full EV% calculation with stated probabilities
- Entry zone, target price, stop loss — all stated

A conviction of 7 is "I have a strong thesis with solid evidence." A conviction of 9 is "this is an exceptional opportunity and the evidence is overwhelming." Both require the full bull case format.

**Scoring guardrail:** Conviction score >7 requires completing the Planner objection check. No exceptions. Scoring >7 without this check is a guardrail violation.

### 10: Exceptional Asymmetric Opportunity

A score of 10 is rare — it is reserved for situations where the evidence is overwhelming, the catalyst is imminent and near-certain, the valuation is cheap, and the technical chart is bullish. These are the situations that produce 5-10× returns.

When a conviction score of 10 is assigned:
1. Present immediately to Commander without waiting for protocol completion
2. Document the reasoning exhaustively — a perfect score demands rigorous justification
3. Still complete the Planner objection check (do not skip — overconfidence is the enemy of a 10-score thesis)

In practice, a genuine 10 might occur once every 1-2 years per analyst. If Seer finds itself assigning 10s frequently, something is wrong with the scoring calibration.

---

## 2. Scoring Components

The conviction score is built from three components. Each component has a maximum score and specific criteria.

### Component 1: Catalyst Quality (Maximum 4 points)

Catalyst quality measures how specific, near-term, and high-probability the identified catalyst is.

**4 points — Imminent and high-probability:**
- The catalyst is specific (a named event, not a vague tailwind)
- The catalyst is within 3 months
- The probability of the catalyst occurring is high (>70%)
- Investor expectation is not yet fully priced in (the stock has not already run on this news)

Example: "Q4 earnings release in 6 weeks; micro-analyst shows Q4 revenue run-rate tracking 15% above consensus estimate; management has a history of conservative guidance."

**3 points — Visible within 6 months, specific trigger:**
- Clear catalyst with a specific trigger event
- Timing is 3-6 months away
- Probability reasonable (50-70%)

Example: "MSCI EM upgrade review in May; Vietnam is widely expected to receive EM status; stock is a likely VN30 inclusion candidate."

**2 points — Catalyst visible but 6-12 months away:**
- Clear what will drive re-rating but timeline is longer
- Less certainty about timing
- Probability: moderate (40-60%)

Example: "New factory expected to begin commercial production in H2; would add 30% to capacity; management has not guided for this yet."

**1 point — Vague tailwind, no specific timing:**
- "The sector is growing" or "macro is improving"
- No identifiable event that will force the market to re-price the stock
- Background support only

**0 points:** No catalyst identified. The thesis is based solely on "this is a cheap, good company." This is not enough. A catalyst must be present to receive any catalyst score.

---

### Component 2: Valuation Support (Maximum 3 points)

Valuation support measures whether the stock's current price represents an attractive entry relative to its intrinsic value and growth rate.

**3 points — Clear margin of safety:**
- PEG < 1.0 (growth faster than the multiple paid)
- OR stock is trading at a discount to comparable peers on EV/EBITDA or P/B
- OR Planner's NCAV analysis shows the stock is trading below net asset value
- A genuine margin of safety exists — the stock can deliver acceptable returns even if the thesis is partially wrong

**2 points — Fair value, upside requires multiple expansion:**
- PEG 1.0–1.5 for a quality growth company
- OR stock is in line with peer multiples but with a better growth trajectory
- The upside is real but depends on either multiple expansion or the thesis playing out perfectly

**1 point — Expensive relative to intrinsic value:**
- PEG > 1.5
- OR stock is at the high end of its historical valuation range
- The upside is limited unless the growth significantly beats expectations
- Price is already pricing in good news — execution risk is high

**0 points:** Stock is wildly overvalued. Even if the catalyst fires, the valuation offers no safety. Do not build a bull thesis here.

---

### Component 3: Technical Alignment (Maximum 3 points)

Technical alignment measures whether the chart confirms favorable entry timing. A fundamentally strong thesis with a bearish chart is an early thesis — timing is wrong. Seer cares about being right AND being right at the right time.

**3 points — Bullish chart, strong confirmation:**
- Stock is in an uptrend (sequence of higher highs and higher lows)
- Price is above both SMA50 and SMA200
- Volume is increasing on up days, decreasing on down days (accumulation pattern)
- RSI is in the 40-65 range (not overbought; has room to run)
- A technical breakout has recently occurred or is imminent (above resistance, above moving average crossover)

**2 points — Neutral chart, consolidating:**
- Stock is in a sideways range, neither trending up nor down
- May be above SMA200 but below SMA50 (mixed signals)
- Volume is low and flat (neither distribution nor accumulation)
- RSI is neutral (45-55 range)
- No clear breakout signal yet, but no breakdown either

**1 point — Bearish chart, downtrend:**
- Stock is below its SMA200 (long-term downtrend)
- Lower highs and lower lows pattern
- Volume increasing on down days (distribution)
- RSI below 40 (oversold but not yet a reversal signal)

**0 points:** Severely bearish — stock has broken down from a pattern, multiple technical resistance levels overhead, institutional selling evident. Do not enter regardless of fundamental quality.

---

## 3. Scoring Decision Rules

### Total Score to Action

| Total Score | Conviction Rating | Action |
|-------------|------------------|--------|
| 9-10 | Exceptional | Present immediately; full bull case required |
| 7-8 | High | Present with full bull case; Planner objection check required |
| 5-6 | Moderate | Present with explicit caveats; smaller position recommendation |
| 4 | Low-Moderate | Present only if macro-analyst confirms bullish/neutral; note weaknesses |
| ≤3 | Insufficient | Do not present; monitor for improvement |

### The Technical Override Rule

**When technical score = 0 or 1, the maximum conviction is 7, regardless of catalyst + valuation strength.**

Why: A bearish chart means institutional investors are selling. Going against institutional flow in a T+3 market with daily price bands is dangerous — you may be right eventually but early for long enough that the position becomes uncomfortable or triggers a stop.

Even if catalyst scores 4 and valuation scores 3 (total = 7 before technical), a technical score of 1 caps the total at 7. This is a firm rule, not a guideline.

**Example:** Catalyst = 4, Valuation = 3, Technical = 1 → Technical cap applies → Maximum conviction = 7.

### The Single-Component Failure Rule

**When ANY component scores 0:** The overall conviction is capped at 5, regardless of the other two components.

- Catalyst = 0: No entry point, no timing. Even if cheap and bullish chart, conviction ≤5.
- Valuation = 0: Too expensive to be worth the risk. Even if imminent catalyst and bullish chart, conviction ≤5.
- Technical = 0: Institutional selling is overwhelming. Even if imminent catalyst and cheap, conviction ≤5.

---

## 4. The Pre-Check Before Scoring

Seer assigns the final conviction score ONLY after reading all 3 Scout analyst outputs. The sequence is:

1. Read macro-analyst's output:
   - What is the macro environment score? (Bullish / Neutral / Bearish)
   - Does the macro environment support or contradict the thesis?
   - Does the macro change the catalyst timing? (e.g., if macro is Bearish because SBV is tightening, a real estate catalyst may be delayed)

2. Read micro-analyst's output:
   - What are the key financial metrics? (P/E, revenue growth, FCF, D/E, current ratio)
   - Do the financials confirm the growth story, or reveal a problem?
   - What is the micro-analyst's assessment of valuation?

3. Read technical-analyst's output:
   - What is the chart posture? (Bullish / Neutral / Bearish)
   - Where are the key levels? (SMA200, nearest support, nearest resistance)
   - Is the RSI in a favorable range?

After reading all three: apply the scoring rubric. Only then assign the conviction score.

**Never pre-assign a conviction score before reading Scout data.** This is confirmation bias — starting with a view and then looking for evidence to support it. Seer must start with the evidence and let the evidence determine the score.

---

## 5. Communicating the Score to Commander

When submitting the bull case, Seer labels the conviction score with its component breakdown:

```
Conviction Score: 7/10
  Catalyst quality: 3/4 — new production capacity Q2, 5 months away, 65% probability
  Valuation support: 2/3 — PEG 1.1, fair value, requires some multiple expansion for target
  Technical alignment: 2/3 — above SMA200, RSI 51, neutral-to-constructive setup
```

This breakdown allows Commander to see exactly why the score is what it is, and to apply the adjudication framework intelligently. It also allows Clarke to challenge the scoring if she disagrees with the component assessment.
