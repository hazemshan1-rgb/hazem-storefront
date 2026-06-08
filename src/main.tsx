import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './styles/globals.css'
import './i18n'
import App from './App'

// Apply persisted language direction on startup
const savedLang = localStorage.getItem('i18nextLng') || 'en'
const lang = savedLang === 'ar' ? 'ar' : 'en'
document.documentElement.lang = lang
document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
)
