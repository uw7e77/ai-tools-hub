import { Link } from 'react-router-dom'
import type { Category } from '../../types'
import { CategoryIcon } from '../ui/CategoryIcon'
import css from './CategoryPill.module.css'

interface CategoryPillProps {
  category: Category
}

export function CategoryPill({ category }: CategoryPillProps) {
  return (
    <Link className={css.pill} to={`/category/${category.slug}`}>
      <CategoryIcon name={category.icon} size={16} className={css.icon} />
      {category.name}
    </Link>
  )
}
