import { useLocation } from 'react-router-dom'
import { ButtonLink } from '../components/ui/Button'
import { usePageMeta } from '../features/seo/usePageMeta'
import css from './NotFound.module.css'

const HELPFUL_LINKS = [
  { to: '/categories', label: 'Browse AI tools' },
  { to: '/agents', label: 'Explore AI agents' },
  { to: '/tutorials', label: 'Read tutorials' },
  { to: '/companies', label: 'Meet AI companies' },
  { to: '/new', label: 'See new launches' },
]

export function NotFound() {
  const { pathname } = useLocation()

  usePageMeta({
    title: 'Page not found — AIToolsHub',
    description: 'This page does not exist. Browse the AI tools, agents, tutorials and companies that are live on AIToolsHub.',
    path: pathname,
  })

  return (
    <section className={css.wrap}>
      <div className="container">
        <div className={css.inner}>
          <p className={css.code}>404</p>
          <h1 className={css.title}>Page not found</h1>
          <p className={css.text}>
            We couldn’t find anything at this address — it may have been moved or the link may be
            broken. Here’s where you can go instead:
          </p>
          <nav className={css.links} aria-label="Helpful links">
            {HELPFUL_LINKS.map((link) => (
              <ButtonLink key={link.to} variant="secondary" to={link.to} className={css.link}>
                {link.label}
              </ButtonLink>
            ))}
          </nav>
          <ButtonLink to="/" variant="ghost" className={css.homeLink}>
            Back to homepage
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
