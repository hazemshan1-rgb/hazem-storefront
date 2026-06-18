import { useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'
import { RingTexture } from '../ui/RingTexture'

export function Hero() {
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-[var(--color-bg)]">
      {/* Parallax background — video loop with image fallback */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{ y: bgY }}
        aria-hidden="true"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero/aerial-ponds.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-10"
          onError={(e) => { (e.currentTarget as HTMLVideoElement).style.display = 'none' }}
        >
          <source src="/videos/hero-loop.mp4" type="video/mp4" />
          <source src="/videos/hero-loop.webm" type="video/webm" />
        </video>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: 'url(/images/hero/aerial-ponds.jpg)' }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)] via-[var(--color-bg)]/95 to-[var(--color-bg)]/70" aria-hidden="true" />
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
                src="/images/hero/hazem-studio.jpg"
                alt={t('hero.imgAlt')}
                className="relative z-10 w-full h-full object-cover object-top rounded-sm"
              />
              {/* Gold accent bar — animated draw */}
              <motion.div
                className="absolute -bottom-4 left-4 h-px bg-gradient-to-r from-[var(--color-gold)] to-transparent"
                initial={{ width: 0 }}
                animate={{ width: 'calc(100% - 1rem)' }}
                transition={{ delay: 0.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          {/* Right — headline */}
          <div className="order-1 md:order-2 flex flex-col gap-6">
            <p className="text-[10px] tracking-[0.3em] uppercase font-semibold gold-shimmer animate-fade-in-up">
              {t('hero.eyebrow')}
            </p>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--color-navy)] leading-tight animate-fade-in-up animation-delay-100">
              {t('hero.headline')}
            </h1>

            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-md animate-fade-in-up animation-delay-300">
              {t('hero.body')}
            </p>

            <div className="flex flex-wrap gap-4 pt-2 animate-fade-in-up animation-delay-400">
              <Button as="link" to="/diagnostic" size="lg">{t('hero.ctaPrimary')}</Button>
              <Button as="link" to="/shop" variant="secondary" size="lg" className="border-[var(--color-navy)] text-[var(--color-navy)] hover:bg-[var(--color-navy)] hover:text-white transition-all">{t('hero.ctaSecondary')}</Button>
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 self-start text-[11px] tracking-[0.15em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-navy)] transition-colors duration-300 animate-fade-in-up animation-delay-400 group"
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
