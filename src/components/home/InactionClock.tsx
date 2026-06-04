import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

// Model: each pond ≈ $70K annual revenue, 25% efficiency gap = $17,500/pond/yr lost
const LOSS_PER_POND_PER_SECOND = 17500 / 365 / 24 / 3600  // $0.000555/pond/sec

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `$${Math.round(n).toLocaleString()}`
  return `$${n.toFixed(2)}`
}

export function InactionClock() {
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

  return (
    <section ref={ref} className="bg-[var(--color-navy)] border-y border-[rgba(255,255,255,0.06)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

          {/* Pond selector */}
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] mb-4">Cost of Inaction</p>
            <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-2 font-semibold">
              Number of ponds
            </label>
            <input
              type="range" min={1} max={50} step={1} value={ponds}
              onChange={e => { setPonds(Number(e.target.value)); startRef.current = performance.now(); setElapsed(0) }}
              className="w-full accent-[var(--color-gold-cta)] mb-2"
            />
            <div className="flex justify-between">
              <span className="font-serif text-2xl text-[var(--color-text-on-dark)]">{ponds}</span>
              <span className="text-[10px] text-[var(--color-text-muted-dark)] self-end">ponds</span>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted-dark)] mt-2 leading-relaxed">
              Based on 25% inefficiency gap vs benchmark on typical intensive production.
            </p>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Annual leak',    value: fmt(annual)  },
              { label: 'Monthly leak',   value: fmt(monthly) },
              { label: 'Daily leak',     value: fmt(daily)   },
              { label: 'Per hour',       value: fmt(ratePerSec * 3600) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] rounded-sm p-3 text-center">
                <p className="font-serif text-lg text-[var(--color-gold-cta)]">{value}</p>
                <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Live counter */}
          <div className="text-center">
            <p className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-3">
              Lost since this page opened
            </p>
            <p className="font-serif text-5xl md:text-6xl text-[#ef4444] tabular-nums">
              {fmt(session)}
            </p>
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mt-2">
              on your {ponds}-pond operation
            </p>
            <p className="text-[9px] text-[var(--color-text-muted-dark)] mt-4">
              {(elapsed).toFixed(0)}s on this page
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
