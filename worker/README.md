# Ask David: Cloudflare Worker

The serverless brain behind the chatbot on [djmorgan26.github.io](https://djmorgan26.github.io).

GitHub Pages is static; it can't run a model or hold a secret. This Worker does both:
it injects David's knowledge base + guardrails server-side, rate-limits per IP, and streams
a reply from **Cloudflare Workers AI** (the free, built-in `@cf/meta/llama-4-scout-17b-16e-instruct`
model, no third-party API key needed for the primary path).

```
Browser (GitHub Pages JS)  ──POST /chat──▶  this Worker  ──▶  Workers AI  ──stream──▶  browser
                                                  │ (on CF error / quota 4006)
                                                  └──▶  Groq free tier  ──stream──▶  browser
```

## Staying up for free: the Groq fallback

Cloudflare's free Workers AI tier shares **one daily neuron quota across all its
models** (exhaustion surfaces as error `4006`), so a busy day takes the whole bot
down and switching CF models would not help. The fix that stays at $0: retry on
**Groq's free tier**, which is a separate quota pool. The Worker reshapes Groq's
OpenAI-style stream into the same frames the widget already parses, so the
browser is unchanged.

- Fallback runs **only** when `GROQ_API_KEY` is set. With no key, the Worker is
  CF-only, exactly as before.
- Get a free key at <https://console.groq.com> (no card required), then:

  ```bash
  npx wrangler secret put GROQ_API_KEY   # paste the gsk_... key when prompted
  ```

- Model is set by `GROQ_MODEL` in `wrangler.toml` (default `llama-3.3-70b-versatile`).

## Files

- `src/index.js`: the Worker: CORS lock, KV rate limit, system prompt, streaming proxy.
- `wrangler.toml`: Worker config (AI binding + KV binding for rate limiting).
- `package.json`: pins `wrangler`.

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

If `chatbot_endpoint` is blank, the widget hides itself; the site never breaks.

## Verify

```bash
# On-topic: should stream a warm answer about David.
curl -N -X POST "$URL/chat" -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"What does David work on?"}]}'

# Off-topic: should politely redirect to talking about David.
curl -N -X POST "$URL/chat" -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Write me a poem about cats."}]}'
```

## Tuning

- Model / temperature / `max_tokens`: `MODEL` and `GEN_PARAMS` at the top of `src/index.js`.
- Rate limit: `RATE_LIMIT` and `RATE_WINDOW_SECONDS`.
- Knowledge base + guardrails: `SYSTEM_PROMPT`.
- Free fallback provider: `GROQ_URL` / `GROQ_MODEL` in `src/index.js`; enable by setting
  the `GROQ_API_KEY` secret (see "Staying up for free" above).

## Test

```bash
npm test        # fast, deterministic, no network: routing, CORS, validation,
                # rate limit, clamping, streaming, both error paths, the Groq
                # fallback (mocked), plus the widget's URL-safelist + marker parser.
npm run eval    # hits the LIVE worker with golden questions; set ANTHROPIC_API_KEY
                # for the optional LLM judge. Writes test/baseline.json.
```
