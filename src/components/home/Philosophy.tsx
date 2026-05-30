import { useScrollReveal } from '../../hooks/useScrollReveal'

export function Philosophy() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="scroll-reveal max-w-6xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">The Problem I Keep Seeing</p>
          <h2 className="font-serif text-3xl text-[var(--color-text)] mb-6">
            You've tried everything. The margin is still wrong.
          </h2>
          <div className="space-y-4 text-sm text-[var(--color-text-muted)] leading-relaxed">
            <p>
              You've adjusted the feed, tested the water, maybe brought in a consultant who handed you a report you couldn't quite act on. And the mortality events still come without a clean explanation. The FCR is still 0.3 points off where it should be. The pond that performed last season is underperforming this one, and no one can tell you why. That's not bad luck — that's a system that hasn't been properly diagnosed.
            </p>
            <p>
              Every season below capacity is margin that doesn't return. A 10% shortfall in yield isn't just a number — it's the reinvestment you couldn't make, the expansion you delayed, the confidence you lost with your financier. I've worked with operators who had the same underlying problem for three years before anyone named it. Three days of structured diagnosis changed their trajectory. These resources codify that diagnostic process so you can run it yourself.
            </p>
            <p>
              Every farm is different — species, water source, climate, stocking cycle. These guides are built for that variation, not despite it. Apply the framework to your specific system. If nothing shifts within 30 days, I will refund you in full. No argument required.
            </p>
          </div>
        </div>

        <div className="relative">
          <img
            src="/images/hero/aerators-sunset.jpg"
            alt="Paddle aerators at sunset on a Vietnamese shrimp pond"
            className="w-full rounded-sm object-cover aspect-[4/3]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/40 to-transparent rounded-sm" />
          {/* Gold accent */}
          <div className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-gradient-to-r from-[var(--color-gold)] to-transparent" />
        </div>
      </div>
    </section>
  )
}
