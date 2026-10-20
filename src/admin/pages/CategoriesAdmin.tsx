import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAdminData, downloadJson, hasLocalCopy } from '../AdminData'
import { CategoryIcon } from '../../components/ui/CategoryIcon'
import css from '../AdminCommon.module.css'

export function CategoriesAdmin() {
  const { categories, setCategories, resetCategories, tools } = useAdminData()
  const [editing, setEditing] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('')

  const editingCat = categories.find((c) => c.slug === editing)

  function startEdit(slug: string) {
    const cat = categories.find((c) => c.slug === slug)
    if (!cat) return
    setEditing(slug)
    setName(cat.name)
    setDescription(cat.description)
    setIcon(cat.icon)
  }

  function onSave(e: FormEvent) {
    e.preventDefault()
    if (!editingCat) return
    setCategories(
      categories.map((c) =>
        c.slug === editingCat.slug
          ? { ...c, name: name.trim() || c.name, description: description.trim(), icon: icon.trim() || c.icon }
          : c,
      ),
    )
    setEditing(null)
  }

  return (
    <>
      <div className={css.pageHead}>
        <div>
          <h1 className={css.pageTitle}>Categories</h1>
          <p className={css.pageSub}>
            {categories.length} categories. Slugs stay fixed — tool links depend on them.
          </p>
        </div>
        <button type="button" className={css.btn} onClick={() => downloadJson('categories.json', categories)}>
          Export categories.json
        </button>
      </div>

      {hasLocalCopy('categories') ? (
        <p className={css.banner}>
          You have unpublished edits saved on this device.{' '}
          <button type="button" className={css.btn} onClick={resetCategories}>
            Discard edits
          </button>
        </p>
      ) : null}

      <div className={css.tableWrap}>
        <table className={css.table}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Slug</th>
              <th>Tools</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.slug}>
                <td>
                  <span className={css.cellName}>
                    <CategoryIcon name={cat.icon} size={18} />
                    {cat.name}
                  </span>
                </td>
                <td className={css.cellMuted}>{cat.slug}</td>
                <td className={css.cellMuted}>
                  {tools.filter((t) => t.category === cat.slug).length.toLocaleString()}
                </td>
                <td>
                  <button type="button" className={css.btn} onClick={() => startEdit(cat.slug)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingCat ? (
        <form className={`${css.form} ${css.panel}`} onSubmit={onSave} style={{ marginTop: 24 }}>
          <h2 className={css.panelTitle}>Edit {editingCat.name}</h2>
          <label className={css.field}>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className={css.field}>
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label className={css.field}>
            Icon (Lucide name, e.g. Zap)
            <input value={icon} onChange={(e) => setIcon(e.target.value)} />
          </label>
          <div className={css.formRow}>
            <button type="submit" className={`${css.btn} ${css.btnPrimary}`}>
              Save category
            </button>
            <button type="button" className={css.btn} onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}
    </>
  )
}
