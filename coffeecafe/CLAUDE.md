# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"ДомКофе" (DomKofe) — a coffee shop landing website. Diploma project built from a Figma mockup. Russian-language UI.

## Commands

- `npm run dev` — start dev server with HMR (Vite, `--host` enabled for tunnel access)
- `npm run build` — type-check with `tsc -b` then Vite production build
- `npm run lint` — ESLint
- `npm run preview` — serve the production build locally

## Tech Stack

- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS v4** — configured via CSS `@theme` in `src/index.css` (not tailwind.config.js)
- **react-router-dom v7** — client-side routing (BrowserRouter)
- Google Fonts loaded in `index.html`: Inter (body) and Playfair Display (headings)

## Architecture

### Routing

`App.tsx` defines two routes:
- `/` → `HomePage` (landing with all sections)
- `/about` → `AboutPage` (standalone "About Us" page)

### Page Composition

`HomePage` is a vertical stack of section components: Header → Hero → About → WhyUs → Menu → Promo → Gallery → Reviews → Footer. Mobile menu open/close state is lifted to the page level and passed to `Header`.

`AboutPage` reuses `Header` and `Footer` with its own content between them.

### Design Tokens

All custom colors and fonts are defined as CSS custom properties in `src/index.css` under `@theme`:
- Colors: `cream`, `cream-dark`, `brown-button`, `brown-dark`, `brown-bg`, `brown-footer`
- Fonts: `--font-sans` (Inter), `--font-heading` (Playfair Display)

There's also a `tailwind.config.js` with the same values — the CSS `@theme` block is the one actually used by Tailwind v4.

### Promo Section (Data Layer Pattern)

The only section with a data abstraction:
- `types/promo.ts` — `Promo` interface
- `data/mockPromo.ts` — fallback/mock data
- `services/promoService.ts` — `fetchLatestPromo()` returns mock now; has commented-out WordPress and custom API variants ready to enable

### Responsive Breakpoints

All components follow: mobile-first → `lg:` (1024px, desktop) → `xl:` (1280px, wide desktop). Mobile menu is a full-screen overlay toggled via burger button, hidden at `lg:`.

### Vite Config

`vite.config.ts` allows hosts matching `*.tuna.am` for tunnel access (Tuna tunneling service).

## Conventions

- Components are function components with default exports, one per file
- All comments and UI text are in Russian
- Images are in `src/assets/images/`, referenced via static imports
- Horizontal padding pattern: `px-4 lg:px-16 xl:px-28` (consistent across sections)
- Buttons: `rounded-[10px]`, brown-button bg, brown-dark text, uppercase tracking-wider
