import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function ProfitabilityCalculator() {
  const { t } = useTranslation()
  const revealRef = useScrollReveal<HTMLElement>()
  const [revenue, setRevenue] = useState<number>(1000000)
  const [fcr, setFcr] = useState<number>(1.8)

  const potentialFcrImprovement = 0.2
  const feedCostRatio = 0.6
  const productionCostRatio = 0.8

  const currentProductionCost = revenue * productionCostRatio
  const currentFeedCost = currentProductionCost * feedCostRatio
  const targetFcr = Math.max(1.2, fcr - potentialFcrImprovement)
  const newFeedCost = currentFeedCost * (targetFcr / fcr)
  const annualSavings = currentFeedCost - newFeedCost

  const [displaySavings, setDisplaySavings] = useState(0)
  useEffect(() => {
    const duration = 1000
    const start = displaySavings
    const end = Math.round(annualSavings)
    if (start === end) return
    const startTime = performance.now()
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOutQuad = (t: number) => t * (2 - t)
      const current = Math.floor(start + (end - start) * easeOutQuad(progress))
      setDisplaySavings(current)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annualSavings])

  return (
    <section ref={revealRef} className="bg-[var(--color-navy)] py-20 border-y border-[rgba(255,255,255,0.08)] scroll-reveal">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] mb-4">
            {t('profitabilityCalc.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
            {t('profitabilityCalc.headline')}
          </h2>
          <p className="text-sm text-[var(--color-text-muted-dark)] max-w-xl mx-auto leading-relaxed">
            {t('profitabilityCalc.body')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-[var(--color-surface)] p-8 md:p-12 rounded-sm border border-[var(--color-gold-muted)]">
          {/* Inputs */}
          <div className="space-y-8">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-3 font-semibold">
                {t('profitabilityCalc.revenueLabel')}
              </label>
              <input type="range" min="100000" max="5000000" step="100000" value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="w-full accent-[var(--color-gold)]" />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-[var(--color-text)] font-serif">${revenue.toLocaleString()}</span>
                <span className="text-[10px] text-[var(--color-text-muted)]">$5M</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-3 font-semibold">
                {t('profitabilityCalc.fcrLabel')}
              </label>
              <input type="range" min="1.2" max="2.5" step="0.1" value={fcr}
                onChange={(e) => setFcr(Number(e.target.value))}
                className="w-full accent-[var(--color-gold)]" />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-[var(--color-text)] font-serif">{fcr.toFixed(1)}</span>
                <span className="text-[10px] text-[var(--color-text-muted)]">2.5</span>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="text-center p-8 bg-[var(--color-surface-2)] rounded-sm border border-[var(--color-gold-muted)] flex flex-col justify-center items-center">
            <p className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-2">
              {t('profitabilityCalc.resultLabel')}
            </p>
            <p className="font-serif text-5xl md:text-6xl text-[var(--color-gold)] mb-4">
              ${displaySavings.toLocaleString()}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-8 max-w-[240px]">
              {t('profitabilityCalc.resultNote', { targetFcr: targetFcr.toFixed(1) })}
            </p>
            <Link to="/audit"
              className="inline-block bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-8 py-3.5 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all">
              {t('profitabilityCalc.cta')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
