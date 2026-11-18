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
  // Cloudflare gets FACTS + WRITING plus the site excerpts relevant to the question.
  assert.match(opts.messages[0].content, /WRITING \(every post on this site/);
  assert.match(opts.messages[0].content, /EXCERPTS \(passages from David's site/);
  assert.equal(opts.messages.at(-1).content, "What does David work on?");
  assert.equal(opts.stream, true);
  assert.equal(opts.max_tokens, 500);
  assert.equal(opts.temperature, 0.3);
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
      // The fallback must stay small (a smaller excerpt budget), or Groq's
      // free tokens-per-minute cap 413s the request. ~28k chars is ~7k tokens.
      assert.ok(
        sent.messages[0].content.length < 28000,
        `fallback prompt too large for Groq: ${sent.messages[0].content.length} chars`
      );
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

// --------------------------------------------------------------------------
// Knowledge: writing index, retrieval and prompt size
// --------------------------------------------------------------------------
import { WRITING_INDEX, SITE_CHUNKS } from "../src/context.js";
import { retrieve, buildSystemPrompt } from "../src/index.js";
import { readdirSync } from "node:fs";

test("writing index lists every post, newest first", () => {
  const posts = readdirSync(new URL("../../_posts/", import.meta.url)).filter((f) => /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(f));
  const lines = WRITING_INDEX.split("\n").filter((l) => /^\d+\. "/.test(l));
  assert.equal(lines.length, posts.length);
  const newest = posts.sort().at(-1).replace(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/, "/$1/$2/$3/$4.html");
  assert.ok(lines[0].includes(newest), `first line should be the newest post: ${lines[0]}`);
  assert.match(lines[0], /\[NEWEST\]/);
});

test("the prompt sent to the model carries the writing index and stays small", async () => {
  const { env, calls } = makeEnv();
  await worker.fetch(req("/chat", { body: userMsg("What's David's newest paper about?") }), env);
  const system = calls.ai[0].opts.messages[0].content;
  assert.ok(system.includes(WRITING_INDEX), "writing index missing from the prompt");
  // The old prompt shipped the whole site (~120k chars). Keep it well under that.
  assert.ok(system.length < 40000, `system prompt too large: ${system.length} chars`);
});

test("retrieval finds the paper from a loose description", () => {
  const hits = retrieve("Can you see the one about developing at an enterprise company", 9000);
  assert.ok(hits.length > 0);
  assert.match(hits[0].url, /developing-at-enterprise-scale/);
});

test("a 'newest' question retrieves the newest post", () => {
  const newestUrl = WRITING_INDEX.match(/^1\. ".+?" \(.+?\) (\S+)/)[1];
  const hits = retrieve("What's his latest paper about in 10 words", 9000);
  assert.equal(hits[0].url, newestUrl);
});

test("no internal project names reach the model", () => {
  const banned = /AndiSense|\bNAAP\b|\b5GEP\b|Experience Pass/i;
  assert.ok(!banned.test(WRITING_INDEX));
  assert.ok(!SITE_CHUNKS.some((c) => banned.test(c.text)));
  assert.ok(!banned.test(buildSystemPrompt([{ role: "user", content: "What has David built at AT&T?" }], 9000)));
});

test("the Groq fallback also gets the writing index", async () => {
  const { env } = makeEnv({ ai: () => { throw new Error("boom"); }, groqKey: "k" });
  await withMockFetch(
    () => new Response(openaiStream(["ok"]), { status: 200, headers: { "Content-Type": "text/event-stream" } }),
    async (calls) => {
      const res = await worker.fetch(req("/chat", { body: userMsg("newest paper?") }), env);
      await readSse(res);
      const sent = JSON.parse(calls[0].init.body).messages[0].content;
      assert.ok(sent.includes(WRITING_INDEX));
    }
  );
});
