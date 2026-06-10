import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLemonSqueezy } from '../hooks/useLemonSqueezy'
import { getBySlug, products } from '../data/products'
import { GoldBadge } from '../components/ui/GoldBadge'
import { Button } from '../components/ui/Button'
import { SEO } from '../components/ui/SEO'
import { Check, ArrowRight } from 'lucide-react'

export function ProductDetailPage() {
  const { t } = useTranslation()
  useLemonSqueezy()
  const { slug } = useParams<{ slug: string }>()
  const product = slug ? getBySlug(slug) : undefined

  if (!product) {
    return (
      <main className="max-w-6xl mx-auto px-6 pt-28 pb-20 text-center">
        <h1 className="font-serif text-3xl text-[var(--color-text)] mb-4">{t('notFound.headline')}</h1>
        <Link to="/shop" className="text-sm text-[var(--color-gold)] hover:underline">
          {t('productDetail.backToShop')}
        </Link>
      </main>
    )
  }

  const title = t(`products.${product.slug}.title`, { defaultValue: product.title })
  const description = t(`products.${product.slug}.description`, { defaultValue: product.description })
  const benefits = (t(`products.${product.slug}.benefits`, { returnObjects: true, defaultValue: product.benefits }) as string[])

  const nextProducts = products.filter(p => p.id !== product.id).slice(0, 2)

  return (
    <main className="max-w-6xl mx-auto px-6 pt-28 pb-20">
      <SEO
        title={title}
        description={description}
        image={product.coverImage}
        url={`/shop/${product.slug}`}
        type="product"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.title,
          description: product.description,
          image: `https://hazemshannak.com${product.coverImage}`,
          url: `https://hazemshannak.com/shop/${product.slug}`,
          brand: { '@type': 'Brand', name: 'Hazem Shannak' },
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: product.checkoutUrl,
          },
        }}
      />
      <Link to="/shop" className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors mb-8 block">
        {t('productDetail.backToShop')}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="aspect-[4/3] rounded-sm overflow-hidden">
          <img
            src={product.coverImage}
            alt={title}
            className="w-full h-full object-cover"
            onError={e => {
              const img = e.currentTarget
              img.src = '/images/hero/aerial-ponds.jpg'
              img.style.filter = 'grayscale(0.5)'
            }}
          />
        </div>

        <div className="flex flex-col gap-5">
          <GoldBadge label={product.category} />
          {product.comingSoon && (
            <span className="inline-flex w-fit text-[9px] tracking-[0.2em] uppercase font-semibold bg-[var(--color-surface)] text-[var(--color-gold)] border border-[var(--color-gold-muted)] px-3 py-1.5 rounded-sm">
              {t('productDetail.comingSoon')}
            </span>
          )}
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-text)] leading-tight">
            {title}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            {description}
          </p>

          <ul className="space-y-2">
            {Array.isArray(benefits) && benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[var(--color-text-muted)]">
                <Check size={14} className="text-[var(--color-gold)] mt-0.5 shrink-0" />
                {b}
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-[var(--color-gold-muted)] flex items-center gap-6">
            <span className="font-serif text-3xl text-[var(--color-gold)]">
              {product.price === 0 ? t('productDetail.free') : `$${product.price}`}
            </span>
            {product.comingSoon ? (
              <a href="mailto:hazemshan1@gmail.com?subject=Notify%20Me%20When%20Available" className="flex-1">
                <Button size="lg" className="w-full">{t('productDetail.notifyMe')}</Button>
              </a>
            ) : (
              <a href={product.checkoutUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button size="lg" className="w-full">
                  {product.price === 0
                    ? t('productDetail.getFree')
                    : t('productDetail.buyNow', { price: product.price })}
                </Button>
              </a>
            )}
          </div>

          {product.price > 0 && !product.comingSoon && (
            <p className="text-[10px] text-[var(--color-text-muted)] tracking-wide">
              {t('productDetail.secureCheckout')}
            </p>
          )}
          {product.price === 0 && (
            <p className="text-[10px] text-[var(--color-text-muted)] tracking-wide">
              {t('productDetail.freeDelivery')}
            </p>
          )}
        </div>
      </div>

      {/* Recommended Next Step */}
      <div className="mt-24 pt-16 border-t border-[var(--color-gold-muted)]">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2">
          {t('productDetail.nextStepEyebrow')}
        </p>
        <h2 className="font-serif text-2xl text-[var(--color-text)] mb-10">
          {t('productDetail.nextStepTitle')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {nextProducts.map(p => (
            <Link key={p.id} to={`/shop/${p.slug}`} className="group block bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm overflow-hidden hover:border-[var(--color-gold)] transition-all">
              <div className="flex flex-col sm:flex-row h-full">
                <div className="sm:w-1/3 aspect-square sm:aspect-auto">
                  <img src={p.coverImage} alt={t(`products.${p.slug}.title`, { defaultValue: p.title })} className="w-full h-full object-cover" />
                </div>
                <div className="sm:w-2/3 p-6 flex flex-col justify-center">
                  <GoldBadge label={p.category} />
                  <h3 className="font-serif text-lg text-[var(--color-text)] mt-3 group-hover:text-[var(--color-gold)] transition-colors">
                    {t(`products.${p.slug}.title`, { defaultValue: p.title })}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-2 line-clamp-2">
                    {t(`products.${p.slug}.tagline`, { defaultValue: p.tagline })}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-[10px] tracking-widest uppercase font-semibold text-[var(--color-gold)]">
                    {t('productDetail.viewResource')} <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
