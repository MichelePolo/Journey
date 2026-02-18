# Blog Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current custom CSS blog layout with the professional Tailwind + Space Grotesk layout prototyped in `appunti/stitch_journey/code.html`.

**Architecture:** Rewrite all 4 Nunjucks templates and the CSS file to use Tailwind CSS (CDN), Space Grotesk font, and Material Symbols icons. The base template provides the shared shell (head, navbar, footer). Each page template extends it. Markdown content in posts/docs is styled via a scoped `.article-content` CSS class.

**Tech Stack:** Eleventy 3.1.2, Tailwind CSS (CDN), Space Grotesk (Google Fonts), Material Symbols Outlined (Google Fonts), Nunjucks templates.

---

### Task 1: Rewrite base.njk — foundation template

**Files:**
- Modify: `src/_includes/layouts/base.njk`

**Step 1: Replace `src/_includes/layouts/base.njk` with the new template**

This is the foundation that all pages extend. It provides:
- `<head>` with Tailwind CDN, Google Fonts, Tailwind config, custom styles
- Sticky glass-nav header with logo, nav links, status indicator, social icons
- `<main>` with `{% block content %}`
- Footer with copyright and links

```njk
<!doctype html>
<html class="dark" lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }} | Michele Polo</title>
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "primary": "#f97415",
            "workbench-bg": "#0d1117",
            "workbench-card": "#161b22",
            "workbench-border": "#30363d",
            "workbench-text-main": "#f0f6fc",
            "workbench-text-muted": "#8b949e",
          },
          fontFamily: {
            "display": ["Space Grotesk", "sans-serif"]
          },
          borderRadius: {
            "none": "0",
            "sm": "0.125rem",
            "DEFAULT": "0.25rem",
            "lg": "0.5rem",
          },
        },
      },
    }
  </script>
  <style type="text/tailwindcss">
    body {
      font-family: 'Space Grotesk', sans-serif;
      @apply bg-workbench-bg text-workbench-text-main selection:bg-primary/40;
    }
    .code-grid {
      background-image: radial-gradient(circle at 1px 1px, #30363d 1px, transparent 0);
      background-size: 40px 40px;
    }
    .glass-nav {
      backdrop-filter: blur(16px);
      background-color: rgba(13, 17, 23, 0.85);
    }
  </style>
  <link rel="stylesheet" href="{{ '/assets/styles.css' | url }}">
</head>
<body class="min-h-screen relative code-grid">
<div class="relative flex min-h-screen w-full flex-col overflow-x-hidden">

  <header class="sticky top-0 z-50 glass-nav border-b border-workbench-border px-4 md:px-8 py-3">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-4">
        <a href="{{ '/' | url }}" class="flex items-center gap-2 no-underline">
          <div class="size-8 bg-primary/10 border border-primary/30 rounded flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-xl">terminal</span>
          </div>
          <span class="text-lg font-bold tracking-tight text-workbench-text-main">Michele Polo</span>
        </a>
        <div class="hidden lg:flex items-center h-4 w-px bg-workbench-border mx-2"></div>
        <nav class="hidden md:flex items-center gap-6">
          <a class="text-xs font-semibold uppercase tracking-wider text-workbench-text-muted hover:text-primary transition-colors no-underline" href="{{ '/blog/' | url }}">Posts</a>
          <a class="text-xs font-semibold uppercase tracking-wider text-workbench-text-muted hover:text-primary transition-colors no-underline" href="{{ '/docs/' | url }}">About</a>
        </nav>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1 border-r border-workbench-border pr-4 mr-2 hidden sm:flex">
          <span class="text-[10px] font-mono text-workbench-text-muted">STATUS:</span>
          <span class="size-2 rounded-full bg-green-500 animate-pulse"></span>
          <span class="text-[10px] font-mono text-green-500">AVAILABLE</span>
        </div>
        <div class="flex items-center gap-1">
          <a class="p-2 rounded hover:bg-workbench-border text-workbench-text-muted hover:text-workbench-text-main transition-all no-underline" href="https://github.com/MichelePolo" target="_blank" title="GitHub">
            <span class="material-symbols-outlined text-lg">account_tree</span>
          </a>
          <a class="p-2 rounded hover:bg-workbench-border text-workbench-text-muted hover:text-workbench-text-main transition-all no-underline" href="https://x.com/giappone" target="_blank" title="X (Twitter)">
            <span class="material-symbols-outlined text-lg">close</span>
          </a>
          <a class="p-2 rounded hover:bg-workbench-border text-workbench-text-muted hover:text-workbench-text-main transition-all no-underline" href="mailto:michele.polo@gmail.com" title="Email">
            <span class="material-symbols-outlined text-lg">mail</span>
          </a>
        </div>
      </div>
    </div>
  </header>

  <main class="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
    {% block content %}
      {{ content | safe }}
    {% endblock %}
  </main>

  <footer class="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 border-t border-workbench-border flex flex-col md:flex-row items-center justify-between gap-6">
    <div class="text-workbench-text-muted text-[11px] font-mono uppercase tracking-widest">
      &copy; 2025 Michele Polo // Verona, IT
    </div>
    <div class="flex items-center gap-8">
      <a class="text-workbench-text-muted hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest no-underline" href="https://github.com/MichelePolo" target="_blank">GitHub</a>
      <a class="text-workbench-text-muted hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest no-underline" href="https://x.com/giappone" target="_blank">X (Twitter)</a>
      <a class="text-workbench-text-muted hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest no-underline" href="mailto:michele.polo@gmail.com">Email</a>
    </div>
  </footer>

</div>
</body>
</html>
```

**Step 2: Verify build succeeds**

Run: `npm run build`
Expected: Build completes without errors, `_site/` generated.

**Step 3: Commit**

```bash
git add src/_includes/layouts/base.njk
git commit -m "refactor: rewrite base.njk with Tailwind CSS, Space Grotesk, glass-nav"
```

---

### Task 2: Replace styles.css — article content prose styles

**Files:**
- Modify: `src/assets/styles.css`

**Step 1: Replace `src/assets/styles.css` with scoped article content styles**

This file now only handles Markdown-generated content that Tailwind utility classes can't reach (because Eleventy renders Markdown to raw `<h2>`, `<p>`, `<pre>`, etc. without classes).

```css
/* Article content — styles for Markdown-rendered HTML inside .article-content */
.article-content h1,
.article-content h2,
.article-content h3 {
  color: #f97415;
  font-weight: 600;
  line-height: 1.3;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.article-content h1 { font-size: 1.75rem; }
.article-content h2 { font-size: 1.375rem; }
.article-content h3 { font-size: 1.125rem; }

.article-content p {
  color: #8b949e;
  line-height: 1.8;
  margin: 0.75rem 0;
}

.article-content a {
  color: #f97415;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.article-content a:hover {
  color: #fb923c;
}

.article-content strong {
  color: #f0f6fc;
  font-weight: 600;
}

.article-content em {
  color: #c9d1d9;
}

.article-content ul,
.article-content ol {
  color: #8b949e;
  margin: 0.75rem 0;
  padding-left: 1.5rem;
}

.article-content li {
  margin: 0.4rem 0;
  line-height: 1.7;
}

.article-content blockquote {
  border-left: 3px solid #f97415;
  margin: 1.5rem 0;
  padding: 0.5rem 0 0.5rem 1.5rem;
  color: #c9d1d9;
  font-style: italic;
}

.article-content blockquote em {
  font-style: normal;
}

.article-content code {
  background: #161b22;
  border: 1px solid #30363d;
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: #f0f6fc;
}

.article-content pre {
  background: #0d1117;
  border: 1px solid #30363d;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.article-content pre code {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.85rem;
  line-height: 1.6;
}

.article-content hr {
  border: none;
  text-align: center;
  margin: 2.5rem 0;
}

.article-content hr::before {
  content: "* * *";
  color: #f97415;
  letter-spacing: 1rem;
  font-size: 0.9rem;
}

.article-content img {
  max-width: 100%;
  height: auto;
  margin: 1.5rem 0;
  border-radius: 0.5rem;
  border: 1px solid #30363d;
}
```

**Step 2: Verify build succeeds**

Run: `npm run build`
Expected: Build completes, `_site/assets/styles.css` contains new content.

**Step 3: Commit**

```bash
git add src/assets/styles.css
git commit -m "refactor: replace styles.css with scoped article-content prose styles"
```

---

### Task 3: Rewrite home.njk — hero + recent posts grid

**Files:**
- Modify: `src/_includes/layouts/home.njk`

**Step 1: Replace `src/_includes/layouts/home.njk` with the new template**

This matches the target prototype closely: hero section with avatar, title, CTA buttons, then a 2-column recent posts grid, then the CTA contact section.

```njk
{% extends "layouts/base.njk" %}

{% block content %}
  {# Hero section #}
  <section class="flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-20">
    <div class="relative group shrink-0">
      <div class="absolute -inset-1 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition duration-500"></div>
      <div class="relative size-40 md:size-52 rounded-full overflow-hidden border-4 border-workbench-border p-1 bg-workbench-bg">
        <img alt="Michele Polo" class="w-full h-full object-cover rounded-full transition-all duration-500" src="{{ '/assets/avatar.png' | url }}">
      </div>
    </div>
    <div class="flex flex-col text-center md:text-left flex-1">
      <div class="inline-flex items-center justify-center md:justify-start gap-2 text-primary font-mono text-xs mb-4">
        <span class="material-symbols-outlined text-sm">location_on</span>
        <span class="tracking-widest uppercase">Verona // Italy</span>
      </div>
      <h2 class="text-4xl md:text-7xl font-bold leading-tight mb-6 text-workbench-text-main tracking-tight">
        A Veronese Developer's <span class="text-primary">Journey into AI</span>
      </h2>
      <p class="text-lg text-workbench-text-muted leading-relaxed max-w-2xl font-light border-l-2 border-primary/30 pl-6">
        Progetti per comprendere, documentare e analizzare codebase complesse con l'aiuto dell'IA.
      </p>
      <div class="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
        <a href="{{ '/blog/' | url }}" class="bg-primary hover:bg-orange-600 text-white px-6 py-2.5 rounded-sm font-bold text-sm uppercase tracking-widest transition-all shadow-lg shadow-primary/10 no-underline">
          Read Blog
        </a>
        <a href="https://github.com/MichelePolo" target="_blank" class="bg-workbench-card hover:bg-workbench-border text-workbench-text-main px-6 py-2.5 rounded-sm font-bold text-sm border border-workbench-border uppercase tracking-widest transition-all no-underline">
          View Portfolio
        </a>
      </div>
    </div>
  </section>

  {# Recent posts section #}
  <section class="mb-20">
    <div class="flex items-center justify-between mb-8 pb-4 border-b border-workbench-border">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-primary">terminal</span>
        <h3 class="text-sm font-bold text-workbench-text-muted uppercase tracking-[0.2em] m-0">Recent Posts</h3>
      </div>
      <a class="text-primary hover:text-orange-400 font-mono text-xs flex items-center gap-1 uppercase tracking-wider no-underline" href="{{ '/blog/' | url }}">
        View Archive <span class="material-symbols-outlined text-sm">arrow_right_alt</span>
      </a>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-workbench-border overflow-hidden rounded border border-workbench-border">
      {% for post in collections.post %}
        {% if loop.index <= 3 %}
          <article class="bg-workbench-bg p-8 hover:bg-workbench-card transition-colors group{% if loop.index == 3 %} md:col-span-2{% endif %}">
            {% if loop.index == 3 %}
              <div class="flex items-center justify-between mb-6">
                <span class="font-mono text-[11px] text-workbench-text-muted uppercase tracking-tighter">{{ post.date | readableDate }}</span>
              </div>
              <div class="md:flex gap-12">
                <div class="md:flex-1">
                  <h4 class="text-xl font-bold mb-4 group-hover:text-primary transition-colors text-workbench-text-main leading-tight">
                    {{ post.data.title }}
                  </h4>
                  {% if post.data.subtitle %}
                    <p class="text-sm text-workbench-text-muted leading-relaxed mb-8">
                      {{ post.data.subtitle }}
                    </p>
                  {% endif %}
                </div>
                <div class="md:w-1/3 flex flex-col justify-end pb-8">
                  <a href="{{ post.url | url }}" class="flex items-center gap-1 text-[11px] font-bold text-primary uppercase tracking-widest no-underline hover:text-orange-400">
                    Read Article <span class="material-symbols-outlined text-sm">chevron_right</span>
                  </a>
                </div>
              </div>
            {% else %}
              <div class="flex items-center justify-between mb-6">
                <span class="font-mono text-[11px] text-workbench-text-muted uppercase tracking-tighter">{{ post.date | readableDate }}</span>
              </div>
              <h4 class="text-xl font-bold mb-4 group-hover:text-primary transition-colors text-workbench-text-main leading-tight">
                {{ post.data.title }}
              </h4>
              {% if post.data.subtitle %}
                <p class="text-sm text-workbench-text-muted leading-relaxed mb-8 line-clamp-3">
                  {{ post.data.subtitle }}
                </p>
              {% endif %}
              <div class="flex items-center justify-between mt-auto">
                <a href="{{ post.url | url }}" class="flex items-center gap-1 text-[11px] font-bold text-primary uppercase tracking-widest no-underline hover:text-orange-400">
                  Read Article <span class="material-symbols-outlined text-sm">chevron_right</span>
                </a>
                <span class="material-symbols-outlined text-workbench-border text-2xl group-hover:text-primary/20 transition-colors">code</span>
              </div>
            {% endif %}
          </article>
        {% endif %}
      {% endfor %}
    </div>
  </section>

  {# CTA section #}
  <section class="bg-workbench-card border border-workbench-border rounded p-8 md:p-12 relative overflow-hidden">
    <div class="absolute top-0 right-0 p-4">
      <span class="material-symbols-outlined text-workbench-border text-6xl rotate-12">contact_support</span>
    </div>
    <div class="relative z-10">
      <h3 class="text-2xl font-bold mb-4 text-workbench-text-main tracking-tight">Interessato ad approfondire?</h3>
      <p class="text-workbench-text-muted max-w-lg mb-8 leading-relaxed">
        Se stai lavorando a progetti che integrano l'IA nello sviluppo software, mi piacerebbe scambiare due chiacchiere.
      </p>
      <div class="flex gap-4">
        <a href="mailto:michele.polo@gmail.com" class="bg-primary text-white px-8 py-3 rounded-sm font-bold flex items-center gap-3 hover:bg-orange-600 transition-colors uppercase text-sm tracking-widest no-underline">
          <span class="material-symbols-outlined text-lg">send</span> Parliamo
        </a>
      </div>
    </div>
  </section>
{% endblock %}
```

**Step 2: Verify build succeeds**

Run: `npm run build`
Expected: Build completes, homepage at `_site/index.html` contains the hero and grid.

**Step 3: Commit**

```bash
git add src/_includes/layouts/home.njk
git commit -m "refactor: rewrite home.njk with hero section and post grid"
```

---

### Task 4: Rewrite post.njk — single article layout

**Files:**
- Modify: `src/_includes/layouts/post.njk`

**Step 1: Replace `src/_includes/layouts/post.njk` with the new template**

Single post page with constrained width for readability. Uses the `.article-content` class from `styles.css` for markdown body.

```njk
{% extends "layouts/base.njk" %}

{% block content %}
  <article class="max-w-4xl mx-auto">
    <header class="mb-10">
      <div class="mb-4">
        <a href="{{ '/blog/' | url }}" class="text-primary hover:text-orange-400 font-mono text-xs flex items-center gap-1 uppercase tracking-wider no-underline">
          <span class="material-symbols-outlined text-sm">arrow_back</span> All Posts
        </a>
      </div>
      <h1 class="text-3xl md:text-5xl font-bold leading-tight mb-4 text-workbench-text-main tracking-tight">{{ title }}</h1>
      {% if page.date %}
        <div class="font-mono text-[11px] text-workbench-text-muted uppercase tracking-tighter mb-6">
          {{ page.date | readableDate }}
        </div>
      {% endif %}
      {% if quote %}
        <blockquote class="border-l-2 border-primary/30 pl-6 my-6">
          <p class="text-workbench-text-muted italic leading-relaxed">{{ quote }}</p>
          {% if quoteAuthor %}
            <p class="text-workbench-text-muted text-sm mt-2">&mdash; {{ quoteAuthor }}</p>
          {% endif %}
        </blockquote>
      {% endif %}
      <div class="border-b border-workbench-border"></div>
    </header>

    <div class="article-content">
      {{ content | safe }}
    </div>
  </article>
{% endblock %}
```

**Step 2: Verify build succeeds and a post page renders**

Run: `npm run build`
Expected: Build completes, post pages in `_site/posts/` contain the new layout.

**Step 3: Commit**

```bash
git add src/_includes/layouts/post.njk
git commit -m "refactor: rewrite post.njk with Tailwind article layout"
```

---

### Task 5: Rewrite docs.njk — docs/about page

**Files:**
- Modify: `src/_includes/layouts/docs.njk`

**Step 1: Replace `src/_includes/layouts/docs.njk` with the new template**

```njk
{% extends "layouts/base.njk" %}

{% block content %}
  <section class="max-w-4xl mx-auto">
    <h1 class="text-3xl md:text-5xl font-bold leading-tight mb-8 text-workbench-text-main tracking-tight">{{ title }}</h1>
    <div class="border-b border-workbench-border mb-8"></div>
    <div class="article-content">
      {{ content | safe }}
    </div>
  </section>
{% endblock %}
```

**Step 2: Verify build succeeds**

Run: `npm run build`
Expected: Build completes, `_site/docs/index.html` uses new layout.

**Step 3: Commit**

```bash
git add src/_includes/layouts/docs.njk
git commit -m "refactor: rewrite docs.njk with Tailwind layout"
```

---

### Task 6: Rewrite blog.md — archive page with post grid

**Files:**
- Modify: `src/pages/blog.md`

**Step 1: Replace `src/pages/blog.md` with Tailwind grid layout**

```markdown
---
layout: layouts/base.njk
title: All Posts
permalink: "blog/"
---

<div class="flex items-center justify-between mb-8 pb-4 border-b border-workbench-border">
  <div class="flex items-center gap-3">
    <span class="material-symbols-outlined text-primary">terminal</span>
    <h1 class="text-sm font-bold text-workbench-text-muted uppercase tracking-[0.2em] m-0">All Posts</h1>
  </div>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-workbench-border overflow-hidden rounded border border-workbench-border">
  {% for post in collections.post %}
    <article class="bg-workbench-bg p-8 hover:bg-workbench-card transition-colors group">
      <div class="flex items-center justify-between mb-6">
        <span class="font-mono text-[11px] text-workbench-text-muted uppercase tracking-tighter">{{ post.date | readableDate }}</span>
      </div>
      <h4 class="text-xl font-bold mb-4 group-hover:text-primary transition-colors text-workbench-text-main leading-tight">
        {{ post.data.title }}
      </h4>
      {% if post.data.subtitle %}
        <p class="text-sm text-workbench-text-muted leading-relaxed mb-8 line-clamp-3">
          {{ post.data.subtitle }}
        </p>
      {% endif %}
      <div class="flex items-center justify-between mt-auto">
        <a href="{{ post.url | url }}" class="flex items-center gap-1 text-[11px] font-bold text-primary uppercase tracking-widest no-underline hover:text-orange-400">
          Read Article <span class="material-symbols-outlined text-sm">chevron_right</span>
        </a>
        <span class="material-symbols-outlined text-workbench-border text-2xl group-hover:text-primary/20 transition-colors">code</span>
      </div>
    </article>
  {% endfor %}
</div>
```

**Step 2: Verify build succeeds**

Run: `npm run build`
Expected: Build completes, `_site/blog/index.html` shows all posts in a grid.

**Step 3: Commit**

```bash
git add src/pages/blog.md
git commit -m "refactor: rewrite blog.md with Tailwind post grid"
```

---

### Task 7: Visual verification

**Step 1: Start dev server and verify all pages**

Run: `npm run dev`

Check these pages in browser at http://localhost:8080/Journey/:
1. **Homepage** (`/`): Hero section with avatar, title, CTA buttons. Recent posts grid (3 cards). CTA contact section. Sticky glass navbar. Footer.
2. **Blog archive** (`/blog/`): Grid of all 12 post cards.
3. **Single post** (click any post): Back link, title, date, optional quote, markdown content with proper styling.
4. **Docs/About** (`/docs/`): Title, content with article styling.
5. **Responsive**: Resize browser to verify mobile layout (single column, smaller avatar, wrapped nav).

**Step 2: Final commit if any tweaks needed**

```bash
git add -A
git commit -m "feat: complete blog redesign with Tailwind + Space Grotesk layout"
```
