# Vietnam Accounting Standards (VAS) — Analyst Adjustment Guide

## 1. VAS vs. IFRS — Key Differences

Vietnam uses Vietnamese Accounting Standards (VAS), which lag behind International Financial Reporting Standards (IFRS) by approximately 15-20 years. The differences are not cosmetic — they affect how earnings, assets, and liabilities are measured and reported. Micro-analyst must apply adjustments before using VAS-reported numbers in investment analysis.

### Revenue Recognition: The Most Critical Difference

**VAS Rule:** Revenue recognized upon delivery of goods (delivery-based); service revenue recognized when services are completed.

**IFRS 15 Rule:** Revenue recognized based on performance obligations — when the customer receives the benefit, not when goods physically change hands.

**Impact in Vietnam:**

**Real estate sector (most affected):**
- Under VAS: developer books full revenue and profit when buyer signs purchase contract and makes initial payment (often 20-30% of purchase price)
- Under IFRS: revenue is recognized only when unit is delivered and all obligations complete (often 2-3 years after signing)
- **Consequence:** VAS real estate earnings are wildly volatile — massive profit in signing year, then thin profit in delivery years; year-to-year comparisons meaningless
- **Adjustment:** Do not use single-year P/E for real estate; use EV/pre-sales or land bank value instead; focus on cash collection vs. bookings

**Construction sector:**
- Under VAS: revenue recognized on completion of project milestones (acceptable, similar to IFRS percentage-of-completion)
- **Practical issue:** Vietnamese contractors sometimes book revenue on project completion rather than progress; check notes to financial statements for revenue recognition policy description

**Manufacturing:**
- VAS delivery-based revenue recognition is broadly similar to IFRS for goods — less distortion here
- **Watch:** Year-end channel stuffing (shipping goods to distributors in December to book Q4 revenue; distributors return in Q1 next year); shows as receivables spike at year-end

### Financial Instruments

**VAS Rule:** Financial assets and liabilities measured at historical cost (amortized cost); no fair value through P&L for most instruments.

**IFRS 9 Rule:** Most financial instruments measured at fair value through P&L or OCI.

**Impact:**
- Investment securities (stocks, bonds) held by companies are carried at cost in VAS; unrealized gains/losses invisible in VAS accounts
- Insurance companies and banks most affected: their investment portfolios can have large hidden gains/losses
- **Adjustment:** For insurance companies and banks, request separate disclosure of investment portfolio market value; use market value not book value for asset analysis

### Related-Party Transactions

**VAS Rule:** Requires disclosure of related-party transactions in notes to financial statements.

**Problem:** Enforcement is weak; auditor willingness to challenge controlling shareholders on related-party disclosure is limited in Vietnam.

**Common VAS related-party issues:**
- Loans to subsidiaries at below-market rates (subsidy to affiliates)
- Sales to related parties at above-market prices (inflates parent revenue)
- Guarantees for related-party debt (hidden off-balance-sheet liability)
- Management fees charged by parent to subsidiaries (extracts value from minority shareholders)

**Adjustment:** Read the related-party note carefully; if related-party sales > 20% of total revenue, investigate pricing; if parent guarantees exceed 50% of parent equity, flag as off-balance-sheet risk.

### Lease Accounting

**VAS Rule:** Operating leases are off-balance-sheet; only finance leases are capitalized.

**IFRS 16 Rule:** Most leases (above materiality thresholds) must be capitalized; creates "right-of-use asset" on balance sheet and lease liability.

**Impact:**
- Retail companies (MWG, PNJ, pharmaceutical chains): significant operating leases for store premises; VAS balance sheet understates both assets and liabilities
- **Adjustment:** For retail analysis, request total minimum lease commitment (in notes); capitalize using discount rate; adjust D/E and EV accordingly
- Typical adjustment for large retailers: adds 1.5-3.0× annual rental expense to both assets and liabilities

---

## 2. SOE-Specific Accounting Considerations

State-owned enterprises and partial privatizations (equitization) have additional accounting quirks beyond standard VAS.

### State Subsidies Embedded in Accounts
- Some SOEs receive subsidized inputs (land at below-market cost, energy subsidies, concessionary financing from state banks)
- These are often NOT disclosed as explicit subsidies — they appear as lower COGS or interest expense
- **Consequence:** SOE margins look artificially better than private company peers; margin comparison is distorted
- **Identification:** Compare SOE's gross margin to fully private peers in same sector; if consistently 5-10% higher, investigate subsidy hypothesis

### Land Use Rights — The Hidden Variable
- Under VAS: land use rights are capitalized as intangible assets and amortized over the lease term (typically 50 years)
- **Problem 1:** Land use rights carried at historical cost; in Vietnam, land prices have risen 300-1000% in major cities since 2010; book value of land may be a tiny fraction of market value
- **Investment implication:** Companies with large land holdings at historical cost have hidden value not reflected in book value — this is a legitimate "asset" story for long-term investors
- **Problem 2:** "Book value" calculated from VAS balance sheets includes amortized land at cost; P/B of 1.0 for a company with prime urban land is NOT the same as buying assets at cost — assets are worth far more
- **Problem 3:** SOEs sometimes revalue land to market for equity-raising purposes; this revaluation inflates equity without generating cash — be cautious of "book value growth" from revaluation

### Short-Term Bank Debt — Refinancing Risk
- Many Vietnam companies (especially SOEs) use rolling short-term bank debt (90-180 day loans) to fund long-term assets
- This appears in current liabilities as "short-term bank borrowings" and can be very large relative to equity
- **Risk:** If a bank declines to roll over a facility, the company faces immediate liquidity crisis
- **Identification:** Current ratio < 1.0 + large short-term bank borrowings + negative FCF = high refinancing risk
- **2022-2023 real estate crisis:** This was the mechanism — overleveraged developers using short-term bank facilities for long-duration real estate projects; when banks tightened credit, developers couldn't roll debt

---

## 3. Adjustment Protocol for Micro-Analyst

This five-step protocol applies to every company analysis. Do not skip steps.

### Step 1: OCF/Net Income Quality Check
Calculate: OCF ÷ Net Income (use trailing 12 months; if quarterly data available, use full-year)
- If ratio < 0.7: apply qualitative haircut; note earnings quality concern; shift to OCF-based valuation
- If ratio is negative (negative OCF, positive net income): investigate before proceeding — this is a serious flag

### Step 2: Receivables Days Trend
Calculate: (Accounts Receivable ÷ Revenue) × 365 for current year and prior 2 years
- If rising >30% year-over-year without corresponding business model change: investigate collection quality
- Compare to stated payment terms in annual report (if disclosed); mismatch = red flag
- Note: end-of-year spikes in receivables then resolved in Q1 may indicate channel stuffing

### Step 3: Inventory Days Trend
Calculate: (Inventory ÷ COGS) × 365 for current year and prior 2 years
- If rising >50% year-over-year without revenue growth: demand problem → risk of write-down
- If inventory composition changed (raw materials vs. finished goods): check for demand-driven WIP buildup vs. completion delays

### Step 4: Non-Recurring Items in EBIT
Review income statement for:
- Gain/loss on disposal of assets (add back if positive, deduct if negative, for normalized EBIT)
- Insurance claim payments (one-time positive)
- Restructuring charges (one-time negative)
- Write-downs and write-backs of inventory, receivables, or investments
- **Normalized EBIT = Stated EBIT ± one-time items**; use normalized EBIT in EV/EBITDA calculation

### Step 5: Related-Party Transaction Review
Check notes to financial statements:
- Identify all related parties (parent, subsidiaries, associated companies, key management)
- Quantify: related-party sales as % of total revenue; related-party purchases as % of total COGS
- Identify any inter-company loans outstanding; check rates vs. market
- Identify any guarantees provided by the company for related-party debt
- **Flag if:** related-party transactions > 20% of any major line item; or guarantees > 30% of equity

---

## 4. Red Flags Specific to Vietnam Listed Companies

### Pledged Shares — Margin Call Risk
- Controlling shareholders sometimes pledge their personal shares as collateral for personal loans
- When they do: if the stock price falls significantly, lenders issue margin calls; to meet calls, shares must be sold → forced selling creates additional downside pressure
- **Discovery:** Annual disclosures on major shareholder holdings note pledged shares; cafef.vn often tracks this; SSC disclosures
- **Risk threshold:** If controlling shareholder has pledged >30% of their holdings, margin call risk is meaningful
- **Investment implication:** Avoid building position during stock price declines if you know shares are heavily pledged — the forced selling amplifies volatility

### Offshore Related-Party Loans (Fund Diversion)
- Structure: Vietnam listed company loans funds to an offshore subsidiary; offshore subsidiary uses funds for non-disclosed purposes (not reported to regulators); reduces assets available to shareholders
- **Identification:** Look for large "loans to related parties" or "investments in foreign subsidiaries" in balance sheet notes; trace to offshore entity; check if offshore entity has any operating activity
- **Red flag:** large offshore balance + no disclosed activity + principal is a family member = serious concern
- Historical Vietnam cases: several mid-cap companies have had offshore fund diversion discovered; stock prices crashed 60-90% after disclosure

### Land Use Right Revaluation Uplifts
- Company revalues land use rights to market value for purposes of an equity raise or merger
- Revaluation credited to equity → book value rises → P/B looks artificially low → appears cheap
- Cash has not changed; operating capacity has not changed; only accounting entry changed
- **Identification:** Sudden jump in equity without corresponding profit accumulation or equity issuance; check for "revaluation reserve" in equity section; check notes for revaluation assumptions

### Short-Term Bank Debt Surge
- Warning signal: short-term bank borrowings growing faster than revenue over 2+ consecutive quarters
- Especially dangerous: short-term borrowings growing while OCF is declining or negative
- Vietnam banks have periodically "called in" loans during tightening cycles → companies face sudden refinancing pressure
- **Investment rule:** If short-term bank debt ÷ current assets > 40% AND OCF < short-term debt service = high liquidity risk; underweight or avoid

---

## 5. How to Access Vietnam Financial Data

| Source | URL | Best For | Cost |
|--------|-----|---------|------|
| HOSE Investor Relations | hsx.vn | Audited annual reports (Vietnamese and English where available), quarterly financials | Free |
| HNX Investor Relations | hnx.vn | Same as HOSE for HNX-listed companies | Free |
| CafeF Financial Summary | cafef.vn | Ratio screening, quick financial summary, historical data (10 years) | Free |
| Vietstock | vietstock.vn | Peer comparisons, ratio tables, basic charting | Free with registration |
| FiinPro (FiinGroup) | fiingroup.vn | Institutional-grade; detailed financials, consensus forecasts, ownership data | Subscription ~$3,000-5,000/year |
| VnDirect Research | vndirect.com.vn | Sell-side models and forecasts; free for some reports | Partially free |
| SSI Research | research.ssi.com.vn | Major broker; VN30 coverage | Registration required |
| MBS Research | mbs.com.vn | Good coverage of mid-caps | Registration required |
| Bloomberg Terminal | bloomberg.com | Most complete; VAS financials in standardized format | Institutional subscription |
| Damodaran's site | pages.stern.nyu.edu/~adamodar | Country risk premium, WACC components, sector multiple benchmarks | Free |
