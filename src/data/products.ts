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

  // ─── Paid ebooks ─────────────────────────────────────────────────────────
  {
    id: 'biofloc-management-complete',
    slug: 'biofloc-management-complete-guide',
    title: 'Biofloc System Management: The Complete Field Guide',
    category: 'Ebook',
    tagline: 'From floc establishment to harvest — the full operating manual for BFT systems.',
    description: 'Where the free guide identifies failure modes, this manual gives you the complete operating picture. Carbon management, nitrogen cycling, aeration design, floc characterisation, water exchange decisions, emergency protocols, and a batch-by-batch performance tracking method — all built from 12 years of direct BFT system operation across five countries.',
    benefits: [
      'Set up and stabilise a new BFT system from first fill to first stock',
      'Manage C:N ratio and floc volume with a single daily measurement protocol',
      'Troubleshoot the five most common mid-cycle crises without losing a batch',
      'Track batch performance across cycles to identify your real productivity ceiling',
      'Adapt the framework to outdoor earthen ponds, lined ponds, or indoor RAS',
    ],
    price: 67,
    coverImage: '/images/products/biofloc-complete-cover.svg',
    checkoutUrl: '#',
    featured: true,
    comingSoon: true,
  },

  // ─── SOPs ─────────────────────────────────────────────────────────────────
  {
    id: 'feed-management-sop',
    slug: 'feed-management-sop',
    title: 'Feed Management SOP Pack',
    category: 'SOP',
    tagline: 'Daily, weekly, and cycle-end feed protocols — written for farm supervisors, not consultants.',
    description: 'Feed is the single largest cost in your operation and the variable most operators manage by feel. This SOP pack gives you standardised procedures for feed tray deployment, appetite scoring, adjustment triggers, FCR tracking, and end-of-cycle feed reconciliation — formatted for laminated posting in the feed shed.',
    benefits: [
      'Standardise feed tray checks so every supervisor reads appetite the same way',
      'Set clear adjustment triggers that reduce overfeeding without sacrificing growth',
      'Built-in FCR tracking template — know your real cost per kilogram every batch',
      'Cycle-end reconciliation procedure to catch feed waste and invoice discrepancies',
      'Print-ready A4 format for lamination and daily reference on the feed shed wall',
    ],
    price: 67,
    coverImage: '/images/products/feed-sop-cover.svg',
    checkoutUrl: '#',
    featured: false,
    comingSoon: true,
  },
  {
    id: 'water-quality-sop',
    slug: 'water-quality-aeration-sop',
    title: 'Water Quality & Aeration Management SOP',
    category: 'SOP',
    tagline: 'DO, pH, alkalinity, ammonia — the measurement schedule and response matrix your crew needs.',
    description: "Most water quality failures aren't missed measurements — they're missed responses. This SOP defines what to measure, when, how, and exactly what to do when a parameter falls outside range. Built around the five variables that drive 90% of early mortality events in intensive shrimp culture.",
    benefits: [
      'Daily and weekly measurement schedule for all five critical parameters',
      'Response matrix: exact action for every out-of-range reading',
      'Aeration management guide — how to run your aerators for DO, not just noise',
      'Alkalinity correction calculator with dosing tables for lime and bicarbonate',
      'Emergency response protocol for acute DO crashes and ammonia spikes',
    ],
    price: 47,
    coverImage: '/images/products/wq-sop-cover.svg',
    checkoutUrl: '#',
    featured: false,
    comingSoon: true,
  },

  // ─── Toolkits ─────────────────────────────────────────────────────────────
  {
    id: 'fcr-optimisation-toolkit',
    slug: 'fcr-optimisation-toolkit',
    title: 'Shrimp FCR Optimisation Toolkit',
    category: 'Toolkit',
    tagline: 'A diagnostic spreadsheet and field guide for closing the gap between your current and target FCR.',
    description: 'FCR is the number that tells you whether your operation is actually working. This toolkit pairs a pre-built Google Sheets tracker with a structured diagnostic guide that walks you through the twelve most common causes of FCR drift — from feed quality and biomass estimation errors to aeration misalignment and invisible mortality.',
    benefits: [
      'Pre-built Google Sheets tracker: enter daily feed and sample data, FCR calculates automatically',
      'Batch-to-batch comparison view to spot seasonal or management trends',
      '12-point FCR diagnostic checklist — work through it in under an hour',
      'Feed quality assessment protocol: how to evaluate a new feed brand before committing to a batch',
      'Benchmarks from 50+ audited farms: where your FCR should be by species, density, and system type',
    ],
    price: 97,
    coverImage: '/images/products/fcr-toolkit-cover.svg',
    checkoutUrl: '#',
    featured: true,
    comingSoon: true,
  },
  {
    id: 'farm-financial-model',
    slug: 'aquaculture-farm-financial-model',
    title: 'Aquaculture Farm Financial Model',
    category: 'Toolkit',
    tagline: 'The investor-grade spreadsheet I build for every audit client — now available as a standalone template.',
    description: 'This is the financial model I use when preparing a farm for investor due diligence. It calculates real cost-per-kg by production system, models three- and five-year projections with adjustable assumptions, includes a sensitivity analysis table, and produces a one-page executive summary your bank or investor can read without a translator.',
    benefits: [
      'Full P&L model: input your actual production data, real EBITDA calculates automatically',
      'Cost-per-kg breakdown by pond type, species, and production cycle',
      'Three-scenario projection (base, conservative, optimistic) with switchable assumptions',
      'Sensitivity analysis: what a 10% FCR improvement or 5% mortality change does to your margin',
      'Investor-ready one-page summary tab formatted for a funding conversation',
    ],
    price: 197,
    coverImage: '/images/products/financial-model-cover.svg',
    checkoutUrl: '#',
    featured: true,
    comingSoon: true,
  },
]

export const getFeatured = (): Product[] => products.filter(p => p.featured)

export const getBySlug = (slug: string): Product | undefined =>
  products.find(p => p.slug === slug)

export const getByCategory = (category: ProductCategory | 'All'): Product[] =>
  category === 'All' ? products : products.filter(p => p.category === category)
