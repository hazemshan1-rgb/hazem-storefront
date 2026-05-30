export interface Article {
  title: string
  date: string
  summary: string
  url: string
  tag?: string
}

const NEWSLETTER_URL = 'https://www.linkedin.com/newsletters/aquaculture-the-last-frontier-6927281798808776705/'

export const articles: Article[] = [
  {
    title: 'Beyond Investment: The Race for a Self-Sustaining Blue Economy',
    date: '2026-05-05',
    summary: 'The conversation has shifted from whether to invest in aquaculture to how quickly the sector can become self-financing. This piece examines the structural conditions required for a genuinely autonomous blue economy — one that no longer depends on aid cycles or development finance to sustain itself.',
    url: NEWSLETTER_URL,
    tag: 'Blue Economy',
  },
  {
    title: "Africa's $12 Billion Aquaculture Gap Has Crossed from Potential to Pipeline",
    date: '2026-04-28',
    summary: "Africa's aquaculture story has spent decades stuck in the language of potential. The data now shows a shift: capital is moving, projects are being structured, and the gap between what the continent produces and what it could produce is finally attracting serious investment attention.",
    url: NEWSLETTER_URL,
    tag: 'Investment',
  },
  {
    title: 'The Pond Carrying-Capacity: Too Many Shrimp, Too Little Sense',
    date: '2025-10-16',
    summary: 'Modern systems can push shrimp to densities that would have been unthinkable a decade ago — but most operators treat carrying capacity as a target rather than a ceiling. The best farms in the world routinely choose to operate below theoretical maximum, and that restraint is precisely what converts into consistent margin.',
    url: 'https://www.linkedin.com/pulse/pond-carrying-capacity-too-many-shrimp-little-sense-hazem-shannak--3imnc',
    tag: 'Production',
  },
  {
    title: 'The Long Journey of a Tiny Shrimp: Reinventing Post-Larvae Logistics',
    date: '2025-10-09',
    summary: 'Between hatchery and grow-out pond, a shrimp post-larvae faces temperature swings, ammonia spikes, and customs delays that kill silently and statistically. Fixing the logistics chain — with smart monitoring containers, regional hatchery hubs, and digital health documentation — may be the highest-leverage intervention available to the industry right now.',
    url: 'https://www.linkedin.com/pulse/long-journey-tiny-shrimp-reinventing-post-larvae-hazem-shannak--fljic',
    tag: 'Hatchery',
  },
  {
    title: 'From Feed Logs to AI Agents: The Next Leap in Shrimp Farming',
    date: '2025-10-02',
    summary: 'The shift from manual feed logs to AI-driven decision agents is not incremental — it is structural. This piece examines what happens when predictive models replace intuition at the feed tray, and why the farms that adopt this transition earliest will hold a compounding operational advantage over those that wait.',
    url: NEWSLETTER_URL,
    tag: 'Technology',
  },
  {
    title: 'Harnessing Generative AI in Aquaculture: Benefits, Risks, and Future Prospects',
    date: '2024-02-25',
    summary: 'Generative AI can identify disease patterns, optimise feeding schedules, and model environmental conditions faster than any human team. This article maps the genuine operational benefits against the real risks — data reliability gaps, cybersecurity vulnerabilities, and the consequences of letting an algorithm make the wrong call on a stressed pond.',
    url: 'https://www.linkedin.com/pulse/harnessing-generative-ai-aquaculture-benefits-risks-future-shannak-sntec',
    tag: 'Technology',
  },
  {
    title: 'The Future of Aquaculture: Embracing Waste-Free Shrimp Farming',
    date: '2024-02-02',
    summary: 'RAS, biofloc, and Integrated Multi-Trophic Aquaculture are not competing philosophies — they are complementary tools for eliminating the nutrient waste that makes conventional shrimp farming environmentally and economically fragile. The case for waste-free production is now economic as much as it is ethical.',
    url: 'https://www.linkedin.com/pulse/future-aquaculture-embracing-waste-free-shrimp-farming-hazem-shannak-xxirc',
    tag: 'Sustainability',
  },
  {
    title: 'Sustainable Aquaculture: An Overview',
    date: '2024-01-22',
    summary: 'Aquaculture now supplies over half of all consumed seafood, making it the fastest-growing food production sector on earth — and also one of the most exposed to its own growth. This overview maps the three pillars of genuine sustainability: environmental, economic, and social, and what each requires in practice.',
    url: 'https://www.linkedin.com/pulse/sustainable-aquaculture-overview-hazem-shannak-zmlbc',
    tag: 'Sustainability',
  },
  {
    title: 'Sustainable Aquaculture Development: Theory and Practice',
    date: '2023-12-07',
    summary: 'The gap between aquaculture theory and field reality is where most sustainability initiatives collapse. This piece bridges that gap — from land-based recirculation and biofloc management to Precision Fish Farming — and identifies the interventions that have actually moved the needle on environmental performance at scale.',
    url: 'https://www.linkedin.com/pulse/sustainable-aquaculture-development-theory-practice-hazem-shannak-adr5c',
    tag: 'Sustainability',
  },
  {
    title: 'Navigating Turbulent Times: Key Strategies for Aquaculture Producers',
    date: '2023-11-30',
    summary: 'Feed costs, energy prices, and market volatility are testing the resilience of farms that were profitable a year ago. This article outlines the strategic and operational moves — monitoring technology, income diversification, collective procurement — that separate farms which survive price shocks from those that do not.',
    url: 'https://www.linkedin.com/pulse/navigating-turbulent-times-key-strategies-aquaculture-hazem-shannak-8manc',
    tag: 'Business',
  },
  {
    title: 'Freshwater Prawn: A Sustainable Alternative to Tiger Shrimp?',
    date: '2022-05-16',
    summary: 'Tiger shrimp has dominated the premium segment for decades, but freshwater prawn production carries a fundamentally different environmental profile — lower disease pressure, lower energy intensity, and growing consumer acceptance. The question is whether the economics can match the biology.',
    url: 'https://www.linkedin.com/pulse/freshwater-prawn-sustainable-alternative-tiger-shrimp-hazem-shannak',
    tag: 'Species',
  },
  {
    title: 'Aquaculture: The Last Frontier for Sustainable Food Security',
    date: '2022-05-03',
    summary: 'Aquaculture will supply 62% of global seafood by 2030. That figure makes it one of the most consequential food production systems on the planet — and one of the most underinvested. This is the founding argument for the newsletter: why aquaculture is the last real frontier in sustainable food systems.',
    url: 'https://www.linkedin.com/pulse/aquaculture-last-frontier-sustainable-food-security-hazem-shannak',
    tag: 'Food Security',
  },
]

export const articleTags = ['All', ...Array.from(new Set(articles.map(a => a.tag ?? '').filter(Boolean)))]
