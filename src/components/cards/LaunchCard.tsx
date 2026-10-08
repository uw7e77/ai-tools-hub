import { Link } from 'react-router-dom'
import { categoryBySlug, toolBySlug } from '../../data/lookups'
import type { Launch } from '../../types'
import { BrandLogo } from '../ui/BrandLogo'
import { NewBadge } from '../ui/Badge'
import css from './LaunchCard.module.css'

interface LaunchCardProps {
  launch: Launch
  dateLabel: string
}

export function LaunchCard({ launch, dateLabel }: LaunchCardProps) {
  const tool = toolBySlug.get(launch.toolSlug)
  const category = categoryBySlug.get(launch.category)

  return (
    <article className={css.card}>
      <BrandLogo logo={tool?.logo ?? ''} name={launch.name} size={40} />
      <div className={css.body}>
        <div className={css.nameRow}>
          <h3 className={css.name}>
            <Link to={`/tool/${launch.toolSlug}`}>{launch.name}</Link>
          </h3>
          {launch.isNew ? <NewBadge /> : null}
        </div>
        <p className={css.description}>{launch.description}</p>
      </div>
      <div className={css.side}>
        {category ? <span className={css.category}>{category.name}</span> : null}
        <time className={css.date} dateTime={launch.launchedAt}>
          {dateLabel}
        </time>
      </div>
    </article>
  )
}
