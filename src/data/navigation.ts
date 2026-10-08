export interface NavItem {
  label: string
  href: string
}

export interface FooterColumn {
  title: string
  links: NavItem[]
}

// Every href below must resolve to a route in src/App.tsx. Do not add a link
// until its route and page exist.
export const primaryNav: NavItem[] = [
  { label: 'Tools', href: '/' },
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
      { label: 'All Tools', href: '/' },
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
