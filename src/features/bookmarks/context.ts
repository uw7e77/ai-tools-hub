import { createContext } from 'react'

export interface BookmarksContextValue {
  bookmarks: string[]
  isBookmarked: (slug: string) => boolean
  toggleBookmark: (slug: string) => void
}

export const BookmarksContext = createContext<BookmarksContextValue | null>(null)
