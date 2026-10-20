import css from './DbScreens.module.css'

/** Shown while the JSON database (public/data/) is being fetched. */
export function DbLoadingScreen() {
  return (
    <div className={css.wrap} role="status" aria-live="polite">
      <div className={css.inner}>
        <span className={css.mark} aria-hidden="true">
          <svg viewBox="0 0 32 32" width="22" height="22">
            <path
              d="M16 5.5l2.6 7.9 7.9 2.6-7.9 2.6L16 26.5l-2.6-7.9-7.9-2.6 7.9-2.6z"
              fill="#ffffff"
            />
          </svg>
        </span>
        <p className={css.word}>AIToolsHub</p>
        <p className={css.text}>Loading thousands of AI tools for you…</p>
        <div className={css.bar} aria-hidden="true">
          <div className={css.barFill} />
        </div>
      </div>
    </div>
  )
}

/** Shown when the database files cannot be fetched at all. */
export function DbErrorScreen() {
  return (
    <div className={css.wrap}>
      <div className={css.inner}>
        <p className={css.word}>AIToolsHub</p>
        <h1 className={css.title}>We couldn&rsquo;t load the tools database</h1>
        <p className={css.text}>
          The data files didn&rsquo;t come through. Check your connection and try again — your
          bookmarks and settings are safe on this device.
        </p>
        <button type="button" className={css.retry} onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    </div>
  )
}
