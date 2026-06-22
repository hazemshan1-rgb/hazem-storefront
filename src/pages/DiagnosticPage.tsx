import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SEO } from '../components/ui/SEO'
import { saveDiagnosticResult, updateDiagnosticEmail } from '../lib/diagnosticPersistence'
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
  const { t } = useTranslation()
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
        title={t('diagnostic.seoTitle')}
        description={t('diagnostic.seoDesc')}
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
                contextAnswers={state.contextAnswers as ContextAnswers}
                answers={state.answers}
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
  const { t } = useTranslation()
  return (
    <button
      onClick={onClick}
      className="text-[var(--color-text-muted-dark)] hover:text-white transition-colors text-sm flex items-center gap-1.5"
    >
      {t('diagnostic.backBtn')}
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
  const { t } = useTranslation()
  const stats = [
    { valKey: 'diagnostic.stat1Val', lblKey: 'diagnostic.stat1Label' },
    { valKey: 'diagnostic.stat2Val', lblKey: 'diagnostic.stat2Label' },
    { valKey: 'diagnostic.stat3Val', lblKey: 'diagnostic.stat3Label' },
    { valKey: 'diagnostic.stat4Val', lblKey: 'diagnostic.stat4Label' },
  ]
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="max-w-2xl w-full text-center">
        <p className="text-[10px] tracking-[0.3em] uppercase font-semibold gold-shimmer mb-6">
          {t('diagnostic.introEyebrow')}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text-on-dark)] leading-tight mb-6">
          {t('diagnostic.introHeadline')}
        </h1>
        <p className="text-[var(--color-text-muted-dark)] leading-relaxed mb-4 max-w-lg mx-auto">
          {t('diagnostic.introBody1')}
        </p>
        <p className="text-[var(--color-text-muted-dark)] leading-relaxed mb-10 max-w-lg mx-auto text-sm">
          {t('diagnostic.introBody2')}
        </p>

        <div className="flex flex-wrap justify-center gap-8 text-sm text-[var(--color-text-muted-dark)] mb-12">
          {stats.map(s => (
            <div key={s.valKey} className="text-center">
              <div className="text-xl font-semibold text-[var(--color-gold)]">{t(s.valKey)}</div>
              <div className="text-xs tracking-widest uppercase mt-0.5">{t(s.lblKey)}</div>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 bg-[var(--color-gold-cta)] hover:brightness-110 text-[var(--color-navy)] font-semibold px-8 py-4 rounded-sm transition-all duration-300 text-sm tracking-wide"
        >
          {t('diagnostic.startBtn')}
        </button>

        <p className="text-[10px] text-[var(--color-text-muted-dark)] mt-5 tracking-wide">
          {t('diagnostic.introCredibility')}
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
  const { t } = useTranslation()
  return (
    <Shell>
      <div className="flex items-center justify-between mb-10">
        <BackBtn onClick={onBack} />
        <span className="text-xs text-[var(--color-text-muted-dark)] tracking-widest uppercase">
          {t('diagnostic.setupOf', { step: step + 1, total })}
        </span>
      </div>
      <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--color-gold)] mb-3">
        {t('diagnostic.contextEyebrow')}
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
  const { t } = useTranslation()
  return (
    <Shell>
      <div className="flex items-center justify-between mb-12">
        <BackBtn onClick={onBack} />
        <span className="text-xs text-[var(--color-text-muted-dark)] tracking-widest uppercase">
          {t('diagnostic.categoryOf', { current: catIndex + 1, total: totalCats })}
        </span>
      </div>

      <div className="border border-[var(--color-gold)]/20 rounded-sm p-8 mb-8">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--color-gold)] mb-3">
          {t('diagnostic.categoryLabel', { n: catIndex + 1 })}
        </p>
        <h2 className="font-serif text-3xl text-[var(--color-text-on-dark)] mb-4">
          {category.name}
        </h2>
        <p className="text-[var(--color-text-muted-dark)] text-sm leading-relaxed mb-5">
          {category.description}
        </p>
        <p className="text-xs text-[var(--color-text-muted-dark)]">
          {questionCount === 1
            ? t('diagnostic.oneQuestionInSection')
            : t('diagnostic.questionsInSection', { count: questionCount })}
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full bg-[var(--color-gold-cta)] hover:brightness-110 text-[var(--color-navy)] font-semibold py-3.5 rounded-sm transition-all duration-300 text-sm tracking-wide"
      >
        {t('diagnostic.beginBtn')}
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

function ResultsScreen({
  result,
  onRestart,
  contextAnswers,
  answers,
}: {
  result: ScoreResult
  onRestart: () => void
  contextAnswers: ContextAnswers
  answers: DiagnosticAnswers
}) {
  const [email, setEmail]           = useState('')
  const [emailSaved, setEmailSaved] = useState(false)
  const [savedId, setSavedId]       = useState<string | null>(null)
  const [showPivotModal, setShowPivotModal] = useState(result.normalisedPct > 65)

  useEffect(() => {
    saveDiagnosticResult(answers, contextAnswers, result).then(r => {
      if (r.id) setSavedId(r.id)
    })
  }, [])

  const interp   = interpretScore(result.normalisedPct)
  const leakLow  = Math.round(result.totalLeakUsd * 0.7 / 1000) * 1000
  const leakHigh = Math.round(result.totalLeakUsd * 1.3 / 1000) * 1000

  function fmt(n: number) {
    return n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`
  }

  const { t } = useTranslation()
  const legend = [
    { labelKey: 'diagnostic.legendProfitable', range: '0–20',    colour: '#4ade80' },
    { labelKey: 'diagnostic.legendMinor',      range: '21–40',   colour: '#fbbf24' },
    { labelKey: 'diagnostic.legendModerate',   range: '41–65',   colour: '#f97316' },
    { labelKey: 'diagnostic.legendSevere',     range: '66–100',  colour: '#ef4444' },
  ]
  const crossLinks = [
    { to: '/benchmark',       labelKey: 'diagnostic.crossLink1Label', subKey: 'diagnostic.crossLink1Sub' },
    { to: '/valuation',       labelKey: 'diagnostic.crossLink2Label', subKey: 'diagnostic.crossLink2Sub' },
    { to: '/newsletter',      labelKey: 'diagnostic.crossLink3Label', subKey: 'diagnostic.crossLink3Sub' },
  ]

  return (
    <>
      <PivotModal
        isOpen={showPivotModal}
        onClose={() => setShowPivotModal(false)}
        score={result.normalisedPct}
        leakHigh={leakHigh}
        fmt={fmt}
      />
    <div className="max-w-2xl mx-auto w-full px-6 py-20">

      {/* Score header */}
      <div className="text-center mb-12">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-6">
          {t('diagnostic.resultsEyebrow')}
        </p>
        <div
          className="inline-flex items-center gap-4 border rounded-sm px-8 py-5 mb-6"
          style={{ borderColor: interp.border, background: `${interp.colour}12` }}
        >
          <span className="font-serif text-6xl font-bold" style={{ color: interp.colour }}>
            {result.normalisedPct}
          </span>
          <div className="text-left">
            <div className="text-[10px] text-[var(--color-text-muted-dark)] uppercase tracking-widest mb-1">{t('diagnostic.leakIndex')}</div>
            <div className="font-semibold text-lg" style={{ color: interp.colour }}>{interp.label}</div>
          </div>
        </div>
        <p className="text-[var(--color-text-muted-dark)] text-sm leading-relaxed max-w-md mx-auto mb-5">
          {interp.description}
        </p>
        {result.totalLeakUsd > 0 && (
          <p className="text-sm">
            <span className="text-[var(--color-text-muted-dark)]">{t('diagnostic.estimatedLoss')} </span>
            <span className="font-semibold" style={{ color: interp.colour }}>
              {fmt(leakLow)} – {fmt(leakHigh)} / year
            </span>
          </p>
        )}
      </div>

      {/* Category breakdown */}
      <div className="mb-10">
        <h3 className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted-dark)] mb-5">
          {t('diagnostic.scoreByCategory')}
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
          {t('diagnostic.topCategoriesNote')}
        </p>
      </div>

      {/* Score legend */}
      <div className="border border-white/10 rounded-sm p-4 mb-10 grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
        {legend.map(b => (
          <div key={b.labelKey}>
            <div className="font-semibold mb-0.5" style={{ color: b.colour }}>{t(b.labelKey)}</div>
            <div className="text-[var(--color-text-muted-dark)]">{b.range}</div>
          </div>
        ))}
      </div>

      {/* Score-contextual pathway nudge */}
      {result.normalisedPct > 20 && result.normalisedPct <= 65 && (
        <div className="border border-[var(--color-gold-muted)] rounded-sm p-5 mb-8 bg-[rgba(255,255,255,0.02)]">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-gold)] mb-2">Recommended path</p>
          <p className="text-sm text-[var(--color-text-on-dark)] leading-relaxed mb-4">
            {result.normalisedPct <= 40
              ? 'A focused session will identify your top 2 leaks and build a prioritised fix plan. Most operators recover the session fee within the first adjusted cycle.'
              : 'At this level, a single session finds the 2–3 highest-impact fixes. For dollar-precise leak quantification and a margin guarantee, the Tier 1 Diagnostic Audit starts at $5,000.'}
          </p>
          {result.normalisedPct > 40 && (
            <Link
              to="/audit"
              className="text-xs text-[var(--color-gold)] hover:underline tracking-wide"
            >
              See the full Diagnostic Audit Programme →
            </Link>
          )}
        </div>
      )}
      {result.normalisedPct > 65 && (
        <div className="border border-[#ef4444]/30 rounded-sm p-5 mb-8 bg-[rgba(239,68,68,0.04)]">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#ef4444] mb-2">Severity note</p>
          <p className="text-sm text-[var(--color-text-on-dark)] leading-relaxed">
            A score at this level indicates structural bleeding across multiple systems. A consultation session will surface symptoms — the 90-Day Transformation Programme is built to fix them.
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="text-center mb-10">
        <Link
          to={interp.ctaLink}
          className="inline-flex items-center gap-2 bg-[var(--color-gold-cta)] hover:brightness-110 text-[var(--color-navy)] font-semibold px-8 py-4 rounded-sm transition-all duration-300 text-sm tracking-wide"
        >
          {interp.ctaLabel} →
        </Link>
      </div>

      {/* Email capture */}
      {!emailSaved ? (
        <div className="bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-sm p-6 mb-10">
          <p className="text-sm text-[var(--color-text-on-dark)] mb-2 font-semibold">{t('diagnostic.saveResultsTitle')}</p>
          <p className="text-xs text-[var(--color-text-muted-dark)] mb-4 leading-relaxed">
            {t('diagnostic.saveResultsBody')}
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              if (!email) return
              const { success } = savedId
                ? await updateDiagnosticEmail(savedId, email)
                : await saveDiagnosticResult(answers, contextAnswers, result, email)

              if (success) setEmailSaved(true)
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('diagnostic.emailPlaceholder')}
              required
              className="flex-1 bg-[rgba(255,255,255,0.06)] border border-white/10 rounded-sm px-4 py-3 text-sm text-[var(--color-text-on-dark)] placeholder:text-[var(--color-text-muted-dark)] focus:outline-none focus:border-[var(--color-gold-cta)]"
            />
            <button
              type="submit"
              className="bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-5 py-3 text-[10px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all whitespace-nowrap cursor-pointer"
            >
              {t('diagnostic.saveResultsBtn')}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-[rgba(20,184,166,0.08)] border border-[var(--color-teal-cta)]/30 rounded-sm p-5 mb-10 text-center">
          <p className="text-sm text-[var(--color-teal-cta)]">{t('diagnostic.resultsSaved')}</p>
        </div>
      )}

      {/* Cross-links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {crossLinks.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className="block p-5 border border-white/10 rounded-sm hover:border-white/30 transition-all group"
          >
            <p className="text-sm font-semibold text-[var(--color-text-on-dark)] group-hover:text-[var(--color-gold)] transition-colors mb-1">
              {t(l.labelKey)}
            </p>
            <p className="text-xs text-[var(--color-text-muted-dark)] leading-snug">{t(l.subKey)}</p>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onRestart}
          className="text-xs text-[var(--color-text-muted-dark)] hover:text-white transition-colors"
        >
          {t('diagnostic.restartBtn')}
        </button>
      </div>

      <p className="text-center text-xs text-[var(--color-text-muted-dark)] leading-relaxed mt-8">
        {t('diagnostic.disclaimer')}
      </p>
    </div>
    </>
  )
}

// ── Pivot modal — intercepts >65% Leak Index users ────────────────────────────

function PivotModal({
  isOpen,
  onClose,
  score,
  leakHigh,
  fmt,
}: {
  isOpen: boolean
  onClose: () => void
  score: number
  leakHigh: number
  fmt: (n: number) => string
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[var(--color-navy)]/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Card */}
          <motion.div
            className="relative z-10 w-full max-w-md bg-[var(--color-navy-2)] border border-red-500/40 rounded-sm shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Red severity bar */}
            <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-red-400" />

            <div className="p-8">
              {/* Score badge */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-4xl font-serif font-bold text-red-400">{score}</span>
                <div>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-red-400 font-semibold leading-tight">
                    Leak Index
                  </p>
                  <p className="text-[11px] text-[var(--color-text-muted-dark)] leading-tight mt-0.5">
                    Critical severity
                  </p>
                </div>
              </div>

              <h2 className="font-serif text-xl text-[var(--color-text-on-dark)] leading-snug mb-3">
                This score needs more than a consultation
              </h2>

              <p className="text-sm text-[var(--color-text-muted-dark)] leading-relaxed mb-6">
                At <span className="text-white font-medium">{score}%</span>, your farm is losing an
                estimated{' '}
                <span className="text-[var(--color-gold-cta)] font-medium">{fmt(leakHigh)}</span>{' '}
                or more annually across multiple systems simultaneously. A single session surfaces
                symptoms — the{' '}
                <span className="text-white font-medium">90-Day Transformation Programme</span>{' '}
                fixes the underlying cause with a guaranteed margin outcome.
              </p>

              {/* Primary CTA */}
              <Link
                to="/audit"
                onClick={onClose}
                className="block w-full text-center bg-[var(--color-gold-cta)] hover:bg-amber-500 text-[var(--color-navy)] font-semibold text-sm py-3.5 px-6 rounded-sm transition-colors duration-200 mb-3"
              >
                See the Audit Programme →
              </Link>

              {/* Secondary dismiss */}
              <button
                onClick={onClose}
                className="block w-full text-center text-xs text-[var(--color-text-muted-dark)] hover:text-[var(--color-text-on-dark)] transition-colors duration-200 py-2"
              >
                Continue to my results
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
