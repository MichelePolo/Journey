# Blog Redesign — Tailwind + Space Grotesk

## Goal

Replace the current custom CSS layout with the professional layout prototyped in `appunti/stitch_journey/`, using the same libraries: Tailwind CSS (CDN), Space Grotesk font, Material Symbols Outlined icons.

## Design System (from target prototype)

- **Font**: Space Grotesk via Google Fonts
- **Icons**: Material Symbols Outlined via Google Fonts
- **CSS Framework**: Tailwind CSS via CDN (`cdn.tailwindcss.com?plugins=forms,container-queries`)
- **Colors**: primary `#f97415`, bg `#0d1117`, card `#161b22`, border `#30363d`, text-main `#f0f6fc`, text-muted `#8b949e`
- **Background**: code-grid pattern (radial-gradient dots 40px spacing)
- **Navbar**: sticky, glass-effect (backdrop-blur), border-bottom
- **Border radius**: sm `0.125rem`, default `0.25rem`, lg `0.5rem`

## Files to Modify

### 1. `src/_includes/layouts/base.njk` — Full rewrite

New structure:
- `<head>`: Tailwind CDN script, Google Fonts (Space Grotesk + Material Symbols), inline Tailwind config with custom colors/fonts/radii, custom `<style>` for code-grid, glass-nav, body defaults
- `<header>`: Sticky glass-nav bar with: terminal icon + "Michele Polo" name, nav links (Posts, About), STATUS indicator, social icons (GitHub, X, Email) using Material Symbols — links point to existing real URLs
- `<main>`: `flex-1 w-full max-w-7xl mx-auto` (homepage uses full width, post/docs pages will constrain via their own templates)
- `<footer>`: border-top, copyright line, footer links (GitHub, X, LinkedIn)
- `{% block content %}` inside `<main>`
- Remove `showHeaderBio` conditional — hero moves entirely to `home.njk`

### 2. `src/_includes/layouts/home.njk` — Full rewrite

Extends base.njk. Contains:
- **Hero section**: flex row (avatar left, text right on md+). Avatar uses local `avatar.png` with orange glow hover effect. Title "A Veronese Developer's Journey into AI" with "Journey into AI" in primary color. Subtitle with left orange border. CTA buttons: "Read Blog" (link to /blog/) and "View Portfolio" (link to GitHub).
- **Recent Posts section**: header with terminal icon + "Recent Posts" + "View Archive" link. 2-column grid of post cards. First 3 posts from `collections.post`. Each card: date, title, subtitle (line-clamped), "Read Article" link. Third post spans full width (md:col-span-2).
- **CTA section**: card with "Interessato ad approfondire?" + email button.

### 3. `src/_includes/layouts/post.njk` — Full rewrite

Extends base.njk. Single article page:
- Content constrained to `max-w-4xl mx-auto` for readability
- Post header: title (text-3xl/4xl bold), date in mono, optional quote with orange left border
- Separator: `hr` styled as orange asterisks (keep existing convention) or thin border
- Article body: prose-like styling via custom Tailwind classes for markdown content (headings, paragraphs, lists, code blocks, blockquotes, images, links)
- Custom `article-content` class that styles nested markdown HTML elements

### 4. `src/_includes/layouts/docs.njk` — Full rewrite

Extends base.njk. Similar to post but simpler:
- Content constrained to `max-w-4xl mx-auto`
- Title, then markdown content with same prose styling

### 5. `src/pages/blog.md` — Rewrite inline template

Replace inline HTML with Tailwind-styled grid:
- Same section header style as homepage ("All Posts" + terminal icon)
- 2-column grid with all post cards (same card design as homepage)
- Each card: date, title, subtitle, "Read Article" link

### 6. `src/assets/styles.css` — Minimal replacement

Keep only what Tailwind CDN can't handle or what's needed for markdown content styling:
- `code-grid` background pattern (already in Tailwind `<style>` block in base, but article prose styles need a CSS file)
- Article/markdown content typography: headings, paragraphs, lists, code, pre, blockquote, hr, images, links — all scoped under `.article-content` class
- Tailwind `@apply` directives or plain CSS targeting `.article-content` children

## What Does NOT Change

- `.eleventy.js` — no modifications
- Post frontmatter (layout, tags, title, subtitle, date, quote, quoteAuthor)
- Directory structure
- Collection logic
- `avatar.png` — continues using local file
- Real social links (GitHub, X, email addresses)
- Deployment workflow

## Implementation Order

1. `base.njk` first (foundation: Tailwind, fonts, nav, footer)
2. `styles.css` next (article content prose styles)
3. `home.njk` (hero + recent posts grid)
4. `post.njk` (single article layout)
5. `docs.njk` (docs page)
6. `blog.md` (archive page)
7. Visual verification with `npm run dev`
