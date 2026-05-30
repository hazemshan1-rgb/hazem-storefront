import { useEffect, useRef } from 'react'

const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL ?? ''

function CalendlyWidget({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || !url) return
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

export function BookConsultationPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-16">

      {/* Confirmation header — navy strip */}
      <section className="bg-[var(--color-navy)] border-b border-[rgba(255,255,255,0.08)]">
        <div className="max-w-3xl mx-auto px-6 py-10 text-center">
          <div className="w-12 h-12 rounded-full border border-[var(--color-gold-cta)] flex items-center justify-center mx-auto mb-5">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 10l4.5 4.5L16 6" stroke="var(--color-gold-cta)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] mb-3">
            Payment Confirmed
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-text-on-dark)] mb-4">
            Choose your time slot.
          </h1>
          <p className="text-sm text-[var(--color-text-muted-dark)] leading-relaxed max-w-lg mx-auto">
            Pick a date and time that works for you. You'll receive a confirmation email with the video call link immediately after booking.
          </p>
        </div>
      </section>

      {/* Calendly embed */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        {CALENDLY_URL ? (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden shadow-sm">
            <CalendlyWidget url={CALENDLY_URL} />
          </div>
        ) : (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-16 text-center">
            <p className="font-serif text-2xl text-[var(--color-text)] mb-4">Booking widget coming soon</p>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-sm mx-auto">
              Set{' '}
              <code className="text-[var(--color-gold)] bg-[var(--color-surface-2)] px-1.5 py-0.5 rounded text-xs">
                VITE_CALENDLY_URL
              </code>{' '}
              in your Vercel environment variables to activate scheduling.
            </p>
          </div>
        )}
      </section>

      {/* What happens next */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { step: '01', label: 'Confirm time', detail: 'Choose the slot that suits you. A calendar invite lands in your inbox immediately.' },
            { step: '02', label: 'Prepare', detail: 'Bring your most pressing operational or investment question. Real numbers if you have them.' },
            { step: '03', label: 'Session', detail: 'A focused 60 minutes. You leave with a specific action, not a vague recommendation.' },
          ].map(({ step, label, detail }) => (
            <div key={step} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6">
              <p className="text-[var(--color-gold-cta)] font-serif text-2xl mb-2">{step}</p>
              <p className="text-sm font-semibold text-[var(--color-text)] mb-2 tracking-wide uppercase text-[10px]">{label}</p>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{detail}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
