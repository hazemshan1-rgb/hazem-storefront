import { useState } from 'react'

export function ProfitabilityCalculator() {
  const [revenue, setRevenue] = useState<number>(1000000)
  const [fcr, setFcr] = useState<number>(1.8)

  // Typical potential FCR improvement is 0.2-0.4 based on case studies
  const potentialFcrImprovement = 0.2
  const feedCostRatio = 0.6 // Feed is typically 60% of production cost
  const productionCostRatio = 0.8 // Total production cost is typically 80% of revenue

  const currentProductionCost = revenue * productionCostRatio
  const currentFeedCost = currentProductionCost * feedCostRatio

  // FCR improvement directly reduces feed cost
  // New Feed Cost = Current Feed Cost * (Target FCR / Current FCR)
  const targetFcr = Math.max(1.2, fcr - potentialFcrImprovement)
  const newFeedCost = currentFeedCost * (targetFcr / fcr)
  const annualSavings = currentFeedCost - newFeedCost

  return (
    <section className="bg-[var(--color-navy)] py-20 border-y border-[rgba(255,255,255,0.08)]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] mb-4">Diagnostic Tool</p>
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
            Margin Recovery Calculator
          </h2>
          <p className="text-sm text-[var(--color-text-muted-dark)] max-w-xl mx-auto leading-relaxed">
            A 0.2 improvement in FCR can recover hundreds of thousands in lost margin. See what's possible for your operation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-[var(--color-surface)] p-8 md:p-12 rounded-sm border border-[var(--color-gold-muted)]">
          {/* Inputs */}
          <div className="space-y-8">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-3 font-semibold">
                Annual Revenue (USD)
              </label>
              <input
                type="range"
                min="100000"
                max="5000000"
                step="100000"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="w-full accent-[var(--color-gold)]"
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-[var(--color-text)] font-serif">${revenue.toLocaleString()}</span>
                <span className="text-[10px] text-[var(--color-text-muted)]">$5M</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-3 font-semibold">
                Current FCR
              </label>
              <input
                type="range"
                min="1.2"
                max="2.5"
                step="0.1"
                value={fcr}
                onChange={(e) => setFcr(Number(e.target.value))}
                className="w-full accent-[var(--color-gold)]"
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-[var(--color-text)] font-serif">{fcr.toFixed(1)}</span>
                <span className="text-[10px] text-[var(--color-text-muted)]">2.5</span>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="text-center p-8 bg-[var(--color-surface-2)] rounded-sm border border-[var(--color-gold-muted)] flex flex-col justify-center items-center">
            <p className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-2">Potential Annual Recovery</p>
            <p className="font-serif text-5xl md:text-6xl text-[var(--color-gold)] mb-4">
              ${Math.round(annualSavings).toLocaleString()}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-8 max-w-[240px]">
              Estimated margin recovered by optimizing FCR to <strong>{targetFcr.toFixed(1)}</strong>.
            </p>
            <a
              href="/audit"
              className="inline-block bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-8 py-3.5 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all"
            >
              Get the Audit →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
