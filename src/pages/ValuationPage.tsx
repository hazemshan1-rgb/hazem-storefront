import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SEO } from '../components/ui/SEO'

function getMultiple(years: string, docs: string): number {
  const base: Record<string, number> = { under3: 3.0, '3to7': 3.8, over7: 4.5 }
  const bonus: Record<string, number> = { none: 0, basic: 0.3, full: 0.7 }
  return (base[years] ?? 3.0) + (bonus[docs] ?? 0)
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${Math.round(n / 1000)}K`
  return `$${Math.round(n)}`
}

export function ValuationPage() {
  const [revenue,  setRevenue]  = useState(500_000)
  const [margin,   setMargin]   = useState(14)
  const [years,    setYears]    = useState('3to7')
  const [docs,     setDocs]     = useState('basic')
  const [revealed, setRevealed] = useState(false)

  const ebitda      = revenue * (margin / 100)
  const multiple    = getMultiple(years, docs)
  const currentVal  = ebitda * multiple

  // Post-programme: +10pp margin, +0.75 multiple (better docs assumed after programme)
  const postMargin  = Math.min(margin + 10, 45)
  const postEbitda  = revenue * (postMargin / 100)
  const postMultiple = multiple + 0.75
  const postVal     = postEbitda * postMultiple
  const uplift      = postVal - currentVal

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
      <SEO title="Farm Valuation Calculator — What Is Your Farm Worth?"
        description="Enter your revenue, margin, and documentation status. See your farm's current valuation and its potential value after the 90-Day Transformation Programme."
        url="/valuation" />

      <div className="max-w-4xl mx-auto px-6">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">Valuation Tool</p>
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] leading-tight mb-4">
          What is your farm worth?
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-10 max-w-xl">
          Four inputs. See your current investor valuation and the value the 90-Day Transformation Programme would unlock.
          Based on the same EBITDA-multiple methodology used in Hazem's Tier 3 due diligence work.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Inputs */}
          <div className="space-y-8">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-3 font-semibold">Annual Revenue (USD)</label>
              <input type="range" min={50000} max={5000000} step={25000} value={revenue}
                onChange={e => setRevenue(Number(e.target.value))} className="w-full accent-[var(--color-gold)]" />
              <div className="flex justify-between mt-1">
                <span className="font-serif text-sm text-[var(--color-text)]">{fmt(revenue)}</span>
                <span className="text-[10px] text-[var(--color-text-muted)]">$5M</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-3 font-semibold">Current Net Margin (%)</label>
              <input type="range" min={2} max={40} step={1} value={margin}
                onChange={e => setMargin(Number(e.target.value))} className="w-full accent-[var(--color-gold)]" />
              <div className="flex justify-between mt-1">
                <span className="font-serif text-sm text-[var(--color-text)]">{margin}%</span>
                <span className="text-[10px] text-[var(--color-text-muted)]">40%</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-3 font-semibold">Years in Operation</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'under3', label: 'Under 3' },
                  { value: '3to7',   label: '3 – 7' },
                  { value: 'over7',  label: '7+' },
                ].map(o => (
                  <button key={o.value} onClick={() => setYears(o.value)}
                    className={`py-3 text-xs border rounded-sm transition-all ${years === o.value ? 'border-[var(--color-gold-cta)] bg-[var(--color-gold-cta)]/8 text-[var(--color-text)] font-semibold' : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-gold)]'}`}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-3 font-semibold">Financial Documentation</label>
              <div className="space-y-2">
                {[
                  { value: 'none',  label: 'No formal records' },
                  { value: 'basic', label: 'Basic revenue and cost records' },
                  { value: 'full',  label: 'Full P&L with cost-per-kg tracked' },
                ].map(o => (
                  <button key={o.value} onClick={() => setDocs(o.value)}
                    className={`w-full text-left px-4 py-3 text-sm border rounded-sm transition-all ${docs === o.value ? 'border-[var(--color-gold-cta)] bg-[var(--color-gold-cta)]/8 text-[var(--color-text)]' : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-gold)]'}`}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Valuation cards */}
          <div className="flex flex-col gap-5">
            {/* Current */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6">
              <p className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-4">Your Farm Today</p>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">EBITDA</span>
                  <span className="text-[var(--color-text)] font-semibold">{fmt(ebitda)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">Valuation multiple</span>
                  <span className="text-[var(--color-text)] font-semibold">{multiple.toFixed(1)}×</span>
                </div>
                <div className="h-px bg-[var(--color-gold-muted)]" />
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--color-text-muted)]">Estimated value</span>
                  <motion.span key={currentVal} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="font-serif text-2xl text-[var(--color-text)]">{fmt(currentVal)}</motion.span>
                </div>
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed">
                At {multiple.toFixed(1)}× EBITDA — standard for a farm with {docs === 'full' ? 'strong documentation' : docs === 'basic' ? 'basic records' : 'limited documentation'} and {years === 'over7' ? '7+ years' : years === '3to7' ? '3–7 years' : 'under 3 years'} of operation.
              </p>
            </div>

            {/* Post-programme */}
            <div className="bg-[var(--color-navy)] border border-[var(--color-gold-cta)] rounded-sm p-6">
              <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold-cta)] mb-4">After the 90-Day Programme</p>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted-dark)]">EBITDA (+10pp margin)</span>
                  <span className="text-[var(--color-text-on-dark)] font-semibold">{fmt(postEbitda)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted-dark)]">Multiple (better docs)</span>
                  <span className="text-[var(--color-text-on-dark)] font-semibold">{postMultiple.toFixed(1)}×</span>
                </div>
                <div className="h-px bg-[rgba(255,255,255,0.08)]" />
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--color-text-muted-dark)]">Estimated value</span>
                  <motion.span key={postVal} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="font-serif text-2xl text-[var(--color-text-on-dark)]">{fmt(postVal)}</motion.span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.08)]">
                <span className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted-dark)]">Value uplift</span>
                <motion.span key={uplift} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="font-serif text-3xl text-[var(--color-gold-cta)]">+{fmt(uplift)}</motion.span>
              </div>
            </div>

            {/* CTA */}
            {!revealed ? (
              <button onClick={() => setRevealed(true)}
                className="w-full bg-[var(--color-gold-cta)] text-[var(--color-navy)] py-4 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all">
                See How to Get There →
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-5 space-y-3">
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  The {fmt(uplift)} uplift assumes a guaranteed 10-percentage-point margin improvement (Tier 2 guarantee) plus improved documentation commanding a higher multiple in investor conversations.
                </p>
                <Link to="/audit"
                  className="block text-center bg-[var(--color-gold-cta)] text-[var(--color-navy)] py-3.5 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all">
                  See the 90-Day Programme →
                </Link>
                <Link to="/consultation"
                  className="block text-center border border-[var(--color-gold-muted)] text-[var(--color-text-muted)] py-3 text-[10px] tracking-widest uppercase rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all">
                  Talk it through first — Book a $500 Session
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Disclaimer + cross-links */}
        <p className="text-[10px] text-[var(--color-text-muted)] mt-8 mb-10 leading-relaxed max-w-xl">
          Indicative only. Actual valuations depend on verified financials, market conditions, buyer profile, and asset quality.
          The 10pp margin improvement reflects the Tier 2 contractual guarantee, not a projection.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { to: '/diagnostic', label: 'Farm Diagnostic', sub: 'Get your full health score first' },
            { to: '/benchmark',  label: 'Benchmark My Farm', sub: 'See how your metrics compare' },
            { to: '/symptom-checker', label: 'AI Symptom Checker', sub: 'Describe a specific problem for a free diagnosis' },
          ].map(l => (
            <Link key={l.to} to={l.to}
              className="block p-5 bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm hover:border-[var(--color-gold)] transition-all group">
              <p className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors mb-1">{l.label}</p>
              <p className="text-xs text-[var(--color-text-muted)] leading-snug">{l.sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
