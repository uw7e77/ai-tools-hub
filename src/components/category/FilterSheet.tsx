import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Button } from '../ui/Button'
import { cx } from '../../utils/cx'
import css from './FilterSheet.module.css'

interface FilterSheetProps {
  open: boolean
  onClose: () => void
  resultCount: number
  children: ReactNode
}

export function FilterSheet({ open, onClose, resultCount, children }: FilterSheetProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
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
      <div className={css.panel} role="dialog" aria-modal="true" aria-label="Filters" inert={!open}>
        <div className={css.head}>
          <span className={css.grab} aria-hidden="true" />
          <button
            ref={closeRef}
            type="button"
            className={css.close}
            aria-label="Close filters"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className={css.body}>{children}</div>
        <div className={css.footer}>
          <Button className={css.apply} onClick={onClose}>
            Show {resultCount} {resultCount === 1 ? 'tool' : 'tools'}
          </Button>
        </div>
      </div>
    </div>
  )
}
