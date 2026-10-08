import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import css from './SectionHeader.module.css'

interface SectionHeaderProps {
  title: string
  description?: string
  href?: string
  linkLabel?: string
}

export function SectionHeader({
  title,
  description,
  href,
  linkLabel = 'View all',
}: SectionHeaderProps) {
  return (
    <div className={css.header}>
      <div className={css.text}>
        <h2>{title}</h2>
        {description ? <p className={css.description}>{description}</p> : null}
      </div>
      {href ? (
        <Link className={css.link} to={href}>
          {linkLabel}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  )
}
