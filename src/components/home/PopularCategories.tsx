import { categories } from '../../data/categories'
import { CategoryPill } from '../cards/CategoryPill'
import { SectionHeader } from '../ui/SectionHeader'
import css from './PopularCategories.module.css'

export function PopularCategories() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          title="Popular categories"
          description="Jump straight into the area you need."
          href="/categories"
          linkLabel="All categories"
        />
        <ul className={css.list}>
          {categories.map((category) => (
            <li key={category.slug}>
              <CategoryPill category={category} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
