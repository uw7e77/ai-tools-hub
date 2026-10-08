# AIToolsHub data — JSON

Plain-JSON mirrors of the TypeScript data files in `src/data/`. Regenerate
anytime from the TS sources (each `*-chunk-N.ts` file holds a JSON payload).

- `categories.json` — 11 categories
- `tools-chunk-*.json` — all 4,813 tools (49 chunks, 100 per chunk)
- `tool-details-chunk-*.json` — per-tool detail records, keyed by slug
- `agents-chunk-*.json` — 473 AI agents
- `agent-details-chunk-*.json` — per-agent detail records, keyed by slug
- `companies.json` / `companyDetails.json` — 24 company profiles
- `tutorials-chunk-*.json` — 10 tutorials (full markdown in `content`)
- `launches.json` — launch entries (empty until launch dates exist)
- `navigation.json` — header nav + footer columns
