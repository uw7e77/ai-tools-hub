import { cx } from '../../utils/cx'
import css from './CategorySkeleton.module.css'

const CARD_COUNT = 3

export function CategorySkeleton() {
  return (
    <section className={css.wrap} role="status" aria-busy="true">
      <span className="sr-only">Loading category…</span>
      <div className="container">
        <div className={cx(css.bar, css.crumb)} aria-hidden="true" />
        <div className={css.hero} aria-hidden="true">
          <div className={cx(css.bar, css.tile)} />
          <div className={css.heroText}>
            <div className={cx(css.bar, css.heading)} />
            <div className={cx(css.bar, css.lede)} />
            <div className={cx(css.bar, css.count)} />
          </div>
        </div>
        <div className={css.toolbar} aria-hidden="true">
          <div className={cx(css.bar, css.result)} />
          <div className={cx(css.bar, css.select)} />
        </div>
        <ul className={css.grid} aria-hidden="true">
          {Array.from({ length: CARD_COUNT }, (_, index) => (
            <li key={index} className={css.card}>
              <div className={cx(css.bar, css.logo)} />
              <div className={cx(css.bar, css.cardTitle)} />
              <div className={cx(css.bar, css.line)} />
              <div className={cx(css.bar, css.line)} />
              <div className={cx(css.bar, css.meta)} />
              <div className={cx(css.bar, css.button)} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
