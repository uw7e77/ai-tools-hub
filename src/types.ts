export type PricingType = 'free' | 'freemium' | 'paid' | 'open-source' | 'free-trial'

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'

// Real slugs now come from src/data/*.ts (generated from the AIToolsHub DB).
// These are plain strings so the generated data always type-checks.
export type CompanySlug = string
export type ToolSlug = string
export type AgentSlug = string
export type TutorialSlug = string

// The 11 real categories from ai-tools-directory/data/categories.json.
export type CategorySlug =
  | 'productivity'
  | 'writing-content'
  | 'image-design'
  | 'video-audio'
  | 'coding-development'
  | 'marketing-sales'
  | 'business-data'
  | 'education-learning'
  | 'automation-agents'
  | 'lifestyle'
  | 'security'

export interface Tool {
  slug: ToolSlug
  name: string
  logo: string
  company: string | null
  category: CategorySlug
  subcategory: string | null
  shortDescription: string
  pricing: PricingType | null
  // Honest-data fields: only present when backed by a verified source.
  // The DB does not verify these, so generated records omit them.
  rating?: number
  reviewCount?: number
  tested?: boolean
  testedDate?: string
  featuredRank?: number
  isNew?: boolean
  tags: string[]
  platforms: string[]
  officialUrl: string
  affiliateUrl: string | null
}

export interface PricingTier {
  name: string
  price: string
  note: string
}

export interface ToolDetail {
  verdict: string
  overview: string[]
  features: string[]
  pros: string[]
  cons: string[]
  bestFor: string | null
  pricingTiers: PricingTier[] | null
  pakistanAvailability: string | null
  faq: FaqItem[]
}

export interface Category {
  slug: CategorySlug
  name: string
  icon: string
  description: string
  featured?: boolean
}

export interface Agent {
  slug: AgentSlug
  name: string
  logo: string
  company: string
  tagline: string
  description: string
  capabilities: string[]
  difficulty: Difficulty | null
  pricing: PricingType | null
  tested: boolean
  featured?: boolean
  popularRank?: number
  isNew?: boolean
  officialUrl: string
}

export interface AgentDetail {
  verdict: string
  overview: string[]
  howItWorks: string[]
  integrations: string[]
  difficultyExplanation: string | null
  pricingTiers: PricingTier[] | null
  pros: string[]
  cons: string[]
  tutorial: { title: string; durationMinutes: number; difficulty: Difficulty } | null
  alternatives: AgentSlug[]
  faq: FaqItem[]
}

export interface Company {
  slug: CompanySlug
  name: string
  logo: string | null
  mission: string | null
  description: string
  longDescription: string | null
  founded: number | null
  hq: string | null
  website: string
  products: string[]
  models: string[]
  featured: boolean
}

export interface CompanyTimelineItem {
  year: number
  event: string
}

export interface CompanyNewsItem {
  date: string
  title: string
  summary: string
  source: string | null
}

export interface CompanyDetail {
  focus: string | null
  stats: {
    employees: string | null
    valuation: string | null
    funding: string | null
  }
  timeline: CompanyTimelineItem[]
  news: CompanyNewsItem[]
  relatedCompanies: CompanySlug[]
}

export type TutorialCategory =
  | 'ai-basics'
  | 'ai-tools'
  | 'prompt-engineering'
  | 'coding'
  | 'ai-agents'
  | 'automation'
  | 'productivity'
  | 'generative-ai'

export interface TutorialChapter {
  id: string
  title: string
  content: string
  level: number
}

export interface TutorialCodeBlock {
  id: string
  language: string
  label: string | null
  code: string
  filename: string | null
}

export interface TutorialPromptBlock {
  id: string
  label: string | null
  prompt: string
}

export interface TutorialImage {
  id: string
  src: string
  alt: string
  caption: string | null
}

export interface TutorialFaqItem {
  id: string
  question: string
  answer: string
}

export interface Tutorial {
  slug: TutorialSlug
  title: string
  description: string
  thumbnail: string | null
  // Optional hero video (YouTube). Absent in generated data → renders nothing.
  video?: { url: string; title: string | null } | null
  category: TutorialCategory
  difficulty: Difficulty
  durationMinutes: number
  author: string | null
  publishedDate: string
  updatedDate: string | null
  featured: boolean
  popular: boolean
  content: string | null
  toolsUsed: string[]
  relatedTutorials: TutorialSlug[]
  chapters: TutorialChapter[]
  codeBlocks: TutorialCodeBlock[]
  promptBlocks: TutorialPromptBlock[]
  images: TutorialImage[]
  faq: TutorialFaqItem[]
}

export interface Launch {
  slug: string
  name: string
  toolSlug: string
  description: string
  category: CategorySlug
  launchedAt: string
  isNew: boolean
}
