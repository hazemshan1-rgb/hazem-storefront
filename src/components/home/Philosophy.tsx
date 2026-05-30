import { useScrollReveal } from '../../hooks/useScrollReveal'

export function Philosophy() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="scroll-reveal max-w-6xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">Why This Exists</p>
          <h2 className="font-serif text-3xl text-[var(--color-text)] mb-6">
            Expertise that travels without me
          </h2>
          <div className="space-y-4 text-sm text-[var(--color-text-muted)] leading-relaxed">
            <p>
              Most aquaculture failures are not biological — they are managerial. After three decades in the field across Asia, Africa, and the Middle East, I have seen the same patterns collapse farms that should have thrived.
            </p>
            <p>
              These resources exist because the knowledge that turns a struggling pond operation into a profitable enterprise should not require flying me in. The frameworks work. I have tested them in the mud, not just the classroom.
            </p>
            <p>
              Buy one guide. Apply it this week. If it does not change something measurable on your farm within 30 days, I will give you your money back.
            </p>
          </div>
        </div>

        <div className="relative">
          <img
            src="/images/hero/shrimp-pond.jpg"
            alt="Aquaculture farm — aerial view"
            className="w-full rounded-sm object-cover aspect-[4/3]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/60 to-transparent rounded-sm" />
          {/* Gold accent */}
          <div className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-gradient-to-r from-[var(--color-gold)] to-transparent" />
        </div>
      </div>
    </section>
  )
}
