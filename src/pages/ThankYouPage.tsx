import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEO } from '../components/ui/SEO'

export function ThankYouPage() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <SEO
        title={t('thankYou.seoTitle')}
        description={t('thankYou.seoDesc')}
        url="/thank-you"
      />
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full border border-[var(--color-gold)] flex items-center justify-center mx-auto mb-8">
          <span className="text-[var(--color-gold)] font-serif text-2xl">✓</span>
        </div>
        <h1 className="font-serif text-3xl text-[var(--color-text)] mb-4">
          {t('thankYou.title')}
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-8">
          {t('thankYou.body')}
        </p>
        <Link to="/shop">
          <button className="text-[11px] tracking-widest uppercase text-[var(--color-gold)] border border-[var(--color-gold)] px-6 py-3 rounded-sm hover:bg-[var(--color-gold-muted)] transition-colors">
            {t('thankYou.cta')}
          </button>
        </Link>
      </div>
    </main>
  )
}
