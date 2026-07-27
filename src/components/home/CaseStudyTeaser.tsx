import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { caseStudies } from '../../data/caseStudies'
import { useScrollReveal } from '../../hooks/useScrollReveal'

// Leads with the most universally resonant case study for the core ICP —
// margin recovered from an operational fix, no new capital required.
const featured = caseStudies[0]

export function CaseStudyTeaser() {
  const { t } = useTranslation()
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="scroll-reveal bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 items-center bg-[var(--color-bg)] border border-[var(--color-gold-muted)] rounded-sm p-8 md:p-10">

          {/* Metric */}
          <div className="text-center md:border-r md:border-[var(--color-gold-muted)] md:pr-10 shrink-0">
            <p className="font-serif text-5xl text-[var(--color-gold)]">{featured.metric}</p>
            <p className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mt-2">{featured.metricLabel}</p>
          </div>

          {/* Story */}
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-3">
              {t('caseStudyTeaser.eyebrow')}
            </p>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-2">
              {featured.region} · {featured.species}
            </p>
            <p className="text-sm text-[var(--color-text)] leading-relaxed mb-5 max-w-2xl">
              {featured.outcome}
            </p>
            <Link
              to="/case-studies"
              className="inline-block text-[11px] font-semibold tracking-widest uppercase text-[var(--color-gold)] hover:underline"
            >
              {t('caseStudyTeaser.cta')} →
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
