import { Check, Share2 } from 'lucide-react'
import { useState } from 'react'
import { cx } from '../../utils/cx'
import css from './ShareButton.module.css'

interface ShareButtonProps {
  title: string
}

export function ShareButton({ title }: ShareButtonProps) {
  const [state, setState] = useState<'idle' | 'shared' | 'copied'>('idle')

  const showThenReset = (next: 'shared' | 'copied') => {
    setState(next)
    window.setTimeout(() => setState('idle'), 2000)
  }

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Clipboard API unavailable (permissions / insecure context) — fall back
      // to the legacy execCommand path.
      try {
        const ta = document.createElement('textarea')
        ta.value = url
        ta.setAttribute('readonly', '')
        ta.style.position = 'absolute'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      } catch {
        return
      }
    }
    showThenReset('copied')
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        showThenReset('shared')
      } catch (error) {
        // The user dismissed the share sheet — do nothing, don't pretend we copied.
        if (error instanceof DOMException && error.name === 'AbortError') return
        // Web Share failed for another reason — fall back to copying the link.
        await copyLink(url)
      }
      return
    }
    await copyLink(url)
  }

  return (
    <button
      type="button"
      className={cx(css.button, state !== 'idle' && css.done)}
      onClick={handleShare}
      aria-label={state === 'copied' ? 'Link copied to clipboard' : 'Share this tutorial'}
      aria-live="polite"
    >
      {state === 'copied' || state === 'shared' ? <Check size={18} aria-hidden="true" /> : <Share2 size={18} aria-hidden="true" />}
      <span className={css.label}>{state === 'copied' ? 'Copied' : state === 'shared' ? 'Shared' : 'Share'}</span>
    </button>
  )
}
