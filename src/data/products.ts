import type { Product, ProductCategory } from '../types/product'

export const products: Product[] = [
  // ─── Free lead magnets ───────────────────────────────────────────────────
  {
    id: 'free-biofloc-guide',
    slug: 'free-biofloc-guide',
    title: '10 Ways to Ruin a Biofloc System',
    category: 'Ebook',
    tagline: 'The failure modes that kill BFT cycles — mapped so you can avoid every one.',
    description: 'Most biofloc failures follow the same patterns. This guide documents the ten most common errors — oxygen crashes, C:N imbalances, floc collapse, stocking mistakes — so you can diagnose problems before they cost you a production cycle.',
    benefits: [
      "Recognise early warning signs of floc collapse before it's too late",
      'Understand the C:N ratio errors that kill aeration efficiency',
      'Avoid the stocking density traps that compound every other mistake',
      'Use the failure framework as a diagnostic checklist for your current system',
    ],
    price: 0,
    coverImage: '/images/products/biofloc-guide-cover.png',
    checkoutUrl: 'https://aquapreneurs.lemonsqueezy.com/checkout/buy/4b11048a-2b0a-4bd6-b7ce-0e6dc015aab0',
    featured: true,
  },
  {
    id: 'profit-leak-audit',
    slug: 'aquaculture-profit-leak-audit',
    title: 'Aquaculture Profit Leak Audit',
    category: 'Ebook',
    tagline: 'Find and fix the hidden losses draining your farm — in a single day.',
    description: 'Most shrimp farms lose 20–35% of potential profit through leaks that never show up on a standard P&L. This audit framework walks you through the seven most common sources of hidden loss — feed waste, FCR drift, undetected mortality, aeration inefficiency, harvest timing errors, pricing gaps, and working capital drag — with a scored diagnostic tool you can complete in a single day. You leave with a ranked list of exactly where your money is going and what to fix first.',
    benefits: [
      'Identify hidden profit leaks across all seven loss categories in one structured audit',
      'Score your operation against field benchmarks from intensive shrimp systems',
      'Rank your fixes by financial impact — highest return first',
      'Use the diagnostic as a repeatable quarterly review tool',
    ],
    price: 0,
    coverImage: '/images/products/farm-audit-thumbnail.png',
    checkoutUrl: 'https://aquapreneurs.lemonsqueezy.com/checkout/buy/768e1015-4e35-4237-a4a7-c5fe0cd49785',
    featured: true,
  },

  {
    id: 'shrimp-imta-primer',
    slug: 'shrimp-imta-primer',
    title: 'The Shrimp IMTA Primer',
    category: 'Ebook',
    tagline: 'Three crops, one pond, better margins — the case for IMTA in 15 minutes.',
    description: 'Most shrimp farms run one crop on water that could be running three. This primer explains Integrated Multi-Trophic Aquaculture — what it is, what the economics look like, and what it takes to start. Backed by field data from Brazil, India, Nigeria, Kenya, and Vietnam, it gives you the lay of the land before you commit time or capital. Written for farm owners, investors, and supply chain leaders who want the truth without the academic packaging.',
    benefits: [
      'Understand why the IMTA margin case holds across tropical shrimp systems worldwide',
      'See real BCR and net income figures from peer-reviewed commercial trials',
      'Learn the three trophic levels every IMTA system needs — and what happens when you skip one',
      'Get a clear picture of conversion costs, payback periods, and first-cycle yield expectations',
      'Know exactly what the first 90 days of conversion look like — day by day',
    ],
    price: 27,
    coverImage: '/images/products/shrimp-imta-primer-cover.webp',
    checkoutUrl: 'https://aquapreneurs.lemonsqueezy.com/checkout/buy/18152065-e1a3-4b08-b67a-2ee14f03db7f',
    comingSoon: false,
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
    checkoutUrl: 'https://aquapreneurs.lemonsqueezy.com/checkout/buy/a25dd731-2ff9-4bcf-87fc-d9c7faae0b62',
    featured: true,
  },

]

export const getFeatured = (): Product[] => products.filter(p => p.featured)

export const getBySlug = (slug: string): Product | undefined =>
  products.find(p => p.slug === slug)

export const getByCategory = (category: ProductCategory | 'All'): Product[] =>
  category === 'All' ? products : products.filter(p => p.category === category)
