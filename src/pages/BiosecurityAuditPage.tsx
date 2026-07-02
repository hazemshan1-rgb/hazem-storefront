import { Link } from 'react-router-dom'
import { SEO } from '../components/ui/SEO'
import { EmailGate } from '../components/tools/EmailGate'
import { BiosecurityAudit } from '../components/tools/BiosecurityAudit'

export function BiosecurityAuditPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
      <SEO
        title="Biosecurity Audit — Free Tool"
        description="Self-assess vector exclusion, pathogen control, PCR credentials, sanitation, feed safety, and waste handling across 20 weighted checkpoints. Free tool."
        url="/tools/biosecurity-audit"
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
            Biosecurity Audit
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
            20 weighted checkpoints across vector exclusion, pathogen control, hatchery PCR credentials, sanitation, feed safety, and waste handling. A self-assessment, not a third-party certification.
          </p>
        </div>

        <EmailGate toolName="Biosecurity Audit" source="biosecurity-audit">
          <BiosecurityAudit />
        </EmailGate>

        <div className="mt-16 pt-10 border-t border-[var(--color-gold-muted)]">
          <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-3">Upgrade</p>
          <h2 className="font-serif text-xl text-[var(--color-text)] mb-3">
            Need a fix plan, not just a score?
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-6 max-w-xl">
            The shop has SOPs and toolkits that walk through fixing the most common gaps. For a full site walk-through and a prioritised remediation plan, book a consultation.
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
