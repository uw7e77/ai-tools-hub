import { Link } from 'react-router-dom'
import { footerColumns } from '../../data/navigation'
import { tagline } from '../../data/site'
import { Logo } from './Logo'
import css from './Footer.module.css'

const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className={css.footer}>
      <div className="container">
        <div className={css.grid}>
          <div className={css.brand}>
            <Logo />
            <p className={css.tagline}>{tagline}</p>
          </div>
          {footerColumns.map((column) => (
            <nav key={column.title} className={css.column} aria-label={column.title}>
              <h3 className={css.columnTitle}>{column.title}</h3>
              <ul className={css.links}>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link className={css.link} to={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className={css.bottom}>
          <p>© {currentYear} AIToolsHub. All rights reserved.</p>
          <p className={css.disclosure}>
            Some outbound tool links are affiliate links. They never change what we recommend.
          </p>
        </div>
      </div>
    </footer>
  )
}
