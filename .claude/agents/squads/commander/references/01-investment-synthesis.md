# Investment Synthesis — Commander Reference

Commander's core job is adjudication. Seer argues for opportunity; Planner argues for caution. This document defines the rules for resolving that tension into a single, actionable verdict with a stated position size.

---

## 1. The Adjudication Framework

### When Risk-On Wins (Follow Seer)

Commander rules in favor of Seer's bull case when ALL of the following are true:

- Technical score ≥7 (chart is bullish — uptrend, above SMA50 and SMA200, confirming volume)
- Macro environment is Bullish or Neutral (macro-analyst has not issued a Bearish rating)
- Fundamentals are sound — defined as: P/E below 25×, positive free cash flow (operating cash flow exceeds capex), and debt-to-equity ratio below 1.0
- Planner risk score ≤6 (moderate or lower risk)

When these conditions hold, Commander proceeds at Seer's recommended position size, adjusted by the Kelly fraction in section 2.

### When Risk-Off Wins (Follow Planner)

Commander rules in favor of Planner's bear case when ANY of the following is true:

- Planner risk score ≥8, regardless of Seer's conviction score — high risk always constrains size
- Macro environment is Bearish AND the company's balance sheet is deteriorating (declining FCF, rising D/E, or falling current ratio over 2+ quarters)
- Any single balance sheet red flag from Planner's red flag list is triggered (net debt >3× EBITDA, OCF/NI ratio <0.7 over 3 years, pledged shares >30%)

When risk-off conditions hold, Commander reduces or eliminates the position per the sizing rules in section 2.

### Tie-Breaker: Clarke's Stated Risk Tolerance

When neither side dominates — for example, Seer conviction 7, Planner risk 6, neutral macro — Commander applies Clarke's stated risk tolerance:

- **Conservative Clarke:** Follow Planner's recommendation. Enter at Planner's maximum safe size or smaller.
- **Moderate Clarke (default):** Split the difference. Enter at 50% of Seer's recommended size.
- **Aggressive Clarke:** Follow Seer at reduced size — 75% of Seer's recommended position, not full.

If Clarke has not stated a risk tolerance in the current session, Commander defaults to Moderate (split the difference) and notes this assumption explicitly in the verdict.

---

## 2. Position Sizing Methodology

### Kelly Criterion Basics

The Kelly Criterion calculates the theoretically optimal fraction of capital to bet on a positive-expected-value opportunity, maximizing long-run capital growth.

**Full Kelly formula:**

```
f* = (b × p - q) / b
```

Where:
- f* = fraction of portfolio to allocate
- b = net reward ratio (profit if you win ÷ amount risked if you lose); equivalent to (distance to target ÷ distance to stop loss)
- p = probability of winning (Seer's stated P_win from the EV calculation)
- q = 1 - p = probability of losing

**Example:**
- Seer states: P_win = 65%, upside 28%, downside 12% (stop loss)
- b = 28 ÷ 12 = 2.33
- f* = (2.33 × 0.65 - 0.35) / 2.33 = (1.51 - 0.35) / 2.33 = 1.16 / 2.33 = 0.50 (50% of portfolio)

A 50% Kelly output is theoretically optimal but impractically aggressive. This is why we apply the Half-Kelly rule.

### The Half-Kelly Rule

**Always use 50% of the raw Kelly fraction.** This is standard practice (Ed Thorp's recommendation) for two reasons:
1. It reduces portfolio volatility substantially while retaining ~75% of long-run growth benefit
2. Our probability estimates (Seer's P_win) are uncertain — overestimating p by even 5% can make Full Kelly ruinous

Using the example above: 50% × 50% = 25% → still too large. This is where the hard caps apply.

### Hard Caps (Non-Negotiable)

These override Kelly in all cases:

| Rule | Limit |
|------|-------|
| Maximum single position | 10% of portfolio |
| Minimum position (if entering at all) | 2% of portfolio |
| Vietnam liquidity adjustment | Apply additional 30% Kelly reduction for stocks with daily trading volume <$500K USD equivalent |

**The 2% minimum rule:** If Half-Kelly outputs a position smaller than 2%, do not enter the trade. Below this threshold, the 0.1% Vietnam securities transfer tax plus T+3 friction (opportunity cost of locked capital) makes the trade uneconomic. Better to wait for a cleaner setup.

### How Seer's Inputs Map to Kelly

Seer provides in every bull case:
- P_win (probability estimate)
- Upside % (distance from entry to target)
- Downside % (distance from entry to stop loss)

These map directly:
- p = Seer's P_win
- q = 1 - p
- b = Seer's upside% ÷ Seer's downside%

Commander applies the formula, then halves it, then caps at 10%.

### How Planner's Risk Score Adjusts Position Size

After calculating Half-Kelly, apply Planner's risk score as a final multiplier:

| Planner Risk Score | Position Size Multiplier |
|-------------------|--------------------------|
| 1-4 (low risk) | 100% of Half-Kelly (no reduction) |
| 5-6 (moderate risk) | 75% of Half-Kelly |
| 7 (elevated) | 50% of Half-Kelly |
| 8 (high risk) | 25% of Half-Kelly |
| 9-10 (stop) | 0% — position not taken |

**Example:**
- Half-Kelly output: 8%
- Planner risk score: 7
- Final position size: 8% × 50% = 4% of portfolio

This is Commander's recommended position size in the verdict.

---

## 3. The 4-Section Decision Report Format

Every full-chain investment decision produces a structured 4-section report. This is the required output format — no exceptions for decisions involving more than 1,000,000 VND.

---

### Section 1 — Scout Research Summary

Three bullet points, one from each analyst. Each bullet is 1-2 sentences maximum.

**Format:**
- **Macro (macro-analyst):** [Vietnam macro environment score: Bullish/Neutral/Bearish]. [1-sentence justification referencing the most relevant indicator: SBV rate, credit growth, VN30 trend, or FDI data]
- **Fundamentals (micro-analyst):** [Company health summary: P/E, revenue growth rate, FCF status, D/E ratio]. [1-sentence note on the most important financial signal]
- **Technical (technical-analyst):** [Chart posture: Bullish/Neutral/Bearish]. [Key level: current price vs. SMA50/SMA200, RSI status, and nearest support/resistance]

---

### Section 2 — Seer's Bull Case

Verbatim from Seer's submission, plus Commander's annotation of which adjudication condition applies.

**Format:**
```
Conviction Score: X/10  [Catalyst: X pts | Valuation: X pts | Technical: X pts]
Expected Value: +X% [P_win X% × upside X% − P_loss X% × downside X%]
Catalyst: [Seer's catalyst statement]
Entry Zone: VND X,000 – X,000
12-Month Target: VND X,000  [Method: DCF / peer P/E / technical measured move]
Stop Loss: VND X,000  [Thesis invalidation: what this level means]
Seer's Max Position Recommendation: X% of portfolio
```

---

### Section 3 — Planner's Bear Case

Verbatim from Planner's submission, plus Commander's annotation.

**Format:**
```
Risk Score: X/10  [Downside valuation: X pts | Red flags: X pts | Macro risk: X pts]
Risk 1 (Most Severe): [Specific risk with evidence]
Risk 2: [Specific risk with evidence]
Risk 3: [Specific risk with evidence]
Bear Case Valuation: VND X,000  [P/E X × EPS X,000 × (1 − Y% haircut)]
Planner's Max Safe Position: X% of portfolio
```

---

### Section 4 — Commander's Verdict

**Format:**
```
VERDICT: [BUY / HOLD / DO NOT BUY]
Position Size: X% of portfolio  [Kelly: X% → Half-Kelly: X% → Risk-adjusted: X%]
Entry Condition: [What must be true before entering — price level, or catalyst confirmation]
Stop Loss: VND X,000  [No override. If this hits, exit.]
Monitoring Trigger: [What event or price level prompts a review]
Thesis Invalidation: [What would make this thesis wrong entirely]
Adjudication Basis: [Which framework condition applied: risk-on / risk-off / tie-breaker]
```

---

## 4. Disagreement Protocols

Seer and Planner will often disagree. The disagreement itself is information. Commander uses the gap between conviction score and risk score to calibrate position size and urgency.

### Scoring the Divergence

Calculate the divergence: |Seer conviction score − Planner risk score|

This is not a simple subtraction — we also care about the absolute levels. The decision matrix:

| Seer Conviction | Planner Risk | Divergence | Commander Action |
|-----------------|--------------|------------|------------------|
| 8-10 | 1-4 | Large | Proceed at full calculated position. Seer dominates. |
| 7-9 | 5-6 | Moderate | Half-size entry. Await one catalyst confirmation before adding. |
| 7-9 | 7-8 | Near parity (high both) | Quarter-size entry maximum. Present as high-risk trade. |
| 8-10 | 8-10 | Near parity (both extreme) | PRESENT TO CLARKE as genuine 50/50. Do not resolve unilaterally. |
| Any | 9-10 | Any | HARD STOP. Zero position. No override without Clarke's written rationale. |

### The Genuine 50/50 Case

When both Seer and Planner return extreme scores in opposite directions — for example, Seer conviction 9 (exceptional opportunity) and Planner risk 8 (serious concerns) — Commander does not manufacture a verdict. This is a genuine investment dilemma.

In this case, Commander presents both cases in full and asks Clarke: "This is a genuine disagreement. Seer sees X opportunity because [catalyst, valuation]. Planner sees serious risk because [specific concern]. Do you want to enter at a very small size (2%), wait for the catalyst to de-risk, or pass entirely?"

**Never fake consensus when the evidence is genuinely split.**

### Moderate Divergence Protocol (Seer 7, Planner 6)

This is the most common case — two reasonable analysts mildly disagreeing.

1. Enter at half Seer's recommended position (after Kelly adjustment)
2. Define ONE catalyst confirmation that, if observed, triggers adding to the position
3. Define ONE warning signal that, if observed, triggers exit
4. State clearly: "This is a conditional entry — we are buying the setup, not the full thesis yet."

### Hard Stop Override Protocol

When Planner issues risk score ≥9 and Clarke explicitly asks Commander to override:

1. Commander states clearly: "Planner has issued a hard stop (risk score 9). Proceeding requires Clarke's explicit written rationale."
2. Clarke must provide: the specific reason she believes the risk is overstated, and what additional information justifies overriding Planner.
3. Commander documents this override in the verdict section, labeled: "[OVERRIDE: Clarke rationale — [text]]"
4. Libra is notified to log the override in Commander's memory/corrections.md for pattern tracking.

This process exists to make overrides conscious, not to prevent them entirely.

---

## 5. Sources and Intellectual Framework

### Ray Dalio — Macro Regime Thinking

Commander's macro framing draws on Dalio's debt cycle framework. The key insight: most investment mistakes come from not knowing where we are in the macro cycle. In a late-cycle expansion, risk assets look cheap on backward-looking metrics but are actually expensive on forward-looking risk-adjusted returns.

- Reference: "Principles for Navigating Big Debt Crises" (Bridgewater, 2018)
- Online: bridgewater.com/research (free papers available)
- Application: when macro-analyst rates Vietnam as "Bearish," Commander reduces all position sizes by one band, regardless of individual stock quality

### Howard Marks — Second-Level Thinking and Uncertainty

Marks' contribution is epistemological: the question is not "is this a good company?" but "is the consensus view about this company wrong, and in which direction?"

Key frameworks from Marks' memos:
- **Second-level thinking:** If everyone knows the company is great, the stock may already price in greatness — your edge is knowing something the consensus doesn't
- **The uncertainty spectrum:** Distinguish "I don't know" from "nobody knows." Former = do more research. Latter = size accordingly.
- **Market cycles:** Marks' pendulum metaphor — markets swing between excessive optimism and excessive pessimism. Commander's job is to identify where the pendulum is when a recommendation is made.

- Reference: Howard Marks memos at oaktreecapital.com/insights (all free)
- Most relevant: "You Can't Predict. You Can Prepare." and "Mastering the Market Cycle"

### Kelly Criterion and Ed Thorp

The full Kelly Criterion derivation is in J.L. Kelly Jr. (1956), "A New Interpretation of Information Rate," Bell System Technical Journal.

Ed Thorp's practical application in "Beat the Dealer" (1966) and later in portfolio management demonstrates that Half-Kelly is the practitioner's standard because model error in estimating probabilities makes Full Kelly dangerous.

**Vietnam adjustment:** In addition to Half-Kelly, apply a further 30% reduction for Vietnam-specific liquidity risk. T+3 settlement means you cannot exit immediately if the thesis breaks. Daily price bands (±7% HOSE) mean that in a crisis, your stop loss may not execute for multiple days. These structural constraints increase effective risk compared to liquid developed markets — so we reduce Kelly exposure accordingly.

The full Vietnam Kelly adjustment formula:
```
Vietnam Position Size = Half-Kelly × (1 − 0.30) × Risk-Score Multiplier
```

This compounds the caution appropriately without being so conservative as to make investing pointless.
