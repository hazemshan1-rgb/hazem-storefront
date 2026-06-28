import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP)

export function Philosophy() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const body1Ref = useRef<HTMLParagraphElement>(null)
  const body2Ref = useRef<HTMLParagraphElement>(null)
  const imageInView = useInView(imageRef, { once: true, margin: '-60px' })

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      if (eyebrowRef.current) {
        const split = new SplitText(eyebrowRef.current, { type: 'chars' })
        gsap.from(split.chars, {
          opacity: 0,
          y: 6,
          stagger: 0.02,
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: eyebrowRef.current,
            start: 'top 90%',
            once: true,
          },
        })
      }

      if (headlineRef.current) {
        const split = new SplitText(headlineRef.current, { type: 'words' })
        gsap.from(split.words, {
          opacity: 0,
          y: 22,
          stagger: 0.07,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 87%',
            once: true,
          },
        })
      }

      const bodyEls = [body1Ref.current, body2Ref.current].filter(Boolean) as HTMLElement[]
      bodyEls.forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 14,
          duration: 0.6,
          ease: 'power2.out',
          delay: i * 0.1,
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
          },
        })
      })
    })

    return () => mm.revert()
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <p ref={eyebrowRef} className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">
            {t('philosophy.eyebrow')}
          </p>
          <h2 ref={headlineRef} className="font-serif text-3xl text-[var(--color-text)] mb-6">
            {t('philosophy.headline')}
          </h2>
          <div className="space-y-4 text-sm text-[var(--color-text-muted)] leading-relaxed">
            <p ref={body1Ref}>{t('philosophy.body1')}</p>
            <p ref={body2Ref}>{t('philosophy.body2')}</p>
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
