import { Link } from 'react-router-dom'
import { useAdminData } from '../AdminData'
import { db } from '../../data/db'
import css from '../AdminCommon.module.css'

export function Dashboard() {
  const { tools, agents, categories } = useAdminData()

  const byCategory = categories
    .map((cat) => ({
      slug: cat.slug,
      name: cat.name,
      count: tools.filter((t) => t.category === cat.slug).length,
    }))
    .sort((a, b) => b.count - a.count)
  const max = Math.max(1, ...byCategory.map((c) => c.count))

  const missingPricing = tools.filter((t) => !t.pricing).length
  const missingCompany = tools.filter((t) => !t.company).length

  return (
    <>
      <div className={css.pageHead}>
        <div>
          <h1 className={css.pageTitle}>Dashboard</h1>
          <p className={css.pageSub}>Everything on AIToolsHub, at a glance.</p>
        </div>
        <Link className={`${css.btn} ${css.btnPrimary}`} to="/admin/tools/new">
          + Add a tool
        </Link>
      </div>

      <div className={css.statGrid}>
        <div className={css.statCard}>
          <p className={css.statValue}>{tools.length.toLocaleString()}</p>
          <p className={css.statLabel}>AI tools</p>
        </div>
        <div className={css.statCard}>
          <p className={css.statValue}>{agents.length.toLocaleString()}</p>
          <p className={css.statLabel}>AI agents</p>
        </div>
        <div className={css.statCard}>
          <p className={css.statValue}>{categories.length}</p>
          <p className={css.statLabel}>Categories</p>
        </div>
        <div className={css.statCard}>
          <p className={css.statValue}>{db.companies.length}</p>
          <p className={css.statLabel}>Company profiles</p>
        </div>
        <div className={css.statCard}>
          <p className={css.statValue}>{db.tutorials.length}</p>
          <p className={css.statLabel}>Tutorials</p>
        </div>
        <div className={css.statCard}>
          <p className={css.statValue}>{db.toolVideos.length}</p>
          <p className={css.statLabel}>Video tutorials</p>
        </div>
      </div>

      <div className={css.panel}>
        <h2 className={css.panelTitle}>Tools per category</h2>
        {byCategory.map((cat) => (
          <div key={cat.slug} className={css.barRow}>
            <span>{cat.name}</span>
            <span className={css.barTrack}>
              <span className={css.barFill} style={{ width: `${(cat.count / max) * 100}%`, display: 'block' }} />
            </span>
            <span>{cat.count.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className={css.panel}>
        <h2 className={css.panelTitle}>Needs attention</h2>
        <p className={css.pageSub}>
          {missingPricing.toLocaleString()} tools have no pricing info · {missingCompany.toLocaleString()} tools
          have no company listed. See <Link to="/admin/health">Data Health</Link> for the full list.
        </p>
      </div>
    </>
  )
}
