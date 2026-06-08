import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { caseStudies } from '../data/caseStudies'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { SEO } from '../components/ui/SEO'

const stats = [
  { value: '30+',   labelKey: 'about.stat1Label' },
  { value: '15+',   labelKey: 'about.stat2Label' },
  { value: '500+',  labelKey: 'about.stat3Label' },
  { value: '1000+', labelKey: 'about.stat4Label' },
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
  const { t } = useTranslation()
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
      <p className="animate-fade-in-up text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">{t('about.eyebrow')}</p>
      <h1 className="animate-fade-in-up animation-delay-100 font-serif text-4xl text-[var(--color-text)] mb-10">{t('about.headline')}</h1>

      {/* Primary bio block */}
      <div ref={bioRef} className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <div className="md:col-span-1">
          <img
            src="/images/hero/hazem-studio.jpg"
            alt={t('about.imgAlt')}
            className="w-full aspect-[4/5] object-cover object-top rounded-sm border border-[var(--color-gold-muted)]"
          />
        </div>
        <div className="md:col-span-2 space-y-4 text-sm text-[var(--color-text-muted)] leading-relaxed">
          <p>{t('about.bio1')}</p>
          <p>{t('about.bio2')}</p>
          <p>{t('about.bio3')}</p>
          <p className="text-xs text-[var(--color-text-muted)]">
            <span className="text-[var(--color-text)]">{t('about.basedLabel')}:</span> {t('about.basedValue')} &nbsp;·&nbsp;
            <span className="text-[var(--color-text)]">{t('about.languagesLabel')}:</span> {t('about.languagesValue')}
          </p>
          <a
            href="https://www.linkedin.com/in/hazemhshannak"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[var(--color-gold)] text-xs tracking-widest uppercase hover:underline mt-2"
          >
            {t('about.linkedinCta')}
          </a>
        </div>
      </div>

      {/* By-the-numbers strip */}
      <div ref={statsRef} className="scroll-reveal grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--color-gold-muted)] border border-[var(--color-gold-muted)] rounded-sm mb-16 overflow-hidden">
        {stats.map(s => (
          <div key={s.labelKey} className="bg-[var(--color-surface)] px-6 py-7 text-center">
            <p className="font-serif text-4xl text-[var(--color-gold)] mb-1">{s.value}</p>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--color-text-muted)]">{t(s.labelKey)}</p>
          </div>
        ))}
      </div>

      {/* Case studies */}
      <div ref={caseRef} className="scroll-reveal mb-16">
        <div className="flex items-end justify-between mb-6">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)]">{t('about.fieldResults')}</p>
          <Link to="/case-studies" className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors">
            {t('about.viewAll')}
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
                {t('about.readFull')}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Expertise areas */}
      <div ref={expertRef} className="scroll-reveal mb-16">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-6">{t('about.expertiseLabel')}</p>
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
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-6">{t('about.certificationsLabel')}</p>
          <ul className="space-y-3">
            {certifications.map(c => (
              <li key={c.title} className="flex items-start justify-between gap-4 border-b border-[var(--color-gold-muted)] pb-3">
                <p className="text-sm text-[var(--color-text-muted)]">{c.title}</p>
                <p className="text-[10px] tracking-widest text-[var(--color-gold)] shrink-0">{c.year}</p>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-[var(--color-text-muted)] mt-4 leading-relaxed">
            {t('about.degree')}<br />
            <span className="text-[var(--color-text)]">{t('about.university')}</span>, {t('about.universityYears')}
          </p>
        </div>

        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-6">{t('about.membershipsLabel')}</p>
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
