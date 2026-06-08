import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { SEO } from '../components/ui/SEO'
import { captureEmail } from '../lib/diagnosticPersistence'
import { WaitlistForm } from '../components/ui/WaitlistForm'

const courses = [
  {
    slug: 'shrimp-farm-operations-masterclass',
    titleKey: 'shop.course1Title',
    descKey: 'shop.course1Desc',
    levelKey: 'shop.course1Level',
    modules: ['Carrying capacity and stocking density', 'FCR optimisation and feed strategy', 'Water quality systems and intervention timing', 'Disease risk management', 'Harvest planning and post-harvest handling'],
    format: 'Video + field reference materials',
  },
  {
    slug: 'aquaculture-business-fundamentals',
    titleKey: 'shop.course2Title',
    descKey: 'shop.course2Desc',
    levelKey: 'shop.course2Level',
    modules: ['Financial modelling for aquaculture', 'Cost drivers and margin leakage', 'Investor documentation and pitch preparation', 'Scaling decisions and capital allocation', 'Exit strategy and asset valuation'],
    format: 'Video + templates + case studies',
  },
  {
    slug: 'sustainable-systems-design',
    titleKey: 'shop.course3Title',
    descKey: 'shop.course3Desc',
    levelKey: 'shop.course3Level',
    modules: ['Biofloc management systems', 'RAS design and operational economics', 'IMTA species selection and stocking ratios', 'Waste-to-value conversion', 'Certification pathways and market positioning'],
    format: 'Video + design templates',
  },
]

export function CoursesPage() {
  const { t } = useTranslation()
  const headerRef = useScrollReveal<HTMLElement>()
  const gridRef = useScrollReveal<HTMLDivElement>()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    captureEmail(email.trim(), 'courses-header-waitlist')
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
      <SEO
        title="Aquaculture Training Programmes — Shrimp, IMTA & Business"
        description="Structured training programmes for aquaculture operators and investors — shrimp farm operations, aquaculture business fundamentals, and sustainable systems design. Joining the waitlist now."
        url="/courses"
      />

      {/* Header */}
      <section ref={headerRef} className="scroll-reveal max-w-6xl mx-auto px-6 pt-12 pb-16 border-b border-[var(--color-gold-muted)]">
        <div className="max-w-2xl">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">{t('courses.eyebrow')}</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] leading-tight mb-6">
            {t('courses.headline')}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-8 max-w-xl">
            {t('courses.body')}
          </p>

          {submitted ? (
            <div className="inline-flex items-center gap-3 border border-[var(--color-gold-muted)] rounded-sm px-6 py-4">
              <span className="w-2 h-2 rounded-full bg-[var(--color-gold)]" />
              <p className="text-sm text-[var(--color-text)]">{t('courses.onList')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)]"
              />
              <button
                type="submit"
                className="shrink-0 text-xs tracking-widest uppercase font-semibold text-[var(--color-bg)] bg-[var(--color-gold)] px-6 py-2.5 rounded-sm hover:opacity-90 transition-opacity"
              >
                {t('courses.joinWaitlistBtn')}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Course previews */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div ref={gridRef} className="stagger-children grid grid-cols-1 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <div
              key={course.slug}
              className="card-hover flex flex-col bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6 gap-5"
            >
              <div>
                <span className="text-[9px] tracking-widest uppercase text-[var(--color-gold)] bg-[var(--color-bg)] border border-[var(--color-gold-muted)] px-2 py-1 rounded-sm">
                  {t('shop.comingSoon')}
                </span>
              </div>

              <div>
                <h2 className="font-serif text-lg text-[var(--color-text)] leading-snug mb-3">
                  {t(course.titleKey)}
                </h2>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  {t(course.descKey)}
                </p>
              </div>

              <div>
                <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-2">{t('courses.modulesInclude')}</p>
                <ul className="space-y-1.5">
                  {course.modules.map(m => (
                    <li key={m} className="flex items-start gap-2 text-xs text-[var(--color-text-muted)]">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--color-gold-muted)] shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-4 border-t border-[var(--color-gold-muted)] flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)]">{t('courses.levelLabel')}</span>
                  <span className="text-xs text-[var(--color-text)]">{t(course.levelKey)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)]">{t('courses.formatLabel')}</span>
                  <span className="text-xs text-[var(--color-text)]">{course.format}</span>
                </div>
                <div className="pt-3">
                  <WaitlistForm courseSlug={course.slug} courseTitle={t(course.titleKey)} compact />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-6xl mx-auto px-6 mt-4">
        <div className="border border-[var(--color-gold-muted)] rounded-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-serif text-xl text-[var(--color-text)] mb-2">{t('courses.ctaTitle')}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{t('courses.ctaBody')}</p>
          </div>
          <a
            href="/consultation"
            className="shrink-0 text-xs tracking-widest uppercase font-semibold text-[var(--color-bg)] bg-[var(--color-gold)] px-6 py-3 rounded-sm hover:opacity-90 transition-opacity"
          >
            {t('courses.ctaBtn')}
          </a>
        </div>
      </section>

    </main>
  )
}
