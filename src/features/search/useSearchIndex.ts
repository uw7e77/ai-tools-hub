import { useMemo } from 'react'
import { agents } from '../../data/agents'
import { categories } from '../../data/categories'
import { companies } from '../../data/companies'
import { tools } from '../../data/tools'
import { tutorials } from '../../data/tutorials'

export type SearchGroup = 'Tools' | 'Categories' | 'AI Agents' | 'Companies' | 'Tutorials'

export interface SearchResult {
  group: SearchGroup
  id: string
  title: string
  meta: string
  href: string
  logo?: string
  icon?: string
}

export interface SearchGroupResults {
  group: SearchGroup
  items: SearchResult[]
}

export type SearchResults = SearchGroupResults[]

const groupOrder: SearchGroup[] = ['Tools', 'Categories', 'AI Agents', 'Companies', 'Tutorials']

const MAX_PER_GROUP = 3

const toolNames = new Map(tools.map((tool) => [tool.slug, tool.name]))
const categoryNames = new Map(categories.map((category) => [category.slug, category.name]))

interface IndexEntry {
  group: SearchGroup
  haystack: string
  result: SearchResult
}

function normalize(text: string): string {
  return text.toLowerCase()
}

function join(...parts: Array<string | null | undefined>): string {
  return normalize(parts.filter(Boolean).join(' '))
}

const searchIndex: IndexEntry[] = [
  ...tools.map((tool) => ({
    group: 'Tools' as const,
    haystack: join(
      tool.name,
      tool.tags.join(' '),
      categoryNames.get(tool.category),
      // tool.company is free-text name from the DB — index it directly. The
      // old code looked the name up in a slug-keyed map and always missed.
      tool.company,
    ),
    result: {
      group: 'Tools' as const,
      id: tool.slug,
      title: tool.name,
      meta: tool.shortDescription,
      href: `/tool/${tool.slug}`,
      logo: tool.logo,
    },
  })),
  ...categories.map((category) => ({
    group: 'Categories' as const,
    haystack: join(category.name, category.description),
    result: {
      group: 'Categories' as const,
      id: category.slug,
      title: category.name,
      meta: category.description,
      href: `/category/${category.slug}`,
      icon: category.icon,
    },
  })),
  ...agents.map((agent) => ({
    group: 'AI Agents' as const,
    haystack: join(agent.name, agent.company),
    result: {
      group: 'AI Agents' as const,
      id: agent.slug,
      title: agent.name,
      meta: agent.tagline,
      href: `/agent/${agent.slug}`,
      logo: agent.logo,
    },
  })),
  ...companies.map((company) => ({
    group: 'Companies' as const,
    haystack: join(company.name, company.hq, company.mission),
    result: {
      group: 'Companies' as const,
      id: company.slug,
      title: company.name,
      meta: company.mission ?? company.description,
      href: `/company/${company.slug}`,
      logo: company.logo ?? undefined,
    },
  })),
  ...tutorials.map((tutorial) => ({
    group: 'Tutorials' as const,
    haystack: join(tutorial.title, tutorial.category, ...tutorial.toolsUsed.map((t) => toolNames.get(t))),
    result: {
      group: 'Tutorials' as const,
      id: tutorial.slug,
      title: tutorial.title,
      meta: `${tutorial.toolsUsed.map((t) => toolNames.get(t)).filter(Boolean).join(', ')} · ${tutorial.difficulty}`,
      href: `/tutorial/${tutorial.slug}`,
    },
  })),
]

export function useSearchIndex(query: string, limitPerGroup: number = MAX_PER_GROUP): SearchResults {
  return useMemo(() => searchAll(query, limitPerGroup), [query, limitPerGroup])
}

// Pure (non-hook) search over the static index so event handlers can run a
// search without violating the rules of hooks.
export function searchAll(query: string, limitPerGroup: number = MAX_PER_GROUP): SearchResults {
  const normalized = normalize(query.trim())
  if (!normalized) {
    return []
  }

  const matched = searchIndex.filter((entry) => entry.haystack.includes(normalized))
  const groups: SearchResults = []
  for (const group of groupOrder) {
    const items = matched
      .filter((entry) => entry.group === group)
      .slice(0, limitPerGroup)
      .map((entry) => entry.result)
    if (items.length > 0) {
      groups.push({ group, items })
    }
  }
  return groups
}

export function flattenResults(groups: SearchResults): SearchResult[] {
  return groups.flatMap((group) => group.items)
}
