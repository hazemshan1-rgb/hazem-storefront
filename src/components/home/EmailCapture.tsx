import { useEffect } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const FORM_BIOFLOC    = import.meta.env.VITE_CONVERTKIT_FORM_BIOFLOC    ?? ''
const FORM_STRATEGIES = import.meta.env.VITE_CONVERTKIT_FORM_STRATEGIES ?? ''

function ConvertKitForm({ formId }: { formId: string }) {
  useEffect(() => {
    if (!formId) return
    const scriptId = `ck-${formId}`
    if (document.getElementById(scriptId)) return
    const script = document.createElement('script')
    script.id = scriptId
    script.src = `https://hazem-shannak.kit.com/${formId}/index.js`
    script.async = true
    document.body.appendChild(script)
    return () => { document.getElementById(scriptId)?.remove() }
  }, [formId])

  if (formId) {
    return <div data-uid={formId} />
  }

  return (
    <form
      className="flex flex-col sm:flex-row gap-3"
      onSubmit={e => {
        e.preventDefault()
        alert('Set VITE_CONVERTKIT_FORM_BIOFLOC or VITE_CONVERTKIT_FORM_STRATEGIES in your .env to activate.')
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
        className="bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-5 py-3 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all whitespace-nowrap cursor-pointer"
      >
        Send It
      </button>
    </form>
  )
}

const guides = [
  {
    formId: FORM_BIOFLOC,
    tag: 'Free Guide · Biofloc',
    title: '10 Ways to Ruin a Biofloc System',
    body: 'The mistakes are documented. Most operators make the same five errors before they make the right call. This guide maps each failure mode — oxygen crashes, C:N imbalances, floc collapse — so you can see them before they cost you a cycle.',
    featured: true,
  },
  {
    formId: FORM_STRATEGIES,
    tag: 'Free Guide · Sustainability',
    title: '7 Strategies for Waste-Free Shrimp Farming',
    body: 'Proven frameworks for reducing feed waste, managing effluent, and building an operation that survives tightening export regulations. Field-tested across Southeast Asia and the Middle East.',
    featured: false,
  },
]

export function EmailCapture() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} id="email-capture" className="scroll-reveal bg-[var(--color-navy)] border-y border-[rgba(255,255,255,0.08)]">
      <div className="max-w-6xl mx-auto px-6 py-20">

        <div className="text-center mb-14">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] mb-4">Free Resources</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-text-on-dark)] mb-4">
            Two guides. Download either — or both.
          </h2>
          <p className="text-sm text-[var(--color-text-muted-dark)] max-w-xl mx-auto leading-relaxed">
            No newsletter padding. No recycled content. Working documents from the field — drop your email and they arrive in your inbox immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {guides.map(guide => (
            <div
              key={guide.title}
              className={`bg-[var(--color-surface)] rounded-sm p-8 flex flex-col gap-6 ${
                guide.featured
                  ? 'border border-[var(--color-gold-cta)] shadow-[0_0_32px_rgba(202,138,4,0.08)]'
                  : 'border border-[var(--color-border)]'
              }`}
            >
              {guide.featured && (
                <span className="self-start text-[9px] tracking-[0.2em] uppercase font-semibold bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-2.5 py-1 rounded-sm">
                  Most Downloaded
                </span>
              )}

              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-gold)] mb-2">{guide.tag}</p>
                <h3 className="font-serif text-xl text-[var(--color-text)] leading-snug mb-3">{guide.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{guide.body}</p>
              </div>

              <ConvertKitForm formId={guide.formId} />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
