import { Link } from 'react-router-dom'
import { GoldBadge } from '../ui/GoldBadge'
import { Button } from '../ui/Button'
import type { Product } from '../../types/product'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm overflow-hidden hover:border-[var(--color-gold)] hover:shadow-[0_8px_32px_rgba(139,108,58,0.20)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Cover image */}
      <Link to={`/shop/${product.slug}`} className="block overflow-hidden aspect-[4/3]">
        <img
          src={product.coverImage}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col gap-3 flex-1">
        <GoldBadge label={product.category} />

        <Link to={`/shop/${product.slug}`}>
          <h3 className="font-serif text-lg text-[var(--color-text)] leading-snug hover:text-[var(--color-gold)] transition-colors">
            {product.title}
          </h3>
        </Link>

        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed flex-1">
          {product.tagline}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-gold-muted)]">
          <span className="font-serif text-xl text-[var(--color-gold)]">
            {product.price === 0 ? 'Free' : `$${product.price}`}
          </span>
          <a href={product.checkoutUrl} className="lemonsqueezy-button">
            <Button size="sm">{product.price === 0 ? 'Get Free' : 'Buy Now'}</Button>
          </a>
        </div>
      </div>
    </div>
  )
}
