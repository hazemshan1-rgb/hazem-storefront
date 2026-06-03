import { useState, useEffect } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { SEO } from '../components/ui/SEO'
import { caseStudies } from '../data/caseStudies'

const CHECKOUT_URL = import.meta.env.VITE_CONSULTATION_CHECKOUT_URL ?? ''

const faqs = [
  {
    q: 'How should I prepare for the session?',
    a: 'Come with one or two specific problems — not a general overview of your operation. The more focused your question, the more useful the hour. If you have production data, financial snapshots, or a site layout, bring them. We work best from real numbers.',
  },
  {
    q: 'Do you work with all aquaculture species?',
    a: 'My practice covers five shrimp species: Litopenaeus vannamei (Pacific white shrimp), Penaeus monodon (giant tiger prawn), Fenneropenaeus indicus (Indian white prawn), Penaeus semisulcatus (green tiger prawn), and Macrobrachium rosenbergii (giant freshwater prawn). If your operation involves one of these, we are a direct fit. For other species, I am unlikely to add the value you need.',
  },
  {
    q: 'What time zones do you cover?',
    a: 'I work regularly across the Middle East, Southeast Asia, Sub-Saharan Africa, and Europe. Sessions are scheduled via Calendly so you can find a slot that suits you. If your time zone is not shown, contact me directly.',
  },
  {
    q: 'What is your refund policy?',
    a: 'You can reschedule up to 24 hours before the session with no charge. Cancellations inside 24 hours are non-refundable. If I need to cancel for any reason, you will receive a full refund or a rescheduled slot — your choice.',
  },
  {
    q: 'Is this a one-off session or part of an ongoing engagement?',
    a: 'This is a standalone session. Many clients return for follow-up sessions as their situation develops, but there is no commitment beyond the hour you book. If you want ongoing advisory support, that is a separate conversation.',
  },
]

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
        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed pb-4">
          {a}
        </p>
      )}
    </div>
  )
}

const bullets = [
  'Diagnosing the specific bottleneck holding your operation below its yield potential',
  'Feed conversion ratio — where the leakage is and how to close the gap',
  'Water quality management systems and intervention timing',
  'Production planning, stocking decisions, and harvest scheduling',
  'Investor readiness — financials, documentation, and positioning',
  'Evaluating a new site, species, or system before you commit capital',
]


export function ConsultationPage() {
  const headerRef = useScrollReveal<HTMLElement>()
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
      <SEO
        title="Book a Consultation"
        description="One hour. Your operation. A clear next step. Focused diagnostic session for aquaculture farm owners and investors."
      />

      {/* Sticky CTA */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-3rem)] max-w-lg transition-all duration-500 ${showSticky ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="bg-[var(--color-navy)] border border-[var(--color-gold-cta)] rounded-sm p-4 shadow-2xl flex items-center justify-between gap-4">
          <div>
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold-cta)] font-semibold">1-Hour Consultation</p>
            <p className="text-xs text-white/90">Book your diagnostic session.</p>
          </div>
          <a
            href={CHECKOUT_URL || '#'}
            className="text-[10px] tracking-widest uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-5 py-2.5 rounded-sm hover:brightness-110 transition-all whitespace-nowrap"
          >
            Book Now — $500
          </a>
        </div>
      </div>

      {/* Header */}
      <section ref={headerRef} className="scroll-reveal max-w-6xl mx-auto px-6 pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — context */}
          <div>
            <div className="flex items-center gap-5 mb-8">
              <img
                src="/images/hero/hazem-headshot.jpg"
                alt="Hazem Shannak"
                className="w-20 h-20 rounded-full object-cover object-top border border-[var(--color-gold-muted)] shrink-0"
              />
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">Hazem Shannak</p>
                <p className="text-xs text-[var(--color-text-muted)]">Aquaculture Systems Consultant — 30+ years, 15 countries</p>
              </div>
            </div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">Book a Consultation</p>
            <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] leading-tight mb-6">
              One hour. Your operation. A clear next step.
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-8">
              This is a focused working session — not a sales call. Bring your most pressing operational or investment question and we will work through it with the same diagnostic rigour I apply on-site. You will leave with a specific action, not a vague recommendation.
            </p>

            <div className="mb-8">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">What we can cover</p>
              <ul className="space-y-3">
                {bullets.map(b => (
                  <li key={b} className="flex items-start gap-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--color-gold)] shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6 mb-8">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2">Good to know</p>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Sessions are conducted via video call. I work across time zones — Middle East, Asia, Africa, and Europe are all regularly covered. If you are unsure whether your question fits this format, book anyway. The first 10 minutes are for scoping.
              </p>
            </div>

            {/* Investment */}
            <div className="mb-8">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">Investment</p>
              <div className="flex items-end gap-3 mb-3">
                <span className="font-serif text-4xl text-[var(--color-text)]">$500</span>
                <span className="text-xs text-[var(--color-text-muted)] mb-1.5">per 60-minute session</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Paid at time of booking. Includes a written summary of key actions sent within 24 hours of the session. No retainer. No upsell. Just the work.
              </p>
            </div>

            {/* FAQ */}
            <div className="mb-12">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">Common questions</p>
              <div className="divide-y divide-[var(--color-gold-muted)]">
                {faqs.map(f => (
                  <FaqItem key={f.q} q={f.q} a={f.a} />
                ))}
              </div>
            </div>

            {/* Social Proof */}
            <div className="pt-12 border-t border-[var(--color-gold-muted)]">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-6">Client Results</p>
              <div className="space-y-6">
                {caseStudies.slice(0, 2).map(cs => (
                  <div key={cs.client} className="p-5 bg-[var(--color-surface-2)] border border-[var(--color-gold-muted)] rounded-sm">
                    <p className="text-xs italic text-[var(--color-text-muted)] leading-relaxed mb-3">
                      "{cs.outcome}"
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-semibold text-[var(--color-text)]">{cs.client}</p>
                      <span className="text-[10px] font-serif text-[var(--color-gold)]">{cs.metric}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Payment card */}
          <div className="sticky top-28">
            <div className="bg-[var(--color-navy)] border border-[rgba(255,255,255,0.08)] rounded-sm p-8">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] mb-6">Investment</p>

              <div className="flex items-end gap-3 mb-2">
                <span className="font-serif text-5xl text-[var(--color-text-on-dark)]">$500</span>
                <span className="text-xs text-[var(--color-text-muted-dark)] mb-2">/ 60-minute session</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted-dark)] mb-8 leading-relaxed">
                Paid at time of booking. You'll choose your time slot immediately after payment.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Focused diagnostic on your specific operation',
                  'Written action summary within 24 hours',
                  'Video call — all time zones covered',
                  'No retainer. No upsell. Just the work.',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--color-text-muted-dark)] leading-snug">
                    <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2.5 7l3 3L11.5 4" stroke="var(--color-gold-cta)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              {CHECKOUT_URL ? (
                <a
                  href={CHECKOUT_URL}
                  className="block w-full text-center bg-[var(--color-gold-cta)] text-[var(--color-navy)] text-[11px] font-semibold tracking-widest uppercase px-6 py-4 rounded-sm hover:brightness-110 transition-all"
                >
                  Pay $500 &amp; Choose Your Time
                </a>
              ) : (
                <div className="text-center p-4 border border-[rgba(255,255,255,0.12)] rounded-sm">
                  <p className="text-xs text-[var(--color-text-muted-dark)] leading-relaxed">
                    Set{' '}
                    <code className="text-[var(--color-gold-cta)] text-[10px]">VITE_CONSULTATION_CHECKOUT_URL</code>{' '}
                    in Vercel to activate payment.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 mt-5">
                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                  <rect x="1" y="6" width="10" height="7" rx="1.5" stroke="var(--color-text-muted-dark)" strokeWidth="1.2"/>
                  <path d="M3.5 6V4a2.5 2.5 0 015 0v2" stroke="var(--color-text-muted-dark)" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <p className="text-[10px] text-[var(--color-text-muted-dark)] tracking-wide">
                  Secure payment via Lemon Squeezy
                </p>
              </div>
            </div>

            <div className="mt-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-5">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-gold)] mb-2">Reschedule policy</p>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                You can reschedule up to 24 hours before the session. Cancellations inside 24 hours are non-refundable.
              </p>
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}
