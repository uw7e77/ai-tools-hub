import type { Agent, Difficulty, PricingType } from '../../types'
import { agents } from '../../data/agents'
import { PRICING_LABELS, PRICING_ORDER } from '../category/listing'

export const AGENT_DIFFICULTIES: readonly Difficulty[] = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
]

export const AGENT_PAGE_SIZE = 12

export interface AgentListingState {
  query: string
  difficulty: Difficulty[]
  pricing: PricingType[]
  page: number
}

export const EMPTY_AGENT_STATE: AgentListingState = { query: '', difficulty: [], pricing: [], page: 1 }

function isDifficulty(value: string): value is Difficulty {
  return (AGENT_DIFFICULTIES as readonly string[]).includes(value)
}

export function parseAgentParams(params: URLSearchParams): AgentListingState {
  const query = (params.get('q') ?? '').trim().slice(0, 80)
  const requestedDifficulty = new Set(
    (params.get('difficulty') ?? '').split(',').filter(isDifficulty),
  )
  const requestedPricing = new Set(
    (params.get('pricing') ?? '')
      .split(',')
      .filter((value) => Object.hasOwn(PRICING_LABELS, value)),
  )
  const pageParam = Number(params.get('page'))
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1
  return {
    query,
    difficulty: AGENT_DIFFICULTIES.filter((value) => requestedDifficulty.has(value)),
    pricing: PRICING_ORDER.filter((value) => requestedPricing.has(value)),
    page,
  }
}

export function buildAgentSearch(state: AgentListingState): URLSearchParams {
  const params = new URLSearchParams()
  if (state.query) params.set('q', state.query)
  if (state.difficulty.length > 0) params.set('difficulty', state.difficulty.join(','))
  if (state.pricing.length > 0) params.set('pricing', state.pricing.join(','))
  if (state.page > 1) params.set('page', String(state.page))
  return params
}

function matchesQuery(agent: Agent, query: string): boolean {
  if (!query) return true
  const haystack = [agent.name, agent.company, agent.tagline, ...agent.capabilities]
    .join(' ')
    .toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term))
}

export interface AgentFacet<T extends string> {
  value: T
  label: string
  count: number
}

export function difficultyFacets(items: Agent[]): AgentFacet<Difficulty>[] {
  return AGENT_DIFFICULTIES.map((value) => ({
    value,
    label: value,
    count: items.filter((agent) => agent.difficulty === value).length,
  })).filter((facet) => facet.count > 0)
}

export function agentPricingFacets(items: Agent[]): AgentFacet<PricingType>[] {
  return PRICING_ORDER.map((value) => ({
    value,
    label: PRICING_LABELS[value],
    count: items.filter((agent) => agent.pricing === value).length,
  })).filter((facet) => facet.count > 0)
}

export interface AgentListingResult {
  visible: Agent[]
  filteredCount: number
  totalCount: number
  page: number
  pageCount: number
  difficultyFacets: AgentFacet<Difficulty>[]
  pricingFacets: AgentFacet<PricingType>[]
}

export function deriveAgentListing(state: AgentListingState): AgentListingResult {
  const difficulty = new Set(state.difficulty)
  const pricing = new Set(state.pricing)
  const filtered = agents.filter(
    (agent) =>
      matchesQuery(agent, state.query) &&
      (difficulty.size === 0 || (agent.difficulty !== null && difficulty.has(agent.difficulty))) &&
      (pricing.size === 0 || (agent.pricing !== null && pricing.has(agent.pricing))),
  )
  const pageCount = Math.max(1, Math.ceil(filtered.length / AGENT_PAGE_SIZE))
  const page = Math.min(state.page, pageCount)
  const start = (page - 1) * AGENT_PAGE_SIZE
  return {
    visible: filtered.slice(start, start + AGENT_PAGE_SIZE),
    filteredCount: filtered.length,
    totalCount: agents.length,
    page,
    pageCount,
    difficultyFacets: difficultyFacets(agents),
    pricingFacets: agentPricingFacets(agents),
  }
}

export const featuredAgentList: Agent[] = agents.filter((agent) => agent.featured)

export const popularAgentList: Agent[] = agents
  .filter((agent) => agent.popularRank !== undefined)
  .toSorted((a, b) => (a.popularRank ?? 0) - (b.popularRank ?? 0))
  .slice(0, 3)

export const newAgentList: Agent[] = agents.filter((agent) => agent.isNew)
