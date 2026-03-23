# Portfolio Protection — Planner Reference

## Purpose
Capital preservation mechanics. These rules are not suggestions — they define the maximum exposure Planner can ever recommend.

## Maximum Loss Rule (Per Position)

**Rule:** Never risk more than 2% of total portfolio value on any single position.

**Calculation:**
- Portfolio value: 100M VND
- 2% portfolio risk per position = 2M VND maximum loss
- If stop-loss is placed 10% below entry, maximum position = 2M / 10% = 20M VND = 20% of portfolio

Wait — 20% violates the concentration rule below. Apply BOTH constraints; take the lower of the two.

## Concentration Rules

| Rule | Limit | Reason |
|------|-------|--------|
| Single stock maximum | 10% of portfolio | Prevents company-specific event destroying portfolio |
| Single sector maximum | 30% of portfolio | Vietnam sectors correlate heavily during sector-wide stress |
| Single market cap bucket | 50% of portfolio | Large-cap/small-cap separation for liquidity management |

**Vietnam correlation reality:** In a Vietnam market sell-off, all stocks tend to correlate. True diversification in Vietnam requires:
1. Sector variation (banking + manufacturing + consumer, not 3 banks)
2. Market cap variation (VN30 blue chips + mid-caps — different liquidity profiles)
3. Business model variation (export vs. domestic demand)

## Stop-Loss Mechanics

**Rule:** Stop-loss triggers are rule-based and cannot be overridden by thesis conviction.

**Planner's standard stop placement:**
- HOSE stocks: −8% from entry (1 day's move × 1.15 buffer; allows for intraday noise without being stopped out by the daily band)
- HNX stocks: −10% from entry (wider band = wider stop)
- Alternative method: 1.5 × ATR(14) below entry (for volatile stocks, ATR-based stops are more calibrated)

**When to override the stop:** Never. If Clarke wants to override, that is a Commander decision with written rationale. Planner always recommends the rule-based stop.

**T+3 stop-loss reality:** Clarke cannot sell today's purchase for 3 days. For new positions:
- If the stock drops 8% within 3 days of purchase, Clarke is trapped
- Planner addresses this by: requiring that the stop-loss exit would still be within a reasonable loss range even if delayed 3 days (widen stop to −12% for new entries to account for T+3 trap)

## Portfolio Rebalancing Triggers

Planner recommends rebalancing when ANY of these occur:
- Single position exceeds 15% of portfolio (appreciation, not new buy — must trim)
- Single sector exceeds 35% (must reduce sector exposure)
- Total equity allocation exceeds 80% (Planner recommends reducing if market risk signals are elevated)

## Cash Reserve Policy

Planner always recommends maintaining a minimum 10-20% cash reserve:
- 10% minimum: standard market conditions
- 20% minimum: when Planner risk score for the general market is ≥7 (VN-Index below SMA200 + foreign selling + credit tightening)
- 30% in defensive allocation: when all three market risk signals trigger simultaneously

## Sources
- William Bernstein "The Intelligent Asset Allocator" — diversification and rebalancing mechanics
- Harry Markowitz MPT — portfolio variance reduction through diversification
- Vietnam-specific: SSC Vietnam regulations on retail investor position limits (no formal limits, but prudential guidance)
