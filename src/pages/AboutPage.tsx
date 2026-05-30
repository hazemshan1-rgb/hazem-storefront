export function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 pt-28 pb-20">
      <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">The Person Behind the Products</p>
      <h1 className="font-serif text-4xl text-[var(--color-text)] mb-8">About Hazem</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div className="md:col-span-1">
          <img
            src="/images/hero/hazem-placeholder.jpg"
            alt="Hazem Shanshal"
            className="w-full aspect-[3/4] object-cover rounded-sm border border-[var(--color-gold-muted)]"
          />
        </div>
        <div className="md:col-span-2 space-y-4 text-sm text-[var(--color-text-muted)] leading-relaxed">
          <p>
            I have spent 30 years making aquaculture ventures work — not on paper, but on the ground. Shrimp ponds in Southeast Asia. Tilapia systems in the Middle East and Africa. Integrated multi-trophic farms that produce more with less. I have walked into operations that were bleeding money and left them profitable.
          </p>
          <p>
            My frameworks — the Blue Living Systems Framework, Integrated Multi-Trophic Aquaculture (IMTA), and Regenerative Seawater Agriculture (RSA) — are not academic constructs. They are working models built from thousands of hours of farm observation, failure analysis, and system redesign.
          </p>
          <p>
            The resources I sell are the distilled version of what I teach my highest-paying consulting clients. The same tools. The same frameworks. At a price that makes them accessible to operators who cannot yet afford to bring me on-site.
          </p>
          <a
            href="https://www.linkedin.com/in/hazemshanshal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[var(--color-gold)] text-xs tracking-widest uppercase hover:underline mt-4"
          >
            Connect on LinkedIn →
          </a>
        </div>
      </div>
    </main>
  )
}
