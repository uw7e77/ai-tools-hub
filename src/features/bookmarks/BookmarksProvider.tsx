import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { BookmarksContext } from './context'
import type { BookmarksContextValue } from './context'

const STORAGE_KEY = 'aitoolshub:bookmarkedTools'

function readStoredBookmarks(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<string[]>(readStoredBookmarks)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
    } catch {
      // Storage unavailable (private mode) — bookmarks stay in memory.
    }
  }, [bookmarks])

  const toggleBookmark = useCallback((slug: string) => {
    setBookmarks((prev) =>
      prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug],
    )
  }, [])

  const value = useMemo<BookmarksContextValue>(
    () => ({
      bookmarks,
      isBookmarked: (slug) => bookmarks.includes(slug),
      toggleBookmark,
    }),
    [bookmarks, toggleBookmark],
  )

  return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>
}
