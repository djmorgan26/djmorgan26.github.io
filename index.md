---
layout: page
---

<img src="{{ '/assets/img/headshot.jpg' | relative_url }}" alt="David Morgan" class="headshot">

I'm a Senior Data/AI Engineer at AT&T's Chief Data Office. I build production AI systems (orchestration platforms, agent tooling, document-ingestion pipelines) inside a company where security, compliance, and stakeholder management are not optional.

The thing I care about is the combination. I live at the front of the AI-tooling curve: early MCP adopter, design partner for AT&T's internal AI coding tool, part of a ~25-person design-partner cohort at Windsurf, and the go-to person for AI-fueled coding across the CDO. But I do that *while* shipping real work at enterprise scale. Most engineers I meet have one side or the other. I'm trying to be good at both, and this site is where I write about what that's taught me.

This page is the longer version of my [resume]({{ '/resume/' | relative_url }}): the work, the projects I build on my own time, and what I'm looking for next.

## At AT&T

I started at AT&T in the Technology Development Program in 2024 and moved into a Senior Data/AI Engineer role in the Chief Data Office in early 2026. The pattern across both has been the same: take on the thing nobody else has untangled yet, ship it end-to-end, then turn it into something the rest of the org can reuse.

### Platforms I've built

- **A multi-tenant enterprise platform on Kubernetes.** I'm the technical lead and application architect for a confidential orchestration platform, guiding a ~10-person team of engineers and contractors (most more senior than me) from planning and governance approval through Azure build-out, networking and delivery. We reached a working multi-tenant environment serving multiple organizational groups in about four months, on Helm, Terraform, Entra ID, PostgreSQL, Redis and GitHub Actions, with Grafana, Prometheus, Loki and Tempo for observability and 166 automated test files covering load, penetration and chaos testing.
- **A real-time geofence event-orchestration platform.** As primary application developer I took it from first code to production in about five months, then shipped a second release with roughly 10x the capabilities. It coordinates priority connectivity at large live events, and it turned workflows that took 600+ person-hours a year into single-digit hours, backed by nearly 150 test suites.
- **An AI-native software-delivery framework.** AI across all seven phases of the software lifecycle: parallel agents in isolated git worktrees moving work through plan, implement, review, test, verify and pull request, with human approval gates and auditable runs, validated by 227 automated tests.
- **An AI-powered SDLC and project-management platform.** I architected and delivered it as sole developer, and it replaced a commercial vendor tool for $3M+ in annual savings. Full-stack React/TypeScript + FastAPI + PostgreSQL on Azure, with AI document ingestion. AT&T's CTO called it out on a company-wide broadcast as the kind of execution the company wants in future leaders.
- **A national network-analytics platform.** Rebuilt from scratch as sole developer (React, FastAPI, MongoDB); it became the backbone of a data pipeline supporting $52M+ in reported business benefits.
- **A self-improving migration platform.** Brought in by the network org to fix how hundreds of legacy tools were being migrated. Earlier AI-assisted attempts were one-off and lost their value between migrations. I built a rulebook-driven system of agents, skills, and MCP servers with automated feedback loops, so each migration makes the next one easier instead of starting from zero.
- **Data-platform reliability work.** Led the Databricks Runtime upgrade (10.3 to 15.4 LTS) and validated the Unity Catalog migration across stage and prod, then layered automated data-freshness checks and cluster cost-tagging on top. Troubleshooting time dropped from days to hours; silent failures stopped slipping past us.

### Tooling and teaching

Some of the highest-leverage things I do at AT&T aren't single platforms. They're tooling and teaching that change how other engineers ship.

- **50+ reusable engineering and agent skills.** When something works, I package it so other engineers and their agents can reuse it: Terraform, Kubernetes, private networking, identity, observability, CI/CD, container hardening and disaster recovery. The one I'm proudest of gives agents everything a developer can do in the Databricks UI, combining the Databricks CLI, its REST APIs and adapted open-source MCP servers. Earlier skill packages of mine (parallel agents via git worktrees, automated Playwright demos, git-history secret remediation) are used by engineers across AT&T.
- **Design partner for AI coding tools.** I was a design partner for an internal AI coding assistant, giving its lead developer structured feedback from daily use of Claude Code, Copilot and Windsurf, and part of a ~25-person external design-partner cohort at Windsurf in the same window. In internal AI-assisted engineering metrics I score about 3.5x the top-performer threshold with top-tier cost efficiency.
- **AI-Fueled Coding (AIFC) Lunch & Learn.** Delivered the CDO's AIFC Lunch & Learn, where I laid out the day-to-day workflows that make this stuff actually productive instead of cosmetically impressive. Inside the org I'm the go-to person for it, which mostly means showing up to someone's stuck workflow and pairing through it. One example was unblocking a colleague's Power BI / Copilot / Power Automate pipeline that had been stuck for weeks; another was bootstrapping a Databricks Unity Catalog access dashboard with reusable Azure CLI skills and an enrichment integration into AT&T's directory.
- **Q2 GenAI Hackathon (top three).** Solo-built a network-analytics chatbot using locally-hosted Ollama LLMs. First time I'd built anything around fully-local inference; the experience is most of what got me serious about the gateway/edge story I write about now.

### Cross-org and program work

Some of the things I'm proudest of were the org-level work I picked up alongside the platforms.

- **Multi-Business-Partner ownership.** I was the only ATL TDP supporting multiple Business Partners at once, running parallel product-owner, developer, DevOps, and architect streams across different initiatives. It's most of what taught me how to actually ship inside the org.
- **Enterprise calendar and event-management tool.** Built ~95% of a Power Automate system used daily by 100+ TDP members in Atlanta. After leadership picked it up, it's being expanded into the national TDP program.
- **Microsoft Platforms Committee.** Led the committee solo after my co-lead departed, running training and Lunch-and-Learn events on Azure, Power Platform, and Microsoft 365 for the cohort.
- **Company security Capture the Flag.** First-time CTF participant; I placed 17th of ~160, mostly by leaning hard on AI tooling to compensate for inexperience. The lesson was about applying AI outside its usual lane.

### How the work has landed

A few markers that the work is actually landing: the CTO callout on a company-wide broadcast mentioned above, being cited as a best-practice example for AI-assisted engineering in the org, and the move into my current Senior Data/AI Engineer role in February 2026. The point isn't the recognition; it's that the work is being measured and the measurements line up.

## On my own time

I build a lot of small things to keep my intuitions sharp. The breadth is deliberate; it's how I learn what these tools can and can't actually do. The headline ones, with live no-login demos, are on the [projects page]({{ '/projects/' | relative_url }}).

- **PrintGen.** An AI 3D-print marketplace: text- and image-to-3D generation feeding a local Bambu Lab printer pipeline that slices and prints over the LAN. The fun of it is crossing the software-to-physical-hardware boundary.
- **URFMP (Universal Robot Fleet Management Platform).** A fleet-management platform for industrial robots from heterogeneous vendors (UR, ABB, FANUC). TypeScript monorepo, PostgreSQL, Docker. Live demo dashboard at [urfmp.vercel.app](https://urfmp.vercel.app) running a simulated fleet, no login.
- **Hybrid Quantum-Classical Starter Kit.** A working implementation of the variational hybrid pattern (a classical optimizer driving short quantum circuits), the same skeleton VQE and QAOA use. Built in Qiskit, D-Wave Ocean, and quimb. Its organizing principle is honesty: every quantum kernel ships next to a competitive classical baseline on the same input, because as of 2026 nearly every quantum-advantage claim on a useful problem has been matched by an improved classical algorithm within a year or two. A repo that shows quantum results in isolation teaches the wrong mental model.
- **Financial Analysis Agent System.** A multi-user finance dashboard aggregating Schwab, Coinbase, and Finnhub, with two AI layers: a Claude Code `/invest` skill for portfolio analysis and an in-app Gemini agent with read/write access to user preferences. Next.js 16, Supabase with row-level security.
- **Kalshi Investment Assistant.** An autonomous edge-finding engine running 10 strategies across 40,000+ prediction markets every five minutes, fusing eight data sources over WebSocket fan-out, validated against paper trading.
- **Legal Modernization Toolkit + SecureCounsel.** A Claude Code plugin and Python toolkit helping small law firms adopt AI without leaking client data or waiving privilege. Built initially for a real Alpharetta estate-planning firm engagement, with a Presidio-based de-identification core and reversible pseudonymization. The most regulated context I've shipped into outside AT&T.
- **SynthSeed.** An AI companion app where users hatch and raise a unique personality from a randomized seed. Starts nonverbal and learns to speak; develops a persistent personality over weeks of interaction. React Native + Supabase + Anthropic Claude + Mem0/Zep Graphiti for long-horizon memory.
- **A small cluster of AI-tooling experiments.** MCPBuilder (a builder for MCP servers), agentic-workflows (framework for agentic workflows), Invest4Me (an MCP-driven portfolio supervisor). These are the projects that taught me what MCP actually is and what an agentic workflow looks like once you've shipped one rather than read about it.
- **A resell bot** I built for selling my and my family's things on eBay and Facebook Marketplace when the official APIs weren't an option. Small, practical, and a tidy demonstration of the [context-injection ideas](/2026/05/25/strategical-context-injection.html) I write about. It stays private because it touches buyer PII and my own financial scans, but it gets used.

There are 20-some of these in total. Quantum cybersecurity, financial systems, AI tooling, networking, 3D printing and IoT, prediction markets, legal-tech consulting; same person, different domains. I pick up whatever the problem requires.

## A bit of background

I started at AT&T as a summer intern in 2021 and stayed across three summers and a four-year Technology Development Program track. The middle internship was on a quantum-cybersecurity team (one of four interns) supporting the government-mandated migration of 24,000+ applications to quantum-safe encryption, presenting to VPs and the CISO on Grover's Algorithm and cryptographic agility. That's where the quantum interest started.

In February 2026 I transitioned out of TDP into a Senior Data/AI Engineer role in the Chief Data Office, which is where I am now. Most of the AT&T work above sits inside that arc.

I studied at the University of Georgia's Terry College of Business: an M.S. in Business Analytics (Magna Cum Laude) and a B.B.A. in Finance (Cum Laude, Zell Miller Scholarship). The finance background is why so many of my side projects end up pointed at markets. I also hold the Microsoft Azure Data Fundamentals (DP-900) and Azure AI Fundamentals (AI-900) certifications.

## What I'm looking for next

A team of fast-moving builders I can both contribute to and learn from, where working at the bleeding edge of AI is the default, and where an enterprise-scale, battle-tested perspective is treated as an asset rather than baggage. I'm most interested in frontier AI labs and the teams building the tools the rest of us code with.

If that sounds like your team, I'd love to talk.

<p class="social-icons about-socials" role="list">
  <a href="https://github.com/djmorgan26" aria-label="GitHub" title="GitHub" role="listitem">{% include icon-github.svg %}</a>
  <a href="https://linkedin.com/in/davidjmorgan26" aria-label="LinkedIn" title="LinkedIn" role="listitem">{% include icon-linkedin.svg %}</a>
  <a href="mailto:davidjmorgan26@gmail.com" aria-label="Email David" title="Email David" role="listitem">{% include icon-mail.svg %}</a>
  <a href="{{ '/resume/' | relative_url }}" aria-label="Resume" title="Resume" role="listitem">{% include icon-file.svg %}</a>
</p>
