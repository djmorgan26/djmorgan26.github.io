#!/usr/bin/env node
/**
 * Build the Worker's knowledge from the site sources, so "Ask David" always
 * matches what is published and nothing is hand-maintained.
 *
 * Emits worker/src/context.js with two exports:
 *  - WRITING_INDEX: every published post, NEWEST FIRST, with its date, url and
 *    one-line summary (front-matter `description`, else `excerpt`, else the
 *    opening paragraph). It goes into every prompt, so the bot always knows
 *    what David has written and which piece is newest.
 *  - SITE_CHUNKS: index.md, resume.md and every post split into small
 *    heading-sized sections. The Worker picks only the few sections relevant to
 *    the visitor's question (keyword retrieval) instead of sending the whole
 *    site with every message.
 *
 * Run before `wrangler deploy` (npm's predeploy script wires this up).
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");
const out = resolve(here, "..", "src", "context.js");

const MAX_CHUNK_CHARS = 1400;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function splitFrontmatter(text) {
  const meta = {};
  if (!text.startsWith("---")) return { meta, body: text };
  const end = text.indexOf("\n---", 3);
  if (end === -1) return { meta, body: text };
  for (const line of text.slice(3, end).split("\n")) {
    const m = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (m) meta[m[1]] = m[2].trim().replace(/^"(.*)"$/, "$1").replace(/\\"/g, '"');
  }
  return { meta, body: text.slice(end + 4).replace(/^\s+/, "") };
}

function clean(text) {
  return text
    .replace(/\{%[^%]*%\}/g, "")
    .replace(/\{\{[^}]*\}\}/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<img[^>]*>/gi, "")
    .replace(/<figcaption>([\s\S]*?)<\/figcaption>/gi, "Figure: $1")
    .replace(/<\/?[a-z][^>]*>/gi, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function firstParagraph(body) {
  for (const p of clean(body).split(/\n\n/)) {
    const t = p.replace(/[*_`#>]/g, "").trim();
    if (t.length > 60 && !/^\[.*\]\(.*\)$/.test(t)) return t.length > 220 ? t.slice(0, 217) + "..." : t;
  }
  return "";
}

// Keep each index line short: whole sentences up to ~240 chars.
function shorten(text) {
  const t = text.replace(/\s*[—–]\s*/g, ", ").trim();
  if (t.length <= 240) return t;
  let out = "";
  for (const sent of t.split(/(?<=[.!?])\s+/)) {
    if ((out + " " + sent).trim().length > 240) break;
    out = (out + " " + sent).trim();
  }
  return out || t.slice(0, 237) + "...";
}

function chunk(sourceLabel, url, text) {
  const chunks = [];
  let heading = "";
  let buf = [];
  const flush = () => {
    const body = buf.join("\n\n").trim();
    buf = [];
    if (!body) return;
    // Split oversize sections on paragraph boundaries.
    let cur = "";
    const paras = [];
    for (const para of body.split(/\n\n/)) {
      if (para.length <= MAX_CHUNK_CHARS) { paras.push(para); continue; }
      // A single huge paragraph: split it on sentence boundaries.
      let piece = "";
      for (const sent of para.split(/(?<=[.!?])\s+/)) {
        if (piece && piece.length + sent.length > MAX_CHUNK_CHARS) { paras.push(piece); piece = ""; }
        piece = piece ? piece + " " + sent : sent;
      }
      if (piece) paras.push(piece);
    }
    for (const para of paras) {
      if (cur && cur.length + para.length > MAX_CHUNK_CHARS) {
        chunks.push({ source: sourceLabel, url, heading, text: cur });
        cur = "";
      }
      cur = cur ? cur + "\n\n" + para : para;
    }
    if (cur) chunks.push({ source: sourceLabel, url, heading, text: cur });
  };
  for (const block of text.split(/\n\n/)) {
    const h = block.match(/^#{1,4}\s+(.+)$/);
    if (h && !block.includes("\n")) {
      flush();
      heading = h[1].trim();
    } else {
      buf.push(block);
    }
  }
  flush();
  if (chunks.length) chunks[0].lead = true;
  return chunks;
}

const chunks = [];
for (const [path, url, label] of [
  ["index.md", "/", "About page"],
  ["resume.md", "/resume/", "Resume"],
]) {
  const { body } = splitFrontmatter(readFileSync(join(repoRoot, path), "utf8"));
  chunks.push(...chunk(label, url, clean(body)));
}

const posts = [];
const postsDir = join(repoRoot, "_posts");
for (const f of readdirSync(postsDir)) {
  const m = f.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
  if (!m) continue;
  const { meta, body } = splitFrontmatter(readFileSync(join(postsDir, f), "utf8"));
  if (meta.published === "false") continue;
  const url = `/${m[1]}/${m[2]}/${m[3]}/${m[4]}.html`;
  const date = `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`;
  const title = meta.title || m[4];
  const summary = shorten(meta.description || meta.excerpt || firstParagraph(body));
  posts.push({ key: `${m[1]}${m[2]}${m[3]}`, title, date, url, summary });
  chunks.push(...chunk(`Post "${title}" (${date})`, url, clean(body)));
}
posts.sort((a, b) => b.key.localeCompare(a.key));

const writingIndex = posts
  .map((p, i) => `${i + 1}. "${p.title}" (${p.date}) ${p.url}${i === 0 ? " [NEWEST]" : ""}\n   ${p.summary}`)
  .join("\n");

const banner = `// Auto-generated by scripts/build-context.mjs. Do not edit by hand.\n// Source: index.md, resume.md, _posts/*.md\n`;
const body =
  `export const WRITING_INDEX = ${JSON.stringify(writingIndex)};\n` +
  `export const SITE_CHUNKS = ${JSON.stringify(chunks)};\n`;

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, banner + body, "utf8");

const total = chunks.reduce((n, c) => n + c.text.length, 0);
console.log(`built ${out}`);
console.log(`  ${posts.length} posts in the writing index, ${chunks.length} chunks, ${total} chars of site text`);
