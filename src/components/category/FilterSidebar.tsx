import type { PricingType } from '../../types'
import type { PricingFacet, SubcategoryFacet } from '../../features/category/listing'
import { SortDropdown } from '../ui/SortDropdown'
import css from './FilterSidebar.module.css'

interface FilterSidebarProps {
  facets: PricingFacet[]
  pricing: PricingType[]
  tested: boolean
  subcategories: SubcategoryFacet[]
  subcategory: string | null
  hasActiveFilters: boolean
  onTogglePricing: (value: PricingType) => void
  onToggleTested: () => void
  onSubcategoryChange: (value: string | null) => void
  onClear: () => void
}

export function FilterSidebar({
  facets,
  pricing,
  tested,
  subcategories,
  subcategory,
  hasActiveFilters,
  onTogglePricing,
  onToggleTested,
  onSubcategoryChange,
  onClear,
}: FilterSidebarProps) {
  // Up to ~48 subcategories in a category — a compact select stays usable
  // where a checkbox list would not.
  const subcategoryOptions = [
    { value: '', label: 'All subcategories' },
    ...subcategories.map((facet) => ({
      value: facet.value,
      label: `${facet.label} (${facet.count})`,
    })),
  ]

  return (
    <div className={css.sidebar}>
      <div className={css.head}>
        <h2 className={css.title}>Filters</h2>
        {hasActiveFilters ? (
          <button type="button" className={css.clear} onClick={onClear}>
            Clear filters
          </button>
        ) : null}
      </div>

      {subcategories.length > 0 ? (
        <fieldset className={css.group}>
          <legend className={css.legend}>Subcategory</legend>
          <SortDropdown
            value={subcategory ?? ''}
            onChange={(value) => onSubcategoryChange(value === '' ? null : value)}
            options={subcategoryOptions}
            label="Filter by subcategory"
          />
        </fieldset>
      ) : null}

      <fieldset className={css.group}>
        <legend className={css.legend}>Pricing</legend>
        <ul className={css.options}>
          {facets.map((facet) => (
            <li key={facet.value}>
              <label className={css.option}>
                <input
                  type="checkbox"
                  className={css.checkbox}
                  checked={pricing.includes(facet.value)}
                  onChange={() => onTogglePricing(facet.value)}
                />
                <span className={css.optionLabel}>{facet.label}</span>
                <span className={css.optionCount}>({facet.count})</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset className={css.group}>
        <legend className={css.legend}>Availability</legend>
        <label className={css.option}>
          <input
            type="checkbox"
            className={css.checkbox}
            checked={tested}
            onChange={onToggleTested}
          />
          <span className={css.optionLabel}>Tested only</span>
        </label>
      </fieldset>
    </div>
  )
}
