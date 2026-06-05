import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SEO } from '../components/ui/SEO'

// ─── Scoring types ────────────────────────────────────────────────────────────

interface Dimensions {
  feedEfficiency: number
  survival:       number
  operations:     number
  financial:      number
  infrastructure: number
}

interface AnswerMap {
  species?: string
  system?:  string
  fcr?:     string
  survivalRate?: string
  sops?:    string
  records?: string
}

// ─── Question data ────────────────────────────────────────────────────────────

const questions = [
  {
    id: 'species',
    step: 1,
    question: 'Which species do you primarily produce?',
    options: [
      { value: 'vannamei',      label: 'Litopenaeus vannamei — Pacific white shrimp' },
      { value: 'monodon',       label: 'Penaeus monodon — Giant tiger prawn' },
      { value: 'indicus',       label: 'Penaeus indicus — Indian white prawn' },
      { value: 'macrobrachium', label: 'Macrobrachium rosenbergii — Freshwater prawn' },
      { value: 'other',         label: 'Other or multiple species' },
    ],
  },
  {
    id: 'system',
    step: 2,
    question: 'What production system are you running?',
    options: [
      { value: 'ras_bft',           label: 'RAS or Biofloc — indoor or lined' },
      { value: 'lined_intensive',   label: 'Lined pond — intensive' },
      { value: 'earthen_intensive', label: 'Earthen pond — intensive' },
      { value: 'semi',              label: 'Semi-intensive' },
      { value: 'extensive',         label: 'Extensive or traditional' },
    ],
  },
  {
    id: 'fcr',
    step: 3,
    question: 'What is your current feed conversion ratio (FCR)?',
    options: [
      { value: 'under_14', label: 'Below 1.4' },
      { value: '14_16',    label: '1.4 – 1.6' },
      { value: '16_18',    label: '1.6 – 1.8' },
      { value: '18_21',    label: '1.8 – 2.1' },
      { value: 'over_21',  label: 'Above 2.1' },
      { value: 'unknown',  label: "I don't track FCR" },
    ],
  },
  {
    id: 'survivalRate',
    step: 4,
    question: 'What is your average survival rate at harvest?',
    options: [
      { value: 'over_85',  label: 'Above 85%' },
      { value: '75_85',    label: '75% – 85%' },
      { value: '65_75',    label: '65% – 75%' },
      { value: '55_65',    label: '55% – 65%' },
      { value: 'under_55', label: 'Below 55%' },
      { value: 'unknown',  label: "I don't track survival rate" },
    ],
  },
  {
    id: 'sops',
    step: 5,
    question: 'Do you have written standard operating procedures?',
    options: [
      { value: 'full',     label: 'Yes — full set, staff trained and following them' },
      { value: 'some',     label: 'Some — for key tasks only' },
      { value: 'informal', label: 'Informal — mostly verbal instructions' },
      { value: 'none',     label: 'None' },
    ],
  },
  {
    id: 'records',
    step: 6,
    question: 'How would you describe your financial and production records?',
    options: [
      { value: 'full',    label: 'Full P&L with cost-per-kg tracked every batch' },
      { value: 'partial', label: 'Basic revenue and cost records' },
      { value: 'minimal', label: 'Bank statements only' },
      { value: 'none',    label: 'Not formally documented' },
    ],
  },
]

// ─── Scoring engine ────────────────────────────────────────────────────────────

function score(answers: AnswerMap): { dims: Dimensions; overall: number; annualLeak: number } {
  const speciesScore: Record<string, number> = {
    vannamei: 10, monodon: 9, indicus: 8, macrobrachium: 7, other: 5,
  }
  const systemScore: Record<string, number> = {
    ras_bft: 9, lined_intensive: 8, earthen_intensive: 7, semi: 5, extensive: 3,
  }
  const fcrScore: Record<string, number> = {
    under_14: 10, '14_16': 8, '16_18': 6, '18_21': 4, over_21: 2, unknown: 1,
  }
  const survivalScore: Record<string, number> = {
    over_85: 10, '75_85': 8, '65_75': 6, '55_65': 4, under_55: 2, unknown: 1,
  }
  const sopsScore: Record<string, number> = {
    full: 10, some: 6, informal: 3, none: 1,
  }
  const recordsScore: Record<string, number> = {
    full: 10, partial: 6, minimal: 3, none: 1,
  }

  const infra = Math.round(
    0.4 * (speciesScore[answers.species ?? 'other'] ?? 5) +
    0.6 * (systemScore[answers.system ?? 'semi'] ?? 5)
  )
  const fe   = fcrScore[answers.fcr ?? 'unknown'] ?? 1
  const sv   = survivalScore[answers.survivalRate ?? 'unknown'] ?? 1
  const ops  = sopsScore[answers.sops ?? 'none'] ?? 1
  const fin  = recordsScore[answers.records ?? 'none'] ?? 1

  const dims: Dimensions = {
    feedEfficiency: fe, survival: sv, operations: ops, financial: fin, infrastructure: infra,
  }
  const overall = Math.round((fe + sv + ops + fin + infra) / 5 * 10)

  const fcrLeak:      Record<string, number> = { under_14: 0, '14_16': 8000, '16_18': 24000, '18_21': 48000, over_21: 80000, unknown: 60000 }
  const survivalLeak: Record<string, number> = { over_85: 0, '75_85': 12000, '65_75': 36000, '55_65': 65000, under_55: 100000, unknown: 50000 }
  const sopsLeak:     Record<string, number> = { full: 0, some: 10000, informal: 25000, none: 40000 }
  const recordsLeak:  Record<string, number> = { full: 0, partial: 8000, minimal: 20000, none: 35000 }

  const annualLeak =
    (fcrLeak[answers.fcr ?? 'unknown'] ?? 60000) +
    (survivalLeak[answers.survivalRate ?? 'unknown'] ?? 50000) +
    (sopsLeak[answers.sops ?? 'none'] ?? 40000) +
    (recordsLeak[answers.records ?? 'none'] ?? 35000)

  return { dims, overall, annualLeak }
}

function getRecommendation(overall: number, dims: Dimensions) {
  if (overall >= 85) return {
    tier: 'Tier 3',
    label: 'Investor-Ready Enterprise Programme',
    link: '/audit',
    note: "Your operations are strong. The next step is packaging them for investment or exit.",
  }
  if (overall >= 75) {
    const weakest = Object.entries(dims).sort(([, a], [, b]) => a - b)[0][0]
    const productMap: Record<string, { link: string; label: string }> = {
      feedEfficiency: { link: '/shop/fcr-optimisation-toolkit', label: 'FCR Optimisation Toolkit' },
      survival:       { link: '/shop/water-quality-aeration-sop', label: 'Water Quality SOP' },
      operations:     { link: '/shop/feed-management-sop', label: 'Feed Management SOP' },
      financial:      { link: '/shop/aquaculture-farm-financial-model', label: 'Farm Financial Model' },
      infrastructure: { link: '/consultation', label: '1-Hour Consultation' },
    }
    const product = productMap[weakest] ?? { link: '/shop', label: 'Targeted Resource' }
    return { tier: 'Targeted Fix', label: product.label, link: product.link, note: `One gap is holding you back. Close it with a targeted resource.` }
  }
  if (overall >= 60) return {
    tier: '1-Hour Session',
    label: 'Book a Consultation — $500',
    link: '/consultation',
    note: "A single focused session will map your highest-priority fix and get you moving.",
  }
  if (overall >= 40) return {
    tier: 'Tier 1',
    label: 'Diagnostic Audit — from $4,500',
    link: '/audit',
    note: "Your farm has identifiable leaks. A structured audit will name them, value them, and give you a ranked action plan.",
  }
  return {
    tier: 'Tier 2',
    label: '90-Day Farm Profitability Transformation',
    link: '/audit',
    note: "This farm needs hands-on restructuring. The 90-Day Programme guarantees a 10-point margin improvement.",
  }
}

// ─── Radar chart ──────────────────────────────────────────────────────────────

function RadarChart({ dims }: { dims: Dimensions }) {
  const labels = ['Feed\nEfficiency', 'Survival\n& Health', 'Operational\nSystems', 'Financial\nReadiness', 'Infrastructure']
  const values = [dims.feedEfficiency, dims.survival, dims.operations, dims.financial, dims.infrastructure]
  const cx = 160; const cy = 160; const r = 110; const n = 5

  function pts(level: number, scores?: number[]) {
    return Array.from({ length: n }, (_, i) => {
      const ang = (i * 2 * Math.PI / n) - Math.PI / 2
      const d = (scores ? (scores[i] / 10) : level) * r
      return `${cx + d * Math.cos(ang)},${cy + d * Math.sin(ang)}`
    }).join(' ')
  }

  const labelR = r * 1.35
  return (
    <svg viewBox="0 0 320 320" className="w-full max-w-xs mx-auto">
      {[0.2, 0.4, 0.6, 0.8, 1].map(l => (
        <polygon key={l} points={pts(l)} fill="none" stroke="rgba(139,105,20,0.18)" strokeWidth={l === 1 ? 0.8 : 0.5} />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const ang = (i * 2 * Math.PI / n) - Math.PI / 2
        return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(ang)} y2={cy + r * Math.sin(ang)} stroke="rgba(139,105,20,0.2)" strokeWidth={0.6} />
      })}
      <motion.polygon
        points={pts(0, values)}
        fill="rgba(202,138,4,0.15)"
        stroke="#CA8A04"
        strokeWidth={1.8}
        strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      {values.map((v, i) => {
        const ang = (i * 2 * Math.PI / n) - Math.PI / 2
        const d = (v / 10) * r
        return (
          <motion.circle key={i} cx={cx + d * Math.cos(ang)} cy={cy + d * Math.sin(ang)} r={4}
            fill="#CA8A04" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.08, duration: 0.25 }}
            style={{ transformOrigin: `${cx + d * Math.cos(ang)}px ${cy + d * Math.sin(ang)}px` }}
          />
        )
      })}
      {labels.map((label, i) => {
        const ang = (i * 2 * Math.PI / n) - Math.PI / 2
        const lx = cx + labelR * Math.cos(ang)
        const ly = cy + labelR * Math.sin(ang)
        const anchor = lx < cx - 8 ? 'end' : lx > cx + 8 ? 'start' : 'middle'
        return label.split('\n').map((line, li) => (
          <text key={`${i}-${li}`} x={lx} y={ly + li * 13 - (label.includes('\n') ? 6 : 0)}
            textAnchor={anchor} dominantBaseline="middle" fontSize={10} fill="#94A3B8" fontFamily="Arial, sans-serif">
            {line}
          </text>
        ))
      })}
    </svg>
  )
}

// ─── Score ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score: s }: { score: number }) {
  const r = 56; const circ = 2 * Math.PI * r
  const label = s >= 75 ? 'Strong' : s >= 55 ? 'Moderate' : s >= 35 ? 'Needs Work' : 'Critical'
  const colour = s >= 75 ? '#22c55e' : s >= 55 ? '#CA8A04' : s >= 35 ? '#f97316' : '#ef4444'
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(139,105,20,0.12)" strokeWidth="8"/>
        <motion.circle cx="70" cy="70" r={r} fill="none" stroke={colour} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={`${circ} ${circ}`}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - s / 100) }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          style={{ transformOrigin: '70px 70px', transform: 'rotate(-90deg)' }}
        />
        <motion.text x="70" y="66" textAnchor="middle" dominantBaseline="middle"
          fontSize="26" fontWeight="700" fill={colour} fontFamily="Georgia, serif"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          {s}
        </motion.text>
        <text x="70" y="84" textAnchor="middle" fontSize="10" fill="#64748B" fontFamily="Arial, sans-serif">/ 100</text>
      </svg>
      <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: colour }}>{label}</span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Stage = 'intro' | 'questions' | 'calculating' | 'gate' | 'results'

export function DiagnosticPage() {
  const [stage, setStage]       = useState<Stage>('intro')
  const [step, setStep]         = useState(0)
  const [answers, setAnswers]   = useState<AnswerMap>({})
  const [email, setEmail]       = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const current = questions[step]
  const result  = stage === 'results' || stage === 'gate' ? score(answers) : null
  const rec     = result ? getRecommendation(result.overall, result.dims) : null

  function selectOption(qId: string, value: string) {
    const next = { ...answers, [qId]: value }
    setAnswers(next)
    if (step < questions.length - 1) {
      setTimeout(() => setStep(s => s + 1), 220)
    } else {
      setStage('calculating')
      setTimeout(() => setStage('gate'), 2000)
    }
  }

  function submitGate(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setEmailSent(true)
    setTimeout(() => {
      setStage('results')
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    }, 400)
  }

  const calcMessages = [
    'Analysing FCR profile…',
    'Comparing against 50+ audited farms…',
    'Scoring operational systems…',
    'Calculating margin leak…',
    'Preparing your Farm Health Report…',
  ]

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
      <SEO title="Farm Diagnostic Score — Get Your Farm Health Report"
        description="Answer 6 questions and get a personalised Farm Health Score, estimated revenue leak, and specific action plan for your aquaculture operation."
        url="/diagnostic" />

      <div className="max-w-3xl mx-auto px-6">

        {/* Intro */}
        {stage === 'intro' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">Free Diagnostic Tool</p>
            <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] leading-tight mb-6">
              What score would your farm get?
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4 max-w-xl">
              Six questions. Two minutes. A personalised Farm Health Score across five operational dimensions — plus an estimated monthly revenue leak and a specific action plan.
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mb-10">Based on benchmarks from 50+ farms audited across 15 countries.</p>
            <div className="flex flex-wrap gap-6 mb-12">
              {['Feed Efficiency', 'Survival & Health', 'Operational Systems', 'Financial Readiness', 'Infrastructure'].map(d => (
                <span key={d} className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] border border-[var(--color-gold-muted)] px-3 py-1.5 rounded-sm">{d}</span>
              ))}
            </div>
            <button
              onClick={() => setStage('questions')}
              className="inline-block bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-10 py-4 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all"
            >
              Start the Diagnostic →
            </button>
          </motion.div>
        )}

        {/* Questions */}
        {stage === 'questions' && (
          <div>
            {/* Progress */}
            <div className="flex items-center gap-3 mb-10">
              <div className="h-1 flex-1 bg-[var(--color-gold-muted)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[var(--color-gold-cta)] rounded-full"
                  initial={{ width: `${(step / questions.length) * 100}%` }}
                  animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <span className="text-[10px] text-[var(--color-text-muted)] shrink-0">{step + 1} / {questions.length}</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={step}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}>
                <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-3">Question {current.step}</p>
                <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text)] mb-8 leading-snug">{current.question}</h2>
                <div className="space-y-3">
                  {current.options.map(opt => (
                    <button key={opt.value} onClick={() => selectOption(current.id, opt.value)}
                      className={`w-full text-left px-6 py-4 border rounded-sm text-sm transition-all ${
                        answers[current.id as keyof AnswerMap] === opt.value
                          ? 'border-[var(--color-gold-cta)] bg-[var(--color-gold-cta)]/8 text-[var(--color-text)]'
                          : 'border-[var(--color-border)] hover:border-[var(--color-gold)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)}
                    className="mt-6 text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors">
                    ← Back
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Calculating */}
        {stage === 'calculating' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-10 h-10 border-2 border-[var(--color-gold-muted)] border-t-[var(--color-gold)] rounded-full animate-spin mx-auto mb-8" />
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              {calcMessages[Math.floor(Date.now() / 400) % calcMessages.length]}
            </p>
          </motion.div>
        )}

        {/* Email gate */}
        {stage === 'gate' && result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 rounded-sm border border-[var(--color-gold-muted)] flex items-center justify-center mx-auto mb-6">
              <span className="font-serif text-2xl text-[var(--color-gold)]">{result.overall}</span>
            </div>
            <h2 className="font-serif text-3xl text-[var(--color-text)] mb-4">Your Farm Health Score is ready.</h2>
            <p className="text-sm text-[var(--color-text-muted)] mb-8 leading-relaxed">
              Enter your email to unlock the full report — score breakdown, estimated revenue leak, radar chart, and specific action plan.
            </p>
            {!emailSent ? (
              <form onSubmit={submitGate} className="flex flex-col sm:flex-row gap-3">
                <input type="email" required placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
                  className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)]" />
                <button type="submit"
                  className="bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-6 py-3 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all whitespace-nowrap">
                  Show My Report
                </button>
              </form>
            ) : (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[var(--color-text-muted)]">
                Loading your report…
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Results */}
        {stage === 'results' && result && rec && (
          <motion.div ref={resultsRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2">Your Farm Health Report</p>
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-text)] mb-10">Here's the full picture.</h2>

            {/* Score + radar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 items-center bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-8">
              <div className="flex flex-col items-center gap-6">
                <ScoreRing score={result.overall} />
                <div className="text-center">
                  <p className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-1">Estimated Annual Leak</p>
                  <p className="font-serif text-3xl text-[#ef4444]">${result.annualLeak.toLocaleString()}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Based on a typical $500K/yr operation</p>
                </div>
              </div>
              <RadarChart dims={result.dims} />
            </div>

            {/* Dimension breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-12">
              {(Object.entries(result.dims) as [keyof Dimensions, number][]).map(([key, val]) => {
                const labels: Record<keyof Dimensions, string> = {
                  feedEfficiency: 'Feed', survival: 'Survival', operations: 'Operations',
                  financial: 'Financial', infrastructure: 'Infrastructure',
                }
                const colour = val >= 8 ? '#22c55e' : val >= 5 ? '#CA8A04' : '#ef4444'
                return (
                  <div key={key} className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-4 text-center">
                    <p className="font-serif text-2xl mb-1" style={{ color: colour }}>{val}/10</p>
                    <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted)]">{labels[key]}</p>
                  </div>
                )
              })}
            </div>

            {/* Recommendation */}
            <div className="bg-[var(--color-navy)] border border-[var(--color-gold-muted)] rounded-sm p-8 mb-10">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] mb-2">Recommended Next Step</p>
              <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-4">{rec.tier}</p>
              <h3 className="font-serif text-2xl text-[var(--color-text-on-dark)] mb-4">{rec.label}</h3>
              <p className="text-sm text-[var(--color-text-muted-dark)] leading-relaxed mb-6">{rec.note}</p>
              <Link to={rec.link}
                className="inline-block bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-8 py-3.5 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all">
                {rec.label} →
              </Link>
            </div>

            {/* Cross-links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { to: '/benchmark', label: 'Benchmark My Farm', sub: 'See where you rank against 50+ audited farms' },
                { to: '/valuation', label: 'Farm Valuation', sub: "What is your farm worth to an investor today?" },
                { to: '/symptom-checker', label: 'AI Symptom Checker', sub: 'Describe a specific problem for an instant diagnosis' },
              ].map(l => (
                <Link key={l.to} to={l.to}
                  className="block p-5 bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm hover:border-[var(--color-gold)] transition-all group">
                  <p className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors mb-1">{l.label}</p>
                  <p className="text-xs text-[var(--color-text-muted)] leading-snug">{l.sub}</p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
