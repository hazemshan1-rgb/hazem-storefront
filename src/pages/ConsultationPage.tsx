import { useEffect, useRef } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL ?? ''

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

            <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2">Good to know</p>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Sessions are conducted via video call. I work across time zones — Middle East, Asia, Africa, and Europe are all regularly covered. If you are unsure whether your question fits this format, book anyway. The first 10 minutes are for scoping.
              </p>
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
