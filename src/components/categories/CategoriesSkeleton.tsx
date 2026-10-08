import { cx } from '../../utils/cx'
import css from './CategoriesSkeleton.module.css'

const PLACEHOLDER_COUNT = 6

export function CategoriesSkeleton() {
  return (
    <section className={css.wrap} role="status" aria-busy="true">
      <span className="sr-only">Loading categories…</span>
      <div className="container">
        <div className={css.header} aria-hidden="true">
          <div className={cx(css.bar, css.eyebrow)} />
          <div className={cx(css.bar, css.heading)} />
          <div className={cx(css.bar, css.lede)} />
        </div>
        <ul className={css.grid} aria-hidden="true">
          {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
            <li key={index} className={css.card}>
              <div className={cx(css.bar, css.tile)} />
              <div className={cx(css.bar, css.cardTitle)} />
              <div className={cx(css.bar, css.line)} />
              <div className={cx(css.bar, css.footerBar)} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
