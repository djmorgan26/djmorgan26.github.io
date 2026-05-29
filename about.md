---
layout: page
title: About
permalink: /about/
---

<img src="{{ '/assets/img/headshot.jpg' | relative_url }}" alt="David Morgan" class="headshot">

I'm a full-stack engineer at AT&T's Chief Data Office. I build production AI systems (orchestration platforms, agent tooling, document-ingestion pipelines) inside a company where security, compliance, and stakeholder management are not optional.

The thing I care about is the combination. I live at the front of the AI-tooling curve: early MCP adopter, design partner for AT&T's internal AI coding tool, part of a ~25-person design-partner cohort at Windsurf, and the go-to person for AI-fueled coding across the CDO. But I do that *while* shipping real work at enterprise scale. Most engineers I meet have one side or the other. I'm trying to be good at both, and this site is where I write about what that's taught me.

This page is the longer version of my [resume]({{ '/resume/' | relative_url }}): the work, the projects I build on my own time, and what I'm looking for next.

## What I build at AT&T

I tend to take on the thing nobody else has untangled yet, ship it end-to-end, and then turn it into something the rest of the org can reuse.

- **AndiSense.** An AI document-analysis platform I architected and delivered as sole developer, replacing a commercial vendor and saving $3M+ annually. Full-stack React/TypeScript + FastAPI + PostgreSQL on Azure, with AI-powered document ingestion and synthesis. AT&T's CTO highlighted it on the company's 150th-anniversary livestream as the kind of thinking and execution AT&T should look for in future leaders.
- **NAAP (National Access Analytics Platform).** A data-analytics platform I rebuilt from scratch as sole developer (React + Vite, FastAPI, MongoDB). Hundreds of production commits; it became the backbone of my team's data pipeline and supports $52M+ in reported business benefits.
- **5G Experience Pass (5GEP).** A real-time geospatial event-orchestration platform that coordinates priority cellular connectivity at large venues, combining cell-tower data with geofence boundaries to keep attendees connected under heavy network load.
- **A self-improving migration platform.** Brought in by the network org to fix how hundreds of legacy tools were being migrated. Earlier AI-assisted attempts were one-off and lost their value between migrations. I built a rulebook-driven system of agents, skills, and MCP servers with automated feedback loops, so each migration makes the next one easier instead of starting from zero.
- **Data-platform reliability work.** Led the Databricks Runtime upgrade (10.3 to 15.4 LTS) and validated the Unity Catalog migration across stage and prod, then layered automated data-freshness checks and cluster cost-tagging on top. Troubleshooting time dropped from days to hours; silent failures stopped slipping past us.

## Adjacent work at AT&T

Some of the highest-leverage things I do at AT&T aren't single platforms. They're tooling and teaching that change how other engineers ship.

- **AI-coding archetypes.** One of our VPs built AT&T's internal archetype system (close cousins to agent skills). I helped shape its early direction (he took some of my advice), then contributed to several of the archetypes and built a few of my own that other engineers across AT&T have used. Four of mine landed as merged PRs: parallel agents via git worktrees, automated Playwright demos, git-history secret remediation, and a meta-archetype for building more archetypes.
- **AI coding-standards tool.** I built a personal project to make AI-generated code conform to AT&T's internal standards. Matt Dugan (VP) incorporated elements of it into a broader production system that's contributed to millions in AT&T-wide productivity gains. The original tool was mine; the production system is his.
- **Koda design partnership.** Selected as an early adopter and design partner for Koda, AT&T's internal AI coding tool. I worked 1-on-1 with the lead developer through the early-stage phase, providing structured feedback informed by daily use of Claude Code, Copilot, and Windsurf. I was also part of a ~25-person external design-partner cohort at Windsurf in the same window.
- **AI-Fueled Coding (AIFC) Lunch & Learn.** Delivered the CDO's AIFC Lunch & Learn, where I laid out the day-to-day workflows that make this stuff actually productive instead of cosmetically impressive. Inside the org I'm the go-to person for it, which mostly means showing up to someone's stuck workflow and pairing through it. One example was unblocking a colleague's Power BI / Copilot / Power Automate pipeline that had been stuck for weeks; another was bootstrapping a Databricks Unity Catalog access dashboard with reusable Azure CLI skills and an enrichment integration into AT&T's directory.
- **Q2 GenAI Hackathon (top three).** Solo-built a network-analytics chatbot using locally-hosted Ollama LLMs. First time I'd built anything around fully-local inference; the experience is most of what got me serious about the gateway/edge story I write about now.

## How the work has landed

A few markers that the work is actually landing: 5/5 ratings on both performance dimensions in my year-end review with a formal *Role Model* designation; VP-level recognition over the same period (Connection Award, YouDeserve award and bonus, First Star); the CTO callout on the 150th-anniversary livestream mentioned above; and internal job offers across multiple AT&T orgs, one of which became my current Senior Data/AI Engineer role in February 2026. The point isn't the awards; it's that the work is being measured and the measurements line up.

## On my own time

I build a lot of small things to keep my intuitions sharp. The breadth is deliberate; it's how I learn what these tools can and can't actually do.

- **PrintGen.** An AI 3D-print marketplace: text- and image-to-3D generation feeding a local Bambu Lab printer pipeline that slices and prints over the LAN. The fun of it is crossing the software-to-physical-hardware boundary.
- **URFMP (Universal Robot Fleet Management Platform).** A fleet-management platform for industrial robots from heterogeneous vendors (UR, ABB, FANUC). TypeScript monorepo, PostgreSQL, Docker. Live demo dashboard at [urfmp.vercel.app](https://urfmp.vercel.app) running a simulated fleet, no login.
- **Hybrid Quantum-Classical Starter Kit.** A working implementation of the variational hybrid pattern (a classical optimizer driving short quantum circuits), the same skeleton VQE and QAOA use. Built in Qiskit, D-Wave Ocean, and quimb. Its organizing principle is honesty: every quantum kernel ships next to a competitive classical baseline on the same input, because as of 2026 nearly every quantum-advantage claim on a useful problem has been matched by an improved classical algorithm within a year or two. A repo that shows quantum results in isolation teaches the wrong mental model.
- **Financial Analysis Agent System.** A multi-user finance dashboard aggregating Schwab, Coinbase, and Finnhub, with two AI layers: a Claude Code `/invest` skill for portfolio analysis and an in-app Gemini agent with read/write access to user preferences. Next.js 16, Supabase with row-level security.
- **Kalshi Investment Assistant.** An autonomous edge-finding engine running 10 strategies across 40,000+ prediction markets every five minutes, fusing eight data sources over WebSocket fan-out, validated against paper trading.
- **Legal Modernization Toolkit + SecureCounsel.** A Claude Code plugin and Python toolkit helping small law firms adopt AI without leaking client data or waiving privilege. Built initially for a real Alpharetta estate-planning firm engagement, with a Presidio-based de-identification core and reversible pseudonymization. The most regulated context I've shipped into outside AT&T.
- **SynthSeed.** An AI companion app where users hatch and raise a unique personality from a randomized seed. Starts nonverbal and learns to speak; develops a persistent personality over weeks of interaction. React Native + Supabase + Anthropic Claude + Mem0/Zep Graphiti for long-horizon memory.
- **A small cluster of AI-tooling experiments.** [ContextVault](https://context-vault-beige.vercel.app) (deployed context-management tool), MCPBuilder (a builder for MCP servers), agentic-workflows (framework for agentic workflows), Invest4Me (an MCP-driven portfolio supervisor). These are the projects that taught me what MCP actually is and what an agentic workflow looks like once you've shipped one rather than read about it.
- **A resell bot** I built for selling my and my family's things on eBay and Facebook Marketplace when the official APIs weren't an option. Small, practical, and a tidy demonstration of the [context-injection ideas](/2026/05/25/strategical-context-injection.html) I write about. It stays private because it touches buyer PII and my own financial scans, but it gets used.

There are 20-some of these in total. Quantum cybersecurity, financial systems, AI tooling, networking, 3D printing and IoT, prediction markets, legal-tech consulting; same person, different domains. I pick up whatever the problem requires.

## A bit of background

I started at AT&T as a summer intern in 2021 and stayed across three summers and a four-year Technology Development Program track. The middle internship was on a quantum-cybersecurity team (one of four interns) supporting the government-mandated migration of 24,000+ applications to quantum-safe encryption, presenting to VPs and the CISO on Grover's Algorithm and cryptographic agility. That's where the quantum interest started.

In February 2026 I transitioned out of TDP into a Senior Data/AI Engineer role in the Chief Data Office, which is where I am now. Most of the AT&T work above sits inside that arc.

I studied at the University of Georgia's Terry College of Business: an M.S. in Business Analytics (Magna Cum Laude) and a B.B.A. in Finance (Cum Laude, Zell Miller Scholarship). The finance background is why so many of my side projects end up pointed at markets. I also hold the Microsoft Azure Data Fundamentals (DP-900) and Azure AI Fundamentals (AI-900) certifications.

## What I'm looking for next

A team of fast-moving builders I can both contribute to and learn from, where working at the bleeding edge of AI is the default, and where an enterprise-scale, battle-tested perspective is treated as an asset rather than baggage. I'm most interested in frontier AI labs and the teams building the tools the rest of us code with.

If that sounds like your team, I'd love to talk.

[GitHub](https://github.com/djmorgan26) · [LinkedIn](https://linkedin.com/in/davidjmorgan26) · [davidjmorgan26@gmail.com](mailto:davidjmorgan26@gmail.com) · [Resume]({{ '/resume/' | relative_url }})
