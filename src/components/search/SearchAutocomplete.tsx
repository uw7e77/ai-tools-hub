import { BookOpen } from 'lucide-react'
import type { SearchResult, SearchResults } from '../../features/search/useSearchIndex'
import { cx } from '../../utils/cx'
import { BrandLogo } from '../ui/BrandLogo'
import { CategoryIcon } from '../ui/CategoryIcon'
import { EmptyState } from '../ui/EmptyState'
import css from './SearchAutocomplete.module.css'

interface SearchAutocompleteProps {
  listboxId: string
  groups: SearchResults
  activeIndex: number
  query: string
  onSelect: (href: string) => void
}

function ResultIcon({ item }: { item: SearchResult }) {
  if (item.group === 'Categories' && item.icon) {
    return (
      <span className={css.iconTile}>
        <CategoryIcon name={item.icon} size={15} />
      </span>
    )
  }
  if (item.group === 'Tutorials') {
    return (
      <span className={css.iconTile}>
        <BookOpen size={15} aria-hidden="true" />
      </span>
    )
  }
  return <BrandLogo logo={item.logo ?? ''} name={item.title} size={30} />
}

export function SearchAutocomplete({
  listboxId,
  groups,
  activeIndex,
  query,
  onSelect,
}: SearchAutocompleteProps) {
  if (groups.length === 0) {
    return (
      <div className={css.panel}>
        <EmptyState
          title={`No results for “${query.trim()}”`}
          description="Try a different keyword, or browse a popular category instead."
        />
      </div>
    )
  }

  const { items: indexedGroups } = groups.reduce<{
    offset: number
    items: { group: string; entries: { item: SearchResult; index: number }[] }[]
  }>(
    (acc, group) => ({
      offset: acc.offset + group.items.length,
      items: [
        ...acc.items,
        {
          group: group.group,
          entries: group.items.map((item, itemIndex) => ({
            item,
            index: acc.offset + itemIndex,
          })),
        },
      ],
    }),
    { offset: 0, items: [] },
  )

  return (
    <div className={css.panel}>
      <ul className={css.list} id={`${listboxId}-listbox`} role="listbox" aria-label="Search suggestions">
        {indexedGroups.map((group) => (
          <li key={group.group} role="group" aria-label={group.group} className={css.group}>
            <p className={css.groupLabel} aria-hidden="true">
              {group.group}
            </p>
            <ul className={css.groupList}>
              {group.entries.map(({ item, index }) => {
                const active = index === activeIndex
                return (
                  <li
                    key={`${group.group}-${item.id}`}
                    id={`${listboxId}-option-${index}`}
                    role="option"
                    aria-selected={active}
                    className={cx(css.option, active && css.optionActive)}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() => onSelect(item.href)}
                  >
                    <ResultIcon item={item} />
                    <span className={css.optionText}>
                      <span className={css.optionTitle}>{item.title}</span>
                      <span className={css.optionMeta}>{item.meta}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
