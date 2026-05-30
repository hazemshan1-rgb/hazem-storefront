import { useParams, Link } from 'react-router-dom'
import { useLemonSqueezy } from '../hooks/useLemonSqueezy'
import { getBySlug } from '../data/products'
import { GoldBadge } from '../components/ui/GoldBadge'
import { Button } from '../components/ui/Button'
import { Check } from 'lucide-react'

export function ProductDetailPage() {
  useLemonSqueezy()
  const { slug } = useParams<{ slug: string }>()
  const product = slug ? getBySlug(slug) : undefined

  if (!product) {
    return (
      <main className="max-w-6xl mx-auto px-6 pt-28 pb-20 text-center">
        <h1 className="font-serif text-3xl text-[var(--color-text)] mb-4">Product not found</h1>
        <Link to="/shop" className="text-sm text-[var(--color-gold)] hover:underline">← Back to shop</Link>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-6 pt-28 pb-20">
      <Link to="/shop" className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors mb-8 block">
        ← All Resources
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="aspect-[4/3] rounded-sm overflow-hidden">
          <img
            src={product.coverImage}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-5">
          <GoldBadge label={product.category} />
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-text)] leading-tight">
            {product.title}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            {product.description}
          </p>

          <ul className="space-y-2">
            {product.benefits.map(b => (
              <li key={b} className="flex items-start gap-2 text-xs text-[var(--color-text-muted)]">
                <Check size={14} className="text-[var(--color-gold)] mt-0.5 shrink-0" />
                {b}
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-[var(--color-gold-muted)] flex items-center gap-6">
            <span className="font-serif text-3xl text-[var(--color-gold)]">${product.price}</span>
            <a href={product.checkoutUrl} className="lemonsqueezy-button flex-1">
              <Button size="lg" className="w-full">Buy Now — ${product.price}</Button>
            </a>
          </div>

          <p className="text-[10px] text-[var(--color-text-muted)] tracking-wide">
            Secure checkout via Lemon Squeezy. Instant PDF delivery. 30-day money-back guarantee.
          </p>
        </div>
      </div>
    </main>
  )
}
