# Ask David — Cloudflare Worker

The serverless brain behind the chatbot on [djmorgan26.github.io](https://djmorgan26.github.io).

GitHub Pages is static — it can't run a model or hold a secret. This Worker does both:
it injects David's knowledge base + guardrails server-side, rate-limits per IP, and streams
a reply from **Cloudflare Workers AI** (the free, built-in `@cf/meta/llama-3.1-8b-instruct`
model — no third-party API key anywhere).

```
Browser (GitHub Pages JS)  ──POST /chat──▶  this Worker  ──▶  Workers AI  ──stream──▶  browser
```

## Files

- `src/index.js` — the Worker: CORS lock, KV rate limit, system prompt, streaming proxy.
- `wrangler.toml` — Worker config (AI binding + KV binding for rate limiting).
- `package.json` — pins `wrangler`.

## Deploy (one-time)

All commands run with `npx wrangler` (no global install needed).

```bash
cd worker

# 1. Authenticate (opens a browser; the Cloudflare account owner clicks "Allow").
npx wrangler login

# 2. Create the rate-limit KV namespace, then paste the printed id into
#    wrangler.toml -> [[kv_namespaces]] id = "..."
npx wrangler kv namespace create RL

# 3. Deploy. Prints the live URL, e.g. https://ask-david.<subdomain>.workers.dev
npx wrangler deploy
```

Then set the endpoint in the site's `_config.yml`:

```yaml
chatbot_endpoint: "https://ask-david.<subdomain>.workers.dev/chat"
```

If `chatbot_endpoint` is blank, the widget hides itself — the site never breaks.

## Verify

```bash
# On-topic — should stream a warm answer about David.
curl -N -X POST "$URL/chat" -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"What does David work on?"}]}'

# Off-topic — should politely redirect to talking about David.
curl -N -X POST "$URL/chat" -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Write me a poem about cats."}]}'
```

## Tuning

- Model / temperature / `max_tokens`: top of `src/index.js`.
- Rate limit: `RATE_LIMIT` and `RATE_WINDOW_SECONDS`.
- Knowledge base + guardrails: `SYSTEM_PROMPT`.
- To swap to Groq/Gemini later: replace the `env.AI.run(...)` call and add the key via
  `npx wrangler secret put <NAME>`.
