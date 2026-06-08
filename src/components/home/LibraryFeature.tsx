import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function LibraryFeature() {
  const { t } = useTranslation()
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="scroll-reveal max-w-6xl mx-auto px-6 py-20">
      <Link
        to="/library"
        className="group relative block overflow-hidden rounded-sm border border-[var(--color-gold-muted)] hover:border-[var(--color-gold)] transition-all duration-500"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 items-center">
          {/* Thumbnail */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src="/images/hero/aerial-ponds.jpg"
              alt={t('libraryFeature.imgAlt')}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-[var(--color-navy)]/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>

          {/* Content */}
          <div className="p-8 md:p-12 flex flex-col gap-4">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] font-semibold">
              {t('libraryFeature.eyebrow')}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-text)] leading-tight">
              {t('libraryFeature.headline')}
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-md">
              {t('libraryFeature.body')}
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] tracking-widest uppercase font-semibold text-[var(--color-gold)]">
              {t('libraryFeature.cta')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </section>
  )
}
