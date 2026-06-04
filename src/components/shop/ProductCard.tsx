import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { GoldBadge } from '../ui/GoldBadge'
import { Button } from '../ui/Button'
import type { Product } from '../../types/product'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 })

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function onMouseLeave() {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      whileHover={{ scale: 1.02 }}
      transition={{ scale: { duration: 0.2 } }}
      className="group bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm overflow-hidden hover:border-[var(--color-gold)] hover:shadow-[0_8px_32px_rgba(139,108,58,0.20)] flex flex-col"
    >
      {/* Cover image */}
      <Link to={`/shop/${product.slug}`} className="block overflow-hidden aspect-[4/3] relative">
        <img
          src={product.coverImage}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={e => {
            const img = e.currentTarget
            img.src = '/images/hero/aerial-ponds.jpg'
            img.style.filter = 'grayscale(0.6)'
          }}
        />
        {product.comingSoon && (
          <span className="absolute top-3 right-3 text-[9px] tracking-[0.2em] uppercase font-semibold bg-[var(--color-navy)] text-[var(--color-gold)] border border-[var(--color-gold-muted)] px-2.5 py-1 rounded-sm">
            Coming Soon
          </span>
        )}
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
    </motion.div>
  )
}
