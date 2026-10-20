// Content lives in the JSON database (public/data/tutorials.json), loaded at
// runtime by src/data/db.ts.
import type { Tutorial } from '../types'
import { db } from './db'

export const tutorials: Tutorial[] = db.tutorials
