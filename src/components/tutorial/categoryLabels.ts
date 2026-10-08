import type { TutorialCategory } from '../../types'

export const tutorialCategoryLabels: Record<TutorialCategory, string> = {
  'ai-basics': 'AI Basics',
  'ai-tools': 'AI Tools',
  'prompt-engineering': 'Prompt Engineering',
  coding: 'Coding',
  'ai-agents': 'AI Agents',
  automation: 'Automation',
  productivity: 'Productivity',
  'generative-ai': 'Generative AI',
}

export function tutorialCategoryLabel(category: TutorialCategory): string {
  return tutorialCategoryLabels[category] ?? category
}
