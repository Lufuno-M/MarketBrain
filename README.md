# MarketBrain

MarketBrain restores context to people who trade or follow markets. It answers three questions when you return to a market after any absence: what changed, what did not, and what you believed before you left.

It is not a signal service, a trading bot, a watchlist or a dashboard. It never predicts, and it never tells you what to do.

## Why the purpose was re-examined

The first design was sentence-first: one ever-changing line per market, with charts deliberately withheld so the sentence would do the synthesis. Working through it exposed three problems.

1. **A market you cannot see is a market you are not drawn to.** Withholding the chart removed the pull to enter the market, which is part of why anyone opens a market tool at all. The chart stays, but as a door, not as the product.
2. **Studying and watching are different acts and were sharing one surface.** Interpreting what the 1-minute chart did overnight is reflective work. It belongs in a diary, read and written deliberately, not in a live view competing with the price.
3. **The home page was a market page.** A person returning after hours or days usually wants to know what the world did first. That is a front page, not a ticker.

The core idea survives unchanged: context, memory and perspective over prediction and speed.

## Principles

1. **Front page, not dashboard.** Home is an edition of dated reporting, headlines only. Nothing expands until you choose it.
2. **The chart is a door.** Opening a market shows one plain line chart, nothing decorative, so the market can attract you in.
3. **The journal is the memory.** Interpretation is shelved as dated entries beneath the chart, collapsed by default, treated as diary and not as a live feed.
4. **Known, inferred, uncertain stay separate.** Every briefing says what was reported (with its source) and what is still open. MarketBrain records what is reported or asserted and does not state its own inferences as fact.
5. **No timeframe is declared noise.** The chart offers 1m, 15m and 1h with equal standing. Fifteen minutes is fifteen minutes; a 1-minute sweep does not stop being real because it is small on a 5-minute chart. Liquidity pools and runs are treated as real structure, and no bias about which scale matters is built in.
6. **Absence is a first-class case.** Returning after sleep, work or a weekend is the central use. The system should be able to say what happened while you were away.
7. **Nothing happened is a valid entry.** Telling you that you do not need to be here is a success state.
8. **Describe structure, never advice.** Nothing in the product reads as a trade call.
9. **Calm over urgency.** White page, black text, one masthead. No colour signalling gain or loss, no jitter, no manufactured drama.

## What exists now

| Part | Status |
|---|---|
| Front page with expandable briefings | Working. The edition is set by hand in `NEWS`; a feed must replace it. |
| Market view with 1m/15m/1h line chart | Working for crypto through Binance public klines. Other markets, and any failed fetch, show a clearly labelled illustrative line. |
| Journal per market | Working, stored in the browser (`localStorage`). Private to that browser; not synced. |
| Market universe and search | Working. Fourteen symbols, hash routing so back and forward work. |
| State engine | Not built. This is the next real piece. |

## What is not yet solved

- **Prices for non-crypto markets** (SPX500, NAS100, EURUSD, XAUUSD, DXY) need a licensed or self-hosted source.
- **News** needs a feed and a rule for which items earn a place. The rule should be about relevance to markets you follow, not volume.
- **The State engine** should write journal entries automatically in a clearly different voice from yours: State before, Event, State after. Events (sweeps, reclaims, breaks of structure) update State, and only a change of dominant State produces an entry. It should also produce the "while you were away" entry, computed from the gap since you last looked.
- **Linked markets on a headline** are currently a judgment made by hand. Whether they should be stated by you, computed, or both is open. The earlier rule that MarketBrain records assertions and does not infer correlations still applies.
- **Beginner vocabulary.** Terms like sweep and reclaim need a quiet definition-on-demand so a structural description is never mistaken for a signal.

## Suggested order of work

1. Connect real prices and a news source.
2. Build the State engine and stress-test its entries against real sessions until they earn trust.
3. Add the away entry.
4. Sync the journal beyond one browser.

## Running it

Open `index.html`. It is a single file with no dependencies. Live crypto prices need network access to `api.binance.com`, which works when the file is served or opened from your own machine.
