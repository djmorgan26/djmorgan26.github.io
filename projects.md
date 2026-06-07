---
layout: default
title: Projects
permalink: /projects/
description: "Selected side projects: AI agents, prediction markets, quantum computing, 3D printing. Live demos, no login required."
featured:
  - name: Financial Analysis Agent System
    stack: Next.js 16 · Supabase + RLS · Claude Code + Gemini
    desc: >-
      A multi-user finance dashboard aggregating Schwab, Coinbase, and Finnhub,
      with two AI layers: a Claude Code <code>/invest</code> skill for portfolio
      analysis and an in-app Gemini agent with read/write access to user preferences.
    demo: https://financial-analysis-agent-one.vercel.app
    repo: https://github.com/djmorgan26/FinancialAnalysisAgentSystem
  - name: Kalshi Investment Assistant
    stack: Next.js · Supabase · Python ML · WebSockets
    desc: >-
      An autonomous edge-finding engine running 10 strategies across 40,000+
      prediction markets every five minutes, fusing eight data sources over
      WebSocket fan-out, validated against paper trading.
    demo: https://kalshi-assistant.vercel.app
    repo: https://github.com/djmorgan26/Invest
  - name: Hybrid Quantum-Classical Starter Kit
    stack: Qiskit · D-Wave Ocean · quimb
    desc: >-
      A working implementation of the variational hybrid pattern: a classical
      optimizer driving short quantum circuits, the same skeleton VQE and QAOA
      use. Every quantum kernel ships next to a competitive classical baseline
      on the same input, because a repo that shows quantum results in isolation
      teaches the wrong mental model.
    repo: https://github.com/djmorgan26/TheHybridHorizon
  - name: PrintGen
    stack: Next.js · TypeScript · Bambu Lab pipeline
    desc: >-
      An AI 3D-print marketplace: text- and image-to-3D generation feeding a
      local Bambu Lab printer pipeline that slices and prints over the LAN.
      The fun of it is crossing the software-to-physical-hardware boundary.
    demo: https://printgen.vercel.app/marketplace
    repo: https://github.com/djmorgan26/printgen
  - name: URFMP
    stack: TypeScript monorepo · PostgreSQL · Docker
    desc: >-
      A fleet-management platform for industrial robots from heterogeneous
      vendors (UR, ABB, FANUC). The live dashboard runs a simulated fleet,
      no login.
    demo: https://urfmp.vercel.app
    repo: https://github.com/djmorgan26/urfmp
  - name: This site, including Ask David
    stack: Jekyll · Cloudflare Workers AI
    desc: >-
      The blog you are reading, plus the Ask David chatbot in the corner: a
      Cloudflare Worker grounded in my resume and writing, with rate limiting
      and a graceful fallback when the daily quota runs out. Try the widget;
      that is the demo.
    repo: https://github.com/djmorgan26/djmorgan26.github.io
more:
  - name: ContextVault
    desc: a deployed context-management tool for AI-assisted development
    url: https://context-vault-beige.vercel.app
  - name: MCPBuilder
    desc: a visual builder for custom MCP servers
    url: https://github.com/djmorgan26/MCPBuilder
  - name: agentic-workflows
    desc: reusable patterns for AI-assisted development workflows
    url: https://github.com/djmorgan26/agentic-workflows
  - name: chrome-skill
    desc: a Playwright-based browser-automation skill for Claude Code
    url: https://github.com/djmorgan26/chrome-skill
---
<article class="page projects">
  <header class="post-header">
    <h1 class="post-headline">Projects</h1>
  </header>
  <p class="projects-intro">I build a lot of small things to keep my intuitions sharp. These are the headline ones. Every demo runs in a no-login demo mode with mock data, so click through freely; the code behind each is public on GitHub.</p>

  <div class="project-list">
    {%- for p in page.featured %}
    <section class="project-item">
      <span class="project-stack">{{ p.stack }}</span>
      <h2 class="project-title">{% if p.demo %}<a href="{{ p.demo }}" target="_blank" rel="noopener">{{ p.name }}</a>{% else %}<a href="{{ p.repo }}" target="_blank" rel="noopener">{{ p.name }}</a>{% endif %}</h2>
      <p class="project-desc">{{ p.desc }}</p>
      <p class="project-links">
        {%- if p.demo %}<a href="{{ p.demo }}" target="_blank" rel="noopener">Live demo&nbsp;&#8599;</a>{% endif %}
        <a href="{{ p.repo }}" target="_blank" rel="noopener">Code&nbsp;&#8599;</a>
      </p>
    </section>
    {%- endfor %}
  </div>

  <div class="projects-more">
    <h2 class="projects-more-title">Smaller experiments</h2>
    <ul>
      {%- for m in page.more %}
      <li><a href="{{ m.url }}" target="_blank" rel="noopener">{{ m.name }}</a>: {{ m.desc }}.</li>
      {%- endfor %}
    </ul>
    <p class="projects-more-note">There are 20-some of these in total. The rest live on <a href="https://github.com/{{ site.github_username }}" target="_blank" rel="noopener">GitHub</a>.</p>
  </div>
</article>
