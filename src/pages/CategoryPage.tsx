import { SlidersHorizontal } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { LaunchCard } from '../components/cards/LaunchCard'
import { ToolCard } from '../components/cards/ToolCard'
import { BestOverallCard } from '../components/category/BestOverallCard'
import { CategoryHero } from '../components/category/CategoryHero'
import { FilterSheet } from '../components/category/FilterSheet'
import { FilterSidebar } from '../components/category/FilterSidebar'
import { NewsletterCTA } from '../components/home/NewsletterCTA'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Button, ButtonLink } from '../components/ui/Button'
import { CardGrid } from '../components/ui/CardGrid'
import { EmptyState } from '../components/ui/EmptyState'
import { FaqAccordion } from '../components/ui/FaqAccordion'
import { Pagination } from '../components/ui/Pagination'
import { SectionHeader } from '../components/ui/SectionHeader'
import { SortDropdown } from '../components/ui/SortDropdown'
import {
  bestOverallNote,
  buildCategoryJsonLd,
  buildFaqItems,
  buildIntroParagraphs,
  buildMetaDescription,
  buildMetaTitle,
  getCategoryLaunchEntries,
  pickBestOverall,
} from '../features/category/content'
import type { ListingState, SortKey } from '../features/category/listing'
import {
  buildListingSearch,
  deriveListing,
  getCategory,
  getCategoryTools,
  parseListingParams,
  SORT_OPTIONS,
} from '../features/category/listing'
import { usePageMeta } from '../features/seo/usePageMeta'
import type { PricingType } from '../types'
import css from './CategoryPage.module.css'

export default function CategoryPage() {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [sheetOpen, setSheetOpen] = useState(false)

  const category = useMemo(() => getCategory(slug), [slug])
  const categoryTools = useMemo(
    () => (category ? getCategoryTools(category.slug) : []),
    [category],
  )
  const listingState = useMemo(() => parseListingParams(searchParams), [searchParams])
  const listing = useMemo(
    () => deriveListing(listingState, categoryTools),
    [listingState, categoryTools],
  )
  const bestOverall = useMemo(() => pickBestOverall(categoryTools), [categoryTools])
  // No verified ratings/rankings exist yet — showing a "Best Overall" pick without
  // them would invent a ranking, so the section stays hidden until real data lands.
  const hasVerifiedRankings = useMemo(
    () => categoryTools.some((tool) => tool.featuredRank != null || tool.rating != null),
    [categoryTools],
  )
  const launchEntries = useMemo(
    () => (category ? getCategoryLaunchEntries(category.slug) : []),
    [category],
  )
  const faqItems = useMemo(
    () => (category ? buildFaqItems(category, categoryTools) : []),
    [category, categoryTools],
  )
  const introParagraphs = useMemo(
    () => (category ? buildIntroParagraphs(category, categoryTools) : []),
    [category, categoryTools],
  )
  const jsonLd = useMemo(
    () => (category ? buildCategoryJsonLd(category, faqItems) : undefined),
    [category, faqItems],
  )

  usePageMeta({
    title: category ? buildMetaTitle(category) : 'Category not found | AIToolsHub',
    description: category
      ? buildMetaDescription(category, categoryTools)
      : 'This category could not be found on AIToolsHub.',
    path: `/category/${slug ?? ''}`,
    jsonLd,
  })

  const updateListing = useCallback(
    (patch: (state: ListingState) => ListingState) => {
      setSearchParams((prev) => buildListingSearch(patch(parseListingParams(prev))), {
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

  const changeSubcategory = useCallback(
    (value: string | null) => {
      updateListing((state) => ({ ...state, page: 1, subcategory: value }))
    },
    [updateListing],
  )

  const clearFilters = useCallback(() => {
    updateListing((state) => ({ ...state, page: 1, pricing: [], tested: false, subcategory: null }))
  }, [updateListing])

  const openSheet = useCallback(() => setSheetOpen(true), [])
  const closeSheet = useCallback(() => setSheetOpen(false), [])

  const scrollToList = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    document.getElementById('tool-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  if (!category) {
    return (
      <section className="section">
        <div className="container">
          <Breadcrumbs
            items={[{ label: 'Home', to: '/' }, { label: 'Categories', to: '/categories' }]}
          />
          <EmptyState
            title="Category not found"
            description="We couldn't find a category at this address. It may have been renamed or the link may be broken."
            action={
              <ButtonLink variant="secondary" to="/categories">
                Browse all categories
              </ButtonLink>
            }
          />
        </div>
      </section>
    )
  }

  const hasActiveFilters =
    listingState.pricing.length > 0 || listingState.tested || listingState.subcategory !== null
  const isZeroTool = categoryTools.length === 0

  const toPage = (page: number) => {
    const query = buildListingSearch({ ...listingState, page }).toString()
    return query ? `/category/${category.slug}?${query}` : `/category/${category.slug}`
  }

  const sidebarProps = {
    facets: listing.facets,
    pricing: listingState.pricing,
    tested: listingState.tested,
    subcategories: listing.subcategoryFacets,
    subcategory: listingState.subcategory,
    hasActiveFilters,
    onTogglePricing: togglePricing,
    onToggleTested: toggleTested,
    onSubcategoryChange: changeSubcategory,
    onClear: clearFilters,
  }

  return (
    <>
      <section className="section">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Categories', to: '/categories' },
              { label: category.name },
            ]}
          />
          <CategoryHero category={category} toolCount={categoryTools.length} />

          {isZeroTool ? (
            <div className={css.emptyWrap}>
              <EmptyState
                title={`Nothing catalogued in ${category.name} yet`}
                description="This page will fill up as soon as we add the first tools here."
                action={
                  <ButtonLink variant="secondary" to="/categories">
                    Browse all categories
                  </ButtonLink>
                }
              />
            </div>
          ) : (
            <>
              {bestOverall && hasVerifiedRankings ? (
                <section className={css.best}>
                  <SectionHeader
                    title="Best Overall"
                    description="Our highest-ranked pick in this category."
                  />
                  <BestOverallCard tool={bestOverall} note={bestOverallNote(bestOverall)} />
                </section>
              ) : null}

              <div className={css.listing} id="tool-list">
                <aside className={css.sidebar}>
                  <FilterSidebar {...sidebarProps} />
                </aside>
                <div className={css.content}>
                  <div className={css.toolbar}>
                    <p className={css.result} role="status">
                      {listing.filteredCount === listing.totalCount
                        ? `${listing.filteredCount} ${listing.filteredCount === 1 ? 'tool' : 'tools'}`
                        : `${listing.filteredCount} of ${listing.totalCount} tools`}
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
                      <SortDropdown value={listingState.sort} onChange={changeSort} options={SORT_OPTIONS} label="Sort tools" />
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
                      description="Try removing some filters or searching another category."
                      action={
                        <Button variant="secondary" onClick={clearFilters}>
                          Clear Filters
                        </Button>
                      }
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {!isZeroTool && launchEntries.length > 0 ? (
        <section className="section">
          <div className="container">
            <SectionHeader
              title={`New in ${category.name}`}
              description="The latest additions to this category, checked and catalogued."
            />
            <ul className={css.launches}>
              {launchEntries.map((entry) => (
                <li key={entry.launch.slug}>
                  <LaunchCard launch={entry.launch} dateLabel={entry.dateLabel} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container">
          <h2 className={css.sectionTitle}>About {category.name}</h2>
          {introParagraphs.map((paragraph, index) => (
            <p key={index} className={css.intro}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {faqItems.length > 0 ? (
        <section className="section">
          <div className="container">
            <h2 className={css.sectionTitle}>{category.name} FAQ</h2>
            <FaqAccordion items={faqItems} />
          </div>
        </section>
      ) : null}

      <NewsletterCTA />

      {!isZeroTool ? (
        <FilterSheet open={sheetOpen} onClose={closeSheet} resultCount={listing.filteredCount}>
          <FilterSidebar {...sidebarProps} />
        </FilterSheet>
      ) : null}
    </>
  )
}
