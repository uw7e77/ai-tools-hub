import { Bookmark } from 'lucide-react'
import { useBookmarks } from '../../features/bookmarks/useBookmarks'
import { cx } from '../../utils/cx'
import css from './BookmarkButton.module.css'

interface BookmarkButtonProps {
  slug: string
  name: string
  className?: string
}

export function BookmarkButton({ slug, name, className }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const active = isBookmarked(slug)

  return (
    <button
      type="button"
      className={cx(css.button, active && css.active, className)}
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from bookmarks` : `Save ${name} to bookmarks`}
      title={active ? 'Remove bookmark' : 'Save to bookmarks'}
      onClick={() => toggleBookmark(slug)}
    >
      <Bookmark size={18} fill={active ? 'currentColor' : 'none'} aria-hidden="true" />
    </button>
  )
}
