
# MarketBrain

MarketBrain restores context. It does not predict, signal, or trade.

You look away, the market keeps existing, and you come back missing a chapter. This page is a memory viewer for that chapter: what was recognised, what was confronted, what was accepted or rejected, what is still unresolved, and what changed while you were gone. There are no prices, candles, or indicators on it.

Open `index.html` in a browser. There is no build step and no dependencies.

## What you are looking at

Drag "you last looked at" and the page re-answers one question: what changed since then? If nothing did, it says so plainly. Silence is a correct output.

Three sections, and only three:

- **Timeline.** The event log, in words. Events from before you looked are dimmed.
- **Open.** Regions and claims that have not been confronted yet.
- **Resolved.** Regions that were accepted or rejected, and claims that met reality.

## How it works

The page reads one array of events (`E` in `index.html`). Everything else is a projection of that log, folded from the top. Nothing is stored as state.

```
Raw observations -> Primitives -> Regions -> Confrontations -> Narrative
```

Event kinds in this sketch:

| Event | Meaning |
|---|---|
| `Detected` | A detector recognised a region. Regions may carry `from`, the cause that spawned them. |
| `Touch` | Price came within tolerance of a region without going through it. |
| `Traversal` | Price went through a region. |
| `Return` | Price came back across it. |
| `Acceptance` | It held long enough to count. Carries `held` in minutes. |
| `Rejection` | Price was turned back. |
| `Declared` | You stated a claim about a region. |
| `Confronted` | Reality met that claim. |

To change the night, append events to `E`. Do not edit old ones. The log is append-only.

## Rules this page keeps

- The system records what you assert, never what it infers.
- Regions are not obligations. A region is the output of a declared detector. An obligation exists only where you declared a claim about it.
- Every region names its detector, version, timeframe, and parameters. Interpretation is allowed. Hidden interpretation is not.
- Resolution comes from confrontation with reality, not from activity or from changing your mind.
- Outcomes can spawn new regions, so the model is a cycle. The `from` field keeps the provenance.
- The sentence describes the resulting state, never the triggering event.
- No aggregate scores, averages, or diagnoses.

## What is real and what is sample

All events are written by hand. The night is invented and the levels are illustrative.

Only swing extremum, touch, traversal, return, and acceptance have drafted definitions. `FairValueGap` and `EqualHighs` appear in the sample as placeholders. They are not specified yet.

## Visual direction

White canvas, black text, size and weight for hierarchy. Sentence case, never all-caps. Hue as ambient light behind the page, not as chrome. Everything dissolves, nothing snaps. Objects are labelled like specimens, with hairlines instead of boxes.

## Open questions

- Should time held ever appear in a sentence, or stay in the label?
- Declaring a claim is the hardest interaction to make light. If it takes effort, most regions will carry no obligation. Is that acceptable?
- Do Touch, Traversal, Return, Acceptance, and Rejection belong under one Confrontation family with a subtype?
- What is the deterministic surface order when regions overlap?
- How does a beginner read a structural sentence without mistaking it for a signal?

## Publishing

To host on GitHub Pages: push to a repo, then Settings, Pages, deploy from the `main` branch root. The page is one self-contained file.
