export interface CaseStudy {
  client: string
  region: string
  species: string
  challenge: string
  intervention: string[]
  outcome: string
  metric: string
  metricLabel: string
}

export const caseStudies: CaseStudy[] = [
  {
    client: 'Integrated Shrimp Operation',
    region: 'Southeast Asia',
    species: 'Litopenaeus vannamei',
    challenge: 'A 120-hectare intensive farm running at 60% of theoretical yield with no clear diagnosis. FCR had climbed to 2.1 over 18 months and margins were deteriorating despite stable feed prices. Management believed the problem was disease pressure.',
    intervention: [
      'Full carrying-capacity audit across all 48 ponds',
      'Feed tray and sampling protocol redesign to catch early-cycle lag',
      'Water exchange schedule recalibrated based on tidal data and DO monitoring',
      'Stocking density reduced 15% across the highest-density blocks',
    ],
    outcome: 'The root cause was chronic low-grade hypoxia from over-aeration misalignment — not disease. Within two cycles, FCR had returned to 1.62 and survival rates improved from 68% to 81%. The farm recovered $340,000 in annual margin without a single new capital investment.',
    metric: '+$340K',
    metricLabel: 'Annual margin recovered',
  },
  {
    client: 'Family-Owned Tilapia Producer',
    region: 'Sub-Saharan Africa',
    species: 'Oreochromis niloticus',
    challenge: 'A second-generation farm seeking investment to expand from 8 to 40 hectares. Three investor conversations had stalled at due diligence because the financials were unauditable — production records were inconsistent and there was no standardised cost-per-kg calculation.',
    intervention: [
      'Production data reconstruction and normalisation across 4 years of records',
      'Unit economics model built: cost-per-kg by pond type and season',
      'Investor documentation package: financial model, operational manual, risk register',
      'Pre-close operational review to identify and remediate investor objections',
    ],
    outcome: 'The farm closed a $1.2M growth investment within 6 months of the engagement. The investor cited the quality of financial documentation as a primary confidence factor. The expansion is now in Phase 1 implementation.',
    metric: '$1.2M',
    metricLabel: 'Investment secured',
  },
  {
    client: 'New Venture — Biofloc RAS System',
    region: 'Middle East',
    species: 'Litopenaeus vannamei (RAS)',
    challenge: 'A first-time aquaculture investor had purchased a turnkey RAS system from a European supplier. The system reached commission on paper but failed to maintain stable biofloc parameters. First cycle survival was 34%. The supplier blamed the operators.',
    intervention: [
      'Independent technical audit of system design versus operational requirements',
      'Identified three design gaps: insufficient aeration volume, absent carbon dosing control, and inadequate solids management',
      'Operator training programme — 12 sessions over 6 weeks',
      'Operational SOP set written to the specific system parameters',
    ],
    outcome: 'Second cycle survival improved to 74%. Third cycle reached 82%. The investor was able to renegotiate a partial remediation contribution from the supplier using the technical audit as evidence. The operation is now in commercial production.',
    metric: '82%',
    metricLabel: 'Survival rate by cycle 3',
  },
]
