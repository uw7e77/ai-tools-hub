import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toolCountByCategory } from '../../data/lookups'
import type { Category } from '../../types'
import { PopularBadge } from '../ui/Badge'
import { CategoryIcon } from '../ui/CategoryIcon'
import css from './CategoryCard.module.css'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const count = toolCountByCategory.get(category.slug) ?? 0

  return (
    <Link to={`/category/${category.slug}`} className={css.card}>
      <div className={css.top}>
        <span className={css.icon}>
          <CategoryIcon name={category.icon} size={22} />
        </span>
        {category.featured ? <PopularBadge /> : null}
      </div>
      <div className={css.body}>
        <h3 className={css.name}>{category.name}</h3>
        <p className={css.description}>{category.description}</p>
      </div>
      <div className={css.footer}>
        <span className={css.count}>
          {count === 0 ? 'No tools yet' : `${count} ${count === 1 ? 'tool' : 'tools'}`}
        </span>
        <ArrowRight size={16} className={css.arrow} aria-hidden="true" />
      </div>
    </Link>
  )
}
