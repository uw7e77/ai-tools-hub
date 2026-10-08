import { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Routes, useLocation, useParams } from 'react-router-dom'
import { AgentsSkeleton } from './components/agents/AgentsSkeleton'
import { CategoriesSkeleton } from './components/categories/CategoriesSkeleton'
import { CategorySkeleton } from './components/category/CategorySkeleton'
import { Footer } from './components/layout/Footer'
import { BackgroundFX } from './components/layout/BackgroundFX'
import { Header } from './components/layout/Header'
import { ToolSkeleton } from './components/tool/ToolSkeleton'
import { TutorialDetailSkeleton } from './components/tutorial/TutorialDetailSkeleton'
import { ErrorBoundary } from './features/errors/ErrorBoundary'
import { HomePage } from './pages/HomePage'
import { NotFound } from './pages/NotFound'

const CategoriesPage = lazy(() => import('./pages/CategoriesPage'))
const CompaniesPage = lazy(() => import('./pages/CompaniesPage'))
const TutorialsPage = lazy(() => import('./pages/TutorialsPage'))
const ToolsPage = lazy(() => import('./pages/ToolsPage'))
const LaunchesPage = lazy(() => import('./pages/LaunchesPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'))

function createAgentsPage() {
  return lazy(() => import('./pages/AgentsPage'))
}

function AgentsRoute() {
  const [AgentsPage, setAgentsPage] = useState(createAgentsPage)

  return (
    <ErrorBoundary onReset={() => setAgentsPage(() => createAgentsPage())}>
      <Suspense fallback={<AgentsSkeleton />}>
        <AgentsPage />
      </Suspense>
    </ErrorBoundary>
  )
}

function createCategoryPage() {
  return lazy(() => import('./pages/CategoryPage'))
}

function CategoryRoute() {
  const { slug } = useParams()
  const [CategoryPage, setCategoryPage] = useState(createCategoryPage)

  return (
    <ErrorBoundary key={slug ?? ''} onReset={() => setCategoryPage(() => createCategoryPage())}>
      <Suspense fallback={<CategorySkeleton />}>
        <CategoryPage />
      </Suspense>
    </ErrorBoundary>
  )
}

function createToolPage() {
  return lazy(() => import('./pages/ToolPage'))
}

function ToolRoute() {
  const { slug } = useParams()
  const [ToolPage, setToolPage] = useState(createToolPage)

  return (
    <ErrorBoundary key={slug ?? ''} onReset={() => setToolPage(() => createToolPage())}>
      <Suspense fallback={<ToolSkeleton />}>
        <ToolPage />
      </Suspense>
    </ErrorBoundary>
  )
}

function createAgentDetailPage() {
  return lazy(() => import('./pages/AgentDetailPage'))
}

function AgentDetailRoute() {
  const { slug } = useParams()
  const [AgentDetailPage, setAgentDetailPage] = useState(createAgentDetailPage)

  return (
    <ErrorBoundary key={slug ?? ''} onReset={() => setAgentDetailPage(() => createAgentDetailPage())}>
      <Suspense fallback={<AgentsSkeleton />}>
        <AgentDetailPage />
      </Suspense>
    </ErrorBoundary>
  )
}

function createCompanyDetailPage() {
  return lazy(() => import('./pages/CompanyDetailPage'))
}

function CompanyDetailRoute() {
  const { slug } = useParams()
  const [CompanyDetailPage, setCompanyDetailPage] = useState(createCompanyDetailPage)

  return (
    <ErrorBoundary key={slug ?? ''} onReset={() => setCompanyDetailPage(() => createCompanyDetailPage())}>
      <Suspense fallback={<CategoriesSkeleton />}>
        <CompanyDetailPage />
      </Suspense>
    </ErrorBoundary>
  )
}

function createTutorialDetailPage() {
  return lazy(() => import('./pages/TutorialDetailPage'))
}

function TutorialDetailRoute() {
  const { slug } = useParams()
  const [TutorialDetailPage, setTutorialDetailPage] = useState(createTutorialDetailPage)

  return (
    <ErrorBoundary key={slug ?? ''} onReset={() => setTutorialDetailPage(() => createTutorialDetailPage())}>
      <Suspense fallback={<TutorialDetailSkeleton />}>
        <TutorialDetailPage />
      </Suspense>
    </ErrorBoundary>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollToTop />
      <BackgroundFX />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/categories"
            element={
              <Suspense fallback={<CategoriesSkeleton />}>
                <CategoriesPage />
              </Suspense>
            }
          />
          <Route
            path="/tools"
            element={
              <Suspense fallback={<CategoriesSkeleton />}>
                <ToolsPage />
              </Suspense>
            }
          />
          <Route path="/category/:slug" element={<CategoryRoute />} />
          <Route path="/tool/:slug" element={<ToolRoute />} />
          <Route path="/agents" element={<AgentsRoute />} />
          <Route path="/agent/:slug" element={<AgentDetailRoute />} />
          <Route
            path="/companies"
            element={
              <Suspense fallback={<CategoriesSkeleton />}>
                <CompaniesPage />
              </Suspense>
            }
          />
          <Route path="/company/:slug" element={<CompanyDetailRoute />} />
          <Route
            path="/tutorials"
            element={
              <Suspense fallback={<CategoriesSkeleton />}>
                <TutorialsPage />
              </Suspense>
            }
          />
          <Route path="/tutorial/:slug" element={<TutorialDetailRoute />} />
          <Route
            path="/new"
            element={
              <Suspense fallback={<CategoriesSkeleton />}>
                <LaunchesPage />
              </Suspense>
            }
          />
          <Route
            path="/search"
            element={
              <Suspense fallback={<CategoriesSkeleton />}>
                <SearchPage />
              </Suspense>
            }
          />
          <Route
            path="/bookmarks"
            element={
              <Suspense fallback={<CategoriesSkeleton />}>
                <BookmarksPage />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
