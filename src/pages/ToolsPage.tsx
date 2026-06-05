import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SEO } from '../components/ui/SEO'

// ── Farm Diagnostic ghost scorecard ───────────────────────────────────────

const DIMS = ['Feed Efficiency', 'Survival & Health', 'Operations', 'Financial', 'Infrastructure']

function DiagnosticPreview() {
  return (
    <div className="relative">
      <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold-cta)]">Farm Health Score</p>
          <div className="w-14 h-14 rounded-full border-2 border-[var(--color-gold-cta)]/30 flex items-center justify-center">
            <span className="font-serif text-xl text-[var(--color-gold-cta)]/40">??</span>
          </div>
        </div>
        <div className="space-y-3 mb-6">
          {DIMS.map(d => (
            <div key={d} className="flex items-center justify-between">
              <span className="text-xs text-[var(--color-text-muted-dark)]">{d}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-1.5 bg-[rgba(255,255,255,0.08)] rounded-full" />
                <span className="text-xs text-[var(--color-text-muted-dark)] w-8 text-right">?/10</span>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] rounded-sm text-center">
          <p className="text-xs text-[var(--color-text-muted-dark)]">Complete the diagnostic to unlock your results</p>
        </div>
      </div>
      <div className="absolute inset-0 backdrop-blur-[2px] rounded-sm flex items-center justify-center">
        <Link to="/diagnostic"
          className="bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-6 py-3 text-[10px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all shadow-lg">
          Unlock Your Score →
        </Link>
      </div>
    </div>
  )
}

// ── Benchmark live FCR widget ──────────────────────────────────────────────

function miniPos(v: number, min: number, max: number) {
  return Math.min(92, Math.max(6, ((v - min) / (max - min)) * 100))
}

function BenchmarkWidget() {
  const [fcr, setFcr] = useState(1.90)
  const p25 = miniPos(1.42, 0.8, 3.0)
  const p50 = miniPos(1.65, 0.8, 3.0)
  const p75 = miniPos(1.87, 0.8, 3.0)
  const fcrPos = miniPos(fcr, 0.8, 3.0)
  const colour = fcr <= 1.42 ? '#22c55e' : fcr <= 1.65 ? '#84cc16' : fcr <= 1.87 ? '#CA8A04' : '#ef4444'

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-8">
      <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-6">Live Preview — FCR</p>
      <div className="mb-6">
        <div className="flex justify-between items-baseline mb-3">
          <span className="font-serif text-3xl text-[var(--color-text)]">{fcr.toFixed(2)}</span>
          <span className="text-xs font-semibold" style={{ color: colour }}>
            {fcr <= 1.65 ? 'Above Median' : 'Below Median'}
          </span>
        </div>
        <div className="relative h-3 bg-[var(--color-surface-2)] rounded-full mb-3">
          <div className="absolute inset-0 rounded-full opacity-20"
            style={{ background: 'linear-gradient(to right, #22c55e, #CA8A04, #ef4444)' }} />
          {[{ pos: p25, l: 'P25' }, { pos: p50, l: 'Avg' }, { pos: p75, l: 'P75' }].map(m => (
            <div key={m.l}>
              <div className="absolute top-0 bottom-0 w-px bg-[var(--color-gold-muted)]"
                style={{ left: `${m.pos}%` }} />
              <span className="absolute -top-5 text-[8px] text-[var(--color-text-muted)] -translate-x-1/2"
                style={{ left: `${m.pos}%` }}>{m.l}</span>
            </div>
          ))}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ left: `calc(${fcrPos}% - 8px)`, background: colour }}
            layout transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
        <input type="range" min={0.8} max={3.0} step={0.05} value={fcr}
          onChange={e => setFcr(Number(e.target.value))}
          className="w-full accent-[var(--color-gold)]" />
        <p className="text-[10px] text-[var(--color-text-muted)] mt-2">
          Benchmark median: 1.65 · Your FCR: {fcr.toFixed(2)} ·{' '}
          {fcr <= 1.65 ? 'Top half of audited farms' : `${Math.round((fcr - 1.65) / 1.65 * 100)}% above median`}
        </p>
      </div>
    </div>
  )
}

// ── Margin Recovery Calculator ─────────────────────────────────────────────

function MarginWidget() {
  const [revenue, setRevenue] = useState(1_000_000)
  const [fcr, setFcr] = useState(1.8)

  const feedCost = revenue * 0.8 * 0.6
  const targetFcr = Math.max(1.2, fcr - 0.2)
  const savings = feedCost - feedCost * (targetFcr / fcr)

  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const target = Math.round(savings)
    const start = display
    if (start === target) return
    const t0 = performance.now()
    const run = (now: number) => {
      const p = Math.min((now - t0) / 800, 1)
      setDisplay(Math.floor(start + (target - start) * (p * (2 - p))))
      if (p < 1) requestAnimationFrame(run)
    }
    requestAnimationFrame(run)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savings])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
      <div className="space-y-7">
        <div>
          <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-3 font-semibold">
            Annual Revenue (USD)
          </label>
          <input type="range" min={100_000} max={5_000_000} step={100_000} value={revenue}
            onChange={e => setRevenue(Number(e.target.value))}
            className="w-full accent-[var(--color-gold)]" />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-[var(--color-text-on-dark)] font-serif">${revenue.toLocaleString()}</span>
            <span className="text-[10px] text-[var(--color-text-muted-dark)]">$5M</span>
          </div>
        </div>
        <div>
          <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-3 font-semibold">
            Current FCR
          </label>
          <input type="range" min={1.2} max={2.5} step={0.1} value={fcr}
            onChange={e => setFcr(Number(e.target.value))}
            className="w-full accent-[var(--color-gold)]" />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-[var(--color-text-on-dark)] font-serif">{fcr.toFixed(1)}</span>
            <span className="text-[10px] text-[var(--color-text-muted-dark)]">2.5</span>
          </div>
        </div>
      </div>
      <div className="text-center p-8 bg-[var(--color-surface)] rounded-sm border border-[var(--color-gold-muted)]">
        <p className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-2">Potential Annual Recovery</p>
        <p className="font-serif text-5xl text-[var(--color-gold)] mb-3">${display.toLocaleString()}</p>
        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
          Margin recovered by optimising FCR to <strong>{targetFcr.toFixed(1)}</strong>.
        </p>
      </div>
    </div>
  )
}

// ── Farm Valuation live slider ─────────────────────────────────────────────

function fmtVal(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  return `$${Math.round(n / 1000)}K`
}

function ValuationWidget() {
  const [revenue, setRevenue] = useState(500_000)
  const currentVal = revenue * 0.14 * 3.8
  const postVal = revenue * 0.24 * 4.55
  const uplift = postVal - currentVal

  return (
    <div>
      <div className="mb-5">
        <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-2 font-semibold">
          Annual Revenue
        </label>
        <input type="range" min={50_000} max={3_000_000} step={25_000} value={revenue}
          onChange={e => setRevenue(Number(e.target.value))}
          className="w-full accent-[var(--color-gold)] mb-1" />
        <span className="font-serif text-sm text-[var(--color-text)]">{fmtVal(revenue)}</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[var(--color-surface-2)] border border-[var(--color-gold-muted)] rounded-sm p-5">
          <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted)] mb-3">Today</p>
          <motion.p key={currentVal} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="font-serif text-2xl text-[var(--color-text)]">{fmtVal(currentVal)}</motion.p>
          <p className="text-[9px] text-[var(--color-text-muted)] mt-1">14% margin · 3.8×</p>
        </div>
        <div className="bg-[var(--color-navy)] border border-[var(--color-gold-cta)] rounded-sm p-5">
          <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold-cta)] mb-3">After Programme</p>
          <motion.p key={postVal} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="font-serif text-2xl text-[var(--color-text-on-dark)]">{fmtVal(postVal)}</motion.p>
          <p className="text-[9px] text-[var(--color-text-muted-dark)] mt-1">24% margin · 4.55×</p>
        </div>
      </div>
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">Uplift</span>
        <motion.span key={uplift} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="font-serif text-xl text-[var(--color-gold-cta)]">+{fmtVal(uplift)}</motion.span>
      </div>
    </div>
  )
}

// ── Motion config ──────────────────────────────────────────────────────────

const container = { animate: { transition: { staggerChildren: 0.07 } } }
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

// ── Page ───────────────────────────────────────────────────────────────────

export function ToolsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
      <SEO
        title="Free Diagnostic Tools — Farm Score, Benchmark, Valuation & AI"
        description="Six free tools for aquaculture farm operators: Farm Health Diagnostic, Benchmark, Margin Recovery Calculator, Valuation Calculator, AI Symptom Checker, and Library AI Assistant."
        url="/tools"
      />

      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 mb-16">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">Free Diagnostic Tools</p>
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] leading-tight mb-4">
          Six tools. Free. No sign-up required.
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xl">
          Built from 30 years of field work across 15 countries. Each gives you a specific output, not a vague overview.
          Start with the Farm Diagnostic if you're not sure where to begin.
        </p>
      </div>

      {/* ── 1. Farm Health Diagnostic ── */}
      <section className="bg-[var(--color-navy)] border-y border-[rgba(255,255,255,0.08)]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-block text-[9px] tracking-[0.2em] uppercase font-semibold px-2.5 py-1 rounded-sm mb-5 text-[var(--color-navy)] bg-[var(--color-gold-cta)] border border-[var(--color-gold-cta)]">
                Start Here
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text-on-dark)] leading-tight mb-3">
                Farm Health Diagnostic
              </h2>
              <p className="text-[10px] text-[var(--color-text-muted-dark)] mb-4">6 questions · 2 minutes</p>
              <p className="text-sm text-[var(--color-text-muted-dark)] leading-relaxed mb-8">
                Score your operation across Feed Efficiency, Survival, Operations, Financial Readiness, and Infrastructure.
                Get an estimated monthly revenue leak and a specific action plan.
                Benchmarks drawn from 50+ farms across 15 countries.
              </p>
              <Link to="/diagnostic"
                className="inline-block bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-8 py-4 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all">
                Get My Farm Score →
              </Link>
            </div>
            <DiagnosticPreview />
          </div>
        </div>
      </section>

      {/* ── 2. Benchmark ── */}
      <section className="border-b border-[var(--color-gold-muted)]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <BenchmarkWidget />
            <div>
              <span className="inline-block text-[9px] tracking-[0.2em] uppercase font-semibold px-2.5 py-1 rounded-sm border text-[var(--color-gold)] border-[var(--color-gold-muted)] mb-5">
                Instant
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text)] leading-tight mb-3">
                Benchmark My Farm
              </h2>
              <p className="text-[10px] text-[var(--color-text-muted)] mb-4">FCR · survival · cost/kg</p>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-8">
                Enter three metrics and see in real time where your operation ranks against 50+ audited farms —
                percentile position and colour-coded status for each. The live preview uses FCR.
                The full tool covers all three metrics with the highest-ROI resource to close each gap.
              </p>
              <Link to="/benchmark"
                className="inline-block border border-[var(--color-gold-muted)] text-[var(--color-text-muted)] px-8 py-4 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all">
                Benchmark Now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Margin Recovery Calculator ── */}
      <section className="bg-[var(--color-navy)] border-b border-[rgba(255,255,255,0.08)]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="mb-10">
            <span className="inline-block text-[9px] tracking-[0.2em] uppercase font-semibold px-2.5 py-1 rounded-sm border text-[var(--color-gold)] border-[var(--color-gold-muted)] mb-5">
              Calculator
            </span>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text-on-dark)] leading-tight mb-3">
              Margin Recovery Calculator
            </h2>
            <p className="text-sm text-[var(--color-text-muted-dark)] leading-relaxed max-w-xl">
              A 0.2 improvement in FCR can recover hundreds of thousands in lost margin. Set your revenue and current FCR to see what's on the table.
            </p>
          </div>
          <MarginWidget />
          <div className="mt-10">
            <Link to="/audit"
              className="inline-block bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-8 py-4 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all">
              Get the Full Audit →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. Farm Valuation Calculator ── */}
      <section className="border-b border-[var(--color-gold-muted)]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-block text-[9px] tracking-[0.2em] uppercase font-semibold px-2.5 py-1 rounded-sm border text-[var(--color-gold)] border-[var(--color-gold-muted)] mb-5">
                Instant
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text)] leading-tight mb-3">
                Farm Valuation Calculator
              </h2>
              <p className="text-[10px] text-[var(--color-text-muted)] mb-4">EBITDA multiple methodology</p>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
                Move the slider to your revenue. See your current investor valuation and the value the
                90-Day Transformation Programme would unlock — using the same EBITDA-multiple methodology
                used in Tier 3 due diligence.
              </p>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-8">
                The full tool includes margin, documentation quality, and years in operation.
              </p>
              <Link to="/valuation"
                className="inline-block border border-[var(--color-gold-muted)] text-[var(--color-text-muted)] px-8 py-4 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all">
                Open Full Calculator →
              </Link>
            </div>
            <ValuationWidget />
          </div>
        </div>
      </section>

      {/* ── 5 + 6. AI Tools ── */}
      <section className="border-b border-[var(--color-gold-muted)]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-8">AI-Powered</p>
          <motion.div variants={container} initial="initial" animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                to: '/symptom-checker',
                label: 'AI Symptom Checker',
                sub: 'Instant diagnosis',
                desc: "Describe what's going wrong in one sentence. The AI returns the likely root cause, the one metric to measure, and a 48-hour action — trained on 30 years of field experience.",
                cta: 'Diagnose a Symptom →',
              },
              {
                to: '/ask',
                label: 'Library AI Assistant',
                sub: 'Ask anything about aquaculture',
                desc: "Ask any question about shrimp production, water quality, feed management, biofloc systems, disease, or farm economics. Draws on Hazem's curated library of 35+ technical resources.",
                cta: 'Ask a Question →',
              },
            ].map(t => (
              <motion.div key={t.to} variants={fadeUp}>
                <Link to={t.to}
                  className="group flex flex-col h-full rounded-sm border bg-[var(--color-surface)] border-[var(--color-gold-muted)] hover:border-[var(--color-gold)] transition-all hover:shadow-lg">
                  <div className="p-6 sm:p-8 flex flex-col h-full">
                    <h2 className="font-serif text-xl mb-1 text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors">
                      {t.label}
                    </h2>
                    <p className="text-[10px] text-[var(--color-text-muted)] mb-4">{t.sub}</p>
                    <p className="text-sm leading-relaxed text-[var(--color-text-muted)] flex-1 mb-6">{t.desc}</p>
                    <span className="self-start text-[10px] tracking-widest uppercase font-semibold px-5 py-2.5 rounded-sm transition-all border border-[var(--color-gold-muted)] text-[var(--color-text-muted)] group-hover:border-[var(--color-gold)] group-hover:text-[var(--color-gold)]">
                      {t.cta}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA footer ── */}
      <div className="max-w-5xl mx-auto px-6 mt-12">
        <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm">
          <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-2">Need more than a tool?</p>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
            These tools surface what the problems are. The audit and consultation engagements fix them — with a guaranteed outcome on Tier 2.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/consultation"
              className="text-[10px] tracking-widest uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-5 py-2.5 rounded-sm hover:brightness-110 transition-all">
              Book a $500 Session →
            </Link>
            <Link to="/audit"
              className="text-[10px] tracking-widest uppercase font-semibold text-[var(--color-text-muted)] border border-[var(--color-gold-muted)] px-5 py-2.5 rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all">
              See Audit Tiers →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
