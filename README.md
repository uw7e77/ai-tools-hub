# AIToolsHub

A production-ready AI tools directory: 4,813 tools, 473 AI agents, 11
categories, 24 company profiles and step-by-step tutorials.

## How it works

**The database is JSON.** All content lives in `public/data/*.json`. The
website fetches those files at runtime (see `src/data/db.ts`), so content
updates never need a code rebuild — replace a JSON file and the site serves
the new data.

| File | Contents |
| --- | --- |
| `tools.json` | 4,813 tools |
| `tool-details.json` | Per-tool review content, keyed by slug (loads lazily) |
| `agents.json` / `agent-details.json` | 473 AI agents + details |
| `categories.json` | 11 categories |
| `companies.json` / `company-details.json` | 24 company profiles |
| `tutorials.json` | 10 tutorials |
| `tool-videos.json` | Community YouTube tutorials on tool pages |
| `navigation.json` | Header nav + footer columns |
| `launches.json` | New launches (empty until verified launch dates exist) |

The original TypeScript data files under `src/data/` are kept as the source
archive. Regenerate the JSON database from them with:

```bash
python3 scripts/build-db.py     # TS sources -> public/data/*.json
python3 scripts/gen-sitemap.py  # -> public/sitemap.xml (5,300+ URLs)
```

## Admin panel

Visit **`/admin`** on the running site. First visit asks you to create a
passcode (stored only on your device — it is a convenience lock, not server
security).

- **Dashboard** — totals, per-category counts, what needs attention
- **Tools / AI Agents / Categories** — search, edit, add, delete
- **Database** — import a `tools.json`/`agents.json`, export any DB file
- **Data Health** — honest gaps (missing pricing, missing details, duplicates)

Edits save to a working copy on your device. To publish: export the JSON
from the admin and replace the matching file in `public/data/`, then push.

## Develop

```bash
npm install
npm run dev       # dev server
npm run build     # type-check + production build (must pass)
npm run lint      # Oxlint
npm run preview   # serve the production build
```

## Before launch

- Replace the placeholder domain `aitoolshub.example` in `src/data/site.ts`
  and `index.html` with the real domain, then re-run `scripts/gen-sitemap.py`.
- Restrict `/admin` at the hosting layer (the in-app passcode is not real
  security on a static site).
- Connect the newsletter form to a real email provider (sign-ups are
  currently stored only in the visitor's browser).
