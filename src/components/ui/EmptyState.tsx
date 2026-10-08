import { SearchX } from 'lucide-react'
import type { ReactNode } from 'react'
import css from './EmptyState.module.css'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className={css.empty}>
      <div className={css.icon}>
        <SearchX size={20} aria-hidden="true" />
      </div>
      <h3 className={css.title}>{title}</h3>
      {description ? <p className={css.description}>{description}</p> : null}
      {action ? <div className={css.action}>{action}</div> : null}
    </div>
  )
}
