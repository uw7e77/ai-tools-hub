import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminData } from '../AdminData'
import { db, loadAgentDetails, loadToolDetails } from '../../data/db'
import css from '../AdminCommon.module.css'

const SAMPLE = 12

export function HealthPage() {
  const { tools, agents } = useAdminData()
  const [detailsReady, setDetailsReady] = useState(db.toolDetailsLoaded && db.agentDetailsLoaded)

  useEffect(() => {
    let alive = true
    Promise.all([loadToolDetails(), loadAgentDetails()])
      .then(() => {
        if (alive) setDetailsReady(true)
      })
      .catch(() => {
        if (alive) setDetailsReady(true)
      })
    return () => {
      alive = false
    }
  }, [])

  const checks = useMemo(() => {
    const dupSlugs = (() => {
      const seen = new Set<string>()
      const dups: string[] = []
      for (const t of tools) {
        if (seen.has(t.slug)) dups.push(t.slug)
        seen.add(t.slug)
      }
      return dups
    })()
    return [
      {
        label: 'Tools with no pricing info',
        items: tools.filter((t) => !t.pricing).map((t) => t.slug),
        fix: 'tools',
      },
      {
        label: 'Tools with no company listed',
        items: tools.filter((t) => !t.company).map((t) => t.slug),
        fix: 'tools',
      },
      {
        label: 'Tools with a very short description (< 40 chars)',
        items: tools.filter((t) => (t.shortDescription ?? '').length < 40).map((t) => t.slug),
        fix: 'tools',
      },
      {
        label: 'Tools with no tags',
        items: tools.filter((t) => !t.tags?.length).map((t) => t.slug),
        fix: 'tools',
      },
      {
        label: 'Duplicate tool slugs',
        items: dupSlugs,
        fix: 'tools',
      },
      {
        label: 'Agents with no capabilities listed',
        items: agents.filter((a) => !a.capabilities?.length).map((a) => a.slug),
        fix: 'agents',
      },
      ...(detailsReady
        ? [
            {
              label: 'Tools with no detail page content yet',
              items: tools.filter((t) => !db.toolDetails[t.slug]).map((t) => t.slug),
              fix: 'tools',
            },
            {
              label: 'Agents with no detail content yet',
              items: agents.filter((a) => !db.agentDetails[a.slug]).map((a) => a.slug),
              fix: 'agents',
            },
          ]
        : []),
    ]
  }, [tools, agents, detailsReady])

  return (
    <>
      <div className={css.pageHead}>
        <div>
          <h1 className={css.pageTitle}>Data Health</h1>
          <p className={css.pageSub}>
            Honest gaps in the database — nothing here is guessed or auto-filled. Fix records in
            the Tools / Agents sections.
          </p>
        </div>
      </div>

      {!detailsReady ? <p className={css.banner}>Loading detail records for the full check…</p> : null}

      {checks.map((check) => (
        <div key={check.label} className={css.panel}>
          <h2 className={css.panelTitle}>
            {check.label} — {check.items.length.toLocaleString()}
          </h2>
          {check.items.length === 0 ? (
            <p className={css.pageSub}>All good here.</p>
          ) : (
            <p className={css.pageSub}>
              {check.items.slice(0, SAMPLE).join(', ')}
              {check.items.length > SAMPLE ? ` …and ${(check.items.length - SAMPLE).toLocaleString()} more. ` : '. '}
              <Link to={`/admin/${check.fix}`}>Open {check.fix}</Link>
            </p>
          )}
        </div>
      ))}
    </>
  )
}
