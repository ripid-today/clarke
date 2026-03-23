# Risk Assessment Framework — Planner Reference

## Purpose
Systematic identification of downside risks for Vietnam equities. Planner's risk score comes from this framework, not from intuition.

## Downside Scenario Construction

**Standard bear case model:**
- Bear case earnings = Current EPS × (1 − 0.20) = EPS −20%
- Bear case multiple = 8x P/E (distressed multiple for Vietnam stocks)
- Bear case price = Bear EPS × 8x

**Example:** Stock with EPS 5,000 VND, current price 60,000 VND, current P/E 12x
- Bear EPS = 5,000 × 0.80 = 4,000 VND
- Bear price = 4,000 × 8 = 32,000 VND
- Downside from current = (60,000 − 32,000) / 60,000 = **46.7% downside**

This is the floor Planner presents to Commander. If the reward/risk from Seer is 3:1 and Planner's downside scenario says 47%, something doesn't add up — interrogate Seer's stop placement.

## Vietnam Risk Catalog

### Political / Regulatory Risk
- SOE favoritism: private companies competing against state-owned enterprises face unequal enforcement, procurement disadvantage, and land use rights complications
- Regulatory change: SBV policy shifts (credit quotas, interest rate caps), MoF tax changes, MOIT sector regulations
- HOSE/SSC intervention: trading halt orders, forced delisting have happened with little warning

### Currency Risk
- VND has devalued ~20% against USD over the last decade (not catastrophic, but real)
- Export companies benefit (VND weakness → USD revenue worth more in VND)
- Import-heavy companies suffer (input costs rise in VND terms)
- SBV ±5% band vs. USD limits extreme moves but devaluation episodes still occur

### Liquidity Risk — T+3 Creates Exit Traps
- Cannot sell today's purchase for 3 days
- Daily ±7% band on HOSE: if a stock hits sàn (floor), you may be trapped for multiple days unable to exit at acceptable prices
- Thin stocks (<$1M daily volume): a 5% portfolio position may take 5+ days to exit at fair prices

### Accounting Risk (VAS)
- Revenue recognition on long-term contracts: VAS allows earlier recognition than economic substance warrants
- Related-party transactions: typically underreported; check for loans to parent/subsidiary in footnotes
- Land use rights: often revalued to boost equity — non-cash, non-recurring, inflates P/B
- Minority interests: sometimes used to shift debt off consolidated balance sheet

## Balance Sheet Red Flags

Planner's automatic risk score escalation triggers:

| Red Flag | Risk Score Impact | Why Dangerous |
|----------|------------------|---------------|
| Net debt > 3× EBITDA | +2 to base score | Covenant risk, refinancing squeeze |
| Receivables growing 2× faster than revenue | +2 | Collection crisis in progress |
| Inventory spike without revenue growth | +1 | Demand slowdown masked by production |
| Pledged shares > 30% of management holdings | +2 | Margin call risk = forced selling |
| Offshore related-party loans | +3 | Capital flight risk, hidden liabilities |
| Land use right revaluations inflating equity | +1 | Accounting manipulation, not real value |
| Auditor qualified opinion | +3 | Immediate blocker — do not invest |

## Market Risk Signals (External)

When ALL THREE are present, increase any risk score by +1:
- VN-Index below SMA200 (general market downtrend)
- Foreign net selling for 10+ consecutive sessions (institutional exodus)
- Credit growth < 8% year-over-year (SBV tightening = liquidity drain)

When macro risk signals are present AND the company has red flags, the risk score floor rises to 7.

## Planner Risk Score Scale

| Score | Meaning | Position Recommendation |
|-------|---------|------------------------|
| 1-3 | Low risk, strong fundamentals | Planner defers to Seer's sizing |
| 4-6 | Moderate risk | Flag specific concerns; up to Seer's max |
| 7 | High risk | Recommend half of Seer's suggested position max |
| 8 | Very high risk | Recommend quarter of Seer's max, or 3% portfolio cap |
| 9-10 | Hard stop | **Zero position — Planner veto regardless of conviction** |
