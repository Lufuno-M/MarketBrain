
# MarketBrain

**What the market did while you weren't looking, in plain words.**

MarketBrain restores context. It doesn't predict, and it doesn't give signals. Open a market and it tells you, in plain sentences, what changed, what didn't, and what's still unresolved, so you can come back to a chart without having to replay every candle.

It is one HTML file: `index.html`.

## What it does

- **Reads each market in plain words.** Gaps, swing highs and lows, and fib levels, read on 1m, 5m, 15m, 30m, 1h and 1d. A card opens on the timeframe where the most is happening.
- **Says when nothing happened.** A quiet market is reported as quiet.
- **Shows its reasoning.** Each card lists what it knows, what it infers, and what it can't tell.
- **Lets you mark the chart.** Levels, lines, zones and fibs, kept per market.
- **Keeps a journal** per market, with dated entries marked on the chart.
- **Answers questions** about the chart you're looking at, from quick questions with no key, or typed questions with an AI key.
- **Paper trading** with a full-screen order view and a screen that changes colour with the position.
- **Broker connection** (Alpaca first) so the same screen can respond to a real position. Read-only.

## Markets

Crypto (BTC, ETH, SOL, BNB, XRP) from Binance, with no key needed. Forex, gold, indices (SPX500, US30, NAS100) and US stocks from Twelve Data, which needs your own key. More instruments are in the `MARKETS` list at the top of the script; set `on:false` to hide one.

## Setting it up

1. Put `index.html` on GitHub Pages (or open it locally).
2. Footer, **Market data connection**: paste your Twelve Data key. It stays in your browser only.
3. Footer, **AI connection** (optional): paste a Gemini, GitHub Models or Anthropic key for typed questions.

## Connecting a broker

MarketBrain sends you to the broker to sign in and approve access. The broker sends you back with a one-time code, and a small service swaps it for a token. That service exists because the swap needs a client secret, and a secret can't sit in a public page.

1. **Register an app with Alpaca** and note its client ID and secret. The return address to register is the exact address of your MarketBrain page (the footer's **Broker connection** > Setup shows it).
2. **Deploy `broker-worker.js`** as a Cloudflare Worker. Add `ALPACA_CLIENT_ID`, `ALPACA_CLIENT_SECRET` (secret) and `ALLOWED_ORIGIN` (for example `https://lufuno-m.github.io`).
3. In MarketBrain, **Broker connection** > Setup: paste the client ID and the Worker's address, then Save.
4. Choose **Continue to Alpaca (paper)** first. Try live only after paper works.

What to know:
- MarketBrain only **reads** the account and positions. It does not place orders. The service refuses anything except those two reads.
- Alpaca's access scopes don't include a read-only trading option, so the token is broader than what MarketBrain uses. It lives in the browser tab only and disappears when the tab closes.
- A real position makes the screen green (in profit) or red (in drawdown) while its market is open. MarketBrain doesn't read your stop or target from the broker, so there is no "near stop" state for real positions. Paper positions have it.
- Exness, XM and Plus500 don't offer a sign-in connection a website like this can use. Their buttons open their sites.
- Alpaca covers US stocks, ETFs and crypto. Check it's available where you live.

## What it deliberately doesn't do

- No predictions, no trade calls, no win rates.
- No sample or demo candles.
- Paper fills use the latest loaded candle close. There's no slippage, commission or margin.
- Stop-loss and take-profit levels on paper positions are watched visually. They don't close anything.

## Files

- `index.html`: the app.
- `broker-worker.js`: the small connection service for broker sign-in. Only needed if you want the broker connection.
- `model/`: the core model.
