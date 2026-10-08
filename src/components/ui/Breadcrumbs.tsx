import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import css from './Breadcrumbs.module.css'

interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={css.nav}>
      <ol className={css.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.label} className={css.item}>
              {item.to && !isLast ? (
                <Link to={item.to} className={css.link}>
                  {item.label}
                </Link>
              ) : (
                <span className={css.current} aria-current="page">
                  {item.label}
                </span>
              )}
              {isLast ? null : <ChevronRight size={14} className={css.sep} aria-hidden="true" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
