import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import '@fontsource-variable/geist'
import './styles/globals.css'
import './i18n'
import App from './App'

// Force English/LTR layout (Arabic version paused)
document.documentElement.lang = 'en'
document.documentElement.dir = 'ltr'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
)
