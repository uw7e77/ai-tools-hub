import type { Category, CategorySlug, Launch, Tool } from '../../types'
import { siteUrl } from '../../data/site'
import { getCategoryLaunches, PRICING_LABELS, pricingFacets, sortTools } from './listing'

const reviewCountFormatter = new Intl.NumberFormat('en-US')
const launchDateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

export function formatReviewCount(count: number): string {
  return reviewCountFormatter.format(count)
}

export interface LaunchEntry {
  launch: Launch
  dateLabel: string
}

export function getCategoryLaunchEntries(slug: CategorySlug): LaunchEntry[] {
  return getCategoryLaunches(slug).map((launch) => ({
    launch,
    dateLabel: launchDateFormatter.format(new Date(`${launch.launchedAt}T00:00:00`)),
  }))
}

export function pickBestOverall(items: Tool[]): Tool | null {
  return sortTools(items, 'trending')[0] ?? null
}

export function bestOverallNote(tool: Tool): string {
  // Only mention figures the DB actually verifies — never invent review counts.
  const parts: string[] = []
  if (tool.reviewCount != null) {
    parts.push(`${formatReviewCount(tool.reviewCount)} reviews`)
  }
  if (tool.tested) {
    parts.push('Tested by AIToolsHub')
  }
  return parts.join(' · ')
}

function joinNatural(names: string[]): string {
  if (names.length <= 1) return names[0] ?? ''
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

function listNames(items: Tool[]): string {
  const names = items.map((tool) => tool.name)
  if (names.length <= 5) return joinNatural(names)
  return `${joinNatural(names.slice(0, 4))} and ${names.length - 4} more`
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

function buildBestAnswer(items: Tool[]): string {
  const count = items.length
  const top = sortTools(items, 'trending').slice(0, 3)
  const verb = top.length === 1 ? 'comes' : 'come'
  return `We list ${count} ${count === 1 ? 'tool' : 'tools'} in this category. ${listNames(top)} ${verb} first in our ranking.`
}

function buildFreeAnswer(items: Tool[]): string {
  const free = items.filter((tool) => tool.pricing === 'free')
  const flexible = items.filter(
    (tool) => tool.pricing === 'freemium' || tool.pricing === 'free-trial',
  )
  const openSource = items.filter((tool) => tool.pricing === 'open-source')
  const paid = items.filter((tool) => tool.pricing === 'paid')

  const sentences: string[] = []
  if (free.length > 0) {
    sentences.push(`${listNames(free)} ${free.length === 1 ? 'is' : 'are'} free to use`)
    if (flexible.length > 0) {
      sentences.push(
        `${listNames(flexible)} also ${flexible.length === 1 ? 'offers' : 'offer'} a free tier or trial`,
      )
    }
  } else if (flexible.length > 0) {
    sentences.push(
      `No tool here is completely free, but ${listNames(flexible)} ${flexible.length === 1 ? 'offers' : 'offer'} a free tier or trial`,
    )
  } else {
    sentences.push('None of the tools in this category offer a free tier or trial')
  }
  if (openSource.length > 0) {
    sentences.push(`${listNames(openSource)} ${openSource.length === 1 ? 'is' : 'are'} open source`)
  }
  if (paid.length > 0) {
    sentences.push(`${listNames(paid)} ${paid.length === 1 ? 'is' : 'are'} paid`)
  }
  return `${sentences.join('. ')}.`
}

function buildTestedAnswer(items: Tool[]): string {
  const count = items.length
  const tested = items.filter((tool) => tool.tested)
  if (tested.length === 0) {
    return `None of the ${count} ${count === 1 ? 'tool' : 'tools'} in this category have been tested yet.`
  }
  return `We've tested ${tested.length} of the ${count} ${count === 1 ? 'tool' : 'tools'} in this category: ${listNames(tested)}.`
}

function buildRatedAnswer(items: Tool[]): string {
  const best = sortTools(items, 'rating')[0]
  if (best.rating == null || best.reviewCount == null) {
    return 'We have not published verified ratings for tools in this category yet.'
  }
  return `${best.name} has the highest rating — ${best.rating.toFixed(1)}/5 from ${formatReviewCount(best.reviewCount)} reviews.`
}

export function buildFaqItems(category: Category, items: Tool[]): FaqItem[] {
  if (items.length === 0) return []
  return [
    {
      id: 'faq-best',
      question: `What are the best options in ${category.name}?`,
      answer: buildBestAnswer(items),
    },
    {
      id: 'faq-free',
      question: `Are there free options in ${category.name}?`,
      answer: buildFreeAnswer(items),
    },
    {
      id: 'faq-tested',
      question: `How many tools in ${category.name} has AIToolsHub tested?`,
      answer: buildTestedAnswer(items),
    },
    {
      id: 'faq-rating',
      question: `What is the highest-rated tool in ${category.name}?`,
      answer: buildRatedAnswer(items),
    },
  ]
}

function testedSentence(count: number, testedCount: number): string {
  if (count === 1) {
    return testedCount === 1 ? 'It has been tested by AIToolsHub.' : `It hasn't been tested yet.`
  }
  if (testedCount === 0) return 'None of them have been tested yet.'
  if (testedCount === count) return 'All of them have been tested by AIToolsHub.'
  return `AIToolsHub has tested ${testedCount} of them.`
}

export function buildIntroParagraphs(category: Category, items: Tool[]): string[] {
  const count = items.length
  if (count === 0) {
    return [`${category.description} We haven't catalogued any options in this category yet.`]
  }

  const top = sortTools(items, 'trending').slice(0, 3)
  const listing = top.length === count ? `: ${listNames(top)}` : `, including ${listNames(top)}`
  const first = `${category.description} AIToolsHub currently lists ${count} ${count === 1 ? 'tool' : 'tools'} in this category${listing}.`

  const facets = pricingFacets(items)
  const labels = facets.map((facet) => PRICING_LABELS[facet.value].toLowerCase())
  let pricingLine: string
  if (count === 1) {
    pricingLine = `${items[0].name} uses the ${labels[0]} model.`
  } else if (labels.length === 1) {
    pricingLine = `All ${count} tools use the ${labels[0]} model.`
  } else {
    pricingLine = `Pricing spans ${joinNatural(labels)} options.`
  }
  const testedCount = items.filter((tool) => tool.tested).length
  const second = `${pricingLine} ${testedSentence(count, testedCount)}`

  return [first, second]
}

export function buildMetaTitle(category: Category): string {
  return `${category.name} — Ratings, Pricing & Reviews | AIToolsHub`
}

export function buildMetaDescription(category: Category, items: Tool[]): string {
  if (items.length === 0) {
    return `Nothing listed in ${category.name} yet — explore other AI tool categories on AIToolsHub.`
  }
  const count = items.length
  return `${category.description} Compare ${count} ${count === 1 ? 'tool' : 'tools'} with ratings, pricing and reviews on AIToolsHub.`
}

export function buildCategoryJsonLd(category: Category, faqItems: FaqItem[]): object {
  const graph: object[] = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Categories', item: `${siteUrl}/categories` },
        {
          '@type': 'ListItem',
          position: 3,
          name: category.name,
          item: `${siteUrl}/category/${category.slug}`,
        },
      ],
    },
  ]
  if (faqItems.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}
