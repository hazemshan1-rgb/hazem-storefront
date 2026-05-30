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
    checkoutUrl: '',
    downloadUrl: '/downloads/10-ways-to-ruin-a-biofloc-system.pdf',
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
    checkoutUrl: '',
    downloadUrl: '/downloads/7-strategies-waste-free-shrimp-farming.pdf',
    featured: true,
  },
  {
    id: 'waste-free-shrimp',
    slug: 'waste-free-shrimp-farming',
    title: '7 Strategies for Waste-Free Shrimp Farming',
    category: 'Ebook',
    tagline: 'Cut input costs by 30% without sacrificing yield.',
    description: 'A field-tested guide to zero-waste shrimp production built on 30 years of hands-on experience across Asia, Africa, and the Middle East. Every strategy is farm-proven — no lab theory.',
    benefits: [
      'Reduce feed waste and improve FCR immediately',
      'Implement biofloc management without expensive equipment',
      'Diagnose and fix water quality issues before they become mortalities',
      'Build a waste-to-resource loop inside your pond system',
    ],
    price: 47,
    coverImage: '/images/covers/shrimp-harvest.jpg',
    checkoutUrl: 'https://YOUR_STORE.lemonsqueezy.com/checkout/buy/PRODUCT_ID?embed=1',
    featured: true,
  },
  {
    id: 'biofloc-doesnt-floc',
    slug: 'biofloc-that-doesnt-floc',
    title: "Biofloc That Doesn't Floc",
    category: 'Ebook',
    tagline: 'The real reason your BFT system is underperforming.',
    description: 'The most common biofloc failures have nothing to do with microbiology. This guide diagnoses the management, water chemistry, and stocking errors that collapse BFT systems — and shows you exactly how to fix them.',
    benefits: [
      'Identify the 6 most common BFT failure modes',
      'Correct C:N ratio imbalances before they crash your floc',
      'Manage dissolved oxygen in high-density systems',
      'Recover a failing system without full drain-down',
    ],
    price: 37,
    coverImage: '/images/covers/biofloc-doesnt-floc.jpg',
    checkoutUrl: 'https://YOUR_STORE.lemonsqueezy.com/checkout/buy/PRODUCT_ID_2?embed=1',
    featured: true,
  },
  {
    id: 'pond-to-profit',
    slug: 'from-pond-to-profit',
    title: 'From Pond to Profit',
    category: 'Toolkit',
    tagline: 'The business framework behind sustainable aquaculture ventures.',
    description: 'Most aquaculture operations are technically sound but commercially weak. This book bridges the gap — applying real business architecture to farm operations so your system produces both yield and profit.',
    benefits: [
      'Build a P&L model specific to your farm type',
      'Identify your highest-margin products and channels',
      'Structure your operation for investment readiness',
      'Scale from subsistence to enterprise without losing control',
    ],
    price: 67,
    coverImage: '/images/covers/pond-to-profit.jpg',
    checkoutUrl: 'https://YOUR_STORE.lemonsqueezy.com/checkout/buy/PRODUCT_ID_3?embed=1',
    featured: true,
  },
]

export const getFeatured = (): Product[] => products.filter(p => p.featured)

export const getBySlug = (slug: string): Product | undefined =>
  products.find(p => p.slug === slug)

export const getByCategory = (category: ProductCategory | 'All'): Product[] =>
  category === 'All' ? products : products.filter(p => p.category === category)
