import { ArrowRight } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { NewBadge } from '../components/ui/Badge'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { ButtonLink } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { categoryBySlug, toolBySlug } from '../data/lookups'
import { launches } from '../data/launches'
import { siteUrl } from '../data/site'
import { usePageMeta } from '../features/seo/usePageMeta'
import css from './LaunchesPage.module.css'

function formatLaunchDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function LaunchesPage() {
  const sorted = useMemo(
    () =>
      [...launches].sort(
        (a, b) => new Date(b.launchedAt).getTime() - new Date(a.launchedAt).getTime(),
      ),
    [],
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'New launches', item: `${siteUrl}/new` },
    ],
  }

  usePageMeta({
    title: 'New AI Tool Launches | AIToolsHub',
    description:
      'The newest AI tools added to the AIToolsHub directory, checked and catalogued.',
    path: '/new',
    jsonLd,
  })

  return (
    <section className={css.wrap}>
      <div className="container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'New launches' }]} />
        <header className={css.header}>
          <h1>New launches</h1>
          <p className={css.lede}>
            Fresh AI tools as they launch — checked and catalogued by AIToolsHub.
          </p>
        </header>
        {sorted.length > 0 ? (
          <ul className={css.launchList}>
            {sorted.map((launch) => {
              const tool = toolBySlug.get(launch.toolSlug)
              const category = categoryBySlug.get(launch.category)
              const heading = tool ? (
                <Link to={`/tool/${tool.slug}`} className={css.launchLink}>
                  {launch.name}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              ) : (
                launch.name
              )
              return (
                <li key={launch.slug} className={css.launchCard}>
                  <div className={css.launchTop}>
                    <h2 className={css.launchTitle}>{heading}</h2>
                    {launch.isNew ? <NewBadge /> : null}
                  </div>
                  <p className={css.launchDescription}>{launch.description}</p>
                  <p className={css.launchMeta}>
                    {category ? (
                      <>
                        <span>{category.name}</span>
                        <span className={css.dot} aria-hidden="true" />
                      </>
                    ) : null}
                    <time dateTime={launch.launchedAt}>Launched {formatLaunchDate(launch.launchedAt)}</time>
                  </p>
                </li>
              )
            })}
          </ul>
        ) : (
          <EmptyState
            title="No launches catalogued yet"
            description="We haven't catalogued any launches yet. New tools will appear here as soon as we add them — browse the full directory in the meantime."
            action={
              <ButtonLink variant="secondary" to="/categories">
                Browse all categories
              </ButtonLink>
            }
          />
        )}
      </div>
    </section>
  )
}
