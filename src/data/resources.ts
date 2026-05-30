export type ResourceCategory =
  | 'Associations'
  | 'Standards & Certification'
  | 'Research & Science'
  | 'Market Intelligence'
  | 'News & Publications'
  | 'Technical Guides'

export interface Resource {
  title: string
  description: string
  url: string
  category: ResourceCategory
  free: boolean
}

export const resources: Resource[] = [
  // ─── Associations ───────────────────────────────────────────────────────────
  {
    title: 'FAO Fisheries & Aquaculture',
    description: 'The United Nations authority on global fisheries data, aquaculture statistics, technical guidelines, and policy frameworks. The most comprehensive free database for production figures by species, country, and system type.',
    url: 'https://www.fao.org/fishery/en',
    category: 'Associations',
    free: true,
  },
  {
    title: 'Global Aquaculture Alliance (GAA)',
    description: 'Leading international trade association for responsible aquaculture. Publishes best-practice guides, runs the BAP certification programme, and produces the annual GOAL conference proceedings.',
    url: 'https://www.aquaculturealliance.org',
    category: 'Associations',
    free: true,
  },
  {
    title: 'Network of Aquaculture Centres in Asia-Pacific (NACA)',
    description: 'Regional intergovernmental body with a deep technical library covering shrimp, tilapia, carp, and prawn production systems across Asia. Technical manuals are available free in multiple languages.',
    url: 'https://www.enaca.org',
    category: 'Associations',
    free: true,
  },
  {
    title: 'SEAFDEC (Southeast Asian Fisheries Development Center)',
    description: 'Intergovernmental body for fisheries development across ASEAN. Strong on aquaculture extension materials, hatchery protocols, and post-harvest handling for tropical species.',
    url: 'https://www.seafdec.org',
    category: 'Associations',
    free: true,
  },
  {
    title: 'World Aquaculture Society (WAS)',
    description: 'Global professional society for aquaculture scientists and producers. Access to conference abstracts, journal publications, and a searchable expert directory.',
    url: 'https://www.was.org',
    category: 'Associations',
    free: true,
  },
  {
    title: 'WorldFish Center',
    description: 'CGIAR research centre focused on aquaculture and fisheries in developing countries. Research outputs are open-access and cover genetic improvement, feed efficiency, and climate adaptation.',
    url: 'https://www.worldfishcenter.org',
    category: 'Associations',
    free: true,
  },
  {
    title: 'European Aquaculture Society (EAS)',
    description: 'Professional body representing European aquaculture producers and researchers. Publishes Aquaculture Europe magazine and runs the largest European aquaculture conference annually.',
    url: 'https://www.easonline.org',
    category: 'Associations',
    free: true,
  },

  // ─── Standards & Certification ──────────────────────────────────────────────
  {
    title: 'Aquaculture Stewardship Council (ASC)',
    description: 'The leading international certification standard for responsible aquaculture. Essential reading if you supply to European or North American retail — ASC certification is increasingly a market-access requirement.',
    url: 'https://www.asc-aqua.org',
    category: 'Standards & Certification',
    free: true,
  },
  {
    title: 'Best Aquaculture Practices (BAP)',
    description: "GAA's four-star certification covering farms, hatcheries, feed mills, and processing plants. The BAP standards documents are free to download and provide a rigorous operational benchmark.",
    url: 'https://www.bapcertification.org',
    category: 'Standards & Certification',
    free: true,
  },
  {
    title: 'GlobalGAP Aquaculture',
    description: 'Farm assurance standard widely required by European supermarket buyers. Covers food safety, environmental impact, animal welfare, and worker health. Country-specific implementation guides available.',
    url: 'https://www.globalgap.org/uk_en/what-we-do/the-gg-system/aquaculture',
    category: 'Standards & Certification',
    free: true,
  },
  {
    title: 'Monterey Bay Aquarium Seafood Watch',
    description: 'Consumer and trade guide to sustainable seafood sourcing. The supplier recommendations and aquaculture assessment reports are used by US buyers as a baseline for sourcing decisions.',
    url: 'https://www.seafoodwatch.org',
    category: 'Standards & Certification',
    free: true,
  },

  // ─── Research & Science ─────────────────────────────────────────────────────
  {
    title: 'Aquaculture (Elsevier Journal)',
    description: 'The most-cited peer-reviewed journal in aquaculture science. Covers water quality, nutrition, genetics, disease, and production systems. Individual papers accessible; institutional subscription for full access.',
    url: 'https://www.sciencedirect.com/journal/aquaculture',
    category: 'Research & Science',
    free: false,
  },
  {
    title: 'Reviews in Aquaculture',
    description: 'High-impact review journal synthesising research across all aquaculture disciplines. Excellent for getting up to speed on a topic — each paper covers 10+ years of primary research in one read.',
    url: 'https://onlinelibrary.wiley.com/journal/17535131',
    category: 'Research & Science',
    free: false,
  },
  {
    title: 'FAO FishStatJ',
    description: "Free desktop software for querying FAO's global fisheries and aquaculture production database by species, country, year, and system. The authoritative source for production benchmarking.",
    url: 'https://www.fao.org/fishery/en/statistics/software/fishstatj',
    category: 'Research & Science',
    free: true,
  },
  {
    title: 'PubMed Aquaculture Research',
    description: "NCBI's biomedical database indexes thousands of peer-reviewed aquaculture papers. Search by species, pathogen, or production topic. Many papers have open-access full text via PubMed Central.",
    url: 'https://pubmed.ncbi.nlm.nih.gov/?term=aquaculture',
    category: 'Research & Science',
    free: true,
  },
  {
    title: 'CGIAR Research Program on Fish',
    description: 'Open-access repository of research outputs on fish, aquaculture, and small-scale fisheries from the CGIAR global research network. Covers genetics, feed, climate, and value chains.',
    url: 'https://fish.cgiar.org',
    category: 'Research & Science',
    free: true,
  },

  // ─── Market Intelligence ────────────────────────────────────────────────────
  {
    title: 'GLOBEFISH (FAO Market Analysis)',
    description: "FAO's seafood market intelligence unit. Publishes free quarterly commodity updates, price analysis, and trade flow data for shrimp, tilapia, salmon, and other key species.",
    url: 'https://www.fao.org/in-action/globefish/en',
    category: 'Market Intelligence',
    free: true,
  },
  {
    title: 'Undercurrent News',
    description: 'Daily global seafood intelligence covering farm-gate prices, trade flows, regulatory developments, and M&A activity. Widely used by producers, processors, and investors. Subscription-based with some free content.',
    url: 'https://www.undercurrentnews.com',
    category: 'Market Intelligence',
    free: false,
  },
  {
    title: 'IntraFish',
    description: 'Global seafood industry news and analysis covering production, processing, and trade. Used by farm managers and executives to track competitor activity and market conditions.',
    url: 'https://www.intrafish.com',
    category: 'Market Intelligence',
    free: false,
  },
  {
    title: 'Seafood Source',
    description: 'North American seafood trade publication with strong coverage of import/export trends, retail buyer activity, and price benchmarks. Relevant for producers targeting US and Canadian markets.',
    url: 'https://www.seafoodsource.com',
    category: 'Market Intelligence',
    free: true,
  },
  {
    title: 'IFFO — Marine Ingredients Organisation',
    description: 'The global body for fishmeal and fish oil markets. Publishes production data, sustainability reports, and price indices. Essential for understanding raw material cost drivers in aquaculture feed.',
    url: 'https://www.iffo.com',
    category: 'Market Intelligence',
    free: true,
  },

  // ─── News & Publications ────────────────────────────────────────────────────
  {
    title: 'The Fish Site',
    description: 'Practical aquaculture news and technical articles aimed at farm managers and producers. Strong on disease management, nutrition, and operational issues. Free to access with registration.',
    url: 'https://thefishsite.com',
    category: 'News & Publications',
    free: true,
  },
  {
    title: 'Hatchery International',
    description: 'Trade magazine focused exclusively on aquaculture hatchery operations — broodstock, larval rearing, biosecurity, and facility design. Free digital edition available.',
    url: 'https://www.hatcheryinternational.com',
    category: 'News & Publications',
    free: true,
  },
  {
    title: 'Shrimp News International',
    description: 'Long-running newsletter and website covering global shrimp farming developments — disease outbreaks, production statistics, technology, and market conditions. Invaluable for shrimp producers.',
    url: 'https://www.shrimpnews.com',
    category: 'News & Publications',
    free: true,
  },
  {
    title: 'Aquaculture North America',
    description: 'Trade publication covering aquaculture operations across North and South America. Practical coverage of production systems, technology, and business issues for farm operators.',
    url: 'https://www.aquaculturenorthamerica.com',
    category: 'News & Publications',
    free: true,
  },
  {
    title: 'Global Aquaculture Advocate',
    description: "GAA's flagship publication featuring technical articles, research summaries, and industry analysis from leading practitioners. Deep dive content on production systems, sustainability, and markets.",
    url: 'https://www.aquaculturealliance.org/advocate',
    category: 'News & Publications',
    free: true,
  },

  // ─── Technical Guides ───────────────────────────────────────────────────────
  {
    title: 'FAO Aquaculture Technical Papers',
    description: 'A library of 600+ free technical papers covering every major aquaculture species and production system. Includes the foundational production manuals still used in training programmes worldwide.',
    url: 'https://www.fao.org/aquaculture/resources/technical-papers/en',
    category: 'Technical Guides',
    free: true,
  },
  {
    title: 'NACA Technical Manuals',
    description: 'Practical farm management manuals produced by NACA covering shrimp, prawn, tilapia, and carp systems. Field-tested guides on pond preparation, water quality management, and harvest protocols.',
    url: 'https://www.enaca.org/modules/library',
    category: 'Technical Guides',
    free: true,
  },
  {
    title: 'Boyd Enterprises — Pond Management Resources',
    description: "Dr. Claude Boyd's water quality and pond management resources, widely considered the global authority on aquaculture pond science. Reference tables, calculators, and technical guides.",
    url: 'https://www.boydenterprises.com/resources',
    category: 'Technical Guides',
    free: true,
  },
  {
    title: 'Aquatic Animal Health Standards (OIE/WOAH)',
    description: 'World Organisation for Animal Health standards for aquatic animal diseases — the international reference for disease diagnosis, reporting, and biosecurity protocols. Mandatory reading for export-oriented farms.',
    url: 'https://www.woah.org/en/what-we-do/standards/codes-and-manuals/aquatic-code-online-access',
    category: 'Technical Guides',
    free: true,
  },
  {
    title: 'GOAL Conference Proceedings',
    description: "Annual Global Outlook for Aquaculture Leadership conference proceedings, covering production forecasts, investment trends, and technology outlook. The industry's forward-looking benchmark event.",
    url: 'https://www.aquaculturealliance.org/events/goal',
    category: 'Technical Guides',
    free: true,
  },
  {
    title: 'Aquaculture Health Management (Merck Vet Manual)',
    description: 'Comprehensive free reference on aquaculture disease recognition, diagnosis, and treatment across all major farmed species. The clinical reference used by veterinarians and farm health managers globally.',
    url: 'https://www.merckvetmanual.com/aquaculture',
    category: 'Technical Guides',
    free: true,
  },
]

export const resourceCategories: ResourceCategory[] = [
  'Associations',
  'Standards & Certification',
  'Research & Science',
  'Market Intelligence',
  'News & Publications',
  'Technical Guides',
]
