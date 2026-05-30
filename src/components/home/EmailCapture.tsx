import { useEffect } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function EmailCapture() {
  const formId = import.meta.env.VITE_CONVERTKIT_FORM_ID ?? ''
  const ref = useScrollReveal<HTMLElement>()

  useEffect(() => {
    if (!formId) return

    const script = document.createElement('script')
    script.src = `https://hazem-shannak.kit.com/${formId}/index.js`
    script.async = true
    script.dataset['uid'] = formId
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [formId])

  return (
    <section ref={ref} id="email-capture" className="scroll-reveal bg-[var(--color-surface)] border-y border-[var(--color-gold-muted)]">
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-3">Free Resource</p>
        <h2 className="font-serif text-3xl text-[var(--color-text)] mb-4">Not sure where to start? Start here.</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-8 leading-relaxed">
          Download the Standard Operating Procedure for Freshwater Giant Prawn Production — free. Field-tested, no padding. A working document you can hand to your farm manager today and see the impact this week.
        </p>

        {formId ? (
          <div data-uid={formId} />
        ) : (
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={e => {
              e.preventDefault()
              alert('ConvertKit form ID not yet configured. Set VITE_CONVERTKIT_FORM_ID in your .env file.')
            }}
          >
            <input
              type="email"
              placeholder="your@email.com"
              required
              className="flex-1 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)]"
            />
            <button
              type="submit"
              className="bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-6 py-3 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all"
            >
              Send It
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
