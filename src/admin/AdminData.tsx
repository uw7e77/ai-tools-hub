import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { db } from '../data/db'
import type { Agent, Category, Tool } from '../types'

// Admin working copies: the admin panel edits COPIES of the database, kept
// in localStorage. Nothing here changes the live site — to publish, export
// the JSON from the admin and replace the file in public/data/ (that folder
// is the database the website fetches).
const LS_TOOLS = 'aitoolshub:admin-tools'
const LS_AGENTS = 'aitoolshub:admin-agents'
const LS_CATEGORIES = 'aitoolshub:admin-categories'

function loadCopy<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const parsed = JSON.parse(raw) as T[]
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // corrupted copy — fall through to the live database
  }
  return [...fallback]
}

function saveCopy<T>(key: string, value: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full/blocked — edits stay in memory for this session
  }
}

export function hasLocalCopy(key: 'tools' | 'agents' | 'categories'): boolean {
  const map = { tools: LS_TOOLS, agents: LS_AGENTS, categories: LS_CATEGORIES }
  try {
    return localStorage.getItem(map[key]) !== null
  } catch {
    return false
  }
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

interface AdminDataValue {
  tools: Tool[]
  setTools: (tools: Tool[]) => void
  resetTools: () => void
  agents: Agent[]
  setAgents: (agents: Agent[]) => void
  resetAgents: () => void
  categories: Category[]
  setCategories: (categories: Category[]) => void
  resetCategories: () => void
}

const AdminDataContext = createContext<AdminDataValue | null>(null)

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [tools, setToolsState] = useState<Tool[]>(() => loadCopy(LS_TOOLS, db.tools))
  const [agents, setAgentsState] = useState<Agent[]>(() => loadCopy(LS_AGENTS, db.agents))
  const [categories, setCategoriesState] = useState<Category[]>(() =>
    loadCopy(LS_CATEGORIES, db.categories),
  )

  const setTools = useCallback((next: Tool[]) => {
    setToolsState(next)
    saveCopy(LS_TOOLS, next)
  }, [])
  const setAgents = useCallback((next: Agent[]) => {
    setAgentsState(next)
    saveCopy(LS_AGENTS, next)
  }, [])
  const setCategories = useCallback((next: Category[]) => {
    setCategoriesState(next)
    saveCopy(LS_CATEGORIES, next)
  }, [])

  const resetTools = useCallback(() => {
    localStorage.removeItem(LS_TOOLS)
    setToolsState([...db.tools])
  }, [])
  const resetAgents = useCallback(() => {
    localStorage.removeItem(LS_AGENTS)
    setAgentsState([...db.agents])
  }, [])
  const resetCategories = useCallback(() => {
    localStorage.removeItem(LS_CATEGORIES)
    setCategoriesState([...db.categories])
  }, [])

  const value = useMemo(
    () => ({
      tools,
      setTools,
      resetTools,
      agents,
      setAgents,
      resetAgents,
      categories,
      setCategories,
      resetCategories,
    }),
    [tools, setTools, resetTools, agents, setAgents, resetAgents, categories, setCategories, resetCategories],
  )

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
}

export function useAdminData(): AdminDataValue {
  const ctx = useContext(AdminDataContext)
  if (!ctx) throw new Error('useAdminData must be used inside AdminDataProvider')
  return ctx
}
