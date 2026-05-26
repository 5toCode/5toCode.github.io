---
title: Supervising AI While Building the Platform You Write On — Lessons from an Astro + TinaCMS Migration
description: 'A practical account of using Claude Code to migrate a personal site to Astro and then layer on a TinaCMS publishing workflow, with notes on what the AI got right, what it got wrong, and why the muscle of supervision matters for AI, cybersecurity, and teaching.'
pubDate: 2026-06-01T16:52:48.485Z
updatedDate: 2026-06-01T17:17:20.293Z
draft: true
tags:
  - AI
  - Coding
  - Cybersecurity
  - Teaching
  - Claude
  - Astro
  - TinaCMS
heroImage: /img/31c70485-db24-40ea-bd70-71fbe5a7d293.png
author: Mike Roberts
---

A week or so ago, I wrote about the security patterns I noticed while building two iOS apps with AI coding tools. The point of that post was pretty simple: the most important skill in the age of agentic coding is not prompt engineering. It is architectural judgment. You have to know what the system should look like before you ask the AI to build it.

This post is the receipt.

Until recently, this site was a hand-authored static HTML site on GitHub Pages. It worked, technically. But every time I thought about writing more publicly, I would open the repo, look at the prospect of copying page chrome into another HTML file, and quietly decide to do something else.

That friction was small. Small friction compounds.

I needed a real publishing setup, so I did the work in two passes, both supervised end-to-end with Claude Code:

1. Move the site to Astro in a single afternoon, without breaking the existing TrainIQ and StrengthIQ landing pages. Those URLs are linked from the App Store and indexed by Google, so breaking them would have been a real mistake, not a cute little migration hiccup.
2. Add a direct-publish workflow with TinaCMS so writing a new article would not require a local dev server, a branch, and a pull request every time.

Here is what I learned, and why I think it matters beyond one personal site. This is about shipping software with AI agents, securing what those agents produce, and teaching people how to supervise them without getting lulled into false confidence.

## Pass one: moving to Astro

I picked Astro because it is a modern static site framework with good markdown support, content collections, RSS, and GitHub Pages deployment. The goal was to move the whole site in one afternoon with Claude Code doing most of the implementation.

### What the AI got right

Claude Code was very good at the parts of the migration that are well-documented and have an obvious path.

It scaffolded the Astro project cleanly. It also made the right call on preserving the old URLs: put the existing static site into Astro's `public/` directory, which Astro copies straight into the build output. That was better than trying to convert every legacy HTML file into an Astro template. I probably would have reached the same conclusion after an hour of reading docs. Claude got there in seconds because it had seen the pattern before.

It also handled the GitHub Actions deployment without much drama. Astro on GitHub Pages with a custom domain requires a specific workflow, the `actions/deploy-pages` action, and a CNAME file in the right place. Claude generated the workflow correctly and explained the GitHub setting I needed to change: the repository had to deploy from GitHub Actions instead of deploying from a branch.

The content collection work was solid too. Schema for article frontmatter, dynamic article routes, a writing index, RSS, all the expected pieces. None of that is hard, exactly, but it is the kind of boilerplate that can eat an evening if you are doing it cold. The agent handled it in minutes.

### What the AI got wrong

It got a few things wrong in ways that felt very familiar from the iOS app work.

First, it defaulted to the wrong place for images.

When I asked it to add screenshots for the first article, Claude suggested putting them in `public/`. That works for plain markdown image paths, but it skips Astro's image optimization pipeline. The better path was `src/assets/`, with the image references adjusted accordingly.

The default worked. It was also worse.

That is the same shape as the secure-default problem. The agent reaches for the common path, not necessarily the best one.

Second, it glossed over a URL preservation risk.

In one early plan, the agent wanted to move the existing TrainIQ and StrengthIQ pages into Astro page templates. That would have changed trailing slash behavior and risked breaking inbound links. It did not flag that on its own. I had to ask, "does this preserve the existing URLs exactly?" Only then did it acknowledge the risk and propose the safer approach.

The agent will not always tell you what you forgot to ask. You have to know where the landmines are.

Third, it produced a build that looked successful but was not actually complete.

The first full build passed. The homepage rendered. The writing index rendered. The article rendered. Everything looked fine in the browser.

Then I checked the `dist/` folder and noticed the CNAME file was missing. If I had deployed that build, the site would have worked while losing the custom domain.

Claude had not lied. The build really did succeed. It just had a narrower definition of success than I did.

That is the "looks right" failure mode. Code that runs is not the same as code that does what you need. The fix was easy once I saw it, but I only saw it because I inspected the actual deploy output. An agent saying "done" is not the same thing as the task being done.

### What supervision actually felt like

The migration took about three focused hours. Maybe twenty minutes of that was writing prompts. Maybe ten minutes was waiting for code. The rest was the real work: reading, checking, asking pointed questions, and catching places where the agent had handled something at a level of abstraction that hid the part I cared about.

I asked Claude to inventory the existing site before changing anything. Not because I needed a fancy inventory. I wanted the agent to build a concrete model of the repo before it started rearranging things. When it later wrote the migration plan, the plan was grounded in the actual site instead of generic Astro advice.

I asked for the plan in writing before any file changes happened. Reading that plan took five minutes and caught issues that would have cost much longer to unwind after the fact. Plan-before-doing is one of the highest-leverage habits I have developed with agentic tools. It is boring. It works.

I also worked in small steps with verification between them:

1. Inventory the existing site.
2. Write the migration plan.
3. Scaffold Astro.
4. Preserve the legacy pages.
5. Build and inspect the output.
6. Add the writing section.
7. Build and inspect again.
8. Add GitHub Actions.
9. Verify before cutover.

At each checkpoint, I had to look at the output myself. Open the page. Check the URLs. Inspect the build directory. Confirm the behavior I cared about.

The agent did not lie to me, but its definition of "done" was narrower than mine more than once. Verification is where that gap closes.

I also did the entire migration on a branch. The live site kept working until the last step, when I merged after manual verification. That was not because I thought the agent was incompetent. It was because the cost of a bad merge was high enough that branch discipline was obviously worth it.

## Pass two: removing publishing friction with TinaCMS

Astro solved the platform problem. The site now had content collections, RSS, and clean routing.

But publishing was still heavier than it needed to be. Writing an article meant creating the file locally, committing it, pushing a branch, opening a pull request, merging it, and waiting for the site to deploy. That is fine for code changes. It is dumb ceremony for routine article edits.

The second pass had a simple goal: keep the site static, keep the content in the repo, but make publishing feel like publishing instead of a miniature release process.

The new workflow looks like this:

1. Open TinaCMS in the browser.
2. Create or edit an article.
3. Save or publish it.
4. TinaCloud commits the markdown file to `main`.
5. GitHub Actions rebuilds the Astro site.
6. GitHub Pages serves the updated static site.

No local dev server. No manual branch. No manual commit. No pull request for normal article publishing.

### Why the pieces fit

Astro stayed because the public site is still static HTML. That keeps hosting simple and cheap. GitHub Pages can serve the built site without a server, database, or runtime application platform. Articles are still rendered at build time from Markdown or MDX. The editing experience got nicer, but the public site stayed boring in exactly the right way.

TinaCMS fit because it works with Git-backed content. I did not want articles living in a database, and I did not want a separate headless CMS to become the source of truth. The repo should own the content. Tina gives me a browser editor while still storing articles as Markdown or MDX files. The content remains portable, reviewable, and boring. Again, boring is good.

TinaCloud is the piece that makes browser-based editing work without a local dev server. It connects the deployed `/admin` interface to GitHub-backed content. TinaCloud also has an Editorial Workflow option that can create branches and pull requests, but for this personal site I chose direct publish to `main`. A TinaCloud commit hits `main`, GitHub Actions runs, and the site redeploys.

GitHub Actions and GitHub Pages stayed because they were already working. There was no reason to replace them. The build command changed to run Tina before Astro:

```bash
tinacms build --skip-cloud-checks && astro build
```

The Tina build creates the static admin interface at `public/admin/index.html`, and Astro includes it in the final build.

### The discipline of not moving things

The most important decision in this pass was deciding not to reorganize the content.

The clean-looking option would have been to create a new collection at `src/content/articles/`. But the site already had a working `writing` collection at `src/content/writing/`, with public routes at `/writing/` and `/writing/{slug}/`.

Moving the content would have created risk for no real benefit. Existing links could break. Slugs could change. RSS output could change. Route and layout code would need more edits. All of that would solve an organizational preference, not a publishing problem.

So TinaCMS was configured around the existing path.

That is the same instinct as the URL preservation work in the first pass. One of the cheapest mistakes an AI agent can lead you into is reorganizing something that already works because the new shape looks cleaner. The agent will happily refactor. Refactoring is everywhere in its training data. The human has to notice when the messy-looking path is load-bearing.

Sometimes the right architectural move is: leave it alone.

### Drafts and media

Draft support was added as an optional frontmatter field:

```yaml
draft: true
```

Production builds exclude drafts from the writing index, article detail pages, and RSS feed. Existing articles without a `draft` field continue to publish normally. Optional field, no backfill, no drama.

Media uploads use the existing `public/img/` directory. Images uploaded through Tina are committed to the repo and served at `/img/{filename}`. Git-backed, like everything else.

These are small choices, but small choices are where agents quietly break stable behavior. Knowing where to push back is the job.

## What this means for AI work

The agent's definition of "done" is narrower than the human's. It optimizes for the task as stated. The human cares about the task plus everything implied.

That gap is supervision work.

Plan-before-doing is cheap insurance. Asking the agent to write the plan first costs a few minutes. It catches expensive mistakes early. I would make this a default habit for any non-trivial agentic coding task.

Verification is also real work. "The build passed" is not verification. "I opened the page, checked the expected URLs, inspected the deploy output, and confirmed the CNAME is present" is verification. The more trust you build with the agent, the more tempting it is to skip this step. That is exactly when it gets dangerous.

## What this means for cybersecurity

Every story in this migration has a security-shaped version.

The missing CNAME is the same failure shape as a security control that is configured but not actually enforced. An automated check says everything is fine. Something downstream depends on a detail the check did not cover. The gap is invisible until it matters.

The `public/` versus `src/assets/` choice is the same shape as a secure-default problem. The agent picked the common path. The common path was not the best path. On a content site, that costs image optimization. In an authentication flow, access control path, or infrastructure template, the same pattern can cost a lot more.

Direct publish to `main` is also a trust decision. For my personal site, the blast radius is small and recoverable. For a corporate site, regulated content, or anything customer-facing, I would not use that same workflow without approval gates, review, and an audit trail. TinaCloud's Editorial Workflow exists for exactly that reason.

The lesson is not "never direct publish." The lesson is: know exactly what trust you delegated, who can exercise it, and what happens when it goes wrong.

Branch discipline matters for the same reason. The cost of an agent making a bad change on `main` is asymmetric. The cost of working on a branch is basically nothing. Treat the agent like any new contributor with commit access: scoped work, reviewed changes, branch isolation, and verification before merge.

That is not paranoia. That is engineering.

## What this means for teaching

The version of me that did not know this stuff would have ended up with a migrated site that lost its custom domain, risked breaking App Store links, and shipped unoptimized images. The AI would have told me everything was fine the whole time.

The version of me that did know this stuff got a clean migration in an afternoon and a publishing workflow that made writing easier.

The technology did not change. The supervision did.

That is the skill worth teaching. Not prompt engineering. Prompt engineering has a half-life measured in product releases. Architectural judgment lasts.

If you are building a team, designing a curriculum, or onboarding junior engineers into agentic coding, I would focus on a few habits:

* Make plan-before-doing mandatory for meaningful changes.
* Define "done" before implementation starts.
* Verify the outputs that matter, not just the outputs the tool happens to report.
* Work on branches.
* Teach people to read and challenge code they did not write.
* Invest in architectural judgment, because prompting without judgment is just faster confusion.

Anyone can ask an agent to write code. Fewer people can spot the thing the agent missed.

That is the bottleneck.

## The site this article is running on

The migration is in production. The publishing workflow is live. This article was drafted in a browser, committed to `main` by TinaCloud, built by GitHub Actions, and served by GitHub Pages.

The platform underneath it was built mostly by an AI agent, supervised by a cloud security professional who kept noticing the parts the agent did not.

That ratio is the real story of working with agentic tools right now.

It is not "the AI did it."

It is "the AI did most of it, and I caught the rest."

That is the muscle we need to build. It is the muscle we need to teach. And over the next few years, security and engineering teams are going to be measured by how well they develop it, whether they realize it yet or not.

What have you noticed while supervising agentic tools in your own work? I would genuinely like to compare notes.
