import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { SEO } from '../components/ui/SEO'
import { caseStudies } from '../data/caseStudies'

const CHECKOUT_60  = import.meta.env.VITE_CONSULTATION_CHECKOUT_URL ?? ''
const CHECKOUT_30  = import.meta.env.VITE_CONSULTATION_30_CHECKOUT_URL ?? ''
const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL ?? ''

function bookUrl(checkout: string) {
  return checkout || CALENDLY_URL || ''
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[var(--color-gold-muted)] last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 group"
        aria-expanded={open}
      >
        <span className="text-sm text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors leading-snug">
          {q}
        </span>
        <span className={`text-[var(--color-gold)] shrink-0 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </span>
      </button>
      {open && (
        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed pb-4">{a}</p>
      )}
    </div>
  )
}

const checkIcon = (
  <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2.5 7l3 3L11.5 4" stroke="var(--color-gold-cta)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export function ConsultationPage() {
  const { t } = useTranslation()
  const headerRef = useScrollReveal<HTMLElement>()
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 500)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const url60 = bookUrl(CHECKOUT_60)
  const url30 = bookUrl(CHECKOUT_30)

  const bullets = t('consultation.bullets', { returnObjects: true }) as string[]
  const deliverables = t('consultation.deliverables', { returnObjects: true }) as string[]
  const faqs = t('consultation.faqs', { returnObjects: true }) as Array<{ q: string; a: string }>
  const deepDiveBullets = t('consultation.deepDive.bullets', { returnObjects: true }) as string[]
  const focusBullets = t('consultation.focus.bullets', { returnObjects: true }) as string[]

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
      <SEO
        title={t('consultation.seoTitle')}
        description={t('consultation.seoDesc')}
        url="/consultation"
      />

      {/* Sticky CTA */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-3rem)] max-w-lg transition-all duration-500 ${showSticky ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="bg-[var(--color-navy)] border border-[var(--color-gold-cta)] rounded-sm p-4 shadow-2xl flex items-center justify-between gap-4">
          <div>
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold-cta)] font-semibold">{t('consultation.stickyEyebrow')}</p>
            <p className="text-xs text-white/90">{t('consultation.stickyBody')}</p>
          </div>
          <a href="#options"
            className="text-[10px] tracking-widest uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-5 py-2.5 rounded-sm hover:brightness-110 transition-all whitespace-nowrap">
            {t('consultation.stickyBtn')}
          </a>
        </div>
      </div>

      {/* Header */}
      <section ref={headerRef} className="scroll-reveal max-w-6xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — copy */}
          <div>
            <div className="flex items-center gap-5 mb-8">
              <img
                src="/images/hero/hazem-headshot.jpg"
                alt="Hazem Shannak"
                className="w-20 h-20 rounded-full object-cover object-top border border-[var(--color-gold-muted)] shrink-0"
              />
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">Hazem Shannak</p>
                <p className="text-xs text-[var(--color-text-muted)]">{t('consultation.consultantTitle')}</p>
              </div>
            </div>

            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">{t('consultation.eyebrow')}</p>
            <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] leading-tight mb-6">
              {t('consultation.headline')}
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-5">{t('consultation.body1')}</p>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-8">{t('consultation.body2')}</p>

            {/* What's covered */}
            <div className="mb-8">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">{t('consultation.whatWeCoverTitle')}</p>
              <ul className="space-y-3">
                {Array.isArray(bullets) && bullets.map(b => (
                  <li key={b} className="flex items-start gap-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--color-gold)] shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* The guarantee */}
            <div className="bg-[var(--color-navy)] border border-[var(--color-gold-muted)] rounded-sm p-6 mb-8">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] mb-3">{t('consultation.deliverableTitle')}</p>
              <ul className="space-y-3">
                {Array.isArray(deliverables) && deliverables.map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--color-text-muted-dark)] leading-relaxed">
                    {checkIcon}
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6 mb-8">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2">{t('consultation.goodToKnowTitle')}</p>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{t('consultation.goodToKnow')}</p>
            </div>

            {/* FAQ */}
            <div className="mb-12">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">{t('consultation.faqTitle')}</p>
              <div>
                {Array.isArray(faqs) && faqs.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
              </div>
            </div>

            {/* Social proof */}
            <div className="pt-12 border-t border-[var(--color-gold-muted)]">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-6">{t('consultation.socialProofTitle')}</p>
              <div className="space-y-6">
                {caseStudies.slice(0, 2).map(cs => (
                  <div key={cs.client} className="p-5 bg-[var(--color-surface-2)] border border-[var(--color-gold-muted)] rounded-sm">
                    <p className="text-xs italic text-[var(--color-text-muted)] leading-relaxed mb-3">"{cs.outcome}"</p>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-semibold text-[var(--color-text)]">{cs.client}</p>
                      <span className="text-[10px] font-serif text-[var(--color-gold)]">{cs.metric}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — session options */}
          <div id="options" className="space-y-4">

            {/* Social proof — above pricing */}
            <div className="mb-2 flex items-center gap-3 px-1">
              <div className="flex -space-x-2">
                {['/images/hero/hazem-at-ponds.jpg', '/images/hero/hazem-teaching.jpg', '/images/hero/hazem-consulting.jpg'].map((src, i) => (
                  <img key={i} src={src} alt="" className="w-8 h-8 rounded-full border-2 border-[var(--color-surface)] object-cover" />
                ))}
              </div>
              <div>
                <p className="text-xs text-[var(--color-text)] font-medium">{t('bookConsultation.socialProof1')}</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">{t('bookConsultation.socialProof2')}</p>
              </div>
            </div>

            {/* 60-min (featured) */}
            <div className="bg-[var(--color-navy)] border border-[var(--color-gold-cta)] rounded-sm p-7">
              <div className="flex items-start justify-between mb-1">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-gold-cta)] font-semibold">{t('consultation.deepDive.badge')}</p>
                <span className="text-[9px] tracking-widest uppercase text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-2 py-0.5 rounded-sm font-semibold">{t('consultation.deepDive.mostChosen')}</span>
              </div>
              <div className="flex items-end gap-2 mb-1">
                <span className="font-serif text-4xl text-[var(--color-text-on-dark)]">{t('consultation.deepDive.price')}</span>
                <span className="text-xs text-[var(--color-text-muted-dark)] mb-1.5">{t('consultation.deepDive.duration')}</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted-dark)] mb-5 leading-relaxed">{t('consultation.deepDive.desc')}</p>
              <ul className="space-y-2.5 mb-6">
                {Array.isArray(deepDiveBullets) && deepDiveBullets.map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--color-text-muted-dark)] leading-snug">
                    {checkIcon}
                    {item}
                  </li>
                ))}
              </ul>
              {url60 ? (
                <a href={url60}
                  className="block w-full text-center bg-[var(--color-gold-cta)] text-[var(--color-navy)] text-[11px] font-semibold tracking-widest uppercase px-6 py-4 rounded-sm hover:brightness-110 transition-all">
                  {t('consultation.deepDive.bookBtn')}
                </a>
              ) : (
                <a href="mailto:connect@hazemshannak.cc?subject=60-Minute%20Session%20Enquiry"
                  className="block w-full text-center bg-[var(--color-gold-cta)] text-[var(--color-navy)] text-[11px] font-semibold tracking-widest uppercase px-6 py-4 rounded-sm hover:brightness-110 transition-all">
                  {t('consultation.deepDive.enquireBtn')}
                </a>
              )}
              {CHECKOUT_60 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                    <rect x="1" y="6" width="10" height="7" rx="1.5" stroke="var(--color-text-muted-dark)" strokeWidth="1.2"/>
                    <path d="M3.5 6V4a2.5 2.5 0 015 0v2" stroke="var(--color-text-muted-dark)" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <p className="text-[10px] text-[var(--color-text-muted-dark)] tracking-wide">{t('consultation.deepDive.secure')}</p>
                </div>
              )}
            </div>

            {/* 30-min */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-7">
              <div className="flex items-start justify-between mb-1">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-gold)] font-semibold">{t('consultation.focus.badge')}</p>
                <span className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted)] border border-[var(--color-gold-muted)] px-2 py-0.5 rounded-sm">{t('consultation.focus.duration30')}</span>
              </div>
              <div className="flex items-end gap-2 mb-1">
                <span className="font-serif text-4xl text-[var(--color-text)]">{t('consultation.focus.price')}</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mb-5 leading-relaxed">{t('consultation.focus.desc')}</p>
              <ul className="space-y-2.5 mb-6">
                {Array.isArray(focusBullets) && focusBullets.map(item => (
                  <li key={item} className="flex items-start gap-3 text-xs text-[var(--color-text-muted)] leading-snug">
                    {checkIcon}
                    {item}
                  </li>
                ))}
              </ul>
              {url30 ? (
                <a href={url30}
                  className="block w-full text-center border border-[var(--color-gold-muted)] text-[var(--color-text-muted)] text-[10px] font-semibold tracking-widest uppercase px-6 py-3.5 rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all">
                  {t('consultation.focus.bookBtn')}
                </a>
              ) : (
                <a href="mailto:connect@hazemshannak.cc?subject=30-Minute%20Session%20Enquiry"
                  className="block w-full text-center border border-[var(--color-gold-muted)] text-[var(--color-text-muted)] text-[10px] font-semibold tracking-widest uppercase px-6 py-3.5 rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all">
                  {t('consultation.focus.enquireBtn')}
                </a>
              )}
            </div>

            {/* Policy */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-5">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-gold)] mb-2">{t('consultation.rescheduleTitle')}</p>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{t('consultation.rescheduleBody')}</p>
            </div>

            {/* Bridge to audit */}
            <div className="pt-2">
              <p className="text-xs text-[var(--color-text-muted)] text-center mb-3">
                {t('consultation.bridgeText')}
              </p>
              <Link to="/audit"
                className="block w-full text-center text-[10px] tracking-widest uppercase font-semibold text-[var(--color-text-muted)] border border-[var(--color-gold-muted)] px-6 py-3 rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all">
                {t('consultation.bridgeBtn')}
              </Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}
