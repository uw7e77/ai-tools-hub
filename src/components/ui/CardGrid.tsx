import type { ReactNode } from 'react'
import css from './CardGrid.module.css'

interface CardGridProps {
  items: ReactNode[]
  columns?: 3 | 4
}

export function CardGrid({ items, columns = 3 }: CardGridProps) {
  return (
    <ul className={css.grid} data-columns={columns}>
      {items.map((item, index) => (
        <li key={index} className={css.item}>
          {item}
        </li>
      ))}
    </ul>
  )
}
