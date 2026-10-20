// Content lives in the JSON database (public/data/company-details.json),
// loaded at runtime by src/data/db.ts.
import type { CompanyDetail, CompanySlug } from '../types'
import { db } from './db'

export const companyDetails: Partial<Record<CompanySlug, CompanyDetail>> = db.companyDetails
