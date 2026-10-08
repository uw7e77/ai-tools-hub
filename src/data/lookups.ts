import { agents } from './agents'
import { categories } from './categories'
import { companies } from './companies'
import { tools } from './tools'
import { tutorials } from './tutorials'
import type { Company } from '../types'

export const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]))
export const companyBySlug = new Map(companies.map((company) => [company.slug, company]))
export const categoryBySlug = new Map(categories.map((category) => [category.slug, category]))
export const agentBySlug = new Map(agents.map((agent) => [agent.slug, agent]))
export const tutorialBySlug = new Map(tutorials.map((tutorial) => [tutorial.slug, tutorial]))

// tool.company is free-text company NAME from the DB (e.g. "Activepieces"),
// while companyBySlug is keyed by slug (e.g. "activepieces") — a slug lookup
// on a name never matches. This map resolves the free-text name instead.
export function normalizeCompanyName(name: string): string {
  return name.trim().toLowerCase()
}

export const companyByName = new Map<string, Company>()
for (const company of companies) {
  const key = normalizeCompanyName(company.name)
  if (!companyByName.has(key)) {
    companyByName.set(key, company)
  }
}

export const toolCountByCategory = new Map(
  categories.map((category) => [
    category.slug,
    tools.filter((tool) => tool.category === category.slug).length,
  ]),
)

export const totalToolCount = tools.length
