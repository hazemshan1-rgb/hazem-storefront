import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Model: intensive commercial pond ≈ $100K annual revenue, 40% efficiency gap
// Breakdown: FCR overspend 15% + invisible mortality 12% + disease risk amortised 8%
//            + suboptimal harvest/growth 5% + energy/water waste 5% → ~40% lost
// = $40,000/pond/yr → $0.001268/pond/sec
const LOSS_PER_POND_PER_SECOND = 40000 / 365 / 24 / 3600

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `$${Math.round(n).toLocaleString()}`
  return `$${n.toFixed(2)}`
}

export function InactionClock() {
  const { t } = useTranslation()
  const ref          = useRef<HTMLElement>(null)
  const breakdownRef = useRef<HTMLDivElement>(null)
  const [ponds, setPonds] = useState(10)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      if (breakdownRef.current?.children) {
        gsap.from(breakdownRef.current.children, {
          y: 24, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: breakdownRef.current, start: 'top 75%' },
        })
      }
    })
  }, { scope: ref })

  const ratePerSec = ponds * LOSS_PER_POND_PER_SECOND
  const monthly    = ratePerSec * 86400 * 30
  const annual     = ratePerSec * 86400 * 365
  const daily      = ratePerSec * 86400

  const breakdown = [
    { label: t('inactionClock.annualLeak'),  value: fmt(annual),            highlight: true  },
    { label: t('inactionClock.monthlyLeak'), value: fmt(monthly),           highlight: false },
    { label: t('inactionClock.dailyLeak'),   value: fmt(daily),             highlight: false },
    { label: t('inactionClock.perHour'),     value: fmt(ratePerSec * 3600), highlight: false },
  ]

  return (
    <section ref={ref} className="bg-[var(--color-navy)]">
      <div className="max-w-6xl mx-auto px-6 py-20">

        {/* Header row */}
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] mb-3">
            {t('inactionClock.eyebrow')}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            <div className="flex-1">
              <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-2 font-semibold">
                {t('inactionClock.pondsLabel')}
              </label>
              <input
                type="range" min={1} max={50} step={1} value={ponds}
                onChange={e => setPonds(Number(e.target.value))}
                className="w-full accent-[var(--color-gold-cta)] mb-2"
              />
              <div className="flex justify-between items-baseline">
                <span className="font-serif text-3xl text-[var(--color-text-on-dark)]">{ponds}</span>
                <span className="text-[10px] text-[var(--color-text-muted-dark)]">
                  {t('inactionClock.pondsUnit')}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted-dark)] leading-relaxed sm:max-w-xs">
              {t('inactionClock.note')}
            </p>
          </div>
        </div>

        {/* Breakdown — 4 cards full width */}
        <div ref={breakdownRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {breakdown.map(({ label, value, highlight }) => (
            <div
              key={label}
              className={`rounded-sm p-5 text-center border ${
                highlight
                  ? 'bg-[rgba(202,138,4,0.12)] border-[var(--color-gold-cta)]'
                  : 'bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.12)]'
              }`}
            >
              <p className={`font-serif text-3xl leading-none mb-2 ${highlight ? 'text-[var(--color-gold-cta)]' : 'text-white'}`}>
                {value}
              </p>
              <p className={`text-[9px] tracking-[0.2em] uppercase font-semibold ${highlight ? 'text-[var(--color-gold-cta)]/80' : 'text-[var(--color-text-muted-dark)]'}`}>
                {label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
