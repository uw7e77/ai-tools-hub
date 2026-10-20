import { Link, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { AdminDataProvider } from './AdminData'
import { AdminGate, lockAdmin } from './AdminGate'
import { AgentsAdmin } from './pages/AgentsAdmin'
import { AgentEditor } from './pages/AgentEditor'
import { CategoriesAdmin } from './pages/CategoriesAdmin'
import { Dashboard } from './pages/Dashboard'
import { DatabasePage } from './pages/DatabasePage'
import { HealthPage } from './pages/HealthPage'
import { ToolEditor } from './pages/ToolEditor'
import { ToolsAdmin } from './pages/ToolsAdmin'
import { cx } from '../utils/cx'
import css from './AdminShell.module.css'

const NAV = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/tools', label: 'Tools', end: false },
  { to: '/admin/agents', label: 'AI Agents', end: false },
  { to: '/admin/categories', label: 'Categories', end: false },
  { to: '/admin/database', label: 'Database', end: false },
  { to: '/admin/health', label: 'Data Health', end: false },
]

export default function AdminShell() {
  const navigate = useNavigate()

  function onLock() {
    lockAdmin()
    navigate('/')
    window.location.reload()
  }

  return (
    <AdminGate>
      <AdminDataProvider>
        <div className={css.shell}>
          <aside className={css.sidebar}>
            <p className={css.brand}>
              AIToolsHub <span>Admin</span>
            </p>
            <nav className={css.nav} aria-label="Admin">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => cx(css.navLink, isActive && css.navActive)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className={css.sideFoot}>
              <Link className={css.navLink} to="/">
                ← View website
              </Link>
              <button type="button" className={css.lockBtn} onClick={onLock}>
                Lock panel
              </button>
            </div>
          </aside>
          <main className={css.main}>
            <Routes>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/tools" element={<ToolsAdmin />} />
              <Route path="/admin/tools/new" element={<ToolEditor />} />
              <Route path="/admin/tools/:slug" element={<ToolEditor />} />
              <Route path="/admin/agents" element={<AgentsAdmin />} />
              <Route path="/admin/agents/new" element={<AgentEditor />} />
              <Route path="/admin/agents/:slug" element={<AgentEditor />} />
              <Route path="/admin/categories" element={<CategoriesAdmin />} />
              <Route path="/admin/database" element={<DatabasePage />} />
              <Route path="/admin/health" element={<HealthPage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </main>
        </div>
      </AdminDataProvider>
    </AdminGate>
  )
}
