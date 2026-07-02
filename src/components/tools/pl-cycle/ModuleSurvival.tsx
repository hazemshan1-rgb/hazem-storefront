import { useState, useEffect } from 'react'
import { NumInput, StatusBadge, fmt, type Status } from './shared'

interface Sample { day: number; count: number; cast: number }

const EXPECTED_CURVE = [92, 85, 80, 75]

export function ModuleSurvival({ onChange }: { onChange: (status: Status | null) => void }) {
  const [stocked, setStocked] = useState(100_000)
  const [samples, setSamples] = useState<Sample[]>([
    { day: 7, count: 0, cast: 0 },
    { day: 14, count: 0, cast: 0 },
    { day: 21, count: 0, cast: 0 },
    { day: 30, count: 0, cast: 0 },
  ])
  const [doLow, setDoLow] = useState(false)
  const [salinitySpike, setSalinitySpike] = useState(false)
  const [tempStress, setTempStress] = useState(false)

  function updateSample(i: number, field: 'count' | 'cast', val: number) {
    setSamples(s => s.map((r, j) => (j === i ? { ...r, [field]: val } : r)))
  }

  const rows = samples.map((r, i) => {
    const hasSurvival = r.count > 0 && r.cast > 0
    const estPop = r.cast > 0 ? Math.round((r.count / r.cast) * stocked) : null
    const survivalPct = estPop !== null ? (estPop / stocked) * 100 : null
    const expected = EXPECTED_CURVE[i]
    const deviation = survivalPct !== null ? survivalPct - expected : null
    const status: Status | null = !hasSurvival || deviation === null
      ? null
      : deviation >= -5 ? 'GREEN' : deviation >= -15 ? 'YELLOW' : 'RED'
    return { ...r, estPop, survivalPct, expected, deviation, status }
  })

  const latestRed = [...rows].reverse().find(r => r.status === 'RED')
  const waterIssue = doLow || salinitySpike || tempStress
  const cause = latestRed ? (waterIssue ? 'ENVIRONMENTAL' : 'PATHOGENIC (probable)') : null
  const intervention = !latestRed
    ? []
    : waterIssue
    ? [
        doLow && 'Increase aeration / paddlewheel hours',
        salinitySpike && 'Dilute pond with freshwater',
        tempStress && 'Adjust stocking time to cooler hours',
      ].filter((x): x is string => Boolean(x))
    : [
        'Check feed tray — check feed consumption rate',
        'Run PCR / pathogen screen on pond water sample',
        'Apply probiotics — Bacillus species recommended',
        'Reduce feeding rate 20% and observe 48 hrs',
      ]

  const overallStatus: Status | null = latestRed ? 'RED' : rows.some(r => r.status === 'YELLOW') ? 'YELLOW' : rows.some(r => r.status === 'GREEN') ? 'GREEN' : null

  useEffect(() => { onChange(overallStatus) }, [overallStatus])

  return (
    <div className="space-y-6">
      <div className="no-print bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6">
        <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold)] font-semibold mb-4">Stocking Baseline</p>
        <NumInput label="Total PL Stocked" value={stocked} onChange={setStocked} min={1000} max={5_000_000} step={1000} />
      </div>

      <div className="no-print bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6">
        <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold)] font-semibold mb-4">Cast Net Samples (enter count per cast)</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[var(--color-text-muted)] text-[10px] uppercase tracking-wide border-b border-[var(--color-gold-muted)]">
                <th className="py-2 text-left">Day</th>
                <th className="py-2">Shrimp/Cast</th>
                <th className="py-2">Casts</th>
                <th className="py-2">Est. Pop</th>
                <th className="py-2">Survival %</th>
                <th className="py-2">Expected %</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.day} className="border-b border-[var(--color-gold-muted)]/40">
                  <td className="py-2 text-[var(--color-text)] font-bold">D{r.day}</td>
                  <td className="py-1.5 px-1">
                    <input type="number" min={0} max={500} step={1} value={r.count}
                      onChange={e => updateSample(i, 'count', parseInt(e.target.value) || 0)}
                      className="w-16 text-center bg-[var(--color-surface-2)] border border-[var(--color-gold-muted)] rounded-sm py-1 text-[var(--color-text)]" />
                  </td>
                  <td className="py-1.5 px-1">
                    <input type="number" min={0} max={50} step={1} value={r.cast}
                      onChange={e => updateSample(i, 'cast', parseInt(e.target.value) || 0)}
                      className="w-14 text-center bg-[var(--color-surface-2)] border border-[var(--color-gold-muted)] rounded-sm py-1 text-[var(--color-text)]" />
                  </td>
                  <td className="py-2 text-center text-[var(--color-text)] font-semibold">{r.estPop !== null ? `${(r.estPop / 1000).toFixed(1)}K` : '—'}</td>
                  <td className="py-2 text-center text-[var(--color-text)] font-semibold">{r.survivalPct !== null ? `${fmt(r.survivalPct, 1)}%` : '—'}</td>
                  <td className="py-2 text-center text-[var(--color-text-muted)]">{r.expected}%</td>
                  <td className="py-2 text-center">
                    {r.status ? <StatusBadge status={r.status} label={r.status} /> : <span className="text-[var(--color-text-muted)] text-[10px]">No data</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {latestRed && (
        <div className="no-print bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6">
          <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold)] font-semibold mb-4">Water Quality Context (for cause classification)</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {([
              ['DO drop detected (<5.5 ppm)', doLow, setDoLow],
              ['Salinity spike (>5 ppt change)', salinitySpike, setSalinitySpike],
              ['Temperature stress (>33°C)', tempStress, setTempStress],
            ] as const).map(([label, v, fn]) => (
              <button key={label} type="button" onClick={() => fn(!v)}
                className={`rounded-sm p-3 text-xs font-semibold text-left border transition-all ${v ? 'text-red-400 border-red-500/40 bg-red-950/20' : 'bg-[var(--color-surface-2)] border-[var(--color-gold-muted)] text-[var(--color-text-muted)]'}`}>
                {v ? '✓ ' : '○ '}{label}
              </button>
            ))}
          </div>
        </div>
      )}

      {latestRed && (
        <div className="no-print bg-red-950/20 border border-red-500/40 rounded-sm p-6">
          <p className="text-[9px] tracking-widest uppercase text-red-400 font-semibold mb-3">🚨 Red Status — Intervention Required</p>
          <p className="text-xs mb-3">
            <span className="text-[var(--color-text-muted-dark)]">Classified cause: </span>
            <span className="font-bold text-red-400">{cause}</span>
          </p>
          <ul className="space-y-1.5">
            {intervention.map(item => (
              <li key={item} className="flex items-start gap-2 text-sm text-red-300">
                <span className="shrink-0 mt-0.5">→</span>{item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!latestRed && rows.some(r => r.status) && (
        <div className={`no-print rounded-sm p-6 border ${rows.some(r => r.status === 'YELLOW') ? 'bg-amber-950/20 border-amber-500/40' : 'bg-green-950/20 border-green-500/40'}`}>
          <p className={`font-bold ${rows.some(r => r.status === 'YELLOW') ? 'text-amber-400' : 'text-green-400'}`}>
            {rows.some(r => r.status === 'YELLOW') ? '⚡ Yellow — monitor closely' : '✅ Green — survival on track'}
          </p>
          {rows.some(r => r.status === 'YELLOW') && (
            <ul className="mt-3 space-y-1 text-sm text-amber-300">
              <li>→ Check feed tray intake vs. theoretical daily feed</li>
              <li>→ Increase cast net sampling to every 3 days</li>
              <li>→ Monitor early morning DO levels</li>
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
