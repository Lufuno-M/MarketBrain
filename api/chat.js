// MarketBrain's server-side OpenAI proxy.
// Configure OPENAI_API_KEY and MB_AI_ENABLED=true in the deployment environment.
// Never put the provider key in index.html or browser storage.

const MODEL = process.env.MB_OPENAI_MODEL || 'gpt-4.1-mini';
const MAX_MESSAGES = 12;
const MAX_TEXT_CHARS = 12000;
const MAX_SYSTEM_CHARS = 18000;
const MAX_IMAGE_BYTES = 3_000_000;

// Best-effort per-instance throttle for pilot deployments. Serverless instances can
// reset; production multi-user quotas require durable auth + shared rate-limit storage.
const windows = globalThis.__mbAiWindows || (globalThis.__mbAiWindows = new Map());
function throttle(ip) {
  const now = Date.now();
  const old = windows.get(ip) || [];
  const recent = old.filter(t => now - t < 60_000);
  if (recent.length >= 8) return false;
  recent.push(now);
  windows.set(ip, recent);
  if (windows.size > 4000) {
    for (const [key, values] of windows) {
      if (!values.length || now - values[values.length - 1] > 60_000) windows.delete(key);
    }
  }
  return true;
}
function send(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.end(JSON.stringify(body));
}
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Use POST for an assistant message.' });
  if (process.env.MB_AI_ENABLED !== 'true') return send(res, 503, { error: 'MarketBrain AI is not enabled yet.' });
  if (!process.env.OPENAI_API_KEY) return send(res, 503, { error: 'MarketBrain AI is not configured yet.' });

  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return send(res, 403, { error: 'This MarketBrain site is not permitted to use the assistant.' });
    } catch (_) {
      return send(res, 403, { error: 'Invalid request origin.' });
    }
  }
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '') || 'unknown';
  if (!throttle(ip)) return send(res, 429, { error: 'A few too many requests. Please wait a minute and try again.' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { return send(res, 400, { error: 'Invalid request body.' }); }
  }
  if (!body || typeof body !== 'object') return send(res, 400, { error: 'Invalid request body.' });
  const system = typeof body.system === 'string' ? body.system.slice(0, MAX_SYSTEM_CHARS) : '';
  const incoming = Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : [];
  if (!system || !incoming.length) return send(res, 400, { error: 'The assistant needs a question and its market context.' });
  const totalChars = system.length + incoming.reduce((sum, item) => sum + (item && typeof item.text === 'string' ? item.text.length : 0), 0);
  if (totalChars > 24000) return send(res, 413, { error: 'That conversation is too long for one request. Start a new conversation or shorten the attached context.' });

  const messages = [{ role: 'system', content: system }];
  for (const item of incoming) {
    if (!item || !['user', 'assistant'].includes(item.role) || typeof item.text !== 'string') continue;
    const text = item.text.slice(0, MAX_TEXT_CHARS);
    if (item.role === 'user' && body.image && item === incoming[incoming.length - 1]) {
      const image = body.image;
      if (typeof image.dataUrl !== 'string' || !/^data:image\/(jpeg|png|webp);base64,/.test(image.dataUrl)) {
        return send(res, 400, { error: 'The attached chart must be a JPEG, PNG, or WebP image.' });
      }
      const encoded = image.dataUrl.split(',')[1] || '';
      if (encoded.length > MAX_IMAGE_BYTES * 1.4) return send(res, 413, { error: 'That chart image is too large. Please attach a smaller screenshot.' });
      messages.push({ role: 'user', content: [
        { type: 'text', text: text || 'Please analyse the attached chart image.' },
        { type: 'image_url', image_url: { url: image.dataUrl, detail: 'high' } }
      ]});
    } else {
      messages.push({ role: item.role, content: text });
    }
  }
  if (messages.length < 2) return send(res, 400, { error: 'No usable conversation messages were provided.' });

  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 750,
        temperature: 0.45
      })
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      // Do not expose provider response headers, key, or raw internal details.
      const status = upstream.status === 429 ? 429 : 502;
      return send(res, status, { error: upstream.status === 429 ? 'MarketBrain AI is temporarily busy. Please try again shortly.' : 'MarketBrain could not get an AI reply. Please try again.' });
    }
    const answer = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (typeof answer !== 'string' || !answer.trim()) return send(res, 502, { error: 'The AI returned an empty reply. Please try again.' });
    return send(res, 200, { answer: answer.trim() });
  } catch (_) {
    return send(res, 502, { error: 'MarketBrain could not reach its AI service. Please try again.' });
  }
};
