// Content lives in the JSON database (public/data/tool-details.json), loaded
// lazily at runtime via loadToolDetails() in src/data/db.ts. Pages that read
// this must wait for that load (see ToolPage).
import type { ToolDetail, ToolSlug } from '../types'
import { db } from './db'

export const toolDetails: Partial<Record<ToolSlug, ToolDetail>> = db.toolDetails
