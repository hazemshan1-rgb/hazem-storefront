import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLemonSqueezy } from '../hooks/useLemonSqueezy'
import { CategoryFilter } from '../components/shop/CategoryFilter'
import { ProductGrid } from '../components/shop/ProductGrid'
import { getFiltered } from '../data/products'
import { SEO } from '../components/ui/SEO'
import type { ShopFilter } from '../types/product'

const VALID_FILTERS: ShopFilter[] = ['All', 'Free', 'Ebook', 'SOP', 'Toolkit', 'Training']

function parseFilterParam(param: string | null): ShopFilter {
  if (param && VALID_FILTERS.includes(param as ShopFilter)) {
    return param as ShopFilter
  }
  return 'All'
}

export function ShopPage() {
  const { t } = useTranslation()
  useLemonSqueezy()
  const [searchParams] = useSearchParams()
  const [activeFilter, setActiveFilter] = useState<ShopFilter>(
    () => parseFilterParam(searchParams.get('category'))
  )
  const filtered = getFiltered(activeFilter)

  const courses = [
    { titleKey: 'shop.course1Title', descKey: 'shop.course1Desc', levelKey: 'shop.course1Level' },
    { titleKey: 'shop.course2Title', descKey: 'shop.course2Desc', levelKey: 'shop.course2Level' },
    { titleKey: 'shop.course3Title', descKey: 'shop.course3Desc', levelKey: 'shop.course3Level' },
  ]

  return (
    <main className="max-w-6xl mx-auto px-6 pt-28 pb-20">
      <SEO
        title="Aquaculture Resources — Ebooks, SOPs & Toolkits"
        description="Field-tested ebooks, SOPs, and toolkits for aquaculture operators. Biofloc guides, IMTA primers, profit audit frameworks, and waste-reduction strategies from 30 years of hands-on practice."
        url="/shop"
      />
      <div className="mb-12">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2">
          {t('shop.storeEyebrow')}
        </p>
        <h1 className="font-serif text-4xl text-[var(--color-text)] mb-4">{t('shop.allResources')}</h1>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
          Field-tested across 15+ countries. Everything here was built from operating problems, not theory — each resource maps directly to a measurable outcome on a working farm.
        </p>
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[var(--color-gold-muted)]">
          {[
            { val: '30+', label: 'Years practice' },
            { val: '1,000+', label: 'Professionals trained' },
            { val: '$50M+', label: 'Farms restructured' },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col gap-0.5">
              <span className="font-serif text-xl text-[var(--color-gold)]">{stat.val}</span>
              <span className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted)]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
      <CategoryFilter active={activeFilter} onChange={setActiveFilter} />
      <ProductGrid products={filtered} />

      {/* Upcoming training */}
      <div className="mt-20 pt-16 border-t border-[var(--color-gold-muted)]">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-1">
              {t('shop.trainingSectionEyebrow')}
            </p>
            <h2 className="font-serif text-2xl text-[var(--color-text)]">
              {t('shop.trainingSectionTitle')}
            </h2>
          </div>
          <a href="/courses" className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors shrink-0">
            {t('shop.seeAllWaitlist')}
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.titleKey} className="card-hover bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[9px] tracking-widest uppercase text-[var(--color-gold)] bg-[var(--color-bg)] border border-[var(--color-gold-muted)] px-2 py-1 rounded-sm whitespace-nowrap">
                  {t('shop.comingSoon')}
                </span>
                <span className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted)]">
                  {t(course.levelKey)}
                </span>
              </div>
              <h3 className="font-serif text-base text-[var(--color-text)] leading-snug">
                {t(course.titleKey)}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed flex-1">
                {t(course.descKey)}
              </p>
              <a
                href="/courses"
                className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] hover:underline mt-auto pt-3 border-t border-[var(--color-gold-muted)]"
              >
                {t('shop.joinWaitlist')}
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
