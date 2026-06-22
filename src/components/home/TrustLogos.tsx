import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const logos = [
  { abbr: 'AISP',  full: 'Association of International Seafood Professionals' },
  { abbr: 'IUCN',  full: 'International Union for Conservation of Nature' },
  { abbr: 'FAO',   full: 'Food and Agriculture Organization of the United Nations' },
  { abbr: 'JSOF',  full: 'Jordanian Society for Organic Farming — IFOAM' },
  { abbr: 'RAED',  full: 'Arab Network for Environment & Development' },
  { abbr: 'JAEA',  full: 'Jordan Agricultural Engineers Association' },
]

export function TrustLogos() {
  const { t } = useTranslation()
  const listRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useGSAP(() => {
    const list = listRef.current
    if (!list) return

    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Seamless marquee: animate xPercent -50% on doubled content
      tweenRef.current = gsap.to(list, {
        xPercent: -50,
        duration: 28,
        ease: 'none',
        repeat: -1,
      })

      // Tie speed to scroll velocity
      ScrollTrigger.create({
        onUpdate: (self) => {
          const vel = Math.abs(self.getVelocity()) / 800
          const scale = 1 + Math.min(vel, 4)
          if (tweenRef.current) {
            gsap.to(tweenRef.current, { timeScale: scale, duration: 0.3, ease: 'power1.out' })
            gsap.to(tweenRef.current, { timeScale: 1, duration: 1.2, delay: 0.4, ease: 'power2.out' })
          }
        },
      })

      return () => { tweenRef.current?.kill() }
    })

    mm.add('(prefers-reduced-motion: reduce)', () => {
      // No motion — show static list without animation
    })
  }, { scope: listRef })

  return (
    <section className="border-b border-[var(--color-gold-muted)] bg-[var(--color-bg)] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <p className="text-center text-[9px] tracking-[0.35em] uppercase text-[var(--color-text-muted)] mb-5">
          {t('trustLogos.heading')}
        </p>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-[var(--color-bg)] to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-[var(--color-bg)] to-transparent" />

          <div ref={listRef} className="flex whitespace-nowrap">
            {[...logos, ...logos].map((logo, i) => (
              <div key={i} title={logo.full} className="inline-flex items-center gap-2 mx-8 shrink-0 group">
                <span className="font-serif text-base font-bold tracking-[0.08em] text-[var(--color-text-muted)] group-hover:text-[var(--color-gold)] transition-colors duration-300">
                  {logo.abbr}
                </span>
                <span className="text-[var(--color-gold-muted)] text-xs">·</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
