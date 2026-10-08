import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categoryBySlug } from '../../data/lookups'
import type { Tool } from '../../types'
import { cx } from '../../utils/cx'
import { BookmarkButton } from '../ui/BookmarkButton'
import { BrandLogo } from '../ui/BrandLogo'
import { ButtonLink } from '../ui/Button'
import { NewBadge, PricingBadge, TestedBadge } from '../ui/Badge'
import { Rating } from '../ui/Rating'
import css from './ToolCard.module.css'

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  const category = categoryBySlug.get(tool.category)
  const visibleTags = tool.tags.slice(0, 2)

  return (
    <article className={css.card}>
      <div className={css.top}>
        <BrandLogo logo={tool.logo} name={tool.name} />
        <BookmarkButton slug={tool.slug} name={tool.name} />
      </div>
      <div className={css.titleRow}>
        <h3 className={css.title}>
          <Link to={`/tool/${tool.slug}`}>{tool.name}</Link>
        </h3>
        {tool.isNew ? <NewBadge /> : null}
        {tool.tested ? <TestedBadge /> : null}
      </div>
      <p className={css.description}>{tool.shortDescription}</p>
      <div className={css.meta}>
        {tool.rating != null ? (
          <>
            <Rating value={tool.rating} />
            <span className={css.dot} aria-hidden="true" />
          </>
        ) : null}
        <PricingBadge pricing={tool.pricing} />
      </div>
      <ul className={css.tags}>
        {category ? (
          <li>
            <Link className={cx(css.chip, css.chipCategory)} to={`/category/${category.slug}`}>
              {category.name}
            </Link>
          </li>
        ) : null}
        {visibleTags.map((tag) => (
          <li key={tag} className={css.chip}>
            {tag}
          </li>
        ))}
      </ul>
      <ButtonLink className={css.cta} variant="secondary" to={`/tool/${tool.slug}`}>
        View Tool
        <ArrowRight size={16} aria-hidden="true" />
      </ButtonLink>
    </article>
  )
}
