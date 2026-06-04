import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'

function miniPosition(value: number, min: number, max: number): number {
  return Math.min(92, Math.max(6, ((value - min) / (max - min)) * 100))
}

export function BenchmarkPreview() {
  const ref = useScrollReveal<HTMLElement>()
  const [fcr, setFcr] = useState(1.90)

  // FCR benchmarks
  const p25pos = miniPosition(1.42, 0.8, 3.0)
  const p50pos = miniPosition(1.65, 0.8, 3.0)
  const p75pos = miniPosition(1.87, 0.8, 3.0)
  const fcrPos = miniPosition(fcr, 0.8, 3.0)
  const isAboveMedian = fcr <= 1.65
  const colour = fcr <= 1.42 ? '#22c55e' : fcr <= 1.65 ? '#84cc16' : fcr <= 1.87 ? '#CA8A04' : '#ef4444'

  return (
    <section ref={ref} className="scroll-reveal max-w-6xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

        {/* Left — live preview */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-8">
          <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-6">Live Benchmark Preview — FCR</p>

          <div className="mb-6">
            <div className="flex justify-between items-baseline mb-3">
              <span className="font-serif text-3xl text-[var(--color-text)]">{fcr.toFixed(2)}</span>
              <span className="text-xs font-semibold" style={{ color: colour }}>{isAboveMedian ? 'Above Median' : 'Below Median'}</span>
            </div>

            {/* Bar */}
            <div className="relative h-3 bg-[var(--color-surface-2)] rounded-full mb-3">
              <div className="absolute inset-0 rounded-full opacity-20" style={{ background: 'linear-gradient(to right, #22c55e, #CA8A04, #ef4444)' }} />
              {[{ pos: p25pos, l: 'P25' }, { pos: p50pos, l: 'Avg' }, { pos: p75pos, l: 'P75' }].map(m => (
                <div key={m.l}>
                  <div className="absolute top-0 bottom-0 w-px bg-[var(--color-gold-muted)]" style={{ left: `${m.pos}%` }} />
                  <span className="absolute -top-5 text-[8px] text-[var(--color-text-muted)] -translate-x-1/2" style={{ left: `${m.pos}%` }}>{m.l}</span>
                </div>
              ))}
              <motion.div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ left: `calc(${fcrPos}% - 8px)`, background: colour }}
                layout transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
            </div>

            <input type="range" min={0.8} max={3.0} step={0.05} value={fcr}
              onChange={e => setFcr(Number(e.target.value))} className="w-full accent-[var(--color-gold)]" />
            <p className="text-[10px] text-[var(--color-text-muted)] mt-2">
              Benchmark median: 1.65 · Your FCR: {fcr.toFixed(2)} ·{' '}
              {fcr <= 1.65
                ? `You are in the top half of audited farms`
                : `${Math.round((fcr - 1.65) / 1.65 * 100)}% above benchmark median`}
            </p>
          </div>

          <Link to="/benchmark"
            className="block text-center border border-[var(--color-gold-muted)] text-[var(--color-text-muted)] py-3 text-[10px] tracking-widest uppercase rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all">
            See All 3 Metrics — Full Benchmark →
          </Link>
        </div>

        {/* Right — copy */}
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">Benchmark Tool</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-text)] leading-tight mb-5">
            How does your farm rank against the benchmark?
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
            Move the slider to your current FCR. See in real time where you sit against 50+ audited operations.
            The full tool covers FCR, survival rate, and cost per kilogram.
          </p>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-8">
            Each metric shows your percentile rank, a colour-coded status, and the highest-ROI resource to close the gap.
          </p>
          <Link to="/benchmark"
            className="inline-block bg-[var(--color-navy)] text-[var(--color-gold-cta)] border border-[var(--color-gold-muted)] px-8 py-4 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:border-[var(--color-gold-cta)] transition-all">
            Benchmark My Farm →
          </Link>
        </div>
      </div>
    </section>
  )
}
