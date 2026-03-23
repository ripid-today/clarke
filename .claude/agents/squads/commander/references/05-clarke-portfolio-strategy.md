# Clarke's Portfolio Strategy — Commander Reference

This document defines Clarke's investment context, asset universe, and regime detection framework. Commander must know this cold — it is the foundation for every routing and synthesis decision.

---

## Investment Strategy

**Style:** Momentum surfing — 3-12 month holds
**Logic:** Identify a building wave (trend forming, not yet extended), ride it, exit before reversal
**Not:** Day trading, scalping, decade-long investing, or value averaging
**Mindset:** Repeatable intelligence-based process, not luck. Buy when the evidence says a wave is building. Exit when it says the wave is aging or reversing.

---

## Asset Universe

| Asset | Platform | Leverage Available | Wave |
|-------|----------|--------------------|------|
| Gold | Hanagold | 3-5x | A — Macro |
| Silver | Hanagold | 3-5x | A — Macro |
| VN Equities (HOSE) | Vietnam broker | None | B — EM Growth |
| US Stocks / equity funds | US broker | None | B — EM Growth |
| Bitcoin | Exchange | None | C — Speculation |

**DXY** — used as macro compass signal only. Not directly tradeable from Vietnam.

Leverage note: Hanagold leverage amplifies both gains and drawdowns. Position sizing for Gold and Silver must account for effective exposure (stated % × leverage multiplier).

---

## The 3-Wave Framework

**Wave A — Macro Wave (Gold, Silver)**
Driven by: DXY weakening + real rates falling or flat + inflation hedging demand + central bank buying
Leading indicator: Gold moves first; Silver follows with higher beta
Risk: Wave A is the first to reverse in a supply shock — institutional margin calls hit gold before equities

**Wave B — EM Growth Wave (VN Equities, US Stocks)**
Driven by: Risk-on environment + EM capital inflows + corporate earnings growth + USD weakness supporting VND
Vietnam-specific: FDI inflows, SBV easing bias, foreign investor positioning on HOSE
Leading indicator: EEM (EM ETF) as a proxy for VN-Index direction

**Wave C — Speculative Wave (Bitcoin)**
Driven by: Liquidity cycle + momentum + halving narrative + risk appetite
Behavior: High beta to risk-on; shows relative strength in shock events vs. expectation, but no safe-haven status confirmed
Lagging indicator: Typically builds after Wave A and Wave B are already running

---

## Monitoring Signals (Always Watch)

### 1. DXY — Master Regime Switch
- Below 103: manageable for VND and EM assets
- 103-107: caution zone — watch for pressure on VN equities and gold
- Above 107: severe headwind for all of Clarke's assets; defensive posture
- Direction matters more than level — a falling DXY from 101 is better than a steady DXY at 99

### 2. Brent Crude / Oil Price — Supply Shock Signal
- Vietnam is a net importer of refined petroleum products
- Brent above $90: watch for trade balance pressure and SBV policy constraint
- Brent above $100: material headwind — SBV policy trap (cannot ease due to inflation, cannot tighten into growth shock)
- A sudden oil spike (Hormuz-type) triggers forced institutional liquidation across asset classes — even gold falls initially
- Brent below $80 + declining: regime improving for VN equities and EM assets

### 3. VIX — Global Risk Appetite
- Below 18: risk-on, normal market conditions
- 18-25: elevated uncertainty, proceed with caution on new entries
- 25-30: caution zone — reduce position size, tighten stops
- Above 30: acute fear — do not open new positions; wait for stabilization
- Direction of VIX matters as much as level — a rising VIX from 18 is a warning; a falling VIX from 32 is a re-entry signal

---

## 5-Step Regime Detection Sequence

Run in order. Each step confirms or contradicts the prior.

1. **DXY direction** — strengthening or weakening? (3-month trend, not daily noise)
2. **Real interest rate trajectory** — nominal rate minus inflation expectation, rising or falling?
3. **Global risk appetite** — VIX level and direction; EEM trend; credit spreads
4. **12-1 momentum** — which of Clarke's 5 assets are in uptrends vs. downtrends? (12-month return minus last 1 month)
5. **Gold-silver ratio** — below 70 = cycle is young and running; above 90 = cycle aging or reversing; rapid divergence = trend health warning

**Normal regime output:** one of three states:
- Weak-Dollar Risk-On → Wave A running, Wave B building, BTC in play
- Strong-Dollar Risk-Off → all waves stall, defensive posture, wait
- Transitional → one or two steps mixed, reduce size, watch for confirmation

---

## Regime Exception: Geopolitical Supply Shock

When a geopolitical event (military conflict, shipping disruption, sanctions) causes a sudden oil spike, the standard DXY/real-rate model breaks down temporarily:
- Oil spikes independently of Fed action
- Gold and silver sell off on forced margin calls (not because the DXY strengthened)
- EM equities fall on global growth fear
- Bitcoin may show relative strength due to less institutional cross-collateralization

**Identification:** VIX spike + Brent spike + Gold falling simultaneously = supply shock regime, not monetary cycle regime

**Action:** Do NOT enter any new positions until the event resolves. Standard regime re-entry conditions must be met post-shock (see below).

---

## Re-Entry Conditions Post-Shock

All three must be met simultaneously before opening any new position:

1. VIX retreating below 22
2. Gold reclaiming its 8-week moving average
3. Brent declining below $90/bbl

When these align: Wave A re-entry for gold is the first move. Silver follows. VN Equities follow Wave B recovery. Bitcoin timing is independent.

---

## Position Sizing Context

- Leverage assets (Gold, Silver via Hanagold): state position size as % of portfolio AND effective exposure after leverage
- Maximum single position: 10% of portfolio (Commander hard guardrail)
- In shock regimes (VIX > 30): reduce maximum to 5% even for the highest-conviction opportunity
- Gold and Silver together: count as one wave — combined exposure should not exceed 15% of portfolio
