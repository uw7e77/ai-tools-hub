import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../ui/Button'
import css from './Newsletter.module.css'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const inputId = useId()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubscribed(true)
  }

  return (
    <div className={css.card}>
      <h2 className={css.title}>Get the best new AI tools, weekly</h2>
      <p className={css.benefit}>
        One short email with the tools and launches worth your time. No spam — unsubscribe
        anytime.
      </p>
      {subscribed ? (
        <p className={css.success} role="status">
          You&apos;re on the list. Check your inbox to confirm your subscription.
        </p>
      ) : (
        <form className={css.form} onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor={inputId}>
            Email address
          </label>
          <input
            id={inputId}
            className={css.input}
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit" size="lg">
            Subscribe
          </Button>
        </form>
      )}
    </div>
  )
}
