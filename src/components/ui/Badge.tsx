import { Check } from 'lucide-react'
import type { PricingType } from '../../types'
import { cx } from '../../utils/cx'
import css from './Badge.module.css'

const pricingLabels: Record<PricingType, string> = {
  free: 'Free',
  freemium: 'Freemium',
  paid: 'Paid',
  'open-source': 'Open Source',
  'free-trial': 'Free Trial',
}

export function TestedBadge({ className }: { className?: string }) {
  return (
    <span className={cx(css.badge, css.tested, className)}>
      <Check size={12} strokeWidth={3} aria-hidden="true" />
      Tested
    </span>
  )
}

export function PricingBadge({ pricing, className }: { pricing: PricingType | null; className?: string }) {
  // Pricing is unknown for some records — render nothing rather than invent a value.
  if (pricing === null) return null
  return (
    <span className={cx(css.badge, pricing === 'paid' ? css.paid : css.neutral, className)}>
      {pricingLabels[pricing]}
    </span>
  )
}

export function NewBadge({ className }: { className?: string }) {
  return <span className={cx(css.badge, css.new, className)}>New</span>
}

export function PopularBadge({ className }: { className?: string }) {
  return <span className={cx(css.badge, css.popular, className)}>Popular</span>
}
