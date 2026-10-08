import { ArrowRight, Check, MonitorSmartphone, PlayCircle, ThumbsDown, ThumbsUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ToolCard } from '../components/cards/ToolCard'
import { NewsletterCTA } from '../components/home/NewsletterCTA'
import { NewBadge, PricingBadge, TestedBadge } from '../components/ui/Badge'
import { BookmarkButton } from '../components/ui/BookmarkButton'
import { BrandLogo } from '../components/ui/BrandLogo'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { ButtonAnchor, ButtonLink } from '../components/ui/Button'
import { CardGrid } from '../components/ui/CardGrid'
import { EmptyState } from '../components/ui/EmptyState'
import { FaqAccordion } from '../components/ui/FaqAccordion'
import { Rating } from '../components/ui/Rating'
import { categoryBySlug, companyByName, normalizeCompanyName, toolBySlug } from '../data/lookups'
import { siteUrl } from '../data/site'
import { toolDetails } from '../data/toolDetails'
import { tutorials } from '../data/tutorials'
import { toolVideoBySlug } from '../data/toolVideos'
import { getCategoryTools, PRICING_LABELS, sortTools } from '../features/category/listing'
import { usePageMeta } from '../features/seo/usePageMeta'
import type { ToolSlug } from '../types'
import { cx } from '../utils/cx'
import css from './ToolPage.module.css'

const reviewCountFormatter = new Intl.NumberFormat('en-US')
const testedDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'pros-cons', label: 'Pros & Cons' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'tutorial', label: 'Tutorial' },
  { id: 'alternatives', label: 'Alternatives' },
  { id: 'faq', label: 'FAQ' },
] as const

function formatTestedDate(isoDate: string): string {
  return testedDateFormatter.format(new Date(`${isoDate}T00:00:00`))
}

function HelpfulVote() {
  const [vote, setVote] = useState<'up' | 'down' | null>(null)

  return (
    <div className={css.vote}>
      <span className={css.voteQuestion}>{vote ? 'Thanks for your feedback.' : 'Helpful?'}</span>
      <div className={css.voteButtons}>
        <button
          type="button"
          className={vote === 'up' ? css.voteActive : undefined}
          aria-label="Yes, this review was helpful"
          aria-pressed={vote === 'up'}
          disabled={vote !== null}
          onClick={() => setVote('up')}
        >
          <ThumbsUp size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={vote === 'down' ? css.voteActive : undefined}
          aria-label="No, this review was not helpful"
          aria-pressed={vote === 'down'}
          disabled={vote !== null}
          onClick={() => setVote('down')}
        >
          <ThumbsDown size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default function ToolPage() {
  const { slug } = useParams()
  const tool = useMemo(() => (slug ? toolBySlug.get(slug as ToolSlug) : undefined), [slug])
  const detail = tool ? toolDetails[tool.slug] : undefined
  const category = tool ? categoryBySlug.get(tool.category) : undefined
  // tool.company is free text from the DB (a company name, not a slug) — the
  // "About company" section only renders when it resolves to one of the 24
  // curated company profiles via a case-insensitive name match.
  const company =
    tool?.company != null ? companyByName.get(normalizeCompanyName(tool.company)) : undefined
  const tutorial = useMemo(
    () => (tool ? tutorials.find((item) => item.toolsUsed.includes(tool.slug)) : undefined),
    [tool],
  )
  const toolVideo = tool ? toolVideoBySlug.get(tool.slug) : undefined
  const related = useMemo(() => {
    if (!tool || !category) return []
    return sortTools(
      getCategoryTools(category.slug).filter((item) => item.slug !== tool.slug),
      'trending',
    ).slice(0, 4)
  }, [tool, category])
  const featuredSidebar = useMemo(() => {
    if (!tool || !category) return []
    const pool = getCategoryTools(category.slug).filter((item) => item.slug !== tool.slug)
    const featured = pool
      .filter((item) => item.featuredRank != null)
      .sort((a, b) => (a.featuredRank ?? 0) - (b.featuredRank ?? 0))
    const rest = pool.filter((item) => item.featuredRank == null)
    return [...featured, ...rest].slice(0, 3)
  }, [tool, category])

  const jsonLd = useMemo(() => {
    if (!tool) return undefined
    const itemListElement: object[] = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: `${siteUrl}/categories` },
    ]
    if (category) {
      itemListElement.push({
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `${siteUrl}/category/${category.slug}`,
      })
    }
    itemListElement.push({
      '@type': 'ListItem',
      position: itemListElement.length + 1,
      name: tool.name,
      item: `${siteUrl}/tool/${tool.slug}`,
    })
    return [
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement },
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: tool.name,
        applicationCategory: category?.name ?? 'AI Tool',
        description: tool.shortDescription,
        url: `${siteUrl}/tool/${tool.slug}`,
        // Only emit aggregateRating when we genuinely have verified figures.
        ...(tool.tested && tool.rating != null && tool.reviewCount != null
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: tool.rating,
                reviewCount: tool.reviewCount,
              },
            }
          : {}),
      },
    ]
  }, [tool, category])

  usePageMeta({
    title: tool
      ? `${tool.name} Review: Features, Pricing & Alternatives | AIToolsHub`
      : 'Tool not found | AIToolsHub',
    description: tool
      ? tool.rating != null && tool.reviewCount != null
        ? `${tool.shortDescription} Rated ${tool.rating.toFixed(1)}/5 from ${reviewCountFormatter.format(tool.reviewCount)} reviews on AIToolsHub.`
        : `${tool.shortDescription} Listed on AIToolsHub.`
      : 'This tool could not be found on AIToolsHub.',
    path: `/tool/${slug ?? ''}`,
    jsonLd,
  })

  if (!tool) {
    return (
      <section className="section">
        <div className="container">
          <Breadcrumbs
            items={[{ label: 'Home', to: '/' }, { label: 'Categories', to: '/categories' }]}
          />
          <EmptyState
            title="Tool not found"
            description="We couldn't find a tool at this address. It may have been renamed or the link may be broken."
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

  return (
    <>
      <section className="section">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Categories', to: '/categories' },
              ...(category ? [{ label: category.name, to: `/category/${category.slug}` }] : []),
              { label: tool.name },
            ]}
          />
          <div className={css.layout}>
            <div className={css.main}>
              <header className={css.hero}>
                <BrandLogo logo={tool.logo} name={tool.name} size={64} />
                <div className={css.heroBody}>
                  <h1>{tool.name}</h1>
                  <div className={css.badges}>
                    {tool.tested ? <TestedBadge /> : null}
                    {tool.isNew ? <NewBadge /> : null}
                    <PricingBadge pricing={tool.pricing} />
                    {tool.rating != null ? (
                      <span className={css.heroRating}>
                        <Rating value={tool.rating} />
                        {tool.reviewCount != null ? (
                          <span className={css.heroReviewCount}>
                            {reviewCountFormatter.format(tool.reviewCount)} reviews
                          </span>
                        ) : null}
                      </span>
                    ) : null}
                  </div>
                  <p className={css.description}>{tool.shortDescription}</p>
                  {detail ? <p className={css.verdict}>{detail.verdict}</p> : null}
                  <div className={css.actions}>
                    <ButtonAnchor
                      href={tool.affiliateUrl ?? tool.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                    >
                      Try {tool.name}
                      <ArrowRight size={16} aria-hidden="true" />
                    </ButtonAnchor>
                    <BookmarkButton slug={tool.slug} name={tool.name} />
                  </div>
                  <p className={css.affiliateNote}>
                    Affiliate disclosure: the &ldquo;Try&rdquo; button may earn us a commission. It
                    never affects our ratings or verdicts.
                  </p>
                </div>
              </header>
            </div>
            <aside className={css.facts}>
              <h2 className={css.factsTitle}>Quick facts</h2>
              <dl className={css.factList}>
                {category ? (
                  <div className={css.fact}>
                    <dt>Category</dt>
                    <dd>
                      <Link className={css.factLink} to={`/category/${category.slug}`}>
                        {category.name}
                      </Link>
                    </dd>
                  </div>
                ) : null}
                {tool.company ? (
                  <div className={css.fact}>
                    <dt>Company</dt>
                    <dd>
                      {company ? (
                        <Link className={css.factLink} to={`/company/${company.slug}`}>
                          {company.name}
                        </Link>
                      ) : (
                        tool.company
                      )}
                    </dd>
                  </div>
                ) : null}
                {tool.pricing ? (
                  <div className={css.fact}>
                    <dt>Pricing</dt>
                    <dd>{PRICING_LABELS[tool.pricing]}</dd>
                  </div>
                ) : null}
                {tool.rating != null ? (
                  <div className={css.fact}>
                    <dt>Rating</dt>
                    <dd className={css.factRating}>
                      <Rating value={tool.rating} />
                      {tool.reviewCount != null ? (
                        <span>{reviewCountFormatter.format(tool.reviewCount)} reviews</span>
                      ) : null}
                    </dd>
                  </div>
                ) : null}
                {tool.platforms.length > 0 ? (
                  <div className={css.fact}>
                    <dt>Platforms</dt>
                    <dd>{tool.platforms.join(' · ')}</dd>
                  </div>
                ) : null}
                {tool.tags.length > 0 ? (
                  <div className={css.fact}>
                    <dt>Tags</dt>
                    <dd>{tool.tags.join(' · ')}</dd>
                  </div>
                ) : null}
                <div className={css.fact}>
                  <dt>Tested</dt>
                  <dd>
                    {tool.tested && tool.testedDate
                      ? `Last tested ${formatTestedDate(tool.testedDate)}`
                      : 'Not tested yet'}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <nav className={css.tabs} aria-label="Tool sections">
        <div className={cx('container', css.tabList)}>
          {TABS.map((tab) => (
            <a key={tab.id} className={css.tab} href={`#${tab.id}`}>
              {tab.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="container">
        <div className={css.contentWrap}>
          <div className={css.content}>
          <section id="overview" className={css.section}>
            <h2>What is {tool.name}?</h2>
            {detail?.overview?.length ? (
              detail.overview.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className={css.prose}>
                  {paragraph}
                </p>
              ))
            ) : (
              <p className={css.missing}>Our full overview for {tool.name} is coming soon.</p>
            )}
            {detail?.bestFor ? (
              <p className={css.bestFor}>
                <strong>Best for:</strong> {detail.bestFor}
              </p>
            ) : null}
          </section>

          <section id="features" className={css.section}>
            <h2>Key features</h2>
            {detail?.features?.length ? (
              <ul className={css.features}>
                {detail.features.map((item) => (
                  <li key={item}>
                    <Check size={18} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={css.missing}>Feature details for {tool.name} are being verified.</p>
            )}
          </section>

          {detail?.pros?.length || detail?.cons?.length ? (
            <section id="pros-cons" className={css.section}>
              {detail.pros.length > 0 ? (
                <>
                  <h2>Pros</h2>
                  <ul className={css.prosList}>
                    {detail.pros.map((item) => (
                      <li key={item}>
                        <Check size={18} aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {detail.cons.length > 0 ? (
                <>
                  <h2 className={css.consHeading}>Cons</h2>
                  <ul className={css.consList}>
                    {detail.cons.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>
          ) : null}

          <section id="pricing" className={css.section}>
            <h2>Pricing</h2>
            {detail?.pricingTiers?.length ? (
              <div className={css.tableWrap}>
                <table className={css.table}>
                  <thead>
                    <tr>
                      <th scope="col">Plan</th>
                      <th scope="col">Price</th>
                      <th scope="col">What you get</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.pricingTiers.map((tier) => (
                      <tr key={tier.name}>
                        <th scope="row">{tier.name}</th>
                        <td>{tier.price}</td>
                        <td>{tier.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={css.missing}>Pricing details for {tool.name} are coming soon.</p>
            )}
            <p className={css.priceNote}>
              Prices are indicative and change often — check the official site before subscribing.
            </p>
            <div className={css.availability}>
              <h3>
                <MonitorSmartphone size={18} aria-hidden="true" />
                Platforms &amp; Pakistan availability
              </h3>
              <p>
                <strong>Platforms:</strong> {tool.platforms.join(', ')}
              </p>
              <p>{detail?.pakistanAvailability ?? 'Availability details for Pakistan are coming soon.'}</p>
            </div>
          </section>

          <section id="tutorial" className={css.section}>
            <h2>Tutorial</h2>
            {toolVideo ? (
              <div className={css.videoEmbed}>
                <div className={css.videoFrame}>
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${toolVideo.youtubeId}`}
                    title={`${toolVideo.title} — YouTube tutorial`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className={css.videoCaption}>
                  {toolVideo.title}
                  {toolVideo.channel ? ` — by ${toolVideo.channel} on YouTube` : ' — on YouTube'}
                </p>
              </div>
            ) : null}
            <div className={css.video}>
              <div className={css.videoPlaceholder} aria-hidden="true">
                <PlayCircle size={48} />
              </div>
              <div className={css.videoMeta}>
                {tutorial ? (
                  <>
                    <p className={css.videoTitle}>
                      <Link className={css.videoLink} to={`/tutorial/${tutorial.slug}`}>
                        {tutorial.title}
                      </Link>
                    </p>
                    <p className={css.videoDetail}>
                      {tutorial.difficulty} · {tutorial.durationMinutes} min · {tutorial.category}
                    </p>
                  </>
                ) : (
                  <p className={css.videoTitle}>A step-by-step {tool.name} walkthrough is coming soon.</p>
                )}
                {tutorial ? (
                  <ButtonLink to={`/tutorial/${tutorial.slug}`}>
                    Open tutorial
                    <ArrowRight size={16} aria-hidden="true" />
                  </ButtonLink>
                ) : null}
                <ButtonAnchor
                  href={tool.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                >
                  Open {tool.name}
                  <ArrowRight size={16} aria-hidden="true" />
                </ButtonAnchor>
              </div>
            </div>
          </section>

          <section id="alternatives" className={css.section}>
            <h2>Alternatives to {tool.name}</h2>
            {related.length > 0 ? (
              <CardGrid
                columns={4}
                items={related.map((item) => (
                  <ToolCard key={item.slug} tool={item} />
                ))}
              />
            ) : (
              <p className={css.missing}>No comparable tools catalogued yet.</p>
            )}
            {category ? (
              <p className={css.moreLink}>
                <Link to={`/category/${category.slug}`}>
                  More in {category.name} <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </p>
            ) : null}
          </section>

          {company ? (
            <section className={css.section}>
              <h2>About {company.name}</h2>
              <div className={css.company}>
                <BrandLogo logo={company.logo} name={company.name} size={48} />
                <div>
                  <p className={css.companyName}>
                    <Link className={css.companyLink} to={`/company/${company.slug}`}>
                      {company.name}
                    </Link>
                  </p>
                  {company.mission ? (
                    <p className={css.companyMission}>{company.mission}</p>
                  ) : null}
                  {company.founded != null || company.hq ? (
                    <p className={css.companyMeta}>
                      {company.founded != null ? `Founded ${company.founded}` : null}
                      {company.founded != null && company.hq ? ' · ' : null}
                      {company.hq ?? ''}
                    </p>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}

          <HelpfulVote />

          <section id="faq" className={css.section}>
            <h2>Frequently asked questions</h2>
            {detail?.faq?.length ? (
              <FaqAccordion items={detail.faq} />
            ) : (
              <p className={css.missing}>FAQs for {tool.name} are coming soon.</p>
            )}
          </section>
          </div>
          {featuredSidebar.length > 0 ? (
            <aside className={css.sidebar} aria-label="Featured tools">
              <h2 className={css.sidebarTitle}>Featured tools</h2>
              <ul className={css.sidebarList}>
                {featuredSidebar.map((item) => (
                  <li key={item.slug}>
                    <Link to={`/tool/${item.slug}`} className={css.sidebarCard}>
                      <BrandLogo logo={item.logo} name={item.name} size={40} />
                      <span className={css.sidebarCardBody}>
                        <span className={css.sidebarCardName}>{item.name}</span>
                        <span className={css.sidebarCardDesc}>{item.shortDescription}</span>
                      </span>
                      <PricingBadge pricing={item.pricing} />
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
      </div>

      <NewsletterCTA />
    </>
  )
}
