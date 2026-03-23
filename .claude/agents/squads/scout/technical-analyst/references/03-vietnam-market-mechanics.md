# Vietnam Market Mechanics — Technical-Analyst Reference

## Purpose
How Vietnam market structure affects technical signal interpretation. These mechanics make some standard technical analysis unreliable without adjustment.

## Daily Price Band (Most Critical)

**HOSE:** ±7% from reference price (previous close)
**HNX:** ±10% from reference price
**UPCoM:** ±15% from reference price

**Impact on technical analysis:**

| Situation | What Happens | Interpretation |
|-----------|-------------|----------------|
| Stock hits trần (ceiling, +7%) | All buy orders execute but no sellers at market → stock may "open ceiling" for multiple days | This is NOT a natural technical level — it's a regulatory artifact |
| Stock hits sàn (floor, −7%) | All sell orders execute but no buyers at market → trapped sellers for days | Sàn creates forced holding; technical support levels become meaningless during sàn |
| Stock opens at the limit | Volume may be near zero if one side dominates | Volume data unreliable for that day |

**Rule:** Never trade a stock that has hit its daily band limit. Wait for the stock to trade freely before interpreting technical signals.

## ATC (At-the-Close) Auction at 14:30

**What happens:** A 10-minute closing auction at 14:30 concentrates institutional order flow. The final price is set by this auction.

**Impact:**
- Large price movements in the last 10 minutes (14:20-14:30) are often institutional rebalancing, not organic trading
- Volume spikes at the close may not confirm breakouts — they may be mechanical index rebalancing
- End-of-quarter and index rebalancing dates produce particularly distorted ATC prices

**Rule:** For intraday technical signals, use data only up to 14:15 (before ATC distortion begins). For daily signals, use the official close but be aware of ATC-driven noise.

## T+3 Settlement and Stop-Loss Execution

**T+3 rule:** Stocks purchased today cannot be sold until 3 trading days later.

**Impact on technical analysis:**

| Technical Action | T+3 Complication |
|-----------------|-----------------|
| Setting a stop-loss on today's purchase | Cannot execute for 3 days — if the stop triggers on day 1, you're still holding on day 3 |
| Cutting losses quickly | Impossible for positions within T+3 window |
| Breakout entry + close on same day | Profits cannot be taken for 3 days |

**Technical-analyst rule:** For new entry recommendations, widen stop-loss to account for T+3 delay risk. Use 2.0 ATR stops (not 1.5) for positions entering today.

## Foreign Investor Flow Signals

**Where to find:** cafef.vn "Giao dịch khối ngoại" section; vietstock.vn foreign flow tracker.

**How to interpret:**
| Foreign Flow | Technical Signal Impact |
|-------------|------------------------|
| Net buying for 5+ consecutive sessions | Validates breakout signals — institutional demand genuine |
| Net selling for 10+ consecutive sessions | Overhangs any bullish technical signal — exit supply present |
| Sustained net buying at a support level | Strong support confirmation |
| Sudden reversal from buying to selling | Warning: institutional positioning change |

**Rule:** A bullish breakout with simultaneous foreign net selling is suspicious — foreign outflow creates overhead supply that can stall price advance.

## Volume Interpretation in Vietnam

**Volume signals:**
- Breakout volume: should be 2× the 20-day average volume minimum for confirmation
- Reversal volume: should exceed the trend's average volume (shows conviction)
- Low-volume moves: suspect in either direction — easily reversed

**Vietnam thinness issue:**
- Many mid-cap and small-cap stocks trade < $1M USD daily volume
- Technical signals are unreliable below $1M daily volume (500-1000 VND × daily shares traded)
- VN30 components are generally liquid enough for reliable technical analysis
- Below VN30: always check 20-day average volume before forming a technical thesis

## Market-Wide Context Signals

Before applying individual stock technicals, assess the market environment:

| Signal | Bullish Context | Bearish Context |
|--------|----------------|----------------|
| VN-Index vs. SMA200 | Above SMA200 | Below SMA200 |
| Market breadth | More stocks rising than falling | More falling than rising |
| VN30 technical score | Bullish | Bearish |
| Foreign flow (market-wide) | Net buying | Net selling >10 days |

**Rule:** Single-stock technical signals are more reliable when the market-wide context aligns with the signal direction. A bullish breakout in a bear market is suspect; a bullish breakout with a bullish market backdrop is strong.
