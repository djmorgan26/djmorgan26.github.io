---
layout: post
title: "The flywheel is spinning up: quantum, AI, and the convergence nobody priced in"
date: 2026-06-04
author: David Morgan
description: "Five years ago nobody believed AI would arrive this fast. It did. I think quantum is the next thing we're underestimating — and the reason is that AI and quantum have started accelerating each other. Here's the evidence, the trajectory, and what it means for the labs, the giants, and your portfolio."
---

Five years ago, if you'd told a room full of serious people that AI would be writing production code, winning Nobel-adjacent science prizes, and forcing companies to rewrite their capital plans by 2026, most of them would have smiled politely. The timeline was supposed to be longer. It wasn't. AI got here sooner than almost everyone thought, and the people who were early didn't have better information — they just took the curve seriously instead of rounding it down to zero.

I think quantum computing is sitting in that exact spot right now, and the people who dismissed AI's timeline are about to make the same mistake twice. But there's a second-order point that matters even more than the timing, and it's the one I actually want to make in this post: **AI and quantum have started accelerating each other.** Not metaphorically. In specific, published, reproducible ways. AI is helping us solve quantum's hardest problem, quantum is starting to do physics that will feed back into AI, and the discovery cycle that connects them is getting shorter every year. That's a flywheel. And flywheels don't move linearly — they spin up.

Let me show you the evidence, then where I think it goes, then what it means for money and for the companies you're watching.

## The thing people miss: it's a loop, not two races

The usual framing is that AI and quantum are two separate frontier bets, each with its own timeline, competing for the same headlines and the same capital. That framing is wrong, and it's wrong in a way that causes you to underestimate both.

Start with the direction everyone forgets: **AI is fixing quantum's single biggest obstacle.** Quantum computers are fragile — qubits decohere, errors creep in, and for decades the wall between "interesting demo" and "useful machine" has been error correction. In November 2024, Google DeepMind published [AlphaQubit](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/alphaqubit-quantum-error-correction/) in *Nature*: a neural-network decoder, built on the same Transformer architecture that powers large language models, that identifies quantum errors more accurately than the hand-engineered methods the field had relied on. It made 6% fewer errors than tensor-network decoders (accurate but far too slow to be practical) and 30% fewer than correlated matching (the fast, scalable approach), and it held up when tested on systems of up to 241 qubits. Read that again: the architecture we invented to predict the next word in a sentence is now one of the best tools we have for keeping a quantum computer coherent. AI walked over to quantum's biggest roadblock and started moving it.

Now the other direction. In October 2025, Google ran an algorithm called [Quantum Echoes](https://blog.google/innovation-and-ai/technology/research/quantum-echoes-willow-verifiable-quantum-advantage/) on its 105-qubit Willow chip and clocked it at **13,000× faster** than the best classical algorithm running on one of the world's fastest supercomputers — and, crucially, it was the first *verifiable* quantum advantage, meaning the result could be reproduced on other quantum hardware rather than just asserted. That last word is what makes it different from the contested "supremacy" claim of 2019. And the application isn't a toy: the technique measures how disturbances ripple through quantum systems, which maps directly onto molecular structure, NMR, and the simulation of materials and drugs. Those simulations are exactly the kind of expensive, data-starved problems that bottleneck AI today. Quantum doesn't just compute faster — it can generate the high-fidelity physical data that the next generation of scientific AI needs to train on.

So: AI makes quantum work, quantum generates the data and simulation muscle that makes AI smarter about the physical world, and around it goes. NVIDIA has already shipped the connective tissue — its NVQLink interconnect is built precisely to wire quantum processors into GPU-based AI systems. The plumbing for the loop is being laid right now.

## AI already compressed the discovery cycle — that's the leading indicator

If you want to know how fast the quantum half of this loop will move, look at what AI did to its first scientific target, because that's the rehearsal.

In late 2023, DeepMind's [GNoME](https://deepmind.google/discover/blog/millions-of-new-materials-discovered-with-deep-learning/) predicted **2.2 million new crystal structures** — roughly 380,000 of them thermodynamically stable — in a stretch of work the team estimated would have taken about 800 years of conventional research. Among them: 52,000 new graphene-like compounds (we previously knew of around 1,000) and 528 candidate lithium-ion conductors, the stuff better batteries are made of. And this wasn't a paper that died in simulation. Labs around the world have independently synthesized hundreds of the predicted materials, and an autonomous robotic lab at Berkeley used GNoME's data to make 41 brand-new materials from scratch with almost no human hands involved. Microsoft followed with its own generative model, MatterGen, that designs materials to hit a target property on demand.

Then 2024 happened, and the establishment made it official: **both** the Nobel Prize in Physics (Hopfield and Hinton, for the neural networks underneath all of this) and the Nobel Prize in Chemistry (Hassabis, Jumper, and Baker, for AlphaFold and protein design) went to AI. Two of the oldest, most conservative prizes in science, in the same year, for the same underlying technology. Hassabis called AlphaFold "the first proof point of AI's incredible potential to accelerate scientific discovery." The word that matters there is *accelerate*. The cadence of fundamental discovery — materials, proteins, and soon the quantum-chemistry problems Willow is reaching for — is no longer set by the speed of human grad-student-years. It's set by compute, and compute is the one thing that compounds.

That compression is the leading indicator for quantum. The same recipe — AI proposes, automated/quantum systems verify, the verified result trains the next model — is being pointed at the quantum stack itself.

## Why the U.S. Treasury just stopped pretending this is private-sector business

Here's the signal that convinced me the institutional money already sees the curve: the government just bought in. Literally bought equity.

On May 21, 2026, the Department of Commerce announced [letters of intent worth $2.013 billion](https://thequantuminsider.com/2026/05/21/u-s-department-of-commerce-announces-letters-of-intent-with-9-companies-for-2-billion/) to nine quantum computing companies, funded under the CHIPS and Science Act — and as a *condition of every award*, the government takes a minority, non-controlling equity stake in the company. This is not a research grant. It's the United States buying a stake in the quantum industry the way you'd buy into a sector you believe is about to inflect. Commerce Secretary Howard Lutnick framed it plainly: the administration is "leading the world into a new era of American innovation." The subtext is less polite, and it's all over the coverage — this is about beating China to "Q-Day," the moment a quantum computer can break the encryption protecting banks, military comms, and crypto. Whoever gets there first writes the rules.

The allocation tells you who Washington thinks the winners are:

- **IBM — $1 billion**, the largest of the nine, to anchor a new superconducting quantum foundry. IBM is matching it with $1 billion of its own to spin up **Anderon**, a standalone 300mm quantum wafer fab in Albany, New York — effectively America's first dedicated quantum chip foundry.
- **GlobalFoundries — $375 million** for a U.S. foundry supporting multiple quantum modalities.
- **$100 million each** to Atom Computing, D-Wave, Infleqtion, PsiQuantum, Quantinuum, and Rigetti — a deliberate spread across superconducting, neutral-atom, photonic, and trapped-ion approaches.
- **Diraq — up to $38 million** for silicon spin qubits.

Notice the strategy. They didn't pick one horse. They funded the foundry layer heavily (IBM, GlobalFoundries) because manufacturing capacity is the constraint you can't conjure with a clever idea, and then they bought options across every qubit technology that might win. That's not how you bet on something a decade away. That's how you bet on something you think is about to matter, when you don't yet know which implementation crosses the line first.

## Not all "quantum" is the same — and the loudest one is the least proven

Here's a distinction that gets flattened in almost every headline, including, if I'm honest, most of this post so far. "Quantum" isn't one technology. It's at least three, and they're at radically different stages of maturity. Lumping them together is how people end up either wildly overhyped or unfairly cynical. The $2 billion the government just spent is almost entirely on **computing** — the hardest, least mature, highest-ceiling pillar. But it's not the only one, and arguably not the one solving real problems *today*.

**Quantum sensing is the pillar that's already working, and nobody talks about it.** This is the unglamorous one — atomic clocks, magnetometers, gravimeters — and it's the most commercially real of the three by a wide margin. Atomic clocks sit at technology-readiness levels 7–8, already flying in GPS satellites and running in telecom networks; Infleqtion put an optical-clock product on a Royal Navy submarine in 2025. Q-CTRL demonstrated quantum sensors doing GPS-denied navigation **50× better** than the best conventional alternative — and called it, fairly, the first *true commercial* quantum advantage. No error correction, no logical qubits, no decade-long roadmap. It ships, it solves a problem someone is paying real money to solve, and it works now. It's also tiny in dollar terms — roughly $470 million of a ~$1.9 billion quantum market in 2025 — precisely because it's not where the hype capital goes.

**Quantum communication and cryptography is real but niche — and the punchline is that the best defense isn't quantum at all.** Quantum Key Distribution (QKD) has been deployed in production networks since 2007; it works, it's been run continuously over commercial metro fiber for years. But it's expensive, distance-limited, and needs special hardware, so it's stayed confined to governments and critical infrastructure. Meanwhile the actual answer to the Q-Day encryption threat that's driving all the national-security money turns out to be **post-quantum cryptography (PQC)** — new mathematical algorithms that run on the classical computers we already own, now standardized by NIST. Sit with that irony for a second: the most urgent quantum *threat* is best defended with classical software, not quantum hardware. For most organizations — including, very directly, telecoms — "going quantum-safe" means deploying PQC this decade, not buying a quantum computer. That's a real problem with a real, near-term, mostly-classical solution.

**Quantum computing is the moonshot — the biggest prize, the longest fuse, and the one most at risk of being a solution hunting for a problem.** It pulls roughly 90% of all quantum investment, yet the U.S. Department of Defense's own mid-2025 assessment puts practical machines 10+ years out. Both can be true: the ceiling is enormous (it's the half of the flywheel I've spent this whole post on) *and* outside a few domains — quantum chemistry, materials simulation, certain optimization and cryptography-relevant problems — a lot of the proposed applications are still, candidly, looking for a problem that actually needs a quantum computer rather than a better classical algorithm or a GPU. The honest framing is that computing has the highest expected value and the widest error bars. Sensing is a sure, small thing today. Computing is a maybe-enormous thing later. They deserve completely different mental models, and completely different patience.

The reason I still spend most of my attention on the computing pillar is the flywheel — sensing and communication advance largely on their own clocks, but *computing* is the one locked in the accelerating loop with AI, which is exactly why its long fuse may burn faster than the DoD's ten-year estimate suggests.

## The trajectory

Put the milestones on one axis and the shape jumps out at you.

<figure>
  <img src="/assets/img/quantum-ai-flywheel.svg" alt="A timeline chart from 2020 to 2033 showing an accelerating curve of AI and quantum breakthroughs: AlphaFold 2 in 2020, GNoME in 2023, AlphaQubit and two AI Nobel Prizes in 2024, Google's Quantum Echoes 13,000x result in 2025, the US government's $2B quantum bet in 2026, IBM's projected fault-tolerant Starling system in 2029, and a 100,000-qubit machine projected by 2033." loading="lazy" />
  <figcaption>The gap between breakthroughs is shrinking. The solid line is what's happened; the dashed line is IBM's published roadmap.</figcaption>
</figure>

The dashed half isn't my speculation — it's [IBM's own roadmap](https://www.ibm.com/quantum/blog/large-scale-ftqc): quantum advantage demonstrated by the end of 2026, a fault-tolerant system called **Starling** in **2029** with 200 logical qubits capable of 100 million error-corrected operations, 1,000 logical qubits in the early 2030s, and a 100,000-qubit quantum-centric supercomputer by **2033**. Roadmaps slip — I'd bet real money some of these dates do. But here's the thing about the AI timeline that everyone got wrong: it didn't slip late, it slipped *early*. The aggressive forecasts were the accurate ones. When a field crosses from "can we?" to "how fast can we scale?", the binding constraint becomes capital and manufacturing, and both of those just got a $2 billion injection with the U.S. government's name on the cap table.

My actual prediction, stated plainly so you can hold me to it: **the first genuinely useful, error-corrected quantum computation — one that does something a classical machine practically cannot, in chemistry or materials — lands before 2030, probably closer to 2028.** And the reason it'll be early rather than late is the flywheel. Every AI improvement in error decoding pulls the fault-tolerance date forward; every quantum result that generates clean physical data pulls the next AI capability forward. The two timelines aren't independent. They're multiplying.

## What it means for the money

A few honest caveats before the take. I work in AT&T's Chief Data Office, I'm naming companies including my own employer below, and none of this is investment advice — it's a framework, and quantum stocks in particular are a graveyard of great narratives and brutal drawdowns. With that on the table, here's how I'd think about the layers.

**The foundation labs (Google, OpenAI, Anthropic, DeepMind) get *more* central, not less.** The instinct is to think quantum is a threat to the AI incumbents. It's the opposite. The organizations that own the best AI are the ones turning quantum from hardware into capability — AlphaQubit and Quantum Echoes both came out of Google. The lab that pairs frontier AI with quantum R&D under one roof has a compounding advantage nobody else can buy. If you believe in the flywheel, you believe the integrated labs widen their lead.

**The giants split into two camps: those who own a layer of the loop, and those who rent it.** IBM just became something genuinely interesting again — not because of quantum hype, but because the government effectively underwrote it as the *foundry* for an entire industry, the way TSMC anchors classical chips. Owning manufacturing capacity for a scarce, strategic technology is a structurally good place to stand. Microsoft (topological qubits, plus the Azure layer that will sell quantum-as-a-service) and NVIDIA (the NVQLink interconnect that makes every quantum machine need GPUs alongside it) are positioned to monetize the loop regardless of which qubit wins. The companies to watch warily are the ones with no position in either AI or quantum that will simply pay the toll — and that includes a lot of the market.

**On my own industry:** I'd put telecoms like AT&T in the "rent it, but with a real reason to care early" bucket. The Q-Day encryption threat lands directly on anyone running critical network infrastructure, which makes post-quantum cryptography a near-term operational problem, not a 2030 curiosity. The defensive spend starts before the offensive capability arrives. That's worth sitting with.

**The pure-play small caps (D-Wave, Rigetti, IonQ, Quantinuum, and the rest) are the high-variance leg.** The government just validated several of them with capital *and* equity, which de-risks the "will they survive" question and re-rates the sector. But a spread of $100M bets across competing technologies is, by design, an admission that most of them won't be the winner. Treat them as a basket of options, not convictions. The CHIPS money is a floor under the sector, not a guarantee for any single name.

## The part I'm least sure about — and why I'm posting anyway

I'll be honest about what could break this thesis. Roadmaps slip; "fault tolerant by 2029" could mean 2032. Verifiable quantum advantage on a benchmark is not the same as commercial value, and the gap between them is exactly the gap AI is living in right now — we built the capability years before we figured out how to capture its worth. And government equity stakes in frontier tech are an experiment with its own failure modes; "the U.S. became a quantum investor" is a sentence that could age into a case study either direction.

But none of those undercut the core observation, which is the one I think most people are still missing: **these are no longer two separate bets.** AI and quantum have entered a loop where each one shortens the other's timeline, and the institutional capital — all the way up to the Treasury — has started moving as if that's true. The pattern is the same one we just lived through with AI: the curve looked gentle right up until the year it didn't. I'd rather be early and slightly wrong on the date than on time and completely unprepared for the shape.

The flywheel is spinning up. The only real question is how fast — and that's a question about how seriously you take a curve, which is the same skill that separated the people who saw AI coming from the people who got surprised by it.

---

*David Morgan is a Data/AI Engineer at AT&T's Chief Data Office, where he builds production AI systems and orchestration platforms. This post is analysis, not investment advice. More writing at [djmorgan26.github.io](https://djmorgan26.github.io); code at [github.com/djmorgan26](https://github.com/djmorgan26).*
