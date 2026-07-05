import { useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { useScroll, useTransform, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'
import { RingTexture } from '../ui/RingTexture'

gsap.registerPlugin(SplitText, useGSAP)

export function Hero() {
  const { t } = useTranslation()

  // Framer Motion — parallax on background only
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  // GSAP — headline entrance timeline
  const contentRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const ctaGroupRef = useRef<HTMLDivElement>(null)
  const secondaryCtaRef = useRef<HTMLAnchorElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const split = new SplitText(headlineRef.current, { type: 'words' })

      const tl = gsap.timeline({ delay: 0.15 })

      tl.from(eyebrowRef.current, {
        opacity: 0, y: 10, duration: 0.45, ease: 'power2.out',
      })
      .from(split.words, {
        opacity: 0, y: 32, stagger: 0.055, duration: 0.65,
        ease: 'power3.out',
      }, '-=0.1')
      .from(bodyRef.current, {
        opacity: 0, y: 14, duration: 0.5, ease: 'power2.out',
      }, '-=0.35')
      .from([ctaGroupRef.current, secondaryCtaRef.current], {
        opacity: 0, y: 10, stagger: 0.08, duration: 0.4, ease: 'power2.out',
      }, '-=0.25')

      return () => split.revert()
    })

    mm.add('(prefers-reduced-motion: reduce)', () => {
      // Instant reveal — no motion for accessibility
      gsap.set([eyebrowRef.current, headlineRef.current, bodyRef.current, ctaGroupRef.current, secondaryCtaRef.current], {
        opacity: 1, y: 0,
      })
    })
  }, { scope: contentRef })

  return (
    <section ref={sectionRef} className="relative min-h-[100dvh] flex items-center overflow-hidden bg-[var(--color-bg)]">
      {/* Gradient mesh atmosphere */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-[radial-gradient(ellipse_at_bottom_left,rgba(202,138,4,0.13)_0%,transparent_65%)]" />
        <div className="absolute top-0 right-0 w-1/2 h-2/3 bg-[radial-gradient(ellipse_at_top_right,rgba(15,23,42,0.08)_0%,transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_100%_60%_at_25%_100%,rgba(139,105,20,0.07)_0%,transparent_70%)]" />
      </div>

      {/* Parallax background — Framer Motion handles this correctly */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{ y: bgY }}
        aria-hidden="true"
      >
        <video
          autoPlay muted loop playsInline
          poster="/images/hero/aerial-ponds.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.04]"
          onError={(e) => { (e.currentTarget as HTMLVideoElement).style.display = 'none' }}
        >
          <source src="/videos/hero-loop.mp4" type="video/mp4" />
          <source src="/videos/hero-loop.webm" type="video/webm" />
        </video>
      </motion.div>

      {/* Directional veil */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)] via-[var(--color-bg)]/88 to-[var(--color-bg)]/45" aria-hidden="true" />
      <RingTexture />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left — photo (CSS animation, independent of headline timeline) */}
          <div className="flex justify-center md:justify-start order-2 md:order-1">
            <div className="relative w-72 h-80 md:w-80 md:h-96 animate-fade-in animation-delay-200">
              <div className="absolute inset-0 rounded-sm border border-[var(--color-gold)] translate-x-3 translate-y-3 opacity-40" />
              <div className="absolute inset-0 rounded-sm border border-[var(--color-gold)] translate-x-1.5 translate-y-1.5 opacity-60" />
              <img
                src="/images/hero/hazem-studio.jpg"
                alt={t('hero.imgAlt')}
                className="relative z-10 w-full h-full object-cover object-top rounded-sm"
              />
              {/* Gold accent bar — Framer Motion draw */}
              <motion.div
                className="absolute -bottom-4 left-4 h-px bg-gradient-to-r from-[var(--color-gold)] to-transparent"
                initial={{ width: 0 }}
                animate={{ width: 'calc(100% - 1rem)' }}
                transition={{ delay: 0.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          {/* Right — headline (GSAP timeline entrance) */}
          <div ref={contentRef} className="order-1 md:order-2 flex flex-col gap-6">
            <p ref={eyebrowRef} className="text-[10px] tracking-[0.3em] uppercase font-semibold gold-shimmer">
              {t('hero.eyebrow')}
            </p>

            <h1 ref={headlineRef} className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--color-navy)] leading-tight">
              {t('hero.headline')}
            </h1>

            <p ref={bodyRef} className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-md">
              {t('hero.body')}
            </p>

            <div ref={ctaGroupRef} className="flex flex-wrap gap-4 pt-2">
              <Button as="link" to="/diagnostic" size="lg">{t('hero.ctaPrimary')}</Button>
              <Button as="link" to="/about" variant="secondary" size="lg">{t('hero.ctaAbout')}</Button>
            </div>

            <Link
              ref={secondaryCtaRef}
              to="/shop"
              className="inline-flex items-center gap-2 self-start text-[11px] tracking-[0.15em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-navy)] transition-colors duration-300 group"
            >
              <span className="w-1 h-1 rounded-full bg-[var(--color-gold-cta)] opacity-70 group-hover:opacity-100 transition-opacity" />
              {t('hero.ctaTertiary')}
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
