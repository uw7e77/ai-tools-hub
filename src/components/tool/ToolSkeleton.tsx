import { cx } from '../../utils/cx'
import css from './ToolSkeleton.module.css'

const CARD_COUNT = 3

export function ToolSkeleton() {
  return (
    <section className={css.wrap} role="status" aria-busy="true">
      <span className="sr-only">Loading tool…</span>
      <div className="container">
        <div className={cx(css.bar, css.crumb)} aria-hidden="true" />
        <div className={css.hero} aria-hidden="true">
          <div className={cx(css.bar, css.logo)} />
          <div className={css.heroText}>
            <div className={cx(css.bar, css.heading)} />
            <div className={cx(css.bar, css.badges)} />
            <div className={cx(css.bar, css.line)} />
            <div className={cx(css.bar, css.line)} />
            <div className={cx(css.bar, css.cta)} />
          </div>
        </div>
        <ul className={css.grid} aria-hidden="true">
          {Array.from({ length: CARD_COUNT }, (_, index) => (
            <li key={index} className={css.card}>
              <div className={cx(css.bar, css.cardLogo)} />
              <div className={cx(css.bar, css.cardTitle)} />
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
