import { useScrollReveal } from '../hooks/useScrollReveal'

interface CaseStudy {
  client: string
  region: string
  species: string
  challenge: string
  intervention: string[]
  outcome: string
  metric: string
  metricLabel: string
}

const caseStudies: CaseStudy[] = [
  {
    client: 'Integrated Shrimp Operation',
    region: 'Southeast Asia',
    species: 'Litopenaeus vannamei',
    challenge: 'A 120-hectare intensive farm running at 60% of theoretical yield with no clear diagnosis. FCR had climbed to 2.1 over 18 months and margins were deteriorating despite stable feed prices. Management believed the problem was disease pressure.',
    intervention: [
      'Full carrying-capacity audit across all 48 ponds',
      'Feed tray and sampling protocol redesign to catch early-cycle lag',
      'Water exchange schedule recalibrated based on tidal data and DO monitoring',
      'Stocking density reduced 15% across the highest-density blocks',
    ],
    outcome: 'The root cause was chronic low-grade hypoxia from over-aeration misalignment — not disease. Within two cycles, FCR had returned to 1.62 and survival rates improved from 68% to 81%. The farm recovered $340,000 in annual margin without a single new capital investment.',
    metric: '+$340K',
    metricLabel: 'Annual margin recovered',
  },
  {
    client: 'Family-Owned Tilapia Producer',
    region: 'Sub-Saharan Africa',
    species: 'Oreochromis niloticus',
    challenge: 'A second-generation farm seeking investment to expand from 8 to 40 hectares. Three investor conversations had stalled at due diligence because the financials were unauditable — production records were inconsistent and there was no standardised cost-per-kg calculation.',
    intervention: [
      'Production data reconstruction and normalisation across 4 years of records',
      'Unit economics model built: cost-per-kg by pond type and season',
      'Investor documentation package: financial model, operational manual, risk register',
      'Pre-close operational review to identify and remediate investor objections',
    ],
    outcome: 'The farm closed a $1.2M growth investment within 6 months of the engagement. The investor cited the quality of financial documentation as a primary confidence factor. The expansion is now in Phase 1 implementation.',
    metric: '$1.2M',
    metricLabel: 'Investment secured',
  },
  {
    client: 'New Venture — Biofloc RAS System',
    region: 'Middle East',
    species: 'Litopenaeus vannamei (RAS)',
    challenge: 'A first-time aquaculture investor had purchased a turnkey RAS system from a European supplier. The system reached commission on paper but failed to maintain stable biofloc parameters. First cycle survival was 34%. The supplier blamed the operators.',
    intervention: [
      'Independent technical audit of system design versus operational requirements',
      'Identified three design gaps: insufficient aeration volume, absent carbon dosing control, and inadequate solids management',
      'Operator training programme — 12 sessions over 6 weeks',
      'Operational SOP set written to the specific system parameters',
    ],
    outcome: 'Second cycle survival improved to 74%. Third cycle reached 82%. The investor was able to renegotiate a partial remediation contribution from the supplier using the technical audit as evidence. The operation is now in commercial production.',
    metric: '82%',
    metricLabel: 'Survival rate by cycle 3',
  },
]

export function CaseStudiesPage() {
  const headerRef = useScrollReveal<HTMLElement>()

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">

      {/* Header */}
      <section ref={headerRef} className="scroll-reveal max-w-6xl mx-auto px-6 pt-12 pb-16 border-b border-[var(--color-gold-muted)]">
        <div className="max-w-2xl">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">Field Results</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] leading-tight mb-6">
            Problems diagnosed. Margins recovered.
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xl">
            These are representative engagements from the past decade. Client names and locations are anonymised at request. The numbers are real.
          </p>
        </div>
      </section>

      {/* Case studies */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col gap-16">
          {caseStudies.map((cs, i) => (
            <article key={cs.client} className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 border-b border-[var(--color-gold-muted)] last:border-0 last:pb-0">

              {/* Sidebar */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-1">Case {i + 1}</p>
                  <p className="font-serif text-lg text-[var(--color-text)] leading-snug">{cs.client}</p>
                </div>
                <div className="flex flex-col gap-3 text-xs text-[var(--color-text-muted)]">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] block mb-0.5">Region</span>
                    {cs.region}
                  </div>
                  <div>
                    <span className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] block mb-0.5">Species</span>
                    {cs.species}
                  </div>
                </div>
                <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-4 text-center">
                  <p className="font-serif text-3xl text-[var(--color-gold)] mb-1">{cs.metric}</p>
                  <p className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)]">{cs.metricLabel}</p>
                </div>
              </div>

              {/* Body */}
              <div className="lg:col-span-9 flex flex-col gap-6">
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-3">The Challenge</p>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{cs.challenge}</p>
                </div>

                <div>
                  <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-3">What We Did</p>
                  <ul className="space-y-2">
                    {cs.intervention.map(item => (
                      <li key={item} className="flex items-start gap-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
                        <span className="mt-2 w-1 h-1 rounded-full bg-[var(--color-gold)] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-5">
                  <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-2">Outcome</p>
                  <p className="text-sm text-[var(--color-text)] leading-relaxed">{cs.outcome}</p>
                </div>
              </div>

            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 mt-4">
        <div className="border border-[var(--color-gold-muted)] rounded-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-serif text-xl text-[var(--color-text)] mb-2">Recognise your operation in one of these?</p>
            <p className="text-xs text-[var(--color-text-muted)]">Book a session and we will work through the diagnosis together.</p>
          </div>
          <a
            href="/consultation"
            className="shrink-0 text-xs tracking-widest uppercase font-semibold text-[var(--color-bg)] bg-[var(--color-gold)] px-6 py-3 rounded-sm hover:opacity-90 transition-opacity"
          >
            Book a consultation →
          </a>
        </div>
      </section>

    </main>
  )
}
