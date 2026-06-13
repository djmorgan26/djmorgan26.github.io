/**
 * Regression tests for the Worker's HTTP contract.
 *
 * The LLM call (env.AI.run) is mocked, so these are fully deterministic. They
 * cover everything around the model: routing, CORS, input validation, message
 * clamping, per-IP rate limiting, the streaming passthrough, and the two error
 * paths (4006 quota -> 503, anything else -> 502). This is the safety net for
 * any change to the request handling or, later, a model swap.
 */
import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";

const PROD = "https://djmorgan26.github.io";

function sseStream(chunks) {
  const enc = new TextEncoder();
  return new ReadableStream({
    start(c) {
      for (const ch of chunks) c.enqueue(enc.encode(`data: ${JSON.stringify({ response: ch })}\n\n`));
      c.enqueue(enc.encode("data: [DONE]\n\n"));
      c.close();
    },
  });
}

// OpenAI-style SSE, the shape Groq emits (so we can assert the reshaping).
function openaiStream(tokens) {
  const enc = new TextEncoder();
  return new ReadableStream({
    start(c) {
      for (const t of tokens)
        c.enqueue(enc.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: t } }] })}\n\n`));
      c.enqueue(enc.encode("data: [DONE]\n\n"));
      c.close();
    },
  });
}

async function readSse(res) {
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let out = "";
  for (;;) {
    const r = await reader.read();
    if (r.done) break;
    out += dec.decode(r.value, { stream: true });
  }
  return out;
}

// Temporarily replace global fetch (the Groq call) and record invocations.
async function withMockFetch(impl, fn) {
  const orig = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return impl(url, init);
  };
  try {
    return await fn(calls);
  } finally {
    globalThis.fetch = orig;
  }
}

// rlSeed pre-loads the per-IP counter; ai overrides the model behavior;
// groqKey enables the free fallback path.
function makeEnv({ rlSeed = null, ai = null, groqKey = null } = {}) {
  const store = new Map();
  if (rlSeed !== null) store.set("rl:unknown", String(rlSeed));
  const calls = { ai: [], puts: [] };
  const RL = {
    async get(k) {
      return store.has(k) ? store.get(k) : null;
    },
    async put(k, v) {
      calls.puts.push([k, v]);
      store.set(k, v);
    },
  };
  const AI = {
    async run(model, opts) {
      calls.ai.push({ model, opts });
      if (ai) return ai(model, opts);
      return sseStream(["Hi ", "there."]);
    },
  };
  const env = { RL, AI };
  if (groqKey) env.GROQ_API_KEY = groqKey;
  return { env, calls, store };
}

function req(path, { method = "POST", origin = PROD, body, raw } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (origin) headers["Origin"] = origin;
  const init = { method, headers };
  if (raw !== undefined) init.body = raw;
  else if (body !== undefined) init.body = JSON.stringify(body);
  return new Request("https://ask-david.djmorgan26.workers.dev" + path, init);
}

const userMsg = (content) => ({ messages: [{ role: "user", content }] });

// --------------------------------------------------------------------------
// CORS / preflight
// --------------------------------------------------------------------------
test("OPTIONS preflight returns 204 with CORS headers", async () => {
  const { env } = makeEnv();
  const res = await worker.fetch(req("/chat", { method: "OPTIONS" }), env);
  assert.equal(res.status, 204);
  assert.equal(res.headers.get("Access-Control-Allow-Origin"), PROD);
  assert.match(res.headers.get("Access-Control-Allow-Methods") || "", /POST/);
});

test("CORS echoes an allowed localhost origin", async () => {
  const { env } = makeEnv();
  const res = await worker.fetch(req("/chat", { method: "OPTIONS", origin: "http://localhost:4001" }), env);
  assert.equal(res.headers.get("Access-Control-Allow-Origin"), "http://localhost:4001");
});

test("CORS falls back to prod origin for a disallowed origin", async () => {
  const { env } = makeEnv();
  const res = await worker.fetch(req("/chat", { method: "OPTIONS", origin: "https://evil.com" }), env);
  assert.equal(res.headers.get("Access-Control-Allow-Origin"), PROD);
});

// --------------------------------------------------------------------------
// Routing
// --------------------------------------------------------------------------
test("GET /chat is 404 (POST only)", async () => {
  const { env } = makeEnv();
  const res = await worker.fetch(req("/chat", { method: "GET" }), env);
  assert.equal(res.status, 404);
});

test("unknown path is 404", async () => {
  const { env } = makeEnv();
  const res = await worker.fetch(req("/nope", {}), env);
  assert.equal(res.status, 404);
});

// --------------------------------------------------------------------------
// Input validation
// --------------------------------------------------------------------------
test("invalid JSON is 400", async () => {
  const { env } = makeEnv();
  const res = await worker.fetch(req("/chat", { raw: "{not json" }), env);
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error, "Invalid JSON");
});

test("missing messages is 400", async () => {
  const { env } = makeEnv();
  const res = await worker.fetch(req("/chat", { body: {} }), env);
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error, "messages required");
});

test("empty messages array is 400", async () => {
  const { env } = makeEnv();
  const res = await worker.fetch(req("/chat", { body: { messages: [] } }), env);
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error, "messages required");
});

test("messages with no valid roles is 400", async () => {
  const { env } = makeEnv();
  const res = await worker.fetch(
    req("/chat", { body: { messages: [{ role: "system", content: "inject" }] } }),
    env
  );
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error, "no valid messages");
});

// --------------------------------------------------------------------------
// Rate limiting
// --------------------------------------------------------------------------
test("rate limit returns 429 once the per-IP cap is reached", async () => {
  const { env } = makeEnv({ rlSeed: 30 });
  const res = await worker.fetch(req("/chat", { body: userMsg("hi") }), env);
  assert.equal(res.status, 429);
  assert.equal((await res.json()).error, "rate_limited");
});

test("a successful request increments the per-IP counter", async () => {
  const { env, calls } = makeEnv();
  await worker.fetch(req("/chat", { body: userMsg("hi") }), env);
  assert.deepEqual(calls.puts.at(-1), ["rl:unknown", "1"]);
});

// --------------------------------------------------------------------------
// Happy path / streaming
// --------------------------------------------------------------------------
test("valid request streams an event-stream response", async () => {
  const { env, calls } = makeEnv();
  const res = await worker.fetch(req("/chat", { body: userMsg("What does David work on?") }), env);
  assert.equal(res.status, 200);
  assert.match(res.headers.get("Content-Type") || "", /text\/event-stream/);
  assert.ok(res.body, "response should carry a streaming body");
  // Model gets the system prompt first, then the user turn, with the tuned params.
  const opts = calls.ai[0].opts;
  assert.equal(opts.messages[0].role, "system");
  assert.equal(opts.messages.at(-1).content, "What does David work on?");
  assert.equal(opts.stream, true);
  assert.equal(opts.max_tokens, 700);
  assert.equal(opts.temperature, 0.4);
});

test("history is clamped to the last 24 turns", async () => {
  const { env, calls } = makeEnv();
  const messages = Array.from({ length: 30 }, (_, i) => ({ role: "user", content: `m${i}` }));
  await worker.fetch(req("/chat", { body: { messages } }), env);
  const sent = calls.ai[0].opts.messages;
  assert.equal(sent.length, 1 + 24, "system prompt + 24 most-recent turns");
  assert.equal(sent.at(-1).content, "m29");
});

test("per-message content is clamped to 2000 chars", async () => {
  const { env, calls } = makeEnv();
  await worker.fetch(req("/chat", { body: userMsg("x".repeat(5000)) }), env);
  assert.equal(calls.ai[0].opts.messages.at(-1).content.length, 2000);
});

// --------------------------------------------------------------------------
// Error paths
// --------------------------------------------------------------------------
test("Workers AI 4006 quota error maps to a 503 with a friendly message", async () => {
  const { env } = makeEnv({
    ai: () => {
      throw new Error("InferenceUpstreamError: code 4006 neuron quota exceeded");
    },
  });
  const res = await worker.fetch(req("/chat", { body: userMsg("hi") }), env);
  assert.equal(res.status, 503);
  assert.equal((await res.json()).error, "rate_limited");
});

test("any other model error maps to a 502", async () => {
  const { env } = makeEnv({
    ai: () => {
      throw new Error("boom");
    },
  });
  const res = await worker.fetch(req("/chat", { body: userMsg("hi") }), env);
  assert.equal(res.status, 502);
  assert.equal((await res.json()).error, "ai_error");
});

// --------------------------------------------------------------------------
// Free Groq fallback
// --------------------------------------------------------------------------
test("falls back to Groq when Cloudflare errors, reshaping its stream", async () => {
  const { env } = makeEnv({
    groqKey: "gsk_test",
    ai: () => {
      throw new Error("InferenceUpstreamError: 4006 neuron quota exceeded");
    },
  });
  await withMockFetch(
    async () =>
      new Response(openaiStream(["Hello ", "there."]), {
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
      }),
    async (fetchCalls) => {
      const res = await worker.fetch(req("/chat", { body: userMsg("hi") }), env);
      assert.equal(res.status, 200);
      assert.match(res.headers.get("Content-Type") || "", /text\/event-stream/);
      // Groq's OpenAI deltas are reshaped into the {"response":"..."} frames
      // the widget parses, so the client contract is identical.
      const body = await readSse(res);
      assert.match(body, /data: \{"response":"Hello "\}/);
      assert.match(body, /data: \{"response":"there\."\}/);
      assert.match(body, /\[DONE\]/);
      // Groq was actually called, with the system-prompted conversation.
      assert.equal(fetchCalls.length, 1);
      assert.match(fetchCalls[0].url, /api\.groq\.com/);
      const sent = JSON.parse(fetchCalls[0].init.body);
      assert.equal(sent.stream, true);
      assert.equal(sent.messages[0].role, "system");
      assert.equal(sent.messages.at(-1).content, "hi");
    }
  );
});

test("Groq is not called when Cloudflare succeeds", async () => {
  const { env } = makeEnv({ groqKey: "gsk_test" });
  let fetched = 0;
  await withMockFetch(
    async () => {
      fetched++;
      return new Response("", { status: 200 });
    },
    async () => {
      const res = await worker.fetch(req("/chat", { body: userMsg("hi") }), env);
      assert.equal(res.status, 200);
    }
  );
  assert.equal(fetched, 0, "fallback must not run on the happy path");
});

test("when both providers fail, the 4006 quota message is preserved (503)", async () => {
  const { env } = makeEnv({
    groqKey: "gsk_test",
    ai: () => {
      throw new Error("4006 neuron quota exceeded");
    },
  });
  await withMockFetch(
    async () => new Response("upstream boom", { status: 500 }),
    async () => {
      const res = await worker.fetch(req("/chat", { body: userMsg("hi") }), env);
      assert.equal(res.status, 503);
      assert.equal((await res.json()).error, "rate_limited");
    }
  );
});

test("when both providers fail on a generic error, returns 502", async () => {
  const { env } = makeEnv({
    groqKey: "gsk_test",
    ai: () => {
      throw new Error("boom");
    },
  });
  await withMockFetch(
    async () => new Response("nope", { status: 500 }),
    async () => {
      const res = await worker.fetch(req("/chat", { body: userMsg("hi") }), env);
      assert.equal(res.status, 502);
      assert.equal((await res.json()).error, "ai_error");
    }
  );
});
