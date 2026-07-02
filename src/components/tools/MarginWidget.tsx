import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useEmailGateCapture } from './EmailGate'
import { ReportExport } from './ReportExport'

function useCounter(target: number) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const start = display
    if (start === target) return
    const t0 = performance.now()
    const run = (now: number) => {
      const p = Math.min((now - t0) / 800, 1)
      setDisplay(Math.floor(start + (target - start) * (p * (2 - p))))
      if (p < 1) requestAnimationFrame(run)
    }
    requestAnimationFrame(run)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])
  return display
}

interface Props {
  showReport?: boolean
}

export function MarginWidget({ showReport = false }: Props) {
  const { t } = useTranslation()
  const capturedEmail = useEmailGateCapture()
  const [revenue, setRevenue] = useState(1_000_000)
  const [fcr, setFcr] = useState(1.8)
  const [survival, setSurvival] = useState(72)

  const feedCost = revenue * 0.8 * 0.6
  const targetFcr = Math.max(1.2, fcr - 0.2)
  const fcrSavings = feedCost - feedCost * (targetFcr / fcr)

  const survivalBenchmark = 78
  const survivalGain = Math.max(0, survivalBenchmark - survival)
  const survivalSavings = survival < survivalBenchmark
    ? revenue * (survivalGain / 100) * 0.65
    : 0

  const totalSavings = Math.round(fcrSavings + survivalSavings)
  const displayTotal = useCounter(totalSavings)
  const displayFcr = useCounter(Math.round(fcrSavings))
  const displaySrv = useCounter(Math.round(survivalSavings))

  return (
    <div className="space-y-6">
      <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
        <div className="space-y-7">
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-3 font-semibold">
              {t('tools.annualRevenue')}
            </label>
            <input type="range" min={100_000} max={5_000_000} step={100_000} value={revenue}
              onChange={e => setRevenue(Number(e.target.value))}
              className="w-full accent-[var(--color-gold)]" />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-[var(--color-text-on-dark)] font-serif">${revenue.toLocaleString()}</span>
              <span className="text-[10px] text-[var(--color-text-muted-dark)]">$5M</span>
            </div>
          </div>
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-3 font-semibold">
              Current FCR
            </label>
            <input type="range" min={1.2} max={2.5} step={0.1} value={fcr}
              onChange={e => setFcr(Number(e.target.value))}
              className="w-full accent-[var(--color-gold)]" />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-[var(--color-text-on-dark)] font-serif">{fcr.toFixed(1)}</span>
              <span className="text-[10px] text-[var(--color-text-muted-dark)]">{t('tools.medianBenchmark165')}</span>
            </div>
          </div>
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-3 font-semibold">
              {t('tools.currentSurvival')}
            </label>
            <input type="range" min={30} max={98} step={1} value={survival}
              onChange={e => setSurvival(Number(e.target.value))}
              className="w-full accent-[var(--color-gold)]" />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-[var(--color-text-on-dark)] font-serif">{survival}%</span>
              <span className="text-[10px] text-[var(--color-text-muted-dark)]">{t('tools.medianBenchmark78')}</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="text-center p-8 bg-[var(--color-surface)] rounded-sm border border-[var(--color-gold-cta)]">
            <p className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-2">{t('tools.totalPotentialRecovery')}</p>
            <p className="font-serif text-5xl text-[var(--color-gold)] mb-3">${displayTotal.toLocaleString()}</p>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              {t('tools.fcrSurvivalNote')}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-[var(--color-surface)] rounded-sm border border-[var(--color-gold-muted)] text-center">
              <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold)] mb-1">FCR gain</p>
              <p className="font-serif text-xl text-[var(--color-text)]">${displayFcr.toLocaleString()}</p>
              <p className="text-[9px] text-[var(--color-text-muted)] mt-1">→ target FCR {targetFcr.toFixed(1)}</p>
            </div>
            <div className="p-4 bg-[var(--color-surface)] rounded-sm border border-[var(--color-gold-muted)] text-center">
              <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold)] mb-1">Survival gain</p>
              <p className="font-serif text-xl text-[var(--color-text)]">${displaySrv.toLocaleString()}</p>
              <p className="text-[9px] text-[var(--color-text-muted)] mt-1">→ target 78%</p>
            </div>
          </div>
        </div>
      </div>

      {showReport && (
        <ReportExport
          toolName="Margin Recovery Calculator"
          source="margin-recovery"
          capturedEmail={capturedEmail}
          inputs={[
            { label: 'Annual Revenue', value: `$${revenue.toLocaleString()}` },
            { label: 'Current FCR', value: fcr.toFixed(1) },
            { label: 'Current Survival', value: `${survival}%` },
          ]}
          results={[
            { label: 'Total Potential Recovery', value: `$${totalSavings.toLocaleString()}` },
            { label: 'FCR Gain', value: `$${Math.round(fcrSavings).toLocaleString()} (target FCR ${targetFcr.toFixed(1)})` },
            { label: 'Survival Gain', value: `$${Math.round(survivalSavings).toLocaleString()} (target 78%)` },
          ]}
        />
      )}
    </div>
  )
}
