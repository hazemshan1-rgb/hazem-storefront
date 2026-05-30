import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { GoldBadge } from '../components/ui/GoldBadge'
import { resources, resourceCategories } from '../data/resources'
import type { ResourceCategory } from '../data/resources'

type Filter = 'All' | ResourceCategory

function ResourceCard({ title, description, url, category, free }: {
  title: string
  description: string
  url: string
  category: ResourceCategory
  free: boolean
}) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6 flex flex-col gap-3 hover:border-[var(--color-gold)] hover:shadow-[0_4px_24px_rgba(139,108,58,0.12)] transition-all duration-300">
      <div className="flex items-start justify-between gap-3">
        <GoldBadge label={category} />
        <span className={`text-[9px] tracking-widest uppercase font-semibold px-2 py-0.5 rounded-sm ${
          free
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border border-[var(--color-gold-muted)]'
        }`}>
          {free ? 'Free' : 'Subscription'}
        </span>
      </div>

      <h3 className="font-serif text-lg text-[var(--color-text)] leading-snug">{title}</h3>

      <p className="text-xs text-[var(--color-text-muted)] leading-relaxed flex-1">{description}</p>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-semibold text-[var(--color-gold)] hover:underline mt-auto pt-2 border-t border-[var(--color-gold-muted)]"
      >
        Visit Resource
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </div>
  )
}

export function ResourcesPage() {
  const [active, setActive] = useState<Filter>('All')
  const headerRef = useScrollReveal<HTMLElement>()

  const filters: Filter[] = ['All', ...resourceCategories]
  const filtered = active === 'All' ? resources : resources.filter(r => r.category === active)

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
      {/* Header */}
      <section ref={headerRef} className="scroll-reveal max-w-6xl mx-auto px-6 pt-12 pb-10">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-3">Resources Library</p>
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] mb-5 max-w-2xl leading-tight">
          The sources that matter in aquaculture
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
          Curated from 30 years of field work across 15 countries. These are the databases, journals, standards bodies, and trade publications that serious operators, investors, and buyers actually use. No fluff — just the references worth bookmarking.
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-4">
          {resources.length} resources · {resources.filter(r => r.free).length} free
        </p>
      </section>

      {/* Coming training — shown before resource grid so it's immediately visible */}
      <section className="max-w-6xl mx-auto px-6 pb-12 border-b border-[var(--color-gold-muted)]">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-1">Coming Soon</p>
            <h2 className="font-serif text-2xl text-[var(--color-text)]">Training Programmes</h2>
          </div>
          <a href="/courses" className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors shrink-0">
            See all →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Shrimp Farm Operations Masterclass',
              description: 'Carrying capacity, FCR optimisation, water quality systems, disease risk, and harvest planning — built for vannamei and monodon operators.',
              level: 'Intermediate to Advanced',
            },
            {
              title: 'Aquaculture Business Fundamentals',
              description: 'Financial modelling, investor-readiness, cost structure, and strategic decision-making for aquaculture ventures at the $500K–$5M scale.',
              level: 'All levels',
            },
            {
              title: 'Sustainable Systems Design',
              description: 'Design, evaluate, and operate IMTA, biofloc, and RAS systems — from engineering logic and biological principles to economic trade-offs.',
              level: 'Advanced',
            },
          ].map(course => (
            <div key={course.title} className="card-hover bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[9px] tracking-widest uppercase text-[var(--color-gold)] bg-[var(--color-bg)] border border-[var(--color-gold-muted)] px-2 py-1 rounded-sm whitespace-nowrap">
                  Coming Soon
                </span>
                <span className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted)]">{course.level}</span>
              </div>
              <h3 className="font-serif text-base text-[var(--color-text)] leading-snug">{course.title}</h3>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed flex-1">{course.description}</p>
              <a
                href="/courses"
                className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] hover:underline mt-auto pt-3 border-t border-[var(--color-gold-muted)]"
              >
                Join waitlist →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Filters */}
      <div className="border-b border-[var(--color-gold-muted)] bg-[var(--color-surface)] sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-6 py-0 flex gap-0 overflow-x-auto">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`text-[10px] tracking-widest uppercase font-semibold px-4 py-4 border-b-2 transition-colors whitespace-nowrap ${
                active === f
                  ? 'border-[var(--color-gold)] text-[var(--color-gold)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(r => (
            <ResourceCard key={r.url} {...r} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-sm text-[var(--color-text-muted)] py-16">No resources in this category yet.</p>
        )}
      </section>

      {/* CTA strip */}
      <section className="max-w-6xl mx-auto px-6 mt-20">
        <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2">Go Deeper</p>
            <h2 className="font-serif text-2xl text-[var(--color-text)] mb-2">Need a diagnosis, not just a reading list?</h2>
            <p className="text-sm text-[var(--color-text-muted)] max-w-lg leading-relaxed">
              The resources here will build your knowledge. A one-hour consultation applies that knowledge directly to your operation.
            </p>
          </div>
          <a
            href="/consultation"
            className="inline-flex items-center justify-center bg-[var(--color-gold)] text-[var(--color-bg)] px-8 py-4 text-xs tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all whitespace-nowrap shrink-0"
          >
            Book a Consultation
          </a>
        </div>
      </section>
    </main>
  )
}
