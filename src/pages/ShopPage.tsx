import { useState } from 'react'
import { useLemonSqueezy } from '../hooks/useLemonSqueezy'
import { CategoryFilter } from '../components/shop/CategoryFilter'
import { ProductGrid } from '../components/shop/ProductGrid'
import { getByCategory } from '../data/products'
import type { ProductCategory } from '../types/product'

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
    </main>
  )
}
