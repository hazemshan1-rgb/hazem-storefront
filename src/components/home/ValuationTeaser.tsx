import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  return `$${Math.round(n / 1000)}K`
}

export function ValuationTeaser() {
  const ref = useScrollReveal<HTMLElement>()
  const [revenue, setRevenue] = useState(500_000)

  const margin = 14
  const ebitda = revenue * (margin / 100)
  const currentVal = ebitda * 3.8
  const postVal = (revenue * ((margin + 10) / 100)) * 4.55
  const uplift = postVal - currentVal

  return (
    <section ref={ref} className="scroll-reveal bg-[var(--color-surface)] border-y border-[var(--color-gold-muted)]">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left — copy */}
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">Farm Valuation Tool</p>
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-text)] leading-tight mb-5">
              What would your farm sell for today — and after the programme?
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
              Move the slider to your revenue. The tool calculates your current investor valuation and the
              value the 90-Day Transformation Programme would unlock — using the same EBITDA-multiple
              methodology Hazem uses in Tier 3 due diligence.
            </p>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-8">
              The full tool includes margin, documentation quality, and years in operation.
            </p>
            <Link to="/valuation"
              className="inline-block border border-[var(--color-gold-muted)] text-[var(--color-text-muted)] px-8 py-4 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all">
              Open Full Valuation Calculator →
            </Link>
          </div>

          {/* Right — live cards */}
          <div>
            <div className="mb-5">
              <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-2 font-semibold">Annual Revenue</label>
              <input type="range" min={50000} max={3000000} step={25000} value={revenue}
                onChange={e => setRevenue(Number(e.target.value))} className="w-full accent-[var(--color-gold)] mb-1" />
              <span className="font-serif text-sm text-[var(--color-text)]">{fmt(revenue)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[var(--color-surface-2)] border border-[var(--color-gold-muted)] rounded-sm p-5">
                <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted)] mb-3">Today</p>
                <motion.p key={currentVal} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="font-serif text-2xl text-[var(--color-text)]">{fmt(currentVal)}</motion.p>
                <p className="text-[9px] text-[var(--color-text-muted)] mt-1">at 14% margin · 3.8×</p>
              </div>
              <div className="bg-[var(--color-navy)] border border-[var(--color-gold-cta)] rounded-sm p-5">
                <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold-cta)] mb-3">After Programme</p>
                <motion.p key={postVal} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="font-serif text-2xl text-[var(--color-text-on-dark)]">{fmt(postVal)}</motion.p>
                <p className="text-[9px] text-[var(--color-text-muted-dark)] mt-1">at 24% margin · 4.55×</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between px-1">
              <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">Uplift</span>
              <motion.span key={uplift} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="font-serif text-xl text-[var(--color-gold-cta)]">+{fmt(uplift)}</motion.span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
