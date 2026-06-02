import type { Product, ProductCategory } from '../types/product'

export const products: Product[] = [
  {
    id: 'free-biofloc-guide',
    slug: 'free-biofloc-guide',
    title: '10 Ways to Ruin a Biofloc System',
    category: 'Ebook',
    tagline: 'The failure modes that kill BFT cycles — mapped so you can avoid every one.',
    description: 'Most biofloc failures follow the same patterns. This guide documents the ten most common errors — oxygen crashes, C:N imbalances, floc collapse, stocking mistakes — so you can diagnose problems before they cost you a production cycle.',
    benefits: [
      'Recognise early warning signs of floc collapse before it\'s too late',
      'Understand the C:N ratio errors that kill aeration efficiency',
      'Avoid the stocking density traps that compound every other mistake',
      'Use the failure framework as a diagnostic checklist for your current system',
    ],
    price: 0,
    coverImage: '/images/guides/biofloc-guide-cover.png',
    checkoutUrl: 'https://jumboshrimp.lemonsqueezy.com/checkout/buy/4b11048a-2b0a-4bd6-b7ce-0e6dc015aab0',
    featured: true,
  },
  {
    id: 'free-7-strategies',
    slug: 'free-7-strategies-waste-free-shrimp',
    title: '7 Strategies for Waste-Free Shrimp Farming',
    category: 'Ebook',
    tagline: 'Proven frameworks for sustainable, low-waste shrimp production.',
    description: 'Field-tested across Southeast Asia and the Middle East. This guide covers feed waste reduction, effluent management, and building an operation that survives tightening export regulations — all grounded in 30 years of hands-on practice.',
    benefits: [
      'Reduce feed waste and close the gap on your FCR immediately',
      'Build effluent management systems that satisfy export buyers',
      'Apply circular waste-to-resource loops inside your pond system',
      'Position your operation for markets where sustainability is a prerequisite',
    ],
    price: 0,
    coverImage: '/images/guides/7-strategies-cover.png',
    checkoutUrl: 'https://jumboshrimp.lemonsqueezy.com/checkout/buy/a25dd731-2ff9-4bcf-87fc-d9c7faae0b62',
    featured: true,
  },
]

export const getFeatured = (): Product[] => products.filter(p => p.featured)

export const getBySlug = (slug: string): Product | undefined =>
  products.find(p => p.slug === slug)

export const getByCategory = (category: ProductCategory | 'All'): Product[] =>
  category === 'All' ? products : products.filter(p => p.category === category)
