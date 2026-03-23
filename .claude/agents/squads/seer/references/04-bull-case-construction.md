# Bull Case Construction — Seer Reference

This document defines the exact structure and quality standards for every bull case Seer submits to Commander. A bull case is not a collection of positive facts about a company — it is a structured argument for why the stock will go up, by how much, and why now.

---

## 1. The Bull Case Structure

Every Seer submission follows this exact structure. No component can be omitted. If data is unavailable for a component, state "unavailable — see note" with an explanation.

---

### Label

```
Seer Bull Case: [TICKER] — [Exchange: HOSE/HNX/UPCoM]
Date: [YYYY-MM-DD]
Scout Package Received: [Confirm macro-analyst, micro-analyst, technical-analyst outputs were all received]
```

---

### Company Summary (30 words maximum)

A single sentence. Sector, what they do, why they are in the investable universe.

**Good example:** "HPG — Vietnam's largest integrated steel producer; dominant market share in construction steel; primary beneficiary of infrastructure-led steel demand cycle."

**Bad example:** "HPG is a well-known company in Vietnam that makes steel and has been growing." (Too vague, no investable insight)

**Why this constraint matters:** If Seer cannot describe a company compellingly in 30 words, the investment thesis probably lacks clarity.

---

### Catalyst Statement (50 words maximum)

Answer: what specific event or trend will cause the market to re-price this stock, and when?

**Required elements:**
1. The specific trigger (not "the market will realize...")
2. The timeline ("within 3 months", "upon Q3 results release", "when Q1 public investment disbursement data drops")
3. The mechanism (how does this trigger cause price movement — multiple expansion, earnings revision, institutional buying)

**Good example:** "Q4 earnings release in 7 weeks expected to show 15% EPS beat on micro-analyst's analysis. Management's historically conservative guidance means consensus underestimates recovery. A beat will trigger sell-side estimate upgrades and a 12-18% re-rating within 2-4 sessions."

**Bad example:** "HPG should benefit from ongoing infrastructure investment in Vietnam." (Not a catalyst — it's a background theme)

---

### Upside Scenario (50 words maximum)

Answer: if the thesis plays out, what does the stock look like in 12 months?

Include: revenue or EPS growth projection, multiple expansion or contraction, and the resulting price target.

**Good example:** "If Q4 beats and management raises FY guidance, consensus EPS estimates rise 12%. At the peer average of 11× forward P/E, this implies a 12-month target of 32,000 VND — 31% above the 24,500 VND entry midpoint."

---

### Entry Zone

A price range, not a single number. The entry zone is where the risk/reward is favorable.

```
Entry Zone: VND [lower bound] – VND [upper bound]
Why this zone: [1-2 sentences explaining the technical or fundamental basis for the zone]
```

**Establishing the entry zone:**
- Lower bound: technical support level (SMA50, nearest support, or a meaningful retracement level)
- Upper bound: price beyond which the risk/reward compresses below Seer's minimum 2:1 standard

**Example:**
```
Entry Zone: VND 23,000 – VND 25,500
Why this zone: SMA200 at 22,800 provides support below; above 25,500, the reward-to-risk ratio falls below 2:1 because the distance to stop narrows relative to distance to target.
```

---

### 12-Month Price Target

State a specific price, the method used, and the implied upside from the entry midpoint.

**Acceptable target methods:**
1. **Peer P/E comparison:** Apply the sector average forward P/E to Seer's EPS estimate → implied price
2. **DCF (simplified):** Apply a discount rate and terminal multiple to free cash flow projection
3. **Technical measured move:** Identified chart pattern with a technical price projection (e.g., cup-and-handle target = handle breakout price + depth of cup)

**What NOT to do:**
- Round numbers without method ("I expect this to go to 40,000 VND") — this is guessing, not analysis
- Use only one method without acknowledging its limitations
- Use the current sell-side consensus target without adding any independent analysis

**Format:**
```
12-Month Target: VND X,000
Method: [peer P/E at X× on forward EPS of X,000 VND] / [DCF at X% growth, X% discount rate] / [technical measured move from X pattern]
Implied upside from entry midpoint (VND X,000): +X%
```

---

### Stop Loss

The price level that invalidates the thesis. This is where Seer exits if wrong.

**How to set the stop loss:**
- The stop should be below a meaningful technical support level (not arbitrary percentages)
- Alternatively: the fundamental stop is the price at which even the bull scenario no longer justifies the holding (e.g., if the stock falls to where it prices in Planner's downside scenario, the bull thesis has clearly failed)
- The stop should be set so the reward-to-risk ratio is at minimum 2:1

**Format:**
```
Stop Loss: VND X,000
What this level means: [Why this level is the line — e.g., "Below SMA200 at 22,800, the long-term trend is broken and the technical catalyst no longer applies"]
Implied downside from entry midpoint: −X%
Reward-to-risk ratio: X:1 [must be ≥2:1]
```

---

### Position Recommendation

Seer recommends the MAXIMUM appropriate position based on conviction score. Commander applies the Kelly adjustment and Planner risk adjustment to determine the final size.

**Seer's position recommendation guidelines:**
- Conviction 9-10: recommend up to 8-10% of portfolio
- Conviction 7-8: recommend up to 5-7%
- Conviction 4-6: recommend up to 2-4%
- Conviction ≤3: do not submit; no position

---

## 2. The Why Now / Why This / How Much Framework

Before submitting, Seer must be able to answer three questions clearly. These are not additional sections — they are a quality check on the bull case components.

### Why Now?

What has changed recently that makes this the right moment to enter? "It's cheap" is not an answer — cheap stocks can stay cheap. "The catalyst is imminent" or "the technical setup just triggered" or "the macro environment just shifted" are answers.

**Common failure mode:** A thesis built on "this company is fundamentally excellent." That may justify watching — it does not justify entering NOW. If the answer to "why now?" is "it's always been a good company," the thesis has a timing problem and the catalyst score should be 0.

### Why This?

Why this specific stock instead of other stocks in the same sector? If HPG (steel) is Seer's recommendation, why not NKG, HSG, or SMC (also steel companies)? The answer should identify HPG's specific advantage: scale, cost position, management quality, balance sheet strength, or a catalyst unique to HPG.

If Seer cannot distinguish the recommended stock from its peers, the investment thesis is incomplete.

### How Much?

The EV% calculation establishes whether the reward justifies the risk. Seer must calculate:

1. If the thesis is right: what is the gain (upside %)?
2. If the thesis is wrong: what is the loss (downside %)?
3. How likely is Seer right vs. wrong (P_win, P_loss)?
4. Calculate EV: (P_win × upside) − (P_loss × downside)

If EV < 5%: the trade is not worth it. Transaction costs (0.1% Vietnam sell tax × 2 for entry and eventual exit, broker fees, opportunity cost of T+3 locked capital) eat into the margin.

---

## 3. Pre-Submission Planner Objection Check

Before any conviction score >7 is submitted to Commander, Seer must answer all 5 Planner objection questions. This is a required step, not optional. If conviction score is 7 or above and this check has not been completed, the submission is incomplete.

### The 5 Questions

**Question 1 — Valuation already priced in?**

"Is the opportunity already priced in? What does the market already expect?"

Investigate: What is the current consensus earnings estimate? What does the current P/E imply about the market's growth expectations? If the stock has already re-rated 20% on expectations of the catalyst, the remaining upside may be limited.

Answer required: "Yes — the catalyst appears [fully / partially / not yet] priced in based on [evidence]."

If the catalyst appears fully priced in: revise the upside estimate downward before submitting.

---

**Question 2 — Execution risk?**

"Can management actually deliver on the catalyst? What is their track record?"

Investigate: Over the past 3-5 years, how many times did management provide guidance? How many times did they meet or beat their own guidance? If hit rate < 70%, execution risk is high and Seer should reduce the probability estimate (P_win).

Answer required: "Management's guidance hit rate over the past [X] years is [X%]. This [supports / undermines] confidence that the catalyst will materialize as projected."

---

**Question 3 — Macro stress scenario?**

"What if SBV unexpectedly tightens 50bps? What if global risk-off triggers EM outflows?"

Investigate: Would an unexpected rate hike materially change the thesis? (For rate-sensitive companies — real estate, banks — yes, significantly. For export-oriented manufacturers, less so.) Would a global risk-off event trigger a Vietnam market sell-off that would drag this stock down regardless of its individual quality?

Answer required: "In a +50bps SBV rate hike scenario, the thesis is [materially impaired / modestly impaired / not significantly affected] because [mechanism]. In a global risk-off scenario, the downside is [estimated %]."

---

**Question 4 — Regulatory reversal risk?**

"Is there a realistic scenario where government policy reverses the thesis?"

This is particularly important for:
- Green energy (feed-in tariff policy can change)
- Real estate (project approval, land use rights, condo legal issues)
- Banking (credit quota allocation, FOL policy)
- Any SOE with government as major customer

Rate the probability 0-100%: "The probability of a material regulatory reversal that would kill this thesis within 12 months is approximately [X%]."

If probability > 20%: reduce catalyst score by 1 and note the regulatory risk prominently.

---

**Question 5 — Accounting quality check?**

"Does operating cash flow confirm reported earnings? Any red flags?"

Calculate the OCF-to-Net-Income ratio over the past 3 years. The formula:
```
OCF/NI ratio = Operating Cash Flow ÷ Net Income
```

**Interpretation:**
- Ratio > 1.0: Earnings are conservative — the company is generating more cash than it reports as income (could be timing differences, conservative revenue recognition). Quality is high.
- Ratio 0.7–1.0: Acceptable. Within normal range.
- Ratio < 0.7 consistently: Earnings quality is poor. Net income is being recorded but cash is not materializing. This is a warning sign of aggressive accounting, large accruals, or working capital deterioration.

If any year in the 3-year period shows OCF/NI < 0.5: flag as a potential accounting red flag and reduce conviction score by 2.

**Answer required:** "OCF/NI ratios over the past 3 years: [Year 1: X.X], [Year 2: X.X], [Year 3: X.X]. Earnings quality is [high / acceptable / concerning]."

---

### Post-Check Decision

After answering all 5 questions:
- If all 5 answers are satisfactory → submit the bull case as planned
- If 1-2 answers are concerning → note them explicitly in the submission; reduce upside probability estimate if warranted
- If 3+ answers are concerning → reduce conviction score by at least 1-2 before submitting; ensure Commander sees the full objection summary

If Seer's answer to any question is "I don't know due to data unavailability" → note explicitly: "Data unavailable for [question] — this represents unquantified risk in the thesis."

---

## 4. Common Bull Case Anti-Patterns

These are construction errors that make a bull case weak or misleading. Seer avoids all of them.

### "This stock is cheap" without a catalyst

Cheap can stay cheap. A company trading at 8× P/E can trade at 8× P/E for 3 more years if there is no catalyst to unlock value. The catalyst is what transforms a cheap stock into a returning stock.

**Fix:** Identify the specific event that will make the market recognize the cheapness. If you cannot identify one, catalyst score = 0, conviction capped at 5.

---

### Price target based on hope

"I think this stock can reach 50,000 VND" with no method to support it. This is not a price target — it is a wish.

**Fix:** Always state the method. If no method can be specified, do not provide a price target. State the EV in percentage terms only: "I expect +25-35% return based on P/E reversion to historical mean of 12× at forward EPS of X,000 VND."

---

### Entry zone = current price

Setting the entry zone at the current market price with no thought about whether this is a good entry point implies that price doesn't matter. Price matters. Entry at the wrong point in a consolidation or at the top of a trend dramatically changes the risk/reward profile.

**Fix:** Always set the entry zone relative to technical levels. The lower bound should be at or slightly above a meaningful support level. The upper bound should be the price at which the reward-to-risk ratio falls below 2:1.

---

### Ignoring the technical chart

"The fundamentals are great" is not enough. A stock in a downtrend with institutional selling has a force working against the bull thesis. Seer enters positions where the chart is at least neutral (score ≥2) — never into an active distribution pattern.

**Fix:** Read technical-analyst's output before constructing the bull case. If the chart is bearish (score 1 or 0), acknowledge it explicitly, cap conviction at 7, and set the entry zone contingent on a technical improvement (e.g., "enter when stock reclaims its SMA200").

---

### Overweighting one dimension

A score of catalyst 4 + valuation 3 + technical 0 = 7 total. But the technical override rule caps this at 7. A bull case built overwhelmingly on one dimension is fragile — if that one dimension disappoints, the entire thesis collapses.

**Fix:** Aim for balance. A genuine high-conviction opportunity typically scores 3+ on all three components. When one component is weak, size the position conservatively and set a conditional entry waiting for that component to improve.
