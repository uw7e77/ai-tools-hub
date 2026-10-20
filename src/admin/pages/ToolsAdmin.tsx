import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminData, downloadJson, hasLocalCopy } from '../AdminData'
import { BrandLogo } from '../../components/ui/BrandLogo'
import { PRICING_LABELS } from '../../features/category/listing'
import css from '../AdminCommon.module.css'

const PAGE_SIZE = 25

export function ToolsAdmin() {
  const { tools, setTools, resetTools, categories } = useAdminData()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tools.filter((t) => {
      if (category && t.category !== category) return false
      if (!q) return true
      return (
        t.name.toLowerCase().includes(q) ||
        t.slug.includes(q) ||
        (t.company ?? '').toLowerCase().includes(q)
      )
    })
  }, [tools, query, category])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function onDelete(slug: string, name: string) {
    if (!window.confirm(`Delete "${name}" from the working copy? You can reset anytime.`)) return
    setTools(tools.filter((t) => t.slug !== slug))
  }

  return (
    <>
      <div className={css.pageHead}>
        <div>
          <h1 className={css.pageTitle}>Tools</h1>
          <p className={css.pageSub}>
            {filtered.length.toLocaleString()} of {tools.length.toLocaleString()} tools
          </p>
        </div>
        <div className={css.formRow}>
          <button type="button" className={css.btn} onClick={() => downloadJson('tools.json', tools)}>
            Export tools.json
          </button>
          <Link className={`${css.btn} ${css.btnPrimary}`} to="/admin/tools/new">
            + Add tool
          </Link>
        </div>
      </div>

      {hasLocalCopy('tools') ? (
        <p className={css.banner}>
          You have unpublished edits saved on this device. Export tools.json and replace
          public/data/tools.json to publish them.{' '}
          <button type="button" className={css.btn} onClick={resetTools}>
            Discard edits
          </button>
        </p>
      ) : null}

      <div className={css.toolbar}>
        <input
          className={css.searchInput}
          type="search"
          placeholder="Search by name, slug or company…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setPage(1)
          }}
          aria-label="Search tools"
        />
        <select
          className={css.select}
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            setPage(1)
          }}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className={css.tableWrap}>
        <table className={css.table}>
          <thead>
            <tr>
              <th>Tool</th>
              <th>Category</th>
              <th>Pricing</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((tool) => (
              <tr key={tool.slug}>
                <td>
                  <span className={css.cellName}>
                    <BrandLogo logo={tool.logo} name={tool.name} size={28} />
                    {tool.name}
                  </span>
                </td>
                <td className={css.cellMuted}>{tool.category}</td>
                <td className={css.cellMuted}>
                  {tool.pricing ? PRICING_LABELS[tool.pricing] : '—'}
                </td>
                <td className={css.cellMuted}>{tool.company ?? '—'}</td>
                <td>
                  <span className={css.formRow}>
                    <Link className={css.btn} to={`/admin/tools/${tool.slug}`}>
                      Edit
                    </Link>
                    <button
                      type="button"
                      className={`${css.btn} ${css.btnDanger}`}
                      onClick={() => onDelete(tool.slug, tool.name)}
                    >
                      Delete
                    </button>
                  </span>
                </td>
              </tr>
            ))}
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={5} className={css.empty}>
                  No tools match your search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className={css.pager}>
        <button
          type="button"
          className={css.btn}
          disabled={safePage <= 1}
          onClick={() => setPage(safePage - 1)}
        >
          ← Prev
        </button>
        <span>
          Page {safePage} of {pageCount}
        </span>
        <button
          type="button"
          className={css.btn}
          disabled={safePage >= pageCount}
          onClick={() => setPage(safePage + 1)}
        >
          Next →
        </button>
      </div>
    </>
  )
}
