import { ArrowRight, Check, PlayCircle, ThumbsDown, ThumbsUp, Wrench } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AgentCard } from '../components/cards/AgentCard'
import { NewsletterCTA } from '../components/home/NewsletterCTA'
import { NewBadge, PricingBadge, TestedBadge } from '../components/ui/Badge'
import { BookmarkButton } from '../components/ui/BookmarkButton'
import { BrandLogo } from '../components/ui/BrandLogo'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { ButtonAnchor, ButtonLink } from '../components/ui/Button'
import { CardGrid } from '../components/ui/CardGrid'
import { EmptyState } from '../components/ui/EmptyState'
import { FaqAccordion } from '../components/ui/FaqAccordion'
import { agentDetails } from '../data/agentDetails'
import { agentBySlug } from '../data/lookups'
import { siteUrl } from '../data/site'
import { usePageMeta } from '../features/seo/usePageMeta'
import type { AgentSlug } from '../types'
import css from './AgentDetailPage.module.css'

const STEPS = ['Give Task', 'Agent Plans', 'Uses Tools', 'Executes', 'Returns Result']

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

export default function AgentDetailPage() {
  const { slug } = useParams()
  const agent = useMemo(() => (slug ? agentBySlug.get(slug as AgentSlug) : undefined), [slug])
  const detail = agent ? agentDetails[agent.slug] : undefined
  const alternatives = useMemo(() => {
    if (!agent || !detail?.alternatives) return []
    return detail.alternatives
      .map((altSlug) => agentBySlug.get(altSlug))
      .filter((a) => a !== undefined)
      .slice(0, 3)
  }, [agent, detail])

  const jsonLd = useMemo(() => {
    if (!agent) return undefined
    return [
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'AI Agents', item: `${siteUrl}/agents` },
        { '@type': 'ListItem', position: 3, name: agent.name, item: `${siteUrl}/agent/${agent.slug}` },
      ] },
      { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: agent.name, applicationCategory: 'AI Agent', description: agent.description, url: `${siteUrl}/agent/${agent.slug}` },
    ]
  }, [agent])

  usePageMeta({
    title: agent ? `${agent.name} — AI Agent Review & Capabilities | AIToolsHub` : 'Agent not found | AIToolsHub',
    description: agent ? agent.description : 'This AI agent could not be found on AIToolsHub.',
    path: `/agent/${slug ?? ''}`,
    jsonLd,
  })

  if (!agent) {
    return (
      <section className="section">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'AI Agents', to: '/agents' }]} />
          <EmptyState
            title="Agent not found"
            description="We couldn't find an AI agent at this address. It may have been renamed or the link may be broken."
            action={
              <ButtonLink variant="secondary" to="/agents">
                Browse all agents
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
              { label: 'AI Agents', to: '/agents' },
              { label: agent.name },
            ]}
          />
          <header className={css.hero}>
            <BrandLogo logo={agent.logo} name={agent.name} size={64} />
            <div className={css.heroBody}>
              <h1>{agent.name}</h1>
              <div className={css.badges}>
                {agent.tested ? <TestedBadge /> : null}
                {agent.isNew ? <NewBadge /> : null}
                <PricingBadge pricing={agent.pricing} />
                {agent.difficulty ? (
                  <span className={css.difficulty}>{agent.difficulty}</span>
                ) : null}
              </div>
              <p className={css.description}>{agent.description}</p>
              {detail?.verdict ? <p className={css.verdict}>{detail.verdict}</p> : null}
              <div className={css.actions}>
                <ButtonAnchor href={agent.officialUrl} target="_blank" rel="noopener noreferrer sponsored">
                  Try {agent.name}
                  <ArrowRight size={16} aria-hidden="true" />
                </ButtonAnchor>
                <BookmarkButton slug={agent.slug} name={agent.name} />
              </div>
            </div>
          </header>
        </div>
      </section>

      <div className="container">
        <div className={css.content}>
          {detail?.overview?.length ? (
            <section className={css.section}>
              <h2>Overview</h2>
              {detail.overview.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className={css.prose}>{paragraph}</p>
              ))}
            </section>
          ) : null}

          {agent.capabilities.length > 0 ? (
            <section className={css.section}>
              <h2>What Can This Agent Actually Do?</h2>
              <ul className={css.capabilities}>
                {agent.capabilities.map((cap) => (
                  <li key={cap}>
                    <Check size={18} aria-hidden="true" />
                    {cap}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {detail?.howItWorks?.length ? (
            <section className={css.section}>
              <h2>How It Works</h2>
              <div className={css.workflow}>
                {STEPS.map((step, i) => (
                  <div key={step} className={css.step}>
                    <span className={css.stepNumber}>{i + 1}</span>
                    <span className={css.stepLabel}>{step}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {detail?.integrations?.length ? (
            <section className={css.section}>
              <h2>
                <Wrench size={18} aria-hidden="true" />
                Tools &amp; Services
              </h2>
              <ul className={css.integrations}>
                {detail.integrations.map((item) => (
                  <li key={item} className={css.integration}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {agent.difficulty || detail?.difficultyExplanation ? (
            <section className={css.section}>
              <h2>Difficulty</h2>
              <div className={css.difficultyCard}>
                {agent.difficulty ? (
                  <span className={css.difficultyLevel}>{agent.difficulty}</span>
                ) : null}
                <p>{detail?.difficultyExplanation ?? 'Difficulty information is coming soon.'}</p>
              </div>
            </section>
          ) : null}

          <section className={css.section}>
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
              <p className={css.missing}>Pricing details for {agent.name} are coming soon.</p>
            )}
            <p className={css.priceNote}>Prices are indicative and change often — check the official site before subscribing.</p>
          </section>

          <section className={css.section}>
            <h2>Agent vs Chatbot</h2>
            <div className={css.tableWrap}>
              <table className={css.table}>
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">Chatbot</th>
                    <th scope="col">AI Agent</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Autonomy</th>
                    <td>Responds to prompts</td>
                    <td>Plans and acts independently</td>
                  </tr>
                  <tr>
                    <th scope="row">Planning</th>
                    <td>None</td>
                    <td>Breaks goals into steps</td>
                  </tr>
                  <tr>
                    <th scope="row">Tool usage</th>
                    <td>Limited or none</td>
                    <td>Browses, edits, executes code</td>
                  </tr>
                  <tr>
                    <th scope="row">Task execution</th>
                    <td>Suggests actions</td>
                    <td>Completes tasks end-to-end</td>
                  </tr>
                  <tr>
                    <th scope="row">Automation</th>
                    <td>Rule-based flows</td>
                    <td>Goal-driven workflows</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className={css.section}>
            <h2>Tutorial</h2>
            {detail?.tutorial ? (
              <div className={css.video}>
                <div className={css.videoPlaceholder} aria-hidden="true">
                  <PlayCircle size={48} />
                </div>
                <div className={css.videoMeta}>
                  <p className={css.videoTitle}>{detail.tutorial.title}</p>
                  <p className={css.videoDetail}>
                    {detail.tutorial.difficulty} · {detail.tutorial.durationMinutes} min
                  </p>
                  <ButtonAnchor href={agent.officialUrl} target="_blank" rel="noopener noreferrer" variant="secondary">
                    Open {agent.name}
                    <ArrowRight size={16} aria-hidden="true" />
                  </ButtonAnchor>
                </div>
              </div>
            ) : (
              <p className={css.missing}>A step-by-step {agent.name} walkthrough is coming soon.</p>
            )}
          </section>

          {detail?.pros?.length || detail?.cons?.length ? (
            <section className={css.section}>
              <h2>Pros &amp; Cons</h2>
              <div className={css.prosCons}>
                <div className={css.prosConsCard}>
                  <h3>Pros</h3>
                  <ul>
                    {detail.pros.map((item) => (
                      <li key={item}><Check size={16} aria-hidden="true" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div className={css.prosConsCard}>
                  <h3>Cons</h3>
                  <ul>
                    {detail.cons.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ) : null}

          {alternatives.length > 0 ? (
            <section className={css.section}>
              <h2>Alternatives to {agent.name}</h2>
              <CardGrid items={alternatives.map((a) => <AgentCard key={a.slug} agent={a} />)} />
            </section>
          ) : null}

          <HelpfulVote />

          {detail?.faq?.length ? (
            <section className={css.section}>
              <h2>Frequently asked questions</h2>
              <FaqAccordion items={detail.faq} />
            </section>
          ) : null}
        </div>
      </div>

      <NewsletterCTA />
    </>
  )
}
