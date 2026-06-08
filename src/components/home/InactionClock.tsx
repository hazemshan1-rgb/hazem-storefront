import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'

// Model: intensive commercial pond ≈ $100K annual revenue, 40% efficiency gap
// Breakdown: FCR overspend 15% + invisible mortality 12% + disease risk amortised 8%
//            + suboptimal harvest/growth 5% + energy/water waste 5% → ~40% lost
// = $40,000/pond/yr → $0.001268/pond/sec (2.3× more accurate than prior 25% model)
const LOSS_PER_POND_PER_SECOND = 40000 / 365 / 24 / 3600

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `$${Math.round(n).toLocaleString()}`
  return `$${n.toFixed(2)}`
}

export function InactionClock() {
  const { t } = useTranslation()
  const ref     = useRef<HTMLElement>(null)
  const inView  = useInView(ref, { once: true, margin: '-80px' })
  const [elapsed, setElapsed] = useState(0)
  const [ponds,   setPonds]   = useState(10)
  const startRef = useRef<number | null>(null)
  const rafRef   = useRef<number>(0)

  useEffect(() => {
    if (!inView) return
    startRef.current = performance.now()
    const tick = (now: number) => {
      setElapsed((now - (startRef.current ?? now)) / 1000)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [inView])

  const ratePerSec = ponds * LOSS_PER_POND_PER_SECOND
  const session    = elapsed * ratePerSec
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
    <section ref={ref} className="bg-[var(--color-navy)] border-y border-[rgba(255,255,255,0.06)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

          {/* Pond selector */}
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] mb-4">
              {t('inactionClock.eyebrow')}
            </p>
            <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-2 font-semibold">
              {t('inactionClock.pondsLabel')}
            </label>
            <input
              type="range" min={1} max={50} step={1} value={ponds}
              onChange={e => { setPonds(Number(e.target.value)); startRef.current = performance.now(); setElapsed(0) }}
              className="w-full accent-[var(--color-gold-cta)] mb-2"
            />
            <div className="flex justify-between">
              <span className="font-serif text-2xl text-[var(--color-text-on-dark)]">{ponds}</span>
              <span className="text-[10px] text-[var(--color-text-muted-dark)] self-end">
                {t('inactionClock.pondsUnit')}
              </span>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted-dark)] mt-2 leading-relaxed">
              {t('inactionClock.note')}
            </p>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            {breakdown.map(({ label, value, highlight }) => (
              <div
                key={label}
                className={`rounded-sm p-4 text-center border ${
                  highlight
                    ? 'bg-[rgba(202,138,4,0.12)] border-[var(--color-gold-cta)]'
                    : 'bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.12)]'
                }`}
              >
                <p className={`font-serif text-2xl leading-none mb-1.5 ${highlight ? 'text-[var(--color-gold-cta)]' : 'text-white'}`}>
                  {value}
                </p>
                <p className={`text-[9px] tracking-[0.2em] uppercase font-semibold ${highlight ? 'text-[var(--color-gold-cta)]/80' : 'text-[var(--color-text-muted-dark)]'}`}>
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Live counter */}
          <div className="text-center">
            <p className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-3">
              {t('inactionClock.pageCounter')}
            </p>
            <p className="font-serif text-5xl md:text-6xl text-[#ef4444] tabular-nums">
              {fmt(session)}
            </p>
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mt-2">
              {t('inactionClock.pondCounter', { ponds })}
            </p>
            <p className="text-[9px] text-[var(--color-text-muted-dark)] mt-4">
              {t('inactionClock.secondsOnPage', { n: Math.floor(elapsed) })}
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
