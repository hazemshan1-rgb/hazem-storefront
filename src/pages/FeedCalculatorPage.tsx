import { Link } from 'react-router-dom'
import { SEO } from '../components/ui/SEO'
import { EmailGate } from '../components/tools/EmailGate'
import { FeedCalculator } from '../components/tools/FeedCalculator'

export function FeedCalculatorPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
      <SEO
        title="Shrimp Feed Calculator — Free Tool"
        description="Calculate your daily feed target for L. Vannamei or P. Monodon based on ABW, temperature, pH, and stocking parameters. Free tool."
        url="/tools/feed-calculator"
      />

      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-10">
          <Link
            to="/tools"
            className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors mb-6 inline-block"
          >
            ← Back to Tools
          </Link>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-3">Free Tool</p>
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-text)] leading-tight mb-3">
            Shrimp Feed Calculator
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
            Dynamic feeding targets based on species-specific FCR curves, water temperature, pH stress coefficients, and standing biomass. Calibrated for intensive pond culture.
          </p>
        </div>

        <EmailGate toolName="Shrimp Feed Calculator">
          <FeedCalculator />
        </EmailGate>

        <div className="mt-16 pt-10 border-t border-[var(--color-gold-muted)]">
          <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-3">Upgrade</p>
          <h2 className="font-serif text-xl text-[var(--color-text)] mb-3">
            Need full pond management?
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-6 max-w-xl">
            The full OptiFeed suite includes multi-pond tracking, feeding log history, FCR trend analysis, biosecurity audit, coop cluster management, and AI-assisted voice logging.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="text-[10px] tracking-widest uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-5 py-2.5 rounded-sm hover:brightness-110 transition-all"
            >
              View Shop
            </Link>
            <Link
              to="/consultation"
              className="text-[10px] tracking-widest uppercase font-semibold text-[var(--color-text-muted)] border border-[var(--color-gold-muted)] px-5 py-2.5 rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all"
            >
              Book a Session
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
