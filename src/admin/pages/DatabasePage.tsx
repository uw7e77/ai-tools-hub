import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useAdminData, downloadJson } from '../AdminData'
import { db } from '../../data/db'
import css from '../AdminCommon.module.css'

export function DatabasePage() {
  const { tools, setTools, agents, setAgents, categories } = useAdminData()
  const [message, setMessage] = useState('')
  const toolsFileRef = useRef<HTMLInputElement>(null)
  const agentsFileRef = useRef<HTMLInputElement>(null)

  function importFile(kind: 'tools' | 'agents') {
    return async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      e.target.value = ''
      if (!file) return
      try {
        const parsed = JSON.parse(await file.text()) as unknown
        if (!Array.isArray(parsed)) throw new Error('not an array')
        if (kind === 'tools') {
          setTools(parsed as typeof tools)
          setMessage(`Imported ${parsed.length.toLocaleString()} tools into the working copy. Export tools.json to publish.`)
        } else {
          setAgents(parsed as typeof agents)
          setMessage(`Imported ${parsed.length.toLocaleString()} agents into the working copy. Export agents.json to publish.`)
        }
      } catch {
        setMessage('Import failed — that file is not valid JSON data for this section.')
      }
    }
  }

  const files: Array<{ name: string; count: number; data: unknown; note: string }> = [
    { name: 'tools.json', count: tools.length, data: tools, note: 'Working copy (includes your edits)' },
    { name: 'agents.json', count: agents.length, data: agents, note: 'Working copy (includes your edits)' },
    { name: 'categories.json', count: categories.length, data: categories, note: 'Working copy (includes your edits)' },
    { name: 'companies.json', count: db.companies.length, data: db.companies, note: 'Live database' },
    { name: 'company-details.json', count: Object.keys(db.companyDetails).length, data: db.companyDetails, note: 'Live database' },
    { name: 'tutorials.json', count: db.tutorials.length, data: db.tutorials, note: 'Live database' },
    { name: 'tool-videos.json', count: db.toolVideos.length, data: db.toolVideos, note: 'Live database' },
    {
      name: 'navigation.json',
      count: db.navigation.primaryNav.length + db.navigation.footerColumns.length,
      data: db.navigation,
      note: 'Live database',
    },
    { name: 'launches.json', count: db.launches.length, data: db.launches, note: 'Live database (empty until launches are catalogued)' },
  ]

  return (
    <>
      <div className={css.pageHead}>
        <div>
          <h1 className={css.pageTitle}>Database</h1>
          <p className={css.pageSub}>
            The website reads JSON files from public/data/. Export a file here, replace it in
            public/data/, and the site picks it up — no rebuild needed.
          </p>
        </div>
      </div>

      {message ? (
        <p className={css.banner} role="status">
          {message}
        </p>
      ) : null}

      <div className={css.panel}>
        <h2 className={css.panelTitle}>Import into working copy</h2>
        <p className={css.pageSub}>
          Upload a tools.json or agents.json (for example, one you built in a spreadsheet) to
          replace the working copy. Nothing goes live until you export and replace the file in
          public/data/.
        </p>
        <div className={css.formRow}>
          <button type="button" className={css.btn} onClick={() => toolsFileRef.current?.click()}>
            Import tools.json
          </button>
          <button type="button" className={css.btn} onClick={() => agentsFileRef.current?.click()}>
            Import agents.json
          </button>
          <input ref={toolsFileRef} type="file" accept="application/json" hidden onChange={importFile('tools')} />
          <input ref={agentsFileRef} type="file" accept="application/json" hidden onChange={importFile('agents')} />
        </div>
      </div>

      <div className={css.tableWrap}>
        <table className={css.table}>
          <thead>
            <tr>
              <th>File</th>
              <th>Records</th>
              <th>Source</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr key={f.name}>
                <td className={css.cellName}>{f.name}</td>
                <td className={css.cellMuted}>{f.count.toLocaleString()}</td>
                <td className={css.cellMuted}>{f.note}</td>
                <td>
                  <button type="button" className={css.btn} onClick={() => downloadJson(f.name, f.data)}>
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
