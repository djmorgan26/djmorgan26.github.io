---
layout: post
title: "Auto doesn't mean smart"
date: 2026-06-19
author: David Morgan
---

I've tried auto-routing in every major harness I use regularly. Cursor, Copilot, Windsurf, Claude Code. The result is the same every time: it picks wrong. Not occasionally — consistently, in both directions. Send it a complex multi-file refactor and it reaches for a fast cheap model. Ask it a simple factual question and it fires up the most capable model in the pool. The task complexity and the model selection have no reliable relationship.

At first I thought I was doing something wrong. Then I thought it was a specific harness problem. Now I think it's a category problem, and I think it's worth being honest about it, because every vendor is shipping this feature as if it works and most users have no way to know that it doesn't.

## What "auto" actually means right now

The Copilot case is the best-documented, because it leaked into the open. As of February 2026, Copilot's Auto mode was explicitly routing based on server availability, model health, and billing compliance — not the nature of the task. VS Magazine got GitHub on record: the system's "immediate goal" was to "manage capacity" and "reduce the likelihood of rate limits." Task-aware routing was on the roadmap, planned since September 2025, and didn't make it to a partial VS Code release until May 2026 — eight months later. Right now, if you select Opus in the UI, the system may quietly route you to Sonnet if Opus is under load. Your model selection is treated as a preference signal, not an instruction. And Microsoft built in a 10% request discount for users who stay in Auto mode — which is a load-balancing subsidy dressed up as a product benefit.

The gap between the September 2025 promise and the May 2026 partial delivery is itself the answer to how hard task-aware routing actually is.

## It's not only Copilot

I use Copilot as the example because the details are documented. But the problem is universal.

LiteLLM, which is one of the infrastructure-layer routing solutions people reach for when they want to roll their own, explicitly doesn't do task classification. It routes to the cheapest deployment that satisfies the infrastructure constraints — cost per token, latency threshold, provider availability. That's useful, but it's not intelligence. OpenRouter as of this month has 341 text models in its catalog. What it doesn't have is a reliable mechanism for matching a specific task to the right one out of 341. It's a gateway. Cursor's "auto" mode will tell you it picks the right model for your task. My experience is that it picks a model, and then tells you it was the right one.

The pattern holds everywhere: every harness ships the feature checkbox before solving the underlying problem. The checkbox is table stakes now — you can't ship a developer tool without some story about automatic model selection. So they all ship a story. Most of it is availability management with a better name.

## Why this is genuinely hard

There's a reason nobody has solved this yet, and it's not lack of effort.

Task classification at inference time in a production environment is a legitimately difficult problem. To do it well, you need ground-truth quality labels on outputs — some signal that tells you whether the model that was selected actually handled the task well. You don't get that by default. In a controlled eval, you can measure output quality against a benchmark. In production, your user sends a prompt, gets a response, and may or may not do anything that tells you whether the response was good. Most interactions leave no useful quality signal behind.

The research results look promising on paper. RouteLLM published at ICLR 2025 claims 85% cost savings at 95% GPT-4 quality on MT Bench. Those numbers are real in the experimental context — a fixed benchmark, known answer distributions, clean evaluation criteria. Your real workload isn't MT Bench. Your real workload is a mix of tasks you didn't anticipate, edge cases your classifier wasn't trained on, prompts that fall between categories. The benchmark transfers imperfectly to production, and the parts where it fails to transfer are exactly the parts that erode trust.

The other piece is that model capabilities change constantly. A routing classifier trained on the model pool from Q4 2025 has a different ground truth than the same classifier running in Q2 2026. Every major model release — and we've had several this year — shifts which tasks route where. A classifier that isn't retrained on the new capability landscape makes systematic errors, and users experience those as "the auto-routing always picks wrong."

## The reason for optimism — and why you can't feel it yet

Here's what I actually believe: the feedback loop is forming. It just hasn't closed yet.

Every Auto-mode session is, implicitly, a data collection event. What task came in, which model got selected, what the output was, whether the user accepted it or iterated. That's a training signal. Every major harness vendor has access to it at scale. The labs know what good routing data looks like, they're accumulating it, and the models trained on it will produce better classifiers than anything trained on public benchmarks.

But that flywheel has only been spinning for a year or so at the kind of scale that would matter. The models trained on that data haven't made it to production in force. You can't feel a feedback loop that hasn't had time to close. The gap between "we're collecting the right signal" and "users can actually feel the improvement" is longer than the marketing cycle for AI features, so from the outside it looks like nothing is happening. Something is happening. It's just slower than the feature announcements would suggest.

I expect this to be meaningfully better in twelve to eighteen months. That's not pessimism — that's how long these loops take to deliver.

## The trust problem is worse than the capability problem

Here's what concerns me more than the technical gap: the trust deficit that builds while the technical gap closes.

A harness that consistently picks the wrong model is one you stop relying on. Once you stop relying on Auto, you're back to manual selection — which means the feature is effectively useless for most users (who don't know which model to pick) and a workflow interruption for power users (who will override it anyway). The adoption path for auto-routing runs through trust, and trust is being borrowed against a capability that isn't there yet.

The Copilot frustration for non-Microsoft tasks probably has a routing explanation. If the Auto pool skews toward whatever model is available, and if the training signal skews toward tasks that are common on Microsoft platforms, users doing work that doesn't match that distribution get worse routing. Not worse models — worse selection. And they experience it as the tool not working, which isn't exactly wrong, but also isn't the right diagnosis.

The fix — transparency — is underrated. Right now, when Auto picks wrong, you don't know it picked wrong until you see a bad output. If the harness showed you the routing decision ("this request was classified as a short, low-complexity task and routed to GPT-4.1 mini"), you could develop intuition about when to trust it. You could also catch systematic misclassification quickly and override it intelligently. Without that visibility, every bad output is just a mystery, and the auto-routing feature takes the blame regardless of whether the routing was the problem.

## Why this matters beyond model selection

I keep coming back to the fact that routing is not a convenience feature. It's infrastructure.

Without reliable routing, token budgets are essentially arbitrary. You can set limits on what an agent can spend, but you can't calibrate those limits to actual task complexity if you don't know whether a given task warranted a $0.003 call or a $0.03 one. You can't build a cost model for agents running at any real scale. You can't report productivity-per-token back to a team in any way that would help them make better decisions. The whole economics of running AI at scale run through routing, and right now the routing layer isn't solid enough to put weight on.

The harnesses that figure this out first won't just have a better product feature. They'll have the infrastructure to make AI cost-effective in organizations that are genuinely trying to run it at scale, and that's a much larger prize than a checkbox in the settings menu.

## Where this ends up

I think auto-routing will work. The data exists, the research is real, and the vendors have every incentive to close this gap. A year from now, the feedback loops that are forming today will have had time to actually run, and the classifiers trained on real production data will be substantially better than what's shipping now.

But right now, in June 2026, every harness offers auto-routing and none of them consistently delivers on the promise. The feature looks like table stakes. The implementation is mostly load management. Don't rely on it for work where model selection actually matters. Pick your model deliberately. Know why. Check back in a year — by then, it should have earned the trust it's currently being extended by default.

---

*David Morgan is a Data/AI Engineer at AT&T's Chief Data Office, where he builds production AI systems and orchestration platforms. More writing at [djmorgan26.github.io](https://djmorgan26.github.io); code at [github.com/djmorgan26](https://github.com/djmorgan26).*
