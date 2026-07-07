import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface WisdomStatementProps {
  text: string
  variant?: 'light' | 'dark'
}

export function WisdomStatement({ text, variant = 'light' }: WisdomStatementProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const isDark = variant === 'dark'

  return (
    <section
      ref={ref}
      className={
        isDark
          ? 'bg-[var(--color-navy)] border-y border-[rgba(255,255,255,0.08)]'
          : 'bg-[var(--color-surface)] border-y border-[var(--color-gold-muted)]'
      }
    >
      <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={`font-serif text-3xl md:text-5xl leading-tight text-center ${
            isDark ? 'text-[var(--color-text-on-dark)]' : 'text-[var(--color-text)]'
          }`}
        >
          {text}
        </motion.p>
      </div>
    </section>
  )
}
