import { Check, CircleCheck, Copy, Image as ImageIcon, Info, Lightbulb, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'
import type { AffiliateLink, Block } from './markdownParser'
import md from './Markdown.module.css'

/* Rendering for parsed tutorial markdown blocks (see markdownParser.ts).
   Exported component: MarkdownBlocks. Everything else is internal. */

function parseInline(text: string, affiliate: AffiliateLink | null, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const re = /(`[^`\n]+`)|(\*\*(.+?)\*\*)|(\*([^*\n]+?)\*)|(\[([^\]]+)\]\(([^)\s]+)\))|(\[AFFILIATE_LINK\])/g
  let last = 0
  let k = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    const key = `${keyPrefix}-i${k++}`
    if (m[1]) {
      nodes.push(
        <code key={key} className={md.inlineCode}>
          {m[1].slice(1, -1)}
        </code>,
      )
    } else if (m[2]) {
      nodes.push(<strong key={key}>{parseInline(m[3], affiliate, key)}</strong>)
    } else if (m[4]) {
      nodes.push(<em key={key}>{parseInline(m[5], affiliate, key)}</em>)
    } else if (m[6]) {
      const href = m[8]
      const external = /^https?:\/\//.test(href)
      nodes.push(
        <a
          key={key}
          href={href}
          className={md.link}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {parseInline(m[7], affiliate, key)}
        </a>,
      )
    } else if (m[9]) {
      // Affiliate placeholder from the source markdown — never invent a URL.
      nodes.push(
        affiliate ? (
          <a key={key} href={affiliate.href} className={md.link} target="_blank" rel="noopener noreferrer sponsored">
            {affiliate.label}
          </a>
        ) : (
          <span key={key}>the official site</span>
        ),
      )
    }
    last = m.index + m[0].length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

const KEYWORDS = new Set(
  'const let var function return if else elif for while do switch case break continue import from export default class extends new typeof instanceof in of try catch finally throw async await def print lambda None True False pass raise with as assert del global nonlocal except not and or is echo cd ls npm node npx pip python curl docker git sudo'.split(
    ' ',
  ),
)

function highlight(code: string, lang: string): ReactNode[] {
  const family = /^(py|python|sh|bash|shell)$/.test(lang) ? 'hash' : /^(html?|xml|svg)$/.test(lang) ? 'html' : 'c'
  const comment = family === 'hash' ? '#[^\\n]*' : family === 'html' ? '<!--[\\s\\S]*?-->' : '\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/'
  const re = new RegExp(
    `(${comment})|("(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*'|\`(?:[^\`\\\\]|\\\\.)*\`)|(\\b\\d[\\d_]*(?:\\.\\d+)?\\b)|(\\b(?:${[...KEYWORDS].join('|')})\\b)`,
    'g',
  )
  const nodes: ReactNode[] = []
  let last = 0
  let k = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(code)) !== null) {
    if (m.index > last) nodes.push(code.slice(last, m.index))
    const key = `t${k++}`
    if (m[1]) nodes.push(<span key={key} className={md.tokComment}>{m[1]}</span>)
    else if (m[2]) nodes.push(<span key={key} className={md.tokString}>{m[2]}</span>)
    else if (m[3]) nodes.push(<span key={key} className={md.tokNumber}>{m[3]}</span>)
    else nodes.push(<span key={key} className={md.tokKeyword}>{m[4]}</span>)
    last = m.index + m[0].length
  }
  if (last < code.length) nodes.push(code.slice(last))
  return nodes
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Clipboard API unavailable (permissions / insecure context) — fallback.
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'absolute'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button type="button" className={cx(md.copyBtn, copied && md.copied)} onClick={handleCopy} aria-label={label}>
      {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const language = lang || 'code'
  return (
    <div className={md.codeBlock}>
      <div className={md.codeHeader}>
        <span className={md.codeLang}>{language}</span>
        <CopyButton text={code} label={`Copy ${language} code`} />
      </div>
      <pre className={md.codePre} tabIndex={0} aria-label={`${language} code sample`}>
        <code className={md.codeCode}>{highlight(code, language)}</code>
      </pre>
    </div>
  )
}

const CALLOUT_META = {
  tip: { icon: Lightbulb, label: 'Pro tip' },
  warning: { icon: TriangleAlert, label: 'Important' },
  success: { icon: CircleCheck, label: 'Best practice' },
  note: { icon: Info, label: 'Note' },
} as const

function renderBlock(block: Block, affiliate: AffiliateLink | null, key: string): ReactNode {
  switch (block.kind) {
    case 'heading':
      return block.level === 2 ? (
        <h2 key={key} id={block.id} data-toc-id={block.id} className={md.h2} tabIndex={-1}>
          {parseInline(block.text, affiliate, key)}
        </h2>
      ) : (
        <h3 key={key} id={block.id} data-toc-id={block.id} className={md.h3} tabIndex={-1}>
          {parseInline(block.text, affiliate, key)}
        </h3>
      )
    case 'para':
      return <p key={key} className={md.p}>{parseInline(block.text, affiliate, key)}</p>
    case 'list': {
      const ListTag = block.ordered ? 'ol' : 'ul'
      return (
        <ListTag key={key} className={block.ordered ? md.ol : md.ul}>
          {block.items.map((item, j) => (
            <li key={j} className={cx(md.li, item.checked !== null && md.taskItem)}>
              {item.checked !== null ? (
                <span className={md.taskRow}>
                  <input type="checkbox" checked={item.checked} readOnly tabIndex={-1} aria-hidden="true" className={md.taskBox} />
                  <span>{parseInline(item.text, affiliate, `${key}-t${j}`)}</span>
                </span>
              ) : (
                parseInline(item.text, affiliate, `${key}-t${j}`)
              )}
            </li>
          ))}
        </ListTag>
      )
    }
    case 'code':
      return <CodeBlock key={key} lang={block.lang} code={block.code} />
    case 'callout': {
      const meta = CALLOUT_META[block.variant]
      const Icon = meta.icon
      return (
        <aside key={key} className={cx(md.callout, md[`callout-${block.variant}`])} aria-label={meta.label}>
          <span className={md.calloutIcon} aria-hidden="true">
            <Icon size={18} />
          </span>
          <div className={md.calloutBody}>
            <p className={md.calloutLabel}>{meta.label}</p>
            <div className={md.calloutText}>{parseInline(block.text, affiliate, key)}</div>
          </div>
        </aside>
      )
    }
    case 'quote':
      return (
        <blockquote key={key} className={md.quote}>
          {block.text.split('\n').map((p, j) => (
            <p key={j} className={md.p}>{parseInline(p, affiliate, `${key}-q${j}`)}</p>
          ))}
        </blockquote>
      )
    case 'table':
      return (
        <div key={key} className={md.tableWrap} role="region" aria-label="Data table" tabIndex={0}>
          <table className={md.table}>
            <thead>
              <tr>
                {block.head.map((cell, j) => (
                  <th key={j} scope="col">{parseInline(cell, affiliate, `${key}-h${j}`)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, j) => (
                    <td key={j}>{parseInline(cell, affiliate, `${key}-r${r}c${j}`)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'hr':
      return <hr key={key} className={md.hr} />
    case 'screenshot':
      return (
        <figure key={key} className={md.screenshot}>
          <div className={md.screenshotArt} aria-hidden="true">
            <ImageIcon size={32} />
            <span className={md.screenshotTag}>Screenshot</span>
          </div>
          <figcaption className={md.screenshotCaption}>{block.caption}</figcaption>
        </figure>
      )
  }
}

export function MarkdownBlocks({ blocks, affiliate }: { blocks: Block[]; affiliate: AffiliateLink | null }) {
  return <>{blocks.map((block, index) => renderBlock(block, affiliate, `b${index}`))}</>
}
