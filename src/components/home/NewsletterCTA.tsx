import { Newsletter } from '../layout/Newsletter'
import css from './NewsletterCTA.module.css'

export function NewsletterCTA() {
  return (
    <section className="section" id="newsletter">
      <div className="container">
        <div className={css.inner}>
          <Newsletter />
        </div>
      </div>
    </section>
  )
}
