import type { CategorySlug, PricingType, Tool } from '../../types'
import { categories } from '../../data/categories'
import { tools } from '../../data/tools'
import {
  PAGE_SIZE,
  PRICING_LABELS,
  PRICING_ORDER,
  pricingFacets,
  sortTools,
  type PricingFacet,
  type SortKey,
} from '../category/listing'

export { PRICING_LABELS, PRICING_ORDER }
export type { PricingFacet, SortKey }
export { SORT_OPTIONS, DEFAULT_SORT, PAGE_SIZE } from '../category/listing'

export interface ToolsListingState {
  sort: SortKey
  pricing: PricingType[]
  tested: boolean
  category: CategorySlug | null
  page: number
}

function isSortKey(value: string | null): value is SortKey {
  return value !== null && (['trending', 'newest', 'az', 'rating'] as readonly string[]).includes(value)
}

function isPricingType(value: string): value is PricingType {
  return Object.hasOwn(PRICING_LABELS, value)
}

function isCategorySlug(value: string): value is CategorySlug {
  return categories.some((category) => category.slug === value)
}

export function parseToolsParams(params: URLSearchParams): ToolsListingState {
  const sortParam = params.get('sort')
  const sort: SortKey = isSortKey(sortParam) ? sortParam : 'trending'

  const requested = new Set((params.get('pricing') ?? '').split(',').filter(isPricingType))
  const pricing = PRICING_ORDER.filter((value) => requested.has(value))

  const tested = params.get('tested') === '1'

  const categoryParam = params.get('category')?.trim()
  const category = categoryParam && isCategorySlug(categoryParam) ? categoryParam : null

  const pageParam = Number(params.get('page'))
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1

  return { sort, pricing, tested, category, page }
}

export function buildToolsSearch(state: ToolsListingState): URLSearchParams {
  const params = new URLSearchParams()
  if (state.sort !== 'trending') {
    params.set('sort', state.sort)
  }
  if (state.pricing.length > 0) {
    const selected = new Set(state.pricing)
    params.set('pricing', PRICING_ORDER.filter((value) => selected.has(value)).join(','))
  }
  if (state.tested) {
    params.set('tested', '1')
  }
  if (state.category) {
    params.set('category', state.category)
  }
  if (state.page > 1) {
    params.set('page', String(state.page))
  }
  return params
}

export interface CategoryFacet {
  value: CategorySlug
  label: string
  count: number
}

export function categoryFacets(items: Tool[]): CategoryFacet[] {
  const counts = new Map<CategorySlug, number>()
  for (const tool of items) {
    counts.set(tool.category, (counts.get(tool.category) ?? 0) + 1)
  }
  const nameBySlug = new Map(categories.map((category) => [category.slug, category.name]))
  return [...counts.entries()]
    .map(([value, count]) => ({
      value,
      label: nameBySlug.get(value) ?? value,
      count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

export interface ToolsListingResult {
  visible: Tool[]
  filteredCount: number
  totalCount: number
  page: number
  pageCount: number
  pricingFacets: PricingFacet[]
  categoryFacets: CategoryFacet[]
}

export function deriveToolsListing(state: ToolsListingState): ToolsListingResult {
  const totalCount = tools.length
  const pricing = pricingFacets(tools)
  const cats = categoryFacets(tools)

  const selectedPricing = new Set(state.pricing)
  const filtered = tools.filter(
    (tool) =>
      (!state.tested || tool.tested) &&
      (selectedPricing.size === 0 || (tool.pricing !== null && selectedPricing.has(tool.pricing))) &&
      (state.category === null || tool.category === state.category),
  )
  const sorted = sortTools(filtered, state.sort)
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const page = Math.min(state.page, pageCount)
  const start = (page - 1) * PAGE_SIZE
  return {
    visible: sorted.slice(start, start + PAGE_SIZE),
    filteredCount: sorted.length,
    totalCount,
    page,
    pageCount,
    pricingFacets: pricing,
    categoryFacets: cats,
  }
}
