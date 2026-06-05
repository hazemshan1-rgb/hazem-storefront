import { Link } from 'react-router-dom'
import { caseStudies } from '../data/caseStudies'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { SEO } from '../components/ui/SEO'

const stats = [
  { value: '30+',   label: 'Years on the ground' },
  { value: '15+',   label: 'Countries deployed' },
  { value: '500+',  label: 'Acres under advisory' },
  { value: '1000+', label: 'Professionals trained' },
]

const expertise = [
  'Shrimp & Fish Aquaculture',
  'Integrated Multi-Trophic Aquaculture (IMTA)',
  'Regenerative Seawater Agriculture (RSA)',
  'Feasibility Studies & Farm Design',
  'Business Development & Strategy',
  'Operations Management (Lean Six Sigma)',
  'Project Management (PMP)',
  'Supply Chain & Bio-Security',
  'Sustainability & Circular Systems',
  'Aquaponics & Hydroponics Design',
]

const certifications = [
  { title: 'PMP — Project Management Professional', year: '2007' },
  { title: 'Lean Six Sigma', year: '2008' },
  { title: 'Permaculture Design', year: '2015' },
  { title: 'Aquaponics & Hydroponics Design and Implementation', year: '2016' },
  { title: 'Vermicomposting and Worm Culture', year: '2018' },
  { title: 'Career Essentials in Generative AI (Microsoft)', year: '2024' },
]

const memberships = [
  { abbr: 'AISP', full: 'Association of International Seafood Professionals' },
  { abbr: 'IUCN', full: 'International Union for Conservation of Nature' },
  { abbr: 'JSOF', full: 'Jordanian Society for Organic Farming (IFOAM member)' },
  { abbr: 'RAED', full: 'Arab Network for Environment & Development' },
  { abbr: 'JAEA', full: 'Jordan Agricultural Engineers Association' },
]

export function AboutPage() {
  const bioRef     = useScrollReveal<HTMLDivElement>()
  const statsRef   = useScrollReveal<HTMLDivElement>()
  const caseRef    = useScrollReveal<HTMLDivElement>()
  const expertRef  = useScrollReveal<HTMLDivElement>()
  const credRef    = useScrollReveal<HTMLDivElement>()

  return (
    <main className="max-w-5xl mx-auto px-6 pt-28 pb-20">
      <SEO
        title="About Hazem Shannak — Aquaculture Director & Business Growth Architect"
        description="30 years of hands-on aquaculture expertise across 15 countries. Hazem Shannak turns underperforming farms into high-yield, investment-ready enterprises using IMTA, biofloc, and regenerative systems."
        url="/about"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Hazem Shannak',
          url: 'https://hazemshannak.com',
          sameAs: ['https://www.linkedin.com/in/hazemhshannak'],
          jobTitle: 'Director & Business Growth Architect',
          description: '30+ years of hands-on aquaculture expertise across 15 countries — shrimp, IMTA, biofloc, regenerative systems, and aquaculture business transformation.',
          knowsAbout: [
            'Shrimp Aquaculture',
            'Integrated Multi-Trophic Aquaculture',
            'Biofloc Technology',
            'Regenerative Seawater Agriculture',
            'Aquaculture Business Development',
            'Farm Operations Management',
          ],
        }}
      />
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
          <p className="text-xs text-[var(--color-text-muted)]">
            <span className="text-[var(--color-text)]">Based:</span> Kafr ElSheikh, Egypt &amp; Kuala Lumpur, Malaysia &nbsp;·&nbsp;
            <span className="text-[var(--color-text)]">Languages:</span> Arabic (native) · English (fluent) · Thai (working)
          </p>
          <a
            href="https://www.linkedin.com/in/hazemhshannak"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[var(--color-gold)] text-xs tracking-widest uppercase hover:underline mt-2"
          >
            Connect on LinkedIn →
          </a>
        </div>
      </div>

      {/* By-the-numbers strip */}
      <div ref={statsRef} className="scroll-reveal grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--color-gold-muted)] border border-[var(--color-gold-muted)] rounded-sm mb-16 overflow-hidden">
        {stats.map(s => (
          <div key={s.label} className="bg-[var(--color-surface)] px-6 py-7 text-center">
            <p className="font-serif text-4xl text-[var(--color-gold)] mb-1">{s.value}</p>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--color-text-muted)]">{s.label}</p>
          </div>
        ))}
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

      {/* Expertise areas */}
      <div ref={expertRef} className="scroll-reveal mb-16">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-6">Areas of Expertise</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {expertise.map(area => (
            <div key={area} className="flex items-start gap-3 py-3 border-b border-[var(--color-gold-muted)]">
              <span className="mt-[3px] w-1 h-1 rounded-full bg-[var(--color-gold)] shrink-0" />
              <p className="text-sm text-[var(--color-text-muted)]">{area}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Credentials & Memberships */}
      <div ref={credRef} className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Certifications */}
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-6">Certifications</p>
          <ul className="space-y-3">
            {certifications.map(c => (
              <li key={c.title} className="flex items-start justify-between gap-4 border-b border-[var(--color-gold-muted)] pb-3">
                <p className="text-sm text-[var(--color-text-muted)]">{c.title}</p>
                <p className="text-[10px] tracking-widest text-[var(--color-gold)] shrink-0">{c.year}</p>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-[var(--color-text-muted)] mt-4 leading-relaxed">
            B.Sc. Agricultural Engineering — Animal Production &amp; Husbandry<br />
            <span className="text-[var(--color-text)]">University of Jordan</span>, 1989–1993
          </p>
        </div>

        {/* Memberships */}
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-6">Professional Memberships</p>
          <ul className="space-y-3">
            {memberships.map(m => (
              <li key={m.abbr} className="flex items-start gap-4 border-b border-[var(--color-gold-muted)] pb-3">
                <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] w-12 shrink-0 pt-[2px]">{m.abbr}</p>
                <p className="text-sm text-[var(--color-text-muted)]">{m.full}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </main>
  )
}
