import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAdminData, slugify } from '../AdminData'
import { db } from '../../data/db'
import type { PricingType, Tool } from '../../types'
import css from '../AdminCommon.module.css'

const PRICING_OPTIONS: Array<{ value: '' | PricingType; label: string }> = [
  { value: '', label: 'Not set' },
  { value: 'free', label: 'Free' },
  { value: 'freemium', label: 'Freemium' },
  { value: 'paid', label: 'Paid' },
  { value: 'open-source', label: 'Open source' },
  { value: 'free-trial', label: 'Free trial' },
]

export function ToolEditor() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { tools, setTools, categories } = useAdminData()
  const existing = slug ? tools.find((t) => t.slug === slug) : undefined
  const isNew = !slug

  const [name, setName] = useState(existing?.name ?? '')
  const [slugField, setSlugField] = useState(existing?.slug ?? '')
  const [company, setCompany] = useState(existing?.company ?? '')
  const [category, setCategory] = useState<string>(existing?.category ?? categories[0]?.slug ?? 'productivity')
  const [subcategory, setSubcategory] = useState(existing?.subcategory ?? '')
  const [pricing, setPricing] = useState<'' | PricingType>(existing?.pricing ?? '')
  const [description, setDescription] = useState(existing?.shortDescription ?? '')
  const [officialUrl, setOfficialUrl] = useState(existing?.officialUrl ?? '')
  const [affiliateUrl, setAffiliateUrl] = useState(existing?.affiliateUrl ?? '')
  const [logo, setLogo] = useState(existing?.logo ?? '')
  const [tags, setTags] = useState((existing?.tags ?? []).join(', '))
  const [platforms, setPlatforms] = useState((existing?.platforms ?? []).join(', '))
  const [error, setError] = useState('')

  if (slug && !existing) {
    return (
      <div className={css.panel}>
        <h1 className={css.panelTitle}>Tool not found</h1>
        <p className={css.pageSub}>
          No tool with slug “{slug}” in the working copy. <Link to="/admin/tools">Back to tools</Link>
        </p>
      </div>
    )
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const finalSlug = (slugField || slugify(name)).trim()
    if (!name.trim()) return setError('Name is required.')
    if (!finalSlug) return setError('Slug is required.')
    if (!/^https?:\/\//.test(officialUrl)) return setError('Official URL must start with http:// or https://')
    const clash = tools.find((t) => t.slug === finalSlug && t.slug !== existing?.slug)
    if (clash) return setError(`Slug “${finalSlug}” is already used by ${clash.name}.`)

    const record: Tool = {
      ...(existing ?? ({} as Tool)),
      slug: finalSlug,
      name: name.trim(),
      logo: logo.trim() || `/logos/${finalSlug}.png`,
      company: company.trim() || null,
      category: category as Tool['category'],
      subcategory: subcategory.trim() || null,
      shortDescription: description.trim(),
      pricing: pricing || null,
      officialUrl: officialUrl.trim(),
      affiliateUrl: affiliateUrl.trim() || null,
      tags: tags.split(',').map((s) => s.trim()).filter(Boolean),
      platforms: platforms.split(',').map((s) => s.trim()).filter(Boolean),
    }
    if (isNew) {
      record.tested = undefined
      record.isNew = true
    }
    setTools(
      existing
        ? tools.map((t) => (t.slug === existing.slug ? record : t))
        : [record, ...tools],
    )
    navigate('/admin/tools')
  }

  return (
    <>
      <div className={css.pageHead}>
        <div>
          <h1 className={css.pageTitle}>{isNew ? 'Add a tool' : `Edit ${existing?.name}`}</h1>
          <p className={css.pageSub}>
            Changes save to the working copy on this device. Export tools.json to publish.
          </p>
        </div>
        <Link className={css.btn} to="/admin/tools">
          ← All tools
        </Link>
      </div>

      <form className={css.form} onSubmit={onSubmit}>
        <label className={css.field}>
          Name *
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className={css.field}>
          Slug (URL name)
          <input
            value={slugField}
            onChange={(e) => setSlugField(e.target.value)}
            placeholder={name ? slugify(name) : 'e.g. my-tool'}
          />
        </label>
        <label className={css.field}>
          Short description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label className={css.field}>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.length > 0
              ? categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))
              : db.categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
          </select>
        </label>
        <label className={css.field}>
          Subcategory
          <input value={subcategory} onChange={(e) => setSubcategory(e.target.value)} />
        </label>
        <label className={css.field}>
          Pricing
          <select value={pricing} onChange={(e) => setPricing(e.target.value as '' | PricingType)}>
            {PRICING_OPTIONS.map((o) => (
              <option key={o.label} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className={css.field}>
          Company
          <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name (blank if none)" />
        </label>
        <label className={css.field}>
          Official website URL *
          <input value={officialUrl} onChange={(e) => setOfficialUrl(e.target.value)} placeholder="https://…" required />
        </label>
        <label className={css.field}>
          Affiliate URL (optional)
          <input value={affiliateUrl} onChange={(e) => setAffiliateUrl(e.target.value)} placeholder="https://…" />
        </label>
        <label className={css.field}>
          Logo path
          <input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="/logos/name.png" />
        </label>
        <label className={css.field}>
          Tags (comma separated)
          <input value={tags} onChange={(e) => setTags(e.target.value)} />
        </label>
        <label className={css.field}>
          Platforms (comma separated)
          <input value={platforms} onChange={(e) => setPlatforms(e.target.value)} placeholder="Web, iOS, Android" />
        </label>
        {error ? (
          <p className={css.banner} role="alert">
            {error}
          </p>
        ) : null}
        <div className={css.formRow}>
          <button type="submit" className={`${css.btn} ${css.btnPrimary}`}>
            {isNew ? 'Add tool' : 'Save changes'}
          </button>
          <Link className={css.btn} to="/admin/tools">
            Cancel
          </Link>
        </div>
      </form>
    </>
  )
}
