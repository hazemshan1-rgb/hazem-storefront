import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLemonSqueezy } from '../hooks/useLemonSqueezy'
import { Hero } from '../components/home/Hero'
import { LibraryFeature } from '../components/home/LibraryFeature'
import { TrustStrip } from '../components/home/TrustStrip'
import { TrustLogos } from '../components/home/TrustLogos'
import { DiagnosticTeaser } from '../components/home/DiagnosticTeaser'
import { Philosophy } from '../components/home/Philosophy'
import { InactionClock } from '../components/home/InactionClock'
import { SEO } from '../components/ui/SEO'

function ToolsNav() {
  const { t } = useTranslation()

  const tools = [
    { to: '/diagnostic',      labelKey: 'toolsNav.farmScore',  subKey: 'toolsNav.farmScoreSub'  },
    { to: '/benchmark',       labelKey: 'toolsNav.benchmark',  subKey: 'toolsNav.benchmarkSub'  },
    { to: '/valuation',       labelKey: 'toolsNav.valuation',  subKey: 'toolsNav.valuationSub'  },
    { to: '/newsletter',      labelKey: 'toolsNav.newsletter', subKey: 'toolsNav.newsletterSub' },
    { to: '/library',         labelKey: 'toolsNav.library',    subKey: 'toolsNav.librarySub'    },
  ]

  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)]">
          {t('toolsNav.eyebrow')}
        </p>
        <Link to="/tools" className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors">
          {t('toolsNav.seeAll')}
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {tools.map((tool) => (
          <Link key={tool.to} to={tool.to}
            className="block p-4 bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm hover:border-[var(--color-gold)] transition-all group text-center">
            <p className="text-xs font-semibold text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors mb-1">
              {t(tool.labelKey)}
            </p>
            <p className="text-[10px] text-[var(--color-text-muted)] leading-snug">
              {t(tool.subKey)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

function ConsultationBanner() {
  const { t } = useTranslation()

  return (
    <section className="bg-[var(--color-navy)] border-y border-[rgba(255,255,255,0.08)]">
      <div className="max-w-6xl mx-auto px-6 py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] mb-4">
              {t('consultationBanner.eyebrow')}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-text-on-dark)] leading-tight mb-5">
              {t('consultationBanner.headline')}
            </h2>
            <p className="text-sm text-[var(--color-text-muted-dark)] leading-relaxed">
              {t('consultationBanner.body')}
            </p>
          </div>

          {/* Elevated dark card — sits above the navy base */}
          <div className="bg-[#141516] border border-[rgba(255,255,255,0.1)] rounded-sm p-8 flex flex-col gap-6 md:items-end">
            <ul className="space-y-3 md:text-right">
              {(['bullet1', 'bullet2', 'bullet3'] as const).map(key => (
                <li key={key} className="text-xs text-[var(--color-text-muted-dark)] leading-relaxed">
                  {t(`consultationBanner.${key}`)}
                </li>
              ))}
            </ul>
            <div className="w-full border-t border-[rgba(255,255,255,0.06)]" />
            <div className="flex flex-col sm:flex-row gap-3 md:flex-col md:items-end">
              <Link to="/consultation"
                className="inline-block text-[11px] font-semibold tracking-widest uppercase text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-8 py-4 rounded-sm hover:brightness-110 transition-all text-center">
                {t('consultationBanner.ctaSee')}
              </Link>
              <Link to="/audit"
                className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted-dark)] hover:text-[var(--color-gold-cta)] transition-colors text-center">
                {t('consultationBanner.ctaProgram')}
              </Link>
            </div>
          </div>
        </div>
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
        url="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Hazem Shannak',
          url: 'https://hazemshannak.com',
          description: 'Aquaculture consulting, diagnostic tools, and knowledge products from 30 years of hands-on expertise.',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://hazemshannak.com/library?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <Hero />
      <TrustStrip />
      <TrustLogos />
      <DiagnosticTeaser />
      <InactionClock />
      <ToolsNav />
      <LibraryFeature />
      <Philosophy />
      <ConsultationBanner />
    </main>
  )
}
