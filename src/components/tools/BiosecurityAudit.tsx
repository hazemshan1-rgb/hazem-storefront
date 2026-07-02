import { useState } from 'react'
import { useEmailGateCapture } from './EmailGate'
import { ReportExport } from './ReportExport'

type Category = 'vector' | 'pathogen' | 'pcr' | 'sanitation' | 'feed' | 'waste'

interface Checkpoint {
  id: string
  category: Category
  title: string
  desc: string
  weight: number
  critical: boolean
}

// 20 checkpoints across 6 categories — standard shrimp biosecurity practice
const CHECKPOINTS: Checkpoint[] = [
  // Vector & Physical Exclusion (weight 15)
  { id: 'v-1', category: 'vector', title: 'Peripheral Solid Crab Fence', desc: 'Rigid plastic/sheet fence height ≥80cm pinned into soil along pond berm margins to prevent carrier crabs.', weight: 4, critical: true },
  { id: 'v-2', category: 'vector', title: 'Overhead Air Bird Netting', desc: 'Active polymer lines spaced under 1.5m to block seabird dives and direct diseased-animal drops.', weight: 3, critical: false },
  { id: 'v-3', category: 'vector', title: 'Rodent & Pest Bait Stations', desc: 'Numbered, weatherproof bait traps placed along service borders to deny vector mammals access.', weight: 3, critical: false },
  { id: 'v-4', category: 'vector', title: 'Feral Animal Total Exclusion', desc: 'Permanent double-gate configuration restricting entrance of feral dogs, cats, or grazing livestock.', weight: 5, critical: true },

  // Pathogen & Water Biosafety (weight 20)
  { id: 'p-1', category: 'pathogen', title: 'Inlet Double-Mesh Filter Socks', desc: '<250 micron filtration screens installed on feed canals to prevent wild shrimp larvae entry.', weight: 5, critical: true },
  { id: 'p-2', category: 'pathogen', title: 'Pre-Conditioning Reservoir Zone', desc: 'Compulsory aging basin of at least 72 hours for chemical degradation before pond distribution.', weight: 5, critical: false },
  { id: 'p-3', category: 'pathogen', title: 'Active Oxidant Bio-Elimination', desc: 'Disinfection using Chlorine Dioxide (>30ppm) or active Virkon testing to destroy remaining pathogens.', weight: 5, critical: true },
  { id: 'p-4', category: 'pathogen', title: 'Beneficial Microbial Exclusion (Probiotics)', desc: 'Inoculation of feed water with dense Bacillus subtilis strains to out-compete pathogenic Vibrio species.', weight: 5, critical: false },

  // Supplier Stocking PCR Integrity (weight 25)
  { id: 'pcr-1', category: 'pcr', title: 'WSSV Negativity Certification', desc: 'Certified negative PCR lab batch clearance for White Spot Syndrome Virus before hatchery intake.', weight: 7, critical: true },
  { id: 'pcr-2', category: 'pcr', title: 'EHP Microsporidian PCR Assay', desc: 'Batch tested clear of Enterocytozoon hepatopenaei spore sequences to prevent severe stunting.', weight: 6, critical: true },
  { id: 'pcr-3', category: 'pcr', title: 'SPF Broodstock Verification', desc: 'Verification that brood parent lines originate from a certified SPF (Specific Pathogen Free) facility.', weight: 6, critical: false },
  { id: 'pcr-4', category: 'pcr', title: 'Hatchery Seed ID Batch Record', desc: 'Immutable tracing ID mapped from breeding larvae through transport tags for batch validation.', weight: 6, critical: false },

  // Employee & Operational Sanitation (weight 15)
  { id: 's-1', category: 'sanitation', title: 'Active Entrance Tire-Bath', desc: 'Chlorinated dips at central vehicle checkpoints limiting pathogen transport on rubber tires.', weight: 3, critical: false },
  { id: 's-2', category: 'sanitation', title: 'Disinfecting Boot Baths', desc: 'Active iodine/chlorine trays at all pond gate transitions with mandatory worker clearance steps.', weight: 4, critical: true },
  { id: 's-3', category: 'sanitation', title: 'Alcohol Hand-Hygiene Trays', desc: 'Wall dispensers installed adjacent to feed warehouses and automatic feeding panels.', weight: 3, critical: false },
  { id: 's-4', category: 'sanitation', title: 'Pond-Dedicated Equipment Grid', desc: 'Complete colour-coding for nets, baskets, and secchi disks to ensure zero vector crossover.', weight: 5, critical: true },

  // Feed & Ice Auditing (weight 15)
  { id: 'f-1', category: 'feed', title: 'Heavy Metal Feed Clearance', desc: 'Feed test sheets showing concentration ratios under WHO limits for cadmium, lead, and mercury.', weight: 4, critical: false },
  { id: 'f-2', category: 'feed', title: 'Antibiotic Residue-Free Pledge', desc: 'Zero-chloramphenicol and nitrofurans certificate audited on feed production lots.', weight: 6, critical: true },
  { id: 'f-3', category: 'feed', title: 'Certified Flake Ice Source', desc: 'Approved potable food-grade ice supply verified free from fecal vibrios for post-harvest transport.', weight: 5, critical: true },

  // Waste Management & Sewage Outflow (weight 10)
  { id: 'w-1', category: 'waste', title: 'Sediment Retention Sludge Basin', desc: 'Excavated gravity separator handling sludge blow-outs to prevent direct wild-river loading.', weight: 5, critical: false },
  { id: 'w-2', category: 'waste', title: 'Mangrove Zone / Polishing Wetland', desc: 'Biological swamp filtering final effluent nitrate-phosphate indexes before coastal exit.', weight: 5, critical: false },
]

const CATEGORY_ORDER: Category[] = ['vector', 'pathogen', 'pcr', 'sanitation', 'feed', 'waste']

const CATEGORY_META: Record<Category, { name: string }> = {
  vector: { name: 'Vector & Animal Exclusion Barriers' },
  pathogen: { name: 'Pathogen Disinfection & Water Bio-Filters' },
  pcr: { name: 'Hatchery Seed PCR & Lineage Credentials' },
  sanitation: { name: 'Employee & Machinery Sanitation' },
  feed: { name: 'Feed, Residue & Transport Ice Safety' },
  waste: { name: 'Waste-Water & Seepage Containment' },
}

const MAX_WEIGHT = CHECKPOINTS.reduce((sum, cp) => sum + cp.weight, 0)

export function BiosecurityAudit() {
  const capturedEmail = useEmailGateCapture()
  const [passed, setPassed] = useState<Record<string, boolean>>({})
  const [collapsed, setCollapsed] = useState<Record<Category, boolean>>({
    vector: false, pathogen: false, pcr: false, sanitation: false, feed: false, waste: false,
  })
  const [inspectorName, setInspectorName] = useState('')
  const [auditNote, setAuditNote] = useState('')

  function toggleCheckpoint(id: string) {
    setPassed(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function markAllPassed() {
    const all: Record<string, boolean> = {}
    CHECKPOINTS.forEach(cp => { all[cp.id] = true })
    setPassed(all)
  }

  function resetAll() {
    setPassed({})
  }

  function toggleCategory(cat: Category) {
    setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  const pointsPassed = CHECKPOINTS.reduce((sum, cp) => sum + (passed[cp.id] ? cp.weight : 0), 0)
  const score = Math.round((pointsPassed / MAX_WEIGHT) * 100)
  const criticalFailures = CHECKPOINTS.filter(cp => cp.critical && !passed[cp.id])
  const hasCriticalGap = criticalFailures.length > 0

  const tier = hasCriticalGap
    ? 'Critical gaps present'
    : score >= 85 ? 'Strong — export-ready posture'
    : score >= 60 ? 'Adequate — domestic-market posture'
    : 'Needs improvement'

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl text-[var(--color-text)]">Biosecurity Barrier Checklist</h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Check each control your farm actually has in place. Critical controls are marked — failing one caps your score regardless of the rest.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={markAllPassed}
            className="text-[10px] tracking-widest uppercase font-semibold text-[var(--color-gold)] border border-[var(--color-gold-muted)] px-3 py-2 rounded-sm hover:border-[var(--color-gold)] transition-all">
            Mark All Passed
          </button>
          <button type="button" onClick={resetAll}
            className="text-[10px] tracking-widest uppercase font-semibold text-[var(--color-text-muted)] border border-[var(--color-gold-muted)] px-3 py-2 rounded-sm hover:border-[var(--color-gold)] transition-all">
            Reset
          </button>
        </div>
      </div>

      {/* Score panel */}
      <div className={`no-print rounded-sm border p-6 ${hasCriticalGap ? 'border-red-500/40 bg-red-950/20' : 'border-[var(--color-gold-cta)] bg-[var(--color-navy)]'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-2">Biosecurity Score</p>
            <p className={`font-serif text-5xl ${hasCriticalGap ? 'text-red-400' : 'text-[var(--color-gold-cta)]'}`}>{score}<span className="text-lg text-[var(--color-text-muted-dark)] ml-1">%</span></p>
            <p className="text-[10px] text-[var(--color-text-muted-dark)] mt-1">{pointsPassed} of {MAX_WEIGHT} weighted points</p>
          </div>
          <div>
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-2">Self-Assessment Tier</p>
            <p className="text-sm font-semibold text-[var(--color-text-on-dark)] leading-snug">{tier}</p>
          </div>
          <div>
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted-dark)] mb-2">Critical Failures</p>
            <p className={`font-serif text-3xl ${hasCriticalGap ? 'text-red-400' : 'text-green-400'}`}>{criticalFailures.length}</p>
            {hasCriticalGap && <p className="text-[10px] text-red-400 mt-1">A single critical failure means pathogens can breach stock easily — fix these first.</p>}
          </div>
        </div>
      </div>

      {/* Checklist by category */}
      <div className="space-y-3">
        {CATEGORY_ORDER.map(cat => {
          const meta = CATEGORY_META[cat]
          const group = CHECKPOINTS.filter(cp => cp.category === cat)
          const isCollapsed = collapsed[cat]
          const passedCount = group.filter(cp => passed[cp.id]).length

          return (
            <div key={cat} className="no-print bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm overflow-hidden">
              <button type="button" onClick={() => toggleCategory(cat)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--color-surface-2)] transition-colors">
                <div>
                  <span className="text-[9px] tracking-widest uppercase font-semibold text-[var(--color-gold)]">{cat}</span>
                  <h3 className="text-xs font-bold text-[var(--color-text)] mt-0.5">{meta.name}</h3>
                </div>
                <span className="text-[10px] font-mono text-[var(--color-text-muted)] shrink-0 ml-3">{passedCount}/{group.length} passed</span>
              </button>

              {!isCollapsed && (
                <div className="divide-y divide-[var(--color-gold-muted)]/40 border-t border-[var(--color-gold-muted)]">
                  {group.map(cp => {
                    const isPassed = Boolean(passed[cp.id])
                    return (
                      <div key={cp.id} onClick={() => toggleCheckpoint(cp.id)}
                        className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${isPassed ? 'hover:bg-[var(--color-surface-2)]' : cp.critical ? 'bg-red-500/5 hover:bg-red-500/10' : 'hover:bg-[var(--color-surface-2)]'}`}>
                        <div className={`w-5 h-5 rounded-sm flex items-center justify-center border shrink-0 mt-0.5 ${
                          isPassed ? 'bg-green-500 border-green-600 text-white' : cp.critical ? 'bg-transparent border-red-400' : 'bg-transparent border-[var(--color-gold-muted)]'
                        }`}>
                          {isPassed && <span className="text-xs leading-none">✓</span>}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className={`text-xs font-bold ${isPassed ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}>{cp.title}</span>
                            <span className="text-[9px] font-mono text-[var(--color-text-muted)]">{cp.weight}pt</span>
                            {cp.critical && (
                              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm ${isPassed ? 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]' : 'bg-red-500/10 text-red-500'}`}>
                                Critical
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{cp.desc}</p>
                        </div>
                        <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                          isPassed ? 'bg-green-500/10 text-green-500' : cp.critical ? 'bg-red-500/10 text-red-500' : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'
                        }`}>
                          {isPassed ? 'Pass' : cp.critical ? 'Hazard' : 'Not yet'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Optional audit record fields */}
      <div className="no-print bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6">
        <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold)] font-semibold mb-1">Optional — For Your Own Records</p>
        <p className="text-[10px] text-[var(--color-text-muted)] mb-4">This is a self-assessment, not a third-party certification. If you had someone walk the farm with you, note it here.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-2 font-semibold">Assessed By</label>
            <input type="text" value={inspectorName} onChange={e => setInspectorName(e.target.value)} placeholder="Your name or manager's name"
              className="w-full bg-[var(--color-surface-2)] border border-[var(--color-gold-muted)] text-[var(--color-text)] px-3 py-2.5 text-sm rounded-sm focus:outline-none focus:border-[var(--color-gold)]" />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-2 font-semibold">Notes</label>
            <input type="text" value={auditNote} onChange={e => setAuditNote(e.target.value)} placeholder="Optional context"
              className="w-full bg-[var(--color-surface-2)] border border-[var(--color-gold-muted)] text-[var(--color-text)] px-3 py-2.5 text-sm rounded-sm focus:outline-none focus:border-[var(--color-gold)]" />
          </div>
        </div>
      </div>

      <p className="no-print text-[10px] text-[var(--color-text-muted)] leading-relaxed">
        Export processors and premium buyers generally weigh verified biosecurity practices — traceable PCR-clear seed, zero antibiotic residue, controlled cold-chain — when evaluating supply contracts. This checklist tells you where your own gaps are; it is not an issued certificate. For third-party certification, work with an accredited inspection body directly.
      </p>

      <ReportExport
        toolName="Biosecurity Audit"
        source="biosecurity-audit"
        capturedEmail={capturedEmail}
        inputs={[
          ...(inspectorName ? [{ label: 'Assessed By', value: inspectorName }] : []),
          ...(auditNote ? [{ label: 'Notes', value: auditNote }] : []),
          { label: 'Checkpoints Reviewed', value: `${pointsPassed} of ${MAX_WEIGHT} weighted points passed` },
        ]}
        results={[
          { label: 'Biosecurity Score', value: `${score}%` },
          { label: 'Self-Assessment Tier', value: tier },
          { label: 'Critical Failures', value: criticalFailures.length > 0 ? criticalFailures.map(c => c.title).join('; ') : 'None' },
          ...CATEGORY_ORDER.map(cat => {
            const group = CHECKPOINTS.filter(cp => cp.category === cat)
            const passedCount = group.filter(cp => passed[cp.id]).length
            return { label: CATEGORY_META[cat].name, value: `${passedCount}/${group.length} passed` }
          }),
        ]}
      />
    </div>
  )
}
