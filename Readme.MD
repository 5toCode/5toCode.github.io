# 5tocode.dev

Personal site for [Mike Roberts](https://www.5tocode.dev) — Engineering Manager at Google (Cloud Security / Wiz), iOS app builder, writer on AI and cybersecurity.

**Live site:** [www.5tocode.dev](https://www.5tocode.dev)

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | [Astro 6](https://astro.build) — static output |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (CSS-first config) |
| CMS | [TinaCMS](https://tina.io) — Git-backed, for writing content |
| Deployment | GitHub Actions → GitHub Pages |
| Fonts | Space Grotesk · JetBrains Mono · Inter |
| Icons | Material Symbols · Font Awesome 6 |

---

## Project Structure

```
src/
├── assets/writing/         # Images referenced in articles
├── components/
│   ├── SiteHeader.astro    # Fixed glass nav with logo, desktop + mobile
│   ├── SiteFooter.astro    # Footer with email and social links
│   └── SiteNav.astro       # Nav link definitions
├── content/
│   └── writing/            # Markdown articles (managed via TinaCMS)
├── layouts/
│   ├── BaseLayout.astro    # HTML shell, loads fonts and icons
│   └── ArticleLayout.astro # Article page wrapper
├── pages/
│   ├── index.astro         # Homepage
│   ├── writing/
│   │   ├── index.astro     # Article index
│   │   └── [...slug].astro # Individual article pages
│   ├── TrainIQ/index.astro
│   ├── StrengthIQ/index.astro
│   └── rss.xml.js          # RSS feed
└── styles/
    └── global.css          # Tailwind @theme tokens + CSS custom properties
```

---

## Design System

The site uses a **Cyber-Modern Professional** dark-first design with system-aware light mode — no JavaScript, no toggle. The OS preference switches the theme automatically via `@media (prefers-color-scheme: light)`.

All colors are CSS custom properties defined in `src/styles/global.css`:

| Token | Dark | Light |
|---|---|---|
| `--bg` | `#020c1b` | `#f8fafc` |
| `--accent` | `#38debb` (teal) | `#0f766e` (dark teal) |
| `--text-heading` | `#ffffff` | `#0f172a` |
| `--text-muted` | `#bacac3` | `#475569` |

The footer always stays dark in both modes.

Shared utility classes — `.glass-panel`, `.glass-card`, `.tech-line` — are defined globally and used across pages.

---

## Commands

```bash
npm install          # Install dependencies

npm run dev          # Dev server at localhost:4321 (Astro only)
npm run tina:dev     # Dev server with TinaCMS editor enabled

npm run build        # Production build (TinaCMS → Astro)
npm run preview      # Preview production build locally
```

---

## Writing New Articles

Articles live in `src/content/writing/` as Markdown files. Each file requires this frontmatter:

```markdown
---
title: "Your Article Title"
description: "One-sentence summary shown in previews and meta tags."
pubDate: 2026-05-26
---

Article body here...
```

**Via TinaCMS:** Run `npm run tina:dev`, then open `http://localhost:4321/admin` to write and publish from a visual editor. TinaCMS commits the Markdown file directly to the repo.

**Via editor:** Create a `.md` file in `src/content/writing/` manually and push to `main`.

Either way, the article appears on `/writing/` and the homepage writing preview automatically.

---

## Deployment

Pushing to `main` triggers GitHub Actions (`.github/workflows/deploy.yml`), which:

1. Runs `tinacms build --skip-cloud-checks`
2. Runs `astro build`
3. Deploys the `dist/` output to GitHub Pages

The workflow requires three secrets/variables set in the GitHub repo:

| Name | Where |
|---|---|
| `NEXT_PUBLIC_TINA_CLIENT_ID` | Repository variable |
| `TINA_TOKEN` | Repository secret |
| `NEXT_PUBLIC_TINA_BRANCH` | Hardcoded to `main` in the workflow |

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, apps, writing preview |
| `/writing/` | Full article index |
| `/writing/[slug]/` | Individual article |
| `/TrainIQ/` | TrainIQ app landing page |
| `/StrengthIQ/` | StrengthIQ app landing page |
| `/rss.xml` | RSS feed for writing |
