import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en/translation.json'
import ar from './locales/ar/translation.json'

// AR translation paused pending review — toggle removed from UI.
// Resources kept here; re-enable by restoring LanguageDetector + supportedLngs.
i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, ar: { translation: ar } },
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en'],
    interpolation: { escapeValue: false },
  })

export default i18n
