// Generates the site's static data files from the REAL AIToolsHub sources.
//
//   node scripts/gen-site-data.mjs
//
// Works regardless of cwd. Real sources (never invented data):
//   - /home/hatch/workspace/ai-tools-directory/data/tools.json        (4,813 tools)
//   - /home/hatch/workspace/ai-tools-directory/data/categories.json   (11 categories)
//   - /home/hatch/workspace/goals/aitoolshub-ai-tools-directory-site/files/tutorials/*.md      (10)
//   - /home/hatch/workspace/goals/aitoolshub-ai-tools-directory-site/files/company-profiles/*.md (24)
//   - /home/hatch/workspace/ai-tools-directory/assets/logos/*.png    (logo existence checks)
//
// Honesty rules: no ratings, review counts, tested flags, featured ranks or
// "new" flags are generated — the DB does not verify them. Fields without a
// real source are emitted as null / [] per src/types.ts.

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const siteRoot = path.resolve(here, '..')
const dataDir = path.join(siteRoot, 'src', 'data')

const DB_TOOLS = path.resolve(siteRoot, '../../ai-tools-directory/data/tools.json')
const DB_CATEGORIES = path.resolve(siteRoot, '../../ai-tools-directory/data/categories.json')
const TUTORIALS_DIR = path.resolve(
  siteRoot,
  '../../goals/aitoolshub-ai-tools-directory-site/files/tutorials',
)
const COMPANIES_DIR = path.resolve(
  siteRoot,
  '../../goals/aitoolshub-ai-tools-directory-site/files/company-profiles',
)
const LOGOS_DIR = path.resolve(siteRoot, '../../ai-tools-directory/assets/logos')

const warnings = []
const warn = (msg) => {
  warnings.push(msg)
  console.warn(`  ⚠ ${msg}`)
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'))

/** Split markdown into sections keyed by their `## ` heading. */
function splitSections(md) {
  const sections = new Map()
  let current = null
  const buf = []
  const order = []
  for (const line of md.split('\n')) {
    const h = line.match(/^##\s+(.+?)\s*$/)
    if (h) {
      if (current) sections.set(current, buf.join('\n').trim())
      current = h[1].trim()
      order.push(current)
      buf.length = 0
    } else {
      buf.push(line)
    }
  }
  if (current) sections.set(current, buf.join('\n').trim())
  return { sections, order }
}

/** Strip basic markdown to plain text (for descriptions). */
function stripMd(s) {
  return (s || '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links -> text
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // italic
    .replace(/`([^`]+)`/g, '$1') // code
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

// ---------------------------------------------------------------------------
// Minimal markdown -> HTML (headings are consumed as chapter boundaries).
// Handles: paragraphs, **bold**, *italic*, `code`, [links], - bullets,
// 1. numbered lists, > quotes, ``` fenced code, | tables|, --- rules.
// ---------------------------------------------------------------------------

function inlineHtml(s) {
  let out = s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>')
  out = out.replace(/(\*\*|__)(.+?)\1/g, '<strong>$2</strong>')
  out = out.replace(/(\*|_)(.+?)\1/g, '<em>$2</em>')
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>')
  return out
}

function mdToHtml(md) {
  const lines = md.split('\n')
  const html = []
  let inCode = false
  let codeBuf = []
  let listTag = null // 'ul' | 'ol' | null
  let paraBuf = []

  const flushPara = () => {
    if (paraBuf.length) {
      html.push(`<p>${inlineHtml(paraBuf.join(' '))}</p>`)
      paraBuf = []
    }
  }
  const closeList = () => {
    if (listTag) {
      html.push(`</${listTag}>`)
      listTag = null
    }
  }
  const openList = (tag) => {
    if (listTag !== tag) {
      closeList()
      html.push(`<${tag}>`)
      listTag = tag
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/^```/.test(line)) {
      if (inCode) {
        html.push(
          `<pre><code>${codeBuf.join('\n').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`,
        )
        codeBuf = []
        inCode = false
      } else {
        flushPara()
        closeList()
        inCode = true
      }
      continue
    }
    if (inCode) {
      codeBuf.push(line)
      continue
    }
    if (/^\s*$/.test(line)) {
      flushPara()
      closeList()
      continue
    }
    if (/^---+\s*$/.test(line)) {
      flushPara()
      closeList()
      html.push('<hr />')
      continue
    }
    const quote = line.match(/^>\s?(.*)$/)
    if (quote) {
      flushPara()
      closeList()
      html.push(`<blockquote><p>${inlineHtml(quote[1])}</p></blockquote>`)
      continue
    }
    const bullet = line.match(/^\s*[-*]\s+(.*)$/)
    if (bullet) {
      flushPara()
      openList('ul')
      html.push(`<li>${inlineHtml(bullet[1])}</li>`)
      continue
    }
    const ordered = line.match(/^\s*\d+[.)]\s+(.*)$/)
    if (ordered) {
      flushPara()
      openList('ol')
      html.push(`<li>${inlineHtml(ordered[1])}</li>`)
      continue
    }
    if (/^\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      flushPara()
      closeList()
      const cells = (row) =>
        row
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((c) => inlineHtml(c.trim()))
      html.push('<table><thead><tr>' + cells(line).map((c) => `<th>${c}</th>`).join('') + '</tr></thead><tbody>')
      i += 2
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) {
        html.push('<tr>' + cells(lines[i]).map((c) => `<td>${c}</td>`).join('') + '</tr>')
        i++
      }
      i--
      html.push('</tbody></table>')
      continue
    }
    paraBuf.push(line.trim())
  }
  flushPara()
  closeList()
  return html.join('\n')
}

/** Split a tutorial body into chapters on ## / ### headings (HTML content). */
function parseChapters(body) {
  const chapters = []
  let current = null
  const usedIds = new Set()
  const pushCurrent = () => {
    if (current) {
      let id = slugify(current.title) || 'section'
      let n = 2
      while (usedIds.has(id)) id = `${slugify(current.title)}-${n++}`
      usedIds.add(id)
      chapters.push({ id, title: current.title, content: mdToHtml(current.lines.join('\n').trim()), level: current.level })
    }
  }
  for (const line of body.split('\n')) {
    const h2 = line.match(/^##\s+(.+?)\s*$/)
    const h3 = line.match(/^###\s+(.+?)\s*$/)
    if (h2 || h3) {
      pushCurrent()
      current = { title: (h2 || h3)[1], level: h2 ? 2 : 3, lines: [] }
    } else if (current) {
      current.lines.push(line)
    } else {
      // Intro text before the first heading: attach to the first chapter.
      if (!chapters._intro) chapters._intro = []
      chapters._intro.push(line)
    }
  }
  pushCurrent()
  const intro = (chapters._intro || []).join('\n').trim()
  delete chapters._intro
  if (intro && chapters.length) {
    const first = chapters[0]
    const introHtml = mdToHtml(intro)
    first.content = introHtml + (first.content ? `\n${first.content}` : '')
  } else if (intro) {
    chapters.push({ id: 'introduction', title: 'Introduction', content: mdToHtml(intro), level: 2 })
  }
  return chapters
}

// ---------------------------------------------------------------------------
// Load + validate real sources
// ---------------------------------------------------------------------------

for (const p of [DB_TOOLS, DB_CATEGORIES, TUTORIALS_DIR, COMPANIES_DIR, LOGOS_DIR]) {
  if (!existsSync(p)) {
    console.error(`FATAL: required source missing: ${p}`)
    process.exit(1)
  }
}

const dbTools = readJson(DB_TOOLS).tools
const dbCategories = readJson(DB_CATEGORIES).categories
const realCategorySlugs = dbCategories.map((c) => c.slug)
console.log(`Loaded ${dbTools.length} DB tools, ${dbCategories.length} categories.`)

const badCategories = dbTools.filter((t) => !realCategorySlugs.includes(t.category))
if (badCategories.length) {
  warn(`${badCategories.length} tools have a category outside the 11 real slugs: ${[...new Set(badCategories.map((t) => t.category))].join(', ')}`)
} else {
  console.log('All tool categories are among the 11 real slugs.')
}

const dupSlugs = dbTools.length - new Set(dbTools.map((t) => t.slug)).size
if (dupSlugs) warn(`${dupSlugs} duplicate tool slugs in DB`)

const logoExists = (slug) => existsSync(path.join(LOGOS_DIR, `${slug}.png`))
const logoCount = dbTools.filter((t) => logoExists(t.slug)).length
console.log(`Logos present for ${logoCount}/${dbTools.length} tool slugs.`)

const PRICING_MAP = { Free: 'free', Freemium: 'freemium', Paid: 'paid', 'Open Source': 'open-source' }
const mapPricing = (v) => {
  if (v == null) return null
  if (PRICING_MAP[v]) return PRICING_MAP[v]
  warn(`Unknown pricing_type "${v}" — emitting null`)
  return null
}
const mapPlatforms = (platforms) =>
  (platforms || []).map((p) => p.toLowerCase().replace(/\s+/g, '-'))

// ---------------------------------------------------------------------------
// Emitters
// ---------------------------------------------------------------------------

const GEN_HEADER = (what) =>
  `// GENERATED from the real AIToolsHub sources — do not edit by hand.\n// Regenerate with: node scripts/gen-site-data.mjs\n// Source: ${what}\n`

function writeDataFile(name, body) {
  mkdirSync(dataDir, { recursive: true })
  writeFileSync(path.join(dataDir, name), body)
  console.log(`Wrote src/data/${name}`)
}

// ---- categories.ts ----
{
  const toPascal = (kebab) =>
    kebab
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('')
  const records = dbCategories.map((c) => ({
    slug: c.slug,
    name: c.name,
    icon: toPascal(c.icon),
    description: c.description,
  }))
  const body =
    GEN_HEADER('ai-tools-directory/data/categories.json (icon -> PascalCase lucide name)') +
    `import type { Category } from '../types'\n\n` +
    `export const categories: Category[] = ${JSON.stringify(records, null, 2)}\n`
  writeDataFile('categories.ts', body)
}

// ---- tools.ts ----
// Emitted in chunks: a single 4,813-item array literal makes tsc give up
// with TS2590 ("union type too complex to represent"), so we split it into
// smaller annotated chunks and concatenate. The chunks are not exported —
// only `tools` is part of the data contract.
const TOOL_CHUNK_SIZE = 100
function emitToolsChunks(records) {
  // Each chunk becomes its own file (tools-chunk-N.ts) so no single file
  // is too large for editors, tsc, or API-based pushes. tools.ts re-exports.
  const n = Math.ceil(records.length / TOOL_CHUNK_SIZE)
  for (let i = 0; i < n; i++) {
    const chunk = records.slice(i * TOOL_CHUNK_SIZE, (i + 1) * TOOL_CHUNK_SIZE)
    const body =
      GEN_HEADER('ai-tools-directory/data/tools.json') +
      `import type { Tool } from '../types'\n\n` +
      `export const toolsChunk${i}: Tool[] = ${JSON.stringify(chunk, null, 2)}\n`
    writeDataFile(`tools-chunk-${i}.ts`, body)
  }
  const names = Array.from({ length: n }, (_, i) => `toolsChunk${i}`)
  const imports = names.map((nm, i) => `import { ${nm} } from './tools-chunk-${i}'`).join('\n')
  return (
    GEN_HEADER('ai-tools-directory/data/tools.json') +
    `import type { Tool } from '../types'\n${imports}\n\n` +
    `export const tools: Tool[] = [${names.map((x) => `...${x}`).join(', ')}]\n`
  )
}
const toolRecords = dbTools.map((t) => ({
  slug: t.slug,
  name: t.name,
  logo: `/logos/${t.slug}.png`,
  company: t.company && t.company.trim() ? t.company : null,
  category: t.category,
  subcategory: t.subcategory || null,
  shortDescription: t.short_description || '',
  pricing: mapPricing(t.pricing_type),
  // rating / reviewCount / tested / testedDate / featuredRank / isNew intentionally
  // omitted: the DB does not verify them, so we must not invent them.
  tags: t.tags || [],
  platforms: mapPlatforms(t.platforms),
  officialUrl: t.website || '',
  affiliateUrl: null,
}))
{
  const body = emitToolsChunks(toolRecords)
  writeDataFile('tools.ts', body)
}

// ---- toolDetails.ts ----
{
  const entries = {}
  for (const t of dbTools) {
    const overview = (t.description || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    entries[t.slug] = {
      verdict: t.short_description || '',
      overview,
      features: t.features || [],
      pros: t.pros || [],
      cons: t.cons || [],
      bestFor: null,
      pricingTiers: null,
      pakistanAvailability: null,
      faq: [],
    }
  }
  // Split into per-slug chunk files so no single file is too large.
  const slugs = Object.keys(entries)
  const DETAIL_CHUNK = 60
  const n = Math.ceil(slugs.length / DETAIL_CHUNK)
  for (let i = 0; i < n; i++) {
    const part = {}
    for (const s of slugs.slice(i * DETAIL_CHUNK, (i + 1) * DETAIL_CHUNK)) part[s] = entries[s]
    const body =
      GEN_HEADER('ai-tools-directory/data/tools.json (per-tool detail fields)') +
      `import type { ToolDetail, ToolSlug } from '../types'\n\n` +
      `export const toolDetailsChunk${i}: Partial<Record<ToolSlug, ToolDetail>> = ${JSON.stringify(part, null, 2)}\n`
    writeDataFile(`tool-details-chunk-${i}.ts`, body)
  }
  const imports = Array.from({ length: n }, (_, i) => `import { toolDetailsChunk${i} } from './tool-details-chunk-${i}'`).join('\n')
  const body =
    GEN_HEADER('ai-tools-directory/data/tools.json (per-tool detail fields)') +
    `import type { ToolDetail, ToolSlug } from '../types'\n${imports}\n\n` +
    `export const toolDetails: Partial<Record<ToolSlug, ToolDetail>> = Object.assign({}, ${Array.from({ length: n }, (_, i) => `toolDetailsChunk${i}`).join(', ')})\n`
  writeDataFile('toolDetails.ts', body)
}

// ---- agents.ts + agentDetails.ts ----
const agentTools = dbTools.filter((t) => t.category === 'automation-agents')
console.log(`Automation-agents tools (agents): ${agentTools.length}`)
{
  const records = agentTools.map((t) => ({
    slug: t.slug,
    name: t.name,
    logo: `/logos/${t.slug}.png`,
    company: t.company && t.company.trim() ? t.company : t.name,
    tagline: t.short_description || '',
    description: t.description || '',
    capabilities: (t.features || []).slice(0, 6),
    difficulty: null,
    pricing: mapPricing(t.pricing_type),
    tested: false,
    officialUrl: t.website || '',
  }))
  const AGENT_CHUNK = 70
  const aN = Math.ceil(records.length / AGENT_CHUNK)
  for (let i = 0; i < aN; i++) {
    const c = records.slice(i * AGENT_CHUNK, (i + 1) * AGENT_CHUNK)
    writeDataFile(`agents-chunk-${i}.ts`,
      GEN_HEADER("ai-tools-directory/data/tools.json where category = 'automation-agents'") +
      `import type { Agent } from '../types'\n\n` +
      `export const agentsChunk${i}: Agent[] = ${JSON.stringify(c, null, 2)}\n`)
  }
  {
    const imports = Array.from({ length: aN }, (_, i) => `import { agentsChunk${i} } from './agents-chunk-${i}'`).join('\n')
    const body =
      GEN_HEADER("ai-tools-directory/data/tools.json where category = 'automation-agents'") +
      `import type { Agent } from '../types'\n${imports}\n\n` +
      `export const agents: Agent[] = [${Array.from({ length: aN }, (_, i) => `...agentsChunk${i}`).join(', ')}]\n`
    writeDataFile('agents.ts', body)
  }

  const entries = {}
  for (const t of agentTools) {
    entries[t.slug] = {
      verdict: t.short_description || '',
      overview: (t.description || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
      howItWorks: [],
      integrations: [],
      difficultyExplanation: null,
      pricingTiers: null,
      pros: t.pros || [],
      cons: t.cons || [],
      tutorial: null,
      alternatives: [],
      faq: [],
    }
  }
  const aSlugs = Object.keys(entries)
  const AD_CHUNK = 60
  const adN = Math.ceil(aSlugs.length / AD_CHUNK)
  for (let i = 0; i < adN; i++) {
    const part = {}
    for (const sl of aSlugs.slice(i * AD_CHUNK, (i + 1) * AD_CHUNK)) part[sl] = entries[sl]
    writeDataFile(`agent-details-chunk-${i}.ts`,
      GEN_HEADER("ai-tools-directory/data/tools.json where category = 'automation-agents'") +
      `import type { AgentDetail, AgentSlug } from '../types'\n\n` +
      `export const agentDetailsChunk${i}: Partial<Record<AgentSlug, AgentDetail>> = ${JSON.stringify(part, null, 2)}\n`)
  }
  {
    const imports = Array.from({ length: adN }, (_, i) => `import { agentDetailsChunk${i} } from './agent-details-chunk-${i}'`).join('\n')
    const detailBody =
      GEN_HEADER("ai-tools-directory/data/tools.json where category = 'automation-agents'") +
      `import type { AgentDetail, AgentSlug } from '../types'\n${imports}\n\n` +
      `export const agentDetails: Partial<Record<AgentSlug, AgentDetail>> = Object.assign({}, ${Array.from({ length: adN }, (_, i) => `agentDetailsChunk${i}`).join(', ')})\n`
    writeDataFile('agentDetails.ts', detailBody)
  }
}

// ---- tutorials.ts + tutorialDetails.ts ----
const TUTORIAL_META = {
  'elevenlabs-voice-clone-fix': { category: 'ai-tools', difficulty: 'Beginner', toolsUsed: ['elevenlabs'] },
  'chatgpt-prompting-mistakes': { category: 'prompt-engineering', difficulty: 'Beginner', toolsUsed: ['chatgpt'] },
  'claude-code-cursor-anti-breakage': { category: 'coding', difficulty: 'Intermediate', toolsUsed: ['claude', 'cursor'] },
  'midjourney-fast-hours': { category: 'generative-ai', difficulty: 'Beginner', toolsUsed: ['midjourney'] },
  'hallucination-proofing': { category: 'prompt-engineering', difficulty: 'Beginner', toolsUsed: ['chatgpt', 'claude'] },
  'ai-memory-fix': { category: 'ai-tools', difficulty: 'Intermediate', toolsUsed: [] },
  'comfyui-first-image': { category: 'generative-ai', difficulty: 'Advanced', toolsUsed: [] },
  'n8n-first-automation': { category: 'automation', difficulty: 'Beginner', toolsUsed: ['n8n'] },
  'ollama-local-llms': { category: 'ai-tools', difficulty: 'Intermediate', toolsUsed: ['ollama'] },
  'ai-video-credit-saving': { category: 'generative-ai', difficulty: 'Beginner', toolsUsed: [] },
}
{
  const dbSlugSet = new Set(dbTools.map((t) => t.slug))
  const files = readdirSync(TUTORIALS_DIR).filter((f) => f.endsWith('.md')).sort()
  const records = []
  for (const file of files) {
    const slug = file.replace(/^\d+-/, '').replace(/\.md$/, '')
    const meta = TUTORIAL_META[slug]
    if (!meta) {
      warn(`No metadata mapping for tutorial file ${file} — skipped`)
      continue
    }
    const fullPath = path.join(TUTORIALS_DIR, file)
    const md = readFileSync(fullPath, 'utf8')
    const titleMatch = md.match(/^#\s+(.+?)\s*$/m)
    const title = titleMatch ? titleMatch[1].trim() : slug
    const afterTitle = md.slice(md.indexOf(titleMatch[0]) + titleMatch[0].length)
    const firstPara = afterTitle
      .split('\n')
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith('>') && !l.startsWith('#') && l !== '---')
    const description = stripMd(firstPara || '').slice(0, 400)
    const words = md.split(/\s+/).length
    const toolsUsed = meta.toolsUsed.filter((s) => {
      if (!dbSlugSet.has(s)) {
        warn(`Tutorial ${slug}: DB slug "${s}" not found — dropped from toolsUsed`)
        return false
      }
      return true
    })
    const mtime = statSync(fullPath).mtime
    const publishedDate = `${mtime.getFullYear()}-${String(mtime.getMonth() + 1).padStart(2, '0')}-${String(mtime.getDate()).padStart(2, '0')}`
    records.push({
      slug,
      title,
      description,
      thumbnail: null,
      category: meta.category,
      difficulty: meta.difficulty,
      durationMinutes: Math.max(3, Math.round(words / 200)),
      author: null,
      publishedDate,
      updatedDate: null,
      featured: false,
      popular: false,
      content: md,
      toolsUsed,
      relatedTutorials: [],
      chapters: parseChapters(afterTitle),
      codeBlocks: [],
      promptBlocks: [],
      images: [],
      faq: [],
    })
  }
  console.log(`Tutorials parsed: ${records.length}`)
  const TUT_CHUNK = 3
  const tN = Math.ceil(records.length / TUT_CHUNK)
  for (let i = 0; i < tN; i++) {
    const c = records.slice(i * TUT_CHUNK, (i + 1) * TUT_CHUNK)
    writeDataFile(`tutorials-chunk-${i}.ts`,
      GEN_HEADER('goals/aitoolshub-ai-tools-directory-site/files/tutorials/*.md (full markdown in `content`, chapters parsed from ## / ### headings)') +
      `import type { Tutorial } from '../types'\n\n` +
      `export const tutorialsChunk${i}: Tutorial[] = ${JSON.stringify(c, null, 2)}\n`)
  }
  {
    const imports = Array.from({ length: tN }, (_, i) => `import { tutorialsChunk${i} } from './tutorials-chunk-${i}'`).join('\n')
    const body =
      GEN_HEADER('goals/aitoolshub-ai-tools-directory-site/files/tutorials/*.md (full markdown in `content`, chapters parsed from ## / ### headings)') +
      `import type { Tutorial } from '../types'\n${imports}\n\n` +
      `export const tutorials: Tutorial[] = [${Array.from({ length: tN }, (_, i) => `...tutorialsChunk${i}`).join(', ')}]\n`
    writeDataFile('tutorials.ts', body)
  }

  const detailBody =
    GEN_HEADER('derived from ./tutorials (same records, keyed by slug)') +
    `import type { Tutorial, TutorialSlug } from '../types'\n` +
    `import { tutorials } from './tutorials'\n\n` +
    `export const tutorialDetails: Partial<Record<TutorialSlug, Tutorial>> = Object.fromEntries(\n` +
    `  tutorials.map((tutorial) => [tutorial.slug, tutorial]),\n` +
    `)\n`
  writeDataFile('tutorialDetails.ts', detailBody)
}

// ---- companies.ts + companyDetails.ts ----
{
  const toolBySlug = new Map(dbTools.map((t) => [t.slug, t]))
  const files = readdirSync(COMPANIES_DIR).filter((f) => f.endsWith('.md') && f !== 'INDEX.md').sort()

  // First pass: names, for the Similar-companies -> slug map.
  const nameToSlug = new Map()
  const profiles = files.map((file) => {
    const slug = file.replace(/\.md$/, '')
    const md = readFileSync(path.join(COMPANIES_DIR, file), 'utf8')
    const name = (md.match(/^#\s+(.+?)\s*$/m) || [null, slug])[1].trim()
    const key = name.toLowerCase().replace(/\s*\(.*\)\s*$/, '').trim()
    nameToSlug.set(key, slug)
    return { slug, file, md, name }
  })

  const keyFacts = (md) => {
    const m = md.match(/## Key facts\n\n((?:\|.*\n)+)/)
    const facts = {}
    if (m) {
      for (const row of m[1].trim().split('\n')) {
        const cells = row.split('|').map((c) => c.trim()).filter(Boolean)
        if (cells.length >= 2 && !/^fact$/i.test(cells[0]) && !/^-+$/.test(cells[0])) {
          facts[cells[0].toLowerCase()] = cells[1]
        }
      }
    }
    return facts
  }

  const companyRecords = []
  const detailEntries = {}

  for (const { slug, md, name } of profiles) {
    const { sections } = splitSections(md)
    const facts = keyFacts(md)

    // Overview -> description (first paragraph) + longDescription (rest).
    const overviewParas = (sections.get('Overview') || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    const description = stripMd(overviewParas[0] || '')
    const longDescription = overviewParas.length > 1 ? overviewParas.slice(1).map(stripMd).join('\n\n') : null

    // Founded / HQ from the Key facts table.
    let founded = null
    const foundedRaw = facts['founded']
    if (foundedRaw) {
      const y = foundedRaw.match(/(19|20)\d{2}/)
      founded = y ? Number(y[0]) : null
      if (!founded) warn(`${slug}: could not parse founded year from "${foundedRaw}"`)
    } else {
      warn(`${slug}: no Founded row in Key facts`)
    }
    const hq = facts['headquarters'] ? stripMd(facts['headquarters']) : null
    if (!hq) warn(`${slug}: no Headquarters row in Key facts`)

    // Website: first "In our directory" tool's DB website (honest, documented);
    // fallback: DB tool whose website/company matches; else empty string.
    let website = ''
    const inDir = md.match(/### In our directory\n\n((?:- .*\n)+)/)
    if (inDir) {
      const dirSlugs = [...inDir[1].matchAll(/`([a-z0-9][a-z0-9-]*)`/g)].map((m) => m[1])
      for (const s of dirSlugs) {
        const tool = toolBySlug.get(s)
        if (tool && tool.website) {
          website = tool.website
          break
        }
      }
    }
    if (!website) {
      const key = name.toLowerCase().replace(/\s*\(.*\)\s*$/, '').trim()
      const match = dbTools.find(
        (t) => t.slug === slug || (t.company && t.company.toLowerCase() === key),
      )
      if (match && match.website) website = match.website
    }
    if (!website) warn(`${slug}: no honest website source — emitting empty string`)

    // Products: "## Flagship AI products" bullets -> name before the em dash.
    const products = []
    const prodSection = sections.get('Flagship AI products')
    if (prodSection) {
      for (const line of prodSection.split('\n')) {
        if (/^\s*###/.test(line)) break // stop at "### In our directory" subsection
        const b = line.match(/^\s*-\s+(.*)$/)
        if (!b) continue
        const text = b[1]
        const nameMatch = text.match(/^\*\*(.+?)\*\*\s*[—–-]\s*/) || text.match(/^\*\*(.+?)\*\*/)
        const prodName = nameMatch ? nameMatch[1].trim() : stripMd(text.split(/[—–-]/)[0]).trim()
        if (prodName) products.push(prodName)
      }
    }

    companyRecords.push({
      slug,
      name,
      logo: logoExists(slug) ? `/logos/${slug}.png` : null,
      mission: null, // profiles carry no mission statement
      description,
      longDescription,
      founded,
      hq,
      website,
      products,
      models: [],
      featured: false,
    })

    // ---- companyDetails ----
    const stats = { employees: null, valuation: null, funding: null }
    if (facts['employees']) stats.employees = stripMd(facts['employees'])
    const valuationSection = sections.get('Valuation') || ''
    const valBold = valuationSection.match(/\*\*(.+?)\*\*/)
    if (valBold) stats.valuation = stripMd(valBold[1])
    const fundingTable = (sections.get('Funding history') || '').match(/\|.*\n\|[\s:|-]+\|\n((?:\|.*\n)+)/)
    if (fundingTable) {
      const rows = fundingTable[1].trim().split('\n').map((r) => r.split('|').map((c) => c.trim()).filter(Boolean))
      const last = rows[rows.length - 1]
      if (last && last.length >= 3) {
        stats.funding = `${last[2]} (${last[1]}, ${last[0]})`
      }
    }

    const timeline = []
    if (fundingTable) {
      for (const row of fundingTable[1].trim().split('\n').map((r) => r.split('|').map((c) => c.trim()).filter(Boolean))) {
        const yearMatch = (row[0] || '').match(/(19|20)\d{2}/)
        if (!yearMatch || row.length < 2) continue
        const parts = [`${row[1]} round`]
        if (row[2] && !/^undisclosed$/i.test(row[2])) parts.push(row[2])
        if (row[3]) parts.push(`led by ${stripMd(row[3]).slice(0, 80)}`)
        timeline.push({ year: Number(yearMatch[0]), event: parts.join(' — ') })
      }
    }

    const news = []
    const newsSection = sections.get('Latest 2026 news')
    if (newsSection) {
      const monthIdx = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' }
      for (const line of newsSection.split('\n')) {
        const item = line.match(/^\d+\.\s+\*\*(.+?)\*\*\s*(.*)$/)
        if (!item) continue
        const rawTitle = item[1].replace(/:\s*$/, '').trim()
        const rest = item[2].trim()
        const dateMatch = (rawTitle + ' ' + rest).match(
          /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+(\d{1,2})(?:st|nd|rd|th)?\b/,
        )
        if (!dateMatch) {
          warn(`${slug}: news item has no parseable Month Day date — skipped: "${rawTitle.slice(0, 60)}"`)
          continue
        }
        const date = `2026-${monthIdx[dateMatch[1].slice(0, 3).toLowerCase()]}-${dateMatch[2].padStart(2, '0')}`
        const srcMatch = rest.match(/\[([^\]]+)\]\([^)]+\)/)
        const summary = stripMd(rest.replace(/\s*[—–-]\s*\[[^\]]+\]\([^)]+\)(\s*\/\s*\[[^\]]+\]\([^)]+\))*\s*$/, '').trim()).replace(/^[:\s—–-]+/, '')
        news.push({ date, title: stripMd(rawTitle), summary, source: srcMatch ? srcMatch[1] : null })
      }
    }

    const relatedCompanies = []
    const similarText = sections.get('Similar companies') || ''
    const similarNames = []
    for (const line of similarText.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed) continue
      const bullet = trimmed.match(/^[-*]\s+(.*)$/)
      const parts = bullet ? [bullet[1]] : trimmed.split(',')
      for (const part of parts) {
        const n = part.trim()
        if (n) similarNames.push(n)
      }
    }
    for (const raw of similarNames) {
      const key = raw.toLowerCase().replace(/\s*\(.*\)\s*$/, '').trim()
      const target = nameToSlug.get(key)
      if (target && target !== slug && !relatedCompanies.includes(target)) relatedCompanies.push(target)
      else if (key) warn(`${slug}: similar company "${raw}" did not match a profile slug`)
    }

    detailEntries[slug] = {
      focus: null, // profiles carry no focus statement
      stats,
      timeline,
      news,
      relatedCompanies,
    }
  }

  console.log(`Companies parsed: ${companyRecords.length}`)
  const body =
    GEN_HEADER('goals/aitoolshub-ai-tools-directory-site/files/company-profiles/*.md') +
    `import type { Company } from '../types'\n\n` +
    `export const companies: Company[] = ${JSON.stringify(companyRecords, null, 2)}\n`
  writeDataFile('companies.ts', body)

  const detailBody =
    GEN_HEADER('goals/aitoolshub-ai-tools-directory-site/files/company-profiles/*.md') +
    `import type { CompanyDetail, CompanySlug } from '../types'\n\n` +
    `export const companyDetails: Partial<Record<CompanySlug, CompanyDetail>> = ${JSON.stringify(detailEntries, null, 2)}\n`
  writeDataFile('companyDetails.ts', detailBody)
}

console.log(`\nDone. ${warnings.length} warning(s).`)
