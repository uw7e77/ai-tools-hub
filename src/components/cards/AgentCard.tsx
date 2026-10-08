import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Agent } from '../../types'
import { BrandLogo } from '../ui/BrandLogo'
import { ButtonLink } from '../ui/Button'
import { PricingBadge, TestedBadge } from '../ui/Badge'
import css from './AgentCard.module.css'

interface AgentCardProps {
  agent: Agent
}

export function AgentCard({ agent }: AgentCardProps) {
  const visibleCapabilities = agent.capabilities.slice(0, 4)

  return (
    <article className={css.card}>
      <div className={css.top}>
        <BrandLogo logo={agent.logo} name={agent.name} />
        <div className={css.heading}>
          <h3 className={css.title}>
            <Link to={`/agent/${agent.slug}`}>{agent.name}</Link>
          </h3>
          <p className={css.company}>{agent.company}</p>
        </div>
      </div>
      <p className={css.tagline}>{agent.tagline}</p>
      <ul className={css.capabilities}>
        {visibleCapabilities.map((capability) => (
          <li key={capability} className={css.capability}>
            <Check size={14} className={css.check} aria-hidden="true" />
            {capability}
          </li>
        ))}
      </ul>
      <div className={css.meta}>
        {agent.difficulty ? <span className={css.difficulty}>{agent.difficulty}</span> : null}
        <PricingBadge pricing={agent.pricing} />
        {agent.tested ? <TestedBadge /> : null}
      </div>
      <ButtonLink className={css.cta} variant="secondary" to={`/agent/${agent.slug}`}>
        View Agent
        <ArrowRight size={16} aria-hidden="true" />
      </ButtonLink>
    </article>
  )
}
