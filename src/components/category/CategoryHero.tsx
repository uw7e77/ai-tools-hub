import type { Category } from '../../types'
import { CategoryIcon } from '../ui/CategoryIcon'
import css from './CategoryHero.module.css'

interface CategoryHeroProps {
  category: Category
  toolCount: number
}

export function CategoryHero({ category, toolCount }: CategoryHeroProps) {
  return (
    <header className={css.hero}>
      <div className={css.icon}>
        <CategoryIcon name={category.icon} size={26} />
      </div>
      <div className={css.text}>
        <h1>{category.name}</h1>
        <p className={css.description}>{category.description}</p>
        <p className={css.count}>
          {toolCount} {toolCount === 1 ? 'tool' : 'tools'} catalogued
        </p>
      </div>
    </header>
  )
}
