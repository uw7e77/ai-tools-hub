import { useState } from 'react'
import type { CSSProperties } from 'react'
import { cx } from '../../utils/cx'
import css from './BrandLogo.module.css'

function initials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean)
  const first = words[0]?.charAt(0) ?? ''
  const second = words[1]?.charAt(0) ?? ''
  return (first + second).toUpperCase() || '?'
}

function monogramColors(name: string) {
  let hash = 0
  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) % 360
  }
  return {
    background: `hsl(${hash} 45% 15%)`,
    color: `hsl(${hash} 75% 74%)`,
  }
}

interface BrandLogoProps {
  logo: string | null
  name: string
  size?: number
  className?: string
}

// Generated data emits full public paths ("/logos/<slug>.png"); some callers
// still pass a bare slug. Accept both so we never build "/logos//logos/x.png".
function resolveLogoSrc(logo: string): string {
  if (logo.startsWith('/')) return logo
  const file = logo.includes('.') ? logo : `${logo}.png`
  return `/logos/${file}`
}

export function BrandLogo({ logo, name, size = 44, className }: BrandLogoProps) {
  // Track WHICH logo failed (not just a boolean) so the component stays
  // correct when reused for a different entity in lists.
  const [failedLogo, setFailedLogo] = useState<string | null>(null)
  const sizeStyle = { width: `${size}px`, height: `${size}px` } as CSSProperties

  if (logo && failedLogo !== logo) {
    const src = resolveLogoSrc(logo)
    return (
      <span className={cx(css.tile, className)} style={sizeStyle}>
        <img
          className={css.image}
          src={src}
          alt={`${name} logo`}
          loading="lazy"
          decoding="async"
          onError={() => setFailedLogo(logo)}
        />
      </span>
    )
  }

  return (
    <span
      className={cx(css.tile, css.monogram, className)}
      style={{ ...sizeStyle, ...monogramColors(name), fontSize: `${Math.round(size * 0.42)}px` }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}
