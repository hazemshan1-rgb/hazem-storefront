import { Link } from 'react-router-dom'
import { getFeatured } from '../../data/products'
import { ProductCard } from '../shop/ProductCard'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function FeaturedProducts() {
  const featured = getFeatured()
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="scroll-reveal max-w-6xl mx-auto px-6 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2">Field-Tested Knowledge</p>
          <h2 className="font-serif text-3xl text-[var(--color-text)]">Featured Resources</h2>
        </div>
        <Link to="/shop" className="text-xs tracking-widest uppercase text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors hidden md:block">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featured.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
