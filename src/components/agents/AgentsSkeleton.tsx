import { cx } from '../../utils/cx'
import css from './AgentsSkeleton.module.css'

const PLACEHOLDER_COUNT = 6

export function AgentsSkeleton() {
  return (
    <section className={css.wrap} role="status" aria-busy="true">
      <span className="sr-only">Loading AI agents…</span>
      <div className="container">
        <div className={css.header} aria-hidden="true">
          <div className={cx(css.bar, css.eyebrow)} />
          <div className={cx(css.bar, css.heading)} />
          <div className={cx(css.bar, css.lede)} />
        </div>
        <div className={cx(css.bar, css.explainer)} />
        <div className={cx(css.bar, css.searchBar)} />
        <div className={css.filterRow}>
          <div className={cx(css.bar, css.pill)} />
          <div className={cx(css.bar, css.pill)} />
          <div className={cx(css.bar, css.pill)} />
        </div>
        <ul className={css.grid}>
          {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
            <li key={index} className={css.card}>
              <div className={css.cardTop}>
                <div className={cx(css.bar, css.tile)} />
                <div className={cx(css.bar, css.cardTitle)} />
              </div>
              <div className={cx(css.bar, css.line)} />
              <div className={cx(css.bar, css.lineShort)} />
              <div className={cx(css.bar, css.lineShort)} />
              <div className={cx(css.bar, css.footerBar)} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
