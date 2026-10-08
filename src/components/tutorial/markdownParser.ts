/* Pure markdown parsing for tutorial articles — no JSX.
   Rendering lives in Markdown.tsx (MarkdownBlocks component). */

export interface TocEntry {
  id: string
  title: string
  level: 2 | 3
}

export interface AffiliateLink {
  href: string
  label: string
}

export type Block =
  | { kind: 'heading'; level: 2 | 3; id: string; text: string }
  | { kind: 'para'; text: string }
  | { kind: 'list'; ordered: boolean; items: { text: string; checked: boolean | null }[] }
  | { kind: 'code'; lang: string; code: string }
  | { kind: 'callout'; variant: 'tip' | 'warning' | 'success' | 'note'; text: string }
  | { kind: 'quote'; text: string }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'hr' }
  | { kind: 'screenshot'; caption: string }

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

const SCREENSHOT_RE = /^\[SCREENSHOT:\s*(.+?)\]\s*$/
const CALLOUT_RE = /^(💡|⚠️|⚠|✅)\s*/

export function parseMarkdown(source: string): { blocks: Block[]; toc: TocEntry[] } {
  const lines = source.split('\n')
  const blocks: Block[] = []
  const toc: TocEntry[] = []
  const usedIds = new Map<string, number>()

  const takeId = (title: string): string => {
    const base = slugify(title) || 'section'
    const n = usedIds.get(base) ?? 0
    usedIds.set(base, n + 1)
    return n === 0 ? base : `${base}-${n + 1}`
  }

  let i = 0
  const paraBuf: string[] = []
  const flushPara = () => {
    if (paraBuf.length === 0) return
    const text = paraBuf.join(' ').trim()
    paraBuf.length = 0
    if (!text) return
    const shot = text.match(SCREENSHOT_RE)
    if (shot) blocks.push({ kind: 'screenshot', caption: shot[1] })
    else blocks.push({ kind: 'para', text })
  }

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // Fenced code block
    const fence = trimmed.match(/^```(\S*)\s*$/)
    if (fence) {
      flushPara()
      const lang = fence[1]
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // skip closing fence
      blocks.push({ kind: 'code', lang, code: codeLines.join('\n').replace(/\n+$/, '') })
      continue
    }

    // Headings (skip h1 — the page header already shows the title)
    const h = trimmed.match(/^(#{1,3})\s+(.+?)\s*$/)
    if (h) {
      flushPara()
      if (h[1].length >= 2) {
        const level = h[1].length === 2 ? 2 : 3
        const id = takeId(h[2])
        toc.push({ id, title: h[2], level })
        blocks.push({ kind: 'heading', level, id, text: h[2] })
      }
      i++
      continue
    }

    // Blockquote → callout or quote
    if (/^>\s?/.test(trimmed)) {
      flushPara()
      const quoteLines: string[] = []
      while (i < lines.length && (/^>\s?/.test(lines[i].trim()) || lines[i].trim() === '')) {
        if (lines[i].trim() === '') break
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''))
        i++
      }
      const text = quoteLines.join('\n').trim()
      const callout = text.match(CALLOUT_RE)
      if (callout) {
        const emoji = callout[1]
        const variant = emoji === '💡' ? 'tip' : emoji === '✅' ? 'success' : 'warning'
        blocks.push({ kind: 'callout', variant, text: text.slice(callout[0].length).trim() })
      } else {
        blocks.push({ kind: 'quote', text })
      }
      continue
    }

    // Table
    if (/^\|.*\|\s*$/.test(trimmed) && i + 1 < lines.length && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1].trim())) {
      flushPara()
      const cells = (row: string) =>
        row
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((c) => c.trim())
      const head = cells(trimmed)
      i += 2
      const rows: string[][] = []
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i].trim())) {
        rows.push(cells(lines[i].trim()))
        i++
      }
      blocks.push({ kind: 'table', head, rows })
      continue
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(trimmed)) {
      flushPara()
      blocks.push({ kind: 'hr' })
      i++
      continue
    }

    // Lists
    const listMatch = trimmed.match(/^([-*+]|\d+[.)])\s+(.*)$/)
    if (listMatch) {
      flushPara()
      const ordered = /^\d/.test(listMatch[1])
      const items: { text: string; checked: boolean | null }[] = []
      while (i < lines.length) {
        const lm = lines[i].trim().match(/^([-*+]|\d+[.)])\s+(.*)$/)
        if (!lm) break
        let itemText = lm[2]
        let checked: boolean | null = null
        const task = itemText.match(/^\[([ xX])\]\s+(.*)$/)
        if (task) {
          checked = task[1].toLowerCase() === 'x'
          itemText = task[2]
        }
        items.push({ text: itemText, checked })
        i++
      }
      blocks.push({ kind: 'list', ordered, items })
      continue
    }

    // Blank line → flush paragraph
    if (trimmed === '') {
      flushPara()
      i++
      continue
    }

    paraBuf.push(trimmed)
    i++
  }
  flushPara()
  return { blocks, toc }
}
