# MarketBrain

**What the market did while you weren't looking, in plain words.**

MarketBrain restores context. It doesn't predict, and it doesn't give signals. Open a market and it tells you, in plain sentences, what changed, what didn't, and what's still unresolved, so you can come back to a chart without having to replay every candle.

It is one HTML file: `index.html`.

## What it does

- **Reads each market in plain words.** Gaps, swing highs and lows, and fib levels, read on 1m, 5m, 15m, 30m, 1h and 1d. A card opens on the timeframe where the most is happening.
- **Says when nothing happened.** A quiet market is reported as quiet.
- **Shows its reasoning.** Each card lists what it knows, what it infers, and what it can't tell.
- **Shows what's behind the market before you trade.** Opening a market puts a briefing above the chart: recent headlines for that market (GDELT) beside this week's scheduled economic releases (Forex Factory calendar). The only choices are to read on or go to trading. Headlines are what was reported, not proof of why price moved.
- **News button** at the top: what is moving every market this week (headlines and high impact releases), in one place.
- **Lets you mark the chart.** Levels, lines, zones and fibs, kept per market.
- **Keeps a journal** per market, with dated entries marked on the chart.
- **Answers questions** about the chart you're looking at, from quick questions with no key, or typed questions with an AI key.
- **Demo account** with R100,000 of pretend money against real prices. Buy and Sell open a full-screen order view, and the whole screen takes the colour of your position: green in profit, red in drawdown, faster and stronger near your stop or target. Balance, positions and orders are remembered in the browser.
- **Broker shortcuts** with each broker's icon (TradingView, Exness, XM, Plus500) in the header and under every chart. They open the broker's own site after a confirmation.

## Markets

Crypto (BTC, ETH, SOL, BNB, XRP) from Binance, with no key needed. Forex, gold, indices (SPX500, US30, NAS100) and US stocks from Twelve Data, which needs your own key. More instruments are in the `MARKETS` list at the top of the script; set `on:false` to hide one.

## Setting it up

1. Put `index.html` on GitHub Pages (or open it locally).
2. Footer, **Market data connection**: paste your Twelve Data key. It stays in your browser only.
3. Footer, **AI connection** (optional): paste a Gemini, GitHub Models or Anthropic key for typed questions.

## What it deliberately doesn't do

- No predictions, no trade calls, no win rates.
- No sample or demo candles.
- Demo fills use the latest loaded candle close. There's no slippage, commission or margin, and sizes convert to rand at a fixed demo rate (R18 to US$1).
- Stop-loss and take-profit levels on demo positions are watched visually. They don't close anything.

## Files

- `index.html`: the app.
- `model/`: the core model.
