import type { Product, ProductCategory, ShopFilter } from '../types/product'

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
    checkoutUrl: 'https://hazemshan.gumroad.com/l/zbhut',
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
    checkoutUrl: 'https://hazemshan.gumroad.com/l/cmcftu',
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
    checkoutUrl: 'https://hazemshan.gumroad.com/l/tgtqs',
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
    checkoutUrl: 'https://hazemshan.gumroad.com/l/qhfbbp',
    featured: true,
  },

  // ─── Mid-ladder paid products ────────────────────────────────────────────────

  {
    id: 'water-smell-primer',
    slug: 'why-your-water-smells-primer',
    title: 'Why Your Water Smells',
    category: 'Ebook',
    tagline: 'Diagnose and fix pond water odour problems before they kill a crop.',
    description: 'Ammonia spikes, hydrogen sulphide, off-gassing from decomposing organic matter — each has a distinct smell and a distinct fix. This primer maps the nine most common odour types to their biological and chemical causes, with field protocols for diagnosing each within 24 hours. Written for farm managers who need to act fast, not read a textbook.',
    benefits: [
      'Identify the source of any pond odour within 24 hours using the diagnostic framework',
      'Understand the biological mechanisms behind each smell type — what is happening in your water column',
      'Apply the correct intervention without guessing — each cause has a specific protocol',
      'Prevent the cascade: odour is the first warning before an oxygen crash or floc collapse',
    ],
    price: 27,
    coverImage: '/images/products/wq-sop-cover.svg',
    checkoutUrl: '#',
    comingSoon: true,
    featured: false,
  },

  {
    id: 'biofloc-doesnt-floc',
    slug: 'biofloc-that-doesnt-floc',
    title: 'Biofloc That Doesn\'t Floc',
    category: 'Ebook',
    tagline: 'The management protocols that keep biofloc stable through a full production cycle.',
    description: 'Biofloc is one of the highest-yield systems available to shrimp farmers — and one of the most brittle if managed incorrectly. This guide covers the critical decisions that determine whether your floc performs or collapses: carbon source selection, aeration geometry, C:N management, harvest timing, and the early-warning indicators experienced operators use to catch instability before it becomes a crash.',
    benefits: [
      'Maintain stable floc across a full cycle using the C:N management protocol',
      'Select the right carbon source for your system and budget — the wrong choice is the most common early mistake',
      'Read the physical indicators that predict instability 48–72 hours before it becomes visible',
      'Time your harvest based on floc performance data, not calendar dates',
    ],
    price: 37,
    coverImage: '/images/products/biofloc-complete-cover.svg',
    checkoutUrl: '#',
    comingSoon: true,
    featured: false,
  },

  {
    id: 'sop-giant-prawn-arabic',
    slug: 'sop-giant-prawn-production-arabic',
    title: 'SOP: Giant Prawn Production (Arabic)',
    category: 'SOP',
    tagline: 'Full-cycle Macrobrachium rosenbergii production SOPs — written in Arabic for MENA operations.',
    description: 'A complete standard operating procedure manual for giant freshwater prawn production covering hatchery management, nursery phase, grow-out, water quality maintenance, feeding protocols, and harvest. Written for Arabic-speaking farm managers and technical staff, with protocols calibrated to MENA temperature ranges, water quality parameters, and input availability.',
    benefits: [
      'Run your operation from a single complete reference document designed for your team',
      'Apply protocols written for MENA conditions — not translated from Southeast Asian contexts',
      'Train new staff against a documented standard to reduce training time and error rate',
      'Maintain consistency across grow-out cycles with clear water quality and feeding decision trees',
    ],
    price: 67,
    coverImage: '/images/products/feed-sop-cover.svg',
    checkoutUrl: '#',
    comingSoon: true,
    featured: false,
  },

  {
    id: 'aquaculture-market-gap-2026',
    slug: 'global-aquaculture-market-gap-2026',
    title: 'Global Aquaculture Market Gap — Q1 2026',
    category: 'Ebook',
    tagline: 'Where global aquaculture supply is failing demand — and what that means for producers who can scale.',
    description: 'A structured analysis of production shortfalls across the top 12 aquaculture species categories — shrimp, tilapia, salmon, carp, seabass, sea bream, and six others — mapped against demand growth projections through 2028. Includes regional breakdown by production capacity, import/export gap data, and the specific market segments where undersupply is creating pricing power. Written for farm investors, export buyers, and operations planning their next expansion.',
    benefits: [
      'Identify the species and regions where supply gaps are greatest right now',
      'Benchmark your production costs against the price floors that undersupply is creating',
      'Make expansion decisions backed by global demand data, not regional market hearsay',
      'Understand where export buyers are actively looking for new suppliers — and what they require',
    ],
    price: 67,
    coverImage: '/images/products/financial-model-cover.svg',
    checkoutUrl: '#',
    comingSoon: true,
    featured: false,
  },

]

export const getFeatured = (): Product[] => products.filter(p => p.featured)

export const getBySlug = (slug: string): Product | undefined =>
  products.find(p => p.slug === slug)

export const getByCategory = (category: ProductCategory | 'All'): Product[] =>
  category === 'All' ? products : products.filter(p => p.category === category)

export const getFiltered = (filter: ShopFilter): Product[] => {
  if (filter === 'All') return products
  if (filter === 'Free') return products.filter(p => p.price === 0)
  return products.filter(p => p.category === filter)
}
