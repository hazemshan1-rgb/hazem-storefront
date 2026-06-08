import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function Philosophy() {
  const { t } = useTranslation()
  const sectionRef = useScrollReveal<HTMLElement>()
  const imageRef = useRef<HTMLDivElement>(null)
  const imageInView = useInView(imageRef, { once: true, margin: '-60px' })

  return (
    <section ref={sectionRef} className="scroll-reveal max-w-6xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">
            {t('philosophy.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl text-[var(--color-text)] mb-6">
            {t('philosophy.headline')}
          </h2>
          <div className="space-y-4 text-sm text-[var(--color-text-muted)] leading-relaxed">
            <p>{t('philosophy.body1')}</p>
            <p>{t('philosophy.body2')}</p>
          </div>
        </div>

        <div ref={imageRef} className="relative">
          <img
            src="/images/hero/hazem-consulting.jpg"
            alt={t('philosophy.imgAlt')}
            className="w-full rounded-sm object-cover aspect-[4/3]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/40 to-transparent rounded-sm" />
          <motion.div
            className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-[var(--color-gold)] to-transparent"
            initial={{ width: 0 }}
            animate={imageInView ? { width: '33%' } : { width: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </section>
  )
}
