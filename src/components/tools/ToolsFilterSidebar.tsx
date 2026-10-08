import type { CategorySlug, PricingType } from '../../types'
import type { CategoryFacet, PricingFacet } from '../../features/tools/listing'
import css from '../category/FilterSidebar.module.css'

interface ToolsFilterSidebarProps {
  categories: CategoryFacet[]
  category: CategorySlug | null
  facets: PricingFacet[]
  pricing: PricingType[]
  tested: boolean
  hasActiveFilters: boolean
  onCategoryChange: (value: CategorySlug | null) => void
  onTogglePricing: (value: PricingType) => void
  onToggleTested: () => void
  onClear: () => void
}

export function ToolsFilterSidebar({
  categories,
  category,
  facets,
  pricing,
  tested,
  hasActiveFilters,
  onCategoryChange,
  onTogglePricing,
  onToggleTested,
  onClear,
}: ToolsFilterSidebarProps) {
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

      <fieldset className={css.group}>
        <legend className={css.legend}>Category</legend>
        <ul className={css.options}>
          {categories.map((facet) => (
            <li key={facet.value}>
              <label className={css.option}>
                <input
                  type="radio"
                  name="tools-category"
                  className={css.checkbox}
                  checked={category === facet.value}
                  onChange={() => onCategoryChange(category === facet.value ? null : facet.value)}
                />
                <span className={css.optionLabel}>{facet.label}</span>
                <span className={css.optionCount}>({facet.count})</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

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
