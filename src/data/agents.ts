// Content lives in the JSON database (public/data/agents.json), loaded at
// runtime by src/data/db.ts.
import type { Agent } from '../types'
import { db } from './db'

export const agents: Agent[] = db.agents
