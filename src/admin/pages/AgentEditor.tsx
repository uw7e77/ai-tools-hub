import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAdminData, slugify } from '../AdminData'
import type { Agent, Difficulty, PricingType } from '../../types'
import css from '../AdminCommon.module.css'

const DIFFICULTIES: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

export function AgentEditor() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { agents, setAgents } = useAdminData()
  const existing = slug ? agents.find((a) => a.slug === slug) : undefined
  const isNew = !slug

  const [name, setName] = useState(existing?.name ?? '')
  const [slugField, setSlugField] = useState(existing?.slug ?? '')
  const [company, setCompany] = useState(existing?.company ?? '')
  const [tagline, setTagline] = useState(existing?.tagline ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [difficulty, setDifficulty] = useState<Difficulty>(existing?.difficulty ?? 'Beginner')
  const [pricing, setPricing] = useState<'' | PricingType>(existing?.pricing ?? '')
  const [officialUrl, setOfficialUrl] = useState(existing?.officialUrl ?? '')
  const [logo, setLogo] = useState(existing?.logo ?? '')
  const [capabilities, setCapabilities] = useState((existing?.capabilities ?? []).join(', '))
  const [error, setError] = useState('')

  if (slug && !existing) {
    return (
      <div className={css.panel}>
        <h1 className={css.panelTitle}>Agent not found</h1>
        <p className={css.pageSub}>
          No agent with slug “{slug}”. <Link to="/admin/agents">Back to agents</Link>
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
    const clash = agents.find((a) => a.slug === finalSlug && a.slug !== existing?.slug)
    if (clash) return setError(`Slug “${finalSlug}” is already used by ${clash.name}.`)

    const record: Agent = {
      ...(existing ?? ({} as Agent)),
      slug: finalSlug,
      name: name.trim(),
      logo: logo.trim() || `/logos/${finalSlug}.png`,
      company: company.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      difficulty,
      pricing: pricing || null,
      officialUrl: officialUrl.trim(),
      capabilities: capabilities.split(',').map((s) => s.trim()).filter(Boolean),
    }
    setAgents(
      existing
        ? agents.map((a) => (a.slug === existing.slug ? record : a))
        : [record, ...agents],
    )
    navigate('/admin/agents')
  }

  return (
    <>
      <div className={css.pageHead}>
        <div>
          <h1 className={css.pageTitle}>{isNew ? 'Add an agent' : `Edit ${existing?.name}`}</h1>
          <p className={css.pageSub}>
            Changes save to the working copy on this device. Export agents.json to publish.
          </p>
        </div>
        <Link className={css.btn} to="/admin/agents">
          ← All agents
        </Link>
      </div>

      <form className={css.form} onSubmit={onSubmit}>
        <label className={css.field}>
          Name *
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className={css.field}>
          Slug (URL name)
          <input value={slugField} onChange={(e) => setSlugField(e.target.value)} placeholder={name ? slugify(name) : 'e.g. my-agent'} />
        </label>
        <label className={css.field}>
          Tagline
          <input value={tagline} onChange={(e) => setTagline(e.target.value)} />
        </label>
        <label className={css.field}>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label className={css.field}>
          Difficulty
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className={css.field}>
          Pricing
          <select value={pricing} onChange={(e) => setPricing(e.target.value as '' | PricingType)}>
            <option value="">Not set</option>
            <option value="free">Free</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
            <option value="open-source">Open source</option>
            <option value="free-trial">Free trial</option>
          </select>
        </label>
        <label className={css.field}>
          Company
          <input value={company} onChange={(e) => setCompany(e.target.value)} />
        </label>
        <label className={css.field}>
          Official website URL *
          <input value={officialUrl} onChange={(e) => setOfficialUrl(e.target.value)} placeholder="https://…" required />
        </label>
        <label className={css.field}>
          Logo path
          <input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="/logos/name.png" />
        </label>
        <label className={css.field}>
          Capabilities (comma separated)
          <input value={capabilities} onChange={(e) => setCapabilities(e.target.value)} />
        </label>
        {error ? (
          <p className={css.banner} role="alert">
            {error}
          </p>
        ) : null}
        <div className={css.formRow}>
          <button type="submit" className={`${css.btn} ${css.btnPrimary}`}>
            {isNew ? 'Add agent' : 'Save changes'}
          </button>
          <Link className={css.btn} to="/admin/agents">
            Cancel
          </Link>
        </div>
      </form>
    </>
  )
}
