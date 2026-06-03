import { useScrollReveal } from '../hooks/useScrollReveal'
import { SEO } from '../components/ui/SEO'
import { useState, useEffect } from 'react'

const scope = [
  {
    area: 'Operational Efficiency',
    detail: 'Farming practices, resource utilisation (water, feed, energy), labour management, production cycles, and stocking decisions. Every loss point mapped against its cost.',
  },
  {
    area: 'Feed & FCR Analysis',
    detail: 'Feed conversion ratio across all production units. Where the leakage is, what is driving it, and the sequence of interventions to close the gap within the first 30 days.',
  },
  {
    area: 'Water Quality Systems',
    detail: 'Current monitoring protocols, intervention timing, and system design gaps. If the water management is masking a structural problem, this is where it surfaces.',
  },
  {
    area: 'Financial Performance',
    detail: 'Revenue streams, cost centres, input costs, and profitability by unit. Cost-per-kg calculated by pond type, season, and system — with a clear picture of where margin is being destroyed.',
  },
  {
    area: 'Technology & Data Stack',
    detail: 'Review of existing tools, sensors, and data management systems. ROI analysis on any technology already deployed or under consideration.',
  },
  {
    area: 'Sustainability & Compliance',
    detail: 'Environmental practices, waste management, certification readiness, and the relationship between ecological performance and financial resilience.',
  },
]

const deliverables = [
  {
    item: '10-Page Audit Report',
    detail: 'Current state analysis, identified opportunities, and prioritised recommendations across all six audit areas.',
  },
  {
    item: 'Executive Summary',
    detail: 'One-page overview of the top findings and the three highest-impact actions. Designed for owner review and investor presentation.',
  },
  {
    item: '90-Day Action Plan',
    detail: 'Prioritised implementation roadmap with expected impact, required resources, and sequenced timelines. Built to execute, not to sit on a shelf.',
  },
  {
    item: 'Post-Delivery Debrief',
    detail: 'One-hour session to walk through findings, answer questions, and confirm alignment on the implementation plan.',
  },
]

const process = [
  { step: '01', label: 'Discovery Call', detail: '30-minute scoping call to understand your operation, confirm fit, and outline the engagement.', image: null },
  { step: '02', label: 'Data Request', detail: 'You provide production records, financial statements, and operational data prior to the on-site visit.', image: null },
  { step: '03', label: 'On-Site Audit', detail: 'One week on your farm. Direct observation, structured interviews with management and technical staff, and systematic facility review.', image: '/images/hero/hazem-at-ponds.jpg' },
  { step: '04', label: 'Analysis', detail: '2–3 weeks of data analysis, benchmarking against industry performance, and recommendation development.', image: null },
  { step: '05', label: 'Report Delivery', detail: 'Final 10-page report delivered with a live debrief session. Findings presented, questions answered, roadmap confirmed.', image: null },
]

export function AuditPage() {
  const headerRef = useScrollReveal<HTMLElement>()
  const whoRef = useScrollReveal<HTMLElement>()
  const scopeRef = useScrollReveal<HTMLDivElement>()
  const delivRef = useScrollReveal<HTMLDivElement>()
  const processRef = useScrollReveal<HTMLElement>()

  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
      <SEO
        title="90-Day Farm Profitability Audit"
        description="A structured, on-site diagnostic engagement that identifies exactly where your operation is losing money and delivers a clear 90-day roadmap for closing the gap."
      />

      {/* Sticky CTA for conversion */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-3rem)] max-w-lg transition-all duration-500 ${showSticky ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="bg-[var(--color-navy)] border border-[var(--color-gold-cta)] rounded-sm p-4 shadow-2xl flex items-center justify-between gap-4">
          <div>
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold-cta)] font-semibold">90-Day Audit</p>
            <p className="text-xs text-white/90">Find your hidden margin.</p>
          </div>
          <a
            href="mailto:hazemshan1@gmail.com?subject=90-Day Farm Profitability Audit — Enquiry"
            className="text-[10px] tracking-widest uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-5 py-2.5 rounded-sm hover:brightness-110 transition-all whitespace-nowrap"
          >
            Enquire Now
          </a>
        </div>
      </div>

      {/* ── Header ──────────────────────────────────── */}
      <section ref={headerRef} className="scroll-reveal max-w-6xl mx-auto px-6 pt-12 pb-16 border-b border-[var(--color-gold-muted)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left — title + description */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">Premium Consulting Engagement</p>
              <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] leading-tight mb-6">
                The 90-Day Farm Profitability Audit
              </h1>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                A structured, on-site diagnostic engagement that identifies exactly where your operation is losing money, ranks the opportunities by impact, and delivers a clear 90-day roadmap for closing the gap. Built for farms that are running but not performing at their financial ceiling.
              </p>
            </div>

            {/* On-site photo — shows what the engagement actually looks like */}
            <div className="relative rounded-sm overflow-hidden">
              <img
                src="/images/hero/hazem-consulting.jpg"
                alt="Hazem Shannak conducting an on-site farm consultation"
                className="w-full h-64 object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy)]/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-gold-cta)] font-semibold">
                  On-site. Not desk-based.
                </p>
                <p className="text-xs text-white/80 mt-1">
                  Hazem conducting a farm walkthrough — the same process applied to every audit engagement.
                </p>
              </div>
            </div>
          </div>

          {/* Right — pricing card */}
          <div className="lg:sticky lg:top-28">
            <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-3">Investment</p>
              <p className="font-serif text-4xl text-[var(--color-text)] mb-2">$5,000 – $8,000</p>
              <p className="text-xs text-[var(--color-text-muted)] mb-6 leading-relaxed">
                Fixed fee. Varies by farm size, complexity, and travel requirements. 50% upfront, 50% on delivery.
              </p>
              <ul className="space-y-2 mb-6">
                {['One week on-site', '10-page audit report', '90-day action plan', 'Post-delivery debrief'].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-xs text-[var(--color-text-muted)]">
                    <svg className="shrink-0" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 6l2.5 2.5L10 3.5" stroke="var(--color-gold)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:hazemshan1@gmail.com?subject=90-Day Farm Profitability Audit — Enquiry"
                className="block w-full text-center text-[11px] tracking-widest uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-6 py-3.5 rounded-sm hover:brightness-110 transition-all"
              >
                Enquire Now
              </a>
              <p className="text-[10px] text-[var(--color-text-muted)] text-center mt-3">
                Response within 48 hours
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who This Is For ──────────────────────────── */}
      <section ref={whoRef} className="scroll-reveal max-w-6xl mx-auto px-6 py-16 border-b border-[var(--color-gold-muted)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">Who This Is For</p>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              Farm owners and operators running established aquaculture or agri-enterprises — typically between $500K and $5M in annual revenue — who know something is underperforming but cannot pinpoint what, or who are preparing for investment and need the operation documented at a professional level.
            </p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">The Problem It Solves</p>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              Most farms run at 60–75% of their theoretical yield ceiling without understanding why. Feed conversion leaks, water quality blind spots, mis-allocated labour, and unseen cost drivers erode margins month after month. The losses are real but invisible until someone measures them properly.
            </p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">What Makes It Different</p>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              This is not a desk review. I spend a week on your farm — observing, interviewing, and measuring. The findings are grounded in what I see, not what the records say. Every recommendation comes with an expected financial impact and a practical implementation sequence.
            </p>
          </div>
        </div>
      </section>

      {/* ── Aerial scale break ────────────────────────── */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src="/images/audit/persian-gulf-ponds.jpg"
          alt="Large-scale shrimp farm operations — aerial view"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[var(--color-navy)]/65" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="text-center max-w-2xl">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] mb-4">The Opportunity</p>
            <p className="font-serif text-2xl md:text-3xl text-white leading-snug">
              Most farms are running. Very few are running at what they are actually capable of.
            </p>
          </div>
        </div>
      </div>

      {/* ── Audit scope ───────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-b border-[var(--color-gold-muted)]">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2">Audit Scope</p>
        <h2 className="font-serif text-2xl text-[var(--color-text)] mb-8">Six areas. Every one measured.</h2>
        <div ref={scopeRef} className="stagger-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scope.map((s, i) => (
            <div key={s.area} className="flex flex-col gap-3 p-5 bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm">
              <div className="flex items-center gap-3">
                <span className="text-[10px] tracking-widest text-[var(--color-gold-muted)]">0{i + 1}</span>
                <p className="text-sm font-semibold text-[var(--color-text)]">{s.area}</p>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{s.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Deliverables ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-b border-[var(--color-gold-muted)]">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2">What You Receive</p>
        <h2 className="font-serif text-2xl text-[var(--color-text)] mb-8">Four deliverables. One clear outcome.</h2>
        <div ref={delivRef} className="stagger-children grid grid-cols-1 md:grid-cols-2 gap-6">
          {deliverables.map(d => (
            <div key={d.item} className="flex gap-4 p-5 bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm">
              <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)] mb-1">{d.item}</p>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{d.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Process ───────────────────────────────────── */}
      <section ref={processRef} className="scroll-reveal max-w-6xl mx-auto px-6 py-16 border-b border-[var(--color-gold-muted)]">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2">How It Works</p>
        <h2 className="font-serif text-2xl text-[var(--color-text)] mb-10">Five steps. Three to four weeks total.</h2>
        <div className="flex flex-col gap-0">
          {process.map((p, i) => (
            <div key={p.step} className={`grid grid-cols-12 gap-6 ${i < process.length - 1 ? 'pb-8 mb-8 border-b border-[var(--color-gold-muted)]' : ''}`}>
              <div className="col-span-1">
                <span className="font-serif text-2xl text-[var(--color-gold-muted)]">{p.step}</span>
              </div>
              <div className="col-span-11 md:col-span-3">
                <p className="text-sm font-semibold text-[var(--color-text)]">{p.label}</p>
              </div>
              <div className={`col-span-11 ${p.image ? 'md:col-span-5' : 'md:col-span-8'}`}>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{p.detail}</p>
              </div>
              {p.image && (
                <div className="col-span-11 md:col-span-3">
                  <img
                    src={p.image}
                    alt="On-site farm audit — Hazem Shannak"
                    className="w-full h-32 object-cover object-center rounded-sm border border-[var(--color-gold-muted)]"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Aerator atmosphere strip ─────────────────── */}
      <div className="relative h-56 overflow-hidden">
        <img
          src="/images/hero/aerators-sunset.jpg"
          alt="Pond aerators at sunset"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[var(--color-navy)]/55" />
      </div>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-16">
        <div className="border border-[var(--color-gold-muted)] rounded-sm p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-serif text-2xl text-[var(--color-text)] mb-3">Ready to find out what your operation is actually worth?</p>
            <p className="text-sm text-[var(--color-text-muted)] max-w-xl leading-relaxed">
              Send a brief description of your operation and your primary challenge. I will review it and come back to you within 48 hours to confirm fit and scope.
            </p>
          </div>
          <div className="shrink-0">
            <a
              href="mailto:hazemshan1@gmail.com?subject=90-Day Farm Profitability Audit — Enquiry"
              className="gold-pulse inline-block text-center text-[11px] tracking-widest uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-8 py-3.5 rounded-sm hover:brightness-110 transition-all"
            >
              Send an Enquiry →
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}
