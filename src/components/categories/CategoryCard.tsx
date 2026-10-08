import { ArrowRight } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { toolCountByCategory } from '../../data/lookups'
import type { Category } from '../../types'
import { getCategoryTools, subcategoryFacets } from '../../features/category/listing'
import { PopularBadge } from '../ui/Badge'
import { CategoryIcon } from '../ui/CategoryIcon'
import css from './CategoryCard.module.css'

interface CategoryCardProps {
  category: Category
}

// Deterministic per-category gradient angle — keeps the palette in the
// accent family while giving each card its own visual identity.
function gradientAngle(slug: string): number {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) % 360
  }
  return 120 + (hash % 120)
}

export function CategoryCard({ category }: CategoryCardProps) {
  const count = toolCountByCategory.get(category.slug) ?? 0
  const subcategories = useMemo(() => {
    const tools = getCategoryTools(category.slug)
    return subcategoryFacets(tools).slice(0, 4)
  }, [category.slug])
  const angle = useMemo(() => gradientAngle(category.slug), [category.slug])

  return (
    <Link to={`/category/${category.slug}`} className={css.card}>
      <div
        className={css.visual}
        style={{
          background: `linear-gradient(${angle}deg, var(--accent-soft) 0%, transparent 75%)`,
        }}
      >
        <CategoryIcon name={category.icon} size={120} className={css.watermark} />
        <span className={css.iconBadge}>
          <CategoryIcon name={category.icon} size={30} />
        </span>
        {category.featured ? (
          <span className={css.badge}>
            <PopularBadge />
          </span>
        ) : null}
      </div>
      <div className={css.body}>
        <h3 className={css.name}>{category.name}</h3>
        <p className={css.description}>{category.description}</p>
        {subcategories.length > 0 ? (
          <ul className={css.chips} aria-label={`${category.name} subcategories`}>
            {subcategories.map((sub) => (
              <li key={sub.value} className={css.chip}>
                {sub.label}
                <span className={css.chipCount}>{sub.count}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className={css.footer}>
        <span className={css.count}>
          {count === 0 ? 'No tools yet' : `${count} ${count === 1 ? 'tool' : 'tools'}`}
        </span>
        <ArrowRight size={18} className={css.arrow} aria-hidden="true" />
      </div>
    </Link>
  )
}
