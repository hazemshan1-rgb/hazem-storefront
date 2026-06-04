import { Link } from 'react-router-dom'
import { useLemonSqueezy } from '../hooks/useLemonSqueezy'
import { Hero } from '../components/home/Hero'
import { LibraryFeature } from '../components/home/LibraryFeature'
import { TrustStrip } from '../components/home/TrustStrip'
import { Philosophy } from '../components/home/Philosophy'
import { ProfitabilityCalculator } from '../components/home/ProfitabilityCalculator'
import { DiagnosticTeaser } from '../components/home/DiagnosticTeaser'
import { BenchmarkPreview } from '../components/home/BenchmarkPreview'
import { ValuationTeaser } from '../components/home/ValuationTeaser'
import { InactionClock } from '../components/home/InactionClock'
import { SEO } from '../components/ui/SEO'

function ConsultationBanner() {
  return (
    <section className="bg-[var(--color-navy)] border-y border-[rgba(255,255,255,0.08)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] mb-4">
              1-Hour Diagnostic Session
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-text-on-dark)] leading-tight mb-5">
              If the guides are the map, this is someone who reads it with you.
            </h2>
            <p className="text-sm text-[var(--color-text-muted-dark)] leading-relaxed">
              Bring your most pressing operational or investment question. One focused hour, a specific action
              in writing within 24 hours, and nothing to sign beyond the session.
              Used by farm operators and investors across the Middle East, Southeast Asia, and Africa.
            </p>
          </div>

          <div className="flex flex-col gap-5 md:items-end">
            <div className="text-right hidden md:block">
              <span className="font-serif text-5xl text-[var(--color-gold-cta)]">$500</span>
              <p className="text-xs text-[var(--color-text-muted-dark)] mt-1">per 60-minute session</p>
            </div>
            <ul className="space-y-2 md:text-right">
              {['Focused on your specific operation', 'Written action summary within 24 hrs', 'No retainer. No upsell.'].map(item => (
                <li key={item} className="text-xs text-[var(--color-text-muted-dark)]">{item}</li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-3 md:flex-col md:items-end">
              <div className="md:hidden flex items-baseline gap-2">
                <span className="font-serif text-3xl text-[var(--color-gold-cta)]">$500</span>
                <span className="text-xs text-[var(--color-text-muted-dark)]">/ 60-min session</span>
              </div>
              <Link to="/consultation"
                className="inline-block text-[11px] font-semibold tracking-widest uppercase text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-8 py-4 rounded-sm hover:brightness-110 transition-all text-center">
                Book a Session →
              </Link>
              <Link to="/audit"
                className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted-dark)] hover:text-[var(--color-gold-cta)] transition-colors text-center">
                Want a full transformation? See the 90-Day Farm Programme →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ToolsNav() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)]">Free Diagnostic Tools</p>
        <Link to="/tools" className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors">
          See all tools →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { to: '/diagnostic',      label: 'Farm Score',      sub: '6 questions' },
          { to: '/benchmark',       label: 'Benchmark',       sub: 'FCR · survival · $/kg' },
          { to: '/valuation',       label: 'Valuation',       sub: 'Today vs potential' },
          { to: '/symptom-checker', label: 'AI Symptom',      sub: 'Instant diagnosis' },
          { to: '/ask',             label: 'Ask AI',          sub: 'Library assistant' },
        ].map(t => (
          <Link key={t.to} to={t.to}
            className="block p-4 bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm hover:border-[var(--color-gold)] transition-all group text-center">
            <p className="text-xs font-semibold text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors mb-1">{t.label}</p>
            <p className="text-[10px] text-[var(--color-text-muted)] leading-snug">{t.sub}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function HomePage() {
  useLemonSqueezy()
  return (
    <main>
      <SEO
        title="Hazem Shannak — Aquaculture Systems & Profitability"
        description="Turning aquaculture ventures into high-yield, investment-ready enterprises through field-tested frameworks and 30 years of expertise."
      />
      <Hero />
      <TrustStrip />
      <DiagnosticTeaser />
      <BenchmarkPreview />
      <InactionClock />
      <ProfitabilityCalculator />
      <ToolsNav />
      <LibraryFeature />
      <Philosophy />
      <ValuationTeaser />
      <ConsultationBanner />
    </main>
  )
}
