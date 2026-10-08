import { useMemo } from 'react'
import { cx } from '../../utils/cx'
import type { TocEntry } from './markdownParser'
import css from './TableOfContents.module.css'

interface TableOfContentsProps {
  entries: TocEntry[]
  activeId: string | null
}

interface NumberedEntry extends TocEntry {
  number: string | null
}

export function TableOfContents({ entries, activeId }: TableOfContentsProps) {
  const numbered: NumberedEntry[] = useMemo(() => {
    let h2Count = 0
    return entries.map((entry) => ({
      ...entry,
      number: entry.level === 2 ? String(++h2Count).padStart(2, '0') : null,
    }))
  }, [entries])

  if (numbered.length === 0) return null

  return (
    <nav className={css.nav} aria-label="Table of contents">
      <p className={css.title}>On this page</p>
      <ol className={css.list}>
        {numbered.map((entry) => {
          const isH2 = entry.level === 2
          const active = entry.id === activeId
          const scrollTo = (event: React.MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault()
            const target = document.getElementById(entry.id)
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            // Move keyboard focus to the heading for screen-reader users.
            target?.focus({ preventScroll: true })
          }
          return (
            <li key={entry.id} className={cx(css.item, !isH2 && css.subItem, active && css.active)}>
              <a href={`#${entry.id}`} className={css.link} aria-current={active ? 'true' : undefined} onClick={scrollTo}>
                {entry.number && (
                  <span className={css.number} aria-hidden="true">
                    {entry.number}
                  </span>
                )}
                <span className={css.label}>{entry.title}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
