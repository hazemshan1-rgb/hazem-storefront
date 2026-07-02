import { useState, useEffect } from 'react'
import { RangeInput, KPI, StatusBadge, fmt, type Status } from './shared'

export interface PLQualityResult {
  status: Status
  baselineSurvival: number
  stage: string
  score: number
}

const STAGE_BASE: Record<string, number> = { PL10: 60, PL12: 70, PL15: 80 }
const STAGES = ['PL10', 'PL12', 'PL15'] as const

export function ModulePLQuality({ onChange }: { onChange: (r: PLQualityResult) => void }) {
  const [stage, setStage] = useState<typeof STAGES[number]>('PL12')
  const [stress, setStress] = useState(3)
  const [gut, setGut] = useState(3)
  const [supplier, setSupplier] = useState(3)

  const highRisk = stress < 3 || gut < 3
  const score = (stress + gut + supplier) / 3
  const status: Status = highRisk ? 'RED' : score >= 4 ? 'GREEN' : 'YELLOW'
  const rec = highRisk ? 'REJECT — Do not stock' : score >= 4 ? 'STOCK — Conditions excellent' : 'HOLD — Verify source before stocking'
  const baselineSurvival = highRisk ? 55 : score >= 4 ? 85 : 72
  const weekOneSurvival = Math.min(98, (STAGE_BASE[stage] ?? 70) + (score - 3) * 5)

  useEffect(() => { onChange({ status, baselineSurvival, stage, score }) }, [status, baselineSurvival, stage, score])

  return (
    <div className="space-y-6">
      <div className="no-print bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6">
        <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold)] font-semibold mb-4">PL Quality Inputs</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-2 font-semibold">PL Stage</label>
            <div className="flex gap-2">
              {STAGES.map(s => (
                <button key={s} type="button" onClick={() => setStage(s)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-sm border transition-all ${
                    stage === s
                      ? 'bg-[var(--color-gold-cta)] text-[var(--color-navy)] border-[var(--color-gold-cta)]'
                      : 'border-[var(--color-gold-muted)] text-[var(--color-text-muted)] hover:border-[var(--color-gold)]'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div />
          <RangeInput label="Stress Tolerance Score" min={1} max={5} step={1} value={stress} onChange={setStress} display={`${stress}/5`} />
          <RangeInput label="Gut Fullness Score" min={1} max={5} step={1} value={gut} onChange={setGut} display={`${gut}/5`} />
          <RangeInput label="Supplier History Rating" min={1} max={5} step={1} value={supplier} onChange={setSupplier} display={`${supplier}/5`} />
        </div>
      </div>

      {highRisk && (
        <div className="no-print border border-red-500/40 bg-red-950/20 rounded-sm p-4 text-sm font-semibold text-red-400">
          ⚠ High risk flag: {stress < 3 ? 'stress score below threshold. ' : ''}{gut < 3 ? 'Gut fullness below threshold.' : ''}
        </div>
      )}

      <div className="no-print bg-[var(--color-navy)] border border-[var(--color-gold-muted)] rounded-sm p-6">
        <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold-cta)] mb-4">Quality Gate Decision</p>
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <StatusBadge status={status} label={status} />
          <span className="text-sm font-semibold text-[var(--color-text-on-dark)]">{rec}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <KPI label="Quality Score" value={fmt(score, 1)} unit="/5" />
          <KPI label="Week-1 Survival" value={fmt(weekOneSurvival, 0)} unit="%" />
          <KPI label="Baseline Survival" value={baselineSurvival} unit="%" sub="Expected cycle" />
        </div>
      </div>
    </div>
  )
}
