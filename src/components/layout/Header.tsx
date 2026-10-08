import { Bookmark, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { primaryNav } from '../../data/navigation'
import { useBookmarks } from '../../features/bookmarks/useBookmarks'
import { useTheme } from '../../features/theme/useTheme'
import { cx } from '../../utils/cx'
import { SearchBar } from '../search/SearchBar'
import { Logo } from './Logo'
import { MobileNav } from './MobileNav'
import css from './Header.module.css'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { bookmarks } = useBookmarks()
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const [lastPath, setLastPath] = useState(pathname)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // The header lives outside the routes, so dismiss the expanded mobile
  // search (and reset both search bars) when the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setSearchOpen(false)
  }

  return (
    <>
      <header className={css.header}>
        <div className={cx(css.bar, scrolled && css.scrolled)}>
          <div className={cx('container', css.barInner)}>
            <Logo />
            <nav className={css.nav} aria-label="Primary">
              {primaryNav.map((item) => (
                <Link key={item.href} className={css.navLink} to={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className={css.actions}>
              {/* keyed by route: a navigation resets the query and dismisses
                  any open dropdown, since the header persists across routes */}
              <SearchBar key={pathname} className={css.headerSearch} />
              <button
                type="button"
                className={cx(css.iconBtn, css.searchToggle)}
                aria-label={searchOpen ? 'Close search' : 'Open search'}
                aria-expanded={searchOpen}
                onClick={() => setSearchOpen((value) => !value)}
              >
                {searchOpen ? <X size={20} aria-hidden="true" /> : <Search size={20} aria-hidden="true" />}
              </button>
              <Link
                className={cx(css.iconBtn, css.bookmarksLink)}
                to="/bookmarks"
                aria-label={
                  bookmarks.length > 0 ? `Bookmarks, ${bookmarks.length} saved` : 'Bookmarks'
                }
              >
                <Bookmark size={20} aria-hidden="true" />
                {bookmarks.length > 0 ? (
                  <span className={css.count} aria-hidden="true">
                    {bookmarks.length}
                  </span>
                ) : null}
              </Link>
              <button
                type="button"
                className={css.iconBtn}
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <Sun size={20} aria-hidden="true" />
                ) : (
                  <Moon size={20} aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                className={cx(css.iconBtn, css.menuBtn)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-haspopup="dialog"
                onClick={() => setMenuOpen(true)}
              >
                <Menu size={22} aria-hidden="true" />
              </button>
            </div>
          </div>
          {searchOpen ? (
            <div className={css.mobileSearch}>
              <div className="container">
                <SearchBar
                  key={pathname}
                  variant="large"
                  placeholder="Search AI tools, agents, companies…"
                />
              </div>
            </div>
          ) : null}
        </div>
      </header>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
