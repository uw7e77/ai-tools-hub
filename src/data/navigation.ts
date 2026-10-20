import { db } from './db'

export interface NavItem {
  label: string
  href: string
}

export interface FooterColumn {
  title: string
  links: NavItem[]
}

// Navigation content lives in the JSON database (public/data/navigation.json),
// loaded at runtime by src/data/db.ts.
// Every href must resolve to a route in src/App.tsx. Do not add a link
// until its route and page exist.
export const primaryNav: NavItem[] = db.navigation.primaryNav

export const footerColumns: FooterColumn[] = db.navigation.footerColumns
