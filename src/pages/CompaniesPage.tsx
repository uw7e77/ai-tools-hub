import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CompanyCard } from '../components/cards/CompanyCard'
import { NewsletterCTA } from '../components/home/NewsletterCTA'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Button } from '../components/ui/Button'
import { CardGrid } from '../components/ui/CardGrid'
import { EmptyState } from '../components/ui/EmptyState'
import { SectionHeader } from '../components/ui/SectionHeader'
import { SortDropdown } from '../components/ui/SortDropdown'
import { companies } from '../data/companies'
import { tools } from '../data/tools'
import { siteUrl } from '../data/site'
import { usePageMeta } from '../features/seo/usePageMeta'
import css from './CompaniesPage.module.css'

type CompanySort = 'featured' | 'az' | 'newest'

const COMPANY_SORT_OPTIONS: ReadonlyArray<{ value: CompanySort; label: string }> = [
  { value: 'featured', label: 'Featured' },
  { value: 'az', label: 'A–Z' },
  { value: 'newest', label: 'Newest' },
]

function toolCountByCompany(slug: string): number {
  return tools.filter((tool) => tool.company === slug).length
}

export default function CompaniesPage() {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<CompanySort>('featured')
  const normalized = query.trim().toLowerCase()

  const filtered = useMemo(() => {
    if (!normalized) return companies
    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(normalized) ||
        company.description.toLowerCase().includes(normalized) ||
        (company.mission ?? '').toLowerCase().includes(normalized) ||
        company.products.some((p) => p.toLowerCase().includes(normalized)),
    )
  }, [normalized])

  const sorted = useMemo(() => {
    const list = [...filtered]
    switch (sort) {
      case 'az':
        return list.sort((a, b) => a.name.localeCompare(b.name))
      case 'newest':
        return list.sort((a, b) => (b.founded ?? 0) - (a.founded ?? 0))
      case 'featured':
      default:
        return list.sort((a, b) => {
          if (a.featured === b.featured) return a.name.localeCompare(b.name)
          return a.featured ? -1 : 1
        })
    }
  }, [filtered, sort])

  const featuredCompanies = useMemo(() => companies.filter((c) => c.featured), [])
  // Tool.company is free text, so counts are usually 0 — hide the ranking
  // rather than present an arbitrary order as "popular".
  const popularCompanies = (() => {
    const ranked = companies
      .filter((c) => !c.featured)
      .map((company) => ({ company, toolCount: toolCountByCompany(company.slug) }))
      .sort((a, b) => b.toolCount - a.toolCount)
    if (ranked.length === 0 || ranked[0].toolCount === 0) return []
    return ranked.slice(0, 3).map((entry) => entry.company)
  })()

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Companies', item: `${siteUrl}/companies` },
      ],
    }),
    [],
  )

  usePageMeta({
    title: 'AI Companies — Leading AI Labs & Platforms | AIToolsHub',
    description: `Browse ${companies.length} AI companies — from OpenAI and Anthropic to emerging startups. Compare products, models and tools on AIToolsHub.`,
    path: '/companies',
    jsonLd,
  })

  return (
    <>
      <section className={css.wrap}>
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Companies' }]} />

          <header className={css.header}>
            <h1>AI Companies</h1>
            <p className={css.lede}>
              Explore the companies building the world’s most important AI tools — from frontier
              research labs to creative platforms and developer tools.
            </p>
          </header>

          <div className={css.toolbar}>
            <div className={css.searchField}>
              <Search size={18} className={css.searchIcon} aria-hidden="true" />
              <input
                type="search"
                className={css.searchInput}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search companies, products or models…"
                aria-label="Search companies"
                autoComplete="off"
              />
            </div>
            <SortDropdown value={sort} onChange={setSort} options={COMPANY_SORT_OPTIONS} label="Sort companies" />
            <p className={css.resultCount} role="status">
              {sorted.length} of {companies.length} companies
            </p>
          </div>

          {sorted.length > 0 ? (
            <CardGrid
              items={sorted.map((company) => (
                <CompanyCard
                  key={company.slug}
                  company={company}
                  toolCount={toolCountByCompany(company.slug)}
                />
              ))}
            />
          ) : (
            <EmptyState
              title="No companies match your search"
              description={`Nothing found for “${query.trim()}”. Try a different keyword — OpenAI, image, voice or coding.`}
              action={
                <Button variant="secondary" onClick={() => setQuery('')}>
                  Clear search
                </Button>
              }
            />
          )}
        </div>
      </section>

      {featuredCompanies.length > 0 ? (
        <section className="section">
          <div className="container">
            <SectionHeader
              title="Featured Companies"
              description="The major AI labs and platforms shaping the industry."
            />
            <CardGrid
              items={featuredCompanies.map((company) => (
                <CompanyCard
                  key={company.slug}
                  company={company}
                  toolCount={toolCountByCompany(company.slug)}
                />
              ))}
            />
          </div>
        </section>
      ) : null}

      {popularCompanies.length > 0 ? (
        <section className="section">
          <div className="container">
            <SectionHeader
              title="Popular AI Companies"
              description="Companies with the most tools listed in our directory."
            />
            <CardGrid
              items={popularCompanies.map((company) => (
                <CompanyCard
                  key={company.slug}
                  company={company}
                  toolCount={toolCountByCompany(company.slug)}
                />
              ))}
            />
          </div>
        </section>
      ) : null}

      <NewsletterCTA />
    </>
  )
}
