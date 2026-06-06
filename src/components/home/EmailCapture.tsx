import { useScrollReveal } from '../../hooks/useScrollReveal'

const guides = [
  {
    checkoutUrl: 'https://aquapreneurs.lemonsqueezy.com/checkout/buy/4b11048a-2b0a-4bd6-b7ce-0e6dc015aab0',
    tag: 'Free Guide · Biofloc',
    title: '10 Ways to Ruin a Biofloc System',
    body: 'The mistakes are documented. Most operators make the same five errors before they make the right call. This guide maps each failure mode — oxygen crashes, C:N imbalances, floc collapse — so you can see them before they cost you a cycle.',
    featured: true,
    cover: '/images/guides/biofloc-guide-cover.png',
    coverAlt: '10 Ways to Ruin a Biofloc System — guide cover',
  },
  {
    checkoutUrl: 'https://aquapreneurs.lemonsqueezy.com/checkout/buy/a25dd731-2ff9-4bcf-87fc-d9c7faae0b62',
    tag: 'Free Guide · Sustainability',
    title: '7 Strategies for Waste-Free Shrimp Farming',
    body: 'Proven frameworks for reducing feed waste, managing effluent, and building an operation that survives tightening export regulations. Field-tested across Southeast Asia and the Middle East.',
    featured: false,
    cover: '/images/guides/7-strategies-cover.png',
    coverAlt: '7 Strategies for Waste-Free Shrimp Farming — guide cover',
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
            No newsletter padding. No recycled content. Working documents from the field — free via Lemon Squeezy, delivered to your inbox immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {guides.map(guide => (
            <div
              key={guide.title}
              className={`bg-[var(--color-surface)] rounded-sm overflow-hidden flex flex-col gap-6 ${
                guide.featured
                  ? 'border border-[var(--color-gold-cta)] shadow-[0_0_32px_rgba(202,138,4,0.08)]'
                  : 'border border-[var(--color-border)]'
              }`}
            >
              <div className="relative">
                <img
                  src={guide.cover}
                  alt={guide.coverAlt}
                  className="w-full h-48 object-cover object-top"
                />
                {guide.featured && (
                  <span className="absolute top-3 left-3 text-[9px] tracking-[0.2em] uppercase font-semibold bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-2.5 py-1 rounded-sm">
                    Most Downloaded
                  </span>
                )}
              </div>

              <div className="px-8 pb-8 flex flex-col gap-6">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-gold)] mb-2">{guide.tag}</p>
                  <h3 className="font-serif text-xl text-[var(--color-text)] leading-snug mb-3">{guide.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{guide.body}</p>
                </div>
                <a
                  href={guide.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lemonsqueezy-button inline-flex items-center gap-2 self-start bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-6 py-3 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all"
                >
                  Get Free Copy →
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
