import { Breadcrumbs } from '../ui/Breadcrumbs'
import { cx } from '../../utils/cx'
import css from './TutorialDetailSkeleton.module.css'

export function TutorialDetailSkeleton() {
  return (
    <section className="section" aria-label="Loading tutorial" aria-busy="true">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Tutorials', to: '/tutorials' }]} />
        <div className={css.hero}>
          <div className={cx(css.line, css.badges)} />
          <div className={cx(css.line, css.title)} />
          <div className={cx(css.line, css.desc)} />
          <div className={cx(css.line, css.meta)} />
        </div>
        <div className={css.media} />
        <div className={css.layout}>
          <div className={css.toc} aria-hidden="true">
            <div className={cx(css.line, css.tocTitle)} />
            <div className={cx(css.line, css.tocItem)} />
            <div className={cx(css.line, css.tocItem)} />
            <div className={cx(css.line, css.tocItem)} />
            <div className={cx(css.line, css.tocItem)} />
          </div>
          <div className={css.article} aria-hidden="true">
            <div className={cx(css.line, css.p)} />
            <div className={cx(css.line, css.p)} />
            <div className={cx(css.line, css.pShort)} />
            <div className={cx(css.line, css.h)} />
            <div className={cx(css.line, css.p)} />
            <div className={cx(css.line, css.p)} />
          </div>
          <div className={css.rail} aria-hidden="true">
            <div className={css.card} />
            <div className={css.card} />
          </div>
        </div>
      </div>
    </section>
  )
}
