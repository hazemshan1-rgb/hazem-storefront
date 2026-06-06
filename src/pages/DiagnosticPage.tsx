import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SEO } from '../components/ui/SEO'
import {
  QUESTIONS,
  CATEGORIES,
  CONTEXT_QUESTIONS,
  QUESTIONS_BY_CATEGORY,
  calculateScore,
  interpretScore,
  type DiagnosticQuestion,
  type ContextAnswers,
  type DiagnosticAnswers,
  type ScoreResult,
} from '../data/diagnosticData'

// ── Wizard state ──────────────────────────────────────────────────────────────

type Phase = 'intro' | 'context' | 'category-intro' | 'question' | 'results'

interface WizardState {
  phase:                Phase
  direction:            1 | -1
  contextStep:          number
  contextAnswers:       Partial<ContextAnswers>
  currentCategoryIndex: number
  currentQuestionInCat: number
  answers:              DiagnosticAnswers
}

const INIT: WizardState = {
  phase: 'intro', direction: 1, contextStep: 0, contextAnswers: {},
  currentCategoryIndex: 0, currentQuestionInCat: 0, answers: {},
}

// ── Animation ─────────────────────────────────────────────────────────────────

const slide = {
  enter:  (dir: number) => ({ x: dir > 0 ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? -56 : 56, opacity: 0 }),
}
const easing = { duration: 0.26, ease: [0.16, 1, 0.3, 1] as const }

// ── Main page ─────────────────────────────────────────────────────────────────

export function DiagnosticPage() {
  const [state, setState] = useState<WizardState>(INIT)

  const catIdx   = state.currentCategoryIndex
  const category = CATEGORIES[catIdx]
  const catQs    = (QUESTIONS_BY_CATEGORY[catIdx] ?? []) as DiagnosticQuestion[]
  const question = catQs[state.currentQuestionInCat] as DiagnosticQuestion | undefined

  const answered = Object.keys(state.answers).length
  const progress = QUESTIONS.length > 0 ? Math.round((answered / QUESTIONS.length) * 100) : 0

  // ── Navigation ──────────────────────────────────────────────────────────────

  function advance(updates: Partial<WizardState>) {
    setState(s => ({ ...s, direction: 1, ...updates }))
  }

  function goBack() {
    setState(s => {
      const d: -1 = -1
      if (s.phase === 'context' && s.contextStep > 0)
        return { ...s, direction: d, contextStep: s.contextStep - 1 }
      if (s.phase === 'context')
        return { ...s, direction: d, phase: 'intro' }
      if (s.phase === 'category-intro' && s.currentCategoryIndex === 0)
        return { ...s, direction: d, phase: 'context', contextStep: CONTEXT_QUESTIONS.length - 1 }
      if (s.phase === 'category-intro') {
        const prev = s.currentCategoryIndex - 1
        const prevQs = (QUESTIONS_BY_CATEGORY[prev] ?? []) as DiagnosticQuestion[]
        return { ...s, direction: d, currentCategoryIndex: prev, currentQuestionInCat: prevQs.length - 1, phase: 'question' }
      }
      if (s.phase === 'question' && s.currentQuestionInCat > 0)
        return { ...s, direction: d, currentQuestionInCat: s.currentQuestionInCat - 1 }
      if (s.phase === 'question')
        return { ...s, direction: d, phase: 'category-intro' }
      return s
    })
  }

  // ── Context selection ───────────────────────────────────────────────────────

  function handleContext(value: string) {
    const key = CONTEXT_QUESTIONS[state.contextStep].id as keyof ContextAnswers
    const ctx = { ...state.contextAnswers, [key]: value }
    if (state.contextStep < CONTEXT_QUESTIONS.length - 1) {
      advance({ contextAnswers: ctx, contextStep: state.contextStep + 1 })
    } else {
      advance({ contextAnswers: ctx, phase: 'category-intro', currentCategoryIndex: 0 })
    }
  }

  // ── Question selection ──────────────────────────────────────────────────────

  function handleAnswer(value: string) {
    if (!question) return
    const updated = { ...state.answers, [question.id]: value }
    const lastInCat = state.currentQuestionInCat >= catQs.length - 1
    const lastCat   = catIdx >= CATEGORIES.length - 1

    if (!lastInCat) {
      advance({ answers: updated, currentQuestionInCat: state.currentQuestionInCat + 1 })
    } else if (!lastCat) {
      advance({ answers: updated, currentCategoryIndex: catIdx + 1, currentQuestionInCat: 0, phase: 'category-intro' })
    } else {
      advance({ answers: updated, phase: 'results' })
    }
  }

  // ── Score ───────────────────────────────────────────────────────────────────

  const scoreResult = useMemo<ScoreResult | null>(() => {
    if (state.phase !== 'results') return null
    return calculateScore(state.answers, state.contextAnswers as ContextAnswers)
  }, [state.phase, state.answers, state.contextAnswers])

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <SEO
        title="Shrimp Farm Profit Leak Diagnostic — Free Tool"
        description="34-question species-weighted diagnostic across 8 categories. Identify exactly where your shrimp farm is losing money."
        url="/diagnostic"
      />

      <div className="min-h-screen bg-[var(--color-navy)] text-[var(--color-text-on-dark)] flex flex-col">

        {/* Progress stripe */}
        {state.phase !== 'intro' && state.phase !== 'results' && (
          <div className="fixed top-0 left-0 right-0 h-0.5 bg-white/10 z-50">
            <motion.div
              className="h-full bg-[var(--color-gold)]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        )}

        <AnimatePresence mode="wait" custom={state.direction}>

          {state.phase === 'intro' && (
            <Slide key="intro" dir={state.direction}>
              <IntroScreen onStart={() => advance({ phase: 'context' })} />
            </Slide>
          )}

          {state.phase === 'context' && (
            <Slide key={`ctx-${state.contextStep}`} dir={state.direction}>
              <ContextScreen
                q={CONTEXT_QUESTIONS[state.contextStep]}
                step={state.contextStep}
                total={CONTEXT_QUESTIONS.length}
                selected={state.contextAnswers[CONTEXT_QUESTIONS[state.contextStep].id as keyof ContextAnswers]}
                onSelect={handleContext}
                onBack={goBack}
              />
            </Slide>
          )}

          {state.phase === 'category-intro' && category && (
            <Slide key={`cat-${catIdx}`} dir={state.direction}>
              <CategoryIntroScreen
                category={category}
                catIndex={catIdx}
                totalCats={CATEGORIES.length}
                questionCount={catQs.length}
                onStart={() => advance({ phase: 'question' })}
                onBack={goBack}
              />
            </Slide>
          )}

          {state.phase === 'question' && question && (
            <Slide key={question.id} dir={state.direction}>
              <QuestionScreen
                question={question}
                catName={category.name}
                qIndex={state.currentQuestionInCat}
                qTotal={catQs.length}
                selected={state.answers[question.id]}
                onSelect={handleAnswer}
                onBack={goBack}
              />
            </Slide>
          )}

          {state.phase === 'results' && scoreResult && (
            <Slide key="results" dir={state.direction}>
              <ResultsScreen
                result={scoreResult}
                onRestart={() => setState(INIT)}
              />
            </Slide>
          )}

        </AnimatePresence>
      </div>
    </>
  )
}

// ── Slide wrapper ─────────────────────────────────────────────────────────────

function Slide({ children, dir }: { children: React.ReactNode; dir: number }) {
  return (
    <motion.div
      className="flex-1 flex flex-col"
      custom={dir}
      variants={slide}
      initial="enter"
      animate="center"
      exit="exit"
      transition={easing}
    >
      {children}
    </motion.div>
  )
}

// ── Shared option button ──────────────────────────────────────────────────────

function OptionBtn({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.99 }}
      className={`w-full text-left px-5 py-3.5 rounded-sm border text-sm transition-all duration-200 ${
        selected
          ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-text-on-dark)]'
          : 'border-white/10 bg-white/5 text-[var(--color-text-muted-dark)] hover:border-white/30 hover:bg-white/10 hover:text-[var(--color-text-on-dark)]'
      }`}
    >
      {label}
    </motion.button>
  )
}

// ── Back button ───────────────────────────────────────────────────────────────

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-[var(--color-text-muted-dark)] hover:text-white transition-colors text-sm flex items-center gap-1.5"
    >
      <span>←</span> Back
    </button>
  )
}

// ── Shared layout shell ───────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-xl">{children}</div>
    </div>
  )
}

// ── Intro screen ──────────────────────────────────────────────────────────────

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="max-w-2xl w-full text-center">
        <p className="text-[10px] tracking-[0.3em] uppercase font-semibold gold-shimmer mb-6">
          Free Diagnostic Tool
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text-on-dark)] leading-tight mb-6">
          Where is your farm leaking profit?
        </h1>
        <p className="text-[var(--color-text-muted-dark)] leading-relaxed mb-4 max-w-lg mx-auto">
          A 34-question profit leak diagnostic across 8 operational categories — feed efficiency, disease pressure, water quality, infrastructure, financial visibility, and more.
        </p>
        <p className="text-[var(--color-text-muted-dark)] leading-relaxed mb-10 max-w-lg mx-auto text-sm">
          Scoring is weighted by species and production system. A 1.7 FCR on vannamei in a lined pond carries a different weight than the same number on monodon in an earthen pond. This tool knows the difference.
        </p>

        <div className="flex flex-wrap justify-center gap-8 text-sm text-[var(--color-text-muted-dark)] mb-12">
          {[['34', 'Questions'], ['8', 'Categories'], ['~12 min', 'Duration'], ['Free', 'No sign-up']].map(([val, lbl]) => (
            <div key={lbl} className="text-center">
              <div className="text-xl font-semibold text-[var(--color-gold)]">{val}</div>
              <div className="text-xs tracking-widest uppercase mt-0.5">{lbl}</div>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 bg-[var(--color-gold-cta)] hover:bg-[var(--color-gold-cta-hover)] text-[var(--color-navy)] font-semibold px-8 py-4 rounded-sm transition-all duration-300 text-sm tracking-wide"
        >
          Start Diagnostic →
        </button>

        <p className="text-[10px] text-[var(--color-text-muted-dark)] mt-5 tracking-wide">
          Based on 30+ years of field data across 15 countries
        </p>
      </div>
    </div>
  )
}

// ── Context screen ────────────────────────────────────────────────────────────

function ContextScreen({
  q, step, total, selected, onSelect, onBack,
}: {
  q: typeof CONTEXT_QUESTIONS[0]
  step: number
  total: number
  selected?: string
  onSelect: (v: string) => void
  onBack: () => void
}) {
  return (
    <Shell>
      <div className="flex items-center justify-between mb-10">
        <BackBtn onClick={onBack} />
        <span className="text-xs text-[var(--color-text-muted-dark)] tracking-widest uppercase">
          Setup · {step + 1} of {total}
        </span>
      </div>
      <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--color-gold)] mb-3">
        Set your baseline
      </p>
      <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text-on-dark)] mb-8 leading-snug">
        {q.question}
      </h2>
      <div className="flex flex-col gap-3">
        {q.options.map(opt => (
          <OptionBtn
            key={opt.value}
            label={opt.label}
            selected={selected === opt.value}
            onClick={() => onSelect(opt.value)}
          />
        ))}
      </div>
    </Shell>
  )
}

// ── Category intro screen ─────────────────────────────────────────────────────

function CategoryIntroScreen({
  category, catIndex, totalCats, questionCount, onStart, onBack,
}: {
  category: typeof CATEGORIES[0]
  catIndex: number
  totalCats: number
  questionCount: number
  onStart: () => void
  onBack: () => void
}) {
  return (
    <Shell>
      <div className="flex items-center justify-between mb-12">
        <BackBtn onClick={onBack} />
        <span className="text-xs text-[var(--color-text-muted-dark)] tracking-widest uppercase">
          Category {catIndex + 1} of {totalCats}
        </span>
      </div>

      <div className="border border-[var(--color-gold)]/20 rounded-sm p-8 mb-8">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--color-gold)] mb-3">
          Category {catIndex + 1}
        </p>
        <h2 className="font-serif text-3xl text-[var(--color-text-on-dark)] mb-4">
          {category.name}
        </h2>
        <p className="text-[var(--color-text-muted-dark)] text-sm leading-relaxed mb-5">
          {category.description}
        </p>
        <p className="text-xs text-[var(--color-text-muted-dark)]">
          {questionCount} question{questionCount !== 1 ? 's' : ''} in this section
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full bg-[var(--color-gold-cta)] hover:bg-[var(--color-gold-cta-hover)] text-[var(--color-navy)] font-semibold py-3.5 rounded-sm transition-all duration-300 text-sm tracking-wide"
      >
        Begin →
      </button>
    </Shell>
  )
}

// ── Question screen ───────────────────────────────────────────────────────────

function QuestionScreen({
  question, catName, qIndex, qTotal, selected, onSelect, onBack,
}: {
  question: DiagnosticQuestion
  catName: string
  qIndex: number
  qTotal: number
  selected?: string
  onSelect: (v: string) => void
  onBack: () => void
}) {
  return (
    <Shell>
      <div className="flex items-center justify-between mb-8">
        <BackBtn onClick={onBack} />
        <span className="text-xs text-[var(--color-text-muted-dark)] tracking-widest uppercase">
          {catName} · {qIndex + 1} / {qTotal}
        </span>
      </div>

      <h2 className="font-serif text-xl md:text-2xl text-[var(--color-text-on-dark)] mb-2 leading-snug">
        {question.question}
      </h2>
      {question.subtext && (
        <p className="text-xs text-[var(--color-text-muted-dark)] mb-6 leading-relaxed">
          {question.subtext}
        </p>
      )}
      {!question.subtext && <div className="mb-6" />}

      <div className="flex flex-col gap-2.5">
        {question.options.map(opt => (
          <OptionBtn
            key={opt.value}
            label={opt.label}
            selected={selected === opt.value}
            onClick={() => onSelect(opt.value)}
          />
        ))}
      </div>
    </Shell>
  )
}

// ── Results screen ────────────────────────────────────────────────────────────

function ResultsScreen({ result, onRestart }: { result: ScoreResult; onRestart: () => void }) {
  const interp   = interpretScore(result.normalisedPct)
  const leakLow  = Math.round(result.totalLeakUsd * 0.7 / 1000) * 1000
  const leakHigh = Math.round(result.totalLeakUsd * 1.3 / 1000) * 1000

  function fmt(n: number) {
    return n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`
  }

  return (
    <div className="max-w-2xl mx-auto w-full px-6 py-20">

      {/* Score header */}
      <div className="text-center mb-12">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-6">
          Your Diagnostic Result
        </p>
        <div
          className="inline-flex items-center gap-4 border rounded-sm px-8 py-5 mb-6"
          style={{ borderColor: interp.border, background: `${interp.colour}12` }}
        >
          <span className="font-serif text-6xl font-bold" style={{ color: interp.colour }}>
            {result.normalisedPct}
          </span>
          <div className="text-left">
            <div className="text-[10px] text-[var(--color-text-muted-dark)] uppercase tracking-widest mb-1">Leak Index</div>
            <div className="font-semibold text-lg" style={{ color: interp.colour }}>{interp.label}</div>
          </div>
        </div>
        <p className="text-[var(--color-text-muted-dark)] text-sm leading-relaxed max-w-md mx-auto mb-5">
          {interp.description}
        </p>
        {result.totalLeakUsd > 0 && (
          <p className="text-sm">
            <span className="text-[var(--color-text-muted-dark)]">Estimated annual profit leakage: </span>
            <span className="font-semibold" style={{ color: interp.colour }}>
              {fmt(leakLow)} – {fmt(leakHigh)} / year
            </span>
          </p>
        )}
      </div>

      {/* Category breakdown */}
      <div className="mb-10">
        <h3 className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted-dark)] mb-5">
          Score by Category
        </h3>
        <div className="flex flex-col gap-4">
          {CATEGORIES.map(cat => {
            const s   = result.categoryScores[cat.id] ?? 0
            const mx  = result.categoryMaxes[cat.id] ?? 1
            const pct = Math.round((s / mx) * 100)
            const isTop = result.topLeakCategories.includes(cat.id)
            const barColour =
              pct <= 20 ? '#4ade80' : pct <= 40 ? '#fbbf24' : pct <= 65 ? '#f97316' : '#ef4444'

            return (
              <div key={cat.id}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className={`text-xs ${isTop ? 'text-[var(--color-text-on-dark)] font-medium' : 'text-[var(--color-text-muted-dark)]'}`}>
                    {isTop && <span className="text-[var(--color-gold)] mr-1.5">▲</span>}
                    {cat.name}
                  </span>
                  <span className="text-xs font-mono" style={{ color: barColour }}>{pct}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: barColour }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.08 * cat.id, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-[10px] text-[var(--color-text-muted-dark)] mt-4">
          ▲ marks your top 3 leak categories by estimated dollar impact
        </p>
      </div>

      {/* Score legend */}
      <div className="border border-white/10 rounded-sm p-4 mb-10 grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
        {[
          { label: 'Profitable', range: '0–20', colour: '#4ade80' },
          { label: 'Minor Leaks', range: '21–40', colour: '#fbbf24' },
          { label: 'Moderate', range: '41–65', colour: '#f97316' },
          { label: 'Severe', range: '66–100', colour: '#ef4444' },
        ].map(b => (
          <div key={b.label}>
            <div className="font-semibold mb-0.5" style={{ color: b.colour }}>{b.label}</div>
            <div className="text-[var(--color-text-muted-dark)]">{b.range}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mb-10">
        <Link
          to={interp.ctaLink}
          className="inline-flex items-center gap-2 bg-[var(--color-gold-cta)] hover:bg-[var(--color-gold-cta-hover)] text-[var(--color-navy)] font-semibold px-8 py-4 rounded-sm transition-all duration-300 text-sm tracking-wide"
        >
          {interp.ctaLabel} →
        </Link>
      </div>

      {/* Cross-links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { to: '/benchmark',       label: 'Benchmark My Farm',   sub: 'See where you rank against audited farms' },
          { to: '/valuation',       label: 'Farm Valuation',      sub: "What is your farm worth to an investor today?" },
          { to: '/symptom-checker', label: 'AI Symptom Checker',  sub: 'Describe a problem for an instant diagnosis' },
        ].map(l => (
          <Link
            key={l.to}
            to={l.to}
            className="block p-5 border border-white/10 rounded-sm hover:border-white/30 transition-all group"
          >
            <p className="text-sm font-semibold text-[var(--color-text-on-dark)] group-hover:text-[var(--color-gold)] transition-colors mb-1">
              {l.label}
            </p>
            <p className="text-xs text-[var(--color-text-muted-dark)] leading-snug">{l.sub}</p>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onRestart}
          className="text-xs text-[var(--color-text-muted-dark)] hover:text-white transition-colors"
        >
          Restart diagnostic
        </button>
      </div>

      <p className="text-center text-xs text-[var(--color-text-muted-dark)] leading-relaxed mt-8">
        Results are indicative. Farm context, market conditions, and cycle history all affect actual performance. For a full audit with dollar-precise leak identification, book a consultation.
      </p>
    </div>
  )
}
