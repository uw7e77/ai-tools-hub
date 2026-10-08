import { Star } from 'lucide-react'
import { cx } from '../../utils/cx'
import css from './Rating.module.css'

interface RatingProps {
  value: number
  className?: string
}

export function Rating({ value, className }: RatingProps) {
  return (
    <span
      className={cx(css.rating, className)}
      role="img"
      aria-label={`Rated ${value.toFixed(1)} out of 5`}
    >
      <Star size={14} className={css.star} aria-hidden="true" />
      <span className={css.value}>{value.toFixed(1)}</span>
    </span>
  )
}
