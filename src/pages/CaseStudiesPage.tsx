import { useScrollReveal } from '../hooks/useScrollReveal'
import { caseStudies } from '../data/caseStudies'
import { SEO } from '../components/ui/SEO'

export function CaseStudiesPage() {
  const headerRef = useScrollReveal<HTMLElement>()

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
      <SEO
        title="Aquaculture Consulting Case Studies — Real Results"
        description="Real aquaculture turnaround engagements — shrimp farm profit recovery, IMTA conversions, FCR improvements, and investor-ready restructuring. Numbers are real; clients are anonymised."
        url="/case-studies"
      />

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
