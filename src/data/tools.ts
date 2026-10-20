// Content now lives in the JSON database (public/data/tools.json) and is
// loaded at runtime by src/data/db.ts. This module keeps the classic
// synchronous export shape for existing pages. Regenerate the JSON with:
// python3 scripts/build-db.py
import type { Tool } from '../types'
import { db } from './db'

export const tools: Tool[] = db.tools
