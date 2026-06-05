import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { SEO } from '../components/ui/SEO'
import { caseStudies } from '../data/caseStudies'

const CHECKOUT_60  = import.meta.env.VITE_CONSULTATION_CHECKOUT_URL ?? ''
const CHECKOUT_30  = import.meta.env.VITE_CONSULTATION_30_CHECKOUT_URL ?? ''
const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL ?? ''

function bookUrl(checkout: string) {
  return checkout || CALENDLY_URL || ''
}

const faqs = [
  {
    q: 'How should I prepare?',
    a: 'Come with one or two specific problems — not a general overview of your operation. The more focused your question, the more useful the session. If you have production data, financial snapshots, or a site layout, bring them. We work best from real numbers.',
  },
  {
    q: 'Which session is right for me?',
    a: 'Choose the 30-minute session if you have one clear, specific question and already understand your situation reasonably well. Choose the 60-minute session if you are dealing with a complex problem, making a significant investment decision, or want to work through multiple dimensions of your operation.',
  },
  {
    q: 'Do you work with all aquaculture species?',
    a: 'My practice covers five shrimp species: Litopenaeus vannamei (Pacific white shrimp), Penaeus monodon (giant tiger prawn), Fenneropenaeus indicus (Indian white prawn), Penaeus semisulcatus (green tiger prawn), and Macrobrachium rosenbergii (giant freshwater prawn). If your operation involves one of these, we are a direct fit.',
  },
  {
    q: 'What time zones do you cover?',
    a: 'I work regularly across the Middle East, Southeast Asia, Sub-Saharan Africa, and Europe. Sessions are scheduled via Calendly so you can find a slot that suits you.',
  },
  {
    q: 'What is your refund policy?',
    a: 'You can reschedule up to 24 hours before the session with no charge. Cancellations inside 24 hours are non-refundable. If I need to cancel for any reason, you receive a full refund or a rescheduled slot — your choice.',
  },
  {
    q: 'Is this a one-off or part of an ongoing engagement?',
    a: 'This is a standalone session. Many clients return for follow-up sessions as their situation develops, but there is no commitment beyond the session you book.',
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

const bullets = [
  'Diagnosing the specific bottleneck holding your operation below its yield potential',
  'Feed conversion ratio — where the leakage is and how to close the gap',
  'Water quality management and intervention timing',
  'Production planning, stocking decisions, and harvest scheduling',
  'Investor readiness — financials, documentation, and positioning',
  'Evaluating a new site, species, or system before you commit capital',
]

export function ConsultationPage() {
  const headerRef = useScrollReveal<HTMLElement>()
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 500)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const url60 = bookUrl(CHECKOUT_60)
  const url30 = bookUrl(CHECKOUT_30)

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
      <SEO
        title="Book an Advisory Session — Hazem Shannak"
        description="A focused working session on your aquaculture operation. 30 or 60 minutes. Written action plan within 24 hours. No retainer."
      />

      {/* Sticky CTA */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-3rem)] max-w-lg transition-all duration-500 ${showSticky ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="bg-[var(--color-navy)] border border-[var(--color-gold-cta)] rounded-sm p-4 shadow-2xl flex items-center justify-between gap-4">
          <div>
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold-cta)] font-semibold">Advisory Session</p>
            <p className="text-xs text-white/90">From $250 · Written action within 24 hrs</p>
          </div>
          <a href="#options"
            className="text-[10px] tracking-widest uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-5 py-2.5 rounded-sm hover:brightness-110 transition-all whitespace-nowrap">
            See Options →
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
                <p className="text-xs text-[var(--color-text-muted)]">Aquaculture Systems Consultant — 30+ years, 15 countries</p>
              </div>
            </div>

            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">Advisory Session</p>
            <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] leading-tight mb-6">
              The right decision, made at the right time, is worth far more than its price.
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-5">
              Most farm decisions that go wrong aren't made by bad operators — they're made by good operators without the right reference point at the moment it mattered. A bad stocking call, a missed intervention window, a miscalculated investment — each of those costs more than this session many times over.
            </p>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-8">
              This is a focused working session — not a sales call, not a taster. You bring the problem. We work through it with the same diagnostic rigour I apply on-site. You leave with a specific written action, not a general recommendation.
            </p>

            {/* What's covered */}
            <div className="mb-8">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">What we can work through</p>
              <ul className="space-y-3">
                {bullets.map(b => (
                  <li key={b} className="flex items-start gap-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--color-gold)] shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* The guarantee */}
            <div className="bg-[var(--color-navy)] border border-[var(--color-gold-muted)] rounded-sm p-6 mb-8">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] mb-3">What you walk away with</p>
              <ul className="space-y-3">
                {[
                  'A written summary of the key issues and decisions discussed',
                  'One clear action to implement in the next seven days',
                  'Delivered within 24 hours of the session',
                  'No retainer required. No upsell. Just the work.',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--color-text-muted-dark)] leading-relaxed">
                    {checkIcon}
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6 mb-8">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2">Good to know</p>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Sessions run via video call. I cover the Middle East, Southeast Asia, Africa, and Europe regularly. If you're unsure whether your question fits, book and we'll figure it out together. The first few minutes are for scoping.
              </p>
            </div>

            {/* FAQ */}
            <div className="mb-12">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">Common questions</p>
              <div>
                {faqs.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
              </div>
            </div>

            {/* Social proof */}
            <div className="pt-12 border-t border-[var(--color-gold-muted)]">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-6">Client Results</p>
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

          {/* Right — session options (not sticky: both cards must be visible on load) */}
          <div id="options" className="space-y-4">

            {/* 60-min (featured) — first so it's above the fold */}
            <div className="bg-[var(--color-navy)] border border-[var(--color-gold-cta)] rounded-sm p-7">
              <div className="flex items-start justify-between mb-1">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-gold-cta)] font-semibold">Deep Dive</p>
                <span className="text-[9px] tracking-widest uppercase text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-2 py-0.5 rounded-sm font-semibold">Most chosen</span>
              </div>
              <div className="flex items-end gap-2 mb-1">
                <span className="font-serif text-4xl text-[var(--color-text-on-dark)]">$500</span>
                <span className="text-xs text-[var(--color-text-muted-dark)] mb-1.5">/ 60 minutes</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted-dark)] mb-5 leading-relaxed">
                Full diagnostic. Multiple dimensions. Best for complex decisions, site evaluations, or any situation where you need to work through more than one layer of the problem.
              </p>
              <ul className="space-y-2.5 mb-6">
                {[
                  'Full diagnostic across your operation',
                  'Written action plan within 24 hours',
                  'Multiple problems or dimensions covered',
                  'No retainer. No upsell.',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--color-text-muted-dark)] leading-snug">
                    {checkIcon}
                    {item}
                  </li>
                ))}
              </ul>
              {url60 ? (
                <a href={url60}
                  className="block w-full text-center bg-[var(--color-gold-cta)] text-[var(--color-navy)] text-[11px] font-semibold tracking-widest uppercase px-6 py-4 rounded-sm hover:brightness-110 transition-all">
                  Book Deep Dive — $500
                </a>
              ) : (
                <a href="mailto:hazemshan1@gmail.com?subject=60-Minute%20Session%20Enquiry"
                  className="block w-full text-center bg-[var(--color-gold-cta)] text-[var(--color-navy)] text-[11px] font-semibold tracking-widest uppercase px-6 py-4 rounded-sm hover:brightness-110 transition-all">
                  Enquire by Email
                </a>
              )}
              {CHECKOUT_60 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                    <rect x="1" y="6" width="10" height="7" rx="1.5" stroke="var(--color-text-muted-dark)" strokeWidth="1.2"/>
                    <path d="M3.5 6V4a2.5 2.5 0 015 0v2" stroke="var(--color-text-muted-dark)" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <p className="text-[10px] text-[var(--color-text-muted-dark)] tracking-wide">Secure payment via Lemon Squeezy</p>
                </div>
              )}
            </div>

            {/* 30-min */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-7">
              <div className="flex items-start justify-between mb-1">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-gold)] font-semibold">Focus Session</p>
                <span className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted)] border border-[var(--color-gold-muted)] px-2 py-0.5 rounded-sm">30 min</span>
              </div>
              <div className="flex items-end gap-2 mb-1">
                <span className="font-serif text-4xl text-[var(--color-text)]">$250</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mb-5 leading-relaxed">
                One specific question. One clear answer. One action. Best for operators who already understand their situation and need a sharp, experienced second opinion.
              </p>
              <ul className="space-y-2.5 mb-6">
                {[
                  'Targeted on a single problem or decision',
                  'Written follow-up within 24 hours',
                  'All time zones covered',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-xs text-[var(--color-text-muted)] leading-snug">
                    {checkIcon}
                    {item}
                  </li>
                ))}
              </ul>
              {url30 ? (
                <a href={url30}
                  className="block w-full text-center border border-[var(--color-gold-muted)] text-[var(--color-text-muted)] text-[10px] font-semibold tracking-widest uppercase px-6 py-3.5 rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all">
                  Book Focus Session — $250
                </a>
              ) : (
                <a href="mailto:hazemshan1@gmail.com?subject=30-Minute%20Session%20Enquiry"
                  className="block w-full text-center border border-[var(--color-gold-muted)] text-[var(--color-text-muted)] text-[10px] font-semibold tracking-widest uppercase px-6 py-3.5 rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all">
                  Enquire by Email
                </a>
              )}
            </div>

            {/* Policy */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-5">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-gold)] mb-2">Reschedule policy</p>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Reschedule up to 24 hours before with no charge. Cancellations inside 24 hours are non-refundable.
              </p>
            </div>

            {/* Bridge to audit */}
            <div className="pt-2">
              <p className="text-xs text-[var(--color-text-muted)] text-center mb-3">
                Looking for more than a session?
              </p>
              <Link to="/audit"
                className="block w-full text-center text-[10px] tracking-widest uppercase font-semibold text-[var(--color-text-muted)] border border-[var(--color-gold-muted)] px-6 py-3 rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all">
                See the 90-Day Farm Programme →
              </Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}
