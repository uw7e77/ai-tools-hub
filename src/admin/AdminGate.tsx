import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import css from './AdminGate.module.css'

const LS_HASH = 'aitoolshub:admin-pass-hash'
const SS_UNLOCKED = 'aitoolshub:admin-unlocked'

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function isUnlocked(): boolean {
  try {
    return sessionStorage.getItem(SS_UNLOCKED) === '1'
  } catch {
    return false
  }
}

export function lockAdmin() {
  try {
    sessionStorage.removeItem(SS_UNLOCKED)
  } catch {
    // ignore
  }
}

/**
 * Cosmetic passcode gate. It keeps casual visitors out of /admin, but it is
 * NOT real security — the site is a static bundle anyone can inspect. For
 * real protection, restrict /admin at the hosting layer before launch.
 */
export function AdminGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(isUnlocked)
  const [hasPasscode, setHasPasscode] = useState(() => {
    try {
      return localStorage.getItem(LS_HASH) !== null
    } catch {
      return false
    }
  })
  const [passcode, setPasscode] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  if (unlocked) return <>{children}</>

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!hasPasscode) {
      if (passcode.length < 6) {
        setError('Passcode must be at least 6 characters.')
        return
      }
      if (passcode !== confirm) {
        setError('Passcodes do not match.')
        return
      }
      localStorage.setItem(LS_HASH, await sha256(passcode))
      setHasPasscode(true)
    } else {
      const hash = await sha256(passcode)
      if (hash !== localStorage.getItem(LS_HASH)) {
        setError('Wrong passcode. Try again.')
        return
      }
    }
    sessionStorage.setItem(SS_UNLOCKED, '1')
    setUnlocked(true)
  }

  return (
    <div className={css.wrap}>
      <form className={css.card} onSubmit={onSubmit}>
        <p className={css.brand}>AIToolsHub Admin</p>
        <h1 className={css.title}>{hasPasscode ? 'Enter your passcode' : 'Create an admin passcode'}</h1>
        <p className={css.text}>
          {hasPasscode
            ? 'This panel manages the site database (tools, agents, categories).'
            : 'First visit on this device — set a passcode to protect the admin panel.'}
        </p>
        <label className={css.label}>
          Passcode
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            autoComplete={hasPasscode ? 'current-password' : 'new-password'}
            autoFocus
          />
        </label>
        {!hasPasscode ? (
          <label className={css.label}>
            Confirm passcode
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </label>
        ) : null}
        {error ? (
          <p className={css.error} role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className={css.submit}>
          {hasPasscode ? 'Unlock admin' : 'Create & unlock'}
        </button>
        <p className={css.note}>
          Note: this is a convenience lock on this device only, not server security.
        </p>
      </form>
    </div>
  )
}
