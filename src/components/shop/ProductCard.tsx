import { Link } from 'react-router-dom'
import { GoldBadge } from '../ui/GoldBadge'
import { Button } from '../ui/Button'
import type { Product } from '../../types/product'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm overflow-hidden hover:border-[var(--color-gold)] hover:shadow-[0_8px_32px_rgba(139,108,58,0.15)] transition-all duration-300 flex flex-row">

      {/* Cover image — left column */}
      <Link
        to={`/shop/${product.slug}`}
        className="relative shrink-0 w-36 sm:w-44 self-stretch overflow-hidden min-h-[160px]"
      >
        <img
          src={product.coverImage}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={e => {
            const img = e.currentTarget
            img.src = '/images/hero/aerial-ponds.jpg'
            img.style.filter = 'grayscale(0.6)'
          }}
        />
        {/* Gradient overlay so badge text is always legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />
        {product.comingSoon && (
          <span className="absolute top-3 left-3 text-[9px] tracking-[0.2em] uppercase font-semibold bg-[var(--color-navy)] text-[var(--color-gold)] border border-[var(--color-gold-muted)] px-2.5 py-1 rounded-sm shadow-sm">
            Coming Soon
          </span>
        )}
      </Link>

      {/* Content — right column */}
      <div className="flex flex-col justify-between p-6 flex-1 gap-4 min-w-0">
        <div className="flex flex-col gap-3">
          <GoldBadge label={product.category} />

          <Link to={`/shop/${product.slug}`}>
            <h3 className="font-serif text-lg md:text-xl text-[var(--color-text)] leading-snug hover:text-[var(--color-gold)] transition-colors">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed line-clamp-3">
            {product.tagline}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-gold-muted)]">
          <span className="font-serif text-xl text-[var(--color-gold)]">
            {product.price === 0 ? 'Free' : `$${product.price}`}
          </span>
          {product.comingSoon ? (
            <Link to={`/shop/${product.slug}`}>
              <Button size="sm" variant="secondary">Notify Me</Button>
            </Link>
          ) : (
            <a href={product.checkoutUrl} className="lemonsqueezy-button">
              <Button size="sm">{product.price === 0 ? 'Get Free' : 'Buy Now'}</Button>
            </a>
          )}
        </div>
      </div>

    </div>
  )
}
