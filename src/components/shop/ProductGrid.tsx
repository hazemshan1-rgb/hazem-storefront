import { ProductCard } from './ProductCard'
import type { Product } from '../../types/product'

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--color-text-muted)] text-sm">No products in this category yet. Check back soon.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
