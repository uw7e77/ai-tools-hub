// Content lives in the JSON database (public/data/companies.json), loaded at
// runtime by src/data/db.ts.
import type { Company } from '../types'
import { db } from './db'

export const companies: Company[] = db.companies
