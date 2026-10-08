import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/tokens.css'
import './index.css'
import App from './App.tsx'
import { BookmarksProvider } from './features/bookmarks/BookmarksProvider.tsx'
import { ThemeProvider } from './features/theme/ThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
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
