import { useState } from 'react'
import { motion } from 'framer-motion'
import { useEmailGateCapture } from './EmailGate'
import { ReportExport } from './ReportExport'

// ── Carbon sources (from biofloc_calc/core/carbon_sources.py) ───────────────
const CARBON_SOURCES = {
  molasses:  { name: 'Molasses',       carbonFraction: 0.30, speed: 'Fast' },
  sugar:     { name: 'Sucrose/Sugar',  carbonFraction: 0.42, speed: 'Fast' },
  jaggery:   { name: 'Jaggery',        carbonFraction: 0.40, speed: 'Fast' },
  tapioca:   { name: 'Tapioca Starch', carbonFraction: 0.44, speed: 'Moderate' },
  corn:      { name: 'Corn Starch',    carbonFraction: 0.44, speed: 'Moderate' },
  rice_bran: { name: 'Rice Bran',      carbonFraction: 0.38, speed: 'Slow' },
} as const

type SourceKey = keyof typeof CARBON_SOURCES

// ── Engine (ported from biofloc_calc/core/engine.py + utils.py) ─────────────

// Emerson et al. (1975): temperature-salinity correction for ammonium pKa
function calcPKa(tempC: number, salinity = 25): number {
  const T = tempC + 273.15
  return 0.09018 + 2729.92 / T - 0.0018 * salinity
}

// Fraction of TAN present as unionised NH3 (the toxic form)
function nh3Fraction(tempC: number, ph: number, salinity = 25): number {
  const pka = calcPKa(tempC, salinity)
  return 1.0 / (1.0 + Math.pow(10, pka - ph))
}

type RiskLevel = 'SAFE' | 'ELEVATED' | 'MODERATE' | 'HIGH' | 'CRITICAL'

function classifyTan(v: number): RiskLevel {
  if (v >= 5.0) return 'CRITICAL'
  if (v >= 3.0) return 'HIGH'
  if (v >= 2.0) return 'ELEVATED'
  if (v >= 1.0) return 'MODERATE'
  return 'SAFE'
}

function classifyNH3(v: number): RiskLevel {
  if (v >= 0.30) return 'CRITICAL'
  if (v >= 0.15) return 'HIGH'
  if (v >= 0.10) return 'ELEVATED'
  if (v >= 0.05) return 'MODERATE'
  return 'SAFE'
}

function overallRisk(tan: RiskLevel, nh3: RiskLevel): RiskLevel {
  const order: RiskLevel[] = ['SAFE', 'MODERATE', 'ELEVATED', 'HIGH', 'CRITICAL']
  const max = Math.max(order.indexOf(tan), order.indexOf(nh3))
  return order[max]
}

interface CalcResult {
  maintenanceKg: number
  correctionKg: number
  totalKg: number
  gPerM3: number
  nh3MgL: number
  tanRisk: RiskLevel
  nh3Risk: RiskLevel
  overall: RiskLevel
  schedule: string[]
  dailyCostUsd: number
}

function buildSchedule(totalKg: number, sourceName: string, risk: RiskLevel): string[] {
  if (totalKg < 0.01) return ['No supplemental carbon needed today']
  const times =
    risk === 'CRITICAL' ? ['06:00', '10:00', '14:00', '20:00'] :
    risk === 'HIGH'     ? ['06:00', '12:00', '18:00'] :
                          ['08:00', '16:00']
  const splitKg = totalKg / times.length
  return times.map(t => `${t} — ${splitKg.toFixed(2)} kg ${sourceName}`)
}

function calculate(inputs: {
  volumeM3: number
  feedKg: number
  proteinPct: number
  tanMgL: number
  ph: number
  tempC: number
  sourceKey: SourceKey
  targetCN: number
  pricePerKg: number
}): CalcResult {
  const { volumeM3, feedKg, proteinPct, tanMgL, ph, tempC, sourceKey, targetCN, pricePerKg } = inputs
  const source = CARBON_SOURCES[sourceKey]

  // Nitrogen budget
  const feedG = feedKg * 1000
  const nFeed = feedG * (proteinPct / 100) * 0.16       // Kjeldahl N in protein
  const nWater = nFeed * 0.50                            // 50% excreted as TAN
  const cFromFeed = nFeed * 9.5 * 0.30                  // feed C:N ~9.5, 30% available

  const cTotal = nWater * targetCN
  const cSupp = Math.max(0, cTotal - cFromFeed)
  const maintenanceKg = cSupp / source.carbonFraction / 1000

  // TAN correction for existing excess
  const excessTan = Math.max(0, tanMgL - 1.0)
  const nExcess = excessTan * volumeM3
  const correctionKg = (nExcess * targetCN) / source.carbonFraction / 1000

  const totalKg = maintenanceKg + correctionKg
  const gPerM3 = volumeM3 > 0 ? (totalKg * 1000) / volumeM3 : 0

  // Toxicity
  const nh3Frac = nh3Fraction(tempC, ph)
  const nh3MgL = tanMgL * nh3Frac

  const tanRisk = classifyTan(tanMgL)
  const nh3Risk = classifyNH3(nh3MgL)
  const overall = overallRisk(tanRisk, nh3Risk)

  const schedule = buildSchedule(totalKg, source.name, overall)
  const dailyCostUsd = totalKg * pricePerKg

  return { maintenanceKg, correctionKg, totalKg, gPerM3, nh3MgL, tanRisk, nh3Risk, overall, schedule, dailyCostUsd }
}

// ── UI helpers ───────────────────────────────────────────────────────────────

const RISK_COLOUR: Record<RiskLevel, string> = {
  SAFE:     'text-green-400',
  MODERATE: 'text-[var(--color-gold)]',
  ELEVATED: 'text-amber-400',
  HIGH:     'text-orange-400',
  CRITICAL: 'text-red-400',
}

const RISK_BORDER: Record<RiskLevel, string> = {
  SAFE:     'border-green-500/30',
  MODERATE: 'border-[var(--color-gold-muted)]',
  ELEVATED: 'border-amber-500/40',
  HIGH:     'border-orange-500/40',
  CRITICAL: 'border-red-500/40',
}

// ── Component ────────────────────────────────────────────────────────────────

export function BioflocCalculator() {
  const capturedEmail = useEmailGateCapture()
  const [volumeM3, setVolumeM3] = useState(1000)
  const [feedKg, setFeedKg]     = useState(20)
  const [proteinPct, setProteinPct] = useState(35)
  const [tanMgL, setTanMgL]     = useState(0.5)
  const [ph, setPh]             = useState(7.8)
  const [tempC, setTempC]       = useState(28.0)
  const [sourceKey, setSourceKey] = useState<SourceKey>('molasses')
  const [targetCN, setTargetCN] = useState(15)
  const [pricePerKg, setPricePerKg] = useState(0.50)

  const result = calculate({ volumeM3, feedKg, proteinPct, tanMgL, ph, tempC, sourceKey, targetCN, pricePerKg })

  const phWarning = ph < 7.2 || ph > 8.5
  const tempWarning = tempC > 32

  return (
    <div className="space-y-8">

      {/* Inputs */}
      <div className="no-print grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left: water + feeding */}
        <div className="space-y-5">
          <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold)] font-semibold">
            Pond Parameters
          </p>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] font-semibold">
                Pond Volume (m³)
              </label>
              <span className="font-serif text-sm text-[var(--color-gold)]">{volumeM3.toLocaleString()} m³</span>
            </div>
            <input type="range" min={100} max={10_000} step={100} value={volumeM3}
              onChange={e => setVolumeM3(Number(e.target.value))}
              className="w-full accent-[var(--color-gold)]" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] font-semibold">
                Daily Feed (kg)
              </label>
              <span className="font-serif text-sm text-[var(--color-gold)]">{feedKg} kg</span>
            </div>
            <input type="range" min={1} max={500} step={1} value={feedKg}
              onChange={e => setFeedKg(Number(e.target.value))}
              className="w-full accent-[var(--color-gold)]" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] font-semibold">
                Feed Protein %
              </label>
              <span className="font-serif text-sm text-[var(--color-gold)]">{proteinPct}%</span>
            </div>
            <input type="range" min={20} max={55} step={1} value={proteinPct}
              onChange={e => setProteinPct(Number(e.target.value))}
              className="w-full accent-[var(--color-gold)]" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] font-semibold">
                Current TAN (mg/L)
              </label>
              <span className={`font-serif text-sm ${RISK_COLOUR[result.tanRisk]}`}>{tanMgL.toFixed(1)} mg/L</span>
            </div>
            <input type="range" min={0} max={8} step={0.1} value={tanMgL}
              onChange={e => setTanMgL(Number(e.target.value))}
              className="w-full accent-[var(--color-gold)]" />
            <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Safe threshold: &lt; 1.0 mg/L</p>
          </div>
        </div>

        {/* Right: water quality + carbon source */}
        <div className="space-y-5">
          <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold)] font-semibold">
            Water Quality &amp; Carbon Source
          </p>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] font-semibold">
                pH
              </label>
              <span className={`font-serif text-sm ${phWarning ? 'text-amber-400' : 'text-[var(--color-gold)]'}`}>{ph.toFixed(1)}</span>
            </div>
            <input type="range" min={6.5} max={9.5} step={0.1} value={ph}
              onChange={e => setPh(Number(e.target.value))}
              className="w-full accent-[var(--color-gold)]" />
            <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Optimal: 7.5–8.2</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] font-semibold">
                Water Temperature (°C)
              </label>
              <span className={`font-serif text-sm ${tempWarning ? 'text-amber-400' : 'text-[var(--color-gold)]'}`}>{tempC.toFixed(1)}°C</span>
            </div>
            <input type="range" min={18} max={36} step={0.5} value={tempC}
              onChange={e => setTempC(Number(e.target.value))}
              className="w-full accent-[var(--color-gold)]" />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-3 font-semibold">
              Carbon Source
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(CARBON_SOURCES) as [SourceKey, typeof CARBON_SOURCES[SourceKey]][]).map(([k, s]) => (
                <button
                  key={k}
                  onClick={() => setSourceKey(k)}
                  className={`py-2 px-3 text-xs font-semibold rounded-sm border transition-all text-left ${
                    sourceKey === k
                      ? 'bg-[var(--color-gold-cta)] text-[var(--color-navy)] border-[var(--color-gold-cta)]'
                      : 'border-[var(--color-gold-muted)] text-[var(--color-text-muted)] hover:border-[var(--color-gold)]'
                  }`}
                >
                  <span className="block">{s.name}</span>
                  <span className="text-[9px] opacity-70">{Math.round(s.carbonFraction * 100)}% C · {s.speed}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] font-semibold">
                  Target C:N
                </label>
                <span className="font-serif text-sm text-[var(--color-gold)]">{targetCN}:1</span>
              </div>
              <input type="range" min={10} max={20} step={1} value={targetCN}
                onChange={e => setTargetCN(Number(e.target.value))}
                className="w-full accent-[var(--color-gold)]" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] font-semibold">
                  Price $/kg
                </label>
                <span className="font-serif text-sm text-[var(--color-gold)]">${pricePerKg.toFixed(2)}</span>
              </div>
              <input type="range" min={0.1} max={2.0} step={0.05} value={pricePerKg}
                onChange={e => setPricePerKg(Number(e.target.value))}
                className="w-full accent-[var(--color-gold)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Result card */}
      <motion.div
        key={`${result.totalKg.toFixed(2)}-${result.overall}`}
        initial={{ opacity: 0.6, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.18 }}
        className={`no-print rounded-sm border bg-[var(--color-navy)] p-8 ${RISK_BORDER[result.overall]}`}
      >
        {/* Risk badge */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)]">System Risk Level</p>
          <span className={`text-xs font-bold tracking-widest uppercase ${RISK_COLOUR[result.overall]}`}>
            {result.overall}
          </span>
        </div>

        {/* Primary metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div>
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-2">Carbon to Add Today</p>
            <p className="font-serif text-4xl text-[var(--color-gold-cta)]">
              {result.totalKg.toFixed(2)}
              <span className="text-base text-[var(--color-text-muted-dark)] ml-1">kg</span>
            </p>
            <p className="text-[10px] text-[var(--color-text-muted-dark)] mt-1">
              {result.gPerM3.toFixed(1)} g/m³ · {CARBON_SOURCES[sourceKey].name}
            </p>
          </div>
          <div>
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-2">Free NH₃</p>
            <p className={`font-serif text-3xl ${RISK_COLOUR[result.nh3Risk]}`}>
              {result.nh3MgL.toFixed(3)}
              <span className="text-sm text-[var(--color-text-muted-dark)] ml-1">mg/L</span>
            </p>
            <p className="text-[10px] text-[var(--color-text-muted-dark)] mt-1">Safe: &lt; 0.05 mg/L</p>
          </div>
          <div>
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-2">Daily Cost Est.</p>
            <p className="font-serif text-3xl text-[var(--color-text-on-dark)]">
              ${result.dailyCostUsd.toFixed(2)}
            </p>
            <p className="text-[10px] text-[var(--color-text-muted-dark)] mt-1">
              Maintenance {result.maintenanceKg.toFixed(2)} kg + Correction {result.correctionKg.toFixed(2)} kg
            </p>
          </div>
        </div>

        {/* Application schedule */}
        <div className="border-t border-[rgba(255,255,255,0.08)] pt-6">
          <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-4">
            Application Schedule
          </p>
          <div className="space-y-2">
            {result.schedule.map((line, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold-cta)] shrink-0" />
                <span className="text-[var(--color-text-on-dark)] font-mono text-xs">{line}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <p className="no-print text-[10px] text-[var(--color-text-muted)] leading-relaxed">
        Based on Avnimelech (1999), Boyd &amp; Tucker (2014), and Ebeling et al. (2006). NH₃ fraction uses Emerson et al. (1975) corrected for salinity (25 ppt default). For full water quality tracking, farm records, and daily dose history, the complete Biofloc Calculator is available in the shop.
      </p>

      <ReportExport
        toolName="Biofloc C:N Calculator"
        source="biofloc-calculator"
        capturedEmail={capturedEmail}
        inputs={[
          { label: 'Pond Volume', value: `${volumeM3.toLocaleString()} m³` },
          { label: 'Daily Feed', value: `${feedKg} kg` },
          { label: 'Feed Protein', value: `${proteinPct}%` },
          { label: 'Current TAN', value: `${tanMgL.toFixed(1)} mg/L` },
          { label: 'pH', value: ph.toFixed(1) },
          { label: 'Water Temperature', value: `${tempC.toFixed(1)}°C` },
          { label: 'Carbon Source', value: CARBON_SOURCES[sourceKey].name },
          { label: 'Target C:N', value: `${targetCN}:1` },
          { label: 'Carbon Price', value: `$${pricePerKg.toFixed(2)}/kg` },
        ]}
        results={[
          { label: 'Carbon to Add Today', value: `${result.totalKg.toFixed(2)} kg (${result.gPerM3.toFixed(1)} g/m³)` },
          { label: 'System Risk Level', value: result.overall },
          { label: 'Free NH₃', value: `${result.nh3MgL.toFixed(3)} mg/L` },
          { label: 'Daily Cost Estimate', value: `$${result.dailyCostUsd.toFixed(2)}` },
          { label: 'Application Schedule', value: result.schedule.join(' · ') },
        ]}
      />
    </div>
  )
}
