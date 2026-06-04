import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

// $55,000/yr farm leak ÷ 365 ÷ 24 ÷ 3600 = $0.001743 per second
// Based on: FCR 1.90 vs 1.65 benchmark on $600K revenue + survival gap
const RATE_PER_SECOND = 0.001743

export function InactionClock() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef<number | null>(null)
  const rafRef   = useRef<number>(0)

  useEffect(() => {
    if (!inView) return
    startRef.current = performance.now()
    const tick = (now: number) => {
      const secs = (now - (startRef.current ?? now)) / 1000
      setElapsed(secs)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [inView])

  const lost = (elapsed * RATE_PER_SECOND).toFixed(2)
  const monthly = (RATE_PER_SECOND * 86400 * 30).toFixed(0)

  return (
    <section ref={ref} className="border-y border-[var(--color-gold-muted)] bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2">Cost of Inaction</p>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-md">
              A farm running at 75% capacity with an FCR of 1.90 is leaving{' '}
              <span className="text-[var(--color-text)] font-semibold">${Number(monthly).toLocaleString()}/month</span>{' '}
              on the table. Since you started reading this page:
            </p>
          </div>
          <div className="text-center shrink-0">
            <p className="font-serif text-5xl md:text-6xl text-[var(--color-gold)] tabular-nums">
              ${lost}
            </p>
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted)] mt-1">
              lost on a typical underperforming farm
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
