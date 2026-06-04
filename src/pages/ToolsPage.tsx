import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SEO } from '../components/ui/SEO'

const tools = [
  {
    to:       '/diagnostic',
    badge:    'Start Here',
    label:    'Farm Health Diagnostic',
    sub:      '6 questions · 2 minutes',
    desc:     'Score your operation across Feed Efficiency, Survival, Operations, Financial Readiness, and Infrastructure. Get an estimated monthly revenue leak and a specific action plan.',
    cta:      'Get My Farm Score →',
    featured: true,
  },
  {
    to:       '/benchmark',
    badge:    'Instant',
    label:    'Benchmark My Farm',
    sub:      'FCR · survival · cost/kg',
    desc:     'Enter three metrics and see in real time where your operation ranks against 50+ audited farms — with a percentile position and colour-coded status for each.',
    cta:      'Benchmark Now →',
    featured: false,
  },
  {
    to:       '/valuation',
    badge:    'Instant',
    label:    'Farm Valuation Calculator',
    sub:      'EBITDA multiple methodology',
    desc:     "Enter revenue, margin, and documentation status. See your farm's current investor valuation and the value the 90-Day Transformation Programme would unlock.",
    cta:      'Calculate Valuation →',
    featured: false,
  },
  {
    to:       '/symptom-checker',
    badge:    'AI-Powered',
    label:    'AI Symptom Checker',
    sub:      'Instant diagnosis',
    desc:     "Describe what's going wrong in one sentence. The AI — trained on 30 years of field experience — returns the likely root cause, the one metric to measure, and a 48-hour action.",
    cta:      'Diagnose a Symptom →',
    featured: false,
  },
  {
    to:       '/ask',
    badge:    'AI-Powered',
    label:    'Library AI Assistant',
    sub:      'Ask anything about aquaculture',
    desc:     "Ask any question about shrimp production, water quality, feed management, biofloc systems, disease, or farm economics. The AI draws on Hazem's curated library of 35+ technical resources.",
    cta:      'Ask a Question →',
    featured: false,
  },
]

const container = {
  animate: { transition: { staggerChildren: 0.07 } },
}
const item = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

export function ToolsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
      <SEO
        title="Free Diagnostic Tools — Farm Score, Benchmark, Valuation & AI"
        description="Five free tools for aquaculture farm operators: Farm Health Diagnostic, Benchmark, Valuation Calculator, AI Symptom Checker, and Library AI Assistant."
      />
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">Free Diagnostic Tools</p>
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] leading-tight mb-4">
          Five tools. Free. No sign-up required.
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-12 max-w-xl">
          Built from 30 years of field work across 15 countries. Each tool gives you a specific output, not a vague overview.
          Start with the Farm Diagnostic if you're not sure where to begin.
        </p>

        <motion.div
          variants={container}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 gap-5"
        >
          {tools.map(t => (
            <motion.div key={t.to} variants={item}>
              <Link
                to={t.to}
                className={`group block rounded-sm border transition-all hover:shadow-lg ${
                  t.featured
                    ? 'bg-[var(--color-navy)] border-[var(--color-gold-cta)] hover:border-[var(--color-gold-cta)] hover:brightness-105'
                    : 'bg-[var(--color-surface)] border-[var(--color-gold-muted)] hover:border-[var(--color-gold)]'
                }`}
              >
                <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`text-[9px] tracking-[0.2em] uppercase font-semibold px-2.5 py-1 rounded-sm border ${
                        t.featured
                          ? 'text-[var(--color-navy)] bg-[var(--color-gold-cta)] border-[var(--color-gold-cta)]'
                          : t.badge === 'AI-Powered'
                            ? 'text-[var(--color-gold)] border-[var(--color-gold-muted)] bg-transparent'
                            : 'text-[var(--color-gold)] border-[var(--color-gold-muted)] bg-transparent'
                      }`}>
                        {t.badge}
                      </span>
                      <span className={`text-[10px] ${t.featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>{t.sub}</span>
                    </div>
                    <h2 className={`font-serif text-xl mb-2 ${t.featured ? 'text-[var(--color-text-on-dark)]' : 'text-[var(--color-text)]'} group-hover:text-[var(--color-gold)] transition-colors`}>
                      {t.label}
                    </h2>
                    <p className={`text-sm leading-relaxed ${t.featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
                      {t.desc}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className={`inline-block text-[10px] tracking-widest uppercase font-semibold px-5 py-2.5 rounded-sm transition-all ${
                      t.featured
                        ? 'bg-[var(--color-gold-cta)] text-[var(--color-navy)] group-hover:brightness-110'
                        : 'border border-[var(--color-gold-muted)] text-[var(--color-text-muted)] group-hover:border-[var(--color-gold)] group-hover:text-[var(--color-gold)]'
                    }`}>
                      {t.cta}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 p-6 bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm">
          <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-2">Need more than a tool?</p>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
            These tools surface what the problems are. The audit and consultation engagements fix them — with a guaranteed outcome on Tier 2.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/consultation" className="text-[10px] tracking-widest uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-5 py-2.5 rounded-sm hover:brightness-110 transition-all">
              Book a $500 Session →
            </Link>
            <Link to="/audit" className="text-[10px] tracking-widest uppercase font-semibold text-[var(--color-text-muted)] border border-[var(--color-gold-muted)] px-5 py-2.5 rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all">
              See Audit Tiers →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
