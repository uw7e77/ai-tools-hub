# AGENTS.md

Guidance for AI coding agents working on AIToolsHub.

## Project Overview

AIToolsHub is a premium dark-first AI tools directory (React SPA). It is a pure frontend project: all content lives in static TypeScript data files — there is no backend, no API layer, and no database.

**`AIToolsHub-design.md` is the single source of truth for all design decisions.** Read it before creating or restyling any component. Section 52 lists the AI coding agent rules; section 53 is the definition of done for any page.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`) then production build; both must pass
- `npm run lint` — Oxlint (there is no ESLint; do not add one)
- `npm run preview` — serve the production build

There is no test framework. Verify UI changes with `npm run dev` and check desktop, tablet, and mobile layouts.

## Tech Stack

- React 19, TypeScript, Vite, react-router-dom 7
- Styling: CSS Modules (one `.module.css` per component) + shared design tokens in `src/styles/tokens.css`
- Icons: lucide-react
- Linting: Oxlint (`.oxlintrc.json`)

Do not add new dependencies without checking design doc rule 14 (§52) — avoid unnecessary deps.

## Architecture

```
src/
├── main.tsx              # Providers: ThemeProvider > BrowserRouter > BookmarksProvider
├── App.tsx               # Routes; non-home pages are lazy() loaded with skeletons
├── types.ts              # All domain types; slugs are string-literal unions
├── data/                 # Static content (tools, categories, agents, companies, ...)
├── components/
│   ├── ui/               # Generic primitives (Button, Badge, Rating, Pagination, ...)
│   ├── cards/            # Content cards (ToolCard, AgentCard, CompanyCard, ...)
│   ├── layout/           # Header, Footer, MobileNav, Logo, Newsletter
│   └── <page>/           # Page-specific sections (home/, category/, search/, ...)
├── features/             # Domain logic (theme/, bookmarks/, search/, seo/, category/, errors/)
├── pages/                # Route-level page components
├── styles/tokens.css     # Design tokens — the only place colors/spacing are defined
└── utils/cx.ts           # Class-name helper
```

Routes: `/` (home), `/categories`, `/category/:slug`, `/tool/:slug`, `*` (404). New routes follow the same lazy-load + Suspense skeleton + ErrorBoundary pattern in `App.tsx`.

## Core Rules

1. **Data-driven, never hardcoded.** All tool/category/agent/company content comes from `src/data/*.ts` typed by `src/types.ts`. Never embed tool information inside components. When adding an entity, extend the relevant slug union in `types.ts` and add the record to the data file.
2. **Reuse before creating.** One component system across all pages — the same `ToolCard` everywhere, one template per record type (design doc §49–50). Do not build page-specific duplicates of existing components or duplicate template logic.
3. **Tokens only.** Use the CSS variables from `src/styles/tokens.css`. Never introduce new raw hex colors, fonts, or border-radius values. Do not redesign existing components unless asked.
4. **Content is placeholder-aware.** Ratings, review counts, and tested dates in `src/data/tools.ts` are demo values — never invent factual tool data; flag it instead.
5. **localStorage keys** are prefixed `aitoolshub:` (see `ThemeProvider`, `BookmarksProvider`).

## TypeScript Conventions

- `verbatimModuleSyntax` is on: type-only imports must use `import type { ... }`.
- `noUnusedLocals` / `noUnusedParameters` are enforced by the build.
- Named exports for components; `App` is the only default export.
- Relative imports (no path aliases are configured).
- `erasableSyntaxOnly` is on — no enums, no parameter properties, no namespaces.

## Styling Conventions

- Every component gets a colocated CSS Module; no global CSS except `src/index.css` and `src/styles/tokens.css`.
- Compose class names with `cx()` from `src/utils/cx.ts`.
- Dark theme is the default; theme switching toggles a `.dark` class on `<html>`.
- Subtle 1px borders over shadows; no glassmorphism, giant shadows, or heavy animation (design doc §7, §38).
- Mobile-first responsive; test desktop, tablet, and mobile before finishing a page.

## Accessibility & Quality (definition of done, §53)

- Semantic HTML, keyboard navigation, skip link, and visible focus states.
- `alt` text on images, clear button labels.
- Every async/list view needs loading (skeleton), empty, and error states — see existing `*Skeleton`, `EmptyState`, `ErrorState` components.
- No horizontal overflow, no console errors, SEO metadata via `usePageMeta`.
