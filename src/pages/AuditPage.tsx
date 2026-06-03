import { useRef, useState, useEffect } from 'react'
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
    priceSub: 'Depends on farm size, species count, and data quality',
    length: '30 days',
    bestFor: 'Operators who scored 11–15 on the audit, have discipline, and will execute a roadmap themselves.',
    promise: 'You will know exactly where your farm is leaking money — every leak with a dollar amount attached. If you follow the action plan and see no margin improvement within 90 days, I refund every cent.',
    guarantee: '5% margin improvement or full refund',
    payment: '100% upfront (or 50/50 split on request)',
    leadTime: '2–3 weeks from signing to report delivery',
    includes: [
      '30–40 page custom diagnostic report',
      'Real FCR, invisible mortality, and energy cost per kg from your data',
      'Ranked list of 7 leaks with dollar values attached to each',
      '90-day action plan — what to fix, in what order, with what tool',
      '3 hours remote consultation (1 × 90-min kickoff + 2 × 45-min progress calls)',
      'PDF templates: feed tray log, mortality log, water quality log, DO log',
    ],
    excludes: [
      'On-site visit',
      'Weekly accountability calls',
      'Staff training',
      'Operations Manual',
      'Margin improvement guarantee (satisfaction guarantee applies instead)',
    ],
    email: T1_EMAIL,
    ctaLabel: 'Book Tier 1 →',
    ctaNote: 'No application needed. Pay and I send the data intake form.',
  },
  {
    id: 2,
    name: '90-Day Farm Profitability Transformation™',
    tagline: 'The core product. Guaranteed result.',
    price: '$15,000 – $25,000',
    priceSub: 'Single-species single-site from $15K. Multiple species or sites from $20K.',
    length: '90 days',
    bestFor: 'Operators who scored 16+, or scored 11–15 but could not execute Tier 1 alone. Monthly revenue $30K–$150K.',
    promise: 'In 90 days, I will increase your net operating margin by a minimum of 10 percentage points. If we fail, you do not pay the final milestone.',
    guarantee: '10-percentage-point margin improvement or Milestone 3 is waived',
    payment: '3 milestones: 33% at signing, 34% at Phase 2 start, 33% at Phase 3 end (only if guarantee is met)',
    leadTime: '4–6 weeks from signing to start',
    includes: [
      'Everything in Tier 1, plus:',
      '5-day on-site immersion (travel included within your country)',
      'Daily shadowing, hands-on diagnostics, side-by-side trials',
      'Staff training workshops and SOP writing together',
      'Laminated Command Board for your feed shed (5 key metrics, updated daily)',
      'Weekly 60-min accountability calls for 12 weeks',
      'Remote mid-week monitoring (Wednesday log review, voice note if something is wrong)',
      'Second 3-day on-site visit at Week 9 to audit progress and retrain',
      'Complete Operations Manual — 50–80 pages, custom to your farm, printed and bound',
      'Digital dashboard (Google Sheets auto-calculating margins from daily entries)',
      '30-min "Farm in a Box" video for your future manager or buyer',
    ],
    excludes: [
      'Investor introductions',
      'Legal or accounting work',
      'Ongoing support beyond 90 days (hourly aftercare at $400/hr available)',
    ],
    email: T2_EMAIL,
    ctaLabel: 'Apply for Tier 2 →',
    ctaNote: 'I review every application personally. 3 operators per quarter.',
  },
  {
    id: 3,
    name: 'Investor-Ready Enterprise Program',
    tagline: 'Raise capital. Sell the farm. Scale.',
    price: '$25,000 – $50,000+',
    priceSub: 'Custom quote. Base $35K for a single-site farm with clean books. Discount of $5K for Tier 2 graduates.',
    length: '180 days',
    bestFor: 'Operations with $100K+/month revenue and 15%+ margin, ready to raise $200K–$5M or sell within 12–24 months.',
    promise: 'In 180 days, your farm will pass investor due diligence. If no term sheet, LOI, or investor commitment arrives within 12 months, I extend with 6 months of quarterly check-ins at no cost.',
    guarantee: 'Term sheet or LOI within 12 months, or 6 months of free check-ins',
    payment: '6 milestones (20/20/20/15/15/10). Milestone 6 is waived if no deal closes within 12 months.',
    leadTime: '4–6 weeks (requires Tier 2 completion or equivalent operational proof)',
    includes: [
      'Everything in Tier 2, plus:',
      'Full financial modeling — 3-year P&L, cash flow, balance sheet, sensitivity analysis',
      'Investor-grade business plan (30–40 pages)',
      'Virtual data room setup — all SOPs, logs, permits, financials indexed for investor review',
      '15–20 slide pitch deck and 2-page investor teaser',
      'Introduction to 50–100 targeted capital sources',
      'At least 5–10 warm introductions from my personal network',
      'Exit readiness assessment and valuations (3–5× trailing EBITDA)',
      '2 additional on-site visits (investor walkthrough prep)',
      '4 quarterly check-in calls for 12 months after program end',
    ],
    excludes: [
      'Guaranteed funding (I do not control investors)',
      'Legal representation (you need your own lawyer)',
      'Ongoing CFO services after the program',
    ],
    email: T3_EMAIL,
    ctaLabel: 'Apply for Tier 3 →',
    ctaNote: 'Application + 90-minute discovery call required. Must have completed Tier 2.',
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
  { feature: 'Virtual data room', t1: '—', t2: '—', t3: '✓' },
  { feature: 'Investor/buyer introductions', t1: '—', t2: '—', t3: '✓' },
  { feature: 'Quarterly check-ins (1 year)', t1: '—', t2: '—', t3: '✓' },
]

// ─── Decision guide ──────────────────────────────────────────────────────────

const decisions = [
  { condition: 'Doing $30K–$60K/month, score 11–15, have a good manager, just need direction', tier: 'Tier 1', color: 'text-[var(--color-gold)]' },
  { condition: 'Doing $30K–$150K/month, score 16+, no SOPs, crew needs training, you are exhausted', tier: 'Tier 2', color: 'text-[var(--color-gold-cta)]' },
  { condition: 'Doing $100K+/month, margins healthy (15%+), want to raise capital or sell in 12–24 months', tier: 'Tier 3', color: 'text-[var(--color-text-on-dark)]' },
  { condition: 'Doing under $30K/month or scored below 11', tier: 'Start with the free audit', color: 'text-[var(--color-text-muted-dark)]' },
]

// ─── Upgrade path ────────────────────────────────────────────────────────────

const upgrades = [
  {
    from: 'Tier 1 → Tier 2',
    detail: 'If you buy Tier 1 and decide within 30 days of receiving the report that you want to upgrade, I credit 100% of what you paid toward Tier 2. You only pay the difference. The $5,000 becomes a down payment, not a sunk cost.',
  },
  {
    from: 'Tier 2 → Tier 3',
    detail: 'If you are in Tier 2 and realise you want to raise capital or sell, Tier 3 is a separate engagement. Because you already have the Operations Manual and the logs, I discount Tier 3 by $5,000.',
  },
  {
    from: 'Tier 1 → Tier 3',
    detail: 'Not recommended. You need the operational foundation first. If you insist, Tier 2 is included in the Tier 3 price. But I will require proof that your operations are clean before I make any investor introductions.',
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

function TierCard({ tier, featured = false }: { tier: typeof tiers[0]; featured?: boolean }) {
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
            Most Popular
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
          {tier.length} · {tier.priceSub}
        </p>
      </div>

      <p className={`text-xs leading-relaxed mb-4 flex-1 ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
        <span className={`font-semibold ${featured ? 'text-[var(--color-text-on-dark)]' : 'text-[var(--color-text)]'}`}>Best for: </span>
        {tier.bestFor}
      </p>

      <div className={`text-[10px] rounded-sm px-3 py-2 mb-5 ${featured ? 'bg-[rgba(202,138,4,0.12)] text-[var(--color-gold-cta)]' : 'bg-[var(--color-gold-muted)] text-[var(--color-gold)]'}`}>
        {tier.guarantee}
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

function TierDetail({ tier, reversed = false }: { tier: typeof tiers[0]; reversed?: boolean }) {
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
          <p className={`text-sm leading-relaxed mb-6 ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
            {tier.promise}
          </p>

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
                  item.startsWith('Everything') ? (featured ? 'text-[var(--color-gold-cta)] font-semibold' : 'text-[var(--color-gold)] font-semibold') : (featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]')
                }`}>
                  {item}
                </span>
              </li>
            ))}
          </ul>

          {/* Excludes */}
          <p className={`text-[10px] tracking-widest uppercase font-semibold mb-3 ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
            Not included
          </p>
          <ul className="space-y-1">
            {tier.excludes.map((item, i) => (
              <li key={i} className={`text-xs ${featured ? 'text-[var(--color-text-muted-dark)]/70' : 'text-[var(--color-text-muted)]/70'} flex items-start gap-2`}>
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
              <div className={`flex justify-between text-xs ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
                <span className="uppercase tracking-wider text-[10px]">Duration</span>
                <span className={`font-semibold ${featured ? 'text-[var(--color-text-on-dark)]' : 'text-[var(--color-text)]'}`}>{tier.length}</span>
              </div>
              <div className={`flex justify-between text-xs ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
                <span className="uppercase tracking-wider text-[10px]">Payment</span>
                <span className={`font-semibold text-right max-w-[60%] ${featured ? 'text-[var(--color-text-on-dark)]' : 'text-[var(--color-text)]'}`}>{tier.payment}</span>
              </div>
              <div className={`flex justify-between text-xs ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
                <span className="uppercase tracking-wider text-[10px]">Lead time</span>
                <span className={`font-semibold ${featured ? 'text-[var(--color-text-on-dark)]' : 'text-[var(--color-text)]'}`}>{tier.leadTime}</span>
              </div>
            </div>

            <div className={`rounded-sm px-4 py-3 mb-6 text-xs leading-relaxed ${featured ? 'bg-[rgba(202,138,4,0.12)] text-[var(--color-gold-cta)]' : 'bg-[var(--color-gold-muted)] text-[var(--color-gold)]'}`}>
              <span className="font-semibold">Guarantee: </span>{tier.guarantee}
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
          </div>
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
        <div className="max-w-3xl mb-12">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">Consulting Engagements</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--color-text)] leading-tight mb-6">
            From Diagnosis<br className="hidden md:block" /> to Transformation<br className="hidden md:block" /> to Exit.
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
            You do not need every tier. You need the tier that matches where your farm is bleeding. Start at the bottom. Move up only when you cannot fix it yourself.
          </p>
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

      {/* ── Tier 1 detail ──────────────────────────── */}
      <TierDetail tier={tiers[0]} />

      {/* ── Tier 2 detail ──────────────────────────── */}
      <TierDetail tier={tiers[1]} reversed />

      {/* ── Aerator atmosphere strip ───────────────── */}
      <div className="relative h-56 overflow-hidden">
        <img
          src="/images/hero/aerators-sunset.jpg"
          alt="Pond aerators at sunset"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[var(--color-navy)]/55" />
      </div>

      {/* ── Tier 3 detail ──────────────────────────── */}
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

      {/* ── Final CTA ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-16">
        <div className="border border-[var(--color-gold-muted)] rounded-sm p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-serif text-2xl text-[var(--color-text)] mb-3">Not sure which tier is right for you?</p>
            <p className="text-sm text-[var(--color-text-muted)] max-w-xl leading-relaxed">
              Send me a brief description of your operation and your score. I will tell you honestly which tier fits — or whether you should start with the free audit first.
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
