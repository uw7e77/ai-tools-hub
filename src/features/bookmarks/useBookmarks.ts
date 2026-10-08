import { useContext } from 'react'
import { BookmarksContext } from './context'
import type { BookmarksContextValue } from './context'

// Safe fallback when the bookmarks feature is disabled (no provider):
// the button renders as an inert "not saved" state instead of crashing.
const disabledBookmarks: BookmarksContextValue = {
  bookmarks: [],
  isBookmarked: () => false,
  toggleBookmark: () => {},
}

export function useBookmarks() {
  const context = useContext(BookmarksContext)
  if (!context) {
    return disabledBookmarks
  }
  return context
}
