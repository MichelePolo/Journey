# Blog Redesign — Design Spec

Migration of the Journey blog from its current design to a new glassmorphism-based dark theme, inspired by a React/Vite prototype. The blog stays on Eleventy + Nunjucks; only the visual layer changes.

## Decisions

| Decision | Choice |
|----------|--------|
| Animations | Full experience — GSAP + ScrollTrigger |
| Framework | Stay on Eleventy + Nunjucks (no framework migration) |
| Design consistency | Prototype's design language applied to all pages |
| Post layout | Minimal Flow — single column, left-aligned title, glass quote box |
| Color palette | Prototype: background `#0f172a`, text `#f8fafc`, accent `#60a5fa` |
| Typography | Inter (body) + Playfair Display italic (headings) via Google Fonts |
| About page | Eliminated — 3 feature cards on homepage with `#about` anchor |
| Migration approach | In-place replacement on `new_design` branch |

## Design Language

### Colors

- Background: `#0f172a` (slate-900)
- Text primary: `#f8fafc` (slate-50)
- Text secondary: `#94a3b8` (slate-400)
- Text muted: `#64748b` (slate-500)
- Accent: `#60a5fa` (blue-400)
- Accent hover: `#93c5fd` (blue-300)
- Glass background: `rgba(255, 255, 255, 0.05)`
- Glass border: `rgba(255, 255, 255, 0.1)`
- Glass heavy: `rgba(255, 255, 255, 0.1)`
- Text selection highlight: `bg-blue-500/30`

### Typography

- Body: Inter (weights 300, 400, 500, 600)
- Headings: Playfair Display (italic 400, bold 700)
- Monospace: system monospace stack for dates and code
- Base size: 16px, line-height 1.9 for body text

**Font usage rule:** Page-level headings (h1 — page titles, hero title) use Playfair Display italic. Content-level headings (post titles in lists, h2/h3 inside articles) use Playfair Display italic for article headings and Inter for list item titles.

### Layout Containers

- Main content container: `max-w-5xl` (1024px), centered with `mx-auto px-6`
- Article body text: `max-w-3xl` (720px), centered within the main container

### Utility Classes

**Glass:**
- `.glass` — `background: rgba(255,255,255,0.05)`, `backdrop-filter: blur(12px)`, `-webkit-backdrop-filter: blur(12px)`, `border: 1px solid rgba(255,255,255,0.1)`
- `.glass-heavy` — `background: rgba(255,255,255,0.1)`, `backdrop-filter: blur(20px)`, `-webkit-backdrop-filter: blur(20px)`, same border

**Text gradient:**
- `.text-gradient` — `background: linear-gradient(to right, #ffffff, #a1a1a1)`, `-webkit-background-clip: text`, `-webkit-text-fill-color: transparent`

**Custom scrollbar** (WebKit):
- Track: `#0f172a` (matches background)
- Thumb: `#1e293b`, border-radius 10px. Hover: `#334155`
- Width: 6px

### Animated Background

Three fixed blurred circles behind all content:

1. Blue blob — top-left, 40% size, `blue-500/20`, slow scale pulse (15s loop)
2. Indigo blob — bottom-right, 35% size, `indigo-500/20`, slow scale pulse (20s loop, 2s delay)
3. Slate blob — mid-right, 20% size, `slate-400/10`, slow XY drift (18s loop)

Animated with GSAP. Positioned `fixed`, `z-index: 0`, `pointer-events: none`.

## Build Pipeline

The current site uses Tailwind via CDN (`cdn.tailwindcss.com`) with inline config. The new design uses Tailwind v4 with `@theme` configuration.

**Integration method:** `@tailwindcss/cli` (simplest with Eleventy, no PostCSS or Vite needed).

**CSS flow:**
- Input: `src/assets/styles.css` — contains `@import "tailwindcss"`, `@theme { }` block with custom tokens (fonts, glass colors), and custom classes (`.glass`, `.glass-heavy`, `.text-gradient`, scrollbar, `.article-content`)
- Build: `npx @tailwindcss/cli -i src/assets/styles.css -o _site/assets/styles.css`
- Reference: `base.njk` links to `{{ '/assets/styles.css' | url }}`

**npm scripts update:**
```json
{
  "dev": "npx @11ty/eleventy --serve & npx @tailwindcss/cli -i src/assets/styles.css -o _site/assets/styles.css --watch",
  "build": "npx @tailwindcss/cli -i src/assets/styles.css -o _site/assets/styles.css && npx @11ty/eleventy"
}
```

**Note:** The `src/assets/styles.css` passthrough in `.eleventy.js` should be removed since Tailwind CLI writes directly to `_site/`. Only `src/assets/js/` and `src/assets/avatar.png` need passthrough.

## URL Handling

All internal links in templates must continue to use the `| url` Nunjucks filter to respect the `pathPrefix: "/Journey/"` setting for GitHub Pages subdirectory hosting. Examples:
- `{{ '/blog/' | url }}` — not `/blog/`
- `{{ '/assets/styles.css' | url }}` — not `/assets/styles.css`
- `{{ post.url | url }}` — for post links

The "About" link in the navbar should point to `{{ '/' | url }}#about` on non-homepage pages, and `#about` on the homepage.

## Pages

### Base Template (`base.njk`)

The root layout wrapping all pages.

**Head:**
- Google Fonts: Inter + Playfair Display
- Tailwind v4 compiled CSS
- GSAP + ScrollTrigger via CDN
- `animations.js` custom script

**Navbar:**
- Fixed top center, `z-50`
- Pill shape: glass background, `rounded-full`, shadow `shadow-lg shadow-black/20`
- Contents: avatar image (local `assets/avatar.png`, round, 28px, `border border-white/20`) + "Michele Polo" label, vertical divider (`h-4 w-[1px] bg-white/10`), links: "Blog" (`{{ '/blog/' | url }}`), "About" (`{{ '/' | url }}#about` or `#about` on homepage), "GitHub" (external)
- **Mobile:** Nav links hidden (`hidden md:flex`), only avatar + name visible. No hamburger menu (keeps zero-JS nav).
- GSAP animation: fade-in from top on page load (`y: -50` → `y: 0`, opacity 0 → 1, duration 0.8s)

**Background:**
- Three animated blobs (see Animated Background above)

**Footer:**
- Border top `white/5`, centered text
- `© {year} Michele Polo. Built with passion and AI.`
- Slate-500, small text

### Homepage (`home.njk`)

Extends `base.njk`. Four sections:

**Hero section** (min-height 75vh, flex column centered):
- Flex row: text left, avatar right (on desktop; stacks on mobile)
- Title: Playfair italic, 5xl mobile / 8xl desktop, "A Veronese Developer's Journey into AI" with `.text-gradient` on "Journey into AI"
- Subtitle: Inter light, xl/2xl, slate-400, max-width 2xl
- Two CTA buttons (pill shape):
  - "Read Blog →" — glass-heavy, links to `#blog`
  - "Contact Me ✉" — border-only `white/10`, links to mailto
- Avatar: local `assets/avatar.png`, round `w-48 h-48 md:w-64 md:h-64`, `border-2 border-white/10`, blue glow behind (`absolute inset-0 bg-blue-500/20 blur-3xl rounded-full`)
- Scroll indicator: Hero section must be `position: relative`. Indicator is `position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%)`. "Scroll" label in xs uppercase slate-500 + animated gradient line (`w-[1px] h-12 bg-gradient-to-b from-slate-500 to-transparent`). Fades out on scroll via GSAP `useTransform` equivalent (opacity tied to scrollY 0-20%).
- GSAP: stagger fade-up on all children (0.15s delay between items)

**Feature cards section** (`id="about"`, py-32):
- Grid: 3 columns desktop, 1 column mobile, gap-8
- Three cards, each glass `p-8 rounded-3xl`:
  - Icon in a `bg-white/5` rounded-2xl box. Icons are raw SVG markup inlined directly in `home.njk`, sourced from Lucide's SVG icon set (BrainCircuit in blue-400, Code2 in indigo-400, Cpu in slate-300). Set `width=28 height=28 stroke=currentColor stroke-width=1.5`.
  - Title: xl semibold slate-100
  - Description: slate-400
- CSS hover: `translateY(-8px)`, background `white/[0.08]`, border `white/10`
- GSAP: scroll-triggered stagger fade-up

**Recent Posts section** (`id="blog"`, py-32):
- Header: "Recent Posts" in Playfair italic 4xl/5xl + "View Archive ↗" link on right (hidden mobile)
- Subtitle: "Pensieri e riflessioni sul mio percorso." in slate-400
- Grid: single column, gap-6
- Each post card (limit 3, from `collections.post`):
  - Glass `p-8 rounded-3xl`, flex row (column on mobile)
  - Left: date in monospace blue-400 uppercase xs, title in 2xl medium slate-200, subtitle in slate-400
  - Right: "Read Article ›" in slate-500
  - Hover: `translateX(8px)`, background `white/[0.08]`, border `white/10`, title → blue-300, right text → blue-300
- Links point to `post.url` (internal Eleventy URLs)
- GSAP: scroll-triggered stagger fade-up

**Contact section** (py-32, text-center):
- Large glass card: `p-12 md:p-24 rounded-[3rem]`, shadow-2xl
- Top edge: gradient line `from-transparent via-blue-500/50 to-transparent`
- Inner glow: `blue-500/5 blur-[100px]`
- Title: Playfair italic 4xl/6xl "Interessato ad approfondire?"
- Subtitle: xl slate-400, max-width xl, centered
- Email link: flex with Mail icon, hover blue-400
- Social icons: GitHub + Twitter in glass rounded-2xl boxes, hover scale + lift
- GSAP: scroll-triggered fade-up

### Post Page (`post.njk`)

Extends `base.njk`. Single article layout (Minimal Flow).

**Header:**
- "← All Posts" link in blue-400, small uppercase monospace, links to `/blog/`
- Title: Playfair italic, ~2.5rem (3xl/4xl), left-aligned, white
- Date: monospace blue-400, uppercase, letter-spacing wide, small
- Quote (if present): glass box `rounded-xl`, `bg-white/[0.03]`, `border-white/[0.06]`, padding. Italic text slate-400, author in slate-500
- Divider: `h-px bg-white/[0.06]`

**Article content** (`.article-content`, max-width ~720px, centered):
- Paragraphs: Inter, `#cbd5e1` (slate-300), line-height 1.9
- Headings h2/h3: Playfair italic, `#60a5fa` (blue-400), generous margin-top
- Links: blue-400, underline, offset 2px. Hover: blue-300
- Bold: `#f8fafc` (white)
- Italic: `#cbd5e1`
- Unordered/ordered lists: slate-400, disc/decimal, left padding
- Blockquote: left border blue-400, padding, italic
- Inline code: glass background `rgba(255,255,255,0.05)`, thin border, mono font
- Code block (pre): slightly lighter than slate-900 background, glass border, border-radius 12px
- hr separator: `* * *` in blue-400
- Images: border-radius 12px, glass border

**Animation:** GSAP fade-up on header, progressive reveal of content on scroll.

### Blog Archive (`blog.njk`)

Extends `base.njk`. Full post listing.

**Header:**
- Title: "Archivio Post" in Playfair italic, ~5rem, white
- Subtitle: slate-400, lg size, max-width 2xl

**Post list:**
- Flex column, no gap (items separated by `border-bottom: white/5`)
- Each post row: link wrapping the entire block, `py-6`
  - Flex row: content left, arrow right
  - Date: xs uppercase monospace slate-400/muted
  - Title: 3xl/4xl Inter semibold, white. Hover: blue-300
  - Subtitle (if present): lg slate-400
  - Right arrow icon: SVG, slate-400. Hover: translate-x, blue-400
- GSAP: scroll-triggered stagger fade-up

## Animation Specification

All animations live in `src/assets/js/animations.js` and use GSAP + ScrollTrigger. Key values are translated from the prototype's Framer Motion definitions.

### Global Settings

- Custom easing: `"power3.out"` (GSAP equivalent of Framer Motion's `[0.16, 1, 0.3, 1]` cubic bezier)
- Default duration: 0.8s
- Stagger delay: 0.15s between siblings

### Navbar

- `gsap.from(".navbar", { y: -50, opacity: 0, duration: 0.8, ease: "power3.out" })`

### Background Blobs

```
// Blue blob — top-left
gsap.to(".blob-blue", { scale: 1.1, opacity: 0.5, duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut" })

// Indigo blob — bottom-right
gsap.to(".blob-indigo", { scale: 1.2, opacity: 0.4, duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2 })

// Slate blob — mid-right, XY drift
gsap.to(".blob-slate", { x: 30, y: -30, duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" })
```

### Hero Stagger (homepage)

```
gsap.from(".hero-item", {
  y: 30, opacity: 0, duration: 0.8, ease: "power3.out",
  stagger: 0.15
})
```

### Scroll Indicator Fade

```
gsap.to(".scroll-indicator", {
  opacity: 0,
  scrollTrigger: { trigger: "body", start: "top top", end: "20% top", scrub: true }
})
```

### Scroll-Triggered Sections (feature cards, posts, CTA, archive)

```
ScrollTrigger.batch(".scroll-reveal", {
  onEnter: (batch) => gsap.from(batch, {
    y: 30, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.15
  }),
  start: "top 85%",
  once: true
})
```

### Post Page

```
gsap.from(".post-header > *", {
  y: 20, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.1
})
```

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `src/_includes/layouts/base.njk` | Rewrite | New shell: navbar pill, fonts, GSAP, animated bg, footer |
| `src/_includes/layouts/home.njk` | Rewrite | Hero, feature cards, recent posts, CTA from prototype |
| `src/_includes/layouts/post.njk` | Rewrite | Minimal Flow layout |
| `src/pages/blog.njk` | Rewrite | New archive styling |
| `src/assets/styles.css` | Rewrite | Glass utilities, article-content with new palette |
| `src/assets/js/animations.js` | Create | GSAP animations: blobs, scroll-triggers, stagger |
| `src/_includes/layouts/docs.njk` | Delete | No longer needed |
| `src/pages/docs.md` | Delete | About is now homepage anchor |
| `.eleventy.js` | Modify | Add passthrough for `src/assets/js/` |
| `.gitignore` | Already modified | Added `.superpowers/` |

## Dependencies

- **@tailwindcss/cli** (v4): npm devDependency, for build-time CSS processing
- **GSAP + ScrollTrigger**: loaded via CDN (`<script>` tags in `base.njk`), no npm install needed. Use `https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js` and `https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js`
- **Google Fonts**: Inter + Playfair Display loaded via `<link>` in `<head>`

## Out of Scope

- Dark/light theme toggle (stays dark only)
- Search functionality
- RSS feed changes
- Post content migration (Markdown files unchanged)
- Deployment changes (GitHub Actions workflow stays the same)
