import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Tool } from '../../types'
import { BookmarkButton } from '../ui/BookmarkButton'
import { BrandLogo } from '../ui/BrandLogo'
import { ButtonLink } from '../ui/Button'
import { NewBadge, PricingBadge, TestedBadge } from '../ui/Badge'
import { Rating } from '../ui/Rating'
import css from './BestOverallCard.module.css'

interface BestOverallCardProps {
  tool: Tool
  note: string
}

export function BestOverallCard({ tool, note }: BestOverallCardProps) {
  return (
    <article className={css.card}>
      <BrandLogo logo={tool.logo} name={tool.name} size={64} />
      <div className={css.body}>
        <div className={css.badges}>
          {tool.tested ? <TestedBadge /> : null}
          {tool.isNew ? <NewBadge /> : null}
          <PricingBadge pricing={tool.pricing} />
        </div>
        <h3 className={css.name}>
          <Link to={`/tool/${tool.slug}`}>{tool.name}</Link>
        </h3>
        <p className={css.description}>{tool.shortDescription}</p>
        <div className={css.meta}>
          {tool.rating != null ? <Rating value={tool.rating} /> : null}
          {note ? <span className={css.note}>{note}</span> : null}
        </div>
      </div>
      <div className={css.actions}>
        <BookmarkButton slug={tool.slug} name={tool.name} />
        <ButtonLink to={`/tool/${tool.slug}`}>
          View Tool
          <ArrowRight size={16} aria-hidden="true" />
        </ButtonLink>
      </div>
    </article>
  )
}
