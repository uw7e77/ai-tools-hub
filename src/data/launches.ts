import type { Launch } from '../types'
import { db } from './db'

// Launch records live in public/data/launches.json. The DB has no verified
// launch dates yet, so the file is an empty list — we must not invent launch
// dates. LaunchedToday hides itself and /new renders an empty state until
// real launch records are catalogued.
export const launches: Launch[] = db.launches
