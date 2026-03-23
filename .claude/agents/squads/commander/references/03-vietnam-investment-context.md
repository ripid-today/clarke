# Vietnam Investment Context — Commander Reference

This document covers the structural realities of the Vietnam stock market that affect every investment recommendation Commander makes. These are not background facts — they directly constrain position sizing, entry timing, stop-loss execution, and expected returns.

---

## 1. Exchange Structure

Vietnam has three equity markets, each with distinct characteristics that affect liquidity, risk, and valuation.

### HOSE — Ho Chi Minh Stock Exchange

**Scale:** The largest Vietnamese exchange, home to the blue-chip VN30 index and the broader VNINDEX. Combined market capitalization exceeds $200 billion USD as of the early 2020s, though this fluctuates significantly with global EM sentiment.

**Price band:** ±7% per day from the reference price (previous session close). This is the daily circuit breaker. A stock cannot move more than 7% up or down in a single session.

**Settlement:** T+3. If you buy a stock today, the shares appear in your account three trading days later. If you sell today, the cash arrives three trading days later.

**ATC auction:** All Trading at Close — at 14:30 each session, an auction occurs that establishes the final close price. Large institutions often concentrate volume here.

**Key indices:** VNINDEX (all HOSE listed stocks), VN30 (top 30 by market cap and liquidity), VN100 (top 100).

**For Commander:** HOSE stocks are the primary investable universe for Clarke. The ±7% band is the most important structural constraint — it affects stop-loss execution significantly.

---

### HNX — Hanoi Stock Exchange

**Scale:** Smaller than HOSE. Primarily mid-size companies, SOEs in earlier privatization stages, and some government bonds.

**Price band:** ±10% per day — wider than HOSE, meaning HNX stocks can move more in a single session.

**Settlement:** T+3, same as HOSE.

**Key index:** HNX30, HNXINDEX.

**Liquidity caveat:** Many HNX stocks have thin daily volume (often under $1M USD equivalent). Commander should apply the 1.5% maximum portfolio risk rule (instead of 2%) for HNX stocks due to execution risk.

**For Commander:** HNX stocks are investable but carry additional liquidity risk. Flag any HNX recommendation with "HNX liquidity risk — stop-loss execution may be delayed."

---

### UPCoM — Unlisted Public Company Market

**Scale:** The pre-listing market. Companies that have registered as public (disclosed shareholders, audited financials) but have not yet listed on HOSE or HNX trade here.

**Price band:** ±15% per day — the widest band.

**Disclosure requirements:** Lower than HOSE/HNX. Companies on UPCoM have fewer mandatory disclosures.

**For Commander:** UPCoM stocks are generally NOT recommended for Clarke unless she has specific knowledge of a company (e.g., a sector she works in). The information asymmetry and liquidity risk are both higher. If Clarke asks about a UPCoM company, Commander should explicitly note these constraints.

---

### Identifying Which Exchange a Ticker Is On

- Data providers (vietstock.vn, cafef.vn, SSI iBoard) display the exchange suffix
- General heuristic: if a company is in the VN30 → HOSE. If market cap equivalent is over VND 5,000 billion → likely HOSE. If market cap is VND 500-5,000 billion → could be HNX or HOSE. Below VND 500 billion or unlisted → likely UPCoM.
- When in doubt: ask micro-analyst to confirm the exchange in the research package.

---

## 2. Tax Implications for Clarke

Understanding Vietnam's investment tax structure is critical for calculating real returns.

### Securities Transfer Tax (The Primary Tax)

**Rate:** 0.1% of total sale value on every sell transaction.

**Applied to:** The total gross sale value, NOT net profit. This is a transaction tax, not a capital gains tax.

**Applies even when you lose money:** If you buy a stock at 50,000 VND and sell at 48,000 VND (a loss), you still owe 0.1% of 48,000 VND per share sold.

**Broker deduction:** Brokers deduct this tax automatically at the point of sale. It shows up as "phí giao dịch thuế" in trade confirmations.

**Impact on strategy:** Every trade, even a "free" trade, costs 0.1% to exit. This makes frequent trading expensive. For a stock you buy and sell multiple times, the round-trip cost is 0.1% each time you sell.

**Commander application:** Include the 0.1% sell tax in all EV calculations. When presenting Seer's EV%, subtract 0.1% from the upside % (since the sell will incur the tax regardless of outcome).

---

### Dividend Withholding Tax

**Rate:** 5% on cash dividends from listed companies.

**Application:** Deducted at source by the dividend-paying company before the dividend is distributed to shareholders. Clarke receives the net amount — she does not file separately for this.

**Impact on yield stocks:** A stock paying 6% dividend yield pays Clarke 5.7% after the 5% withholding (5% tax on 6% = 0.3% reduction). This is important when comparing bond yields to dividend yields.

**Tax efficiency note:** Bonus shares (cổ phiếu thưởng) in lieu of cash dividends are not subject to withholding at issuance — though they may trigger tax when eventually sold.

---

### Personal Income Tax (PIT)

Clarke's trading income does not face PIT in addition to the 0.1% securities transfer tax — Vietnam treats the securities transfer tax as the definitive tax on stock trading for individuals. The 5% withholding on dividends is similarly final.

There is no additional capital gains tax layer in Vietnam for individual investors.

---

### Tax Efficiency Strategy for Clarke

Given the 0.1% sell tax structure:

1. **Minimize unnecessary trades.** A stock position that costs nothing to hold costs 0.1% to exit. Don't trade in and out of positions based on small price movements.
2. **Factor the tax into stop-loss calculations.** The "real" stop-loss cost includes the 0.1% exit tax. A stop loss set 8% below entry actually costs 8.1% (including the sell tax).
3. **Dividend yield after tax.** Always calculate dividend yield on a post-5%-withholding basis when comparing to bond alternatives.

---

## 3. Broker Ecosystem

The choice of broker affects Clarke's research access, trading tools, margin availability, and execution quality.

### SSI (Saigon Securities Inc.)

**Strengths:** Largest broker by market share. The strongest in-house research department in Vietnam — SSI Research publishes sector reports, earnings previews, and strategy notes that are among the most thorough available domestically.

**Platform:** SSI iBoard (web) and SSI iBoard Mobile. Functional, not particularly modern.

**Margin rates:** Competitive but not the cheapest.

**Best for:** Clarke if she values access to high-quality Vietnamese equity research. SSI's research team covers most VN30 companies in depth.

**Research access:** ssr.ssi.com.vn (SSI Research portal — some reports require SSI account login)

---

### VPS Securities

**Strengths:** Known for clean, modern UI — the VPS SmartOne mobile app is widely considered the best retail trading app in Vietnam as of 2024-2025. Fast execution.

**Research:** Lighter than SSI — VPS focuses more on retail traders who rely on their own analysis.

**Margin rates:** Competitive.

**Best for:** Active traders who want execution speed and good UI; less good for research-dependent investing.

---

### TCBS (Techcombank Securities)

**Strengths:** Part of the Techcombank ecosystem. Strong in bonds — TCBS BondsPro platform is the leading retail bond platform in Vietnam. Also has good stock trading features.

**Research:** Decent coverage, especially for companies in the Techcombank orbit.

**Margin rates:** Competitive.

**Best for:** Clarke if she wants combined stock + bond + savings in one ecosystem tied to a major private bank. TCBS + TCB savings account is a natural pair.

---

### MBS (MB Securities)

**Strengths:** Backed by Military Bank (MB). Competitive margin rates — often among the lowest in the market.

**Research:** Moderate quality. Not as strong as SSI.

**Best for:** Margin traders who want low borrowing rates.

---

### VCBS (Vietcombank Securities)

**Strengths:** Backed by Vietcombank (VCB), the largest bank by market cap. Conservative, stable. Good for wealth management clients.

**Research:** Limited retail-facing research.

**Best for:** Clients who want their securities account at the same institution as their primary bank (VCB).

---

### Commander's Broker Recommendation for Clarke

If Clarke asks which broker to use, Commander should consider:
- Research quality priority: SSI > TCBS > MBS > VPS > VCBS
- UI/UX priority: VPS > TCBS > SSI > MBS > VCBS
- Margin rate priority: MBS ≈ VPS > SSI ≈ TCBS > VCBS
- Bond access: TCBS is in a class of its own for retail bonds

**Default recommendation for Clarke:** If she has one broker, SSI (for research) or TCBS (for integrated banking). If she's active enough to use two, SSI for research + VPS for execution is a strong combination.

---

## 4. T+3 Settlement Implications

T+3 is one of the most important structural constraints Commander must account for in every recommendation.

### What T+3 Means in Practice

**Buying today (Day 0):** You place a buy order at 10:00 AM. The order fills. You do NOT have the shares in your account today. The shares appear on Day 3 (three trading days later, counting business days only — not calendar days).

**Selling today (Day 0):** You place a sell order. The order fills. You do NOT have the cash in your account today. The cash appears on Day 3.

**The key constraint:** You cannot sell shares you just bought. If you buy VNM today, you cannot sell VNM until three trading days have passed. If bad news comes out tomorrow, you are stuck.

### Trading Day Clarification

A trading day is a HOSE session day (Monday to Friday, excluding Vietnamese public holidays). If you buy on a Thursday before a Friday holiday, Day 3 may fall on the following Tuesday (skipping Friday holiday + weekend).

### Stop-Loss Implications

If Clarke enters a position today and sets a stop-loss at 8% below entry:

- If the stock drops to the stop level on Day 2, Clarke CANNOT execute the stop — she doesn't own the shares yet.
- The first day Clarke can sell is Day 3. By that time, with a −7% daily band, the stock could have fallen 14% (two days × 7%) from the day she would have executed the stop.

**Commander adjustment:** For any new position, note that the effective stop-loss window begins on T+3, not T+0. In practice:

1. Do not enter positions in companies with upcoming binary events (earnings, regulatory decisions) within the T+3 window — if the event goes wrong, you cannot exit quickly.
2. Set stop-losses with the T+3 constraint explicitly noted: "Stop loss at [price] — this stop cannot be executed until Day 3 from entry."

### Practical Entry Rule

Commander should advise Clarke: avoid entering a full position immediately before any high-risk event (earnings announcement, government policy announcement, MSCI decision) that might require a quick exit. Either wait until after the event, or enter a smaller position pre-event with the understanding that the stop cannot be executed quickly.

---

## 5. Daily Price Band Behavior

The ±7% HOSE price band is both a safety mechanism and a market inefficiency source. Commander must understand it deeply to avoid misinterpreting price signals.

### The Band Creates Artificial Support and Resistance

The ceiling (trần — +7%) and the floor (sàn — −7%) are not organic technical levels. They are structural caps imposed by exchange rules. This has several important implications:

**When a stock hits the ceiling:** A queue of buy orders forms that cannot be filled because no sellers are willing to sell at the ceiling (or there are too many buyers relative to sellers). The stock appears to have enormous demand — but this demand is partially structural (people who waited too long and now can only buy at ceiling). It is NOT the same as organic demand at a price where buyers and sellers freely transact.

**When a stock hits the floor:** A queue of sell orders forms that cannot be filled. Panic may be contained for that day — but the underlying selling pressure is real. The next session opens with all that selling pressure ready to execute.

### The Gap Risk After Multiple Ceiling Days

A stock that has hit the ceiling for 3 consecutive days has accumulated enormous unsatisfied demand. When the band resets (it always resets at the next session's reference price), the stock may gap DOWN sharply if sentiment reverses.

Why? Because many of those "ceiling day buyers" were momentum traders who set a stop-loss the moment they got filled. A reversal triggers a cascade.

**Commander rule:** Never interpret multiple ceiling days as a pure buy signal. The risk of a gap reversal increases after 3+ ceiling sessions.

### The Floor is Not a Buy Signal

Similarly, a stock hitting the floor for multiple days should NOT be interpreted as a technical support level in the traditional sense. The floor is a structural constraint. The true "support" is found in the order book when the band is not constraining price.

**Commander rule:** When recommending entries near a stock that has recently hit the floor, wait at least 2 sessions after the floor days end to see where price settles in unconstrained trading.

---

## 6. Foreign Ownership Limits (FOL)

Foreign investors face legally mandated ownership caps in many Vietnamese sectors. Clarke as a Vietnamese domestic investor is not subject to these limits — but FOL significantly affects the stocks she holds.

### Standard FOL: 49%

Most listed companies have a 49% foreign ownership limit. Foreign investors collectively cannot own more than 49% of the company's shares.

### Banking Sector FOL: 30%

Vietnamese banks are subject to a 30% total foreign ownership cap. For some of the most valuable Vietnamese banks (VCB, TCB, VPB), foreign investors regularly approach or hit this cap.

### Impact on Valuations Clarke Cares About

**When a stock approaches its FOL cap:**
- Foreign demand is constrained — institutional investors cannot buy more even if they want to
- This suppresses foreign institutional buying which would otherwise push the price up
- Domestic investors (like Clarke) may find these stocks trading at a discount to what international institutions would pay if unconstrained

**When FOL is expanded (e.g., a company's charter raises the limit to 100% for some sectors):**
- Immediate re-rating: foreign institutions that were previously blocked can now buy
- Stock often jumps 10-30% on the announcement
- This is one of the most reliable structural catalysts in the Vietnam market

**Clarke's FOL advantage:** As a domestic investor, Clarke is NEVER constrained by FOL limits. She can always buy a stock that a foreign fund cannot because it's at the FOL cap. This is a genuine informational and access advantage.

### Practical FOL Monitoring

When micro-analyst researches a stock, it should note the current FOL percentage and whether the company is approaching the cap. If FOL is above 40% (near the 49% ceiling), this signals suppressed foreign demand that could reverse sharply if FOL is expanded.

---

## 7. Data Sources and Research Infrastructure

### Free Data Sources

- **vietstock.vn** — Real-time prices, financials, news. Good for quick lookups. Vietnamese language.
- **cafef.vn** — News, market commentary, basic financials. Vietnamese language. Good for corporate news and macro news.
- **SSC Vietnam (ssc.gov.vn)** — Official Securities Commission of Vietnam. Regulatory filings, official disclosures.
- **HOSE (hsx.vn)** — Exchange-official data, IPO listings, official trading data.
- **HNX (hnx.vn)** — Hanoi Stock Exchange official data.

### Paid/Institutional Sources

- **FiinGroup (formerly StoxPlus):** The institutional-grade Vietnam financial data provider. Covers VAS financials, analyst consensus, ownership data. Clarke may not have a subscription, but when SSI Research or TCBS research cites data, it often originates from FiinGroup.

### For Macro Data

- **GSO (gso.gov.vn):** General Statistics Office — GDP, CPI, trade data, retail sales. Official source.
- **SBV (sbv.gov.vn):** State Bank of Vietnam — credit growth, M2, exchange rate policy, interest rates.
- **MoF (mof.gov.vn):** Ministry of Finance — public investment disbursement, budget data.

Commander should cite the specific source when referencing macro data, so Clarke can verify and track changes over time.
