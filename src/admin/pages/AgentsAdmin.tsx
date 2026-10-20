import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminData, downloadJson, hasLocalCopy } from '../AdminData'
import { BrandLogo } from '../../components/ui/BrandLogo'
import css from '../AdminCommon.module.css'

const PAGE_SIZE = 25

export function AgentsAdmin() {
  const { agents, setAgents, resetAgents } = useAdminData()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return agents
    return agents.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.slug.includes(q) ||
        (a.company ?? '').toLowerCase().includes(q),
    )
  }, [agents, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function onDelete(slug: string, name: string) {
    if (!window.confirm(`Delete agent "${name}" from the working copy? You can reset anytime.`)) return
    setAgents(agents.filter((a) => a.slug !== slug))
  }

  return (
    <>
      <div className={css.pageHead}>
        <div>
          <h1 className={css.pageTitle}>AI Agents</h1>
          <p className={css.pageSub}>
            {filtered.length.toLocaleString()} of {agents.length.toLocaleString()} agents
          </p>
        </div>
        <div className={css.formRow}>
          <button type="button" className={css.btn} onClick={() => downloadJson('agents.json', agents)}>
            Export agents.json
          </button>
          <Link className={`${css.btn} ${css.btnPrimary}`} to="/admin/agents/new">
            + Add agent
          </Link>
        </div>
      </div>

      {hasLocalCopy('agents') ? (
        <p className={css.banner}>
          You have unpublished edits saved on this device. Export agents.json and replace
          public/data/agents.json to publish them.{' '}
          <button type="button" className={css.btn} onClick={resetAgents}>
            Discard edits
          </button>
        </p>
      ) : null}

      <div className={css.toolbar}>
        <input
          className={css.searchInput}
          type="search"
          placeholder="Search agents…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setPage(1)
          }}
          aria-label="Search agents"
        />
      </div>

      <div className={css.tableWrap}>
        <table className={css.table}>
          <thead>
            <tr>
              <th>Agent</th>
              <th>Difficulty</th>
              <th>Pricing</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((agent) => (
              <tr key={agent.slug}>
                <td>
                  <span className={css.cellName}>
                    <BrandLogo logo={agent.logo} name={agent.name} size={28} />
                    {agent.name}
                  </span>
                </td>
                <td className={css.cellMuted}>{agent.difficulty}</td>
                <td className={css.cellMuted}>{agent.pricing ?? '—'}</td>
                <td className={css.cellMuted}>{agent.company ?? '—'}</td>
                <td>
                  <span className={css.formRow}>
                    <Link className={css.btn} to={`/admin/agents/${agent.slug}`}>
                      Edit
                    </Link>
                    <button
                      type="button"
                      className={`${css.btn} ${css.btnDanger}`}
                      onClick={() => onDelete(agent.slug, agent.name)}
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
                  No agents match your search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className={css.pager}>
        <button type="button" className={css.btn} disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>
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
