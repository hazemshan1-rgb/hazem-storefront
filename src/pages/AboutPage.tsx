import { Link } from 'react-router-dom'
import { caseStudies } from '../data/caseStudies'
import { useScrollReveal } from '../hooks/useScrollReveal'

export function AboutPage() {
  const bioRef = useScrollReveal<HTMLDivElement>()
  const caseRef = useScrollReveal<HTMLDivElement>()

  return (
    <main className="max-w-5xl mx-auto px-6 pt-28 pb-20">
      <p className="animate-fade-in-up text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">The Person Behind the Products</p>
      <h1 className="animate-fade-in-up animation-delay-100 font-serif text-4xl text-[var(--color-text)] mb-10">About Hazem</h1>

      {/* Primary bio block */}
      <div ref={bioRef} className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <div className="md:col-span-1">
          <img
            src="/images/hero/hazem-studio.jpg"
            alt="Hazem Shannak — Aquaculture Consultant"
            className="w-full aspect-[4/5] object-cover object-top rounded-sm border border-[var(--color-gold-muted)]"
          />
        </div>
        <div className="md:col-span-2 space-y-4 text-sm text-[var(--color-text-muted)] leading-relaxed">
          <p>
            I have spent 30 years making aquaculture ventures work — not on paper, but on the ground. Shrimp ponds in Southeast Asia. Tilapia systems in the Middle East and Africa. Integrated multi-trophic farms that produce more with less. I have walked into operations that were bleeding money and left them profitable.
          </p>
          <p>
            My frameworks — the Blue Living Systems Framework, Integrated Multi-Trophic Aquaculture (IMTA), and Regenerative Seawater Agriculture (RSA) — are not academic constructs. They are working models built from thousands of hours of farm observation, failure analysis, and system redesign.
          </p>
          <p>
            The resources I sell are the distilled version of what I teach my highest-paying consulting clients. The same tools. The same frameworks. At a price that makes them accessible to operators who cannot yet afford to bring me on-site.
          </p>
          <a
            href="https://www.linkedin.com/in/hazemhshannak"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[var(--color-gold)] text-xs tracking-widest uppercase hover:underline mt-4"
          >
            Connect on LinkedIn →
          </a>
        </div>
      </div>

      {/* Case studies */}
      <div ref={caseRef} className="scroll-reveal mb-16">
        <div className="flex items-end justify-between mb-6">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)]">Field Results</p>
          <Link to="/case-studies" className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudies.map(cs => (
            <div key={cs.client} className="card-hover bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-5 flex flex-col gap-4">
              <div className="text-center border-b border-[var(--color-gold-muted)] pb-4">
                <p className="font-serif text-3xl text-[var(--color-gold)]">{cs.metric}</p>
                <p className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mt-1">{cs.metricLabel}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)] mb-1">{cs.client}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{cs.region} · {cs.species}</p>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed flex-1 line-clamp-3">{cs.outcome}</p>
              <Link
                to="/case-studies"
                className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] hover:underline mt-auto"
              >
                Read full case →
              </Link>
            </div>
          ))}
        </div>
      </div>

    </main>
  )
}
