import { useState } from 'react'
import { motion } from 'framer-motion'

// ── Calculation logic (ported from optifeed-pro-1) ──────────────────────────

function baseFeedRate(abw: number): number {
  if (abw <= 2.0) return 12.0 - 2.0 * abw
  if (abw <= 8.0) return 8.0 - 0.6 * (abw - 2.0)
  if (abw <= 15.0) return 4.4 - 0.22 * (abw - 8.0)
  if (abw <= 25.0) return 2.86 - 0.08 * (abw - 15.0)
  return Math.max(1.5, 2.06 - 0.03 * (abw - 25.0))
}

function tempCoeff(temp: number): number {
  if (temp < 22) return 0.0
  if (temp < 25) return 0.45
  if (temp < 28) return 0.82
  if (temp <= 31) return 1.0
  if (temp < 34) return 0.86
  return 0.0
}

function phCoeff(ph: number): number {
  if (ph < 6.8 || ph > 9.0) return 0.4
  if (ph < 7.4) return 0.85
  if (ph <= 8.2) return 1.0
  if (ph <= 8.6) return 0.88
  return 0.65
}

function estimateSurvival(doc: number, temp: number, ph: number): number {
  const stress =
    (temp > 32 ? (temp - 32) * 4 : 0) +
    (ph < 7.2 ? (7.2 - ph) * 12 : 0) +
    (ph > 8.3 ? (ph - 8.3) * 15 : 0)
  return Math.max(50, Math.min(98, Math.round(92 - doc * 0.12 - stress)))
}

const GROWTH_RATE: Record<string, number> = {
  'L. Vannamei': 0.28,
  'P. Monodon': 0.36,
}

// ── Component ───────────────────────────────────────────────────────────────

const SPECIES = ['L. Vannamei', 'P. Monodon'] as const

type Species = typeof SPECIES[number]

function CoeffBadge({ label, value, optimal }: { label: string; value: number; optimal: boolean }) {
  return (
    <div className="bg-[var(--color-surface-2)] border border-[var(--color-gold-muted)] rounded-sm p-3 text-center">
      <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted)] mb-1">{label}</p>
      <p className={`font-mono text-sm font-bold ${optimal ? 'text-green-400' : 'text-[var(--color-gold-cta)]'}`}>
        {value.toFixed(2)}
      </p>
    </div>
  )
}

export function FeedCalculator() {
  const [species, setSpecies] = useState<Species>('L. Vannamei')
  const [areHa, setAreaHa] = useState(1.0)
  const [densityPerM2, setDensityPerM2] = useState(80)
  const [doc, setDoc] = useState(30)
  const [abw, setAbw] = useState(5.0)
  const [ph, setPh] = useState(7.8)
  const [temp, setTemp] = useState(28.5)
  const [appetiteAdj, setAppetiteAdj] = useState(0)

  // Derived calculations
  const stockingQty = areHa * 10_000 * densityPerM2
  const survivalRate = estimateSurvival(doc, temp, ph)
  const biomassKg = Number(((stockingQty * (survivalRate / 100) * abw) / 1000).toFixed(1))
  const baseFR = baseFeedRate(abw)
  const fT = tempCoeff(temp)
  const fPh = phCoeff(ph)
  const isCritical = temp >= 34
  const feedKg = isCritical
    ? 0
    : Number((biomassKg * (baseFR / 100) * fT * fPh * (1 + appetiteAdj / 100)).toFixed(1))
  const perMeal = isCritical ? 0 : Number((feedKg / 4).toFixed(1))

  const docABW = doc * GROWTH_RATE[species]

  const phWarning = ph < 7.2 || ph > 8.5
  const tempWarning = temp > 32

  return (
    <div className="space-y-8">

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left column */}
        <div className="space-y-5">

          {/* Species */}
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-3 font-semibold">
              Species
            </label>
            <div className="flex gap-2">
              {SPECIES.map(s => (
                <button
                  key={s}
                  onClick={() => setSpecies(s)}
                  className={`flex-1 py-2.5 text-xs font-semibold rounded-sm border transition-all ${
                    species === s
                      ? 'bg-[var(--color-gold-cta)] text-[var(--color-navy)] border-[var(--color-gold-cta)]'
                      : 'border-[var(--color-gold-muted)] text-[var(--color-text-muted)] hover:border-[var(--color-gold)]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Pond area */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] font-semibold">
                Pond Area (ha)
              </label>
              <span className="font-serif text-sm text-[var(--color-gold)]">{areHa.toFixed(1)} ha</span>
            </div>
            <input type="range" min={0.1} max={10} step={0.1} value={areHa}
              onChange={e => setAreaHa(Number(e.target.value))}
              className="w-full accent-[var(--color-gold)]" />
          </div>

          {/* Stocking density */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] font-semibold">
                Stocking Density (shrimp/m²)
              </label>
              <span className="font-serif text-sm text-[var(--color-gold)]">{densityPerM2}</span>
            </div>
            <input type="range" min={20} max={300} step={5} value={densityPerM2}
              onChange={e => setDensityPerM2(Number(e.target.value))}
              className="w-full accent-[var(--color-gold)]" />
            <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
              Total stocked: {(stockingQty / 1000).toFixed(0)}K shrimp
            </p>
          </div>

          {/* DOC */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] font-semibold">
                Day of Culture (DOC)
              </label>
              <span className="font-serif text-sm text-[var(--color-gold)]">Day {doc}</span>
            </div>
            <input type="range" min={1} max={120} step={1} value={doc}
              onChange={e => setDoc(Number(e.target.value))}
              className="w-full accent-[var(--color-gold)]" />
            <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
              Est. ABW at this DOC: {docABW.toFixed(1)}g ({species})
            </p>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* ABW slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] font-semibold">
                Actual ABW (g)
              </label>
              <span className="font-serif text-sm text-[var(--color-gold)]">{abw.toFixed(1)} g</span>
            </div>
            <input type="range" min={0.5} max={35} step={0.5} value={abw}
              onChange={e => setAbw(Number(e.target.value))}
              className="w-full accent-[var(--color-gold)]" />
          </div>

          {/* pH */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] font-semibold">
                pH
              </label>
              <span className={`font-serif text-sm ${phWarning ? 'text-amber-400' : 'text-[var(--color-gold)]'}`}>
                {ph.toFixed(1)}
              </span>
            </div>
            <input type="range" min={6.0} max={9.5} step={0.1} value={ph}
              onChange={e => setPh(Number(e.target.value))}
              className="w-full accent-[var(--color-gold)]" />
            <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Optimal: 7.5–8.2</p>
          </div>

          {/* Temperature */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] font-semibold">
                Water Temperature (°C)
              </label>
              <span className={`font-serif text-sm ${isCritical ? 'text-red-400' : tempWarning ? 'text-amber-400' : 'text-[var(--color-gold)]'}`}>
                {temp.toFixed(1)}°C
              </span>
            </div>
            <input type="range" min={18} max={40} step={0.5} value={temp}
              onChange={e => setTemp(Number(e.target.value))}
              className="w-full accent-[var(--color-gold)]" />
            <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Optimal: 28–31°C</p>
          </div>

          {/* Appetite adjustment */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] font-semibold">
                Appetite Adjustment
              </label>
              <span className={`text-xs font-semibold ${appetiteAdj === 0 ? 'text-[var(--color-text-muted)]' : appetiteAdj > 0 ? 'text-green-400' : 'text-amber-400'}`}>
                {appetiteAdj > 0 ? `+${appetiteAdj}%` : appetiteAdj === 0 ? 'Standard' : `${appetiteAdj}%`}
              </span>
            </div>
            <input type="range" min={-15} max={15} step={1} value={appetiteAdj}
              onChange={e => setAppetiteAdj(Number(e.target.value))}
              className="w-full accent-[var(--color-gold)]" />
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-[var(--color-text-muted)]">−15% (stress)</span>
              <span className="text-[9px] text-[var(--color-text-muted)]">+15% (favourable)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Result card */}
      <motion.div
        key={feedKg}
        initial={{ opacity: 0.6, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.18 }}
        className={`rounded-sm border ${isCritical ? 'border-red-500/40 bg-red-950/20' : 'border-[var(--color-gold-cta)] bg-[var(--color-navy)]'} p-8`}
      >
        {isCritical && (
          <p className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-4">
            Critical Temperature Alert — Stop Feeding
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="text-center sm:text-left">
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-2">
              Daily Feed Target
            </p>
            <p className={`font-serif text-5xl ${isCritical ? 'text-red-400' : 'text-[var(--color-gold-cta)]'}`}>
              {feedKg}
              <span className="text-lg text-[var(--color-text-muted-dark)] ml-1">kg</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-2">
              Per Meal (4×/day)
            </p>
            <p className="font-serif text-3xl text-[var(--color-text-on-dark)]">
              {perMeal}
              <span className="text-sm text-[var(--color-text-muted-dark)] ml-1">kg</span>
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-2">
              Standing Biomass
            </p>
            <p className="font-serif text-3xl text-[var(--color-text-on-dark)]">
              {biomassKg.toLocaleString()}
              <span className="text-sm text-[var(--color-text-muted-dark)] ml-1">kg</span>
            </p>
            <p className="text-[9px] text-[var(--color-text-muted-dark)] mt-1">
              Survival est. {survivalRate}%
            </p>
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.08)] pt-6">
          <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-4">
            Coefficient Audit Matrix
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <CoeffBadge label="Base Rate" value={baseFR} optimal={baseFR >= 2} />
            <CoeffBadge label="Temp Coeff" value={fT} optimal={fT === 1.0} />
            <CoeffBadge label="pH Coeff" value={fPh} optimal={fPh === 1.0} />
            <CoeffBadge label="Appetite" value={1 + appetiteAdj / 100} optimal={appetiteAdj >= 0} />
          </div>
        </div>
      </motion.div>

      <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed">
        Recommendations are based on L. vannamei biological feeding curves (FCR correlations). Adjust for your specific feed brand protein content and pond conditions. For precision pond-level optimisation, see the full OptiFeed Pro suite available in the shop.
      </p>
    </div>
  )
}
