# Risk-Return Framing — Seer Reference

Every investment thesis must answer the same fundamental question: is the expected reward worth the risk? This document provides the quantitative frameworks Seer uses to calculate expected value and translate it into a position size recommendation.

---

## 1. Expected Value (EV) Calculation

### The Formula

Expected Value measures the probability-weighted outcome of an investment. It accounts for both the upside (if the thesis is right) and the downside (if it is wrong).

```
EV% = (P_win × Upside%) − (P_loss × Downside%)
```

Where:
- **P_win** = probability the thesis plays out as projected (expressed as a decimal: 60% = 0.60)
- **P_loss** = 1 − P_win (probability the thesis is wrong)
- **Upside%** = percentage gain from the entry midpoint to the 12-month target price
- **Downside%** = percentage loss from the entry midpoint to the stop loss level

### Minimum Acceptable EV%

Seer sets a minimum EV% of **+5%** for any thesis worth presenting to Commander. Below 5%, the trade is not economically justified given:

- Vietnam securities transfer tax: 0.1% on every sell transaction
- Broker commissions: approximately 0.15-0.25% per trade (buy + sell round-trip ≈ 0.3-0.5%)
- Opportunity cost: capital locked in T+3 settlement has a meaningful alternative in 6-month VND deposits (≈5-6% annualized)

A trade with EV% of 3% is delivering below-opportunity-cost returns after accounting for friction. It is not worth Clarke's capital.

**Adjusted EV floor including friction:**

When calculating EV%, Seer reduces the upside% by 0.3% to account for the sell tax and commission round-trip. This gives the friction-adjusted EV.

```
Friction-adjusted EV% = (P_win × (Upside% − 0.3%)) − (P_loss × Downside%)
```

If friction-adjusted EV% < 5%: do not present the thesis.

### Worked Example

**Setup:**
- Stock: VNM at 80,000 VND (entry midpoint)
- 12-month target: 104,000 VND (+30% upside)
- Stop loss: 70,400 VND (−12% downside)
- P_win: 60% (Seer's probability estimate based on catalyst quality and conviction score)
- P_loss: 40%

**Calculation:**
```
EV% = (0.60 × 30%) − (0.40 × 12%)
EV% = 18% − 4.8%
EV% = 13.2%
```

**Friction-adjusted:**
```
Friction-adjusted EV% = (0.60 × 29.7%) − (0.40 × 12%)
= 17.82% − 4.8%
= 13.02%
```

Result: 13% friction-adjusted EV → well above the 5% floor → proceed with thesis.

### How Conviction Score Maps to P_win

Seer's conviction score is a qualitative assessment, but it can be translated into a rough P_win estimate for the EV calculation:

| Conviction Score | Approximate P_win |
|-----------------|------------------|
| 9-10 | 70-80% |
| 7-8 | 60-70% |
| 5-6 | 50-60% |
| 4 | 40-50% |
| ≤3 | <40% (do not present) |

These are rough translations. Seer should adjust up or down based on specific catalyst quality — a conviction 7 with an imminent, binary catalyst (earnings release) might warrant P_win of 70%, while a conviction 7 with a structural tailwind thesis (sector expansion) might be 60%.

Always state the P_win explicitly in the submission. Do not let it be implicit.

---

## 2. The Asymmetry Requirement

Expected value alone is not sufficient. Seer also requires a minimum reward-to-risk ratio — the ratio of the distance from entry to target vs. the distance from entry to stop loss.

### Minimum Reward-to-Risk Ratio: 2:1

```
Reward-to-Risk = (Entry midpoint to Target) ÷ (Entry midpoint to Stop Loss)
= Upside% ÷ Downside%
```

**For any thesis:**
- Minimum: Upside% ÷ Downside% ≥ 2.0
- Preferred: ≥ 2.5 for moderate-conviction ideas (score 4-6)
- Acceptable at 2.0: only for high-conviction ideas (score 7+) where P_win is ≥ 65%

**Worked example (continuing from above):**
```
Reward-to-Risk = 30% ÷ 12% = 2.5:1
```
Result: 2.5:1 exceeds the 2:1 minimum → acceptable.

### Why the 2:1 Minimum Exists

Even if a thesis is right 50% of the time (P_win = 0.50), a 2:1 reward-to-risk ratio produces a positive EV:

```
EV = (0.50 × 20%) − (0.50 × 10%) = 10% − 5% = +5%
```

At 1:1 reward-to-risk, a 50% win rate produces zero EV (break-even before friction costs).

At less than 1:1, you need to be right significantly more than 50% of the time just to break even. This is very hard to sustain over many trades.

The 2:1 minimum provides a structural buffer that allows the strategy to be wrong up to 40% of the time and still produce positive EV.

### Adjusting Minimum for Conviction Level

For lower-conviction ideas (score 4-6), where P_win is 50-60%, the reward-to-risk must be higher to compensate for lower probability:

| Conviction Score | Minimum Reward-to-Risk |
|-----------------|----------------------|
| 9-10 | 2:1 |
| 7-8 | 2:1 |
| 5-6 | 3:1 |
| 4 | 3:1 minimum; consider 4:1 |

**Why:** A conviction 5 with only a 2:1 reward-to-risk generates EV% ≈ (0.55 × 20%) − (0.45 × 10%) = 11% − 4.5% = 6.5%. That's above the floor but not compelling. At 3:1 reward-to-risk with the same probability, EV becomes (0.55 × 30%) − (0.45 × 10%) = 16.5% − 4.5% = 12% — much more attractive.

---

## 3. Presenting Risk/Return to Commander

When submitting the bull case, Seer states all risk/return components explicitly. Commander uses these to apply the Kelly calculation.

### Required Format

```
Expected Value Calculation:
  P_win: X%  [basis: conviction X/10, catalyst quality X/4]
  Upside%: +X%  [from entry midpoint VND X,000 to target VND X,000]
  Downside%: −X%  [from entry midpoint VND X,000 to stop VND X,000]
  EV%: +X%  (friction-adjusted: +X%)

Reward-to-Risk: X.X:1
  [Meets minimum 2:1 / 3:1 requirement: YES / NO]

If reward-to-risk does not meet minimum: [explain why thesis is still presented, or
 reduce the conviction score accordingly]
```

### What Not to Omit

Commander cannot apply the Kelly formula without P_win, upside%, and downside%. If any of these is missing from the submission, Commander must ask Seer to complete the risk/return framing before proceeding.

Do not submit a bull case labeled as "conviction 8" with a target price but no stop loss. The stop loss defines the downside% — without it, EV cannot be calculated, and Kelly cannot be applied.

---

## 4. Position Sizing — Seer's Recommendation

Seer recommends the MAXIMUM position size based on conviction. Commander applies Planner's risk score as a multiplier to determine the final size. Seer never has the final word on position size — that is Commander's role.

### Seer's Position Recommendations by Conviction

| Conviction Score | Seer Max Position Recommendation |
|-----------------|----------------------------------|
| 9-10 | Up to 8-10% of portfolio |
| 7-8 | Up to 5-7% |
| 5-6 | Up to 2-4% |
| 4 | Up to 2% (minimum threshold — consider whether this trade is worth the friction) |
| ≤3 | No position — do not submit |

These are MAXIMUM recommendations. Seer never recommends less than the minimum (2% threshold). If the position sizing would fall below 2% after Planner's adjustment, the trade is uneconomic. Seer notes this: "If Commander's final size falls below 2% after risk adjustment, recommend skipping this trade and waiting for a cleaner setup."

### The Vietnam Kelly Adjustment Context

Seer's position recommendation feeds into Commander's Kelly calculation. Commander applies:
1. Full Kelly formula using Seer's P_win, upside%, downside%
2. Halves the Kelly fraction (Half-Kelly rule)
3. Applies Vietnam-specific 30% additional reduction for liquidity risk
4. Applies Planner's risk score multiplier

Seer does not need to perform this calculation — Commander does. But Seer should understand that its recommendation is a CEILING, not a target. The Kelly calculation and risk adjustment almost always produce a final size smaller than Seer's maximum.

### Anti-patterns in Position Sizing

**Seer never recommends 0%:** Recommending zero position is Planner's territory. If Seer's analysis produces a thesis that doesn't merit any position, the issue is with conviction scoring — the conviction score should be ≤3 and the thesis should not be submitted. If the thesis IS submitted (conviction ≥4), Seer must include a positive position recommendation.

**Seer never recommends >10%:** This is Commander's absolute hard cap per CLAUDE.md guardrails. Even if Seer's conviction is 10 and the Kelly fraction would theoretically justify 15%, the cap is 10%. Seer states this explicitly: "Recommendation: up to 10% (hard cap — Kelly output would be higher but capped per portfolio rules)."

**Seer does not anchor to round numbers:** "5% or 10%" without basis is not a recommendation. Seer always ties the recommendation to conviction score tier. "Conviction 8 → recommend up to 7% of portfolio before Commander's adjustments."

---

## 5. Worked Full Example: Seer's Complete Risk/Return Package

**Setup:**
- Ticker: HPG (HOSE)
- Entry zone: VND 28,000 – VND 30,000 (midpoint: 29,000)
- 12-month target: VND 38,700 (+33.5% from midpoint)
- Stop loss: VND 24,650 (−15% from midpoint; below SMA200 at 25,000)
- Conviction score: 7/10 (Catalyst: 3/4, Valuation: 2/3, Technical: 2/3)

**EV Calculation:**
```
P_win from conviction 7: 65%
P_loss: 35%
Upside%: +33.5%
Downside%: −15%

EV% = (0.65 × 33.5%) − (0.35 × 15%)
     = 21.8% − 5.25%
     = 16.5%

Friction-adjusted:
EV% = (0.65 × 33.2%) − (0.35 × 15%)
     = 21.6% − 5.25%
     = 16.3%
```

**Reward-to-risk:** 33.5% ÷ 15% = 2.23:1 ✓ (meets minimum 2:1)

**Position recommendation:** Conviction 7 → up to 6% of portfolio before Commander's adjustments.

**Complete submission extract:**
```
Expected Value Calculation:
  P_win: 65%  [conviction 7/10, catalyst Q4 earnings in 6 weeks, historical beat rate 75%]
  Upside%: +33.5%  [VND 29,000 midpoint → VND 38,700 target at 11× forward P/E on 3,518 VND EPS]
  Downside%: −15%  [VND 29,000 → VND 24,650 stop; stop is 3% below SMA200 at 25,000]
  EV%: +16.5%  (friction-adjusted: +16.3%)

Reward-to-Risk: 2.23:1  [meets 2:1 minimum for conviction 7]

Seer's Max Position Recommendation: 6% of portfolio
[Commander applies Kelly + Planner risk adjustment for final size]
```

This is the complete risk/return package Commander needs to proceed with synthesis.
