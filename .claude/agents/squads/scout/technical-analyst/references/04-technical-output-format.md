# Technical Output Format — Technical-Analyst Reference

## Purpose
Standard output contract for all technical-analyst submissions. Every output must use this exact format.

## Standard Format

```
## Technical Analysis: [TICKER]
*Date: [YYYY-MM-DD] | Timeframe: Daily | Analyst: Technical-Analyst*

---

### Technical Score: [BULLISH / NEUTRAL / BEARISH]
*Confidence: [HIGH / MEDIUM / LOW]*

---

### Trend
- **Direction:** [Uptrend / Downtrend / Sideways]
- **Strength:** [Strong / Moderate / Weak]
- **Basis:** SMA20 [above/below] SMA50 [above/below] SMA200; price at [description of MA position]

---

### Momentum
- **RSI (14):** [value] — [Overbought / Neutral / Oversold] | Divergence: [None / Bullish / Bearish]
- **MACD:** [Bullish crossover / Bearish crossover / Neutral] | Histogram: [Expanding / Contracting / Flat]
- **Bollinger Bands:** [Band walk upper / Squeeze / Band walk lower / Mean / Description]

---

### Key Levels
- **Resistance 1:** [price] — [basis: prior high / pattern / round number]
- **Resistance 2:** [price] — [basis]
- **Support 1:** [price] — [basis: prior low / MA / pattern]
- **Support 2:** [price] — [basis]

---

### Entry Zone
- **Price range:** [low] – [high] VND
- **Confirmation condition:** [e.g., "close above [price] on above-average volume" / "RSI cross above 50" / "MACD bullish crossover confirmed"]
- **Note:** [Any Vietnam market mechanics relevant to entry — T+3, ATC timing, FOL room]

---

### Price Target
- **Target:** [price] VND
- **Method:** [Measured move from [pattern] / MA target / prior high]
- **Time horizon:** [weeks / months]

---

### Stop-Loss
- **Hard stop:** [price] VND ([%] below entry midpoint)
- **Method:** [ATR-based: [N] × ATR([value]) / below key support at [price]]
- **T+3 note:** [If entering today, stop cannot execute for 3 days — widened accordingly]

---

### Technical Score Integration
- **For Seer:** [How this technical picture supports or undermines the bull case]
- **For Planner:** [Any technical red flags that increase risk — breakdown signals, volume distribution, etc.]
```

## How Technical Score Feeds Commander

| Technical Score | Effect on Seer | Effect on Planner |
|----------------|----------------|------------------|
| BULLISH | Raises conviction score by 0-2 points | Lowers risk score by 0-1 point |
| NEUTRAL | No change to either | No change |
| BEARISH | Lowers conviction score by 1-2 points | Raises risk score by 1-2 points |

**Confidence level matters:**
- HIGH confidence BULLISH: strong signal with volume confirmation + multiple aligned indicators
- MEDIUM confidence: 2 of 3 indicators aligned, or pattern incomplete
- LOW confidence: indicators mixed or stock below $1M daily volume threshold

## Submission Protocol

- Label output: "Technical Analysis: [TICKER]"
- Submit to Scout dispatcher for aggregation
- Also send directly to Seer and Planner with the integration notes filled in
- Always state the timeframe (default: daily chart, 3-month lookback)
