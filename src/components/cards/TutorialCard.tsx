import { BookOpen, Clock, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Tutorial } from '../../types'
import { tutorialCategoryLabel } from '../tutorial/categoryLabels'
import css from './TutorialCard.module.css'

interface TutorialCardProps {
  tutorial: Tutorial
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <article className={css.card}>
      <div className={css.thumb} aria-hidden="true">
        <BookOpen size={28} className={css.thumbIcon} />
      </div>
      <div className={css.body}>
        <span className={css.category}>{tutorialCategoryLabel(tutorial.category)}</span>
        <h3 className={css.title}>
          <Link to={`/tutorial/${tutorial.slug}`}>{tutorial.title}</Link>
        </h3>
        <p className={css.description}>{tutorial.description}</p>
        <div className={css.meta}>
          <span className={css.duration}>
            <Clock size={14} aria-hidden="true" />
            {tutorial.durationMinutes} min
          </span>
          <span className={css.difficulty}>{tutorial.difficulty}</span>
          <span className={css.date}>
            <Calendar size={14} aria-hidden="true" />
            {formatDate(tutorial.publishedDate)}
          </span>
        </div>
        <Link className={css.cta} to={`/tutorial/${tutorial.slug}`}>
          Read Tutorial
          <BookOpen size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
