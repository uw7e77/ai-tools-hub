import { Search, X } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AgentCard } from '../components/cards/AgentCard'
import { NewsletterCTA } from '../components/home/NewsletterCTA'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Button } from '../components/ui/Button'
import { CardGrid } from '../components/ui/CardGrid'
import { EmptyState } from '../components/ui/EmptyState'
import { Pagination } from '../components/ui/Pagination'
import { SectionHeader } from '../components/ui/SectionHeader'
import {
  buildAgentSearch,
  deriveAgentListing,
  featuredAgentList,
  newAgentList,
  parseAgentParams,
  popularAgentList,
} from '../features/agents/listing'
import type { AgentListingState } from '../features/agents/listing'
import { usePageMeta } from '../features/seo/usePageMeta'
import type { Difficulty, PricingType } from '../types'
import { cx } from '../utils/cx'
import css from './AgentsPage.module.css'

const WHAT_IS_PARAGRAPHS = [
  'An AI agent is software that takes a goal, plans the steps and completes them — browsing the web, editing files, running code or updating your tools — instead of only answering a question in a chat window.',
  'The difference from a chatbot is autonomy. You give an agent an outcome, such as "research these competitors and draft a report", and it decides the steps, uses the tools and returns the finished work for your review.',
  'Every agent in this hub is catalogued by what it can actually do, how hard it is to set up and what it costs, so you can pick the right level of autonomy for the task.',
]

export default function AgentsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const state = useMemo(() => parseAgentParams(searchParams), [searchParams])
  const listing = useMemo(() => deriveAgentListing(state), [state])
  const [searchInput, setSearchInput] = useState(state.query)
  // Keep the input in sync when the URL changes without typing — e.g.
  // browser back/forward navigation to a shared agents link (render-time
  // adjustment — the documented pattern for syncing state to new props).
  const [lastQuery, setLastQuery] = useState(state.query)
  if (state.query !== lastQuery) {
    setLastQuery(state.query)
    setSearchInput(state.query)
  }

  usePageMeta({
    title: 'AI Agents — Autonomous AI Systems That Perform Tasks | AIToolsHub',
    description:
      'Browse AI agents that research, code and complete tasks on their own. Filter by difficulty and pricing, with honest capability checklists for every agent.',
    path: '/agents',
  })

  const update = useCallback(
    (patch: (state: AgentListingState) => AgentListingState) => {
      setSearchParams((prev) => buildAgentSearch(patch(parseAgentParams(prev))), {
        replace: true,
      })
    },
    [setSearchParams],
  )

  const submitQuery = useCallback(
    (query: string) => {
      update((state) => ({ ...state, page: 1, query: query.trim() }))
    },
    [update],
  )

  const toggleDifficulty = useCallback(
    (value: Difficulty) => {
      update((state) => ({
        ...state,
        page: 1,
        difficulty: state.difficulty.includes(value)
          ? state.difficulty.filter((item) => item !== value)
          : [...state.difficulty, value],
      }))
    },
    [update],
  )

  const togglePricing = useCallback(
    (value: PricingType) => {
      update((state) => ({
        ...state,
        page: 1,
        pricing: state.pricing.includes(value)
          ? state.pricing.filter((item) => item !== value)
          : [...state.pricing, value],
      }))
    },
    [update],
  )

  const clearFilters = useCallback(() => {
    setSearchInput('')
    update(() => ({ query: '', difficulty: [], pricing: [], page: 1 }))
  }, [update])

  const scrollToList = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    document.getElementById('agent-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const toPage = useCallback(
    (page: number) => {
      const query = buildAgentSearch({ ...state, page }).toString()
      return query ? `/agents?${query}` : '/agents'
    },
    [state],
  )

  const hasActiveFilters =
    state.query !== '' || state.difficulty.length > 0 || state.pricing.length > 0

  return (
    <>
      <section className="section">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'AI Agents' }]} />

          <header className={css.hero}>
            <p className={css.eyebrow}>Autonomous systems</p>
            <h1 className={css.title}>AI Agents</h1>
            <p className={css.subtitle}>
              AI systems that can actually perform tasks — research, code and complete work on
              their own, not just chat.
            </p>
          </header>

          <section className={css.explainer} aria-labelledby="what-is">
            <h2 id="what-is" className={css.explainerTitle}>
              What is an AI Agent?
            </h2>
            {WHAT_IS_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className={css.explainerText}>
                {paragraph}
              </p>
            ))}
          </section>

          <div className={css.controls} id="agent-list">
            <form
              className={css.search}
              role="search"
              onSubmit={(event) => {
                event.preventDefault()
                submitQuery(searchInput)
              }}
            >
              <Search className={css.searchIcon} size={18} aria-hidden="true" />
              <input
                className={css.searchInput}
                type="search"
                value={searchInput}
                onChange={(event) => {
                  setSearchInput(event.target.value)
                  submitQuery(event.target.value)
                }}
                placeholder="Search agents by name, company or capability…"
                aria-label="Search AI agents"
                autoComplete="off"
                spellCheck={false}
              />
            </form>

            <div className={css.filterRows} role="group" aria-label="Filter agents">
              {listing.difficultyFacets.length > 0 ? (
                <div className={css.filterRow}>
                  <span className={css.filterLabel}>Difficulty</span>
                  {listing.difficultyFacets.map((facet) => {
                    const active = state.difficulty.includes(facet.value)
                    return (
                      <button
                        key={facet.value}
                        type="button"
                        className={cx(css.pill, active && css.pillActive)}
                        aria-pressed={active}
                        onClick={() => toggleDifficulty(facet.value)}
                      >
                        {facet.label}
                        <span className={css.pillCount}>{facet.count}</span>
                      </button>
                    )
                  })}
                </div>
              ) : null}
              <div className={css.filterRow}>
                <span className={css.filterLabel}>Pricing</span>
                {listing.pricingFacets.map((facet) => {
                  const active = state.pricing.includes(facet.value)
                  return (
                    <button
                      key={facet.value}
                      type="button"
                      className={cx(css.pill, active && css.pillActive)}
                      aria-pressed={active}
                      onClick={() => togglePricing(facet.value)}
                    >
                      {facet.label}
                      <span className={css.pillCount}>{facet.count}</span>
                    </button>
                  )
                })}
                {hasActiveFilters ? (
                  <button
                    type="button"
                    className={cx(css.pill, css.clearBtn)}
                    onClick={clearFilters}
                  >
                    <X size={14} aria-hidden="true" />
                    Clear all
                  </button>
                ) : null}
              </div>
            </div>

            <p className={css.result} role="status">
              {listing.filteredCount === listing.totalCount
                ? `${listing.filteredCount} ${listing.filteredCount === 1 ? 'agent' : 'agents'}`
                : `${listing.filteredCount} of ${listing.totalCount} agents`}
            </p>
          </div>

          {listing.filteredCount > 0 ? (
            <>
              <CardGrid
                items={listing.visible.map((agent) => (
                  <AgentCard key={agent.slug} agent={agent} />
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
              title="No AI agents found"
              description="Try a different search term or remove some filters."
              action={
                <Button variant="secondary" onClick={clearFilters}>
                  Clear Search &amp; Filters
                </Button>
              }
            />
          )}
        </div>
      </section>

      {featuredAgentList.length > 0 ? (
        <section className="section">
          <div className="container">
            <SectionHeader
              title="Featured AI agents"
              description="Our editors' picks — agents with proven, verifiable task execution."
            />
            <CardGrid
              items={featuredAgentList.map((agent) => (
                <AgentCard key={agent.slug} agent={agent} />
              ))}
            />
          </div>
        </section>
      ) : null}

      {popularAgentList.length > 0 ? (
        <section className="section">
          <div className="container">
            <SectionHeader
              title="Popular agents"
              description="The agents our readers start with most often."
            />
            <CardGrid
              items={popularAgentList.map((agent) => (
                <AgentCard key={agent.slug} agent={agent} />
              ))}
            />
          </div>
        </section>
      ) : null}

      {newAgentList.length > 0 ? (
        <section className="section">
          <div className="container">
            <SectionHeader
              title="New agents"
              description="Recently added to the hub, checked and catalogued."
            />
            <CardGrid
              items={newAgentList.map((agent) => (
                <AgentCard key={agent.slug} agent={agent} />
              ))}
            />
          </div>
        </section>
      ) : null}

      <NewsletterCTA />
    </>
  )
}
