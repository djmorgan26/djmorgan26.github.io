/**
 * Regression tests for the chat widget's pure rendering logic.
 *
 * These functions (URL safelisting, markdown, the [[button]]/[[card]] marker
 * parser) are the part of the frontend most likely to break silently and the
 * part that guards against the model emitting unsafe links or broken fragments.
 *
 * The functions live inside an IIFE in assets/js/chatbot.js and are not
 * exported. Rather than refactor the shipped file (which would itself be an
 * untested change), we slice the pure render block out of the source and
 * evaluate it in a sandbox. The block is delimited by stable comment markers;
 * if those markers move, the loader fails loudly so the test is updated rather
 * than silently passing against stale code.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import vm from "node:vm";

const __dirname = dirname(fileURLToPath(import.meta.url));
const chatbotPath = resolve(__dirname, "../../assets/js/chatbot.js");
const src = readFileSync(chatbotPath, "utf8");

const START = "// ---- safe rendering helpers ----";
const END = "// ---- message DOM ----";
const startIdx = src.indexOf(START);
const endIdx = src.indexOf(END);
assert.ok(
  startIdx !== -1 && endIdx !== -1 && endIdx > startIdx,
  "Could not locate the pure render block in chatbot.js (markers moved?). Update this loader."
);

const block = src.slice(startIdx, endIdx);
const moduleSrc =
  block +
  "\nmodule.exports = { esc, safeUrl, rewritePostSlug, mdInline, renderTextBlocks, renderBot };";

const sandbox = { module: { exports: {} }, URL, console };
vm.runInNewContext(moduleSrc, sandbox, { filename: "chatbot-render-extracted.js" });
const R = sandbox.module.exports;

assert.ok(typeof R.renderBot === "function", "renderBot did not export from extracted block");

// ---------------------------------------------------------------------------
test("safeUrl: allows in-page anchors, site-relative paths, and mailto", () => {
  assert.equal(R.safeUrl("#section"), "#section");
  assert.equal(R.safeUrl("/resume/"), "/resume/");
  assert.equal(R.safeUrl("mailto:davidjmorgan26@gmail.com"), "mailto:davidjmorgan26@gmail.com");
});

test("safeUrl: allows only safelisted external hosts", () => {
  assert.equal(R.safeUrl("https://github.com/djmorgan26"), "https://github.com/djmorgan26");
  assert.equal(R.safeUrl("https://urfmp.vercel.app"), "https://urfmp.vercel.app");
  assert.equal(R.safeUrl("https://www.linkedin.com/in/davidjmorgan26"), "https://www.linkedin.com/in/davidjmorgan26");
});

test("safeUrl: rejects hallucinated / unsafe URLs", () => {
  assert.equal(R.safeUrl("http://0.0.0.5/foo"), null, "rejects bogus IP host the model sometimes invents");
  assert.equal(R.safeUrl("https://evil.com/phish"), null);
  assert.equal(R.safeUrl("javascript:alert(1)"), null, "rejects javascript: scheme");
  assert.equal(R.safeUrl(""), null);
  assert.equal(R.safeUrl(null), null);
});

test("rewritePostSlug: maps bare post slug to the canonical permalink", () => {
  assert.equal(
    R.rewritePostSlug("/the-bottleneck-has-moved.html"),
    "/2026/05/24/the-bottleneck-has-moved.html"
  );
  assert.equal(R.rewritePostSlug("/unknown-thing/"), "/unknown-thing/", "passes through non-post paths");
});

test("safeUrl: rewrites bare post slugs", () => {
  assert.equal(
    R.safeUrl("/measuring-ai-productivity.html"),
    "/2026/05/28/measuring-ai-productivity.html"
  );
});

// ---------------------------------------------------------------------------
test("mdInline: bold + escaping", () => {
  assert.match(R.mdInline("**important**"), /<strong>important<\/strong>/);
  assert.match(R.mdInline("<script>"), /&lt;script&gt;/);
  assert.ok(!R.mdInline("<script>").includes("<script>"), "raw HTML must be escaped");
});

test("mdInline: safe links become anchors, unsafe links degrade to plain text", () => {
  const safe = R.mdInline("[GitHub](https://github.com/djmorgan26)");
  assert.match(safe, /<a href="https:\/\/github\.com\/djmorgan26" target="_blank"/);
  assert.equal(R.mdInline("[bad](https://evil.com)"), "bad", "unsafe link keeps the label, drops the href");
});

// ---------------------------------------------------------------------------
test("renderBot: terminal button marker renders an action button", () => {
  const html = R.renderBot(
    "You can reach David by email.\n[[button:Email David|mailto:davidjmorgan26@gmail.com]]"
  );
  assert.match(html, /cb-action-btn/);
  assert.match(html, /mailto:davidjmorgan26@gmail\.com/);
  assert.match(html, /Email David/);
  assert.match(html, /reach David by email/);
});

test("renderBot: terminal card marker renders a card", () => {
  const html = R.renderBot(
    "Check out URFMP.\n[[card:URFMP|Robot fleet platform|https://urfmp.vercel.app]]"
  );
  assert.match(html, /cb-card/);
  assert.match(html, /urfmp\.vercel\.app/);
  assert.match(html, /URFMP/);
});

test("renderBot: mid-sentence marker becomes an inline link, not an orphan button", () => {
  const html = R.renderBot("See his [[button:resume|/resume/]] for the full story here.");
  assert.match(html, /href="\/resume\/"/);
  assert.ok(!html.includes("cb-action-btn"), "non-terminal marker must not render as a button");
  assert.match(html, /for the full story/);
});

test("renderBot: incomplete trailing marker is hidden mid-stream", () => {
  const html = R.renderBot("One moment [[butt");
  assert.ok(!html.includes("[["), "partial marker must not leak into the DOM");
  assert.match(html, /One moment/);
});

test("renderBot: button with disallowed URL is dropped", () => {
  const html = R.renderBot("Here you go.\n[[button:Click|https://evil.com]]");
  assert.ok(!html.includes("cb-action-btn"), "unsafe button URL must not render");
  assert.ok(!html.includes("evil.com"));
});

test("renderBot: strips markdown headings and pseudo-headings", () => {
  assert.ok(!R.renderBot("## Big Heading\n\nReal text.").includes("Big Heading"));
  assert.ok(!R.renderBot("**Key Features:**\n\nReal text.").includes("Key Features"));
});

test("renderBot: card title is HTML-escaped (no injection via marker body)", () => {
  const html = R.renderBot("Look.\n[[card:<script>x|desc|/]]");
  assert.ok(!html.includes("<script>x"), "card title must be escaped");
  assert.match(html, /&lt;script&gt;/);
});

test("renderBot: restores the dropped leading 5 in 5G / 5GEP", () => {
  assert.match(R.renderBot("He built the G Experience Pass."), /5G Experience Pass/);
  assert.match(R.renderBot("He built GEP for venues."), /5GEP/);
});
