import { Search } from 'lucide-react'
import { useId, useState } from 'react'
import type { FocusEvent, KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { flattenResults, useSearchIndex } from '../../features/search/useSearchIndex'
import { cx } from '../../utils/cx'
import { SearchAutocomplete } from './SearchAutocomplete'
import css from './SearchBar.module.css'

interface SearchBarProps {
  variant?: 'compact' | 'large'
  className?: string
  placeholder?: string
}

export function SearchBar({
  variant = 'compact',
  className,
  placeholder = 'Search tools, agents, companies…',
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const listboxId = useId()
  const navigate = useNavigate()

  const results = useSearchIndex(query)
  const flat = flattenResults(results)
  const hasResults = flat.length > 0
  const dropdownOpen = open && query.trim().length > 0

  const close = () => {
    setOpen(false)
    setActiveIndex(-1)
  }

  const handleSelect = (href: string) => {
    close()
    navigate(href)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!open) {
        setOpen(true)
        return
      }
      if (flat.length > 0) {
        setActiveIndex((index) => (index + 1) % flat.length)
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (flat.length > 0) {
        setActiveIndex((index) => (index <= 0 ? flat.length - 1 : index - 1))
      }
    } else if (event.key === 'Enter') {
      const active = activeIndex >= 0 ? flat[activeIndex] : undefined
      if (dropdownOpen && active) {
        event.preventDefault()
        close()
        navigate(active.href)
      } else if (dropdownOpen && flat.length > 0) {
        // No suggestion highlighted — go to the top result instead of a
        // /search route that doesn't exist.
        event.preventDefault()
        close()
        navigate(flat[0].href)
      }
      // No results: stay put rather than navigating to a dead route.
    } else if (event.key === 'Escape') {
      if (dropdownOpen) {
        // Keep our close-then-clear flow; the native type=search clear would skip it.
        event.preventDefault()
        close()
      } else if (query) {
        setQuery('')
      }
    }
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      close()
    }
  }

  return (
    <div className={cx(css.wrap, css[variant], className)} onBlur={handleBlur}>
      <div className={css.field}>
        <Search className={css.icon} size={18} aria-hidden="true" />
        <input
          className={css.input}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActiveIndex(-1)
            setOpen(event.target.value.trim().length > 0)
          }}
          onFocus={() => {
            if (query.trim().length > 0) {
              setOpen(true)
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search AI tools, agents, companies and tutorials"
          role="combobox"
          aria-expanded={dropdownOpen}
          aria-controls={dropdownOpen && hasResults ? `${listboxId}-listbox` : undefined}
          aria-activedescendant={
            dropdownOpen && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      {dropdownOpen ? (
        <SearchAutocomplete
          listboxId={listboxId}
          groups={results}
          activeIndex={activeIndex}
          query={query}
          onSelect={handleSelect}
        />
      ) : null}
    </div>
  )
}
