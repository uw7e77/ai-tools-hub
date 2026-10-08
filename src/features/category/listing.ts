import type { Category, CategorySlug, Launch, PricingType, Tool } from '../../types'
import { categoryBySlug } from '../../data/lookups'
import { launches } from '../../data/launches'
import { tools } from '../../data/tools'

export const PAGE_SIZE = 12

export const SORT_KEYS = ['trending', 'newest', 'az', 'rating'] as const
export type SortKey = (typeof SORT_KEYS)[number]

export const DEFAULT_SORT: SortKey = 'trending'

export const SORT_OPTIONS: ReadonlyArray<{ value: SortKey; label: string }> = [
  { value: 'trending', label: 'Trending' },
  { value: 'newest', label: 'Newest' },
  { value: 'az', label: 'A–Z' },
  { value: 'rating', label: 'Rating' },
]

export const PRICING_LABELS: Record<PricingType, string> = {
  free: 'Free',
  freemium: 'Freemium',
  paid: 'Paid',
  'open-source': 'Open Source',
  'free-trial': 'Free Trial',
}

export const PRICING_ORDER: readonly PricingType[] = [
  'free',
  'freemium',
  'free-trial',
  'open-source',
  'paid',
]

export interface ListingState {
  sort: SortKey
  pricing: PricingType[]
  tested: boolean
  subcategory: string | null
  page: number
}

function isSortKey(value: string | null): value is SortKey {
  return value !== null && (SORT_KEYS as readonly string[]).includes(value)
}

function isPricingType(value: string): value is PricingType {
  return Object.hasOwn(PRICING_LABELS, value)
}

export function parseListingParams(params: URLSearchParams): ListingState {
  const sortParam = params.get('sort')
  const sort = isSortKey(sortParam) ? sortParam : DEFAULT_SORT

  const requested = new Set((params.get('pricing') ?? '').split(',').filter(isPricingType))
  const pricing = PRICING_ORDER.filter((value) => requested.has(value))

  const tested = params.get('tested') === '1'

  const subcategoryParam = params.get('sub')?.trim()
  const subcategory = subcategoryParam ? subcategoryParam : null

  const pageParam = Number(params.get('page'))
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1

  return { sort, pricing, tested, subcategory, page }
}

export function buildListingSearch(state: ListingState): URLSearchParams {
  const params = new URLSearchParams()
  if (state.sort !== DEFAULT_SORT) {
    params.set('sort', state.sort)
  }
  if (state.pricing.length > 0) {
    const selected = new Set(state.pricing)
    params.set('pricing', PRICING_ORDER.filter((value) => selected.has(value)).join(','))
  }
  if (state.tested) {
    params.set('tested', '1')
  }
  if (state.subcategory) {
    params.set('sub', state.subcategory)
  }
  if (state.page > 1) {
    params.set('page', String(state.page))
  }
  return params
}

const NO_TOOLS: Tool[] = []
const NO_LAUNCHES: Launch[] = []

const toolsByCategory = new Map<CategorySlug, Tool[]>()
for (const tool of tools) {
  const bucket = toolsByCategory.get(tool.category)
  if (bucket) {
    bucket.push(tool)
  } else {
    toolsByCategory.set(tool.category, [tool])
  }
}

const launchesByCategory = new Map<CategorySlug, Launch[]>()
for (const launch of launches) {
  const bucket = launchesByCategory.get(launch.category)
  if (bucket) {
    bucket.push(launch)
  } else {
    launchesByCategory.set(launch.category, [launch])
  }
}
for (const bucket of launchesByCategory.values()) {
  bucket.sort((a, b) =>
    a.launchedAt === b.launchedAt
      ? a.name.localeCompare(b.name)
      : b.launchedAt.localeCompare(a.launchedAt),
  )
}

const launchDateByToolSlug = new Map<string, string>()
for (const launch of launches) {
  if (!launchDateByToolSlug.has(launch.toolSlug)) {
    launchDateByToolSlug.set(launch.toolSlug, launch.launchedAt)
  }
}

export function getCategory(slug: string | undefined): Category | undefined {
  return slug ? categoryBySlug.get(slug as CategorySlug) : undefined
}

export function getCategoryTools(slug: CategorySlug): Tool[] {
  return toolsByCategory.get(slug) ?? NO_TOOLS
}

export function getCategoryLaunches(slug: CategorySlug): Launch[] {
  return launchesByCategory.get(slug) ?? NO_LAUNCHES
}

function byTrending(a: Tool, b: Tool): number {
  const rankA = a.featuredRank ?? Number.POSITIVE_INFINITY
  const rankB = b.featuredRank ?? Number.POSITIVE_INFINITY
  if (rankA !== rankB) return rankA - rankB
  // Ratings/review counts are optional and usually absent — unrated tools sort last.
  const ratingA = a.rating ?? -1
  const ratingB = b.rating ?? -1
  if (ratingA !== ratingB) return ratingB - ratingA
  const reviewsA = a.reviewCount ?? -1
  const reviewsB = b.reviewCount ?? -1
  if (reviewsA !== reviewsB) return reviewsB - reviewsA
  return a.name.localeCompare(b.name)
}

function byNewest(a: Tool, b: Tool): number {
  const dateA = launchDateByToolSlug.get(a.slug)
  const dateB = launchDateByToolSlug.get(b.slug)
  if (dateA && dateB) return dateB.localeCompare(dateA)
  if (dateA) return -1
  if (dateB) return 1
  return 0
}

function byRating(a: Tool, b: Tool): number {
  const ratingA = a.rating ?? -1
  const ratingB = b.rating ?? -1
  if (ratingA !== ratingB) return ratingB - ratingA
  const reviewsA = a.reviewCount ?? -1
  const reviewsB = b.reviewCount ?? -1
  if (reviewsA !== reviewsB) return reviewsB - reviewsA
  return a.name.localeCompare(b.name)
}

function byName(a: Tool, b: Tool): number {
  return a.name.localeCompare(b.name)
}

export function sortTools(items: Tool[], sort: SortKey): Tool[] {
  if (sort === 'newest') return items.toSorted(byNewest)
  if (sort === 'az') return items.toSorted(byName)
  if (sort === 'rating') return items.toSorted(byRating)
  return items.toSorted(byTrending)
}

export interface PricingFacet {
  value: PricingType
  label: string
  count: number
}

export function pricingFacets(items: Tool[]): PricingFacet[] {
  return PRICING_ORDER.map((value) => ({
    value,
    label: PRICING_LABELS[value],
    count: items.filter((tool) => tool.pricing === value).length,
  })).filter((facet) => facet.count > 0)
}

export interface SubcategoryFacet {
  value: string
  label: string
  count: number
}

// Subcategory values are kebab-case slugs from the DB ("project-management").
// The label is a mechanical title-case transform of the stored value,
// never invented copy.
export function formatSubcategoryLabel(value: string): string {
  return value
    .split('-')
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ')
}

export function subcategoryFacets(items: Tool[]): SubcategoryFacet[] {
  const counts = new Map<string, number>()
  for (const tool of items) {
    const value = tool.subcategory?.trim()
    if (value) {
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, label: formatSubcategoryLabel(value), count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

export interface ListingResult {
  visible: Tool[]
  filteredCount: number
  totalCount: number
  page: number
  pageCount: number
  facets: PricingFacet[]
  subcategoryFacets: SubcategoryFacet[]
}

export function deriveListing(state: ListingState, items: Tool[]): ListingResult {
  const facets = pricingFacets(items)
  const subFacets = subcategoryFacets(items)
  const validSubcategories = new Set(subFacets.map((facet) => facet.value))
  // Ignore a subcategory that doesn't exist in this category (e.g. a stale
  // bookmarked URL) instead of showing zero results for a phantom filter.
  const subcategory =
    state.subcategory !== null && validSubcategories.has(state.subcategory)
      ? state.subcategory
      : null
  const selected = new Set(state.pricing)
  const filtered = items.filter(
    (tool) =>
      (!state.tested || tool.tested) &&
      (selected.size === 0 || (tool.pricing !== null && selected.has(tool.pricing))) &&
      (subcategory === null || tool.subcategory === subcategory),
  )
  const sorted = sortTools(filtered, state.sort)
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const page = Math.min(state.page, pageCount)
  const start = (page - 1) * PAGE_SIZE
  return {
    visible: sorted.slice(start, start + PAGE_SIZE),
    filteredCount: sorted.length,
    totalCount: items.length,
    page,
    pageCount,
    facets,
    subcategoryFacets: subFacets,
  }
}
