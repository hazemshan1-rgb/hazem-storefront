import { Link } from 'react-router-dom'
import { SEO } from '../components/ui/SEO'
import { MarginWidget } from '../components/tools/MarginWidget'
import { WisdomStatement } from '../components/ui/WisdomStatement'

export function MarginRecoveryPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
      <SEO
        title="Margin Recovery Calculator — Free Tool"
        description="A 0.2 improvement in FCR and closing the survival gap to benchmark can recover hundreds of thousands in lost margin. Set your revenue, FCR, and survival rate to see what's on the table. Free tool."
        url="/tools/margin-recovery"
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
            Margin Recovery Calculator
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
            A 0.2 improvement in FCR and closing the gap to benchmark survival can recover hundreds of thousands in lost margin. Set your revenue and current numbers to see what's actually on the table.
          </p>
        </div>
      </div>

      <WisdomStatement text="Margin isn't made at harvest. It's made in the first three weeks of the cycle." variant="light" />

      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-[var(--color-navy)] border border-[var(--color-gold-muted)] rounded-sm p-8 mt-16">
          <MarginWidget showReport />
        </div>

        <div className="mt-16 pt-10 border-t border-[var(--color-gold-muted)]">
          <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-3">Next Step</p>
          <h2 className="font-serif text-xl text-[var(--color-text)] mb-3">
            This shows what's possible. The audit finds exactly how to get there.
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-6 max-w-xl">
            This calculator estimates recoverable margin from two levers. The Diagnostic Audit Programme identifies every leak in your operation and builds the fix plan, with a margin guarantee on Tier 2.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/audit"
              className="text-[10px] tracking-widest uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-5 py-2.5 rounded-sm hover:brightness-110 transition-all"
            >
              Get the Full Audit
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
