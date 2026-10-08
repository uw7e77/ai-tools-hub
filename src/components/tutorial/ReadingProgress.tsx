import css from './ReadingProgress.module.css'

export function ReadingProgress({ progress }: { progress: number }) {
  const value = Math.round(Math.min(100, Math.max(0, progress)))
  return (
    <div className={css.bar} role="progressbar" aria-label="Reading progress" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={css.fill} style={{ width: `${value}%` }} />
    </div>
  )
}
