import { ArrowRight, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TutorialCard } from '../components/cards/TutorialCard'
import { NewsletterCTA } from '../components/home/NewsletterCTA'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Button } from '../components/ui/Button'
import { CardGrid } from '../components/ui/CardGrid'
import { EmptyState } from '../components/ui/EmptyState'
import { SectionHeader } from '../components/ui/SectionHeader'
import { tutorials } from '../data/tutorials'
import { siteUrl } from '../data/site'
import { usePageMeta } from '../features/seo/usePageMeta'
import type { Difficulty, TutorialCategory, TutorialSlug, Tutorial } from '../types'
import { cx } from '../utils/cx'
import css from './TutorialsPage.module.css'

type SortKey = 'latest' | 'popular' | 'az'

const CATEGORIES: { value: TutorialCategory; label: string }[] = [
  { value: 'ai-basics', label: 'AI Basics' },
  { value: 'ai-tools', label: 'AI Tools' },
  { value: 'prompt-engineering', label: 'Prompt Engineering' },
  { value: 'coding', label: 'Coding' },
  { value: 'ai-agents', label: 'AI Agents' },
  { value: 'automation', label: 'Automation' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'generative-ai', label: 'Generative AI' },
]

const DIFFICULTIES: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'az', label: 'A–Z' },
]

const LEARNING_PATHS = [
  {
    id: 'prompt-smarter',
    title: 'Prompt Smarter',
    description: 'Get reliable, useful answers from AI — starting with what most people get wrong',
    steps: ['Fix common prompting mistakes', 'Stop hallucinations from fooling you', 'Make AI remember what matters'],
    tutorialSlugs: ['chatgpt-prompting-mistakes', 'hallucination-proofing', 'ai-memory-fix'] as TutorialSlug[],
  },
  {
    id: 'create-with-ai',
    title: 'Create with AI',
    description: 'Produce voice, images and video with AI tools, without wasting credits',
    steps: ['Fix robotic voice clones', 'Generate images faster in Midjourney', 'Save credits on AI video', 'Create your first image in ComfyUI'],
    tutorialSlugs: ['elevenlabs-voice-clone-fix', 'midjourney-fast-hours', 'ai-video-credit-saving', 'comfyui-first-image'] as TutorialSlug[],
  },
  {
    id: 'build-automate',
    title: 'Build & Automate',
    description: 'Automate workflows, code with AI safely and run models on your own machine',
    steps: ['Build your first n8n automation', 'Stop AI from breaking your code', 'Run LLMs locally with Ollama'],
    tutorialSlugs: ['n8n-first-automation', 'claude-code-cursor-anti-breakage', 'ollama-local-llms'] as TutorialSlug[],
  },
]
export default function TutorialsPage() {
  const [query, setQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<TutorialCategory[]>([])
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([])
  const [sort, setSort] = useState<SortKey>('latest')

  const normalizedQuery = query.trim().toLowerCase()

  const filtered = useMemo(() => {
    return tutorials.filter((tutorial) => {
      const matchesQuery =
        !normalizedQuery ||
        tutorial.title.toLowerCase().includes(normalizedQuery) ||
        tutorial.description.toLowerCase().includes(normalizedQuery) ||
        tutorial.category.toLowerCase().includes(normalizedQuery) ||
        tutorial.toolsUsed.some((t) => t.toLowerCase().includes(normalizedQuery))

      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(tutorial.category)
      const matchesDifficulty = selectedDifficulties.length === 0 || selectedDifficulties.includes(tutorial.difficulty)

      return matchesQuery && matchesCategory && matchesDifficulty
    })
  }, [normalizedQuery, selectedCategories, selectedDifficulties])

  const sorted = useMemo(() => {
    const list = [...filtered]
    switch (sort) {
      case 'popular':
        return list.sort((a, b) => (b.popular === a.popular ? 0 : b.popular ? 1 : -1))
      case 'az':
        return list.sort((a, b) => a.title.localeCompare(b.title))
      case 'latest':
      default:
        return list.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    }
  }, [filtered, sort])

  const featuredTutorial = useMemo(() => tutorials.find((t) => t.featured), [])
  const popularTutorials = useMemo(() => tutorials.filter((t) => t.popular).slice(0, 3), [])
  const latestTutorials = useMemo(
    () => [...tutorials].sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()).slice(0, 3),
    [],
  )

  const learningPathsWithTutorials = useMemo(() => {
    return LEARNING_PATHS.map((path) => ({
      ...path,
      tutorials: path.tutorialSlugs
        .map((slug) => tutorials.find((t) => t.slug === slug))
        .filter((t): t is Tutorial => t !== undefined),
    }))
  }, [])

  const hasActiveFilters = selectedCategories.length > 0 || selectedDifficulties.length > 0

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Tutorials', item: `${siteUrl}/tutorials` },
      ],
    }),
    [],
  )

  usePageMeta({
    title: 'AI Tutorials & Guides — Learn AI. Build Faster. | AIToolsHub',
    description:
      'Master AI with practical tutorials. Learn prompt engineering, build AI apps, automate workflows, and master tools like ChatGPT, Claude, Cursor, and more.',
    path: '/tutorials',
    jsonLd,
  })

  const toggleCategory = (category: TutorialCategory) => {
    setSelectedCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]))
  }

  const toggleDifficulty = (difficulty: Difficulty) => {
    setSelectedDifficulties((prev) => (prev.includes(difficulty) ? prev.filter((d) => d !== difficulty) : [...prev, difficulty]))
  }

  const clearFilters = () => {
    setQuery('')
    setSelectedCategories([])
    setSelectedDifficulties([])
  }

  const scrollToTutorials = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.getElementById('all-tutorials')?.scrollIntoView({ block: 'start' })
      return
    }
    document.getElementById('all-tutorials')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <section className={css.wrap}>
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Tutorials' }]} />

          <header className={css.hero}>
            <div className={css.heroContent}>
              <h1>Learn AI. Build Faster.</h1>
              <p className={css.lede}>
                Practical tutorials, guides, and workflows for mastering AI tools. From prompt
                engineering to building AI applications — level up your skills with step-by-step guides.
              </p>
            </div>
            <div className={css.searchCta}>
              <div className={css.searchField}>
                <Search size={18} className={css.searchIcon} aria-hidden="true" />
                <input
                  type="search"
                  className={css.searchInput}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tutorials…"
                  aria-label="Search tutorials"
                  autoComplete="off"
                />
              </div>
              <Button variant="primary" className={css.ctaButton} onClick={scrollToTutorials}>
                Start Learning
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </div>
          </header>

          <div className={css.toolbar}>
            <div className={css.filterGroup}>
              <span id="category-filter-label" className={css.filterLabel}>
                Category
              </span>
              <div className={css.pillRow} role="group" aria-labelledby="category-filter-label">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    className={cx(css.pill, selectedCategories.includes(cat.value) && css.pillActive)}
                    onClick={() => toggleCategory(cat.value)}
                    aria-pressed={selectedCategories.includes(cat.value)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <div className={cx(css.filterGroup, css.difficultyFilter)}>
              <span id="difficulty-filter-label" className={css.filterLabel}>
                Difficulty
              </span>
              <div className={css.pillRow} role="group" aria-labelledby="difficulty-filter-label">
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    className={cx(css.pill, selectedDifficulties.includes(diff) && css.pillActive)}
                    onClick={() => toggleDifficulty(diff)}
                    aria-pressed={selectedDifficulties.includes(diff)}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
            <div className={cx(css.filterGroup, css.sortFilter)}>
              <label htmlFor="sort-select" className={css.filterLabel}>
                Sort
              </label>
              <select
                id="sort-select"
                className={css.sortSelect}
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sort tutorials"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <p className={css.resultCount} role="status">
              {sorted.length} of {tutorials.length} tutorials
            </p>
            {hasActiveFilters || query ? (
              <Button variant="secondary" className={css.clearBtn} onClick={clearFilters}>
                Clear filters
              </Button>
            ) : null}
          </div>

          {featuredTutorial ? (
            <section className={css.featured}>
              <div className="container">
                <SectionHeader title="Featured Tutorial" />
                <TutorialCard tutorial={featuredTutorial} />
              </div>
            </section>
          ) : null}

          <section className={css.section} id="all-tutorials">
            <div className="container">
              <div className={css.toolbar}>
                <h2 className={css.sectionTitle}>All Tutorials</h2>
              </div>
              {sorted.length > 0 ? (
                <CardGrid items={sorted.map((tutorial) => <TutorialCard key={tutorial.slug} tutorial={tutorial} />)} />
              ) : (
                <EmptyState
                  title="No tutorials match your filters"
                  description="Try adjusting your search or filters."
                  action={<Button variant="secondary" onClick={clearFilters}>Clear all</Button>}
                />
              )}
            </div>
          </section>

          {popularTutorials.length > 0 ? (
            <section className={css.section}>
              <div className="container">
                <SectionHeader title="Popular Tutorials" description="Most read and shared guides" />
                <div className={css.popularGrid}>
                  {popularTutorials.map((tutorial) => (
                    <TutorialCard key={tutorial.slug} tutorial={tutorial} />
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {latestTutorials.length > 0 ? (
            <section className={css.section}>
              <div className="container">
                <SectionHeader title="Latest Tutorials" description="Freshly published guides" />
                <div className={css.popularGrid}>
                  {latestTutorials.map((tutorial) => (
                    <TutorialCard key={tutorial.slug} tutorial={tutorial} />
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          <section className={css.section}>
            <div className="container">
              <SectionHeader title="Learning Paths" description="Curated sequences to master a skill area" />
              <div className={css.pathsGrid}>
                {learningPathsWithTutorials.map((path) => (
                  <article key={path.id} className={css.pathCard}>
                    <h3 className={css.pathTitle}>{path.title}</h3>
                    <p className={css.pathDescription}>{path.description}</p>
                    <ol className={css.pathSteps}>
                      {path.steps.map((step, i) => (
                        <li key={step} className={css.pathStep}>
                          <span className={css.pathStepNumber}>{i + 1}</span>
                          <span className={css.pathStepText}>{step}</span>
                        </li>
                      ))}
                    </ol>
                    <div className={css.pathTutorials}>
                      {path.tutorials.map((tutorial) => (
                        <Link key={tutorial.slug} to={`/tutorial/${tutorial.slug}`} className={css.pathTutorialLink}>
                          {tutorial.title}
                        </Link>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <NewsletterCTA />
        </div>
      </section>
    </>
  )
}