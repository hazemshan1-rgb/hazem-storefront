import { useState, useEffect } from 'react'
import { NumInput, KPI, StatusBadge, fmt, type Status } from './shared'

export interface CostResult {
  costPerKg: number
  fcr: number
  totalCost: number
  margin: number
}

export function ModuleCost({ onChange }: { onChange: (r: CostResult) => void }) {
  const [feedCostKg, setFeedCostKg] = useState(0.85)
  const [dailyFeed, setDailyFeed] = useState(50)
  const [probioticDaily, setProbioticDaily] = useState(2)
  const [aerationDaily, setAerationDaily] = useState(5)
  const [laborDaily, setLaborDaily] = useState(10)
  const [daysRunning, setDaysRunning] = useState(30)
  const [currentBiomass, setCurrentBiomass] = useState(300)
  const [marketPrice, setMarketPrice] = useState(5.5)

  const totalFeedCost = feedCostKg * dailyFeed * daysRunning
  const totalProbiotic = probioticDaily * daysRunning
  const totalAeration = aerationDaily * daysRunning
  const totalLabor = laborDaily * daysRunning
  const totalCost = totalFeedCost + totalProbiotic + totalAeration + totalLabor
  const fcr = currentBiomass > 0 ? (dailyFeed * daysRunning) / currentBiomass : 0
  const costPerKg = currentBiomass > 0 ? totalCost / currentBiomass : 0
  const margin = marketPrice - costPerKg
  const marginPct = marketPrice > 0 ? (margin / marketPrice) * 100 : 0

  const fcrStatus: Status = fcr <= 1.5 ? 'GREEN' : fcr <= 1.8 ? 'YELLOW' : 'RED'

  useEffect(() => { onChange({ costPerKg, fcr, totalCost, margin }) }, [costPerKg, fcr, totalCost, margin])

  const costBreakdown = [
    { label: 'Feed', val: totalFeedCost, colour: 'bg-sky-500' },
    { label: 'Aeration', val: totalAeration, colour: 'bg-violet-500' },
    { label: 'Probiotics', val: totalProbiotic, colour: 'bg-emerald-500' },
    { label: 'Labor', val: totalLabor, colour: 'bg-amber-500' },
  ]

  return (
    <div className="space-y-6">
      <div className="no-print bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6">
        <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold)] font-semibold mb-4">Daily Operating Costs</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <NumInput label="Feed Cost" unit="$/kg" value={feedCostKg} onChange={setFeedCostKg} min={0.1} max={5} step={0.01} />
          <NumInput label="Daily Feed" unit="kg/day" value={dailyFeed} onChange={setDailyFeed} min={0} max={2000} step={1} />
          <NumInput label="Probiotic Cost" unit="$/day" value={probioticDaily} onChange={setProbioticDaily} min={0} max={500} step={0.5} />
          <NumInput label="Aeration/Power" unit="$/day" value={aerationDaily} onChange={setAerationDaily} min={0} max={500} step={0.5} />
          <NumInput label="Labor Cost" unit="$/day" value={laborDaily} onChange={setLaborDaily} min={0} max={1000} step={1} />
          <NumInput label="Days Running" value={daysRunning} onChange={setDaysRunning} min={1} max={180} step={1} />
        </div>
      </div>

      <div className="no-print bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6">
        <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold)] font-semibold mb-4">Current Biomass &amp; Market</p>
        <div className="grid grid-cols-2 gap-4">
          <NumInput label="Current Biomass" unit="kg" value={currentBiomass} onChange={setCurrentBiomass} min={1} max={100_000} step={10} />
          <NumInput label="Market Price" unit="$/kg" value={marketPrice} onChange={setMarketPrice} min={0.5} max={50} step={0.1} />
        </div>
      </div>

      <div className="no-print bg-[var(--color-navy)] border border-[var(--color-gold-muted)] rounded-sm p-6">
        <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold-cta)] mb-4">Live KPIs</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <KPI label="Cost / kg" value={`$${fmt(costPerKg, 2)}`} />
          <KPI label="Break-even" value={`$${fmt(costPerKg, 2)}`} unit="/kg" />
          <KPI label="Gross Margin" value={`${fmt(marginPct, 1)}%`} sub={margin >= 0 ? `+$${fmt(margin, 2)}/kg profit` : `$${fmt(Math.abs(margin), 2)}/kg loss`} />
          <div className="bg-[rgba(255,255,255,0.04)] border border-[var(--color-gold-muted)] rounded-sm p-4">
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-1.5">FCR <span className="normal-case text-[var(--color-text-muted-dark)]">(target 1.2–1.5)</span></p>
            <div className="flex items-end gap-2">
              <span className="font-serif text-2xl text-[var(--color-text-on-dark)]">{fmt(fcr, 2)}</span>
              <StatusBadge status={fcrStatus} label={fcrStatus} />
            </div>
          </div>
        </div>

        <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-3">Cost Breakdown (Day {daysRunning})</p>
        <div className="space-y-2.5">
          {costBreakdown.map(c => (
            <div key={c.label}>
              <div className="flex justify-between text-[10px] text-[var(--color-text-muted-dark)] mb-1">
                <span>{c.label}</span><span>${fmt(c.val, 0)} ({fmt(totalCost > 0 ? (c.val / totalCost) * 100 : 0, 0)}%)</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${c.colour}`} style={{ width: `${totalCost > 0 ? (c.val / totalCost) * 100 : 0}%` }} />
              </div>
            </div>
          ))}
          <div className="border-t border-[rgba(255,255,255,0.08)] pt-3 flex justify-between text-[var(--color-text-on-dark)] font-bold text-sm">
            <span>Total Cost</span><span>${fmt(totalCost, 0)}</span>
          </div>
        </div>
      </div>

      {fcr > 1.5 && (
        <div className="no-print bg-amber-950/20 border border-amber-500/40 rounded-sm p-6">
          <p className="font-bold text-amber-400 mb-2">⚡ FCR Above Target ({fmt(fcr, 2)} vs 1.5 max)</p>
          <ul className="text-sm text-amber-300 space-y-1">
            <li>→ Verify feed isn't going uneaten — check feed tray after 2 hours</li>
            <li>→ Reduce feed amount 15% and re-measure in 5 days</li>
            <li>→ Confirm feeding frequency matches size stage</li>
            <li>→ Target ADG: 0.23–0.25 g/day — calculate from sampling data</li>
          </ul>
        </div>
      )}
    </div>
  )
}
