import { ChevronDown } from 'lucide-react'
import css from './SortDropdown.module.css'

interface SortDropdownProps<T extends string> {
  value: T
  onChange: (value: T) => void
  options: ReadonlyArray<{ value: T; label: string }>
  label?: string
}

export function SortDropdown<T extends string>({ value, onChange, options, label = 'Sort' }: SortDropdownProps<T>) {
  return (
    <div className={css.wrap}>
      <select
        className={css.select}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className={css.chevron} aria-hidden="true" />
    </div>
  )
}
