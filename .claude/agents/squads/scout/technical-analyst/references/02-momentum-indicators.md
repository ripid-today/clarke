# Momentum Indicators — Technical-Analyst Reference

## Purpose
Quantitative signal library. These are the core indicators for Vietnam equity technical analysis.

## RSI (Relative Strength Index, 14-period)

**Formula:** RSI = 100 − (100 / (1 + RS)) where RS = Average Gain / Average Loss over 14 periods

**Interpretation:**
- >70: Overbought — potential sell or pullback signal (not automatic sell — can stay overbought in strong trend)
- 30-70: Neutral range
- <30: Oversold — potential buy or bounce signal

**Divergence (stronger signal than level alone):**
- **Bearish divergence:** Price makes new high, RSI does NOT make new high → momentum weakening, potential reversal
- **Bullish divergence:** Price makes new low, RSI does NOT make new low → downside momentum weakening

**Vietnam application:** In trending markets, RSI often stays in 50-80 range (uptrend) or 20-50 range (downtrend). Don't fade a trend purely on overbought RSI — wait for divergence or break of trend.

## MACD (Moving Average Convergence Divergence — 12/26/9 EMA)

**Components:**
- MACD Line = 12-day EMA − 26-day EMA
- Signal Line = 9-day EMA of MACD Line
- Histogram = MACD Line − Signal Line

**Interpretation:**
| Signal | Condition |
|--------|-----------|
| Bullish crossover | MACD line crosses above signal line |
| Bearish crossover | MACD line crosses below signal line |
| Zero line cross (bullish) | MACD line crosses above zero → trend change confirmation |
| Histogram expanding positive | Bullish momentum strengthening |
| Histogram shrinking | Momentum losing strength — early warning of potential reversal |

**Best use:** MACD is a trend-following indicator. False signals in sideways markets. Most reliable when used WITH price patterns (e.g., MACD bullish crossover + price breaking above resistance = strong signal).

## Bollinger Bands (20-day SMA ± 2 standard deviations)

**Components:**
- Middle band: 20-day SMA
- Upper band: 20-day SMA + 2σ
- Lower band: 20-day SMA − 2σ

**Interpretation:**
| Signal | Condition |
|--------|-----------|
| Squeeze | Bands narrow (low volatility) → impending breakout |
| Band walk | Price stays at upper band in uptrend → strong bullish trend |
| Mean reversion | Price touches lower band + oversold RSI → bounce candidate |
| False breakout | Price breaks above upper band with no volume → likely to snap back |

**Vietnam note:** Bollinger Band squeezes on HOSE stocks often resolve in the direction of the prevailing market trend. When VN-Index is above SMA200, squeeze resolutions tend to be bullish.

## Moving Averages

**Key MAs and their roles:**
| MA | Period | Role |
|----|--------|------|
| SMA20 | 20-day | Short-term trend direction, short-term support in uptrend |
| SMA50 | 50-day | Medium-term trend, important support level |
| SMA200 | 200-day | Long-term trend; above = bull market, below = bear market |

**Golden Cross:** SMA50 crosses above SMA200 → bullish long-term signal (lagging, but reliable)
**Death Cross:** SMA50 crosses below SMA200 → bearish long-term signal

**Vietnam note:** VN30 components are the most reliable for MA analysis. Small-caps can have erratic price action that makes MA signals noisy.

## ATR (Average True Range, 14-day)

**Purpose:** Measures volatility to calibrate stop-loss placement and position sizing.

**ATR = Average of True Range over 14 days**
- True Range = Max(High − Low, |High − Prev Close|, |Prev Close − Low|)

**Use in stop-loss placement:**
- Conservative stop: Entry − (1.5 × ATR)
- Standard stop: Entry − (2.0 × ATR)

**Use in position sizing (Planner's 2% rule):**
- Maximum position size = (2% × Portfolio Value) / (ATR per share)

**Vietnam application:** T+3 means you cannot immediately exit if stopped out. For new positions, use 2.0 ATR stops (not 1.5) to account for execution delay.

## Combined Signal Framework

No single indicator is sufficient. Use signals in combination:

| Combination | Signal Strength |
|-------------|----------------|
| RSI oversold + Bullish divergence + MACD crossover | STRONG BUY signal |
| Price above SMA50+SMA200 + Bollinger band walk + RSI 50-70 | Strong uptrend confirmation |
| RSI overbought + Bearish divergence + MACD histogram shrinking | STRONG SELL/caution signal |
| Bollinger squeeze + Price at key S/R | Watch for breakout in either direction |
