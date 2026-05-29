---
layout: page
title: About
permalink: /about/
---

<img src="{{ '/assets/img/headshot.jpg' | relative_url }}" alt="David Morgan" class="headshot">

I'm a full-stack engineer at AT&T's Chief Data Office. I build production AI systems — orchestration platforms, agent tooling, document-ingestion pipelines — inside a company where security, compliance, and stakeholder management are not optional.

The thing I care about is the combination. I live at the front of the AI-tooling curve: early MCP adopter, design partner for AT&T's internal AI coding tool, part of a ~25-person design-partner cohort at Windsurf, and the go-to person for AI-fueled coding across the CDO. But I do that *while* shipping real work at enterprise scale. Most engineers I meet have one side or the other. I'm trying to be good at both, and this site is where I write about what that's taught me.

This page is the longer version of my [resume]({{ '/resume/' | relative_url }}) — the work, the projects I build on my own time, and what I'm looking for next.

## What I build at AT&T

I tend to take on the thing nobody else has untangled yet, ship it end-to-end, and then turn it into something the rest of the org can reuse.

- **AndiSense** — an AI document-analysis platform I architected and delivered as sole developer, replacing a commercial vendor and saving $3M+ annually. Full-stack React/TypeScript + FastAPI + PostgreSQL on Azure, with AI-powered document ingestion and synthesis. AT&T's CTO highlighted it on the company's 150th-anniversary livestream as the kind of thinking and execution AT&T should look for in future leaders.
- **NAAP (National Access Analytics Platform)** — a data-analytics platform I rebuilt from scratch as sole developer (React + Vite, FastAPI, MongoDB). Hundreds of production commits; it became the backbone of my team's data pipeline and supports $52M+ in reported business benefits.
- **5G Experience Pass (5GEP)** — a real-time geospatial event-orchestration platform that coordinates priority cellular connectivity at large venues, combining cell-tower data with geofence boundaries to keep attendees connected under heavy network load.
- **A self-improving migration platform** — brought in by the network org to fix how hundreds of legacy tools were being migrated. Earlier AI-assisted attempts were one-off and lost their value between migrations. I built a rulebook-driven system of agents, skills, and MCP servers with automated feedback loops, so each migration makes the next one easier instead of starting from zero.
- **AI-coding archetypes** — One of our VPs built AT&T's internal archetype system (close cousins to agent skills). I helped shape its early direction — he took some of my advice — then contributed to several of the archetypes and built a few of my own that other engineers across AT&T have used. The ones I worked on covered parallel agents via git worktrees, automated Playwright demos, and git-history secret remediation. I picked up some early recognition for being active in the effort.

## On my own time

I build a lot of small things to keep my intuitions sharp. The breadth is deliberate — it's how I learn what these tools can and can't actually do.

- **PrintGen** — an AI 3D-print marketplace: text- and image-to-3D generation feeding a local Bambu Lab printer pipeline that slices and prints over the LAN. The fun of it is crossing the software-to-physical-hardware boundary.
- **Hybrid Quantum-Classical Starter Kit** — a working implementation of the variational hybrid pattern (a classical optimizer driving short quantum circuits), the same skeleton VQE and QAOA use. Built in Qiskit, D-Wave Ocean, and quimb. Its organizing principle is honesty: every quantum kernel ships next to a competitive classical baseline on the same input, because as of 2026 nearly every quantum-advantage claim on a useful problem has been matched by an improved classical algorithm within a year or two. A repo that shows quantum results in isolation teaches the wrong mental model.
- **Financial Analysis Agent System** — a multi-user finance dashboard aggregating Schwab, Coinbase, and Finnhub, with two AI layers: a Claude Code `/invest` skill for portfolio analysis and an in-app Gemini agent with read/write access to user preferences. Next.js 16, Supabase with row-level security.
- **Kalshi Investment Assistant** — an autonomous edge-finding engine running 10 strategies across 40,000+ prediction markets every five minutes, fusing eight data sources over WebSocket fan-out, validated against paper trading.

There are 20-some of these. Quantum cybersecurity, financial systems, AI tooling, networking, 3D printing and IoT, prediction markets — same person, different domains. I pick up whatever the problem requires.

## A bit of background

Before the Chief Data Office, I spent three summers in AT&T's rotational internship program, where I was one of four interns on a quantum-cybersecurity team working on the government-mandated migration of 24,000+ applications to quantum-safe encryption — and presented to VPs and the CISO on Grover's Algorithm and cryptographic agility. That's where the quantum interest started.

I studied at the University of Georgia's Terry College of Business: an M.S. in Business Analytics (Magna Cum Laude) and a B.B.A. in Finance (Cum Laude, Zell Miller Scholarship). The finance background is why so many of my side projects end up pointed at markets.

## What I'm looking for next

A team of fast-moving builders I can both contribute to and learn from — where working at the bleeding edge of AI is the default, and where an enterprise-scale, battle-tested perspective is treated as an asset rather than baggage. I'm most interested in frontier AI labs and the teams building the tools the rest of us code with.

If that sounds like your team, I'd love to talk.

[GitHub](https://github.com/djmorgan26) · [LinkedIn](https://linkedin.com/in/davidjmorgan26) · [davidjmorgan26@gmail.com](mailto:davidjmorgan26@gmail.com) · [Resume]({{ '/resume/' | relative_url }})
