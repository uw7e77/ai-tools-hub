import { TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import css from './ErrorState.module.css'

interface ErrorStateProps {
  title: string
  description?: string
  action?: ReactNode
}

export function ErrorState({ title, description, action }: ErrorStateProps) {
  return (
    <div className={css.error} role="alert">
      <div className={css.icon}>
        <TriangleAlert size={20} aria-hidden="true" />
      </div>
      <h3 className={css.title}>{title}</h3>
      {description ? <p className={css.description}>{description}</p> : null}
      {action ? <div className={css.action}>{action}</div> : null}
    </div>
  )
}
