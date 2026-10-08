import type { Tool } from '../../types'
import { ToolCard } from './ToolCard'
import css from './ToolGrid.module.css'

interface ToolGridProps {
  tools: Tool[]
}

export function ToolGrid({ tools }: ToolGridProps) {
  return (
    <ul className={css.grid}>
      {tools.map((tool) => (
        <li key={tool.slug} className={css.item}>
          <ToolCard tool={tool} />
        </li>
      ))}
    </ul>
  )
}
