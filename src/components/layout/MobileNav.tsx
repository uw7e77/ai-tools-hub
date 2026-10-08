import { Bookmark, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { primaryNav } from '../../data/navigation'
import { cx } from '../../utils/cx'
import css from './MobileNav.module.css'

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }
    triggerRef.current = document.activeElement as HTMLElement | null
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      // Keep tab focus inside the drawer while it's open.
      if (event.key === 'Tab') {
        const panel = panelRef.current
        if (!panel) {
          return
        }
        const focusables = panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusables.length === 0) {
          return
        }
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      triggerRef.current?.focus()
    }
  }, [open, onClose])

  return (
    <div className={cx(css.root, open && css.open)}>
      <div className={css.backdrop} onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className={css.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
      >
        <div className={css.head}>
          <span className={css.headLabel}>Menu</span>
          <button
            ref={closeRef}
            type="button"
            className={css.close}
            aria-label="Close menu"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <nav className={css.nav} aria-label="Mobile">
          <ul className={css.list}>
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link className={css.link} to={item.href} onClick={onClose}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className={cx(css.link, css.linkExtra)} to="/bookmarks" onClick={onClose}>
                <Bookmark size={16} aria-hidden="true" />
                Bookmarks
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
