# MarketBrain AI — deployment notes

MarketBrain is currently a static GitHub Pages app. Static hosting cannot keep an OpenAI secret private or run a server-side proxy. The new assistant client calls `/api/chat`; this Vercel function keeps the provider key off the browser and supports text plus chart images.

## One-time owner setup

1. Import this repository into Vercel and deploy it as a static site with the included `api/chat.js` serverless function.
2. In Vercel → Project → Settings → Environment Variables, add:
   - `OPENAI_API_KEY`: your private OpenAI API key (server-side only)
   - `MB_AI_ENABLED`: `true`
   - Optional `MB_OPENAI_MODEL`: defaults to `gpt-6-luna`
3. Redeploy after adding the environment variables.
4. Open the Vercel deployment and test text chat and a chart screenshot. Do not put the key in the repository, HTML, or browser local storage.

The API route is deliberately disabled until `MB_AI_ENABLED=true`. OpenAI usage is billed to the MarketBrain owner account. The default model is GPT-6 Luna, OpenAI's efficient text-and-image model for high-volume workloads.

## Important before public launch

The included per-IP throttle is best-effort and resets with serverless instances. It is suitable for a private pilot, not a public product with uncontrolled usage. Before inviting the public, add sign-in and durable per-account quotas/usage metering (for example, Supabase Auth + a database or a durable rate-limit service), plus an owner-set monthly spend limit in the OpenAI dashboard. Do not treat IP throttling as a billing cap.

## Memory and records

The existing journal and conversation remain browser-local. The assistant can use the current conversation and the journal context MarketBrain already supplies. The local account now accumulates lifetime wins, losses, breakevens, realised P/L and profit factor, and shares those aggregate outcomes plus recent exits with the assistant. The order detail list is still capped at 200 records; the aggregate counters continue accumulating locally. These outcomes are from MarketBrain's built-in account, not broker-imported trades. This does **not** create cloud-synced or cross-device memory. A proper shared memory system still requires user sign-in and a private database, and should store structured trade/journal facts rather than silently training the model or treating its past answers as facts.

## Privacy

User prompts and any attached chart image are sent to OpenAI through this endpoint to generate a response. The browser-held OpenAI key is removed from the client flow. The existing journal, screenshots and chat history remain in local browser storage until a separately designed account/sync system is added.
