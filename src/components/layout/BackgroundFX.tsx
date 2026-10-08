import css from './BackgroundFX.module.css'

// Subtle animated background wash: two large, heavily blurred accent glows
// drifting very slowly behind all content. Pure CSS (transform/opacity only),
// pointer-events-none, and disabled under prefers-reduced-motion.
export function BackgroundFX() {
  return (
    <div className={css.fx} aria-hidden="true">
      <div className={css.orbA} />
      <div className={css.orbB} />
    </div>
  )
}
