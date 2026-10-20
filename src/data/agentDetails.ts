// Content lives in the JSON database (public/data/agent-details.json), loaded
// lazily at runtime via loadAgentDetails() in src/data/db.ts.
import type { AgentDetail, AgentSlug } from '../types'
import { db } from './db'

export const agentDetails: Partial<Record<AgentSlug, AgentDetail>> = db.agentDetails
