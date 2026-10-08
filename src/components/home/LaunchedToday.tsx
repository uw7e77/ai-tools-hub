import { ArrowRight } from 'lucide-react'
import { launches } from '../../data/launches'
import type { Launch } from '../../types'
import { LaunchCard } from '../cards/LaunchCard'
import { SectionHeader } from '../ui/SectionHeader'
import css from './LaunchedToday.module.css'

const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00`))
}

function localTodayKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

const groupedLaunches = new Map<string, Launch[]>()
for (const launch of launches) {
  const items = groupedLaunches.get(launch.launchedAt)
  if (items) {
    items.push(launch)
  } else {
    groupedLaunches.set(launch.launchedAt, [launch])
  }
}

export function LaunchedToday() {
  // No real launch records are catalogued yet — hide the section entirely
  // rather than render an empty feed or invent launch dates.
  if (launches.length === 0) return null
  const todayKey = localTodayKey()

  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          title="Launched today"
          description="Fresh AI tools added to the directory, checked and catalogued."
          href="/new"
          linkLabel="See all launches"
        />
        <div className={css.feed}>
          {[...groupedLaunches.entries()].map(([date, items]) => (
            <div key={date} className={css.group}>
              <h3 className={css.dateHeading}>
                {date === todayKey ? `Today · ${formatDate(date)}` : formatDate(date)}
              </h3>
              <ul className={css.list}>
                {items.map((launch) => (
                  <li key={launch.slug}>
                    <LaunchCard launch={launch} dateLabel={formatDate(launch.launchedAt)} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={css.morning}>
          <span>Get this every morning in your inbox.</span>
          <a className={css.morningLink} href="#newsletter">
            Subscribe to the daily digest
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
