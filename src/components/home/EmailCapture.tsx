export function EmailCapture() {
  const formId = import.meta.env.VITE_CONVERTKIT_FORM_ID ?? ''

  return (
    <section id="email-capture" className="bg-[var(--color-surface)] border-y border-[var(--color-gold-muted)]">
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-3">Free Resource</p>
        <h2 className="font-serif text-3xl text-[var(--color-text)] mb-4">Start with the free SOP</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-8 leading-relaxed">
          Download the Standard Operating Procedure for Freshwater Giant Prawn Production. No fluff — a working document you can hand to your farm manager today.
        </p>

        {formId ? (
          <script async data-uid={formId} src={`https://hazem-shanshal.kit.com/${formId}/index.js`} />
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
              className="flex-1 bg-[var(--color-bg)] border border-[var(--color-gold-muted)] rounded-sm px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)]"
            />
            <button
              type="submit"
              className="bg-[var(--color-gold)] text-[var(--color-bg)] px-6 py-3 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all"
            >
              Send It
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
