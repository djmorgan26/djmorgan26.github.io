---
layout: post
title: "The bottleneck has moved"
date: 2026-05-24
author: David Morgan
---


Colleagues come to me a lot. The conversation almost always goes the same way.

"My agent isn't doing what I want."

"What do you want it to do?"

"I want it to do X. But the problem is, when it does X, it needs to also handle Y, because Z is going to come up later and if it doesn't account for that, the whole thing breaks."

"Did you tell it that?"

A pause. Then: *"...no."*

That's the easy case. The fix is literally what they just said. Tell the agent the same paragraph you told me: every constraint, every edge case, every "by the way." The agent isn't psychic. If you can explain the problem to a person, you can explain it to the agent, and that single act is the difference between a useless output and a finished one. Five minutes of effort, no exotic prompting technique required.

I used to think that was the whole story. It isn't, and the part that isn't is what I want to write about.

## The case that's actually hard

Sometimes a colleague comes to me, I ask what they want the agent to do, and they can't tell me.

Not because they're hiding anything. Not because they're being lazy. Because they genuinely don't know.

They know they need *something*. They know the current situation isn't working. They know there should be a way to use AI to make it better. But when you ask what *better* looks like (what the actual output should be, what success looks like, what they'd do with the result once they had it), the answers come back vague, contradictory, sometimes circular. They want a dashboard, but they don't know what should be on it. They want to automate a workflow, but they can't describe the workflow. They want "AI to help" but can't say with what.

This is not a prompting problem. There is no prompt the person can write, because there is no clear thought in their head yet to convert into text. The agent isn't failing them. *Their inability to define the goal is failing them*, and the agent is just exposing it.

The first few times this happened to me, I treated it like the easy case. I tried to coax the prompt out. *Okay, what are you trying to do? What does the data look like? What should the output be?* The answers stayed vague. Eventually I learned that what these colleagues needed wasn't prompting advice. They needed the kind of help a consultant gives someone whose business is on fire and they don't know why. They needed someone to sit down, ask questions, redraw the problem until it had clear edges, and only *then*, once the goal was sharp, write the prompt.

Most of the time the prompt is the easy part. The hard part is the half-hour conversation before the prompt, where you figure out what the actual goal is.

## Why this is happening more, not less

You might expect this problem to fade as AI tools improve. The opposite is happening, and I think it's because the bar for "what you can plausibly attempt with AI" has shot up faster than most people's ability to keep up.

Five years ago, if you couldn't articulate a clear goal, you wouldn't even start. The technical barrier filtered out the unclear ideas before they hit code. You had to learn enough about, say, building a dashboard to know what you wanted on it before anyone could help you. The learning forced the clarity.

Now anyone can open a chat window and say "build me a dashboard." The agent will happily try. And if you don't know what you want, you'll get a dashboard you don't want, decide AI doesn't work, and walk away.

The technical filter is gone. The clarity filter is not. AI has made the gap between "people who can define their goals clearly" and "people who can't" the most important productivity divide in technical work, and the divide is widening.

## How you actually get out of failure mode #2

If you find yourself in this position, knowing you need *something* but not being able to say what, here's the only path out I know of, because it's the one I had to walk myself.

Build the mental model by playing.

When I started, I was the colleague in the second case. I knew I should be using AI more aggressively. I knew there was a productivity multiplier I wasn't getting. But I couldn't have told you specifically what I wanted the AI to do, because I didn't yet have a feel for *what AI could do*. The vocabulary wasn't there. The intuitions weren't there. I'd ask vague questions, get vague results, and conclude the tool was overhyped.

What changed it was playing. Not on anything important. On small projects with no stakes. A script to clean up a folder of files I'd been meaning to organize. A weekend experiment with a new framework I'd been curious about. A toy version of a thing I half-remembered wanting to build. Most of these failed in some way: produced something weird, missed the point, took more iteration than I'd budgeted for. That was fine. The point wasn't the output; the point was that each one taught me a little more about what AI could actually do, and just as importantly, what it couldn't.

After enough of these, something shifts. You stop asking "can AI do X" and start automatically knowing which kind of X is well-suited to AI and which isn't. You stop being surprised when the agent nails something hard or stumbles on something easy, because you've seen the pattern before. The vagueness in your goals starts to resolve, because you finally have a model of the territory you're trying to define a goal *in*.

And then your own judgment kicks in. You stop deferring to whoever sounds confident on Twitter about which tool to use. You stop being paralyzed by every new release. You can evaluate a new agent or a new feature in five minutes because you've already calibrated what good looks like by feel.

This is the part that's hard to convey to people in failure mode #2: the only way out is to fail on enough small things that you build the intuition. You can't read your way to it. You can't course your way to it. You have to put in the reps where the stakes are low enough that failure is fine, and you have to do it on enough different kinds of problems that the pattern starts to generalize.

People who don't do this stay stuck. They keep coming back asking "but how do I get the agent to..." about the same kinds of tasks, and the answer is always the same: you need more reps. Not on this. On other things. So that when you come back to this, you've got something to define the goal from.

## The temperament question

This is the part I'm cautious writing because it sounds like I'm dunking on people, and I'm not. But there's a real pattern worth naming.

Not everyone is going to thrive with these tools, and it's not about intelligence. It's about a specific temperament. The temperament that says: *I want to be able to articulate what I want; if I can't, that's a problem to solve, not a thing to work around.* The temperament that's willing to slow down at the front of a task to gain speed in the middle. The temperament that takes "tell me exactly what you want" as an invitation to think more clearly, not a frustration to vent about.

People with that temperament get extraordinary leverage from AI, the kind that feels almost unfair when you watch it from outside. People without it keep complaining that the tools don't work, and the tools, technically, will work fine.

This isn't fixed. It's trainable. But the want has to come from somewhere: curiosity, ambition, frustration with your own sloppiness, whatever lights you up. If the want isn't there, no amount of better prompts and better tools will close the gap. The people who keep iterating, who try the suggestion and come back with a sharper question, are the ones who will be running the next set of projects whether anyone hands it to them or not. The ones who come once, get the answer, and never refine the muscle; they get the immediate win and then plateau.

I'm not saying everyone has to be the first kind of person. Plenty of people do excellent work without ever wanting to live at the front of the AI curve. But there's no longer a quiet middle ground in technical work where you can stay current without engaging. The middle is collapsing. You're either training the muscle or you're falling behind, and the falling-behind is going to get faster from here, not slower.

## The thing I really want you to take away

The bottleneck has moved from your ability to execute to your ability to define what you want.

For most of software engineering's history, execution was the hard part. You needed the languages, the tools, the syntax, the frameworks, the systems. The defining part was assumed; if you could code it, you must have already figured out what *it* was.

AI inverts this. Execution is largely solved, or solvable, with enough back-and-forth with a competent agent. Defining-what-you-want is now the gating skill, the place leverage compounds, and the place most people are quietly under-investing.

That skill is the most valuable thing you can build right now. More valuable than knowing which model to use, which tool to pick, which framework is hot this month. Those things change every quarter. The ability to look at a situation, define the goal sharply, and communicate it without ambiguity: that's permanent, and it's the thing AI rewards more than any specific technical skill.

So: the next time your agent gives you something you didn't want, before you blame the model, run the exercise. Write down what you'd tell a colleague who walked up to your desk and asked. If you can write that paragraph and the agent still gets it wrong, the problem is the agent. If you can't write that paragraph, the problem was never the agent. It's upstream, and the only way to fix it is to think harder before you type. Or, if the thinking won't come, to go play on something small until it does.

That's the work. It's not glamorous. It's not what the demos sell. But it's the thing that separates the people getting wild leverage from these tools and the people who keep wondering why everyone else seems to be playing a different game.

---

*David Morgan is a Data/AI Engineer at AT&T's Chief Data Office, where he builds production AI systems and orchestration platforms. More writing at [djmorgan26.github.io](https://djmorgan26.github.io); code at [github.com/djmorgan26](https://github.com/djmorgan26).*
