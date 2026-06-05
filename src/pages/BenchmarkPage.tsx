import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SEO } from '../components/ui/SEO'

// Benchmark data from 50+ audited farms
const BENCHMARKS = {
  fcr:      { p25: 1.42, p50: 1.65, p75: 1.87, label: 'Feed Conversion Ratio', lower: 0.8, upper: 3.0, step: 0.05, unit: '', lowerIsBetter: true },
  survival: { p25: 64,  p50: 74,   p75: 82,   label: 'Survival Rate (%)',     lower: 20,  upper: 100, step: 1,    unit: '%', lowerIsBetter: false },
  costPerKg:{ p25: 2.65, p50: 3.20, p75: 3.85, label: 'Cost Per Kg (USD)',    lower: 1.0, upper: 8.0, step: 0.05, unit: '$', lowerIsBetter: true },
}

type MetricKey = keyof typeof BENCHMARKS

interface MetricInputs {
  fcr: number
  survival: number
  costPerKg: number
}

function getPercentile(value: number, p25: number, p50: number, p75: number, lowerIsBetter: boolean): number {
  if (lowerIsBetter) {
    if (value <= p25) return 85 + Math.random() * 10
    if (value <= p50) return 60 + ((p50 - value) / (p50 - p25)) * 25
    if (value <= p75) return 35 + ((p75 - value) / (p75 - p50)) * 25
    return 5 + ((2 * p75 - p25 - value) / p75) * 30
  }
  if (value >= p75) return 85 + Math.random() * 10
  if (value >= p50) return 60 + ((value - p50) / (p75 - p50)) * 25
  if (value >= p25) return 35 + ((value - p25) / (p50 - p25)) * 25
  return 5 + (value / p25) * 30
}

function statusFor(pct: number): { label: string; colour: string } {
  if (pct >= 75) return { label: 'Excellent',     colour: '#22c55e' }
  if (pct >= 55) return { label: 'Above Average', colour: '#84cc16' }
  if (pct >= 40) return { label: 'Average',       colour: '#CA8A04' }
  if (pct >= 25) return { label: 'Below Average', colour: '#f97316' }
  return             { label: 'Critical Gap',  colour: '#ef4444' }
}

function productFor(key: MetricKey): { link: string; label: string } {
  if (key === 'fcr')       return { link: '/shop/fcr-optimisation-toolkit', label: 'FCR Optimisation Toolkit — $97' }
  if (key === 'survival')  return { link: '/shop/water-quality-aeration-sop', label: 'Water Quality SOP — $47' }
  return                          { link: '/consultation', label: 'Book a Consultation — $500' }
}

function BenchmarkBar({ metricKey, value, onChange }: {
  metricKey: MetricKey
  value: number
  onChange: (v: number) => void
}) {
  const bm = BENCHMARKS[metricKey]
  const pct = Math.min(95, Math.max(5, getPercentile(value, bm.p25, bm.p50, bm.p75, bm.lowerIsBetter)))
  const { label: status, colour } = statusFor(pct)
  const range = bm.upper - bm.lower
  const p25pos = ((bm.p25 - bm.lower) / range) * 100
  const p50pos = ((bm.p50 - bm.lower) / range) * 100
  const p75pos = ((bm.p75 - bm.lower) / range) * 100
  const valuePos = Math.min(96, Math.max(2, ((value - bm.lower) / range) * 100))

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-1">{bm.label}</p>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl text-[var(--color-text)]">
              {bm.unit === '$' ? '$' : ''}{value.toFixed(bm.step < 0.1 ? 2 : (bm.step < 1 ? 1 : 0))}{bm.unit === '%' ? '%' : ''}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold" style={{ color: colour }}>{status}</span>
          <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">Top {Math.round(100 - pct)}%</p>
        </div>
      </div>

      {/* Spectrum bar */}
      <div className="relative h-3 bg-[var(--color-surface-2)] rounded-full mb-3 overflow-visible">
        {/* Gradient track */}
        <div className="absolute inset-0 rounded-full" style={{
          background: bm.lowerIsBetter
            ? 'linear-gradient(to right, #22c55e, #84cc16, #CA8A04, #f97316, #ef4444)'
            : 'linear-gradient(to right, #ef4444, #f97316, #CA8A04, #84cc16, #22c55e)',
          opacity: 0.25,
        }} />
        {/* P25/P50/P75 markers */}
        {[{ pos: p25pos, label: 'P25' }, { pos: p50pos, label: 'Avg' }, { pos: p75pos, label: 'P75' }].map(m => (
          <div key={m.label}>
            <div className="absolute top-0 bottom-0 w-px bg-[var(--color-gold-muted)]" style={{ left: `${m.pos}%` }} />
            <span className="absolute text-[8px] text-[var(--color-text-muted)] -translate-x-1/2 hidden sm:block" style={{ left: `${m.pos}%`, top: '-18px' }}>{m.label}</span>
          </div>
        ))}
        {/* User needle */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-sm"
          style={{ left: `calc(${valuePos}% - 8px)`, background: colour }}
          layout transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>

      {/* Slider */}
      <input type="range" min={bm.lower} max={bm.upper} step={bm.step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-[var(--color-gold)] mt-2" />
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-[var(--color-text-muted)]">{bm.unit === '$' ? '$' : ''}{bm.lower}{bm.unit === '%' ? '%' : ''}</span>
        <span className="text-[9px] text-[var(--color-text-muted)]">{bm.unit === '$' ? '$' : ''}{bm.upper}{bm.unit === '%' ? '%' : ''}</span>
      </div>
    </div>
  )
}

export function BenchmarkPage() {
  const [values, setValues] = useState<MetricInputs>({ fcr: 1.9, survival: 72, costPerKg: 3.5 })
  const [shown, setShown] = useState(false)

  const percentiles = {
    fcr:       getPercentile(values.fcr,       BENCHMARKS.fcr.p25,       BENCHMARKS.fcr.p50,       BENCHMARKS.fcr.p75,       true),
    survival:  getPercentile(values.survival,  BENCHMARKS.survival.p25,  BENCHMARKS.survival.p50,  BENCHMARKS.survival.p75,  false),
    costPerKg: getPercentile(values.costPerKg, BENCHMARKS.costPerKg.p25, BENCHMARKS.costPerKg.p50, BENCHMARKS.costPerKg.p75, true),
  }

  const weakestKey = (Object.entries(percentiles) as [MetricKey, number][]).sort(([, a], [, b]) => a - b)[0][0]
  const product = productFor(weakestKey)
  const overallPct = Math.round((percentiles.fcr + percentiles.survival + percentiles.costPerKg) / 3)

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
      <SEO title="Benchmark My Farm — How Do You Compare?"
        description="Enter your FCR, survival rate, and cost per kg. See exactly where your farm ranks against 50+ audited operations."
        url="/benchmark" />

      <div className="max-w-3xl mx-auto px-6">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">Benchmark Tool</p>
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] leading-tight mb-4">
          How does your farm compare?
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-10 max-w-xl">
          Move the sliders to match your current metrics. See in real time where you rank against the 50+ farms in Hazem's audit database.
        </p>

        <div className="space-y-5 mb-10">
          {(['fcr', 'survival', 'costPerKg'] as MetricKey[]).map(key => (
            <BenchmarkBar key={key} metricKey={key} value={values[key]}
              onChange={v => setValues(p => ({ ...p, [key]: v }))} />
          ))}
        </div>

        {/* Overall summary */}
        <motion.div layout className="bg-[var(--color-navy)] border border-[var(--color-gold-muted)] rounded-sm p-8 mb-8">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] mb-2">Overall Standing</p>
              <p className="font-serif text-2xl text-[var(--color-text-on-dark)]">
                {overallPct >= 70 ? 'Your farm is performing above the industry median.'
                  : overallPct >= 50 ? 'Your farm is tracking near the industry average.'
                  : 'Your farm is underperforming the benchmark on key metrics.'}
              </p>
            </div>
            <div className="shrink-0 text-center">
              <p className="font-serif text-5xl text-[var(--color-gold-cta)]">{Math.round(overallPct)}</p>
              <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)]">Percentile</p>
            </div>
          </div>

          {!shown ? (
            <button onClick={() => setShown(true)}
              className="text-[11px] tracking-widest uppercase font-semibold text-[var(--color-gold-cta)] border border-[var(--color-gold-cta)] px-6 py-3 rounded-sm hover:bg-[var(--color-gold-cta)] hover:text-[var(--color-navy)] transition-all">
              Show Recommendation →
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-xs text-[var(--color-text-muted-dark)] mb-4">
                Your weakest metric is {BENCHMARKS[weakestKey].label.toLowerCase()}. This is where the highest-ROI intervention lives.
              </p>
              <Link to={product.link}
                className="inline-block bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-8 py-3.5 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all">
                {product.label} →
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Cross-links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { to: '/diagnostic', label: 'Full Farm Diagnostic', sub: 'Get a complete score across 5 dimensions' },
            { to: '/valuation', label: 'Farm Valuation', sub: "What is your farm worth to an investor?" },
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
