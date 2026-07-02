import { useState, useEffect } from 'react'
import { NumInput, fmt, StatusBadge, type Status } from './shared'

export interface HarvestResult {
  status: Status
  currentValue: number
  projValue: number
  netGain: number
}

export function ModuleHarvest({ onChange }: { onChange: (r: HarvestResult) => void }) {
  const [abw, setAbw] = useState(12)
  const [count, setCount] = useState(80_000)
  const [marketPrice, setMarketPrice] = useState(5.5)
  const [dailyCost, setDailyCost] = useState(65)
  const [adg, setAdg] = useState(0.24)
  const [holdDays, setHoldDays] = useState(7)

  const currentBiomass = (abw * count) / 1000
  const currentValue = currentBiomass * marketPrice

  const projAbw = abw + adg * holdDays
  const projBiomass = (projAbw * count) / 1000
  const projValue = projBiomass * marketPrice
  const holdCost = dailyCost * holdDays
  const valueGain = projValue - currentValue
  const netGain = valueGain - holdCost

  const harvestNow = netGain <= 0
  const status: Status = harvestNow ? 'RED' : netGain < holdCost * 0.3 ? 'YELLOW' : 'GREEN'
  const rec = harvestNow
    ? 'HARVEST NOW — Holding is destroying value'
    : `HOLD ${holdDays} DAYS — Net gain $${fmt(netGain, 0)} above cost`

  // Scan every hold window from 1–30 days for the profit-maximising day
  let bestNetGain = -Infinity
  let bestDay = 0
  for (let d = 1; d <= 30; d++) {
    const pAbw = abw + adg * d
    const pBio = (pAbw * count) / 1000
    const gain = (pBio - currentBiomass) * marketPrice - dailyCost * d
    if (gain > bestNetGain) { bestNetGain = gain; bestDay = d }
  }

  useEffect(() => { onChange({ status, currentValue, projValue, netGain }) }, [status, currentValue, projValue, netGain])

  return (
    <div className="space-y-6">
      <div className="no-print bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6">
        <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold)] font-semibold mb-4">Current Crop Status</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <NumInput label="Avg Body Weight" unit="g" value={abw} onChange={setAbw} min={1} max={50} step={0.5} />
          <NumInput label="Est. Surviving Count" value={count} onChange={setCount} min={1000} max={2_000_000} step={1000} />
          <NumInput label="Market Price" unit="$/kg" value={marketPrice} onChange={setMarketPrice} min={1} max={50} step={0.1} />
          <NumInput label="Daily Hold Cost" unit="$/day" value={dailyCost} onChange={setDailyCost} min={1} max={5000} step={1} />
          <NumInput label="ADG" unit="g/day, target 0.23–0.25" value={adg} onChange={setAdg} min={0.05} max={0.5} step={0.01} />
          <NumInput label="Hold Scenario" unit="days" value={holdDays} onChange={setHoldDays} min={1} max={30} step={1} />
        </div>
        {(adg < 0.23 || adg > 0.25) && (
          <p className="text-xs text-amber-500 mt-3">⚡ ADG outside target range 0.23–0.25 g/day</p>
        )}
      </div>

      <div className="no-print bg-[var(--color-navy)] border border-[var(--color-gold-muted)] rounded-sm p-6">
        <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold-cta)] mb-4">Harvest Decision</p>
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <StatusBadge status={status} label={status} />
          <span className="text-sm font-semibold text-[var(--color-text-on-dark)]">{rec}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="rounded-sm p-4 bg-[rgba(255,255,255,0.04)] border border-[var(--color-gold-muted)]">
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-2">Harvest Now</p>
            <p className="font-serif text-2xl text-[var(--color-text-on-dark)]">${fmt(currentValue, 0)}</p>
            <p className="text-[10px] text-[var(--color-text-muted-dark)]">{fmt(currentBiomass, 0)} kg @ {abw}g avg</p>
          </div>
          <div className={`rounded-sm p-4 border ${netGain > 0 ? 'border-green-500/40 bg-green-950/20' : 'border-red-500/40 bg-red-950/20'}`}>
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-2">Hold {holdDays} Days</p>
            <p className={`font-serif text-2xl ${netGain > 0 ? 'text-green-400' : 'text-red-400'}`}>${fmt(projValue, 0)}</p>
            <p className="text-[10px] text-[var(--color-text-muted-dark)]">{fmt(projBiomass, 0)} kg @ {fmt(projAbw, 1)}g avg</p>
            <div className="border-t border-[rgba(255,255,255,0.08)] my-2" />
            <p className="text-xs font-bold text-[var(--color-text-on-dark)]">
              Growth value: +${fmt(valueGain, 0)}<br />
              Hold cost: −${fmt(holdCost, 0)}<br />
              <span className={netGain >= 0 ? 'text-green-400' : 'text-red-400'}>Net: {netGain >= 0 ? '+' : ''}${fmt(netGain, 0)}</span>
            </p>
          </div>
        </div>

        <div className={`rounded-sm p-4 border ${bestNetGain > 0 ? 'border-green-500/40 bg-green-950/20' : 'border-red-500/40 bg-red-950/20'}`}>
          <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-1.5">Optimal Hold Window (scanned 1–30 days)</p>
          {bestNetGain > 0 ? (
            <p className="text-base font-bold text-[var(--color-text-on-dark)]">
              Hold <span className="text-green-400">{bestDay} days</span> for max net gain of <span className="text-green-400">${fmt(bestNetGain, 0)}</span>
            </p>
          ) : (
            <p className="text-base font-bold text-red-400">No profitable hold window — harvest immediately</p>
          )}
        </div>
      </div>
    </div>
  )
}
