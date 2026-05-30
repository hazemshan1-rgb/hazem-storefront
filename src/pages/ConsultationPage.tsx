import { useEffect, useRef, useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL ?? ''

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

function CalendlyWidget({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || !url) return

    // Calendly inline widget — loaded via script in index.html
    const win = window as Window & { Calendly?: { initInlineWidget: (opts: object) => void } }
    if (win.Calendly) {
      win.Calendly.initInlineWidget({
        url,
        parentElement: ref.current,
        prefill: {},
        utm: {},
      })
    }
  }, [url])

  return (
    <div
      ref={ref}
      className="calendly-inline-widget w-full"
      style={{ minWidth: 320, height: 700 }}
      data-auto-load="false"
    />
  )
}

export function ConsultationPage() {
  const headerRef = useScrollReveal<HTMLElement>()

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
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
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">Common questions</p>
              <div className="divide-y divide-[var(--color-gold-muted)]">
                {faqs.map(f => (
                  <FaqItem key={f.q} q={f.q} a={f.a} />
                ))}
              </div>
            </div>
          </div>

          {/* Right — Calendly */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm overflow-hidden">
            {CALENDLY_URL ? (
              <CalendlyWidget url={CALENDLY_URL} />
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center gap-4 min-h-[500px]">
                <p className="font-serif text-2xl text-[var(--color-text)]">Booking coming soon</p>
                <p className="text-sm text-[var(--color-text-muted)] max-w-xs leading-relaxed">
                  Set <code className="text-[var(--color-gold)] bg-[var(--color-surface-2)] px-1.5 py-0.5 rounded text-xs">VITE_CALENDLY_URL</code> in your Vercel environment variables to activate the booking widget.
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Your Calendly URL format: <code className="text-[var(--color-gold)]">https://calendly.com/your-username/consultation</code>
                </p>
              </div>
            )}
          </div>

        </div>
      </section>
    </main>
  )
}
