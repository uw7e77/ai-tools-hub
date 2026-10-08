import { ArrowRight, BookOpen, Calendar, Clock, ListOrdered, Wrench } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ToolCard } from '../components/cards/ToolCard'
import { TutorialCard } from '../components/cards/TutorialCard'
import { NewsletterCTA } from '../components/home/NewsletterCTA'
import { BookmarkButton } from '../components/ui/BookmarkButton'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { ButtonLink } from '../components/ui/Button'
import { CardGrid } from '../components/ui/CardGrid'
import { EmptyState } from '../components/ui/EmptyState'
import { FaqAccordion } from '../components/ui/FaqAccordion'
import { MarkdownBlocks } from '../components/tutorial/Markdown'
import { parseMarkdown, type AffiliateLink } from '../components/tutorial/markdownParser'
import { ReadingProgress } from '../components/tutorial/ReadingProgress'
import { ShareButton } from '../components/tutorial/ShareButton'
import { TableOfContents } from '../components/tutorial/TableOfContents'
import { tutorialCategoryLabel } from '../components/tutorial/categoryLabels'
import { toolBySlug, tutorialBySlug } from '../data/lookups'
import { tutorials as allTutorials } from '../data/tutorials'
import { usePageMeta } from '../features/seo/usePageMeta'
import type { Tutorial } from '../types'
import { cx } from '../utils/cx'
import css from './TutorialDetailPage.module.css'

function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function youTubeEmbedId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?[^#]*v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/)
  return match ? match[1] : null
}

function HeroMedia({ tutorial }: { tutorial: Tutorial }) {
  const videoId = tutorial.video?.url ? youTubeEmbedId(tutorial.video.url) : null
  if (videoId) {
    return (
      <div className={css.heroMedia}>
        <iframe
          className={css.heroVideo}
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={tutorial.video?.title ?? `${tutorial.title} — video tutorial`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
        {tutorial.video?.title && <p className={css.mediaCaption}>{tutorial.video.title}</p>}
      </div>
    )
  }
  if (tutorial.thumbnail) {
    return (
      <figure className={css.heroMedia}>
        <img src={tutorial.thumbnail} alt="" className={css.heroImage} loading="eager" />
      </figure>
    )
  }
  return (
    <div className={css.heroMedia} aria-hidden="true">
      <div className={css.heroArt}>
        <BookOpen size={56} className={css.heroArtIcon} />
        <span className={css.heroArtLabel}>{tutorialCategoryLabel(tutorial.category)}</span>
      </div>
    </div>
  )
}

export default function TutorialDetailPage() {
  const { slug } = useParams()
  const tutorial = useMemo(() => (slug ? tutorialBySlug.get(slug) : undefined), [slug])
  const articleRef = useRef<HTMLElement>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  // Reset scroll-spy state when navigating between tutorials (render-time
  // adjustment — the documented pattern for syncing state to new props).
  const [lastSlug, setLastSlug] = useState(slug)
  if (slug !== lastSlug) {
    setLastSlug(slug)
    setActiveId(null)
  }

  const affiliate: AffiliateLink | null = useMemo(() => {
    if (!tutorial) return null
    const firstToolSlug = tutorial.toolsUsed[0]
    const tool = firstToolSlug ? toolBySlug.get(firstToolSlug) : undefined
    if (!tool) return null
    return { href: tool.affiliateUrl ?? tool.officialUrl, label: `Try ${tool.name}` }
  }, [tutorial])

  const { blocks, toc } = useMemo(
    () => (tutorial?.content ? parseMarkdown(tutorial.content) : { blocks: [], toc: [] }),
    [tutorial],
  )

  const tutorialTools = useMemo(
    () =>
      tutorial
        ? tutorial.toolsUsed
            .map((toolSlug) => toolBySlug.get(toolSlug))
            .filter((tool): tool is NonNullable<typeof tool> => tool !== undefined)
        : [],
    [tutorial],
  )

  const relatedTutorials = useMemo(() => {
    if (!tutorial) return []
    const others = allTutorials.filter((t) => t.slug !== tutorial.slug)
    const sameCategory = others.filter((t) => t.category === tutorial.category)
    const rest = others.filter((t) => t.category !== tutorial.category)
    return [...sameCategory, ...rest].slice(0, 4)
  }, [tutorial])

  const nextTutorial = useMemo(() => {
    if (!tutorial) return null
    const fromRelated = tutorial.relatedTutorials.map((s) => tutorialBySlug.get(s)).find((t) => t !== undefined)
    return fromRelated ?? relatedTutorials[0] ?? null
  }, [tutorial, relatedTutorials])

  /* Scroll-spy for the table of contents. */
  useEffect(() => {
    const root = articleRef.current
    if (!root || toc.length === 0) return
    const headings = Array.from(root.querySelectorAll<HTMLElement>('[data-toc-id]'))
    if (headings.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.getAttribute('data-toc-id'))
        }
      },
      { rootMargin: '-90px 0px -70% 0px', threshold: 0 },
    )
    headings.forEach((heading) => observer.observe(heading))
    return () => observer.disconnect()
  }, [slug, toc.length])

  /* Reading progress, measured against the article column. */
  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = Math.max(rect.height - window.innerHeight * 0.6, 1)
      const done = Math.min(Math.max(-rect.top + window.innerHeight * 0.2, 0), total)
      setProgress((done / total) * 100)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [slug])

  const jsonLd = useMemo(() => {
    if (!tutorial) return undefined
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: tutorial.title,
      description: tutorial.description,
      datePublished: tutorial.publishedDate,
      ...(tutorial.updatedDate ? { dateModified: tutorial.updatedDate } : {}),
      author: tutorial.author ? { '@type': 'Person', name: tutorial.author } : { '@type': 'Organization', name: 'AIToolsHub' },
    }
  }, [tutorial])

  usePageMeta({
    title: tutorial ? `${tutorial.title} — Tutorial | AIToolsHub` : 'Tutorial not found | AIToolsHub',
    description: tutorial ? tutorial.description : 'This tutorial could not be found on AIToolsHub.',
    path: `/tutorial/${slug ?? ''}`,
    jsonLd,
  })

  if (!tutorial) {
    return (
      <section className="section">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Tutorials', to: '/tutorials' }]} />
          <EmptyState
            title="Tutorial not found"
            description="We couldn't find a tutorial at this address. It may have been renamed or the link may be broken."
            action={
              <ButtonLink variant="secondary" to="/tutorials">
                Browse all tutorials
              </ButtonLink>
            }
          />
        </div>
      </section>
    )
  }

  const categoryLabel = tutorialCategoryLabel(tutorial.category)

  return (
    <>
      <ReadingProgress progress={progress} />

      <div className={css.wrap}>
        <div className="container">
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Tutorials', to: '/tutorials' },
              { label: categoryLabel, to: '/tutorials' },
              { label: tutorial.title },
            ]}
          />

          <header className={css.hero}>
            <div className={css.badgeRow}>
              <span className={css.categoryBadge}>{categoryLabel}</span>
              <span className={css.difficultyBadge}>{tutorial.difficulty}</span>
            </div>
            <h1 className={css.title}>{tutorial.title}</h1>
            <p className={css.description}>{tutorial.description}</p>
            <div className={css.meta}>
              {tutorial.author && (
                <span className={css.metaItem}>
                  <span className={css.metaLabel}>By</span> {tutorial.author}
                </span>
              )}
              <span className={css.metaItem}>
                <Calendar size={14} aria-hidden="true" />
                <time dateTime={tutorial.publishedDate}>Published {formatDate(tutorial.publishedDate)}</time>
              </span>
              {tutorial.updatedDate && (
                <span className={css.metaItem}>
                  <Calendar size={14} aria-hidden="true" />
                  <time dateTime={tutorial.updatedDate}>Updated {formatDate(tutorial.updatedDate)}</time>
                </span>
              )}
              <span className={css.metaItem}>
                <Clock size={14} aria-hidden="true" />
                {tutorial.durationMinutes} min read
              </span>
            </div>
            <div className={css.actions}>
              <BookmarkButton slug={tutorial.slug} name={tutorial.title} />
              <ShareButton title={tutorial.title} />
            </div>
          </header>

          <HeroMedia tutorial={tutorial} />

          {toc.length > 0 && (
            <details className={css.chapterDrawer}>
              <summary className={css.chapterSummary}>
                <ListOrdered size={16} aria-hidden="true" />
                Chapters ({toc.filter((e) => e.level === 2).length})
              </summary>
              <ol className={css.chapterList}>
                {toc.map((entry) => (
                  <li key={entry.id} className={cx(css.chapterItem, entry.level === 3 && css.chapterSub)}>
                    <a href={`#${entry.id}`}>{entry.title}</a>
                  </li>
                ))}
              </ol>
            </details>
          )}

          <div className={cx(css.layout, toc.length === 0 && css.layoutNoToc)}>
            {toc.length > 0 ? (
              <aside className={css.tocCol} aria-label="On this page">
                <TableOfContents entries={toc} activeId={activeId} />
              </aside>
            ) : null}

            <article ref={articleRef} className={css.article} aria-label={tutorial.title}>
              {blocks.length > 0 ? (
                <MarkdownBlocks blocks={blocks} affiliate={affiliate} />
              ) : (
                <p className={css.emptyArticle}>The full article text for this tutorial is being prepared.</p>
              )}
            </article>

            <aside className={css.rail} aria-label="Key info">
              {tutorialTools.length > 0 && (
                <section className={css.railCard} aria-labelledby="tools-used-heading">
                  <h2 id="tools-used-heading" className={css.railTitle}>
                    <Wrench size={16} aria-hidden="true" />
                    Tools used
                  </h2>
                  <div className={css.toolsStack}>
                    {tutorialTools.map((tool) => (
                      <ToolCard key={tool.slug} tool={tool} />
                    ))}
                  </div>
                </section>
              )}

              <section className={css.railCard} aria-labelledby="tutorial-info-heading">
                <h2 id="tutorial-info-heading" className={css.railTitle}>
                  Tutorial info
                </h2>
                <dl className={css.infoList}>
                  <div className={css.infoItem}>
                    <dt>Difficulty</dt>
                    <dd>{tutorial.difficulty}</dd>
                  </div>
                  <div className={css.infoItem}>
                    <dt>Reading time</dt>
                    <dd>{tutorial.durationMinutes} min</dd>
                  </div>
                  <div className={css.infoItem}>
                    <dt>Category</dt>
                    <dd>{categoryLabel}</dd>
                  </div>
                  <div className={css.infoItem}>
                    <dt>Published</dt>
                    <dd>
                      <time dateTime={tutorial.publishedDate}>{formatDate(tutorial.publishedDate)}</time>
                    </dd>
                  </div>
                  {tutorialTools.length > 0 && (
                    <div className={css.infoItem}>
                      <dt>Tools covered</dt>
                      <dd>{tutorialTools.length}</dd>
                    </div>
                  )}
                </dl>
              </section>
            </aside>
          </div>

          {tutorial.faq.length > 0 && (
            <section className={css.faqSection} aria-labelledby="faq-heading">
              <h2 id="faq-heading" className={css.sectionTitle}>
                Frequently asked questions
              </h2>
              <div className={css.faqWrap}>
                <FaqAccordion items={tutorial.faq} />
              </div>
            </section>
          )}

          {relatedTutorials.length > 0 && (
            <section className={css.relatedSection} aria-labelledby="related-heading">
              <h2 id="related-heading" className={css.sectionTitle}>
                Related tutorials
              </h2>
              <CardGrid items={relatedTutorials.map((t) => <TutorialCard key={t.slug} tutorial={t} />)} />
            </section>
          )}

          {nextTutorial && (
            <section className={css.nextStep} aria-labelledby="next-heading">
              <div className={css.nextStepInner}>
                <div>
                  <p className={css.nextStepLabel}>Ready for the next tutorial?</p>
                  <h2 id="next-heading" className={css.nextStepTitle}>
                    {nextTutorial.title}
                  </h2>
                </div>
                <ButtonLink variant="primary" to={`/tutorial/${nextTutorial.slug}`} className={css.nextStepBtn}>
                  Next tutorial
                  <ArrowRight size={16} aria-hidden="true" />
                </ButtonLink>
              </div>
            </section>
          )}
        </div>
      </div>

      <NewsletterCTA />
    </>
  )
}
