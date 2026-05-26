# Article Publishing Workflow

This Astro site uses TinaCMS for Git-backed article editing while preserving the existing article source path and public URLs.

## Existing Article Setup

- Existing article path: `src/content/writing/`
- Existing article format: Markdown (`.md`)
- Supported article formats after this setup: Markdown (`.md`) and MDX (`.mdx`) in Astro; Tina creates Markdown by default.
- Astro Content Collection: `writing`, configured in `src/content.config.ts`
- Public article index: `/writing/`
- Public article detail route: `/writing/{slug}/`
- Existing article slugs are filename-based and are preserved.
- Current source branch: `main`
- GitHub Pages deployment: GitHub Actions builds and deploys static Astro output from `main`.
- Custom domain: `https://www.5tocode.dev`; no Astro `base` is needed because this is not using a project-page subpath.

## Normal Direct-Publish Flow

This is the target/default workflow:

Open Tina CMS
-> create or edit article
-> save/publish
-> TinaCloud commits Markdown to `main`
-> GitHub Actions builds Astro
-> GitHub Pages publishes the static site

Routine publishing does not require a local dev server, manual branch, manual commit, pull request, or merge once TinaCloud is configured.

## TinaCMS Configuration

Tina is configured in `tina/config.ts`.

The `Writing` collection points at the existing article path:

```txt
src/content/writing/
```

The Tina fields match the current frontmatter and add optional publishing conveniences:

- `title`
- `description`
- `pubDate`
- `updatedDate`
- `draft`
- `tags`
- `heroImage`
- `author`
- Markdown body

Tina creates new articles as `.md` files in `src/content/writing/`. Existing Markdown files remain where they are.

## Drafts

Drafts use:

```yaml
draft: true
```

Production builds exclude drafts from:

- `/writing/`
- `/writing/{slug}/`
- `/rss.xml`

Missing `draft` is treated as published, so existing articles without a draft field remain visible.

To publish from Tina, set `draft` to `false` or leave it unset.

## Browser-Based Editing

Browser-based editing without running a local dev server requires TinaCloud because GitHub Pages hosts only the static Astro site and does not provide Tina's local filesystem backend.

Configure TinaCloud with:

- GitHub repo: `5toCode/5toCode.github.io`
- Publishing branch: `main`
- Workflow: direct commits/direct publish, not Editorial Workflow
- Admin route: `/admin/index.html`
- Allowed users: the people who should create/edit articles
- Media: repo-backed media using `public/img`

Required build environment variables:

```txt
NEXT_PUBLIC_TINA_CLIENT_ID
TINA_TOKEN
NEXT_PUBLIC_TINA_BRANCH=main
```

Compatibility aliases are also supported by the local config:

```txt
TINA_CLIENT_ID
TINA_BRANCH
```

Do not commit real tokens or secrets. Add them in GitHub Actions repository secrets or environment variables and in TinaCloud as appropriate.

## Local Editing

Local development is only needed when changing templates, components, schemas, or testing locally.

Install dependencies and run:

```bash
npm run tina:dev
```

Then open:

```txt
http://localhost:4321/admin/index.html
```

Useful scripts:

```bash
npm run dev
npm run tina:dev
npm run tina:build
npm run build
npm run preview
```

## Media Uploads

Tina uses repo-backed media in:

```txt
public/img/
```

Images uploaded through Tina are committed to the repo and are publicly available under:

```txt
/img/{filename}
```

Use the `heroImage` field for article hero images. Existing inline Markdown images can remain as they are.

## GitHub Pages Deployment

`.github/workflows/deploy.yml` runs on pushes to `main`, including commits made by TinaCloud. The workflow uses the official Astro GitHub Pages action and deploys via GitHub Actions Pages, not a generated `gh-pages` branch.

GitHub Pages should be configured in repository settings to deploy from GitHub Actions.

## Branch Protection And Direct Publish

Tina direct publish needs permission to commit to `main`. If branch protection blocks direct commits to `main`, use the least-manual fix that matches your policy:

1. Adjust branch protection to allow Tina/content commits to `main`.
2. Use a dedicated content branch and automation that fast-forwards or merges content changes after checks pass.
3. Use TinaCloud Editorial Workflow as a fallback.

Do not silently switch routine publishing to pull requests if direct commits are blocked.

## Optional Safer PR-Based Flow

This is not the default workflow.

TinaCloud Editorial Workflow can create a branch and draft pull request for content changes:

Open Tina CMS
-> create or edit article
-> save
-> Tina creates branch/draft PR
-> review and merge PR
-> GitHub Actions deploys

This is useful when you want review before publishing, but it still requires a merge step before the site updates.

## Troubleshooting

- If `/admin/index.html` is missing, run `npm run tina:build` or confirm the GitHub Actions build completed.
- If `/admin/index.html` loads but cannot connect to TinaCloud, confirm the GitHub Actions build had real TinaCloud environment variables. The build skips cloud credential checks so the static site can still build before TinaCloud is fully configured.
- If Tina cannot save, confirm TinaCloud is connected to the GitHub repo and configured for direct commits to `main`.
- If direct publish fails, check branch protection rules on `main`.
- If an article is missing from production, check whether `draft: true` is set.
- If an existing article disappears after adding drafts, verify it does not have `draft: true`; missing `draft` remains published.
- If media does not appear in TinaCloud, trigger a media sync in the TinaCloud project dashboard.
