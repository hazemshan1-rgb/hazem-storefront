import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { SEO } from '../components/ui/SEO'
import { caseStudies } from '../data/caseStudies'

const T1_EMAIL = 'mailto:hazemshan1@gmail.com?subject=Tier%201%20%E2%80%93%20Diagnostic%20Audit%20%E2%80%93%20Enquiry'
const T2_EMAIL = 'mailto:hazemshan1@gmail.com?subject=Tier%202%20%E2%80%93%2090-Day%20Transformation%20%E2%80%93%20Application'
const T3_EMAIL = 'mailto:hazemshan1@gmail.com?subject=Tier%203%20%E2%80%93%20Investor-Ready%20Enterprise%20%E2%80%93%20Application'

// ─── Tier data ───────────────────────────────────────────────────────────────

const tiers = [
  {
    id: 1,
    name: 'Diagnostic Audit',
    tagline: 'The map. You do the digging.',
    price: '$4,500 – $7,500',
    priceSub: 'Base $5,000. Adjusted for pond count, species, and data quality.',
    length: '30 days',
    bestFor: 'Operators who scored 11–15 on the audit. Decent operational discipline. Will execute a roadmap themselves if someone shows them exactly what to do.',
    notFor: 'Operators scoring 16+ (you need Tier 2 — you are bleeding too fast to fix it alone), or anyone who wants staff training and weekly calls.',
    promise: 'You will know exactly where your farm is leaking money. Every leak will have a dollar amount attached. You will have a ranked list of fixes, a 90-day action plan, and every template you need to execute on your own. I do not fix the leaks for you in Tier 1. I give you the map.',
    guarantee: 'Satisfaction guarantee: if after the kickoff call you have not received at least $5,000 of value, I refund 100%. Conditions apply — you must attempt three fixes and request the refund within 45 days.',
    payment: '100% upfront. No milestones. I used to offer 50/50 — too many operators paid the first half, got the draft report, and disappeared. If you need two installments, 50% at signing and 50% before report delivery. No report goes out until paid in full.',
    leadTime: '2–3 weeks from contract signing to report delivery',
    availability: 'No application needed. Book directly and I send the data intake form.',
    phases: [
      {
        name: 'Week 1',
        label: 'Data Collection',
        detail: 'You send production records for your last 3–6 batches, 12 months of electricity and feed invoices, water quality logs if you have them, and a 15-minute phone video walkthrough of every pond. I send you a shot list.',
      },
      {
        name: 'Week 2',
        label: 'Deep Analysis',
        detail: 'I build a 20–30 variable model for your farm. Real FCR per batch, invisible mortality, energy cost per kg, carrying capacity utilisation, water exchange efficiency, treatment cost as % of revenue, and SOP gap score. Benchmark comparison against 50+ audited farms.',
      },
      {
        name: 'Week 3',
        label: 'Report Writing',
        detail: 'Custom 30–40 page diagnostic report: executive summary (top 3 leaks + single highest-ROI fix), leak-by-leak breakdown with dollar gaps, ranked action plan with estimated costs and monthly savings, 90-day calendar, and 10+ pages of printable templates.',
      },
      {
        name: 'Week 4',
        label: 'Review & Consultation',
        detail: 'Final report delivery. A 90-minute kickoff call where we walk every page. Then one 45-minute troubleshooting call, usable any time within 60 days — schedule it when you get stuck on a specific fix.',
      },
    ],
    includes: [
      '30–40 page custom diagnostic report',
      'Real FCR, invisible mortality, and energy cost per kg from your actual data',
      'Ranked list of 7 leaks with dollar values attached to each',
      '90-day action plan — what to fix, in what order, with what tool',
      '90-min kickoff call + one 45-min follow-up call (within 60 days)',
      'PDF templates: feed tray log, mortality log, water quality log, DO log, batch FCR tracker',
    ],
    excludes: [
      'On-site visit — no travel, no farm walk',
      'Staff training — the report is written for you to train them',
      'Weekly accountability calls — you get two calls total',
      'Operations Manual — that is Tier 2',
      'Margin improvement guarantee — satisfaction guarantee applies instead',
    ],
    email: T1_EMAIL,
    ctaLabel: 'Book Tier 1 →',
    ctaNote: 'No application needed. Pay and I send the data intake form within 24 hours.',
  },
  {
    id: 2,
    name: '90-Day Farm Profitability Transformation™',
    tagline: 'The core product. Guaranteed result.',
    price: '$15,000 – $25,000',
    priceSub: 'Single-species, single-site, under 10 ponds: $15K. 10–30 ponds: $20K. Multiple species or multiple sites: $25K. International travel: $25K + actuals.',
    length: '90 days',
    bestFor: 'Operators who scored 16+, or scored 11–15 but could not execute Tier 1 alone. Monthly revenue $30K–$150K. You need someone to hold your hand, train your crew, and guarantee the result.',
    notFor: 'Operators who want a report to put on a shelf. Farms already profitable and just wanting a tune-up. Anyone not willing to share their real numbers.',
    promise: 'In 90 days, I will increase your net operating margin by a minimum of 10 percentage points. If we fail, you do not pay the final milestone. This is not consulting. This is not coaching. This is a hands-on restructuring of your farm\'s operations — led by someone who has done it on three continents.',
    guarantee: '10-percentage-point margin improvement guarantee. Measured against Day 1 baseline. If not met, Milestone 3 is waived entirely. You keep every deliverable.',
    payment: '3 milestones: 33% at signing, 34% at start of Phase 2 (Day 30), 33% at end of Phase 3 — only if margin guarantee is met. If guarantee fails, Milestone 3 is $0.',
    leadTime: '4–6 weeks from signing to start. I block travel and prepare custom materials in advance.',
    availability: 'I take 3 operators per quarter. Q3 2026: 2 spots remaining. Q4 2026: 3 spots. Q1 2027: waitlist open.',
    phases: [
      {
        name: 'Phase 1',
        label: 'Discovery & Deep Diagnostics (Days 1–30)',
        detail: 'Remote data collection in Week 1. Baseline P&L analysis in Week 2 — real FCR, invisible mortality, carrying capacity per kg. Week 3: 5-day on-site immersion (shadow day, hands-on diagnostics, side-by-side trials, staff training workshops, SOP writing, Command Board installation). Week 4: Baseline report and signed Phase 2 action plan.',
      },
      {
        name: 'Phase 2',
        label: 'Active Fix & Weekly Accountability (Days 31–60)',
        detail: 'Weekly 60-min accountability calls (same day, same time). Remote Wednesday log review — voice note within 24 hours if something is wrong. Day 45 mid-phase checkpoint. Systematic closure of the top leaks: FCR, invisible mortality, stocking density, water exchange, energy, disease prevention, SOPs.',
      },
      {
        name: 'Phase 3',
        label: 'Hardening & Handover (Days 61–90)',
        detail: 'Second 3-day on-site visit at Week 9 (progress audit, retraining, handover session). Three final weekly calls where you lead. Day 90: margin measurement vs baseline. Delivery of Operations Manual (50–80 pages, printed and bound), digital dashboard, and 30-minute Farm in a Box video.',
      },
    ],
    includes: [
      'Everything in Tier 1, plus:',
      '5-day on-site immersion (travel included within your country)',
      'Daily shadowing, hands-on diagnostics, aerator tests, side-by-side pond trials',
      'Staff training workshops + SOP writing together on-site',
      'Laminated Command Board for your feed shed (5 key metrics, updated daily)',
      'Weekly 60-min accountability calls for 12 weeks',
      'Remote mid-week monitoring — Wednesday log review, text/voice note if something drifts',
      'Second 3-day on-site visit at Week 9 to audit progress and retrain',
      'Complete Operations Manual — 50–80 pages, custom to your farm, printed and bound',
      'Digital dashboard (Google Sheets auto-calculates your margins from daily entries)',
      '30-min "Farm in a Box" video for your future manager or buyer',
    ],
    excludes: [
      'Investor introductions — that is Tier 3',
      'Legal or accounting work',
      'Ongoing support beyond 90 days (hourly aftercare at $400/hr available)',
    ],
    email: T2_EMAIL,
    ctaLabel: 'Apply for Tier 2 →',
    ctaNote: 'I review every application personally. If you are a fit, I send a calendar link for a 30-min discovery call.',
  },
  {
    id: 3,
    name: 'Investor-Ready Enterprise Program',
    tagline: 'Raise capital. Sell the farm. Scale.',
    price: '$25,000 – $50,000+',
    priceSub: 'Base $35K for a single-site farm with clean books. +$5K per additional site. +$10K if funding target exceeds $2M. −$5K if you have already completed Tier 2 with me.',
    length: '180 days',
    bestFor: 'Operations with $100K+/month revenue and 15%+ margins. Ready to raise $200K–$5M or sell within 12–24 months. Must have completed Tier 2 or demonstrate equivalent operational benchmark.',
    notFor: 'Operators who just want a prettier pitch deck. Farms with unresolved operational leaks. Anyone not ready to share full financials with potential investors.',
    promise: 'In 180 days, your farm will pass investor due diligence. You will have a business plan that raises money, a data room that answers every question before it is asked, and introductions to at least five pre-vetted capital sources. If no term sheet, LOI, or formal commitment arrives within 12 months of starting, I extend with six months of quarterly check-ins at no cost.',
    guarantee: 'Term sheet or LOI within 12 months of program start. If not, six months of free quarterly check-ins. Milestone 6 (10%) is waived if no deal closes.',
    payment: '6 milestones: 20% at signing, 20% at Phase 2 start (Day 30), 20% at Phase 3 start (Day 60), 15% at Phase 4 start (Day 90), 15% at Phase 5 start (Day 120), 10% at Phase 6 start (Day 150) — waived if no term sheet or LOI within 12 months. Success fee alternative available (ask on discovery call).',
    leadTime: '4–6 weeks to start. Requires Tier 2 completion or proof your operations already run at benchmark.',
    availability: 'Application + 90-minute discovery call required. I will ask for your P&L on that call. Be ready.',
    phases: [
      {
        name: 'Phase 1',
        label: 'Readiness Assessment (Days 1–30)',
        detail: 'Financial deep dive (3 years of returns, 12 months of bank statements, real EBITDA calculation — most operators overestimate by 30–50%). Legal and compliance audit. 2-hour exit readiness call. Delivery of Go/No-Go report with valuation range (3–5× EBITDA). If No-Go: 75% refund of Phase 1 payment.',
      },
      {
        name: 'Phase 2',
        label: 'Operational Hardening (Days 31–60)',
        detail: '3-day on-site visit with an investor\'s eye — safety, cleanliness, data systems, staff competence. Fix-It List (10–20 action items, 10-day completion window). Full 3-year financial model (monthly P&L, cash flow, balance sheet, sensitivity analysis, use-of-funds table). Virtual data room setup.',
      },
      {
        name: 'Phase 3',
        label: 'Business Plan & Pitch Deck (Days 61–90)',
        detail: '30–40 page investor-grade business plan. 15–20 slide pitch deck. 2-page investor teaser (this is what you send cold — if they don\'t bite on the teaser, they won\'t read the deck).',
      },
      {
        name: 'Phase 4',
        label: 'Investor Targeting & Outreach (Days 91–120)',
        detail: 'List of 50–100 targeted capital sources (family offices, impact investors, VCs, private debt, strategic buyers, government grants). At least 5–10 warm personal introductions. Cold outreach templates. Live pipeline tracker.',
      },
      {
        name: 'Phase 5',
        label: 'Pitch Practice & Due Diligence Prep (Days 121–150)',
        detail: 'Two recorded pitch rehearsals with written critique. Mock investor panel with 2–3 consultants asking the hard questions live. 80–100 item due diligence checklist. Final data room review (file naming, permissions, missing documents).',
      },
      {
        name: 'Phase 6',
        label: 'Deal Support & Closing (Days 151–180)',
        detail: 'Pre-meeting prep call before every investor meeting. 24-hour debrief after each meeting. Term sheet review (I flag what is standard and what is predatory — you take it to your lawyer). Extended 60 days at no cost if no term sheet by Week 26.',
      },
    ],
    includes: [
      'Everything in Tier 2, plus:',
      '3-year financial model (P&L, cash flow, balance sheet, sensitivity analysis)',
      'Current valuation analysis (3–5× trailing EBITDA)',
      '30–40 page investor-grade business plan',
      '15–20 slide pitch deck + 2-page investor teaser',
      'Virtual data room (80–100 indexed documents)',
      'List of 50–100 targeted capital sources',
      '5–10 warm introductions from my personal network',
      '2 additional on-site visits (readiness assessment + investor walkthrough)',
      'Pitch rehearsal + mock investor panel',
      '4 quarterly check-in calls for 12 months after program end',
    ],
    excludes: [
      'Guaranteed funding — I do not control investors',
      'Legal representation — you need your own lawyer for the term sheet',
      'Ongoing CFO services after the program ends',
    ],
    email: T3_EMAIL,
    ctaLabel: 'Apply for Tier 3 →',
    ctaNote: 'Application + 90-min discovery call required. Must have completed Tier 2 or equivalent.',
  },
]

// ─── Comparison table ────────────────────────────────────────────────────────

const tableRows = [
  { feature: 'Diagnostic report (leaks + dollar values)', t1: '✓', t2: '✓', t3: '✓' },
  { feature: '90-day action plan', t1: '✓', t2: '✓', t3: '✓' },
  { feature: 'Templates (logs, trackers)', t1: '✓', t2: '✓', t3: '✓' },
  { feature: 'Remote consultation hours', t1: '3 hrs', t2: '12+ hrs', t3: '20+ hrs' },
  { feature: 'On-site visits', t1: '—', t2: '2 visits, 8 days', t3: '4 visits, 14 days' },
  { feature: 'Staff training workshops', t1: '—', t2: '✓', t3: '✓' },
  { feature: 'Laminated Command Board', t1: '—', t2: '✓', t3: '✓' },
  { feature: 'Weekly accountability calls', t1: '—', t2: '✓', t3: '✓' },
  { feature: 'Remote mid-week monitoring', t1: '—', t2: '✓', t3: '✓' },
  { feature: 'Operations Manual (custom)', t1: '—', t2: '✓', t3: '✓' },
  { feature: 'Digital dashboard', t1: '—', t2: '✓', t3: '✓' },
  { feature: 'Margin improvement guarantee', t1: '—', t2: '✓', t3: '✓' },
  { feature: 'Financial modeling (3-year)', t1: '—', t2: '—', t3: '✓' },
  { feature: 'Investor-grade business plan', t1: '—', t2: '—', t3: '✓' },
  { feature: 'Pitch deck + investor teaser', t1: '—', t2: '—', t3: '✓' },
  { feature: 'Virtual data room', t1: '—', t2: '—', t3: '✓' },
  { feature: 'Investor/buyer introductions', t1: '—', t2: '—', t3: '✓' },
  { feature: 'Quarterly check-ins (1 year)', t1: '—', t2: '—', t3: '✓' },
]

// ─── Decision guide ──────────────────────────────────────────────────────────

const decisions = [
  {
    condition: 'Doing $30K–$60K/month, scored 11–15, have a good manager, just need direction',
    tier: 'Tier 1',
    color: 'text-[var(--color-gold)]',
  },
  {
    condition: 'Doing $30K–$150K/month, scored 16+, no SOPs, crew needs training, you are exhausted',
    tier: 'Tier 2',
    color: 'text-[var(--color-gold-cta)]',
  },
  {
    condition: 'Doing $100K+/month, margins healthy (15%+), want to raise capital or sell in 12–24 months',
    tier: 'Tier 3',
    color: 'text-[var(--color-text-on-dark)]',
  },
  {
    condition: 'Doing under $30K/month or scored below 11',
    tier: 'Read the book first',
    color: 'text-[var(--color-text-muted)]',
  },
]

// ─── Upgrade path ────────────────────────────────────────────────────────────

const upgrades = [
  {
    from: 'Tier 1 → Tier 2',
    detail: 'If you buy Tier 1 and decide within 30 days of receiving the report that you want to upgrade, I credit 100% of what you paid toward Tier 2. You only pay the difference. The $5,000 is not lost — it becomes a down payment.',
  },
  {
    from: 'Tier 2 → Tier 3',
    detail: 'If you are in Tier 2 and realise you want to raise capital or sell, Tier 3 is a separate engagement. Because you already have the Operations Manual and the logs, I discount Tier 3 by $5,000.',
  },
  {
    from: 'Tier 1 → Tier 3',
    detail: 'Not recommended. You need the operational foundation first. If you insist, a Tier 2 diagnostic is included in the Tier 3 price. But I will not make investor introductions until the operations are clean.',
  },
]

// ─── Component helpers ────────────────────────────────────────────────────────

type Tier = typeof tiers[0]

function PhasesAccordion({ phases, featured }: { phases: Tier['phases']; featured: boolean }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-1">
      {phases.map((phase, i) => (
        <div
          key={i}
          className={`rounded-sm border ${featured ? 'border-[var(--color-gold-muted)]' : 'border-[var(--color-gold-muted)]'}`}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className={`w-full text-left px-4 py-3 flex items-center justify-between gap-4 ${featured ? 'text-[var(--color-text-on-dark)]' : 'text-[var(--color-text)]'}`}
          >
            <span className="flex items-center gap-3">
              <span className={`text-[9px] tracking-[0.25em] uppercase font-bold shrink-0 ${featured ? 'text-[var(--color-gold-cta)]' : 'text-[var(--color-gold)]'}`}>
                {phase.name}
              </span>
              <span className="text-xs font-medium">{phase.label}</span>
            </span>
            <svg
              className={`shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''} ${featured ? 'text-[var(--color-gold-cta)]' : 'text-[var(--color-gold)]'}`}
              width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
            >
              <path d="M2 4.5l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {open === i && (
            <div className={`px-4 pb-4 text-xs leading-relaxed ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
              {phase.detail}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function TierCard({ tier, featured = false }: { tier: Tier; featured?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex flex-col rounded-sm border p-6 ${
        featured
          ? 'bg-[var(--color-navy)] border-[var(--color-gold-cta)] shadow-[0_0_40px_rgba(202,138,4,0.15)]'
          : 'bg-[var(--color-surface)] border-[var(--color-gold-muted)]'
      }`}
    >
      {featured && (
        <div className="absolute -top-3 left-6">
          <span className="text-[9px] tracking-[0.3em] uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-3 py-1 rounded-sm">
            Core Product
          </span>
        </div>
      )}

      <div className="mb-4">
        <p className={`text-[10px] tracking-[0.3em] uppercase font-semibold mb-1 ${featured ? 'text-[var(--color-gold-cta)]' : 'text-[var(--color-gold)]'}`}>
          Tier {tier.id}
        </p>
        <h3 className={`font-serif text-xl leading-snug mb-1 ${featured ? 'text-[var(--color-text-on-dark)]' : 'text-[var(--color-text)]'}`}>
          {tier.name}
        </h3>
        <p className={`text-xs ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
          {tier.tagline}
        </p>
      </div>

      <div className="mb-4 pb-4 border-b border-[var(--color-gold-muted)]">
        <p className={`font-serif text-2xl mb-0.5 ${featured ? 'text-[var(--color-gold-cta)]' : 'text-[var(--color-gold)]'}`}>
          {tier.price}
        </p>
        <p className={`text-[10px] ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
          {tier.length} · {tier.priceSub.split('.')[0]}
        </p>
      </div>

      <p className={`text-xs leading-relaxed mb-4 flex-1 ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
        <span className={`font-semibold ${featured ? 'text-[var(--color-text-on-dark)]' : 'text-[var(--color-text)]'}`}>Best for: </span>
        {tier.bestFor}
      </p>

      <div className={`text-[10px] rounded-sm px-3 py-2 mb-5 leading-relaxed ${featured ? 'bg-[rgba(202,138,4,0.12)] text-[var(--color-gold-cta)]' : 'bg-[var(--color-gold-muted)] text-[var(--color-gold)]'}`}>
        {tier.guarantee.split('.')[0]}.
      </div>

      <a
        href={tier.email}
        className={`block w-full text-center text-[11px] tracking-widest uppercase font-semibold px-6 py-3.5 rounded-sm transition-all ${
          featured
            ? 'text-[var(--color-navy)] bg-[var(--color-gold-cta)] hover:brightness-110 gold-pulse'
            : 'text-[var(--color-navy)] bg-[var(--color-gold)] hover:brightness-110'
        }`}
      >
        {tier.ctaLabel}
      </a>
      <p className={`text-[9px] text-center mt-2 ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
        {tier.ctaNote}
      </p>
    </motion.div>
  )
}

function TierDetail({ tier, reversed = false }: { tier: Tier; reversed?: boolean }) {
  const ref = useScrollReveal<HTMLElement>()
  const featured = tier.id === 2

  return (
    <section
      ref={ref}
      id={`tier-${tier.id}`}
      className={`scroll-reveal border-y border-[var(--color-gold-muted)] ${
        featured ? 'bg-[var(--color-navy)]' : 'bg-[var(--color-bg)]'
      }`}
    >
      <div className={`max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${reversed ? 'lg:grid-flow-dense' : ''}`}>

        {/* Content */}
        <div className={reversed ? 'lg:col-start-2' : ''}>
          <p className={`text-[10px] tracking-[0.3em] uppercase font-semibold mb-2 ${featured ? 'text-[var(--color-gold-cta)]' : 'text-[var(--color-gold)]'}`}>
            Tier {tier.id}
          </p>
          <h2 className={`font-serif text-3xl md:text-4xl leading-tight mb-4 ${featured ? 'text-[var(--color-text-on-dark)]' : 'text-[var(--color-text)]'}`}>
            {tier.name}
          </h2>
          <p className={`text-sm leading-relaxed mb-8 ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
            {tier.promise}
          </p>

          {/* Phases accordion */}
          <p className={`text-[10px] tracking-widest uppercase font-semibold mb-3 ${featured ? 'text-[var(--color-gold-cta)]' : 'text-[var(--color-gold)]'}`}>
            How it works
          </p>
          <div className="mb-8">
            <PhasesAccordion phases={tier.phases} featured={featured} />
          </div>

          {/* Includes */}
          <p className={`text-[10px] tracking-widest uppercase font-semibold mb-3 ${featured ? 'text-[var(--color-gold-cta)]' : 'text-[var(--color-gold)]'}`}>
            What you get
          </p>
          <ul className="space-y-2 mb-6">
            {tier.includes.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <svg className="shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 6l2.5 2.5L10 3.5" stroke={featured ? '#CA8A04' : 'var(--color-gold)'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className={`text-xs leading-relaxed ${
                  item.startsWith('Everything')
                    ? (featured ? 'text-[var(--color-gold-cta)] font-semibold' : 'text-[var(--color-gold)] font-semibold')
                    : (featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]')
                }`}>
                  {item}
                </span>
              </li>
            ))}
          </ul>

          {/* Not included */}
          <p className={`text-[10px] tracking-widest uppercase font-semibold mb-3 ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
            Not included
          </p>
          <ul className="space-y-1">
            {tier.excludes.map((item, i) => (
              <li key={i} className={`text-xs flex items-start gap-2 ${featured ? 'text-[var(--color-text-muted-dark)]/70' : 'text-[var(--color-text-muted)]/70'}`}>
                <span className="mt-px shrink-0 opacity-50">—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing card */}
        <div className={`lg:sticky lg:top-28 ${reversed ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
          <div className={`rounded-sm border p-6 ${
            featured
              ? 'bg-[var(--color-navy-2)] border-[var(--color-gold-cta)]'
              : 'bg-[var(--color-surface)] border-[var(--color-gold-muted)]'
          }`}>
            <p className={`text-[10px] tracking-[0.3em] uppercase mb-1 ${featured ? 'text-[var(--color-gold-cta)]' : 'text-[var(--color-gold)]'}`}>
              Investment
            </p>
            <p className={`font-serif text-3xl mb-1 ${featured ? 'text-[var(--color-text-on-dark)]' : 'text-[var(--color-text)]'}`}>
              {tier.price}
            </p>
            <p className={`text-xs mb-6 leading-relaxed ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
              {tier.priceSub}
            </p>

            <div className="space-y-3 mb-6">
              {[
                { label: 'Duration', value: tier.length },
                { label: 'Lead time', value: tier.leadTime },
              ].map(({ label, value }) => (
                <div key={label} className={`flex justify-between text-xs ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
                  <span className="uppercase tracking-wider text-[10px]">{label}</span>
                  <span className={`font-semibold text-right max-w-[60%] ${featured ? 'text-[var(--color-text-on-dark)]' : 'text-[var(--color-text)]'}`}>{value}</span>
                </div>
              ))}
              <div className={`text-xs ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
                <p className="uppercase tracking-wider text-[10px] mb-1">Payment</p>
                <p className={`text-xs leading-relaxed ${featured ? 'text-[var(--color-text-on-dark)]' : 'text-[var(--color-text)]'}`}>{tier.payment}</p>
              </div>
            </div>

            <div className={`rounded-sm px-4 py-3 mb-4 text-xs leading-relaxed ${featured ? 'bg-[rgba(202,138,4,0.12)] text-[var(--color-gold-cta)]' : 'bg-[var(--color-gold-muted)] text-[var(--color-gold)]'}`}>
              <span className="font-semibold">Guarantee: </span>{tier.guarantee}
            </div>

            {tier.availability && (
              <div className={`rounded-sm px-4 py-3 mb-6 text-[10px] leading-relaxed ${featured ? 'border border-[var(--color-gold-muted)] text-[var(--color-text-muted-dark)]' : 'border border-[var(--color-gold-muted)] text-[var(--color-text-muted)]'}`}>
                {tier.availability}
              </div>
            )}

            <a
              href={tier.email}
              className={`block w-full text-center text-[11px] tracking-widest uppercase font-semibold px-6 py-3.5 rounded-sm transition-all ${
                featured
                  ? 'text-[var(--color-navy)] bg-[var(--color-gold-cta)] hover:brightness-110 gold-pulse'
                  : 'text-[var(--color-navy)] bg-[var(--color-gold)] hover:brightness-110'
              }`}
            >
              {tier.ctaLabel}
            </a>
            <p className={`text-[9px] text-center mt-2 ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
              {tier.ctaNote}
            </p>
          </div>

          {/* ROI math — Tier 2 only */}
          {tier.id === 2 && (
            <div className="mt-4 border border-[var(--color-gold-muted)] rounded-sm p-5">
              <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold-cta)] font-semibold mb-3">The maths</p>
              <p className="text-xs text-[var(--color-text-muted-dark)] leading-relaxed mb-2">
                If your farm does $50K/month at 12% margin ($6K/month), a 10-point improvement takes you to 22% ($11K/month). That's an extra <span className="text-white font-semibold">$5,000 per month</span>.
              </p>
              <p className="text-xs text-[var(--color-text-muted-dark)] leading-relaxed">
                The program pays for itself in 3–5 months. After one year you are $60K ahead. The Operations Manual is yours forever — you can train staff with it, sell the farm with it.
              </p>
            </div>
          )}

          {/* Success fee note — Tier 3 only */}
          {tier.id === 3 && (
            <div className="mt-4 border border-[var(--color-gold-muted)] rounded-sm p-5">
              <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] font-semibold mb-3">Success fee alternative</p>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Prefer to pay less upfront? $15K covers Phases 1–3, plus a 5% success fee on capital raised or sale price (capped at $50K). Ask me about this on the discovery call — it is only available to farms with a strong track record.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export function AuditPage() {
  const heroRef = useScrollReveal<HTMLElement>()
  const tableRef = useScrollReveal<HTMLElement>()
  const upgradeRef = useScrollReveal<HTMLElement>()
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
      <SEO
        title="The Aquaculture Operator's Value Ladder"
        description="Three tiers of consulting engagement — from a remote diagnostic audit to a full investor-ready enterprise program. Find your farm's hidden margin."
        url="/audit"
      />

      {/* ── Sticky CTA ─────────────────────────────── */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-3rem)] max-w-lg transition-all duration-500 ${showSticky ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="bg-[var(--color-navy)] border border-[var(--color-gold-cta)] rounded-sm p-4 shadow-2xl flex items-center justify-between gap-4">
          <div>
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold-cta)] font-semibold">3 Tiers Available</p>
            <p className="text-xs text-white/90">From $4,500 diagnosis to investor-ready exit.</p>
          </div>
          <a href="#tiers" className="text-[10px] tracking-widest uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-5 py-2.5 rounded-sm hover:brightness-110 transition-all whitespace-nowrap">
            See All Tiers
          </a>
        </div>
      </div>

      {/* ── Hero ───────────────────────────────────── */}
      <section ref={heroRef} className="scroll-reveal max-w-6xl mx-auto px-6 pt-12 pb-16 border-b border-[var(--color-gold-muted)]">
        <div className="max-w-4xl mb-12">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">Consulting Engagements</p>
          <div className="flex items-start justify-between gap-8 mb-6">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--color-text)] leading-tight flex-1">
              From Diagnosis<br className="hidden md:block" /> to Transformation<br className="hidden md:block" /> to Exit.
            </h1>
            <a
              href="#free-ebook"
              className="shrink-0 self-start mt-1 hidden sm:inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-semibold border border-[var(--color-gold-cta)] text-[var(--color-gold-cta)] px-4 py-2 rounded-sm hover:bg-[rgba(202,138,4,0.08)] transition-all"
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1v8M4 6.5l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Not sure which tier? Read the free guide first
            </a>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
            You do not need every tier. You need the tier that matches where your farm is bleeding. Start at the bottom. Move up only when you cannot fix it yourself.
          </p>
          {/* Mobile fallback for the "not sure" link */}
          <a
            href="#free-ebook"
            className="sm:hidden inline-flex items-center gap-2 mt-5 text-[10px] tracking-[0.2em] uppercase font-semibold border border-[var(--color-gold-cta)] text-[var(--color-gold-cta)] px-4 py-2 rounded-sm hover:bg-[rgba(202,138,4,0.08)] transition-all"
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1v8M4 6.5l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Not sure which tier? Read the free guide first
          </a>
        </div>

        {/* ── 3-tier overview cards ─────────────────── */}
        <div id="tiers" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map(tier => (
            <TierCard key={tier.id} tier={tier} featured={tier.id === 2} />
          ))}
        </div>
      </section>

      {/* ── Aerial break ───────────────────────────── */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src="/images/audit/persian-gulf-ponds.jpg"
          alt="Large-scale shrimp farm operations — aerial view"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[var(--color-navy)]/65" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="text-center max-w-2xl">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] mb-4">The Ladder Logic</p>
            <p className="font-serif text-2xl md:text-3xl text-white leading-snug">
              Tier 1 is the entry point. Tier 2 is where most revenue comes from. Tier 3 is where the real money is made.
            </p>
          </div>
        </div>
      </div>

      {/* ── Tier detail sections ────────────────────── */}
      <TierDetail tier={tiers[0]} />
      <TierDetail tier={tiers[1]} reversed />

      <div className="relative h-56 overflow-hidden">
        <img
          src="/images/hero/aerators-sunset.jpg"
          alt="Pond aerators at sunset"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[var(--color-navy)]/55" />
      </div>

      <TierDetail tier={tiers[2]} />

      {/* ── Comparison table ───────────────────────── */}
      <section ref={tableRef} className="scroll-reveal max-w-6xl mx-auto px-6 py-16 border-b border-[var(--color-gold-muted)]">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2">Side by Side</p>
        <h2 className="font-serif text-2xl text-[var(--color-text)] mb-8">What each tier includes</h2>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[520px] text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-gold-muted)]">
                <th className="text-left py-3 pr-6 text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] font-normal w-1/2">Feature</th>
                <th className="text-center py-3 px-4 text-[10px] tracking-widest uppercase text-[var(--color-gold)] font-semibold">Tier 1</th>
                <th className="text-center py-3 px-4 text-[10px] tracking-widest uppercase text-[var(--color-gold-cta)] font-semibold bg-[rgba(202,138,4,0.04)] rounded-t-sm">Tier 2</th>
                <th className="text-center py-3 px-4 text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] font-semibold">Tier 3</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, i) => (
                <tr key={i} className={`border-b border-[var(--color-gold-muted)] ${i % 2 === 0 ? '' : 'bg-[var(--color-surface-2)]/40'}`}>
                  <td className="py-3 pr-6 text-[var(--color-text-muted)]">{row.feature}</td>
                  <td className="text-center py-3 px-4 text-[var(--color-gold)]">{row.t1}</td>
                  <td className="text-center py-3 px-4 text-[var(--color-gold-cta)] bg-[rgba(202,138,4,0.04)]">{row.t2}</td>
                  <td className="text-center py-3 px-4 text-[var(--color-text-muted)]">{row.t3}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-[var(--color-gold-muted)]">
                <td className="py-3 pr-6 font-semibold text-[var(--color-text)]">Price range</td>
                <td className="text-center py-3 px-4 font-semibold text-[var(--color-gold)]">$4.5K–$7.5K</td>
                <td className="text-center py-3 px-4 font-semibold text-[var(--color-gold-cta)] bg-[rgba(202,138,4,0.04)]">$15K–$25K</td>
                <td className="text-center py-3 px-4 font-semibold text-[var(--color-text-muted)]">$25K–$50K+</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Upgrade path ───────────────────────────── */}
      <section ref={upgradeRef} className="scroll-reveal bg-[var(--color-navy)] border-y border-[var(--color-gold-muted)]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] mb-2">How to Move Between Tiers</p>
          <h2 className="font-serif text-2xl text-[var(--color-text-on-dark)] mb-10">The ladder is not a funnel. It is a path.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upgrades.map((u, i) => (
              <div key={i} className="bg-[var(--color-navy-2)] border border-[var(--color-gold-muted)] rounded-sm p-5">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] font-semibold mb-3">{u.from}</p>
                <p className="text-xs text-[var(--color-text-muted-dark)] leading-relaxed">{u.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Decision guide ─────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-b border-[var(--color-gold-muted)]">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2">Which Tier Should You Choose?</p>
        <h2 className="font-serif text-2xl text-[var(--color-text)] mb-8">Start here.</h2>
        <div className="space-y-0">
          {decisions.map((d, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 py-5 border-b border-[var(--color-gold-muted)] items-center">
              <div className="md:col-span-2">
                <p className="text-sm text-[var(--color-text-muted)]">{d.condition}</p>
              </div>
              <div>
                <span className={`text-sm font-semibold ${d.color}`}>{d.tier}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Social proof ───────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-b border-[var(--color-gold-muted)]">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2">Field Results</p>
        <h2 className="font-serif text-2xl text-[var(--color-text)] mb-10">What the work delivers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {caseStudies.map(cs => (
            <div key={cs.client} className="flex flex-col gap-4 p-6 bg-[var(--color-surface-2)] border border-[var(--color-gold-muted)] rounded-sm">
              <div className="flex items-center gap-3">
                <span className="font-serif text-2xl text-[var(--color-gold)]">{cs.metric}</span>
                <span className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted)]">{cs.metricLabel}</span>
              </div>
              <p className="text-xs italic text-[var(--color-text-muted)] leading-relaxed">"{cs.outcome.split('.')[0]}."</p>
              <div className="mt-auto pt-3 border-t border-[var(--color-gold-muted)]">
                <p className="text-[10px] font-semibold text-[var(--color-text)]">{cs.client}</p>
                <p className="text-[9px] text-[var(--color-text-muted)]">{cs.region}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Free ebook lead magnet ─────────────────── */}
      <section id="free-ebook" className="max-w-6xl mx-auto px-6 py-16 border-b border-[var(--color-gold-muted)]">
        <div className="bg-[var(--color-navy)] border border-[var(--color-gold-cta)] rounded-sm overflow-hidden flex flex-col md:flex-row items-stretch shadow-[0_0_40px_rgba(202,138,4,0.1)]">
          <div className="w-full md:w-48 shrink-0 bg-[var(--color-navy-2)] flex items-center justify-center p-6">
            <img
              src="/images/products/farm-audit-thumbnail.png"
              alt="Aquaculture Profit Leak Audit — Free Ebook"
              className="w-full max-w-[140px] md:max-w-none rounded-sm shadow-lg"
            />
          </div>
          <div className="flex flex-col justify-center px-8 py-8 gap-4 flex-1">
            <div>
              <p className="text-[9px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] font-semibold mb-2">Free Ebook</p>
              <h2 className="font-serif text-2xl md:text-3xl text-white leading-snug mb-3">
                Aquaculture Profit Leak Audit
              </h2>
              <p className="text-sm text-[var(--color-text-muted-dark)] leading-relaxed max-w-xl">
                Before you invest in any tier, read this. It maps every category of profit leak in a working aquaculture system — feed waste, invisible mortality, energy drag, SOP gaps — with the diagnostic metrics that reveal them. Use it to score your operation before our first conversation.
              </p>
            </div>
            <a
              href="/downloads/aquaculture-profit-leak-audit.pdf"
              download
              className="gold-pulse inline-flex items-center gap-2 self-start text-[11px] tracking-widest uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-7 py-3 rounded-sm hover:brightness-110 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1v8M4 6.5l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Download Free — PDF
            </a>
          </div>
        </div>
      </section>

      {/* ── Free diagnostic tools cross-nav ────────── */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-b border-[var(--color-gold-muted)]">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-6">Not ready for an audit? Start here — all free</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: '/diagnostic',      label: 'Farm Diagnostic',    sub: '6 questions · health score' },
            { to: '/benchmark',       label: 'Benchmark Tool',     sub: 'FCR · survival · $/kg · DO' },
            { to: '/valuation',       label: 'Valuation Calc',     sub: 'What is your farm worth?' },
            { to: '/symptom-checker', label: 'AI Symptom Check',   sub: 'Describe a problem, get a diagnosis' },
          ].map(l => (
            <Link key={l.to} to={l.to}
              className="block p-4 bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm hover:border-[var(--color-gold)] transition-all group text-center">
              <p className="text-xs font-semibold text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors mb-1">{l.label}</p>
              <p className="text-[10px] text-[var(--color-text-muted)] leading-snug">{l.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-16">
        <div className="border border-[var(--color-gold-muted)] rounded-sm p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-serif text-2xl text-[var(--color-text)] mb-3">Not sure which tier is right for you?</p>
            <p className="text-sm text-[var(--color-text-muted)] max-w-xl leading-relaxed">
              Send me a brief description of your operation and your audit score. I will tell you honestly which tier fits — or whether you should start with the free audit first.
            </p>
          </div>
          <div className="shrink-0 flex flex-col gap-3">
            <a
              href={T2_EMAIL}
              className="gold-pulse inline-block text-center text-[11px] tracking-widest uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-8 py-3.5 rounded-sm hover:brightness-110 transition-all"
            >
              Apply for Tier 2 →
            </a>
            <a
              href={T1_EMAIL}
              className="inline-block text-center text-[11px] tracking-widest uppercase font-semibold text-[var(--color-text-muted)] border border-[var(--color-gold-muted)] px-8 py-3.5 rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all"
            >
              Book Tier 1 →
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
