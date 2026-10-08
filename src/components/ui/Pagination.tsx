import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cx } from '../../utils/cx'
import css from './Pagination.module.css'

interface PaginationProps {
  page: number
  pageCount: number
  toPage: (page: number) => string
  onNavigate?: () => void
}

// Compact page list: first, last, and a window around the current page.
// Rendering every page number would overflow small screens and flood the DOM
// for large listings (e.g. 40+ pages).
function pageItems(page: number, pageCount: number): Array<number | 'ellipsis'> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }
  const kept = new Set(
    [1, 2, page - 1, page, page + 1, pageCount - 1, pageCount].filter(
      (number) => number >= 1 && number <= pageCount,
    ),
  )
  const sorted = [...kept].sort((a, b) => a - b)
  const items: Array<number | 'ellipsis'> = []
  let previous = 0
  for (const number of sorted) {
    if (number - previous > 1) {
      items.push('ellipsis')
    }
    items.push(number)
    previous = number
  }
  return items
}

export function Pagination({ page, pageCount, toPage, onNavigate }: PaginationProps) {
  if (pageCount <= 1) return null
  const items = pageItems(page, pageCount)

  return (
    <nav className={css.pagination} aria-label="Pagination">
      <ul className={css.list}>
        <li>
          {page > 1 ? (
            <Link
              className={cx(css.control, css.link)}
              to={toPage(page - 1)}
              aria-label="Previous page"
              rel="prev"
              onClick={onNavigate}
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </Link>
          ) : (
            <span className={cx(css.control, css.disabled)} aria-hidden="true">
              <ChevronLeft size={16} />
            </span>
          )}
        </li>
        {items.map((item, index) =>
          item === 'ellipsis' ? (
            <li key={`ellipsis-${index}`} className={css.gapItem} aria-hidden="true">
              <span className={cx(css.control, css.ellipsis)}>…</span>
            </li>
          ) : (
            <li key={item} className={css.numberItem}>
              {item === page ? (
                <span className={cx(css.control, css.current)} aria-current="page">
                  {item}
                </span>
              ) : (
                <Link
                  className={cx(css.control, css.link)}
                  to={toPage(item)}
                  aria-label={`Page ${item}`}
                  onClick={onNavigate}
                >
                  {item}
                </Link>
              )}
            </li>
          ),
        )}
        <li className={css.statusItem} aria-hidden="true">
          <span className={css.status}>
            Page {page} of {pageCount}
          </span>
        </li>
        <li>
          {page < pageCount ? (
            <Link
              className={cx(css.control, css.link)}
              to={toPage(page + 1)}
              aria-label="Next page"
              rel="next"
              onClick={onNavigate}
            >
              <ChevronRight size={16} aria-hidden="true" />
            </Link>
          ) : (
            <span className={cx(css.control, css.disabled)} aria-hidden="true">
              <ChevronRight size={16} />
            </span>
          )}
        </li>
      </ul>
    </nav>
  )
}
