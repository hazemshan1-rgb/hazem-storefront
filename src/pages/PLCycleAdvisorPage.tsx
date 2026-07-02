import { Link } from 'react-router-dom'
import { SEO } from '../components/ui/SEO'
import { EmailGate } from '../components/tools/EmailGate'
import { PLCycleAdvisor } from '../components/tools/PLCycleAdvisor'

export function PLCycleAdvisorPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
      <SEO
        title="PL Cycle Advisor — Free Tool"
        description="From pre-stocking PL quality gate through stocking safety, survival tracking, cost/kg, and harvest timing. A full shrimp cycle decision engine — GO / ADJUST / ABORT signals at every stage. Free tool."
        url="/tools/pl-cycle-advisor"
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
            PL Cycle Advisor
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
            Shrimp profitability &amp; survival decision engine. Five checkpoints across the full production cycle — pre-stocking quality gate, stocking safety, survival trajectory, running cost/kg, and harvest window optimisation.
          </p>
        </div>

        <EmailGate toolName="PL Cycle Advisor" source="pl-cycle-advisor">
          <PLCycleAdvisor />
        </EmailGate>

        <div className="mt-16 pt-10 border-t border-[var(--color-gold-muted)]">
          <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-3">Upgrade</p>
          <h2 className="font-serif text-xl text-[var(--color-text)] mb-3">
            Need multi-pond, multi-cycle tracking?
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-6 max-w-xl">
            This free version runs one pond, one visit at a time. The full OptiFeed suite adds persistent cycle history, multi-pond comparison, AI-assisted diagnostics, and automated harvest alerts.
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
