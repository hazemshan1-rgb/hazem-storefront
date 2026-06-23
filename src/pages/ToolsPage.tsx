import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { SEO } from '../components/ui/SEO'
import { SubscribeForm } from '../components/ui/SubscribeForm'

const DIMS = ['Feed Efficiency', 'Survival & Health', 'Operations', 'Financial', 'Infrastructure']

function DiagnosticPreview() {
  const { t } = useTranslation()
  return (
    <div className="relative">
      <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold-cta)]">{t('tools.farmHealthScore')}</p>
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
          <p className="text-xs text-[var(--color-text-muted-dark)]">{t('tools.unlockResults')}</p>
        </div>
      </div>
      <div className="absolute inset-0 backdrop-blur-[2px] rounded-sm flex items-center justify-center">
        <Link to="/diagnostic"
          className="bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-6 py-3 text-[10px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all shadow-lg">
          {t('tools.unlockScoreBtn')}
        </Link>
      </div>
    </div>
  )
}

function miniPos(v: number, min: number, max: number) {
  return Math.min(92, Math.max(6, ((v - min) / (max - min)) * 100))
}

function BenchmarkWidget() {
  const { t } = useTranslation()
  const [fcr, setFcr] = useState(1.90)
  const p25 = miniPos(1.42, 0.8, 3.0)
  const p50 = miniPos(1.65, 0.8, 3.0)
  const p75 = miniPos(1.87, 0.8, 3.0)
  const fcrPos = miniPos(fcr, 0.8, 3.0)
  const colour = fcr <= 1.42 ? '#22c55e' : fcr <= 1.65 ? '#84cc16' : fcr <= 1.87 ? '#CA8A04' : '#ef4444'

  const fcrStatus = fcr <= 1.65
    ? t('tools.aboveMedian')
    : t('tools.belowMedian')

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-8">
      <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-6">{t('tools.livePreviewFcr')}</p>
      <div className="mb-6">
        <div className="flex justify-between items-baseline mb-3">
          <span className="font-serif text-3xl text-[var(--color-text)]">{fcr.toFixed(2)}</span>
          <span className="text-xs font-semibold" style={{ color: colour }}>{fcrStatus}</span>
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
          {t('tools.benchmarkFcrNote', { fcr: fcr.toFixed(2) })}
          {fcr > 1.65 && ` · ${Math.round((fcr - 1.65) / 1.65 * 100)}% above median`}
        </p>
      </div>
    </div>
  )
}

function useCounter(target: number) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
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
  }, [target])
  return display
}

function MarginWidget() {
  const { t } = useTranslation()
  const [revenue,  setRevenue]  = useState(1_000_000)
  const [fcr,      setFcr]      = useState(1.8)
  const [survival, setSurvival] = useState(72)

  const feedCost    = revenue * 0.8 * 0.6
  const targetFcr   = Math.max(1.2, fcr - 0.2)
  const fcrSavings  = feedCost - feedCost * (targetFcr / fcr)

  const survivalBenchmark = 78
  const survivalGain = Math.max(0, survivalBenchmark - survival)
  const survivalSavings = survival < survivalBenchmark
    ? revenue * (survivalGain / 100) * 0.65
    : 0

  const totalSavings = Math.round(fcrSavings + survivalSavings)
  const displayTotal = useCounter(totalSavings)
  const displayFcr   = useCounter(Math.round(fcrSavings))
  const displaySrv   = useCounter(Math.round(survivalSavings))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
      <div className="space-y-7">
        <div>
          <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-3 font-semibold">
            {t('tools.annualRevenue')}
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
            <span className="text-[10px] text-[var(--color-text-muted-dark)]">{t('tools.medianBenchmark165')}</span>
          </div>
        </div>
        <div>
          <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-3 font-semibold">
            {t('tools.currentSurvival')}
          </label>
          <input type="range" min={30} max={98} step={1} value={survival}
            onChange={e => setSurvival(Number(e.target.value))}
            className="w-full accent-[var(--color-gold)]" />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-[var(--color-text-on-dark)] font-serif">{survival}%</span>
            <span className="text-[10px] text-[var(--color-text-muted-dark)]">{t('tools.medianBenchmark78')}</span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="text-center p-8 bg-[var(--color-surface)] rounded-sm border border-[var(--color-gold-cta)]">
          <p className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-2">{t('tools.totalPotentialRecovery')}</p>
          <p className="font-serif text-5xl text-[var(--color-gold)] mb-3">${displayTotal.toLocaleString()}</p>
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            {t('tools.fcrSurvivalNote')}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-[var(--color-surface)] rounded-sm border border-[var(--color-gold-muted)] text-center">
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold)] mb-1">FCR gain</p>
            <p className="font-serif text-xl text-[var(--color-text)]">${displayFcr.toLocaleString()}</p>
            <p className="text-[9px] text-[var(--color-text-muted)] mt-1">→ target FCR {targetFcr.toFixed(1)}</p>
          </div>
          <div className="p-4 bg-[var(--color-surface)] rounded-sm border border-[var(--color-gold-muted)] text-center">
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold)] mb-1">Survival gain</p>
            <p className="font-serif text-xl text-[var(--color-text)]">${displaySrv.toLocaleString()}</p>
            <p className="text-[9px] text-[var(--color-text-muted)] mt-1">→ target 78%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function fmtVal(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  return `$${Math.round(n / 1000)}K`
}

function ValuationWidget() {
  const { t } = useTranslation()
  const [revenue, setRevenue] = useState(500_000)
  const currentVal = revenue * 0.14 * 3.8
  const postVal = revenue * 0.24 * 4.55
  const uplift = postVal - currentVal

  return (
    <div>
      <div className="mb-5">
        <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-2 font-semibold">
          {t('tools.annualRevenue')}
        </label>
        <input type="range" min={50_000} max={3_000_000} step={25_000} value={revenue}
          onChange={e => setRevenue(Number(e.target.value))}
          className="w-full accent-[var(--color-gold)] mb-1" />
        <span className="font-serif text-sm text-[var(--color-text)]">{fmtVal(revenue)}</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[var(--color-surface-2)] border border-[var(--color-gold-muted)] rounded-sm p-5">
          <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted)] mb-3">{t('tools.valuationToday')}</p>
          <motion.p key={currentVal} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="font-serif text-2xl text-[var(--color-text)]">{fmtVal(currentVal)}</motion.p>
          <p className="text-[9px] text-[var(--color-text-muted)] mt-1">14% margin · 3.8×</p>
        </div>
        <div className="bg-[var(--color-navy)] border border-[var(--color-gold-cta)] rounded-sm p-5">
          <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold-cta)] mb-3">{t('tools.afterProgramme')}</p>
          <motion.p key={postVal} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="font-serif text-2xl text-[var(--color-text-on-dark)]">{fmtVal(postVal)}</motion.p>
          <p className="text-[9px] text-[var(--color-text-muted-dark)] mt-1">24% margin · 4.55×</p>
        </div>
      </div>
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">{t('tools.uplift')}</span>
        <motion.span key={uplift} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="font-serif text-xl text-[var(--color-gold-cta)]">+{fmtVal(uplift)}</motion.span>
      </div>
    </div>
  )
}

const container = { animate: { transition: { staggerChildren: 0.07 } } }
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

export function ToolsPage() {
  const { t } = useTranslation()

  const aiTools = [
    {
      to: '/diagnostic',
      labelKey: 'tools.diagnostic',
      subKey: 'tools.diagnosticMeta',
      descKey: 'tools.diagnosticDesc',
      ctaKey: 'tools.getFarmScoreBtn',
    },
    {
      to: '/benchmark',
      labelKey: 'tools.benchmark',
      subKey: 'tools.benchmarkMeta',
      descKey: 'tools.benchmarkDesc',
      ctaKey: 'tools.benchmarkBtn',
    },
  ]

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
      <SEO
        title={t('tools.seoTitle')}
        description={t('tools.seoDesc')}
        url="/tools"
      />

      <div className="max-w-5xl mx-auto px-6 mb-16">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">{t('tools.eyebrow')}</p>
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] leading-tight mb-4">
          {t('tools.headline')}
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xl">
          {t('tools.body')}
        </p>
      </div>

      {/* 1. Farm Health Diagnostic */}
      <section className="bg-[var(--color-navy)] border-y border-[rgba(255,255,255,0.08)]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-block text-[9px] tracking-[0.2em] uppercase font-semibold px-2.5 py-1 rounded-sm mb-5 text-[var(--color-navy)] bg-[var(--color-gold-cta)] border border-[var(--color-gold-cta)]">
                {t('tools.badgeStartHere')}
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text-on-dark)] leading-tight mb-3">
                {t('tools.diagnostic')}
              </h2>
              <p className="text-[10px] text-[var(--color-text-muted-dark)] mb-4">{t('tools.diagnosticMeta')}</p>
              <p className="text-sm text-[var(--color-text-muted-dark)] leading-relaxed mb-8">
                {t('tools.diagnosticDesc')}
              </p>
              <Link to="/diagnostic"
                className="inline-block bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-8 py-4 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all">
                {t('tools.getFarmScoreBtn')}
              </Link>
            </div>
            <DiagnosticPreview />
          </div>
        </div>
      </section>

      {/* 2. Benchmark */}
      <section className="border-b border-[var(--color-gold-muted)]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <BenchmarkWidget />
            <div>
              <span className="inline-block text-[9px] tracking-[0.2em] uppercase font-semibold px-2.5 py-1 rounded-sm border text-[var(--color-gold)] border-[var(--color-gold-muted)] mb-5">
                {t('tools.badgeInstant')}
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text)] leading-tight mb-3">
                {t('tools.benchmark')}
              </h2>
              <p className="text-[10px] text-[var(--color-text-muted)] mb-4">{t('tools.benchmarkMeta')}</p>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-8">
                {t('tools.benchmarkDesc')}
              </p>
              <Link to="/benchmark"
                className="inline-block border border-[var(--color-gold-muted)] text-[var(--color-text-muted)] px-8 py-4 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all">
                {t('tools.benchmarkBtn')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Margin Recovery */}
      <section className="bg-[var(--color-navy)] border-b border-[rgba(255,255,255,0.08)]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="mb-10">
            <span className="inline-block text-[9px] tracking-[0.2em] uppercase font-semibold px-2.5 py-1 rounded-sm border text-[var(--color-gold)] border-[var(--color-gold-muted)] mb-5">
              {t('tools.badgeCalculator')}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text-on-dark)] leading-tight mb-3">
              {t('tools.marginRecovery')}
            </h2>
            <p className="text-sm text-[var(--color-text-muted-dark)] leading-relaxed max-w-xl">
              {t('tools.marginRecoveryDesc')}
            </p>
          </div>
          <MarginWidget />
          <div className="mt-10">
            <Link to="/audit"
              className="inline-block bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-8 py-4 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all">
              {t('tools.getFullAuditBtn')}
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Farm Valuation */}
      <section className="border-b border-[var(--color-gold-muted)]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-block text-[9px] tracking-[0.2em] uppercase font-semibold px-2.5 py-1 rounded-sm border text-[var(--color-gold)] border-[var(--color-gold-muted)] mb-5">
                {t('tools.badgeInstant')}
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text)] leading-tight mb-3">
                {t('tools.valuation')}
              </h2>
              <p className="text-[10px] text-[var(--color-text-muted)] mb-4">{t('tools.valuationMeta')}</p>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
                {t('tools.valuationDesc')}
              </p>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-8">
                {t('tools.valuationDesc2')}
              </p>
              <Link to="/valuation"
                className="inline-block border border-[var(--color-gold-muted)] text-[var(--color-text-muted)] px-8 py-4 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all">
                {t('tools.openCalcBtn')}
              </Link>
            </div>
            <ValuationWidget />
          </div>
        </div>
      </section>

      {/* 5+6. AI Tools */}
      <section className="border-b border-[var(--color-gold-muted)]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-8">{t('tools.aiPowered')}</p>
          <motion.div variants={container} initial="initial" animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {aiTools.map(tool => (
              <motion.div key={tool.to} variants={fadeUp}>
                <Link to={tool.to}
                  className="group flex flex-col h-full rounded-sm border bg-[var(--color-surface)] border-[var(--color-gold-muted)] hover:border-[var(--color-gold)] transition-all hover:shadow-lg">
                  <div className="p-6 sm:p-8 flex flex-col h-full">
                    <h2 className="font-serif text-xl mb-1 text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors">
                      {t(tool.labelKey)}
                    </h2>
                    <p className="text-[10px] text-[var(--color-text-muted)] mb-4">{t(tool.subKey)}</p>
                    <p className="text-sm leading-relaxed text-[var(--color-text-muted)] flex-1 mb-6">{t(tool.descKey)}</p>
                    <span className="self-start text-[10px] tracking-widest uppercase font-semibold px-5 py-2.5 rounded-sm transition-all border border-[var(--color-gold-muted)] text-[var(--color-text-muted)] group-hover:border-[var(--color-gold)] group-hover:text-[var(--color-gold)]">
                      {t(tool.ctaKey)}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7. Calculation Tools */}
      <section className="border-b border-[var(--color-gold-muted)]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-8">Free Calculators</p>
          <motion.div variants={container} initial="initial" animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.div variants={fadeUp}>
              <Link to="/tools/feed-calculator"
                className="group flex flex-col h-full rounded-sm border bg-[var(--color-surface)] border-[var(--color-gold-muted)] hover:border-[var(--color-gold)] transition-all hover:shadow-lg">
                <div className="p-6 sm:p-8 flex flex-col h-full">
                  <span className="self-start text-[9px] tracking-[0.2em] uppercase font-semibold px-2 py-1 rounded-sm border text-[var(--color-gold)] border-[var(--color-gold-muted)] mb-4">
                    Aquaculture
                  </span>
                  <h2 className="font-serif text-xl mb-1 text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors">
                    Shrimp Feed Calculator
                  </h2>
                  <p className="text-[10px] text-[var(--color-text-muted)] mb-4">L. Vannamei · P. Monodon · Intensive ponds</p>
                  <p className="text-sm leading-relaxed text-[var(--color-text-muted)] flex-1 mb-6">
                    Enter ABW, pH, temperature, and stocking parameters. Get a daily feed target (kg), per-meal dose, and a full coefficient audit — biomass estimate included.
                  </p>
                  <span className="self-start text-[10px] tracking-widest uppercase font-semibold px-5 py-2.5 rounded-sm transition-all border border-[var(--color-gold-muted)] text-[var(--color-text-muted)] group-hover:border-[var(--color-gold)] group-hover:text-[var(--color-gold)]">
                    Open Calculator
                  </span>
                </div>
              </Link>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Link to="/tools/biofloc-calculator"
                className="group flex flex-col h-full rounded-sm border bg-[var(--color-surface)] border-[var(--color-gold-muted)] hover:border-[var(--color-gold)] transition-all hover:shadow-lg">
                <div className="p-6 sm:p-8 flex flex-col h-full">
                  <span className="self-start text-[9px] tracking-[0.2em] uppercase font-semibold px-2 py-1 rounded-sm border text-[var(--color-gold)] border-[var(--color-gold-muted)] mb-4">
                    Biofloc
                  </span>
                  <h2 className="font-serif text-xl mb-1 text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors">
                    Biofloc C:N Calculator
                  </h2>
                  <p className="text-[10px] text-[var(--color-text-muted)] mb-4">Carbon dose · TAN correction · Application schedule</p>
                  <p className="text-sm leading-relaxed text-[var(--color-text-muted)] flex-1 mb-6">
                    Enter pond volume, daily feed, TAN level, and carbon source. Get precise carbon dose (kg), NH₃ toxicity reading, system risk level, and a timed application schedule.
                  </p>
                  <span className="self-start text-[10px] tracking-widest uppercase font-semibold px-5 py-2.5 rounded-sm transition-all border border-[var(--color-gold-muted)] text-[var(--color-text-muted)] group-hover:border-[var(--color-gold)] group-hover:text-[var(--color-gold)]">
                    Open Calculator
                  </span>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <div className="max-w-5xl mx-auto px-6 mt-12">
        <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm">
          <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-2">{t('tools.needMoreTitle')}</p>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
            {t('tools.needMoreBody')}
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:connect@hazemshannak.cc?subject=Booking%20a%20Call"
              className="text-[10px] tracking-widest uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-5 py-2.5 rounded-sm hover:brightness-110 transition-all">
              {t('tools.bookSessionBtn')}
            </a>
            <Link to="/audit"
              className="text-[10px] tracking-widest uppercase font-semibold text-[var(--color-text-muted)] border border-[var(--color-gold-muted)] px-5 py-2.5 rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all">
              {t('tools.seeAuditBtn')}
            </Link>
          </div>
        </div>

        {/* Email capture */}
        <div className="mt-6 border-t border-[var(--color-gold-muted)] pt-6">
          <p className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-1">Get insights like these to your inbox</p>
          <p className="text-xs text-[var(--color-text-muted)] mb-3 leading-relaxed">Field notes, frameworks, and profit-leak fixes — no fluff.</p>
          <SubscribeForm source="tools-page" placeholder="Your email address" btnLabel="Subscribe →" />
        </div>

      </div>
    </main>
  )
}
