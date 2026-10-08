import { SlidersHorizontal } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ToolCard } from '../components/cards/ToolCard'
import { FilterSheet } from '../components/category/FilterSheet'
import { NewsletterCTA } from '../components/home/NewsletterCTA'
import { ToolsFilterSidebar } from '../components/tools/ToolsFilterSidebar'
import { Button } from '../components/ui/Button'
import { CardGrid } from '../components/ui/CardGrid'
import { EmptyState } from '../components/ui/EmptyState'
import { Pagination } from '../components/ui/Pagination'
import { SortDropdown } from '../components/ui/SortDropdown'
import { usePageMeta } from '../features/seo/usePageMeta'
import { tools } from '../data/tools'
import { categories } from '../data/categories'
import type { CategorySlug, PricingType } from '../types'
import {
  buildToolsSearch,
  deriveToolsListing,
  parseToolsParams,
  SORT_OPTIONS,
  type SortKey,
  type ToolsListingState,
} from '../features/tools/listing'
import css from './ToolsPage.module.css'

export default function ToolsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sheetOpen, setSheetOpen] = useState(false)

  const listingState = useMemo(() => parseToolsParams(searchParams), [searchParams])
  const listing = useMemo(() => deriveToolsListing(listingState), [listingState])

  const stats = useMemo(() => {
    const freeCount = tools.filter(
      (tool) => tool.pricing === 'free' || tool.pricing === 'freemium',
    ).length
    return [
      { value: tools.length.toLocaleString(), label: 'AI tools' },
      { value: String(categories.length), label: 'Categories' },
      { value: freeCount.toLocaleString(), label: 'Free to try' },
    ]
  }, [])

  usePageMeta({
    title: 'AIToolsHub — Discover the Best AI Tools',
    description: `Browse all ${listing.totalCount} AI tools in the AIToolsHub directory. Filter by category and pricing, sort, and find the right tool for the job.`,
    path: '/',
  })

  const updateListing = useCallback(
    (patch: (state: ToolsListingState) => ToolsListingState) => {
      setSearchParams((prev) => buildToolsSearch(patch(parseToolsParams(prev))), {
        replace: true,
      })
    },
    [setSearchParams],
  )

  const changeSort = useCallback(
    (value: SortKey) => {
      updateListing((state) => ({ ...state, page: 1, sort: value }))
    },
    [updateListing],
  )

  const togglePricing = useCallback(
    (value: PricingType) => {
      updateListing((state) => ({
        ...state,
        page: 1,
        pricing: state.pricing.includes(value)
          ? state.pricing.filter((item) => item !== value)
          : [...state.pricing, value],
      }))
    },
    [updateListing],
  )

  const toggleTested = useCallback(() => {
    updateListing((state) => ({ ...state, page: 1, tested: !state.tested }))
  }, [updateListing])

  const changeCategory = useCallback(
    (value: CategorySlug | null) => {
      updateListing((state) => ({ ...state, page: 1, category: value }))
    },
    [updateListing],
  )

  const clearFilters = useCallback(() => {
    updateListing((state) => ({ ...state, page: 1, pricing: [], tested: false, category: null }))
  }, [updateListing])

  const openSheet = useCallback(() => setSheetOpen(true), [])
  const closeSheet = useCallback(() => setSheetOpen(false), [])

  const scrollToList = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    document.getElementById('tool-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const hasActiveFilters =
    listingState.pricing.length > 0 || listingState.tested || listingState.category !== null

  const toPage = (page: number) => {
    const query = buildToolsSearch({ ...listingState, page }).toString()
    return query ? `/?${query}` : '/'
  }

  const sidebarProps = {
    categories: listing.categoryFacets,
    category: listingState.category,
    facets: listing.pricingFacets,
    pricing: listingState.pricing,
    tested: listingState.tested,
    hasActiveFilters,
    onCategoryChange: changeCategory,
    onTogglePricing: togglePricing,
    onToggleTested: toggleTested,
    onClear: clearFilters,
  }

  return (
    <>
      <section className={css.banner}>
        <div className="container">
          <p className={css.eyebrow}>The AI tools directory</p>
          <h1 className={css.title}>Find the right AI tool for the job</h1>
          <p className={css.subtitle}>
            Every tool catalogued in one place — {listing.totalCount.toLocaleString()} and
            counting. Filter by category or pricing to narrow it down.
          </p>
          <dl className={css.stats}>
            {stats.map((stat) => (
              <div key={stat.label} className={css.stat}>
                <dt className={css.statLabel}>{stat.label}</dt>
                <dd className={css.statValue}>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={css.listing} id="tool-list">
            <aside className={css.sidebar}>
              <ToolsFilterSidebar {...sidebarProps} />
            </aside>
            <div className={css.content}>
              <div className={css.toolbar}>
                <p className={css.result} role="status">
                  {listing.filteredCount === listing.totalCount
                    ? `${listing.filteredCount.toLocaleString()} ${listing.filteredCount === 1 ? 'tool' : 'tools'}`
                    : `${listing.filteredCount.toLocaleString()} of ${listing.totalCount.toLocaleString()} tools`}
                </p>
                <div className={css.controls}>
                  <button
                    type="button"
                    className={css.filtersBtn}
                    aria-haspopup="dialog"
                    aria-expanded={sheetOpen}
                    onClick={openSheet}
                  >
                    <SlidersHorizontal size={16} aria-hidden="true" />
                    Filters
                  </button>
                  <SortDropdown
                    value={listingState.sort}
                    onChange={changeSort}
                    options={SORT_OPTIONS}
                    label="Sort tools"
                  />
                </div>
              </div>
              {listing.filteredCount > 0 ? (
                <>
                  <CardGrid
                    columns={3}
                    items={listing.visible.map((tool) => (
                      <ToolCard key={tool.slug} tool={tool} />
                    ))}
                  />
                  <Pagination
                    page={listing.page}
                    pageCount={listing.pageCount}
                    toPage={toPage}
                    onNavigate={scrollToList}
                  />
                </>
              ) : (
                <EmptyState
                  title="No AI tools found"
                  description="Try removing some filters to see more tools."
                  action={
                    <Button variant="secondary" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <NewsletterCTA />

      <FilterSheet open={sheetOpen} onClose={closeSheet} resultCount={listing.filteredCount}>
        <ToolsFilterSidebar {...sidebarProps} />
      </FilterSheet>
    </>
  )
}
