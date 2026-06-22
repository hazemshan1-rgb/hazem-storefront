import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'

function useCounter(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(2, -10 * progress)
      setCount(Math.round(eased * target))
      if (progress < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [target, duration, active])

  return count
}

interface StatItemProps {
  value: number
  prefix: string
  suffix: string
  label: string
  active: boolean
}

function StatItem({ value, prefix, suffix, label, active }: StatItemProps) {
  const count = useCounter(value, 1400, active)
  return (
    <div className="flex flex-col gap-1">
      <span className="font-serif text-4xl text-[var(--color-gold)]">
        {prefix}{count}{suffix}
      </span>
      <span className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)]">
        {label}
      </span>
    </div>
  )
}

export function TrustStrip() {
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const stats = [
    { prefix: '', value: 30,   suffix: '+',  label: t('trust.yearsLabel') },
    { prefix: '', value: 15,   suffix: '+',  label: t('trust.countriesLabel') },
    { prefix: '$', value: 50,  suffix: 'M+', label: t('trust.farmValueLabel') },
    { prefix: '', value: 1000, suffix: '+',  label: t('trust.professionalsLabel') },
  ]

  return (
    <section ref={ref} className="border-y border-[var(--color-gold-muted)] bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {stats.map(stat => (
            <div key={stat.label} className="relative bg-[var(--color-bg)] border border-[var(--color-gold-muted)] rounded-sm p-6">
              <div className="absolute inset-[3px] rounded-[2px] border border-[var(--color-gold-muted)]/20 pointer-events-none" aria-hidden="true" />
              <StatItem {...stat} active={isInView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
