export type Status = 'GREEN' | 'YELLOW' | 'RED'

export const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v))

export function fmt(n: number, d = 2): string {
  return isNaN(n) || !isFinite(n) ? '—' : Number(n).toFixed(d)
}

const STATUS_COLOUR: Record<Status, string> = {
  GREEN: 'text-green-400 border-green-500/40 bg-green-950/20',
  YELLOW: 'text-amber-400 border-amber-500/40 bg-amber-950/20',
  RED: 'text-red-400 border-red-500/40 bg-red-950/20',
}

const STATUS_DOT: Record<Status, string> = {
  GREEN: 'bg-green-400',
  YELLOW: 'bg-amber-400',
  RED: 'bg-red-400',
}

export function StatusBadge({ status, label }: { status: Status; label: string }) {
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border text-xs font-bold uppercase tracking-widest ${STATUS_COLOUR[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {label}
    </span>
  )
}

// KPI is only ever rendered inside dark (--color-navy) result cards, so it
// uses the *-on-dark tokens — using --color-text here would be invisible
// (dark navy text on a dark navy background).
export function KPI({ label, value, unit, sub }: { label: string; value: string | number; unit?: string; sub?: string }) {
  return (
    <div className="bg-[rgba(255,255,255,0.04)] border border-[var(--color-gold-muted)] rounded-sm p-4">
      <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-1.5">{label}</p>
      <p className="font-serif text-2xl text-[var(--color-text-on-dark)]">
        {value}
        {unit && <span className="text-sm text-[var(--color-text-muted-dark)] ml-1">{unit}</span>}
      </p>
      {sub && <p className="text-[10px] text-[var(--color-text-muted-dark)] mt-1">{sub}</p>}
    </div>
  )
}

export function RangeInput({
  label, min, max, step, value, onChange, display,
}: {
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
  display?: string
}) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] font-semibold">{label}</label>
        <span className="font-serif text-sm text-[var(--color-gold)]">{display ?? value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-[var(--color-gold)]" />
    </div>
  )
}

export function NumInput({
  label, value, onChange, min = 0, max, step = 0.1, unit,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
}) {
  return (
    <div>
      <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-2 font-semibold">
        {label}{unit ? ` (${unit})` : ''}
      </label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        className="w-full bg-[var(--color-surface)] border border-[var(--color-gold-muted)] text-[var(--color-text)] px-3 py-2.5 text-sm rounded-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
      />
    </div>
  )
}

export function Bar({ pct, colour }: { pct: number; colour: 'green' | 'yellow' | 'red' }) {
  const bg = colour === 'green' ? 'bg-green-500' : colour === 'yellow' ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500 ${bg}`} style={{ width: `${clamp(pct, 0, 100)}%` }} />
    </div>
  )
}
