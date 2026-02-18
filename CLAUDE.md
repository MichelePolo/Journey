# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Journey is an Italian-language technical blog built with Eleventy (11ty) v3.1.2. It documents the development of CodeIntel System, a local-first AI system for code intelligence. The site is a static site with no JavaScript — just Markdown, Nunjucks templates, and CSS.

## Commands

```bash
npm run dev      # Dev server with hot reload at http://localhost:8080
npm run build    # Build static site to _site/
```

There are no tests or linting configured. The only dependency is Eleventy.

## Architecture

**Eleventy config** (`.eleventy.js`): Defines asset passthrough, Italian date filters (`readableDate`, `htmlDateString`), and a `post` collection sorted by date (newest first). Path prefix is `/Journey/` for GitHub Pages.

**Content flow**: Markdown files with YAML frontmatter → Nunjucks templates → static HTML in `_site/`.

**Source layout** (`src/`):
- `posts/` — Blog posts as numbered Markdown files (`01-slug.md`, `02-slug.md`, ...)
- `pages/` — Static pages (index, blog listing, docs)
- `_includes/layouts/` — Nunjucks templates: `base.njk` (root), `home.njk`, `post.njk`, `docs.njk`
- `assets/` — `styles.css` and `avatar.png`, copied as-is to `_site/assets/`
- `_data/` — Global data directory (currently empty)

**Template hierarchy**: `home.njk`, `post.njk`, and `docs.njk` all extend `base.njk` via `{% block content %}`.

## Key Conventions

**Post frontmatter** (all required unless noted):
```yaml
layout: layouts/post.njk
tags: [post]          # Required — adds to collections.post
title: "Title"
subtitle: "Subtitle"  # Optional
date: YYYY-MM-DD
quote: "Quote text"    # Optional
quoteAuthor: "Author"  # Optional
```

**Post numbering**: Filenames use `NN-slug.md` format. The leading number is extracted in templates with `.split('-')[0] | int` for display.

**Commit messages**: `type: brief description` in lowercase (e.g., `post: add post 12 on refactoring`).

**Language**: All content is in Italian. Date formatting uses `it-IT` locale.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages on every push to `main`. The `pathPrefix` in `.eleventy.js` must match the repository name for GitHub Pages subdirectory hosting.

## Design

Dark theme with monospace typography. Key colors: background `#212737`, text `#c9ced7`, accent/headings `#ff6b01` (orange). Single-column layout, max-width 768px. Responsive breakpoint at 768px.
