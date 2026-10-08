export interface NavItem {
  label: string
  href: string
}

export interface FooterColumn {
  title: string
  links: NavItem[]
}

// Every href below must resolve to a route in src/App.tsx. Pages that don't
// exist yet (/tools, /compare, /submit, /about, /contact, /privacy, /terms,
// /advertise) are intentionally omitted — do not re-add them until the route
// and page exist.
export const primaryNav: NavItem[] = [
  // No standalone /tools browse page exists; the category hub is the
  // tool-browsing surface. A single entry avoids two links to one page.
  { label: 'Categories', href: '/categories' },
  { label: 'AI Agents', href: '/agents' },
  { label: 'Companies', href: '/companies' },
  { label: 'Tutorials', href: '/tutorials' },
  { label: 'New', href: '/new' },
]

export const footerColumns: FooterColumn[] = [
  {
    title: 'Discover',
    links: [
      { label: 'Categories', href: '/categories' },
      { label: 'AI Agents', href: '/agents' },
      { label: 'Companies', href: '/companies' },
      { label: 'Tutorials', href: '/tutorials' },
    ],
  },
  {
    title: 'Explore More',
    links: [
      { label: 'New Launches', href: '/new' },
      { label: 'Bookmarks', href: '/bookmarks' },
    ],
  },
]
