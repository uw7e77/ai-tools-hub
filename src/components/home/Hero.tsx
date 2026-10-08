import { useNavigate } from 'react-router-dom'
import { popularSearches } from '../../data/site'
import { flattenResults, searchAll } from '../../features/search/useSearchIndex'
import { SearchBar } from '../search/SearchBar'
import css from './Hero.module.css'

export function Hero() {
  const navigate = useNavigate()

  const runPopularSearch = (term: string) => {
    // No /search results route exists — jump to the top match for the term,
    // same as pressing Enter in the search bar.
    const first = flattenResults(searchAll(term))[0]
    if (first) {
      navigate(first.href)
    }
  }

  return (
    <section className={css.hero}>
      <div className={css.glow} aria-hidden="true" />
      <div className="container-wide">
        <div className={css.inner}>
          <p className={css.eyebrow}>A curated directory of AI tools</p>
          <h1 className={css.title}>
            Find the right AI tool,{' '}
            <em className={css.accent}>
              faster.
              <svg
                className={css.squiggle}
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M3 8C13 3 23 3 33 7C43 11 53 11 63 6C73 2 83 3 93 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </em>
          </h1>
          <p className={css.subtitle}>
            Discover, compare and learn the AI tools that actually work — trending tools, AI
            agents, companies and tutorials in one place.
          </p>
          <div className={css.search}>
            <SearchBar variant="large" placeholder="Search AI tools, agents, companies…" />
          </div>
          <div className={css.popular}>
            <span className={css.popularLabel}>Popular:</span>
            <ul className={css.popularList}>
              {popularSearches.map((term) => (
                <li key={term}>
                  <button
                    type="button"
                    className={css.popularLink}
                    onClick={() => runPopularSearch(term)}
                  >
                    {term}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
