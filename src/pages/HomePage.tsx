import { FeaturedAgents } from '../components/home/FeaturedAgents'
import { FeaturedTutorials } from '../components/home/FeaturedTutorials'
import { Hero } from '../components/home/Hero'
import { LaunchedToday } from '../components/home/LaunchedToday'
import { NewsletterCTA } from '../components/home/NewsletterCTA'
import { PopularCategories } from '../components/home/PopularCategories'
import { TopCompanies } from '../components/home/TopCompanies'
import { TrendingTools } from '../components/home/TrendingTools'
import { totalToolCount } from '../data/lookups'
import { usePageMeta } from '../features/seo/usePageMeta'

export function HomePage() {
  usePageMeta({
    title: 'AIToolsHub — Discover, Compare & Learn the Best AI Tools',
    description: `Discover, compare and learn the AI tools that actually work. Browse ${totalToolCount} tools, AI agents, companies and tutorials in one hub.`,
    path: '/',
  })

  return (
    <>
      <Hero />
      <PopularCategories />
      <TrendingTools />
      <LaunchedToday />
      <FeaturedAgents />
      <TopCompanies />
      <FeaturedTutorials />
      <NewsletterCTA />
    </>
  )
}
