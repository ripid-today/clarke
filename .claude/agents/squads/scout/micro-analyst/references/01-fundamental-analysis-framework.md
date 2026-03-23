# Fundamental Analysis Framework

## 1. Income Statement Analysis

### Gross Margin
- **Definition:** (Revenue − COGS) ÷ Revenue
- **What it tells you:** Pricing power and unit economics; strips out operating and financial leverage
- **Stability = pricing power:** A company maintaining 35%+ gross margin across cycles has structural competitive advantage (brand, switching costs, or cost leadership)
- **Compression signals:** Commoditization pressure, rising input costs without pricing power, new competitors undercutting on price
- **Vietnam benchmarks by sector:**
  - Manufacturing/industrial: 10-20% is typical; >25% = strong position
  - Consumer staples: 25-40% typical; VNM historically 35-40%
  - Technology/services: 40-60%; FPT's IT services ~40-50%
  - Banking: not applicable (use NIM instead)

### EBITDA Margin
- **Definition:** EBIT + Depreciation + Amortization, as % of revenue
- **Why useful:** Normalizes for capital structure (removes interest) and investment age (removes D&A)
- **Best use:** Cross-sector comparison (asset-heavy vs. asset-light companies); M&A valuation
- **Warning:** EBITDA is not cash flow — high EBITDA with low OCF = earnings quality problem
- **EV/EBITDA ranges:** 6-8× = value territory; 12-15× = quality growth premium; >20× = requires exceptional growth to justify

### Net Margin
- **Definition:** Net income ÷ Revenue
- **Vietnam-specific warning:** Below-the-line items are common in VAS-reported accounts:
  - Non-operating gains from asset sales (inflates net income; not recurring)
  - Financial income from interest on deposits (often inflates margins for cash-rich companies)
  - Provisions and write-backs (manipulated timing is a VAS weakness)
- **Red flag:** Net margin significantly higher than EBIT margin → large below-the-line gains distorting picture
- **Normalize:** Strip out non-operating items before using net income in any P/E or earnings quality analysis

### EPS Growth Rate
- **Calculation:** 3-year trailing CAGR preferred (single-year growth is noisy); use diluted EPS
- **Vietnam context:** Shares outstanding must be checked — many Vietnam companies dilute through rights issues, warrants, and ESOP; always use per-share metrics not absolute profit
- **Quality check:** EPS growth driven by revenue growth = high quality; EPS growth driven only by margin expansion = limited sustainability; EPS growth from buybacks = financial engineering (rare in Vietnam)

### Revenue Quality Assessment
- **Recurring vs. one-time:** Service subscription revenue > project revenue > asset sales
- **Organic vs. acquisition-driven:** Track revenue growth vs. entity count; acquisition-driven growth can mask organic stagnation
- **Customer concentration:** >30% from a single customer = significant revenue quality risk; relevant for component manufacturers in Samsung ecosystem

---

## 2. Balance Sheet Analysis

### Liquidity Ratios

**Current Ratio = Current Assets ÷ Current Liabilities**
- >2.0 = strong liquidity (Graham's defensive criterion)
- 1.5-2.0 = adequate for most businesses
- 1.0-1.5 = tight; monitor closely especially for highly seasonal businesses
- <1.0 = potential cash crisis; requires investigation of debt structure and credit facilities
- Vietnam context: many Vietnam companies maintain lower current ratios (1.2-1.5) by relying on short-term bank credit lines; check if credit lines are committed (contract) or uncommitted (can be revoked)

**Quick Ratio = (Current Assets − Inventory) ÷ Current Liabilities**
- More conservative than current ratio; removes inventory (which may not be liquid)
- Critical for: manufacturing, retail (inventory-heavy businesses where inventory valuation matters)
- >1.0 = adequate; <0.8 = inventory is load-bearing for liquidity (risk if demand drops)

### Solvency Ratios

**Debt-to-Equity = Total Financial Liabilities ÷ Shareholders' Equity**
- Use total interest-bearing debt (short-term loans + long-term debt); exclude trade payables and operating liabilities
- <0.5 = conservative capital structure; company self-funds most investment
- 0.5-1.5 = moderate leverage; typical for established industrial companies
- 1.5-3.0 = elevated leverage; acceptable for real estate developers, infrastructure (asset-backed) but watch refinancing risk
- >3.0 = high-risk balance sheet; one business shock away from covenant breach
- **Vietnam-specific risk:** Many Vietnam companies use short-term rolling credit for long-term investment (mismatch); this is disguised in a snapshot D/E but creates refinancing crisis risk

**Net Debt = Total Financial Liabilities − Cash and Cash Equivalents**
- Net debt negative (net cash position) = quality signal; company is a cash generator
- Net debt positive and rising relative to EBITDA = leverage building; check use of funds
- Net Debt/EBITDA: <1.5× = manageable; 1.5-3.0× = moderate; >3.0× = concerning (especially for cyclical businesses)

### Efficiency Ratios (Critical for VAS-adjusted Analysis)

**Receivables Days = (Accounts Receivable ÷ Revenue) × 365**
- Measures how long it takes to collect from customers
- Baseline varies by sector: construction can have 60-90 days (B2G), consumer goods should be <30 days
- **Rising trend = red flag:** Customers not paying on time (deteriorating quality), or company booking revenue before cash collection (VAS recognition games)
- Check: compare receivables days to stated credit terms in annual report

**Inventory Days = (Inventory ÷ COGS) × 365**
- Measures how long inventory sits before sale
- Sector benchmarks: consumer retail 30-60 days, manufacturing 45-90 days, construction materials 60-120 days
- **Rising trend (especially >50% year-over-year without revenue growth):** Demand problem — goods aren't selling; forces future markdown or write-down
- **Falling trend during revenue growth:** Positive — production efficiency improving

---

## 3. Cash Flow Analysis — The Most Important Section

### Operating Cash Flow (OCF)
- **Definition:** Cash generated by the core business operations (before investment and financing)
- **Why it's the most important line:** OCF cannot be manipulated as easily as net income under VAS; it's actual cash movement through the business
- **OCF vs. Net Income comparison:** If net income is growing but OCF is flat or declining, investigate — likely earnings quality problem (booked revenue not collected; expenses deferred)

### OCF/Net Income Ratio — The Earnings Quality Test
This ratio is the micro-analyst's first earnings quality check for every company analyzed.

| OCF/Net Income | Quality Signal | Action |
|----------------|---------------|--------|
| >0.9 | Excellent quality | Use stated earnings with confidence |
| 0.8-0.9 | High quality | Minor adjustment warranted |
| 0.7-0.8 | Acceptable | Flag and investigate receivables and accruals |
| 0.5-0.7 | Moderate concern | Apply 20-30% haircut to stated earnings; investigate |
| <0.5 | Serious quality concern | Do NOT use stated earnings in valuation; use OCF-based valuation instead |
| Negative OCF, Positive Net Income | Earnings likely fictitious | Requires deep investigation before any investment |

### Free Cash Flow (FCF)
- **Definition:** FCF = OCF − CapEx
- **Positive FCF:** Company generates more cash than it invests; can fund dividends, buybacks, debt repayment, or growth without external capital
- **Negative FCF:** Company requires external capital (debt or equity issuance) to fund operations + investment — not inherently bad if growth investment is the cause, but requires context

**FCF Yield = FCF ÷ Market Capitalization**
- >8% = deeply attractive on FCF basis (Graham-Buffett buy zone)
- 5-8% = cheap to fair value
- 3-5% = fairly priced
- <2% = expensive on FCF basis; growth must justify premium
- Negative = company burning cash; no FCF-based valuation applicable

### CapEx Intensity
- **Rising CapEx as % of revenue:** Two interpretations — (1) growth investment = positive (new capacity, new markets), (2) maintenance burden = negative (aging infrastructure requiring heavy reinvestment)
- **Differentiation:** Growth CapEx = new factories, new geographic expansion, new product lines; Maintenance CapEx = replacing worn equipment, mandatory safety upgrades
- **Ask the company:** annual reports often break CapEx into growth and maintenance; if not, analyst must infer from context and asset age

---

## 4. Key Ratios and Vietnam Benchmarks

### Price-Based Ratios

**P/E Ratio (Price-to-Earnings)**
- Current trailing P/E for VN-Index: historically 12-16× in normal market conditions; 8-10× at market bottoms; 18-22× near peaks
- Quality growth premium: 20-25× forward P/E acceptable for businesses growing EPS at 20%+ with strong OCF
- Cheap threshold: P/E < 10× trailing for a profitable, growing business with no structural problems = potentially cheap
- **Always compare to:** (1) own historical range, (2) sector peers, (3) intrinsic value

**P/B Ratio (Price-to-Book)**
- Standard: Vietnam companies 1.5-2.5× typical; below 1.0 = statistically cheap (assets > market price)
- Banking: 1.0-2.0× typical due to Basel capital constraints; >2.0× requires ROE justification (>15% ROE)
- Asset-heavy industrials (HPG, cement): 1.0-1.5× typical; book value is meaningful
- **VAS warning:** Book value includes land use rights at historical cost in VAS — may significantly understate actual asset value for land-holding companies, or overstate for companies with impaired assets

**ROE (Return on Equity)**
- Definition: Net Income ÷ Average Shareholders' Equity
- >15% sustained (5+ years) = quality business with durable competitive advantage
- 10-15% = adequate; requires growth story for premium valuation
- <10% = poor capital allocation; destroys value unless deeply discounted
- **Vietnam caveat:** ROE can be inflated by leverage; always check alongside D/E ratio — high ROE + high D/E = financial engineering, not business quality

**EV/EBITDA**
- EV = Market Cap + Net Debt (enterprise value)
- Most useful for: companies with varying capital structures (can't compare P/E across heavily indebted vs. cash-rich companies)
- Vietnam benchmarks: 5-7× = value; 8-12× = fair; 12-20× = growth premium required
- Use for sector peer comparison (same sector, different capital structures)

**Dividend Yield**
- Vietnam listed companies: typical 2-6% yield; above 7% = either genuinely cheap OR dividend is unsustainable
- **Sustainability check:** Is dividend < FCF? If dividend > FCF, company is borrowing to pay dividends = red flag
- Vietnamese companies favor stock dividends (bonus shares) over cash dividends — check the actual cash yield vs. total yield

---

## 5. DCF Basics (Planner's Preferred Valuation Method)

### DCF Formula
Intrinsic Value = PV(FCF for explicit forecast period) + PV(Terminal Value)

Terminal Value = FCF_n × (1 + g) ÷ (WACC − g)

Where:
- FCF_n = FCF in the final explicit forecast year
- g = long-run terminal growth rate
- WACC = weighted average cost of capital

### Vietnam WACC Estimation
| Component | Value | Notes |
|-----------|-------|-------|
| Risk-free rate | 4.0-4.5% | SBV refinancing rate (or 10-year VGB yield when available) |
| Equity risk premium | 9-10% | Vietnam country-specific; higher than developed markets due to political, legal, and market risks |
| Size/liquidity premium | 2-3% | Mid-cap Vietnam stocks illiquid vs. global standards |
| **Total WACC (equity)** | **15-17%** | Typical for mid-cap Vietnam; 13-15% for large-cap VN30 names |
| Cost of debt | 7-10% | Vietnam bank lending rates for corporate loans |

### Conservative DCF Approach for Vietnam
1. Use 50-70% of analyst consensus growth rate (Vietnam analysts historically overoptimistic)
2. Terminal growth rate: use Vietnam nominal GDP growth ~9-10% as ceiling; 6-7% as central case
3. Run three scenarios: bear (WACC + 2%, growth − 2%), base, bull (WACC − 1%, growth + 1%)
4. Intrinsic value = average of base case ± 20% for uncertainty band
5. **Buy discipline:** Only buy if current price < intrinsic value base case × 0.7 (30% margin of safety, per Graham)

### DCF Limitations (Must State When Using)
- Highly sensitive to WACC and terminal growth — small changes produce large value changes
- Does not capture optionality (expansion potential, M&A targets)
- Requires reliable FCF forecast — not possible for companies with unreliable OCF
- Best used as: sanity check on whether P/E and P/B imply reasonable growth assumptions, not as primary valuation for buy/sell decisions

---

## 6. Sources for Financial Data

| Source | URL | Data Available |
|--------|-----|---------------|
| HSX (HOSE) | hsx.vn | Audited annual reports (IR section), quarterly disclosures |
| HNX | hnx.vn | HNX-listed company financials |
| CafeF | cafef.vn | Aggregated financial summaries, ratio screening, historical data |
| Vietstock | vietstock.vn | Comparative financial data, peer screens, charting |
| FiinGroup | fiingroup.vn | Institutional-grade data (subscription required) |
| Damodaran | pages.stern.nyu.edu/~adamodar | Country-level risk premiums; WACC inputs; sector multiples |
| VnDirect Research | vndirect.com.vn | Sell-side research reports (free access to some) |
| SSI Research | ssi.com.vn | Another major local broker; research on VN30 stocks |
