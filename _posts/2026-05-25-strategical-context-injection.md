---
layout: post
title: "Strategical Context Injection: the unifying frame for skills, workflows, prompts, and .md files"
date: 2026-05-25
author: David Morgan
---

I switched between three AI coding tools last year, and somewhere in the middle of it I stopped having to relearn anything.

The first time I moved from GitHub Copilot to Claude Code, I expected a learning curve. There wasn't one, or not the one I expected. The buttons were different, the file names were different, the docs used different words — but the thing I was actually doing was identical. I was taking knowledge that lived in my head and putting it somewhere the agent would read it at the right moment. Copilot called the artifact a prompt file, Windsurf called it a workflow, Claude calls it a command. Each tool also has a second form — context the agent pulls in on its own instead of waiting for you to invoke it — which Claude calls a skill, and AT&T's internal tooling has its own name for it. Underneath, they are the same primitive, and once I saw that, switching tools became a translation exercise instead of a learning one.

That primitive is what this post is about. I've started calling the discipline of using it well **Strategical Context Injection**, and I think it's the single highest-leverage idea I can hand to someone who already knows how to talk to an agent and wants to know what to get good at next.

## They're all the same primitive

Skills, workflows, prompts, MCP servers, `agent.md`, `CLAUDE.md`, memories — they look like a zoo of different features. They are not. Every one of them is a bundle of context you inject at a particular moment so the agent doesn't have to rediscover what you already know.

A command — Copilot's prompt file — is a context bundle *you* trigger by name. A workflow is the same idea with an ordered set of steps baked in: still something you invoke, just multi-step. A skill is the one that trips people up: a context bundle the *agent* reaches for on its own when it judges a task needs it, without you invoking anything. That auto-retrieval — the agent deciding what to load and when — is the primitive Anthropic introduced and the other tools are now copying. An MCP server is a context bundle that also knows how to *fetch* live context and take actions. A `CLAUDE.md` is a context bundle that loads every session. A memory is a context bundle the agent wrote for itself. The surface differs — when it loads, who triggers it, whether it can call out to the world — but the job is the same: put the right knowledge in front of the model at the right time.

This is why the tool-switching cost is so low once you internalize it. You're not learning Windsurf or Claude or Copilot. You're learning *what context this task needs and when it needs it*, and then expressing that in whatever syntax the current tool happens to use. The syntax is the easy part. We used to spend real effort learning the differences between programming languages; AI made that mostly irrelevant. Then we spent effort learning the differences between agent harnesses; that's going the same way. What doesn't go away is the judgment about which context matters.

## Naming the discipline

Strategical Context Injection is the practice of deciding *which* context to inject, *when* to inject it, and *how* to package it so it travels.

I'm naming it because the unnamed version of this skill is invisible, and invisible skills don't get taught or transferred. People watch someone get great results from an agent and conclude they're a better prompter, or they picked the right model, or they got lucky. Usually what actually happened is that the person had already done the context work — the relevant standards, the examples, the constraints were sitting right where the agent would read them — so the "prompt" could be three lines. The leverage wasn't in the prompt. It was in the context that was already in place before the prompt was typed.

If you take one thing from this: stop optimizing prompts and start optimizing context. The prompt is the last five percent.

## When to inject, and when to let the agent reach for it

Not all context should be loaded all the time. The art is matching the delivery mechanism to how often the context is needed and how big it is.

If something is true for every task in a project — the stack, the conventions, where things live, what "done" means — it goes in the always-loaded layer (`CLAUDE.md` or its equivalent). If something is only relevant to a specific kind of task, it should be a skill the agent reaches for when that task shows up, so you're not paying the context cost on every unrelated request. If something is large, changes often, or lives in an external system, don't paste it in at all — give the agent a tool or an MCP server that fetches it fresh when needed.

Getting this wrong is expensive in both directions. Inject too little and the agent rediscovers the same facts every session, or worse, guesses. Inject too much and you bloat the context, slow everything down, and bury the signal that actually mattered. Claude's recent move toward letting agents manage their own working memory — deciding what to keep, what to summarize, what to drop — is a direct response to this exact problem, and it's a good example of a genuinely new idea rather than a reskinned one. Most "new features" are the same primitive with a fresh label; a few solve a real problem the primitive created. Learning to tell those apart is most of what staying current actually is.

## Make it portable, or it dies with you

A context bundle that only works on your machine, in your head, with your undocumented assumptions, is a personal productivity trick. A context bundle someone else can pick up and use is infrastructure. The gap between those two is almost entirely effort you have to choose to spend, and most people don't.

So spend it. Concretely:

**Assume nobody will try.** Most people will not put in the effort to adopt your skill, even a good one, if it asks anything of them up front. Make the cost of trying as close to zero as you can — a clear name, a one-line description of when to use it, a working example they can run without reading anything else. The onboarding *is* the product. An agent that can walk a new person through the handoff beats a perfect skill nobody opens.

**Parameterize instead of hardcoding.** The version that has your username and your file paths baked in helps exactly one person. Pull those out into inputs and the same bundle serves the whole team.

**Reference; don't snapshot.** This is the one that bites everyone. Do not write a document that compares Windsurf and VS Code feature by feature — that data is wrong within weeks, and now you've got an authoritative-looking file actively lying to the agent. Link to the official docs that get updated when the product changes, and let the agent read the current version. The same rule applies to anything that moves: point at the source of truth instead of copying its state into your context. If you find yourself reading agent output that confidently asserts relationships in your project that *used to be true*, that's the tell — somewhere you snapshotted something you should have referenced.

Keep the bundles themselves pristine. Timestamps, changelogs, version markers, consistent naming conventions. Boring metadata is what keeps a context bundle honest a year after you wrote it.

## Once it's shared, it's a dependency

The part nobody has fully figured out yet is what happens after a bundle stops being yours. The moment other people and other agents depend on it, it isn't a note anymore — it's a dependency, and it earns the same discipline you'd give any other one. This is newer territory and the conventions are still forming, but the shape of it is already clear, and it's borrowed straight from how we ship code.

Version them, and pin to a version. A change to a skill is a change to behavior — often *invisible* behavior — and "I tweaked the skill" is a miserable answer to "why did every agent on the team start doing this yesterday?" Give each bundle a version and a changelog so a change is something you can see, attribute, and roll back. Then let the things that depend on it pin to a known version and upgrade deliberately, the same way you pin a library, so an improvement to a shared bundle never lands as a silent regression in someone else's workflow.

Catching that regression in the first place is the harder half, and it's the part I'm actively wrestling with right now: evaluating a context bundle the way you'd eval any other piece of an agentic system. It's tractable when you own the harness — you control the logs, the metrics, and the traces, so you can measure a skill's effect directly. On someone else's harness — Copilot, Claude Code, whatever your company hands you — those signals are exactly the ones you can't reach, so you end up stitching together your own: hooks, ad-hoc data collection, whatever the tool lets you instrument. I've been building one such strategy, and I'll be honest that it's one strategy among many. The industry hasn't settled on a standard for evaluating agentic systems yet, and I'd bet most teams doing it seriously have quietly rolled their own.

This is where documentation standards stop being a nicety and start being load-bearing. At one bundle, a clear description and a working example are a courtesy. At fifty, across a team, they're the only thing separating a library from a junk drawer: a name, a one-line "use this when," declared inputs, an example, a version, a last-updated date. That metadata is what lets a person — or an agent running the handoff — trust a bundle without reading its internals. The discipline that felt like overhead on your first skill is exactly what makes the hundredth one usable.

## Standardization is the unsexy multiplier

The biggest gains I've seen didn't come from one brilliant skill. They came from a *system* of mediocre-but-consistent ones.

On a migration project at work, the problem wasn't that people couldn't use AI — it was that each engineer's AI-assisted work was a one-off. Nothing compounded. The fix wasn't a better prompt; it was a centralized rulebook every agent read from, so that an answer captured once made every future migration easier than the last. Standardize the conventions, standardize where context lives, standardize how bundles are named and triggered, and the whole team's work starts accumulating instead of evaporating. It's not glamorous. It's the thing that turns individual leverage into organizational leverage.

This is also where giving back matters. When you solve something, capture it in a bundle and make it portable enough to hand off. We can all do this. Most people just stop one step short — they get the win and never package it. The step from "it works for me" to "anyone can use this" is small, and it's where most of the durable value is.

## Why most people stop at one good skill

Here's the pattern I keep seeing. Someone writes one skill, it works, they're delighted — and then they stop. They've proven the concept to themselves and they treat that as the finish line.

The finish line is the system, not the first skill. The first skill teaches you the primitive. The leverage shows up when you start seeing every repeated explanation, every "let me tell you how we do this here," every paragraph you've now typed to an agent twice, as a context bundle waiting to be written down once. That shift — from prompting reactively to injecting context deliberately — is the whole game. The tools will keep renaming the primitive. The discipline of knowing which context to inject, when, and how to make it travel doesn't change, and it's the thing worth getting good at.

---

*David Morgan is a full-stack engineer at AT&T's Chief Data Office, where he builds production AI systems and orchestration platforms. More writing at [djmorgan26.github.io](https://djmorgan26.github.io); code at [github.com/djmorgan26](https://github.com/djmorgan26).*
