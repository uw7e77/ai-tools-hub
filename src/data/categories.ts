// Content lives in the JSON database (public/data/categories.json), loaded
// at runtime by src/data/db.ts.
import type { Category } from '../types'
import { db } from './db'

export const categories: Category[] = db.categories
