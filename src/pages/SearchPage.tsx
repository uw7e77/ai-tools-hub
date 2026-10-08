import { ArrowRight } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AgentCard } from '../components/cards/AgentCard'
import { CompanyCard } from '../components/cards/CompanyCard'
import { ToolCard } from '../components/cards/ToolCard'
import { TutorialCard } from '../components/cards/TutorialCard'
import { CategoryCard } from '../components/categories/CategoryCard'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { ButtonLink } from '../components/ui/Button'
import { CardGrid } from '../components/ui/CardGrid'
import { EmptyState } from '../components/ui/EmptyState'
import {
  agentBySlug,
  categoryBySlug,
  companyBySlug,
  toolBySlug,
  tutorialBySlug,
} from '../data/lookups'
import { popularSearches, siteUrl } from '../data/site'
import { tools } from '../data/tools'
import {
  useSearchIndex,
  type SearchGroup,
  type SearchResult,
} from '../features/search/useSearchIndex'
import { usePageMeta } from '../features/seo/usePageMeta'
import type {
  AgentSlug,
  CategorySlug,
  CompanySlug,
  ToolSlug,
  TutorialSlug,
} from '../types'
import css from './SearchPage.module.css'

// Autocomplete shows 3 per group; the dedicated results page shows more.
const RESULTS_PER_GROUP = 12

const groupViewAll: Record<SearchGroup, { label: string; href: string }> = {
  Tools: { label: 'Browse all categories', href: '/categories' },
  Categories: { label: 'View all categories', href: '/categories' },
  'AI Agents': { label: 'View all agents', href: '/agents' },
  Companies: { label: 'View all companies', href: '/companies' },
  Tutorials: { label: 'View all tutorials', href: '/tutorials' },
}

function GroupItems({ items }: { items: SearchResult[] }) {
  const cards = useMemo(
    () =>
      items
        .map((item) => {
          switch (item.group) {
            case 'Tools': {
              const tool = toolBySlug.get(item.id as ToolSlug)
              return tool ? <ToolCard key={item.id} tool={tool} /> : null
            }
            case 'Categories': {
              const category = categoryBySlug.get(item.id as CategorySlug)
              return category ? <CategoryCard key={item.id} category={category} /> : null
            }
            case 'AI Agents': {
              const agent = agentBySlug.get(item.id as AgentSlug)
              return agent ? <AgentCard key={item.id} agent={agent} /> : null
            }
            case 'Companies': {
              const company = companyBySlug.get(item.id as CompanySlug)
              if (!company) return null
              const toolCount = tools.filter((tool) => tool.company === company.slug).length
              return <CompanyCard key={item.id} company={company} toolCount={toolCount} />
            }
            case 'Tutorials': {
              const tutorial = tutorialBySlug.get(item.id as TutorialSlug)
              return tutorial ? <TutorialCard key={item.id} tutorial={tutorial} /> : null
            }
            default:
              return null
          }
        })
        .filter((card) => card !== null),
    [items],
  )

  if (cards.length === 0) return null
  return <CardGrid items={cards} columns={items[0]?.group === 'Tools' ? 4 : 3} />
}

function PopularSearches() {
  return (
    <div className={css.suggestions}>
      <span className={css.suggestionsLabel}>Popular searches:</span>
      <ul className={css.suggestionsList}>
        {popularSearches.map((term) => (
          <li key={term}>
            <Link
              className={css.suggestionLink}
              to={`/search?q=${encodeURIComponent(term)}`}
            >
              {term}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''
  const groups = useSearchIndex(query, RESULTS_PER_GROUP)

  usePageMeta({
    title: query ? `Search results for "${query}" | AIToolsHub` : 'Search | AIToolsHub',
    description: query
      ? `AI tools, agents, companies and tutorials matching "${query}" on AIToolsHub.`
      : 'Search the AIToolsHub directory of AI tools, agents, companies and tutorials.',
    path: query ? `/search?q=${encodeURIComponent(query)}` : '/search',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Search', item: `${siteUrl}/search` },
      ],
    },
  })

  return (
    <section className={css.wrap}>
      <div className="container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />
        <header className={css.header}>
          <h1>{query ? `Results for "${query}"` : 'Search the directory'}</h1>
          {!query ? (
            <p className={css.lede}>
              Search across {tools.length.toLocaleString('en-US')} AI tools, agents, companies
              and tutorials.
            </p>
          ) : null}
        </header>

        {!query ? (
          <EmptyState
            title="Type something to search"
            description="Use the search box in the header, or try one of these popular topics."
            action={<PopularSearches />}
          />
        ) : groups.length === 0 ? (
          <EmptyState
            title={`No results for "${query}"`}
            description="Check the spelling, try a shorter or more general term, or browse the directory instead."
            action={
              <ButtonLink variant="secondary" to="/categories">
                Browse all categories
              </ButtonLink>
            }
          />
        ) : (
          <div className={css.groups}>
            {groups.map((group) => (
              <div key={group.group} className={css.group}>
                <div className={css.groupHead}>
                  <h2 className={css.groupTitle}>{group.group}</h2>
                  <Link className={css.viewAll} to={groupViewAll[group.group].href}>
                    {groupViewAll[group.group].label}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
                <GroupItems items={group.items} />
              </div>
            ))}
          </div>
        )}

        {query && groups.length === 0 ? <PopularSearches /> : null}
      </div>
    </section>
  )
}
