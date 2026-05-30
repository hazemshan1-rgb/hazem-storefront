import { useState } from 'react'
import { useLemonSqueezy } from '../hooks/useLemonSqueezy'
import { CategoryFilter } from '../components/shop/CategoryFilter'
import { ProductGrid } from '../components/shop/ProductGrid'
import { getByCategory } from '../data/products'
import type { ProductCategory } from '../types/product'

const upcomingCourses = [
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
]

export function ShopPage() {
  useLemonSqueezy()
  const [activeCategory, setActiveCategory] = useState<'All' | ProductCategory>('All')
  const filtered = getByCategory(activeCategory)

  return (
    <main className="max-w-6xl mx-auto px-6 pt-28 pb-20">
      <div className="mb-12">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2">Knowledge Store</p>
        <h1 className="font-serif text-4xl text-[var(--color-text)]">All Resources</h1>
      </div>
      <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      <ProductGrid products={filtered} />

      {/* Upcoming training */}
      <div className="mt-20 pt-16 border-t border-[var(--color-gold-muted)]">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-1">Coming Soon</p>
            <h2 className="font-serif text-2xl text-[var(--color-text)]">Training Programmes</h2>
          </div>
          <a href="/courses" className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors shrink-0">
            See all &amp; join waitlist →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingCourses.map(course => (
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
      </div>
    </main>
  )
}
