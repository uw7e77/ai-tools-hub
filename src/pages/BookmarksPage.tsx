import { ArrowRight } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AgentCard } from '../components/cards/AgentCard'
import { CompanyCard } from '../components/cards/CompanyCard'
import { ToolCard } from '../components/cards/ToolCard'
import { TutorialCard } from '../components/cards/TutorialCard'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { ButtonLink } from '../components/ui/Button'
import { CardGrid } from '../components/ui/CardGrid'
import { EmptyState } from '../components/ui/EmptyState'
import {
  agentBySlug,
  companyBySlug,
  toolBySlug,
  tutorialBySlug,
} from '../data/lookups'
import { siteUrl } from '../data/site'
import { tools } from '../data/tools'
import { useBookmarks } from '../features/bookmarks/useBookmarks'
import { usePageMeta } from '../features/seo/usePageMeta'
import type {
  Agent,
  AgentSlug,
  Company,
  CompanySlug,
  Tool,
  ToolSlug,
  Tutorial,
  TutorialSlug,
} from '../types'
import css from './BookmarksPage.module.css'

interface BookmarkGroups {
  tools: Tool[]
  agents: Agent[]
  companies: Company[]
  tutorials: Tutorial[]
}

function resolveBookmarks(slugs: string[]): BookmarkGroups {
  const groups: BookmarkGroups = { tools: [], agents: [], companies: [], tutorials: [] }
  for (const slug of slugs) {
    // Bookmarks store plain slugs; resolve against every entity type.
    // Stale slugs (removed records) are skipped silently.
    const tool = toolBySlug.get(slug as ToolSlug)
    if (tool) {
      groups.tools.push(tool)
      continue
    }
    const agent = agentBySlug.get(slug as AgentSlug)
    if (agent) {
      groups.agents.push(agent)
      continue
    }
    const company = companyBySlug.get(slug as CompanySlug)
    if (company) {
      groups.companies.push(company)
      continue
    }
    const tutorial = tutorialBySlug.get(slug as TutorialSlug)
    if (tutorial) {
      groups.tutorials.push(tutorial)
    }
  }
  return groups
}

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks()
  const groups = useMemo(() => resolveBookmarks(bookmarks), [bookmarks])

  usePageMeta({
    title: 'Bookmarks | AIToolsHub',
    description: 'Your saved AI tools, agents, companies and tutorials on AIToolsHub.',
    path: '/bookmarks',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Bookmarks', item: `${siteUrl}/bookmarks` },
      ],
    },
  })

  const totalCount =
    groups.tools.length + groups.agents.length + groups.companies.length + groups.tutorials.length

  return (
    <section className={css.wrap}>
      <div className="container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Bookmarks' }]} />
        <header className={css.header}>
          <h1>Bookmarks</h1>
          <p className={css.lede}>
            {totalCount > 0
              ? `${totalCount} saved ${totalCount === 1 ? 'item' : 'items'} — stored in this browser only.`
              : 'Items you save are stored in this browser only.'}
          </p>
        </header>

        {totalCount === 0 ? (
          <EmptyState
            title="No bookmarks yet"
            description="Tap the bookmark icon on any tool, agent, company or tutorial to save it here for later."
            action={
              <ButtonLink variant="secondary" to="/categories">
                Browse all categories
              </ButtonLink>
            }
          />
        ) : (
          <div className={css.groups}>
            {groups.tools.length > 0 ? (
              <div className={css.group}>
                <div className={css.groupHead}>
                  <h2 className={css.groupTitle}>Tools</h2>
                  <Link className={css.viewAll} to="/categories">
                    Browse all tools
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
                <CardGrid
                  items={groups.tools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                  columns={4}
                />
              </div>
            ) : null}
            {groups.agents.length > 0 ? (
              <div className={css.group}>
                <div className={css.groupHead}>
                  <h2 className={css.groupTitle}>AI Agents</h2>
                  <Link className={css.viewAll} to="/agents">
                    View all agents
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
                <CardGrid
                  items={groups.agents.map((agent) => (
                    <AgentCard key={agent.slug} agent={agent} />
                  ))}
                />
              </div>
            ) : null}
            {groups.companies.length > 0 ? (
              <div className={css.group}>
                <div className={css.groupHead}>
                  <h2 className={css.groupTitle}>Companies</h2>
                  <Link className={css.viewAll} to="/companies">
                    View all companies
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
                <CardGrid
                  items={groups.companies.map((company) => (
                    <CompanyCard
                      key={company.slug}
                      company={company}
                      toolCount={tools.filter((tool) => tool.company === company.slug).length}
                    />
                  ))}
                />
              </div>
            ) : null}
            {groups.tutorials.length > 0 ? (
              <div className={css.group}>
                <div className={css.groupHead}>
                  <h2 className={css.groupTitle}>Tutorials</h2>
                  <Link className={css.viewAll} to="/tutorials">
                    View all tutorials
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
                <CardGrid
                  items={groups.tutorials.map((tutorial) => (
                    <TutorialCard key={tutorial.slug} tutorial={tutorial} />
                  ))}
                />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
