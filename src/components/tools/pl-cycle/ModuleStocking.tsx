import { useState, useEffect } from 'react'
import { NumInput, KPI, StatusBadge, Bar, fmt, type Status } from './shared'

export interface StockingResult {
  status: Status
  density: number
  pondSize: number
  totalPL: number
}

const AVG_HARVEST_WEIGHT_KG = 0.015 // 15g average at harvest

export function ModuleStocking({ onChange }: { onChange: (r: StockingResult) => void }) {
  const [pondSize, setPondSize] = useState(5000)
  const [temp, setTemp] = useState(28)
  const [salinity, setSalinity] = useState(15)
  const [doLevel, setDoLevel] = useState(6.0)
  const [alkalinity, setAlkalinity] = useState(120)
  const [density, setDensity] = useState(80)
  const [plCost, setPlCost] = useState(0.008)
  const [sellPrice, setSellPrice] = useState(5.0)

  const doOk = doLevel > 5.5
  const tempOk = temp >= 26 && temp <= 32
  const salinityOk = salinity >= 5 && salinity <= 25
  const alkOk = alkalinity >= 100
  const waterScore = [doOk, tempOk, salinityOk, alkOk].filter(Boolean).length

  const maxSafeLoadKg = pondSize * 6 * 0.8 // ~6 kg/m² carrying capacity at 80% utilisation
  const totalPL = density * pondSize
  const projBiomassKg = totalPL * 0.75 * AVG_HARVEST_WEIGHT_KG
  const bioLoadPct = (projBiomassKg / maxSafeLoadKg) * 100

  const optDensity = !doOk ? 0 : Math.floor(maxSafeLoadKg / (pondSize * AVG_HARVEST_WEIGHT_KG * 0.75))
  const recDensity = Math.min(optDensity, 150)

  const status: Status = !doOk ? 'RED' : bioLoadPct > 100 ? 'RED' : bioLoadPct > 80 ? 'YELLOW' : waterScore >= 3 ? 'GREEN' : 'YELLOW'
  const rec = !doOk
    ? 'ABORT — DO below 5.5 ppm. Improve aeration first.'
    : bioLoadPct > 100
    ? `REDUCE — Lower density to ≤${recDensity} PL/m²`
    : waterScore < 3
    ? 'ADJUST — Fix water parameters before stocking'
    : `GO — Stock at ${density} PL/m²`

  const feedCostPerCycle = totalPL * 0.75 * AVG_HARVEST_WEIGHT_KG * 1.35 * 1.2
  const totalCost = totalPL * plCost + feedCostPerCycle
  const costPerKg = projBiomassKg > 0 ? totalCost / projBiomassKg : 0

  useEffect(() => { onChange({ status, density, pondSize, totalPL }) }, [status, density, pondSize, totalPL])

  const checks: [string, boolean][] = [
    ['DO > 5.5', doOk],
    ['Temp 26–32°C', tempOk],
    ['Salinity 5–25', salinityOk],
    ['Alkalinity ≥100', alkOk],
  ]

  return (
    <div className="space-y-6">
      <div className="no-print bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6">
        <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold)] font-semibold mb-4">Pond &amp; Water Parameters</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <NumInput label="Pond Size" unit="m²" value={pondSize} onChange={setPondSize} min={100} max={50000} step={100} />
          <NumInput label="Water Temp" unit="°C" value={temp} onChange={setTemp} min={15} max={40} step={0.5} />
          <NumInput label="Salinity" unit="ppt" value={salinity} onChange={setSalinity} min={0} max={40} step={1} />
          <NumInput label="Dissolved Oxygen" unit="ppm" value={doLevel} onChange={setDoLevel} min={0} max={20} step={0.1} />
          <NumInput label="Alkalinity" unit="mg/L" value={alkalinity} onChange={setAlkalinity} min={0} max={300} step={5} />
          <NumInput label="Stock Density" unit="PL/m²" value={density} onChange={setDensity} min={1} max={300} step={1} />
        </div>
      </div>

      <div className="no-print bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6">
        <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold)] font-semibold mb-4">Economics</p>
        <div className="grid grid-cols-2 gap-4">
          <NumInput label="PL Unit Cost" unit="$/PL" value={plCost} onChange={setPlCost} min={0} max={0.1} step={0.001} />
          <NumInput label="Market Price" unit="$/kg" value={sellPrice} onChange={setSellPrice} min={1} max={30} step={0.1} />
        </div>
      </div>

      <div className="no-print bg-[var(--color-navy)] border border-[var(--color-gold-muted)] rounded-sm p-6">
        <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold-cta)] mb-4">Stocking Decision</p>
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <StatusBadge status={status} label={status} />
          <span className="text-sm font-semibold text-[var(--color-text-on-dark)]">{rec}</span>
        </div>

        <div className="mb-5">
          <div className="flex justify-between text-[10px] text-[var(--color-text-muted-dark)] mb-1.5">
            <span>Projected Bio-Load</span><span>{fmt(bioLoadPct, 0)}% of capacity</span>
          </div>
          <Bar pct={bioLoadPct} colour={bioLoadPct > 100 ? 'red' : bioLoadPct > 80 ? 'yellow' : 'green'} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <KPI label="Total PL" value={(totalPL / 1000).toFixed(1)} unit="K" />
          <KPI label="Rec. Max Density" value={recDensity} unit="PL/m²" />
          <KPI label="Proj. Cost/kg" value={`$${fmt(costPerKg, 2)}`} />
          <KPI label="Water Score" value={`${waterScore}/4`} sub={waterScore >= 3 ? 'OK' : 'Needs work'} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          {checks.map(([label, ok]) => (
            <div key={label} className={`rounded-sm px-3 py-2 text-center font-semibold border ${ok ? 'text-green-400 border-green-500/40 bg-green-950/20' : 'text-red-400 border-red-500/40 bg-red-950/20'}`}>
              {label}<br />{ok ? '✓ PASS' : '✗ FAIL'}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
