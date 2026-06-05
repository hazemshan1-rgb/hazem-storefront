import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface Stat {
  prefix: string
  value: number
  suffix: string
  label: string
}

const stats: Stat[] = [
  { prefix: '',  value: 30,  suffix: '+',  label: 'Years in the Field' },
  { prefix: '',  value: 15,  suffix: '+',  label: 'Countries Deployed' },
  { prefix: '$', value: 50,  suffix: 'M+', label: 'Farm Value Advised' },
  { prefix: '',  value: 1000, suffix: '+', label: 'Professionals Trained' },
]

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

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const count = useCounter(stat.value, 1400, active)
  return (
    <div className="flex flex-col gap-1">
      <span className="font-serif text-4xl text-[var(--color-gold)]">
        {stat.prefix}{count}{stat.suffix}
      </span>
      <span className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)]">
        {stat.label}
      </span>
    </div>
  )
}

export function TrustStrip() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="border-y border-[var(--color-gold-muted)] bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(stat => (
            <StatItem key={stat.label} stat={stat} active={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}
