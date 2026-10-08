import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CategoryCard } from '../components/categories/CategoryCard'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Button } from '../components/ui/Button'
import { CardGrid } from '../components/ui/CardGrid'
import { EmptyState } from '../components/ui/EmptyState'
import { categories } from '../data/categories'
import { totalToolCount } from '../data/lookups'
import { siteUrl } from '../data/site'
import { usePageMeta } from '../features/seo/usePageMeta'
import css from './CategoriesPage.module.css'

export default function CategoriesPage() {
  const [query, setQuery] = useState('')
  const normalized = query.trim().toLowerCase()

  const visibleCategories = useMemo(() => {
    if (!normalized) return categories
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(normalized) ||
        category.description.toLowerCase().includes(normalized),
    )
  }, [normalized])

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Categories', item: `${siteUrl}/categories` },
      ],
    }),
    [],
  )

  usePageMeta({
    title: 'AI Tool Categories — Browse Tools by Use Case | AIToolsHub',
    description: `Browse all ${categories.length} AI tool categories — Productivity, Writing & Content, Image & Design, Video & Audio, Coding & Development, Marketing & Sales, Business & Data, Education & Learning, Automation & Agents, Lifestyle and Security. Compare ${totalToolCount} tools by use case on AIToolsHub.`,
    path: '/categories',
    jsonLd,
  })

  return (
    <section className={css.wrap}>
      <div className="container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} />

        <header className={css.header}>
          <h1>Explore AI Tool Categories</h1>
          <p className={css.lede}>
            Browse {totalToolCount} tools across {categories.length} categories — from AI
            chatbots and image generators to coding assistants and automation agents.
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
              placeholder="Search categories…"
              aria-label="Search categories"
              autoComplete="off"
            />
          </div>
          <p className={css.resultCount} role="status">
            {visibleCategories.length} of {categories.length} categories
          </p>
        </div>

        {visibleCategories.length > 0 ? (
          <CardGrid
            columns={3}
            items={visibleCategories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          />
        ) : (
          <EmptyState
            title="No categories match your search"
            description={`Nothing found for “${query.trim()}”. Try a different keyword — video, coding, design or agents.`}
            action={
              <Button variant="secondary" onClick={() => setQuery('')}>
                Clear search
              </Button>
            }
          />
        )}
      </div>
    </section>
  )
}
