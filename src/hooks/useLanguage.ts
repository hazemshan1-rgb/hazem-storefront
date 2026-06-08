import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export function useLanguage() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const toggle = useCallback(() => {
    const next = isArabic ? 'en' : 'ar'
    i18n.changeLanguage(next)
    document.documentElement.lang = next
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
  }, [i18n, isArabic])

  return { isArabic, toggle, lang: i18n.language }
}
