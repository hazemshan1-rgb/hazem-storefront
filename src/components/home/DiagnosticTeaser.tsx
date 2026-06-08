import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function DiagnosticTeaser() {
  const { t } = useTranslation()
  const ref = useScrollReveal<HTMLElement>()

  const dims = [
    t('diagnosticTeaser.dim.feedEfficiency'),
    t('diagnosticTeaser.dim.survivalHealth'),
    t('diagnosticTeaser.dim.operations'),
    t('diagnosticTeaser.dim.financial'),
    t('diagnosticTeaser.dim.infrastructure'),
  ]

  return (
    <section ref={ref} className="scroll-reveal bg-[var(--color-navy)] border-y border-[rgba(255,255,255,0.08)]">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left */}
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] mb-4">
              {t('diagnosticTeaser.eyebrow')}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-text-on-dark)] leading-tight mb-5">
              {t('diagnosticTeaser.headline')}
            </h2>
            <p className="text-sm text-[var(--color-text-muted-dark)] leading-relaxed mb-6">
              {t('diagnosticTeaser.body')}
            </p>
            <p className="text-xs text-[var(--color-text-muted-dark)] mb-8">
              {t('diagnosticTeaser.note')}
            </p>
            <Link to="/diagnostic"
              className="inline-block bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-8 py-4 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all">
              {t('diagnosticTeaser.cta')}
            </Link>
          </div>

          {/* Right — ghost scorecard */}
          <div className="relative">
            <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold-cta)]">
                  {t('diagnosticTeaser.scorecardTitle')}
                </p>
                <div className="w-14 h-14 rounded-full border-2 border-[var(--color-gold-cta)]/30 flex items-center justify-center">
                  <span className="font-serif text-xl text-[var(--color-gold-cta)]/40">??</span>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {dims.map(label => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-text-muted-dark)]">{label}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden">
                        <div className="h-full w-0 bg-[var(--color-gold-cta)]/30 rounded-full" />
                      </div>
                      <span className="text-xs text-[var(--color-text-muted-dark)] w-8 text-right">?/10</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] rounded-sm text-center">
                <p className="text-xs text-[var(--color-text-muted-dark)]">
                  {t('diagnosticTeaser.scorecardNote')}
                </p>
              </div>
            </div>
            {/* Blur overlay */}
            <div className="absolute inset-0 backdrop-blur-[2px] rounded-sm flex items-center justify-center">
              <Link to="/diagnostic"
                className="bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-6 py-3 text-[10px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all shadow-lg">
                {t('diagnosticTeaser.unlockBtn')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
