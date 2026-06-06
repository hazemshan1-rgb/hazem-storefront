// Shrimp Profit Leak Diagnostic — data layer
// 8 scored categories, 34 questions, species-system weighted scoring

export type Species = 'vannamei' | 'monodon' | 'chinensis' | 'merguiensis'
export type System  = 'earthen_extensive' | 'earthen_semi' | 'lined_semi' | 'biofloc' | 'ras'

export interface ContextAnswers {
  species:    Species
  system:     System
  targetSize: string
}

export interface DiagnosticAnswers {
  [questionId: string]: string
}

export interface QuestionOption {
  value:     string
  label:     string
  score:     number   // 0–5: 0 = optimal, 5 = critical leak
  leakUsd:   number   // estimated annual dollar leak at this answer
}

export interface DiagnosticQuestion {
  id:          string
  category:    number
  question:    string
  subtext?:    string
  options:     QuestionOption[]
  getModifier: (species: Species, system: System) => number
}

export interface CategoryMeta {
  id:          number
  name:        string
  description: string
}

// ── Category metadata ─────────────────────────────────────────────────────────

export const CATEGORIES: CategoryMeta[] = [
  { id: 1, name: 'Feed Efficiency & FCR',           description: 'How efficiently your farm converts feed into harvestable biomass' },
  { id: 2, name: 'Survival & Disease Pressure',     description: 'Survival rates, disease events, and biosecurity discipline' },
  { id: 3, name: 'Water Quality Management',        description: 'Dissolved oxygen, ammonia, pH control, and monitoring frequency' },
  { id: 4, name: 'Stocking & Density Discipline',   description: 'Density planning, seasonal adjustment, and size uniformity' },
  { id: 5, name: 'Financial Visibility',            description: 'Cost tracking, breakeven awareness, and mortality accounting' },
  { id: 6, name: 'Operations & SOPs',               description: 'Standard procedures, response times, and night shift discipline' },
  { id: 7, name: 'Infrastructure & Aeration',       description: 'Aeration capacity, backup systems, liners, and sensor coverage' },
  { id: 8, name: 'Market Position & Revenue',       description: 'Sales channels, size premium, certification, and price risk management' },
]

// ── Context questions (Cat 0 — not scored, set SSM baseline) ─────────────────

export const CONTEXT_QUESTIONS = [
  {
    id: 'species',
    question: 'Which species do you primarily farm?',
    options: [
      { value: 'vannamei',   label: 'Penaeus vannamei — Pacific white shrimp' },
      { value: 'monodon',    label: 'Penaeus monodon — Giant tiger prawn' },
      { value: 'chinensis',  label: 'Penaeus chinensis — Chinese white shrimp' },
      { value: 'merguiensis',label: 'Penaeus merguiensis — Banana prawn' },
    ],
  },
  {
    id: 'system',
    question: 'What production system are you running?',
    options: [
      { value: 'earthen_extensive', label: 'Earthen Extensive — tidal exchange, <15 shrimp/m²' },
      { value: 'earthen_semi',      label: 'Earthen Semi-Intensive — paddlewheels, 15–40 shrimp/m²' },
      { value: 'lined_semi',        label: 'Lined Semi-Intensive — HDPE liner, 40–80 shrimp/m²' },
      { value: 'biofloc',           label: 'Biofloc Intensive — zero-exchange, 150–300 shrimp/m²' },
      { value: 'ras',               label: 'RAS Hyper-Intensive — full climate control, 300+ shrimp/m²' },
    ],
  },
  {
    id: 'targetSize',
    question: 'What is your target harvest size?',
    options: [
      { value: 'under_10g', label: 'Below 10g — cocktail size' },
      { value: '10_15g',    label: '10–15g — small retail' },
      { value: '15_20g',    label: '15–20g — standard market' },
      { value: '20_30g',    label: '20–30g — large' },
      { value: 'over_30g',  label: 'Above 30g — jumbo / head-on premium' },
    ],
  },
]

// ── Scored questions ──────────────────────────────────────────────────────────

export const QUESTIONS: DiagnosticQuestion[] = [

  // ── Category 1: Feed Efficiency & FCR ────────────────────────────────────

  {
    id: 'q1_1', category: 1,
    question: 'What is your average FCR (kg feed ÷ kg shrimp) over the last 3 cycles?',
    options: [
      { value: 'under_1_3', label: 'Below 1.3',  score: 0, leakUsd: 0 },
      { value: '1_3_1_5',   label: '1.3 – 1.5',  score: 1, leakUsd: 8000 },
      { value: '1_5_1_7',   label: '1.5 – 1.7',  score: 2, leakUsd: 24000 },
      { value: '1_7_2_0',   label: '1.7 – 2.0',  score: 3, leakUsd: 48000 },
      { value: '2_0_2_5',   label: '2.0 – 2.5',  score: 4, leakUsd: 65000 },
      { value: 'over_2_5',  label: 'Above 2.5',  score: 5, leakUsd: 80000 },
    ],
    getModifier: (_, system) => {
      if (system === 'ras')    return 1.5
      if (system === 'biofloc') return 1.3
      if (system === 'lined_semi') return 1.2
      return 1.0
    },
  },

  {
    id: 'q1_2', category: 1,
    question: 'What percentage of your feed is consumed vs. settling as waste?',
    subtext: 'Estimate using feed trays or visual observation after feeding',
    options: [
      { value: 'over_90',  label: 'Above 90% consumed',  score: 0, leakUsd: 0 },
      { value: '75_90',    label: '75% – 90%',           score: 1, leakUsd: 6000 },
      { value: '60_75',    label: '60% – 75%',           score: 3, leakUsd: 20000 },
      { value: 'under_60', label: 'Below 60%',           score: 5, leakUsd: 40000 },
    ],
    getModifier: (_, system) => {
      if (system === 'biofloc' || system === 'ras') return 1.3
      if (system === 'lined_semi') return 1.2
      if (system === 'earthen_extensive') return 0.7
      return 1.0
    },
  },

  {
    id: 'q1_3', category: 1,
    question: 'How do you monitor feed consumption in-cycle?',
    options: [
      { value: 'trays_hourly', label: 'Feed trays in every pond, checked hourly',       score: 0, leakUsd: 0 },
      { value: 'trays_3x',    label: 'Feed trays, checked 2–3 times daily',            score: 1, leakUsd: 5000 },
      { value: 'visual',      label: 'Visual estimate from pond edge',                 score: 3, leakUsd: 18000 },
      { value: 'broadcast',   label: 'Broadcast feed without any monitoring',          score: 5, leakUsd: 35000 },
    ],
    getModifier: (_, system) => {
      if (system === 'biofloc' || system === 'ras') return 1.5
      if (system === 'earthen_extensive') return 0.7
      return 1.0
    },
  },

  {
    id: 'q1_4', category: 1,
    question: 'What is your feed cost per kg of shrimp produced (USD)?',
    options: [
      { value: 'under_1_20', label: 'Below $1.20 / kg', score: 0, leakUsd: 0 },
      { value: '1_20_1_50',  label: '$1.20 – $1.50',   score: 1, leakUsd: 8000 },
      { value: '1_51_1_80',  label: '$1.51 – $1.80',   score: 2, leakUsd: 20000 },
      { value: '1_81_2_20',  label: '$1.81 – $2.20',   score: 4, leakUsd: 40000 },
      { value: 'over_2_20',  label: 'Above $2.20',     score: 5, leakUsd: 60000 },
    ],
    getModifier: (species) => species === 'monodon' ? 0.8 : 1.0,
  },

  {
    id: 'q1_5', category: 1,
    question: 'Do you use different feed grades (starter, grower, finisher) with correct transitions?',
    options: [
      { value: 'strict',    label: 'Yes — strict schedule with correct pellet sizing',   score: 0, leakUsd: 0 },
      { value: 'delayed',   label: 'Yes — but transitions are often delayed',            score: 2, leakUsd: 12000 },
      { value: 'one_type',  label: 'One feed type used for the entire cycle',            score: 4, leakUsd: 25000 },
      { value: 'cheapest',  label: 'Whichever feed is cheapest at the time',             score: 5, leakUsd: 35000 },
    ],
    getModifier: (_, system) => (system === 'biofloc' || system === 'ras') ? 2.0 : 1.0,
  },

  {
    id: 'q1_6', category: 1,
    question: 'What is your feed storage loss rate (spoilage, mould, vermin)?',
    options: [
      { value: 'under_1', label: 'Below 1%',   score: 0, leakUsd: 0 },
      { value: '1_3',     label: '1% – 3%',    score: 1, leakUsd: 4000 },
      { value: '3_7',     label: '3% – 7%',    score: 3, leakUsd: 15000 },
      { value: 'over_7',  label: 'Above 7%',   score: 5, leakUsd: 30000 },
    ],
    getModifier: (_, system) => {
      if (system === 'biofloc' || system === 'ras') return 1.5
      if (system === 'earthen_extensive') return 0.8
      return 1.0
    },
  },

  // ── Category 2: Survival & Disease Pressure ───────────────────────────────

  {
    id: 'q2_1', category: 2,
    question: 'What is your average survival rate at harvest?',
    options: [
      { value: 'over_85',  label: 'Above 85%',    score: 0, leakUsd: 0 },
      { value: '75_85',    label: '75% – 85%',    score: 1, leakUsd: 12000 },
      { value: '65_75',    label: '65% – 75%',    score: 2, leakUsd: 36000 },
      { value: '55_65',    label: '55% – 65%',    score: 3, leakUsd: 65000 },
      { value: '45_55',    label: '45% – 55%',    score: 4, leakUsd: 90000 },
      { value: 'under_45', label: 'Below 45%',    score: 5, leakUsd: 120000 },
    ],
    getModifier: (species, system) => {
      if (system === 'biofloc' || system === 'ras') return 1.5
      if (species === 'monodon') return 1.2
      if (system === 'earthen_extensive') return 0.8
      return 1.0
    },
  },

  {
    id: 'q2_2', category: 2,
    question: 'How many disease events requiring treatment or early harvest occurred in the last 3 cycles?',
    options: [
      { value: 'zero',           label: 'Zero events',                             score: 0, leakUsd: 0 },
      { value: 'one_minor',      label: '1 minor event, contained quickly',        score: 1, leakUsd: 10000 },
      { value: 'two_three',      label: '2–3 minor events',                       score: 2, leakUsd: 25000 },
      { value: 'one_major',      label: '1 major event (>30% pond loss)',          score: 4, leakUsd: 60000 },
      { value: 'multiple_major', label: 'Multiple major outbreaks',               score: 5, leakUsd: 100000 },
    ],
    getModifier: (species, system) => {
      if (species === 'monodon') return 1.8
      if (system === 'biofloc') return 1.3
      return 1.0
    },
  },

  {
    id: 'q2_3', category: 2,
    question: 'Do you conduct PCR testing for WSSV, EHP, AHPND, and IMNV?',
    options: [
      { value: 'pre_and_inseason', label: 'Pre-stocking + every 2 weeks in-cycle',   score: 0, leakUsd: 0 },
      { value: 'pre_only',         label: 'Pre-stocking only',                       score: 2, leakUsd: 20000 },
      { value: 'reactive',         label: 'Only when mortality is observed',         score: 4, leakUsd: 45000 },
      { value: 'never',            label: 'Never tested',                            score: 5, leakUsd: 70000 },
    ],
    getModifier: (_, system) => {
      if (system === 'biofloc' || system === 'ras') return 2.0
      if (system === 'lined_semi') return 1.5
      return 1.0
    },
  },

  {
    id: 'q2_4', category: 2,
    question: 'How does your time-to-market-size compare to the species baseline?',
    subtext: 'Vannamei baseline: 90–110 days to 20g. Monodon baseline: 130–160 days to 30g.',
    options: [
      { value: 'faster',       label: '10% or more faster than baseline',    score: 0, leakUsd: 0 },
      { value: 'on_target',    label: 'Within 5% of baseline',               score: 1, leakUsd: 0 },
      { value: 'slightly_slow',label: '15–25% slower than baseline',         score: 3, leakUsd: 20000 },
      { value: 'very_slow',    label: 'More than 25% slower',                score: 5, leakUsd: 50000 },
    ],
    getModifier: () => 1.0,
  },

  {
    id: 'q2_5', category: 2,
    question: 'Do you have a documented biosecurity protocol with footbaths, equipment zoning, and water treatment?',
    options: [
      { value: 'full_enforced',   label: 'Full protocol, enforced every day',           score: 0, leakUsd: 0 },
      { value: 'partial',         label: 'Partial — inconsistently followed',           score: 2, leakUsd: 15000 },
      { value: 'written_ignored', label: 'Written but largely ignored in practice',     score: 4, leakUsd: 35000 },
      { value: 'none',            label: 'No biosecurity protocol',                     score: 5, leakUsd: 55000 },
    ],
    getModifier: (_, system) => {
      if (system === 'lined_semi' || system === 'biofloc') return 1.5
      return 1.0
    },
  },

  // ── Category 3: Water Quality Management ─────────────────────────────────

  {
    id: 'q3_1', category: 3,
    question: 'What is your average dissolved oxygen nadir (lowest point in a 24-hour period, mg/L)?',
    options: [
      { value: 'over_5',  label: 'Above 5.0 mg/L — safe margin',            score: 0, leakUsd: 0 },
      { value: '4_5',     label: '4.0 – 5.0 mg/L',                          score: 1, leakUsd: 5000 },
      { value: '3_4',     label: '3.0 – 4.0 mg/L — growth suppression',     score: 2, leakUsd: 15000 },
      { value: '2_3',     label: '2.0 – 3.0 mg/L — chronic stress',         score: 4, leakUsd: 35000 },
      { value: 'under_2', label: 'Below 2.0 mg/L — mortality events',       score: 5, leakUsd: 60000 },
    ],
    getModifier: (_, system) => {
      if (system === 'biofloc' || system === 'ras') return 1.5
      if (system === 'lined_semi') return 1.2
      return 1.0
    },
  },

  {
    id: 'q3_2', category: 3,
    question: 'How often do you measure key water parameters (NH₃, NO₂, pH, alkalinity)?',
    options: [
      { value: 'daily_auto',   label: 'Daily with automated logging',        score: 0, leakUsd: 0 },
      { value: 'daily_manual', label: 'Daily manual measurement',            score: 1, leakUsd: 3000 },
      { value: 'every_2_3',   label: 'Every 2–3 days',                      score: 2, leakUsd: 10000 },
      { value: 'weekly',      label: 'Weekly',                              score: 4, leakUsd: 25000 },
      { value: 'reactive',    label: 'Only when shrimp look sick',          score: 5, leakUsd: 40000 },
    ],
    getModifier: (_, system) => {
      if (system === 'biofloc' || system === 'ras') return 1.8
      return 1.0
    },
  },

  {
    id: 'q3_3', category: 3,
    question: 'What is your average total ammonia nitrogen (TAN) level during grow-out?',
    options: [
      { value: 'under_0_5', label: 'Below 0.5 mg/L',   score: 0, leakUsd: 0 },
      { value: '0_5_1_0',   label: '0.5 – 1.0 mg/L',  score: 1, leakUsd: 4000 },
      { value: '1_0_2_0',   label: '1.0 – 2.0 mg/L',  score: 2, leakUsd: 12000 },
      { value: '2_0_4_0',   label: '2.0 – 4.0 mg/L',  score: 4, leakUsd: 30000 },
      { value: 'over_4_0',  label: 'Above 4.0 mg/L',  score: 5, leakUsd: 50000 },
    ],
    getModifier: (_, system) => {
      if (system === 'ras') return 1.8
      if (system === 'biofloc') return 1.5
      return 1.0
    },
  },

  {
    id: 'q3_4', category: 3,
    question: 'Do you experience pH swings greater than 0.5 within a 24-hour period?',
    options: [
      { value: 'never',      label: 'Rarely — stable 7.8–8.2 throughout',    score: 0, leakUsd: 0 },
      { value: 'after_rain', label: 'Occasionally after heavy rain',          score: 1, leakUsd: 5000 },
      { value: 'weekly',     label: 'Weekly swings',                          score: 3, leakUsd: 15000 },
      { value: 'daily',      label: 'Daily swings exceeding 1.0',             score: 5, leakUsd: 30000 },
    ],
    getModifier: (_, system) => {
      if (system === 'lined_semi') return 1.7
      if (system === 'earthen_extensive' || system === 'earthen_semi') return 0.9
      return 1.0
    },
  },

  // ── Category 4: Stocking & Density Discipline ─────────────────────────────

  {
    id: 'q4_1', category: 4,
    question: 'What is your actual stocking density compared to your planned density?',
    options: [
      { value: 'on_plan',      label: 'Within ±5% of plan',                  score: 0, leakUsd: 0 },
      { value: 'over_5_15',    label: '5–15% above plan',                    score: 1, leakUsd: 8000 },
      { value: 'over_15_30',   label: '15–30% above plan',                   score: 3, leakUsd: 20000 },
      { value: 'over_30',      label: 'More than 30% above or below plan',   score: 4, leakUsd: 35000 },
      { value: 'no_plan',      label: 'No planned density',                  score: 5, leakUsd: 45000 },
    ],
    getModifier: () => 1.0,
  },

  {
    id: 'q4_2', category: 4,
    question: 'Do you adjust stocking density based on season, temperature, or disease risk period?',
    options: [
      { value: 'documented',      label: 'Yes — documented seasonal adjustment plan',           score: 0, leakUsd: 0 },
      { value: 'gut_feel',        label: 'Sometimes, based on experience',                      score: 2, leakUsd: 12000 },
      { value: 'same_year_round', label: 'Same density year-round regardless of conditions',    score: 4, leakUsd: 25000 },
      { value: 'higher_risky',    label: 'Higher density in high-risk seasons (profit chasing)',score: 5, leakUsd: 40000 },
    ],
    getModifier: (_, system) => {
      if (system === 'earthen_extensive' || system === 'earthen_semi') return 1.5
      return 1.0
    },
  },

  {
    id: 'q4_3', category: 4,
    question: 'What is the size uniformity (coefficient of variation) of your shrimp at harvest?',
    subtext: 'CV = standard deviation ÷ mean size × 100. Lower is better. Higher CV = larger size spread = price discount.',
    options: [
      { value: 'under_10', label: 'Below 10% — uniform, premium sizing',         score: 0, leakUsd: 0 },
      { value: '10_15',    label: '10% – 15% — standard',                        score: 1, leakUsd: 5000 },
      { value: '15_20',    label: '15% – 20% — 5–10% price discount',            score: 2, leakUsd: 15000 },
      { value: '20_30',    label: '20% – 30% — 15% price discount',              score: 4, leakUsd: 30000 },
      { value: 'over_30',  label: 'Above 30% — severe grading losses',           score: 5, leakUsd: 50000 },
    ],
    getModifier: () => 1.0,
  },

  {
    id: 'q4_4', category: 4,
    question: 'Do you run a nursery phase before pond stocking?',
    subtext: 'Post-larvae held in high-density nursery tanks before transfer to grow-out ponds',
    options: [
      { value: 'over_15_days', label: 'Yes — more than 15 days in nursery',    score: 0, leakUsd: 0 },
      { value: '7_14_days',   label: 'Yes — 7–14 days',                       score: 1, leakUsd: 5000 },
      { value: 'occasional',  label: 'Occasionally',                          score: 3, leakUsd: 15000 },
      { value: 'direct_pl',   label: 'Direct stocking of PL10–12',            score: 4, leakUsd: 25000 },
      { value: 'no_nursery',  label: 'No nursery, variable PL quality',       score: 5, leakUsd: 35000 },
    ],
    getModifier: (_, system) => {
      if (system === 'biofloc' || system === 'ras') return 1.6
      if (system === 'lined_semi') return 1.3
      return 1.0
    },
  },

  // ── Category 5: Financial Visibility ─────────────────────────────────────

  {
    id: 'q5_1', category: 5,
    question: 'Do you know your breakeven price per kg for each individual pond?',
    options: [
      { value: 'per_pond',  label: 'Yes — calculated per cycle, per pond',     score: 0, leakUsd: 0 },
      { value: 'per_farm',  label: 'Yes — farm-level average per cycle',       score: 1, leakUsd: 8000 },
      { value: 'rough',     label: 'Rough estimate only',                      score: 3, leakUsd: 20000 },
      { value: 'no_idea',   label: 'No idea',                                  score: 5, leakUsd: 40000 },
    ],
    getModifier: () => 1.0,
  },

  {
    id: 'q5_2', category: 5,
    question: 'What percentage of your total costs are fixed (cannot be reduced by pausing operations)?',
    subtext: 'Higher fixed cost ratio = greater financial exposure in a poor cycle',
    options: [
      { value: 'under_20', label: 'Below 20% — highly flexible',        score: 0, leakUsd: 0 },
      { value: '20_30',    label: '20% – 30% — healthy structure',      score: 1, leakUsd: 5000 },
      { value: '30_40',    label: '30% – 40% — moderate overhead',      score: 2, leakUsd: 12000 },
      { value: '40_50',    label: '40% – 50% — overhead leak',          score: 4, leakUsd: 25000 },
      { value: 'over_50',  label: 'Above 50% — structural bleeding',    score: 5, leakUsd: 40000 },
    ],
    getModifier: () => 1.0,
  },

  {
    id: 'q5_3', category: 5,
    question: 'How often do you reconcile actual feed use against invoices and inventory?',
    options: [
      { value: 'daily',      label: 'Daily reconciliation',            score: 0, leakUsd: 0 },
      { value: 'weekly',     label: 'Weekly',                         score: 1, leakUsd: 4000 },
      { value: 'monthly',    label: 'Monthly',                        score: 3, leakUsd: 12000 },
      { value: 'at_harvest', label: 'Only at harvest',                score: 4, leakUsd: 20000 },
      { value: 'never',      label: 'Never reconciled',               score: 5, leakUsd: 35000 },
    ],
    getModifier: () => 1.0,
  },

  {
    id: 'q5_4', category: 5,
    question: 'Do you track daily mortality in economic terms (kg lost × market price)?',
    options: [
      { value: 'daily_per_pond', label: 'Yes — tracked per pond, every day',           score: 0, leakUsd: 0 },
      { value: 'weekly',         label: 'Yes — weekly summary',                        score: 2, leakUsd: 10000 },
      { value: 'at_harvest',     label: 'Total loss calculated at harvest only',       score: 4, leakUsd: 25000 },
      { value: 'no_tracking',    label: 'No mortality tracking',                       score: 5, leakUsd: 40000 },
    ],
    getModifier: () => 1.0,
  },

  // ── Category 6: Operations & SOPs ────────────────────────────────────────

  {
    id: 'q6_1', category: 6,
    question: 'Is there a written, actively followed SOP for daily pond observation and walking?',
    options: [
      { value: 'digital',    label: 'Yes — digital checklist with daily sign-off',   score: 0, leakUsd: 0 },
      { value: 'paper',      label: 'Yes — paper logbook',                           score: 1, leakUsd: 5000 },
      { value: 'verbal',     label: 'Verbal instructions only',                      score: 3, leakUsd: 15000 },
      { value: 'no_sop',     label: 'No SOP — we react to crises',                  score: 5, leakUsd: 35000 },
    ],
    getModifier: () => 1.0,
  },

  {
    id: 'q6_2', category: 6,
    question: 'What is your average time from mortality detection to response (removal, treatment, reporting)?',
    options: [
      { value: 'under_2h',  label: 'Under 2 hours',                            score: 0, leakUsd: 0 },
      { value: '2_6h',      label: '2 – 6 hours',                              score: 1, leakUsd: 5000 },
      { value: '6_12h',     label: '6 – 12 hours',                             score: 2, leakUsd: 15000 },
      { value: '12_24h',    label: '12 – 24 hours',                            score: 4, leakUsd: 30000 },
      { value: 'over_24h',  label: 'More than 24 hours, or unknown',           score: 5, leakUsd: 50000 },
    ],
    getModifier: (_, system) => {
      if (system === 'biofloc' || system === 'ras') return 2.0
      if (system === 'lined_semi') return 1.5
      return 1.0
    },
  },

  {
    id: 'q6_3', category: 6,
    question: 'Do you have a grading and restocking protocol for size variation during the cycle?',
    options: [
      { value: 'every_2_3w',      label: 'Yes — grade and rearrange every 2–3 weeks',    score: 0, leakUsd: 0 },
      { value: 'once_mid',        label: 'Grade once mid-cycle',                         score: 2, leakUsd: 10000 },
      { value: 'at_harvest_only', label: 'Grade only at harvest',                        score: 4, leakUsd: 20000 },
      { value: 'never',           label: 'No grading ever',                              score: 5, leakUsd: 30000 },
    ],
    getModifier: (species) => species === 'vannamei' ? 1.4 : 1.0,
  },

  {
    id: 'q6_4', category: 6,
    question: 'What is your staff-to-pond ratio during night shift?',
    subtext: 'Night dissolved oxygen crashes are the single largest cause of emergency losses',
    options: [
      { value: '1_per_2',          label: '1 staff per 2 ponds — full night coverage',    score: 0, leakUsd: 0 },
      { value: '1_per_5',          label: '1 staff per 5 ponds',                          score: 1, leakUsd: 8000 },
      { value: '1_per_10',         label: '1 staff per 10 ponds',                         score: 2, leakUsd: 20000 },
      { value: 'alarms_only',      label: 'No night staff — alarms only',                 score: 4, leakUsd: 40000 },
      { value: 'no_staff_no_alarm',label: 'No night staff and no alarms',                 score: 5, leakUsd: 65000 },
    ],
    getModifier: () => 1.0,
  },

  // ── Category 7: Infrastructure & Aeration ────────────────────────────────

  {
    id: 'q7_1', category: 7,
    question: 'What is your aeration capacity relative to standing biomass?',
    subtext: 'Expressed as HP (horsepower) per estimated tonne of shrimp in the water at peak biomass',
    options: [
      { value: 'over_2_5',  label: 'Above 2.5 HP / tonne — strong safety margin',   score: 0, leakUsd: 0 },
      { value: '1_5_2_5',   label: '1.5 – 2.5 HP / tonne — adequate',               score: 1, leakUsd: 5000 },
      { value: '1_0_1_5',   label: '1.0 – 1.5 HP / tonne — risky at peak biomass',  score: 2, leakUsd: 15000 },
      { value: '0_5_1_0',   label: '0.5 – 1.0 HP / tonne — chronic low DO risk',    score: 4, leakUsd: 35000 },
      { value: 'under_0_5', label: 'Below 0.5 HP / tonne — severe bottleneck',      score: 5, leakUsd: 55000 },
    ],
    getModifier: (_, system) => {
      if (system === 'biofloc' || system === 'ras') return 1.5
      return 1.0
    },
  },

  {
    id: 'q7_2', category: 7,
    question: 'Do you have backup aeration (generator and spare motors)?',
    options: [
      { value: 'auto_backup',         label: 'Automatic backup with alarm system',           score: 0, leakUsd: 0 },
      { value: 'manual_tested',       label: 'Manual generator, tested monthly',             score: 1, leakUsd: 8000 },
      { value: 'untested',            label: 'Generator present but not tested regularly',   score: 3, leakUsd: 20000 },
      { value: 'grid_only',           label: 'No backup — rely entirely on the grid',        score: 4, leakUsd: 35000 },
      { value: 'no_backup_unreliable',label: 'No backup and grid is unreliable',             score: 5, leakUsd: 60000 },
    ],
    getModifier: () => 1.0,
  },

  {
    id: 'q7_3', category: 7,
    question: 'What is the age and condition of your pond liners?',
    subtext: 'Select the earthen option if your ponds do not use HDPE lining',
    options: [
      { value: 'new',            label: 'New (under 2 years), no leaks',                      score: 0, leakUsd: 0 },
      { value: '2_5_minor',      label: '2–5 years, minor patches',                          score: 1, leakUsd: 5000 },
      { value: '5_8_patches',    label: '5–8 years, multiple patches',                       score: 3, leakUsd: 20000 },
      { value: 'over_8',         label: 'Over 8 years or significantly degraded',            score: 5, leakUsd: 40000 },
      { value: 'earthen_erosion',label: 'Earthen pond with visible bank erosion',            score: 4, leakUsd: 25000 },
    ],
    getModifier: (_, system) => {
      if (system === 'lined_semi' || system === 'biofloc') return 1.3
      return 1.0
    },
  },

  {
    id: 'q7_4', category: 7,
    question: 'Do you use automated water quality sensors with real-time monitoring?',
    options: [
      { value: 'per_pond_remote', label: 'Yes — per pond with mobile remote alerts',       score: 0, leakUsd: 0 },
      { value: 'shared_probes',   label: 'Yes — shared probes rotated between ponds',      score: 1, leakUsd: 5000 },
      { value: 'handheld',        label: 'Handheld meters only',                           score: 3, leakUsd: 15000 },
      { value: 'visual',          label: 'No meters — visual observation only',            score: 5, leakUsd: 40000 },
    ],
    getModifier: (_, system) => {
      if (system === 'biofloc' || system === 'ras') return 2.0
      if (system === 'lined_semi') return 1.3
      return 1.0
    },
  },

  // ── Category 8: Market Position & Revenue ────────────────────────────────

  {
    id: 'q8_1', category: 8,
    question: 'How do you primarily sell your harvest?',
    options: [
      { value: 'direct_contract', label: 'Direct to exporter / processor with a contract',   score: 0, leakUsd: 0 },
      { value: 'local_direct',    label: 'Direct to local market or restaurants',            score: 1, leakUsd: 5000 },
      { value: 'cooperative',     label: 'Through a farmer cooperative collective',          score: 2, leakUsd: 10000 },
      { value: 'middleman',       label: 'Middleman at farm gate — below market price',      score: 4, leakUsd: 30000 },
      { value: 'distressed',      label: 'Distressed sale — emergency harvest price',        score: 5, leakUsd: 55000 },
    ],
    getModifier: () => 1.0,
  },

  {
    id: 'q8_2', category: 8,
    question: 'What percentage of your harvest achieves premium market size?',
    subtext: 'Vannamei: >20g is premium. Monodon: >35g is premium.',
    options: [
      { value: 'over_60',  label: 'Above 60% — strong premium yield',          score: 0, leakUsd: 0 },
      { value: '40_60',    label: '40% – 60%',                                 score: 1, leakUsd: 8000 },
      { value: '25_40',    label: '25% – 40%',                                 score: 2, leakUsd: 18000 },
      { value: '10_25',    label: '10% – 25%',                                 score: 4, leakUsd: 35000 },
      { value: 'under_10', label: 'Below 10% — predominantly small sizes',     score: 5, leakUsd: 55000 },
    ],
    getModifier: () => 1.0,
  },

  {
    id: 'q8_3', category: 8,
    question: 'Do you hold current traceability certification (ASC, BAP, GlobalGAP, or equivalent)?',
    options: [
      { value: 'current',      label: 'Yes — current and active certification',         score: 0, leakUsd: 0 },
      { value: 'in_progress',  label: 'In progress — expected within 6 months',         score: 1, leakUsd: 8000 },
      { value: 'interested',   label: 'No certification, but interested in pursuing it', score: 3, leakUsd: 20000 },
      { value: 'not_feasible', label: 'No — not considered feasible',                   score: 4, leakUsd: 30000 },
      { value: 'unfamiliar',   label: "I'm not familiar with these certifications",     score: 5, leakUsd: 45000 },
    ],
    getModifier: () => 1.0,
  },

  {
    id: 'q8_4', category: 8,
    question: 'How do you manage price volatility at harvest?',
    options: [
      { value: 'forward_contracts',  label: 'Forward contracts covering >50% of production', score: 0, leakUsd: 0 },
      { value: 'diversified_buyers', label: '3 or more diversified buyer channels',          score: 1, leakUsd: 5000 },
      { value: 'spot_market',        label: 'Sell at spot market price at harvest',          score: 3, leakUsd: 15000 },
      { value: 'hold_inventory',     label: 'Hold inventory waiting for a better price',     score: 4, leakUsd: 25000 },
      { value: 'no_strategy',        label: 'No strategy — accept harvest-day price',        score: 5, leakUsd: 40000 },
    ],
    getModifier: () => 1.0,
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

export const QUESTIONS_BY_CATEGORY: DiagnosticQuestion[][] =
  CATEGORIES.map(cat => QUESTIONS.filter(q => q.category === cat.id))

// ── Scoring engine ────────────────────────────────────────────────────────────

export interface ScoreResult {
  categoryScores:    Record<number, number>
  categoryMaxes:     Record<number, number>
  categoryLeaks:     Record<number, number>
  totalScore:        number
  totalMax:          number
  totalLeakUsd:      number
  normalisedPct:     number   // 0–100
  topLeakCategories: number[] // top 3 category IDs by dollar leak
}

export function calculateScore(
  answers:        DiagnosticAnswers,
  contextAnswers: ContextAnswers,
): ScoreResult {
  const categoryScores: Record<number, number> = {}
  const categoryMaxes:  Record<number, number> = {}
  const categoryLeaks:  Record<number, number> = {}
  let totalScore   = 0
  let totalMax     = 0
  let totalLeakUsd = 0

  for (const q of QUESTIONS) {
    const selected = answers[q.id]
    if (!selected) continue
    const option = q.options.find(o => o.value === selected)
    if (!option) continue

    const mod      = q.getModifier(contextAnswers.species, contextAnswers.system)
    const weighted = option.score * mod
    const maxW     = 5 * mod

    categoryScores[q.category] = (categoryScores[q.category] ?? 0) + weighted
    categoryMaxes[q.category]  = (categoryMaxes[q.category]  ?? 0) + maxW
    categoryLeaks[q.category]  = (categoryLeaks[q.category]  ?? 0) + option.leakUsd

    totalScore   += weighted
    totalMax     += maxW
    totalLeakUsd += option.leakUsd
  }

  const normalisedPct = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0

  const topLeakCategories = Object.entries(categoryLeaks)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([cat]) => Number(cat))

  return { categoryScores, categoryMaxes, categoryLeaks, totalScore, totalMax, totalLeakUsd, normalisedPct, topLeakCategories }
}

// ── Interpretation ────────────────────────────────────────────────────────────

export interface Interpretation {
  label:       string
  colour:      string
  border:      string
  description: string
  ctaLabel:    string
  ctaLink:     string
}

export function interpretScore(normalisedPct: number): Interpretation {
  if (normalisedPct <= 20) return {
    label: 'Profitable',
    colour: '#4ade80',
    border: 'rgba(74,222,128,0.3)',
    description: 'Your operational discipline is above average. Leaks are minimal. Focus on market positioning and scaling what already works.',
    ctaLabel: 'Browse Optimisation Resources',
    ctaLink: '/shop',
  }
  if (normalisedPct <= 40) return {
    label: 'Minor Leaks',
    colour: '#fbbf24',
    border: 'rgba(251,191,36,0.3)',
    description: '10–20% profit improvement is within reach. A focused session will identify your top 2 leaks and build a prioritised fix plan.',
    ctaLabel: 'Book a 30-Min Focus Session — $250',
    ctaLink: '/consultation',
  }
  if (normalisedPct <= 65) return {
    label: 'Moderate Bleeding',
    colour: '#f97316',
    border: 'rgba(249,115,22,0.3)',
    description: 'You are losing 20–40% of potential profit. A Deep Dive session or Diagnostic Audit will locate and quantify every leak.',
    ctaLabel: 'Book a 60-Min Deep Dive — $500',
    ctaLink: '/consultation',
  }
  return {
    label: 'Severe Losses',
    colour: '#ef4444',
    border: 'rgba(239,68,68,0.3)',
    description: 'Your farm is bleeding heavily across multiple systems. Structured intervention — not a one-off session — is required.',
    ctaLabel: 'Apply for Tier 2 — 90-Day Transformation',
    ctaLink: '/audit',
  }
}
