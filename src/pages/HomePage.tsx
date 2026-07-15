import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Hero } from '../components/home/Hero'
import { TrustStrip } from '../components/home/TrustStrip'
import { DiagnosticTeaser } from '../components/home/DiagnosticTeaser'
import { Philosophy } from '../components/home/Philosophy'
import { WisdomStatement } from '../components/ui/WisdomStatement'
import { InactionClock } from '../components/home/InactionClock'
import { SEO } from '../components/ui/SEO'

// Soft colour blend at the two genuine light/dark seams on this page, so a full-bleed
// background swap reads as a deliberate transition rather than a hard cut.
function GradientBridge({ direction }: { direction: 'toDark' | 'toLight' }) {
  const background = direction === 'toDark'
    ? 'linear-gradient(to bottom, var(--color-bg), var(--color-navy))'
    : 'linear-gradient(to bottom, var(--color-navy), var(--color-bg))'

  return <div aria-hidden="true" className="h-16 md:h-24" style={{ background }} />
}

// Quiet secondary link — the diagnostic above is the primary path here, this just
// points researchers at the other 4 tools. Sits on the same navy as its neighbours
// (part of one continuous dark zone), styled as a real bordered pill so it reads
// as clickable rather than an inert label.
function ToolsLink() {
  const { t } = useTranslation()

  return (
    <div className="bg-[var(--color-navy)] pb-20">
      <div className="max-w-6xl mx-auto px-6 flex justify-center">
        <Link to="/tools"
          className="inline-block rounded-full border border-[rgba(255,255,255,0.18)] px-6 py-3 text-[11px] font-semibold tracking-widest uppercase text-[var(--color-text-muted-dark)] transition-all hover:border-[var(--color-gold-cta)] hover:text-[var(--color-gold-cta)] hover:bg-[rgba(255,255,255,0.04)]">
          {t('toolsNav.seeAll')}
        </Link>
      </div>
    </div>
  )
}

// Quiet closing link for visitors not ready for the consultation above — the free
// library, styled as a bordered pill (not a competing full-width offer section).
function LibraryLink() {
  const { t } = useTranslation()

  return (
    <div className="max-w-6xl mx-auto px-6 py-14 flex justify-center">
      <Link to="/library"
        className="inline-block rounded-full border border-[var(--color-gold-muted)] px-6 py-3 text-[11px] font-semibold tracking-widest uppercase text-[var(--color-text-muted)] transition-all hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] hover:bg-[var(--color-gold-muted)]">
        {t('libraryFeature.cta')} →
      </Link>
    </div>
  )
}

function ConsultationBanner() {
  const { t } = useTranslation()

  return (
    <section className="bg-[var(--color-navy)]">
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
              <p className="text-[9px] text-[var(--color-text-muted-dark)] md:text-right leading-relaxed">
                2–3 operators per month · Spots typically filled by week 2
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function HomePage() {
  const { t } = useTranslation()
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
      <GradientBridge direction="toDark" />
      <WisdomStatement text={t('wisdom.home')} variant="dark" />
      <GradientBridge direction="toLight" />
      <Philosophy />
      <GradientBridge direction="toDark" />
      <InactionClock />
      <DiagnosticTeaser />
      <ToolsLink />
      <ConsultationBanner />
      <GradientBridge direction="toLight" />
      <LibraryLink />
    </main>
  )
}
