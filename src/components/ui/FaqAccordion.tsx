import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type { FaqItem } from '../../features/category/content'
import { cx } from '../../utils/cx'
import css from './FaqAccordion.module.css'

interface FaqAccordionProps {
  items: FaqItem[]
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className={css.accordion}>
      {items.map((item) => {
        const open = item.id === openId
        const triggerId = `${item.id}-trigger`
        const panelId = `${item.id}-panel`
        return (
          <div key={item.id} className={cx(css.item, open && css.itemOpen)}>
            <h3 className={css.heading}>
              <button
                type="button"
                id={triggerId}
                className={css.trigger}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
              >
                <span>{item.question}</span>
                <ChevronDown size={18} className={css.chevron} aria-hidden="true" />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              inert={!open}
              className={cx(css.panel, open && css.panelOpen)}
            >
              <div className={css.panelInner}>
                <p className={css.answer}>{item.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
