# Blog Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the Journey blog visual design from the current dark/orange theme to a glassmorphism-based dark/blue theme with GSAP animations, matching the React prototype.

**Architecture:** In-place replacement of Eleventy templates and CSS on the `new_design` branch. Tailwind v4 via `@tailwindcss/cli` replaces the CDN runtime. GSAP + ScrollTrigger loaded via CDN for animations. No framework change — stays Eleventy + Nunjucks.

**Tech Stack:** Eleventy 3.1.2, Tailwind CSS v4 (`@tailwindcss/cli`), GSAP 3 + ScrollTrigger (CDN), Google Fonts (Inter + Playfair Display), Nunjucks templates.

**Spec:** `docs/superpowers/specs/2026-03-27-blog-redesign-design.md`

**Note:** This project has no automated tests. Verification is visual — run the dev server and check each page in the browser after each task.

**Prerequisite:** Ensure you are on the `new_design` branch: `git checkout new_design`

---

### Task 1: Build Pipeline Setup

**Files:**
- Modify: `package.json`
- Modify: `.eleventy.js`

- [ ] **Step 1: Install @tailwindcss/cli**

```bash
npm install -D @tailwindcss/cli
```

- [ ] **Step 2: Update npm scripts in package.json**

Replace the `scripts` block:

```json
{
  "dev": "npx @11ty/eleventy --serve & npx @tailwindcss/cli -i src/assets/styles.css -o _site/assets/styles.css --watch",
  "build": "npx @tailwindcss/cli -i src/assets/styles.css -o _site/assets/styles.css && npx @11ty/eleventy"
}
```

- [ ] **Step 3: Update .eleventy.js passthrough**

Replace the single passthrough:

```js
// OLD:
eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

// NEW:
eleventyConfig.addPassthroughCopy({ "src/assets/avatar.png": "assets/avatar.png" });
eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
```

This prevents Eleventy from overwriting the Tailwind-compiled CSS with the source file.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .eleventy.js
git commit -m "build: add tailwind v4 cli and update asset passthrough"
```

---

### Task 2: Rewrite styles.css (Tailwind v4 + Utility Classes)

**Files:**
- Rewrite: `src/assets/styles.css`

- [ ] **Step 1: Rewrite styles.css**

Replace the entire file with:

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Playfair Display", serif;

  --color-glass: rgba(255, 255, 255, 0.05);
  --color-glass-border: rgba(255, 255, 255, 0.1);
  --color-glass-heavy: rgba(255, 255, 255, 0.1);
}

body {
  background-color: #0f172a;
  color: #f8fafc;
  font-family: var(--font-sans);
  overflow-x: hidden;
}

/* Glass utilities */
.glass {
  background: var(--color-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-glass-border);
}

.glass-heavy {
  background: var(--color-glass-heavy);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--color-glass-border);
}

/* Text gradient */
.text-gradient {
  background: linear-gradient(to right, #ffffff, #a1a1a1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #0f172a;
}

::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #334155;
}

/* Article content — Markdown-rendered HTML inside .article-content */
.article-content h1,
.article-content h2,
.article-content h3 {
  font-family: "Playfair Display", serif;
  font-style: italic;
  color: #60a5fa;
  font-weight: 400;
  line-height: 1.3;
  margin-top: 2.5rem;
  margin-bottom: 0.75rem;
}

.article-content h1 { font-size: 1.75rem; }
.article-content h2 { font-size: 1.375rem; }
.article-content h3 { font-size: 1.125rem; }

.article-content p {
  color: #cbd5e1;
  line-height: 1.9;
  margin: 0.75rem 0;
}

.article-content a {
  color: #60a5fa;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.article-content a:hover {
  color: #93c5fd;
}

.article-content strong {
  color: #f8fafc;
  font-weight: 600;
}

.article-content em {
  color: #cbd5e1;
}

.article-content ul {
  color: #94a3b8;
  margin: 0.75rem 0;
  padding-left: 1.5rem;
  list-style-type: disc;
}

.article-content ol {
  color: #94a3b8;
  margin: 0.75rem 0;
  padding-left: 1.5rem;
  list-style-type: decimal;
}

.article-content li {
  margin: 0.4rem 0;
  line-height: 1.7;
}

.article-content blockquote {
  border-left: 3px solid #60a5fa;
  margin: 1.5rem 0;
  padding: 0.5rem 0 0.5rem 1.5rem;
  color: #cbd5e1;
  font-style: italic;
}

.article-content blockquote em {
  font-style: normal;
}

.article-content code {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: #cbd5e1;
}

.article-content pre {
  background: #1a1f2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 0.75rem;
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
  color: #60a5fa;
  letter-spacing: 1rem;
  font-size: 0.9rem;
}

.article-content img {
  max-width: 100%;
  height: auto;
  margin: 1.5rem 0;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

- [ ] **Step 2: Verify Tailwind compiles**

```bash
npx @tailwindcss/cli -i src/assets/styles.css -o _site/assets/styles.css
```

Expected: file created at `_site/assets/styles.css` with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/assets/styles.css
git commit -m "style: rewrite styles.css with tailwind v4 theme and glass utilities"
```

---

### Task 3: Rewrite base.njk

**Files:**
- Rewrite: `src/_includes/layouts/base.njk`

- [ ] **Step 1: Rewrite base.njk**

Replace the entire file. Key changes:
- Remove Tailwind CDN script + inline config
- Remove Space Grotesk + Material Symbols font links
- Add Google Fonts (Inter + Playfair Display)
- Reference compiled CSS via `{{ '/assets/styles.css' | url }}`
- Add GSAP + ScrollTrigger CDN scripts
- Add `{{ '/assets/js/animations.js' | url }}` script
- Replace sticky full-width header with centered glass pill navbar
- Add 3 animated background blob divs (`.blob-blue`, `.blob-indigo`, `.blob-slate`)
- Replace footer with minimal centered version
- All internal links must use `| url` filter

Full content for `base.njk`:

```html
<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }} | Michele Polo</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{{ '/assets/styles.css' | url }}">
</head>
<body class="min-h-screen relative selection:bg-blue-500/30">

  <!-- Ambient Background Blobs -->
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div class="blob-blue absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px]"></div>
    <div class="blob-indigo absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-indigo-500/20 blur-[120px]"></div>
    <div class="blob-slate absolute top-[20%] right-[15%] w-[20%] h-[20%] rounded-full bg-slate-400/10 blur-[100px]"></div>
  </div>

  <!-- Navbar -->
  <nav class="navbar fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
    <div class="glass px-6 py-3 rounded-full flex items-center gap-8 text-sm font-medium shadow-lg shadow-black/20">
      <a href="{{ '/' | url }}" class="flex items-center gap-3 hover:text-blue-300 transition-colors">
        <img
          src="{{ '/assets/avatar.png' | url }}"
          alt="Michele Polo"
          class="w-7 h-7 rounded-full border border-white/20"
        />
        <span>Michele Polo</span>
      </a>
      <div class="h-4 w-[1px] bg-white/10 hidden md:block"></div>
      <div class="hidden md:flex items-center gap-6 text-slate-300">
        <a href="{{ '/blog/' | url }}" class="hover:text-white transition-colors">Blog</a>
        <a href="{% if page.url == '/' %}#about{% else %}{{ '/' | url }}#about{% endif %}" class="hover:text-white transition-colors">About</a>
        <a href="https://github.com/MichelePolo" target="_blank" class="hover:text-white transition-colors">GitHub</a>
      </div>
    </div>
  </nav>

  <main class="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24">
    {% block content %}
      {{ content | safe }}
    {% endblock %}
  </main>

  <footer class="relative z-10 border-t border-white/5 py-12 text-center text-slate-500 text-sm">
    <p>&copy; {% year %} Michele Polo. Built with passion and AI.</p>
  </footer>

  <!-- GSAP -->
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
  <script src="{{ '/assets/js/animations.js' | url }}"></script>
</body>
</html>
```

- [ ] **Step 2: Add year shortcode to .eleventy.js**

The `base.njk` footer uses `{% year %}`. Add this shortcode to `.eleventy.js` before the `return` statement:

```js
eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
```

- [ ] **Step 3: Verify — run dev server and check navbar renders**

```bash
npm run dev
```

Open `http://localhost:8080/Journey/` — expect: dark slate background, centered glass pill navbar, blob backgrounds visible, no content yet (templates not updated).

- [ ] **Step 4: Commit**

```bash
git add src/_includes/layouts/base.njk .eleventy.js
git commit -m "layout: rewrite base.njk with glass navbar and animated background"
```

---

### Task 4: Create animations.js

**Files:**
- Create: `src/assets/js/animations.js`

- [ ] **Step 1: Create the js directory and animations file**

```bash
mkdir -p src/assets/js
```

- [ ] **Step 2: Write animations.js**

```js
// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// --- Background Blobs ---
gsap.to(".blob-blue", {
  scale: 1.1,
  opacity: 0.5,
  duration: 15,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});

gsap.to(".blob-indigo", {
  scale: 1.2,
  opacity: 0.4,
  duration: 20,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
  delay: 2
});

gsap.to(".blob-slate", {
  x: 30,
  y: -30,
  duration: 18,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});

// --- Navbar fade-in ---
gsap.from(".navbar", {
  y: -50,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out"
});

// --- Hero stagger (homepage only) ---
gsap.from(".hero-item", {
  y: 30,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out",
  stagger: 0.15
});

// --- Scroll indicator fade ---
gsap.to(".scroll-indicator", {
  opacity: 0,
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "20% top",
    scrub: true
  }
});

// --- Scroll-triggered reveal for sections ---
ScrollTrigger.batch(".scroll-reveal", {
  onEnter: (batch) => gsap.from(batch, {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.15
  }),
  start: "top 85%",
  once: true
});

// --- Post page header ---
gsap.from(".post-header > *", {
  y: 20,
  opacity: 0,
  duration: 0.6,
  ease: "power3.out",
  stagger: 0.1
});
```

- [ ] **Step 3: Verify — animations.js loads without console errors**

With dev server running, open browser console. Expect: no JS errors. Blob elements should animate slowly. Navbar should fade in.

- [ ] **Step 4: Commit**

```bash
git add src/assets/js/animations.js
git commit -m "feat: add GSAP animations for blobs, navbar, scroll reveals"
```

---

### Task 5: Rewrite home.njk (Homepage)

**Files:**
- Rewrite: `src/_includes/layouts/home.njk`

- [ ] **Step 1: Rewrite home.njk**

Replace the entire file with:

```html
{% extends "layouts/base.njk" %}

{% block content %}
  {# Hero Section #}
  <section class="min-h-[75vh] flex flex-col justify-center relative">
    <div class="flex flex-col md:flex-row md:items-center gap-12">
      <div class="flex-1">
        <h1 class="hero-item font-serif italic text-5xl md:text-8xl leading-tight mb-8">
          A Veronese Developer's <br>
          <span class="text-gradient">Journey into AI</span>
        </h1>
        <p class="hero-item text-xl md:text-2xl text-slate-400 max-w-2xl font-light leading-relaxed mb-12">
          Progetti per comprendere, documentare e analizzare codebase complesse con l'aiuto dell'intelligenza artificiale.
        </p>

        <div class="hero-item flex flex-wrap gap-4">
          <a href="#blog" class="glass-heavy px-8 py-4 rounded-full flex items-center gap-3 font-medium transition-colors hover:bg-white/15 no-underline">
            Read Blog
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
          <a href="mailto:michele.polo@gmail.com" class="px-8 py-4 rounded-full border border-white/10 flex items-center gap-3 font-medium transition-colors hover:bg-white/[0.08] no-underline">
            Contact Me
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </a>
        </div>
      </div>

      <div class="hero-item relative shrink-0">
        <div class="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
        <img
          src="{{ '/assets/avatar.png' | url }}"
          alt="Michele Polo"
          class="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-white/10 object-cover shadow-2xl"
        />
      </div>
    </div>

    {# Scroll Indicator #}
    <div class="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500">
      <span class="text-xs tracking-widest uppercase">Scroll</span>
      <div class="w-[1px] h-12 bg-gradient-to-b from-slate-500 to-transparent"></div>
    </div>
  </section>

  {# Feature Cards / About #}
  <section id="about" class="py-32">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="scroll-reveal glass p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/[0.08] border border-white/5 hover:border-white/10 shadow-xl shadow-black/20">
        <div class="mb-6 p-4 w-fit rounded-2xl bg-white/5 shadow-inner">
          <svg class="text-blue-400" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3 4 4.5 4.5 0 0 1-3-4"/><path d="M12 18v-6"/></svg>
        </div>
        <h3 class="text-xl font-semibold mb-3 text-slate-100">AI Integration</h3>
        <p class="text-slate-400 leading-relaxed">Esplorando come i Large Language Models possono trasformare il modo in cui scriviamo e leggiamo il codice.</p>
      </div>

      <div class="scroll-reveal glass p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/[0.08] border border-white/5 hover:border-white/10 shadow-xl shadow-black/20">
        <div class="mb-6 p-4 w-fit rounded-2xl bg-white/5 shadow-inner">
          <svg class="text-indigo-400" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
        </div>
        <h3 class="text-xl font-semibold mb-3 text-slate-100">Code Analysis</h3>
        <p class="text-slate-400 leading-relaxed">Strumenti e metodologie per navigare architetture software complesse con maggiore chiarezza.</p>
      </div>

      <div class="scroll-reveal glass p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/[0.08] border border-white/5 hover:border-white/10 shadow-xl shadow-black/20">
        <div class="mb-6 p-4 w-fit rounded-2xl bg-white/5 shadow-inner">
          <svg class="text-slate-300" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
        </div>
        <h3 class="text-xl font-semibold mb-3 text-slate-100">Modern Tech</h3>
        <p class="text-slate-400 leading-relaxed">Sperimentazione continua con le ultime tecnologie per costruire soluzioni robuste e scalabili.</p>
      </div>
    </div>
  </section>

  {# Recent Posts #}
  <section id="blog" class="py-32">
    <div class="scroll-reveal flex items-end justify-between mb-16">
      <div>
        <h2 class="text-4xl md:text-5xl font-serif italic mb-4">Recent Posts</h2>
        <p class="text-slate-400 text-lg">Pensieri e riflessioni sul mio percorso.</p>
      </div>
      <a href="{{ '/blog/' | url }}" class="hidden md:flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors no-underline">
        View Archive
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/><path d="m21 3-9 9"/><path d="M15 3h6v6"/></svg>
      </a>
    </div>

    <div class="grid grid-cols-1 gap-6">
      {% for post in collections.post %}
        {% if loop.index <= 3 %}
          <a href="{{ post.url | url }}" class="scroll-reveal group glass p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 border border-white/5 hover:border-white/10 hover:translate-x-2 hover:bg-white/[0.08] no-underline">
            <div class="max-w-2xl">
              <span class="text-xs font-mono text-blue-400/80 uppercase tracking-widest mb-3 block">
                {{ post.date | readableDate }}
              </span>
              <h3 class="text-2xl font-medium mb-3 text-slate-200 group-hover:text-blue-300 transition-colors">
                {{ post.data.title }}
              </h3>
              {% if post.data.subtitle %}
                <p class="text-slate-400 line-clamp-2">{{ post.data.subtitle }}</p>
              {% endif %}
            </div>
            <div class="flex items-center gap-2 text-slate-500 group-hover:text-blue-300 transition-colors shrink-0">
              <span class="text-sm font-medium">Read Article</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </a>
        {% endif %}
      {% endfor %}
    </div>
  </section>

  {# Contact Section #}
  <section class="py-32 text-center">
    <div class="scroll-reveal glass p-12 md:p-24 rounded-[3rem] relative overflow-hidden shadow-2xl shadow-black/40 border border-white/10">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      <div class="absolute inset-0 bg-blue-500/5 blur-[100px] pointer-events-none"></div>

      <h2 class="relative text-4xl md:text-6xl font-serif italic mb-8">Interessato ad approfondire?</h2>
      <p class="relative text-xl text-slate-400 max-w-xl mx-auto mb-12">
        Se stai lavorando a progetti che integrano l'IA nello sviluppo software, mi piacerebbe scambiare due chiacchiere.
      </p>

      <div class="relative flex flex-col md:flex-row items-center justify-center gap-8">
        <a href="mailto:michele.polo@gmail.com" class="flex items-center gap-3 text-lg font-medium hover:text-blue-400 transition-colors no-underline">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          michele.polo@gmail.com
        </a>
        <div class="hidden md:block h-6 w-[1px] bg-white/10"></div>
        <div class="flex items-center gap-6">
          <a href="https://github.com/MichelePolo" target="_blank" class="p-4 glass rounded-2xl hover:bg-white/10 hover:text-blue-300 transition-colors no-underline">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          </a>
          <a href="https://x.com/giappone" target="_blank" class="p-4 glass rounded-2xl hover:bg-white/10 hover:text-blue-300 transition-colors no-underline">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
          </a>
        </div>
      </div>
    </div>
  </section>
{% endblock %}
```

- [ ] **Step 2: Verify — open homepage in browser**

```bash
npm run dev
```

Open `http://localhost:8080/Journey/`. Check:
- Hero: large italic title, gradient text, avatar with glow, 2 CTA buttons
- Scroll indicator: "Scroll" label + line, fades on scroll
- Feature cards: 3 glass cards, hover lifts them
- Recent posts: 3 post cards with dates, hover shifts right
- Contact: large rounded glass card, email + socials

- [ ] **Step 3: Commit**

```bash
git add src/_includes/layouts/home.njk
git commit -m "layout: rewrite homepage with hero, feature cards, posts, and CTA"
```

---

### Task 6: Rewrite post.njk (Post Page — Minimal Flow)

**Files:**
- Rewrite: `src/_includes/layouts/post.njk`

- [ ] **Step 1: Rewrite post.njk**

Replace the entire file with the Minimal Flow layout:

```html
{% extends "layouts/base.njk" %}

{% block content %}
  <article class="max-w-3xl mx-auto">
    <header class="post-header mb-12">
      <div class="mb-6">
        <a href="{{ '/blog/' | url }}" class="text-blue-400 hover:text-blue-300 font-mono text-xs flex items-center gap-2 uppercase tracking-widest no-underline transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          All Posts
        </a>
      </div>

      <h1 class="font-serif italic text-3xl md:text-4xl leading-tight mb-4 text-white">{{ title }}</h1>

      {% if page.date %}
        <div class="font-mono text-[10px] text-blue-400/80 uppercase tracking-widest mb-8">
          {{ page.date | readableDate }}
        </div>
      {% endif %}

      {% if quote %}
        <div class="bg-white/[0.03] border border-white/[0.06] rounded-xl px-6 py-4 mb-8">
          <p class="text-slate-400 italic leading-relaxed text-sm">{{ quote }}</p>
          {% if quoteAuthor %}
            <p class="text-slate-500 text-xs mt-2">&mdash; {{ quoteAuthor }}</p>
          {% endif %}
        </div>
      {% endif %}

      <div class="h-px bg-white/[0.06]"></div>
    </header>

    <div class="article-content">
      {{ content | safe }}
    </div>
  </article>
{% endblock %}
```

- [ ] **Step 2: Verify — open a post page**

Open `http://localhost:8080/Journey/posts/16-non-si-finisce-mai/`. Check:
- Back link "← All Posts" in blue
- Title in Playfair italic
- Date in monospace blue
- Quote in glass box (if present)
- Article content with blue headings, proper spacing

- [ ] **Step 3: Commit**

```bash
git add src/_includes/layouts/post.njk
git commit -m "layout: rewrite post.njk with minimal flow design"
```

---

### Task 7: Rewrite blog.njk (Archive Page)

**Files:**
- Rewrite: `src/pages/blog.njk`

- [ ] **Step 1: Rewrite blog.njk**

Replace the entire file:

```html
---
layout: layouts/base.njk
title: Archivio Post
permalink: "blog/"
---

<div class="max-w-5xl mx-auto">
  <div class="mb-16">
    <h1 class="text-5xl md:text-7xl font-serif italic text-white mb-6">Archivio Post</h1>
    <p class="text-lg text-slate-400 max-w-2xl leading-relaxed">
      Una raccolta di pensieri su sistemi distribuiti, intelligenza artificiale e il panorama in evoluzione dell'architettura software.
    </p>
  </div>

  <div class="flex flex-col">
    {% for post in collections.post %}
      <a href="{{ post.url | url }}" class="scroll-reveal group border-b border-white/5 py-6 cursor-pointer transition-all block no-underline">
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div class="flex-1 space-y-3">
            <div class="text-xs font-mono uppercase tracking-widest text-slate-500">
              {{ post.date | readableDate }}
            </div>
            <h2 class="text-3xl md:text-4xl font-semibold text-white group-hover:text-blue-300 transition-colors duration-300 leading-tight">
              {{ post.data.title }}
            </h2>
            {% if post.data.subtitle %}
              <p class="text-lg text-slate-400 max-w-2xl leading-relaxed">
                {{ post.data.subtitle }}
              </p>
            {% endif %}
          </div>
          <div class="flex items-center group-hover:translate-x-2 transition-transform duration-300">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-600 group-hover:text-blue-400 transition-colors"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>
      </a>
    {% endfor %}
  </div>
</div>
```

- [ ] **Step 2: Verify — open archive page**

Open `http://localhost:8080/Journey/blog/`. Check:
- "Archivio Post" title in Playfair italic
- Posts listed with dates, titles, subtitles
- Hover: title turns blue, arrow shifts right
- Scroll animations trigger on each post

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog.njk
git commit -m "layout: rewrite blog archive with new design language"
```

---

### Task 8: Cleanup — Delete Docs Page

**Files:**
- Delete: `src/_includes/layouts/docs.njk`
- Delete: `src/pages/docs.md`

- [ ] **Step 1: Delete files**

```bash
rm src/_includes/layouts/docs.njk src/pages/docs.md
```

- [ ] **Step 2: Verify — build succeeds without docs**

```bash
npm run build
```

Expected: no errors, `_site/docs/` directory no longer generated.

- [ ] **Step 3: Commit**

```bash
git add -u src/_includes/layouts/docs.njk src/pages/docs.md
git commit -m "cleanup: remove docs page, about is now homepage anchor"
```

---

### Task 9: Final Verification and Polish

- [ ] **Step 1: Full build test**

```bash
npm run build
```

Expected: clean build, no errors.

- [ ] **Step 2: Visual verification checklist**

Run `npm run dev` and check every page:

- **Homepage** (`/Journey/`):
  - [ ] Glass pill navbar centered, fades in
  - [ ] Background blobs animate
  - [ ] Hero: title with gradient, avatar with glow, 2 CTAs
  - [ ] Scroll indicator fades on scroll
  - [ ] Feature cards: 3 cards, hover lift
  - [ ] Recent posts: 3 cards, hover shift right
  - [ ] Contact CTA: large glass card, email + socials
  - [ ] Footer: simple centered line

- **Blog archive** (`/Journey/blog/`):
  - [ ] Title in Playfair italic
  - [ ] All posts listed with correct dates
  - [ ] Hover states work (blue title, arrow shift)
  - [ ] Scroll reveal animations

- **Post page** (e.g., `/Journey/posts/16-non-si-finisce-mai/`):
  - [ ] Back link works
  - [ ] Title in Playfair italic, date in blue mono
  - [ ] Quote in glass box
  - [ ] Article content: blue headings, proper typography
  - [ ] Code blocks, blockquotes, lists render correctly

- **Mobile** (resize to <768px):
  - [ ] Navbar shows only avatar + name
  - [ ] Hero stacks vertically
  - [ ] Feature cards stack to single column
  - [ ] Post cards stack properly

- [ ] **Step 3: Fix any visual issues found**

Address spacing, color, or layout issues discovered during verification.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "style: polish and fix visual issues from redesign verification"
```

Only create this commit if there are actual fixes. Skip if everything is clean.

---

### Task 10: Update GitHub Actions (if needed)

- [ ] **Step 1: Verify deploy workflow**

The workflow at `.github/workflows/deploy.yml` runs `npm run build`. Since we updated the build script in Task 1 to run Tailwind CLI before Eleventy, the workflow should work without changes. Verify by reading the workflow file and confirming it uses `npm run build`.

- [ ] **Step 2: Commit workflow changes (only if needed)**

If the workflow needs changes (unlikely), commit them:

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: update deploy workflow for tailwind v4 build"
```
