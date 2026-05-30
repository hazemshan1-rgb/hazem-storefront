import { Button } from '../ui/Button'
import { RingTexture } from '../ui/RingTexture'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[var(--color-bg)]">
      {/* Background image with soft warm overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url(/images/hero/aerial-ponds.jpg)' }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)] via-[var(--color-bg)]/95 to-[var(--color-bg)]/75" aria-hidden="true" />
      <RingTexture />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left — photo */}
          <div className="flex justify-center md:justify-start order-2 md:order-1">
            <div className="relative w-72 h-80 md:w-80 md:h-96 animate-fade-in animation-delay-200">
              {/* Gold frame rings */}
              <div className="absolute inset-0 rounded-sm border border-[var(--color-gold)] translate-x-3 translate-y-3 opacity-40" />
              <div className="absolute inset-0 rounded-sm border border-[var(--color-gold)] translate-x-1.5 translate-y-1.5 opacity-60" />
              <img
                src="/images/hero/hazem-at-ponds.jpg"
                alt="Hazem at a shrimp farm — paddle aerators and ponds behind him"
                className="relative z-10 w-full h-full object-cover object-center rounded-sm"
              />
              {/* Gold accent bar */}
              <div className="absolute -bottom-4 left-4 right-4 h-1 bg-gradient-to-r from-[var(--color-gold)] to-transparent" />
            </div>
          </div>

          {/* Right — headline */}
          <div className="order-1 md:order-2 flex flex-col gap-6">
            <p className="text-[10px] tracking-[0.3em] uppercase font-semibold gold-shimmer animate-fade-in-up">
              Aquaculture · Systems · Profitability
            </p>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--color-text)] leading-tight animate-fade-in-up animation-delay-100">
              Most farms fail for reasons their operators never identify.
            </h1>

            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-md animate-fade-in-up animation-delay-300">
              After 30 years across 15 countries, the pattern is clear: it's rarely the biology. Feed conversion leaks, management blind spots, mis-timed interventions — these cost operators entire seasons, silently. These resources give you the frameworks to find those failures before they compound into something irreversible.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 animate-fade-in-up animation-delay-400">
              <Button as="link" to="/shop" size="lg">Browse Resources</Button>
              <Button as="a" href="#email-capture" variant="secondary" size="lg">Get the Free SOP</Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
