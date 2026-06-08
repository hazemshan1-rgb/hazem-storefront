import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { SEO } from '../components/ui/SEO'

interface Diagnosis {
  rootCause: string
  diagnosticMetric: string
  immediateAction: string
  severity: 'critical' | 'high' | 'moderate' | 'low'
  recommendedResource: {
    type: string
    title: string
    reason: string
    link: string
  }
}

const severityConfig: Record<string, { labelKey: string; colour: string; bg: string }> = {
  critical: { labelKey: 'Critical',  colour: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  high:     { labelKey: 'High',      colour: '#f97316', bg: 'rgba(249,115,22,0.08)' },
  moderate: { labelKey: 'Moderate',  colour: '#CA8A04', bg: 'rgba(202,138,4,0.08)' },
  low:      { labelKey: 'Low',       colour: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
}

const EXAMPLES = [
  'My shrimp survival rate dropped from 82% to 61% between the last two batches with no obvious disease sign',
  'FCR has been climbing for three cycles — now at 2.3 and I can\'t find the cause',
  'Dissolved oxygen is crashing every morning around 5am even though I added two more aerators',
  'Floc volume in my BFT system collapsed after a heavy rainstorm and recovery is slow',
]

export function SymptomCheckerPage() {
  const { t } = useTranslation()
  const [symptom,   setSymptom]   = useState('')
  const [email,     setEmail]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null)
  const [error,     setError]     = useState<string | null>(null)
  const [cooldown,  setCooldown]  = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!symptom.trim() || symptom.length < 15 || cooldown) return
    setLoading(true)
    setError(null)
    setDiagnosis(null)
    try {
      const res = await fetch('/api/symptom-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptom }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error ?? 'Request failed')
      }
      const data: Diagnosis = await res.json()
      setDiagnosis(data)
      setCooldown(true)
      setTimeout(() => setCooldown(false), 30000)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const sc = diagnosis ? severityConfig[diagnosis.severity] ?? severityConfig.moderate : null

  const crossLinks = [
    { to: '/diagnostic', labelKey: 'symptomChecker.crossLink1Label', subKey: 'symptomChecker.crossLink1Sub' },
    { to: '/benchmark',  labelKey: 'symptomChecker.crossLink2Label', subKey: 'symptomChecker.crossLink2Sub' },
    { to: '/valuation',  labelKey: 'symptomChecker.crossLink3Label', subKey: 'symptomChecker.crossLink3Sub' },
  ]

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
      <SEO title="AI Farm Symptom Checker — Instant Aquaculture Diagnosis"
        description="Describe what's going wrong with your operation. Get an instant AI diagnosis powered by 30 years of aquaculture expertise — root cause, diagnostic metric, and immediate action."
        url="/symptom-checker" />

      <div className="max-w-2xl mx-auto px-6">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">{t('symptomChecker.eyebrow')}</p>
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] leading-tight mb-4">
          {t('symptomChecker.headline')}
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-8 max-w-lg">
          {t('symptomChecker.body')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <textarea
            value={symptom}
            onChange={e => setSymptom(e.target.value)}
            placeholder={t('symptomChecker.placeholder')}
            rows={4}
            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] resize-none leading-relaxed"
          />
          <input type="email" placeholder={t('symptomChecker.emailPlaceholder')} value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)]" />
          <button type="submit" disabled={loading || symptom.length < 15 || cooldown}
            className="w-full bg-[var(--color-gold-cta)] text-[var(--color-navy)] py-4 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? t('symptomChecker.btnAnalysing') : cooldown ? t('symptomChecker.btnCooldown') : t('symptomChecker.btnAnalyse')}
          </button>
        </form>

        {/* Examples */}
        {!diagnosis && (
          <div className="mb-10">
            <p className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-3">{t('symptomChecker.exampleSymptomsLabel')}</p>
            <div className="space-y-2">
              {EXAMPLES.map(ex => (
                <button key={ex} onClick={() => setSymptom(ex)}
                  className="w-full text-left text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-gold-muted)] rounded-sm px-4 py-2.5 transition-all leading-relaxed">
                  "{ex}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm">
            <p className="text-sm text-red-700">{error}</p>
            {error.includes('ANTHROPIC_API_KEY') && (
              <p className="text-xs text-red-500 mt-1">{t('symptomChecker.apiKeyError')}</p>
            )}
          </motion.div>
        )}

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-center py-12">
              <div className="w-8 h-8 border-2 border-[var(--color-gold-muted)] border-t-[var(--color-gold)] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-[var(--color-text-muted)]">{t('symptomChecker.analysingMsg')}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {diagnosis && sc && (
          <motion.div ref={resultRef} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} className="space-y-5">

            {/* Severity header */}
            <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-gold-muted)]">
              <span className="text-[10px] tracking-widest uppercase font-semibold px-3 py-1.5 rounded-sm"
                style={{ color: sc.colour, background: sc.bg, border: `1px solid ${sc.colour}30` }}>
                {sc.labelKey} {t('symptomChecker.severityLabel')}
              </span>
              <p className="text-xs text-[var(--color-text-muted)]">{t('symptomChecker.basedOnSymptom')}</p>
            </div>

            {/* Root cause */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6">
              <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-3">{t('symptomChecker.rootCause')}</p>
              <p className="text-sm text-[var(--color-text)] leading-relaxed">{diagnosis.rootCause}</p>
            </div>

            {/* Action grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-5">
                <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-2">{t('symptomChecker.measureFirst')}</p>
                <p className="text-sm text-[var(--color-text)] leading-relaxed">{diagnosis.diagnosticMetric}</p>
              </div>
              <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-5">
                <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-2">{t('symptomChecker.immediateAction')}</p>
                <p className="text-sm text-[var(--color-text)] leading-relaxed">{diagnosis.immediateAction}</p>
              </div>
            </div>

            {/* Resource recommendation */}
            <div className="bg-[var(--color-navy)] border border-[var(--color-gold-muted)] rounded-sm p-6">
              <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold-cta)] mb-2">{t('symptomChecker.recommendedResource')}</p>
              <h3 className="font-serif text-xl text-[var(--color-text-on-dark)] mb-2">{diagnosis.recommendedResource.title}</h3>
              <p className="text-xs text-[var(--color-text-muted-dark)] leading-relaxed mb-5">{diagnosis.recommendedResource.reason}</p>
              <Link to={diagnosis.recommendedResource.link}
                className="inline-block bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-6 py-3 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all">
                {diagnosis.recommendedResource.title} →
              </Link>
            </div>

            {/* Try another */}
            <button onClick={() => { setDiagnosis(null); setSymptom(''); setError(null) }}
              className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors">
              {t('symptomChecker.analyseAnother')}
            </button>
          </motion.div>
        )}

        {/* Cross-links */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-10 border-t border-[var(--color-gold-muted)]">
            {crossLinks.map(l => (
              <Link key={l.to} to={l.to}
                className="block p-5 bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm hover:border-[var(--color-gold)] transition-all group">
                <p className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors mb-1">{t(l.labelKey)}</p>
                <p className="text-xs text-[var(--color-text-muted)] leading-snug">{t(l.subKey)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
