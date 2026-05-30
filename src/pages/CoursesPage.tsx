import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const courses = [
  {
    title: 'Shrimp Farm Operations Masterclass',
    description: 'A complete operational framework for vannamei and monodon farms — from stocking decisions and feed management to water quality intervention and harvest planning. Built on 30 years of field deployment across Southeast Asia and the Middle East.',
    modules: ['Carrying capacity and stocking density', 'FCR optimisation and feed strategy', 'Water quality systems and intervention timing', 'Disease risk management', 'Harvest planning and post-harvest handling'],
    level: 'Intermediate to Advanced',
    format: 'Video + field reference materials',
  },
  {
    title: 'Aquaculture Business Fundamentals',
    description: 'For farm owners and investors who understand the biology but need to sharpen the business. Covers financial modelling, investor-readiness, cost structure, and strategic decision-making for aquaculture ventures at the $500K–$5M scale.',
    modules: ['Financial modelling for aquaculture', 'Cost drivers and margin leakage', 'Investor documentation and pitch preparation', 'Scaling decisions and capital allocation', 'Exit strategy and asset valuation'],
    level: 'All levels',
    format: 'Video + templates + case studies',
  },
  {
    title: 'Sustainable Systems Design',
    description: 'How to design, evaluate, and operate Integrated Multi-Trophic Aquaculture (IMTA), biofloc, and RAS systems. Covers the engineering logic, biological principles, and economic trade-offs that determine whether these systems work in the field.',
    modules: ['Biofloc management systems', 'RAS design and operational economics', 'IMTA species selection and stocking ratios', 'Waste-to-value conversion', 'Certification pathways and market positioning'],
    level: 'Advanced',
    format: 'Video + design templates',
  },
]

export function CoursesPage() {
  const headerRef = useScrollReveal<HTMLElement>()
  const gridRef = useScrollReveal<HTMLDivElement>()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">

      {/* Header */}
      <section ref={headerRef} className="scroll-reveal max-w-6xl mx-auto px-6 pt-12 pb-16 border-b border-[var(--color-gold-muted)]">
        <div className="max-w-2xl">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">Training Programmes</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] leading-tight mb-6">
            Structured learning from 30 years in the field
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-8 max-w-xl">
            These programmes are in development. Each one packages the diagnostic frameworks, operational systems, and business logic I use with clients — built for farm operators, technical managers, and investors who want depth, not surface-level content.
          </p>

          {/* Waitlist form */}
          {submitted ? (
            <div className="inline-flex items-center gap-3 border border-[var(--color-gold-muted)] rounded-sm px-6 py-4">
              <span className="w-2 h-2 rounded-full bg-[var(--color-gold)]" />
              <p className="text-sm text-[var(--color-text)]">You are on the list. I will be in touch when enrolment opens.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)]"
              />
              <button
                type="submit"
                className="shrink-0 text-xs tracking-widest uppercase font-semibold text-[var(--color-bg)] bg-[var(--color-gold)] px-6 py-2.5 rounded-sm hover:opacity-90 transition-opacity"
              >
                Join waitlist
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Course previews */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div ref={gridRef} className="stagger-children grid grid-cols-1 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <div
              key={course.title}
              className="card-hover flex flex-col bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6 gap-5"
            >
              <div>
                <span className="text-[9px] tracking-widest uppercase text-[var(--color-gold)] bg-[var(--color-bg)] border border-[var(--color-gold-muted)] px-2 py-1 rounded-sm">
                  Coming Soon
                </span>
              </div>

              <div>
                <h2 className="font-serif text-lg text-[var(--color-text)] leading-snug mb-3">
                  {course.title}
                </h2>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div>
                <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-2">Modules include</p>
                <ul className="space-y-1.5">
                  {course.modules.map(m => (
                    <li key={m} className="flex items-start gap-2 text-xs text-[var(--color-text-muted)]">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--color-gold-muted)] shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-4 border-t border-[var(--color-gold-muted)] flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)]">Level</span>
                  <span className="text-xs text-[var(--color-text)]">{course.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)]">Format</span>
                  <span className="text-xs text-[var(--color-text)]">{course.format}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-6xl mx-auto px-6 mt-4">
        <div className="border border-[var(--color-gold-muted)] rounded-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-serif text-xl text-[var(--color-text)] mb-2">Need answers now, not when the course launches?</p>
            <p className="text-xs text-[var(--color-text-muted)]">Book a one-hour consultation. Same depth, applied directly to your operation.</p>
          </div>
          <a
            href="/consultation"
            className="shrink-0 text-xs tracking-widest uppercase font-semibold text-[var(--color-bg)] bg-[var(--color-gold)] px-6 py-3 rounded-sm hover:opacity-90 transition-opacity"
          >
            Book a consultation →
          </a>
        </div>
      </section>

    </main>
  )
}
