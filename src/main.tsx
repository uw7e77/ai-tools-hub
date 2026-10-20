import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './index.css'
import { loadDb } from './data/db'
import { DbErrorScreen, DbLoadingScreen } from './features/db/DbScreens'

const root = createRoot(document.getElementById('root')!)

// The whole site reads from the JSON database in public/data/. We fetch it
// first and only then import the app, so every data module and lookup map
// evaluates against fully loaded data.
root.render(<DbLoadingScreen />)

loadDb()
  .then(async () => {
    const [{ default: App }, { ThemeProvider }, { BookmarksProvider }, { BrowserRouter }] =
      await Promise.all([
        import('./App.tsx'),
        import('./features/theme/ThemeProvider.tsx'),
        import('./features/bookmarks/BookmarksProvider.tsx'),
        import('react-router-dom'),
      ])
    root.render(
      <StrictMode>
        <ThemeProvider>
          <BrowserRouter>
            <BookmarksProvider>
              <App />
            </BookmarksProvider>
          </BrowserRouter>
        </ThemeProvider>
      </StrictMode>,
    )
  })
  .catch(() => {
    root.render(<DbErrorScreen />)
  })
