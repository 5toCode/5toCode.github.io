---
title: 'Securing OpenClaw with Hardening, Secrets, Boundaries, and Approvals'
description: 'A practical security deep dive on running OpenClaw with real tools, local memory, secrets, approvals, and workflow boundaries without turning it into a liability.'
pubDate: 2026-05-27T14:30:00.000Z
updatedDate: 2026-05-27T14:30:00.000Z
draft: true
tags:
  - AI
  - Agents
  - Cybersecurity
  - OpenClaw
  - Personal-AI
author: Mike Roberts
---

The moment a personal AI agent gets useful, it starts making me nervous.

That's not a complaint. It's the point.

An agent without memory, tools, or access to the systems where work actually happens is just a smarter chat box. The interesting version has memory, runs scheduled workflows, and can see enough context to stop asking the same setup questions every time. That's where the value is. It's also where the security problem starts.

A personal agent with real tools is a small piece of infrastructure with a friendly interface. Small infrastructure is still infrastructure. It needs boundaries, secret handling, a sane approval model, and logs. Otherwise you've built a very polite liability.

## Threat model first

The lazy answer is "don't give it access to anything important." Sure. Also don't connect your laptop to the internet.

The point of building a personal agent is to give it enough access to help. So the question isn't whether it gets access. It's what kind of access, in which context, and what it can do without me watching.

I think about it in plain categories: read, write, execute, credential, external action, memory, delegation. They don't carry the same risk. I'm comfortable with the agent reading a lot of context inside the right workspace. I'm much more careful about anything that sends a message, touches credentials, or makes a change in another system. "Summarize this note" and "send this to someone" are different species of request.

## Scoped agents, not one giant assistant

The tempting design is one all-knowing assistant with every memory, every tool, every permission, all the time. It feels powerful. It's sloppy.

My setup works better when I treat agents as scoped contexts. There's a main assistant. There are workflow-specific workspaces. Group chats have narrower expectations. Skills are available because a specific job needs them. Short-lived sessions exist for one task and disappear.

That separation is a primitive security control. Not a perfect one, but useful. The agent helping with public writing doesn't need the same context as the one handling private records. A workflow that edits a draft should have a different approval bar than one that touches tax records or sends messages.

## Hardening is boring and required

I'm not pretending my agent host is a bank. But it holds memory, scripts, logs, credentials, and workflow state — which makes it real infrastructure.

The basics: keep it updated, avoid unnecessary exposed services, use strong local auth, keep disk encryption on, limit inbound access, don't run things with more privilege than they need, keep logs, back up what matters, and actually test the restore path.

None of this is exotic. That's why it's easy to skip.

The bar I care about is practical: a bad prompt shouldn't expose every secret. A buggy workflow shouldn't overwrite state without a recovery path. A confused agent shouldn't publish externally without approval. Smaller blast radius, easier recovery, fewer irreversible actions.

## Secrets don't go in memory

This is the rule I'd tattoo somewhere if that weren't a weird sentence:

**Secrets don't belong in prompts, markdown memory, source files, chat history, screenshots, or public drafts.**

API keys, tokens, passwords, session cookies, recovery phrases — anything that grants access rather than describes access. The agent should know the procedure, not the password.

If a workflow needs a secret, it should use a credential manager, an auth flow, or an environment injection path. The exact mechanism matters less than the boundary.

Memory is sticky. A secret pasted into a chat can end up in logs, summaries, or future context. Once that happens, you don't have a clean story about where it lives. That's how "just this once" becomes credential archaeology.

## Approvals need to be specific

Approvals get treated like friction. Sometimes they are. A system asking for permission every three seconds isn't secure — it's annoying, and people start clicking through without reading.

But a good approval boundary is one of the main reasons I can trust the agent at all.

The rough scale: read-only work is usually fine. Local reversible edits are usually fine. External actions — messages, emails, posts, calendar changes, publishes — get a much higher bar. Destructive operations sit in their own category.

The approval prompt also has to be specific. "Can I proceed?" tells me almost nothing. "I'm going to send this exact message to this recipient using this account — approve?" gives me something to actually inspect. Vague approval tests whether I'm tired. Specific approval is a real checkpoint.

## Memory needs hygiene

Memory is sold as a capability. It's also a liability.

Anything written to memory can later be retrieved, summarized, or used as context. Good when it's a durable preference or a workflow decision. Bad when it's a stale instruction from three projects ago or a sensitive identifier that slipped in.

The posture: write down durable preferences and decisions. Keep raw daily notes separate from curated long-term memory. Keep secrets out. Prune instead of letting it become a junk drawer.

That last one isn't just housekeeping. A messy memory system is a prompt injection surface against your future self. Old instructions, stale facts, and half-correct notes compete for authority. The model won't always know which wins.

## Content is not authority

Prompt injection sounds abstract until the agent can read emails, web pages, documents, and repo files — then call tools afterward.

Any untrusted content can contain instructions. Some are malicious. Some are accidental. A webpage can say "ignore previous instructions." Cute. Still not policy.

The rule I want in every workflow: content is not authority. For higher-trust workflows, the rules need to be written down before the agent improvises: which inputs are untrusted, which instructions are authoritative, which tools are in scope, which outputs need approval, what verification is required before state changes.

If a workflow can't answer those questions, it's not ready for real autonomy.

## Code owns the invariants; models handle the ambiguity

The more important the workflow, the less I want core state changes handled by model intuition.

The model can classify, summarize, extract, draft, and deal with messy input. But if a workflow needs to deduplicate records, write a file, or decide whether something was already processed, deterministic code should carry that weight. Not because code is perfect — because it can be reviewed, tested, diffed, and fixed.

The split: model handles ambiguity, code handles invariants, humans approve high-impact actions, logs prove what happened.

The agent can flag a receipt as tax-relevant. The workflow still needs deterministic rules for writing the structured record. The agent can draft a message. I approve before it leaves the machine.

## Backups are part of security

A personal agent accumulates state: memories, workflow notes, scripts, trackers, configuration. Some can be rebuilt. Some can't. Some technically can, but only with enough pain that I'd rather not test my character that way.

Back up what matters. Exclude bulky rebuildable junk. Encrypt anything that leaves the machine. Test the restore path. A clever automation with one fragile copy of its state is not a system. It's a dare.

## The default rule: draft freely, send carefully

The approval rule I keep coming back to is simple: draft freely, send carefully, publish only with approval.

The agent can gather context, prepare a draft, propose an action, and show me the exact output. Then I approve the part that crosses the boundary into someone else's world. That's not a lack of trust. That's how trust survives contact with real workflows.

***

Before you build, write down the answers to these:

* What should the agent never store?
* What should it never send without approval?
* Which workspaces are public-safe?
* Which tools are read-only vs. state-changing?
* Which actions are reversible?
* What needs to be backed up?
* What would hurt if exposed?

These are design questions, not compliance ones. The point is to keep the agent useful enough to matter and controlled enough to trust.
