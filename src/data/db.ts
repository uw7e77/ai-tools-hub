// Runtime database layer.
//
// All site content lives as JSON files in `public/data/` — that folder IS
// the database. The app fetches it once at startup (see main.tsx, which only
// renders <App /> after loadDb() resolves), so every data module below can
// keep its old synchronous shape while reading from this store.
//
// To update content: edit/replace the JSON files in public/data/ (or use the
// /admin panel and export) — no rebuild needed for data-only changes.
// Regenerate the JSON from the TS sources with: python3 scripts/build-db.py

import type {
  Agent,
  AgentDetail,
  Category,
  Company,
  CompanyDetail,
  Launch,
  Tool,
  ToolDetail,
  Tutorial,
} from '../types'
import type { FooterColumn, NavItem } from './navigation'
import type { ToolVideo } from './toolVideos'

export interface DbNavigation {
  primaryNav: NavItem[]
  footerColumns: FooterColumn[]
}

export const db = {
  tools: [] as Tool[],
  categories: [] as Category[],
  agents: [] as Agent[],
  companies: [] as Company[],
  companyDetails: {} as Partial<Record<string, CompanyDetail>>,
  tutorials: [] as Tutorial[],
  launches: [] as Launch[],
  toolDetails: {} as Partial<Record<string, ToolDetail>>,
  agentDetails: {} as Partial<Record<string, AgentDetail>>,
  navigation: { primaryNav: [], footerColumns: [] } as DbNavigation,
  toolVideos: [] as ToolVideo[],
  loaded: false,
  toolDetailsLoaded: false,
  agentDetailsLoaded: false,
}

async function fetchJson<T>(name: string): Promise<T> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/${name}`)
  if (!res.ok) {
    throw new Error(`Database file "data/${name}" could not be loaded (${res.status}).`)
  }
  return (await res.json()) as T
}

let corePromise: Promise<void> | null = null

/** Load the core database (everything except the two big detail files). */
export function loadDb(): Promise<void> {
  if (!corePromise) {
    corePromise = (async () => {
      const [tools, categories, agents, companies, companyDetails, tutorials, launches, navigation, toolVideos] =
        await Promise.all([
          fetchJson<Tool[]>('tools.json'),
          fetchJson<Category[]>('categories.json'),
          fetchJson<Agent[]>('agents.json'),
          fetchJson<Company[]>('companies.json'),
          fetchJson<Partial<Record<string, CompanyDetail>>>('company-details.json'),
          fetchJson<Tutorial[]>('tutorials.json'),
          fetchJson<Launch[]>('launches.json'),
          fetchJson<DbNavigation>('navigation.json'),
          fetchJson<ToolVideo[]>('tool-videos.json'),
        ])
      db.tools = tools
      db.categories = categories
      db.agents = agents
      db.companies = companies
      db.companyDetails = companyDetails
      db.tutorials = tutorials
      db.launches = launches
      db.navigation = navigation
      db.toolVideos = toolVideos
      db.loaded = true
    })()
  }
  return corePromise
}

let toolDetailsPromise: Promise<void> | null = null

/** Detail records are ~5 MB, so they load lazily on first detail-page visit. */
export function loadToolDetails(): Promise<void> {
  if (!toolDetailsPromise) {
    toolDetailsPromise = fetchJson<Partial<Record<string, ToolDetail>>>('tool-details.json').then(
      (data) => {
        // Merge in place: data/toolDetails.ts captured this object reference
        // before the lazy load finished.
        Object.assign(db.toolDetails, data)
        db.toolDetailsLoaded = true
      },
    )
  }
  return toolDetailsPromise
}

let agentDetailsPromise: Promise<void> | null = null

export function loadAgentDetails(): Promise<void> {
  if (!agentDetailsPromise) {
    agentDetailsPromise = fetchJson<Partial<Record<string, AgentDetail>>>(
      'agent-details.json',
    ).then((data) => {
      Object.assign(db.agentDetails, data)
      db.agentDetailsLoaded = true
    })
  }
  return agentDetailsPromise
}
