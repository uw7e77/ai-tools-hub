import { Link } from 'react-router-dom'
import { cx } from '../../utils/cx'
import css from './Logo.module.css'

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link className={cx(css.logo, className)} to="/" aria-label="AIToolsHub — home">
      <span className={css.mark} aria-hidden="true">
        <svg viewBox="0 0 32 32" width="17" height="17">
          <path
            d="M16 5.5l2.6 7.9 7.9 2.6-7.9 2.6L16 26.5l-2.6-7.9-7.9-2.6 7.9-2.6z"
            fill="#ffffff"
          />
        </svg>
      </span>
      <span className={css.word}>AIToolsHub</span>
    </Link>
  )
}
