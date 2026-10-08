// GENERATED from the real AIToolsHub sources — do not edit by hand.
// Regenerate with: node scripts/gen-site-data.mjs
// Source: derived from ./tutorials (same records, keyed by slug)
import type { Tutorial, TutorialSlug } from '../types'
import { tutorials } from './tutorials'

export const tutorialDetails: Partial<Record<TutorialSlug, Tutorial>> = Object.fromEntries(
  tutorials.map((tutorial) => [tutorial.slug, tutorial]),
)
