import { ArrowRight, Building2, Calendar, MapPin, Newspaper, Users } from 'lucide-react'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { CompanyCard } from '../components/cards/CompanyCard'
import { ToolCard } from '../components/cards/ToolCard'
import { TutorialCard } from '../components/cards/TutorialCard'
import { NewsletterCTA } from '../components/home/NewsletterCTA'
import { BookmarkButton } from '../components/ui/BookmarkButton'
import { BrandLogo } from '../components/ui/BrandLogo'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { ButtonAnchor, ButtonLink } from '../components/ui/Button'
import { CardGrid } from '../components/ui/CardGrid'
import { EmptyState } from '../components/ui/EmptyState'
import { companyBySlug } from '../data/lookups'
import { companyDetails } from '../data/companyDetails'
import { tools } from '../data/tools'
import { tutorials } from '../data/tutorials'
import { usePageMeta } from '../features/seo/usePageMeta'
import type { CompanySlug } from '../types'
import css from './CompanyDetailPage.module.css'

export default function CompanyDetailPage() {
  const { slug } = useParams()
  const company = useMemo(() => (slug ? companyBySlug.get(slug as CompanySlug) : undefined), [slug])
  const detail = company ? companyDetails[company.slug] : undefined
  // Treat a whitespace-only website the same as a missing one so we never
  // render a link with an unusable href.
  const website = useMemo(() => {
    const trimmed = company?.website.trim()
    return trimmed ? trimmed : null
  }, [company])

  const companyTools = useMemo(
    () => (company ? tools.filter((t) => t.company === company.slug) : []),
    [company],
  )

  const companyTutorials = useMemo(
    () =>
      companyTools.length > 0
        ? tutorials.filter((t) => companyTools.some((ct) => t.toolsUsed.includes(ct.slug)))
        : [],
    [companyTools],
  )

  const relatedCompanies = useMemo(() => {
    if (!detail?.relatedCompanies) return []
    return detail.relatedCompanies
      .map((s) => companyBySlug.get(s))
      .filter((c) => c !== undefined)
      .slice(0, 3)
  }, [detail])

  const jsonLd = useMemo(() => {
    if (!company) return undefined
    const organization: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: company.name,
      description: company.description,
    }
    if (website) organization.url = website
    if (company.founded != null) organization.foundingDate = String(company.founded)
    if (company.hq) organization.location = company.hq
    return organization
  }, [company, website])

  usePageMeta({
    title: company ? `${company.name} — AI Company Profile & Products | AIToolsHub` : 'Company not found | AIToolsHub',
    description: company ? company.description : 'This AI company could not be found on AIToolsHub.',
    path: `/company/${slug ?? ''}`,
    jsonLd,
  })

  if (!company) {
    return (
      <section className="section">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Companies', to: '/companies' }]} />
          <EmptyState
            title="Company not found"
            description="We couldn't find an AI company at this address. It may have been renamed or the link may be broken."
            action={
              <ButtonLink variant="secondary" to="/companies">
                Browse all companies
              </ButtonLink>
            }
          />
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="section">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Companies', to: '/companies' },
              { label: company.name },
            ]}
          />
          <header className={css.hero}>
            <BrandLogo logo={company.logo} name={company.name} size={72} />
            <div className={css.heroBody}>
              <h1>{company.name}</h1>
              <p className={css.description}>{company.description}</p>
              <div className={css.meta}>
                {company.founded != null ? (
                  <span className={css.metaItem}>
                    <Calendar size={14} aria-hidden="true" />
                    Founded {company.founded}
                  </span>
                ) : null}
                {company.hq ? (
                  <span className={css.metaItem}>
                    <MapPin size={14} aria-hidden="true" />
                    {company.hq}
                  </span>
                ) : null}
                {detail?.focus ? (
                  <span className={css.metaItem}>
                    <Building2 size={14} aria-hidden="true" />
                    {detail.focus}
                  </span>
                ) : null}
              </div>
              <div className={css.actions}>
                {website ? (
                  <ButtonAnchor href={website} target="_blank" rel="noopener noreferrer">
                    Visit Official Website
                    <ArrowRight size={16} aria-hidden="true" />
                  </ButtonAnchor>
                ) : null}
                <BookmarkButton slug={company.slug} name={company.name} />
              </div>
            </div>
          </header>
        </div>
      </section>

      <div className="container">
        <div className={css.content}>
          <section className={css.section}>
            <h2>Company Overview</h2>
            {company.mission ? <p className={css.mission}>{company.mission}</p> : null}
            {company.longDescription ? (
              <p className={css.prose}>{company.longDescription}</p>
            ) : null}
          </section>

          <section className={css.section}>
            <h2>Key Stats</h2>
            <dl className={css.stats}>
              {company.founded != null ? (
                <div className={css.stat}>
                  <dt>Founded</dt>
                  <dd>{company.founded}</dd>
                </div>
              ) : null}
              {company.hq ? (
                <div className={css.stat}>
                  <dt>Headquarters</dt>
                  <dd>{company.hq}</dd>
                </div>
              ) : null}
              {detail?.stats?.employees ? (
                <div className={css.stat}>
                  <dt>
                    <Users size={14} aria-hidden="true" />
                    Employees
                  </dt>
                  <dd>{detail.stats.employees}</dd>
                </div>
              ) : null}
              {detail?.stats?.valuation ? (
                <div className={css.stat}>
                  <dt>Valuation</dt>
                  <dd>{detail.stats.valuation}</dd>
                </div>
              ) : null}
              <div className={css.stat}>
                <dt>AI Products</dt>
                <dd>{company.products.length}</dd>
              </div>
              <div className={css.stat}>
                <dt>Models</dt>
                <dd>{company.models.length}</dd>
              </div>
              {/* companyTools joins on free-text Tool.company, which never matches a
                  company slug — the count is always 0, so hide it rather than
                  show a misleading "0". */}
              {companyTools.length > 0 ? (
                <div className={css.stat}>
                  <dt>Tools on AIToolsHub</dt>
                  <dd>{companyTools.length}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          {company.products.length > 0 ? (
            <section className={css.section}>
              <h2>AI Products</h2>
              <ul className={css.productList}>
                {company.products.map((product) => (
                  <li key={product} className={css.product}>{product}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {company.models.length > 0 ? (
            <section className={css.section}>
              <h2>AI Models</h2>
              <ul className={css.modelList}>
                {company.models.map((model) => (
                  <li key={model} className={css.model}>{model}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {companyTools.length > 0 ? (
            <section className={css.section}>
              <h2>Tools by {company.name}</h2>
              <CardGrid items={companyTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)} />
              <p className={css.moreLink}>
                <ButtonLink variant="ghost" to="/categories">
                  View All Tools
                  <ArrowRight size={14} aria-hidden="true" />
                </ButtonLink>
              </p>
            </section>
          ) : null}

          {detail?.news?.length ? (
            <section className={css.section}>
              <h2>
                <Newspaper size={18} aria-hidden="true" />
                Latest AI News
              </h2>
              <ul className={css.newsList}>
                {detail.news.map((item) => (
                  <li key={item.title} className={css.newsItem}>
                    <time className={css.newsDate} dateTime={item.date}>
                      {new Date(`${item.date}T00:00:00`).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                    <div>
                      <p className={css.newsTitle}>{item.title}</p>
                      <p className={css.newsSummary}>{item.summary}</p>
                      {item.source ? <p className={css.newsSource}>{item.source}</p> : null}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {companyTutorials.length > 0 ? (
            <section className={css.section}>
              <h2>Related Tutorials</h2>
              <CardGrid
                items={companyTutorials.map((tutorial) => (
                  <TutorialCard key={tutorial.slug} tutorial={tutorial} />
                ))}
              />
            </section>
          ) : null}

          {detail?.timeline?.length ? (
            <section className={css.section}>
              <h2>Company Timeline</h2>
              <ol className={css.timeline}>
                {detail.timeline.map((item) => (
                  <li key={`${item.year}-${item.event}`} className={css.timelineItem}>
                    <span className={css.timelineYear}>{item.year}</span>
                    <span className={css.timelineEvent}>{item.event}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {relatedCompanies.length > 0 ? (
            <section className={css.section}>
              <h2>Related Companies</h2>
              <CardGrid
                items={relatedCompanies.map((c) => (
                  <CompanyCard key={c.slug} company={c} toolCount={tools.filter((t) => t.company === c.slug).length} />
                ))}
              />
            </section>
          ) : null}
        </div>
      </div>

      <NewsletterCTA />
    </>
  )
}
