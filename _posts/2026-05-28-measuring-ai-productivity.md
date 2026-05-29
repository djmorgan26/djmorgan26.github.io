---
layout: post
title: "We have no way to measure AI productivity"
date: 2026-05-28
author: David Morgan
description: "We can't measure productivity-per-token, so every AI budget today is a guess. Why soft limits are the right interim policy, and why the answer lives at the gateway."
---

We are building AI systems faster than we can measure what they're worth, and burning compute faster than we can produce it. Those two gaps are about to collide, and when they do the first casualty will be a question nobody on my team can currently answer: who gets the tokens?

I don't mean that philosophically. I mean it as a budgeting problem that lands on a real person's desk every quarter. Someone has to decide how much an engineer, a team, or a job function is allowed to spend on model calls. Right now that decision is being made (when it's made at all) with no instrument that connects spend to value. We have invoices. We have token counts. We have nothing that says this thousand-dollar week of inference produced more than that hundred-dollar week did. The number we'd actually need to make the call is the one number we don't have.

## The metric doesn't exist yet

The thing we can't measure is the ratio of productivity to tokens, and almost every budgeting decision quietly depends on it.

Think about what we *can* see. I can pull exactly how many tokens a developer consumed last month, down to the model and the hour. What I cannot tell you is whether those tokens shipped a feature, chased a hallucination in a circle for three days, or quietly drafted the doc that unblocked four other people. The token count is precise and the value is invisible, which is the worst possible combination. It tempts you to manage the number you can see instead of the outcome you can't. I've watched smart organizations do exactly that with story points and lines of code for twenty years. Tokens are the same trap with a bigger bill attached.

And measuring software productivity was already hard *before* AI got in the loop. The classic proxies (commits, PRs, tickets closed) got noisier the moment an agent could generate a hundred lines as easily as one. The output went up and the signal in the output went down. So we're not refining an existing metric. We're trying to invent one from scratch, on a moving target, while the spend that depends on it grows every month.

## Until the metric exists, every budget is a guess

Here's the uncomfortable consequence. If you can't measure productivity-per-token, then any token budget you set is essentially random.

Not random in the sense of careless; the people setting them are careful. Random in the sense that there is no defensible basis for the number. Why does this team get 10 million tokens a month and that one get 5? Because somebody felt it was about right. Because last quarter's bill was roughly that. Because the loud engineer asked. Strip away the rationalizations and you find a guess wearing a spreadsheet. As I keep putting it: setting a hard token budget today is almost random guessing about whose hands to put money into. We don't have the data that would make it anything else.

Which is why the cap, when there is one, is so soft. Limits get set generously and enforced reluctantly, because everyone involved half-knows the number is arbitrary and nobody wants to be the person who throttled the engineer who was about to ship something real. So in practice the policy is: very, very soft limits, even between people doing the same job. Nobody knows how to dynamically budget tokens well, so mostly nobody does. They set a high ceiling, watch the invoice, and hope.

## Soft limits are the right interim policy anyway

I want to defend the soft limit, because it sounds like a cop-out and it isn't.

When you're missing the one measurement that would justify a hard rule, a hard rule is the *more* dangerous choice, not the safer one. A tight cap optimizes a number you've already admitted is disconnected from value, and the failure mode is brutal: you starve the exact use that was paying for itself while leaving the wasteful one untouched, because you couldn't tell them apart. A soft limit costs you some money on waste. A hard limit set blind costs you the upside, and the upside is the entire reason you're spending the money. Until I can show that a given thousand dollars of inference returned less than another thousand did, I'd rather overspend on a real engineer doing real work than enforce a clean rule that's quietly throttling my best leverage. The soft limit isn't the answer. It's the honest placeholder you keep until you've built the thing that lets you do better.

## The answer probably lives at the gateway

Here's where I think the real answer comes from, and it's not from any single model vendor. It's from the boring layer in the middle that everyone routes through.

The model gateway (the thing that sits between your code and every model API, so you can swap providers without rewriting anything) is the one place that sees all of it. Every request, every model choice, every token, across every team, in one funnel. That's exactly the vantage point a budget needs. So the eventual answer is probably this: the gateway holds the budget, routes each request to whichever model can satisfy it cheapest while still clearing the quality bar, and reports productivity-per-token back to teams in a form they can actually act on. Not a raw invoice. An answer to "are we getting our money's worth, and where aren't we?"

LiteLLM is the most obvious candidate to grow into that role, because it already owns the gateway position; it's where a lot of teams already centralize their routing, and the budget is the natural next thing to hang off a layer that already sees everything. Ollama is the piece that handles the other half: a real local and edge fallback, so the requests that don't need a frontier model never pay frontier prices, and some never leave the building. OpenRouter covers breadth, one interface onto a wide spread of models so "cheapest that clears the bar" has a real menu to choose from rather than two options. None of this is exotic. The components are shipping today. What's missing is the wiring: nobody has connected routing, budgeting, and a credible productivity signal into one loop that closes. We're not there yet. We're not even close. But the pieces exist, and that's usually the part that takes longest.

I'll be honest about the hard part, which is the same hard part as everywhere else in this post. Routing by *cost* is solved; the gateway knows the price of every token. Routing by *quality* is not, because "did this response meet the bar" is the productivity measurement again, wearing a different hat. So the gateway is where the answer lives, but it can't fully deliver it until we've cracked the measurement problem upstream. The infrastructure is ahead of the metric. That's the whole story of this moment, compressed into one component.

## The compute under all of this is borrowed time

Step back from the accounting problem and there's a physical one underneath it, on a longer clock but a harder deadline.

We are consuming compute faster than we can build it. The reason token budgets feel tight isn't only that we can't measure value. It's that the underlying supply is genuinely constrained, and demand is climbing a curve that the buildout of data centers and power and chips can't match in real time. Right now the hyperscalers (Google, AWS, Microsoft) hold the edge here, because raw infrastructure at this scale is the one thing you can't conjure with a clever idea. But I read that advantage as a phase, not a permanent state. It's an edge that lasts exactly as long as physical capacity is the binding constraint, and physical constraints are the kind engineers eventually engineer around.

The unlock people point to is putting data centers in space: free cooling, uninterrupted solar, none of the terrestrial fights over land and grid capacity. I think that genuinely rebalances things when it matures. The problem is *when*. Timing matters more than the eventual outcome here, because the token economy could destabilize before the physical engineering catches up. If demand keeps outrunning supply, and the metrics to allocate scarce supply rationally still don't exist, and the next generation of capacity is still years out, that's three unsolved problems converging, and if it gets much worse before we solve the hard engineering, things get awkward fast. That's not a prediction of collapse. It's a statement about which problems need to be solved in which order, and a worry that the order isn't lining up in our favor.

## What I'd actually do about it

I don't get to fix the compute supply or invent the productivity metric this quarter, so the honest question is what to do in the meantime.

Keep the limits soft, but stop pretending the gateway is just plumbing. Route everything through one, so that the day a credible productivity signal exists you already have the chokepoint to apply it; you've been collecting the data the whole time instead of starting from zero. Push the cheap, local-capable work down to local models now, because that's a real cost lever that doesn't depend on solving measurement first. And treat "how do we measure whether this spend was worth it" as a live engineering problem on the roadmap, not a finance question to be deferred, because it's the input every other decision here is waiting on.

The deeper point is that this is the same skill that matters everywhere else in AI work right now: being able to reason clearly about what outcome you actually want, while staying open-minded enough to take the answer from a machine, or from the person who built the gateway, instead of from your own priors. We figured out how to build with these systems years before we figured out how to account for them. The building is the fun part and we got good at it fast. The accounting is the unglamorous part that decides whether any of it is sustainable, and it's the part still wide open. I'd rather work on the open problem.

---

*David Morgan is a Data/AI Engineer at AT&T's Chief Data Office, where he builds production AI systems and orchestration platforms. More writing at [djmorgan26.github.io](https://djmorgan26.github.io); code at [github.com/djmorgan26](https://github.com/djmorgan26).*
