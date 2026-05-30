import { useScrollReveal } from '../../hooks/useScrollReveal'

const stats = [
  { value: '30+', label: 'Years in the Field' },
  { value: '15+', label: 'Countries Deployed' },
  { value: '$50M+', label: 'Farm Value Advised' },
  { value: '500+', label: 'Operators Trained' },
]

export function TrustStrip() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="scroll-reveal border-y border-[var(--color-gold-muted)] bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(stat => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="font-serif text-4xl text-[var(--color-gold)]">{stat.value}</span>
              <span className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
