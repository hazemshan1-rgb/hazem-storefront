export function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 pt-28 pb-20">
      <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">The Person Behind the Products</p>
      <h1 className="font-serif text-4xl text-[var(--color-text)] mb-10">About Hazem</h1>

      {/* Primary bio block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <div className="md:col-span-1">
          <img
            src="/images/hero/hazem-studio.jpg"
            alt="Hazem Shannak — Aquaculture Consultant"
            className="w-full aspect-[4/5] object-cover object-top rounded-sm border border-[var(--color-gold-muted)]"
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
            href="https://www.linkedin.com/in/hazemhshannak"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[var(--color-gold)] text-xs tracking-widest uppercase hover:underline mt-4"
          >
            Connect on LinkedIn →
          </a>
        </div>
      </div>

      {/* Field work section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="relative overflow-hidden rounded-sm border border-[var(--color-gold-muted)]">
          <img
            src="/images/hero/hazem-at-ponds.jpg"
            alt="Hazem standing at a shrimp farm with paddle aerators"
            className="w-full aspect-[3/4] object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/60 to-transparent" />
          <p className="absolute bottom-4 left-4 text-xs tracking-widest uppercase text-[var(--color-gold)]">In the Field</p>
        </div>
        <div className="relative overflow-hidden rounded-sm border border-[var(--color-gold-muted)]">
          <img
            src="/images/hero/hazem-teaching.jpg"
            alt="Hazem teaching shrimp aquaculture in a training session"
            className="w-full aspect-[3/4] object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/60 to-transparent" />
          <p className="absolute bottom-4 left-4 text-xs tracking-widest uppercase text-[var(--color-gold)]">Training & Instruction</p>
        </div>
      </div>
    </main>
  )
}
