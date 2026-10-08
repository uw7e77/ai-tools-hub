import type { Launch } from '../types'

// The DB has no launch dates, so this feed is intentionally empty — we must
// not invent launch dates. LaunchedToday hides itself and /new renders an
// empty state until real launch records are catalogued.
export const launches: Launch[] = []
