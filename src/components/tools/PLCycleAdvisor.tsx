import { useState } from 'react'
import { useEmailGateCapture } from './EmailGate'
import { ReportExport } from './ReportExport'
import { fmt, type Status } from './pl-cycle/shared'
import { ModulePLQuality, type PLQualityResult } from './pl-cycle/ModulePLQuality'
import { ModuleStocking, type StockingResult } from './pl-cycle/ModuleStocking'
import { ModuleSurvival } from './pl-cycle/ModuleSurvival'
import { ModuleCost, type CostResult } from './pl-cycle/ModuleCost'
import { ModuleHarvest, type HarvestResult } from './pl-cycle/ModuleHarvest'

const TABS = [
  { id: 'pl', label: 'PL Quality' },
  { id: 'stock', label: 'Stocking' },
  { id: 'survival', label: 'Survival' },
  { id: 'cost', label: 'Cost/kg' },
  { id: 'harvest', label: 'Harvest' },
] as const

type TabId = typeof TABS[number]['id']

const STATUS_DOT: Record<Status, string> = {
  GREEN: 'bg-green-400',
  YELLOW: 'bg-amber-400',
  RED: 'bg-red-400',
}

export function PLCycleAdvisor() {
  const capturedEmail = useEmailGateCapture()
  const [activeTab, setActiveTab] = useState<TabId>('pl')

  const [plData, setPlData] = useState<PLQualityResult>({ status: 'YELLOW', baselineSurvival: 72, stage: 'PL12', score: 3 })
  const [stockData, setStockData] = useState<StockingResult>({ status: 'YELLOW', density: 80, pondSize: 5000, totalPL: 400_000 })
  const [survStatus, setSurvStatus] = useState<Status | null>(null)
  const [costData, setCostData] = useState<CostResult>({ costPerKg: 0, fcr: 0, totalCost: 0, margin: 0 })
  const [harvestData, setHarvestData] = useState<HarvestResult>({ status: 'YELLOW', currentValue: 0, projValue: 0, netGain: 0 })

  const moduleStatus: Record<TabId, Status | null> = {
    pl: plData.status,
    stock: stockData.status,
    survival: survStatus,
    cost: costData.fcr > 0 ? (costData.fcr <= 1.5 ? 'GREEN' : costData.fcr <= 1.8 ? 'YELLOW' : 'RED') : null,
    harvest: harvestData.status,
  }

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="no-print flex gap-2 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-sm border transition-all ${
              activeTab === t.id
                ? 'bg-[var(--color-gold-cta)] text-[var(--color-navy)] border-[var(--color-gold-cta)]'
                : 'border-[var(--color-gold-muted)] text-[var(--color-text-muted)] hover:border-[var(--color-gold)]'
            }`}
          >
            {moduleStatus[t.id] && (
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[moduleStatus[t.id] as Status]}`} />
            )}
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'pl' && <ModulePLQuality onChange={setPlData} />}
      {activeTab === 'stock' && <ModuleStocking onChange={setStockData} />}
      {activeTab === 'survival' && <ModuleSurvival onChange={setSurvStatus} />}
      {activeTab === 'cost' && <ModuleCost onChange={setCostData} />}
      {activeTab === 'harvest' && <ModuleHarvest onChange={setHarvestData} />}

      <p className="no-print text-[10px] text-[var(--color-text-muted)] leading-relaxed">
        Covers the full 30-day post-stocking window and beyond — PL quality gate, stocking safety, survival trajectory, running cost/kg, and harvest timing. Benchmarks: ADG 0.23–0.25 g/day, FCR 1.2–1.5, DO hard floor 5.5 ppm, 80% max carrying capacity. All calculations run in your browser — nothing is stored unless you request the report below.
      </p>

      <ReportExport
        toolName="PL Cycle Advisor"
        source="pl-cycle-advisor"
        capturedEmail={capturedEmail}
        inputs={[
          { label: 'PL Stage', value: plData.stage },
          { label: 'Pond Size', value: `${stockData.pondSize.toLocaleString()} m²` },
          { label: 'Stocking Density', value: `${stockData.density} PL/m²` },
          { label: 'Total PL', value: `${(stockData.totalPL / 1000).toFixed(1)}K` },
        ]}
        results={[
          { label: '1. PL Quality Gate', value: `${plData.status} — baseline survival ${plData.baselineSurvival}%` },
          { label: '2. Stocking Decision', value: `${stockData.status} — ${stockData.density} PL/m² at ${stockData.pondSize.toLocaleString()} m²` },
          { label: '3. Survival Trajectory', value: survStatus ?? 'No samples logged yet' },
          { label: '4. Cost / kg', value: costData.fcr > 0 ? `FCR ${fmt(costData.fcr, 2)} · $${fmt(costData.costPerKg, 2)}/kg · margin ${fmt(costData.margin, 2)}/kg` : 'Not calculated yet' },
          { label: '5. Harvest Decision', value: `${harvestData.status} — net gain $${fmt(harvestData.netGain, 0)}` },
        ]}
      />
    </div>
  )
}
