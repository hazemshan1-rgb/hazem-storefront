import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { SEO } from '../components/ui/SEO'
import { caseStudies } from '../data/caseStudies'

const T1_EMAIL = 'mailto:hazemshan1@gmail.com?subject=Tier%201%20%E2%80%93%20Diagnostic%20Audit%20%E2%80%93%20Enquiry'
const T2_EMAIL = 'mailto:hazemshan1@gmail.com?subject=Tier%202%20%E2%80%93%2090-Day%20Transformation%20%E2%80%93%20Application'
const T3_EMAIL = 'mailto:hazemshan1@gmail.com?subject=Tier%203%20%E2%80%93%20Investor-Ready%20Enterprise%20%E2%80%93%20Application'

type TierKeys = {
  id: number
  nameKey: string; taglineKey: string; price: string; priceSubKey: string; lengthKey: string
  bestForKey: string; promiseKey: string; guaranteeKey: string; guaranteeShortKey: string
  paymentKey: string; leadTimeKey: string; availabilityKey?: string
  phases: { nameKey: string; labelKey: string; detailKey: string }[]
  includesKeys: string[]; excludesKeys: string[]
  email: string; ctaLabelKey: string; ctaNoteKey: string
}

const tiers: TierKeys[] = [
  {
    id: 1, nameKey: 'audit.t1Name', taglineKey: 'audit.t1Tagline',
    price: '$4,500 – $7,500', priceSubKey: 'audit.t1PriceSub', lengthKey: 'audit.t1Length',
    bestForKey: 'audit.t1BestFor', promiseKey: 'audit.t1Promise',
    guaranteeKey: 'audit.t1Guarantee', guaranteeShortKey: 'audit.t1GuaranteeShort',
    paymentKey: 'audit.t1Payment', leadTimeKey: 'audit.t1LeadTime', availabilityKey: 'audit.t1Availability',
    phases: [
      { nameKey: 'audit.t1P1Name', labelKey: 'audit.t1P1Label', detailKey: 'audit.t1P1Detail' },
      { nameKey: 'audit.t1P2Name', labelKey: 'audit.t1P2Label', detailKey: 'audit.t1P2Detail' },
      { nameKey: 'audit.t1P3Name', labelKey: 'audit.t1P3Label', detailKey: 'audit.t1P3Detail' },
      { nameKey: 'audit.t1P4Name', labelKey: 'audit.t1P4Label', detailKey: 'audit.t1P4Detail' },
    ],
    includesKeys: ['audit.t1Inc1','audit.t1Inc2','audit.t1Inc3','audit.t1Inc4','audit.t1Inc5','audit.t1Inc6'],
    excludesKeys: ['audit.t1Exc1','audit.t1Exc2','audit.t1Exc3','audit.t1Exc4','audit.t1Exc5'],
    email: T1_EMAIL, ctaLabelKey: 'audit.t1CtaLabel', ctaNoteKey: 'audit.t1CtaNote',
  },
  {
    id: 2, nameKey: 'audit.t2Name', taglineKey: 'audit.t2Tagline',
    price: '$15,000 – $25,000', priceSubKey: 'audit.t2PriceSub', lengthKey: 'audit.t2Length',
    bestForKey: 'audit.t2BestFor', promiseKey: 'audit.t2Promise',
    guaranteeKey: 'audit.t2Guarantee', guaranteeShortKey: 'audit.t2GuaranteeShort',
    paymentKey: 'audit.t2Payment', leadTimeKey: 'audit.t2LeadTime', availabilityKey: 'audit.t2Availability',
    phases: [
      { nameKey: 'audit.t2P1Name', labelKey: 'audit.t2P1Label', detailKey: 'audit.t2P1Detail' },
      { nameKey: 'audit.t2P2Name', labelKey: 'audit.t2P2Label', detailKey: 'audit.t2P2Detail' },
      { nameKey: 'audit.t2P3Name', labelKey: 'audit.t2P3Label', detailKey: 'audit.t2P3Detail' },
    ],
    includesKeys: ['audit.t2Inc1','audit.t2Inc2','audit.t2Inc3','audit.t2Inc4','audit.t2Inc5','audit.t2Inc6','audit.t2Inc7','audit.t2Inc8','audit.t2Inc9','audit.t2Inc10','audit.t2Inc11'],
    excludesKeys: ['audit.t2Exc1','audit.t2Exc2','audit.t2Exc3'],
    email: T2_EMAIL, ctaLabelKey: 'audit.t2CtaLabel', ctaNoteKey: 'audit.t2CtaNote',
  },
  {
    id: 3, nameKey: 'audit.t3Name', taglineKey: 'audit.t3Tagline',
    price: '$25,000 – $50,000+', priceSubKey: 'audit.t3PriceSub', lengthKey: 'audit.t3Length',
    bestForKey: 'audit.t3BestFor', promiseKey: 'audit.t3Promise',
    guaranteeKey: 'audit.t3Guarantee', guaranteeShortKey: 'audit.t3GuaranteeShort',
    paymentKey: 'audit.t3Payment', leadTimeKey: 'audit.t3LeadTime', availabilityKey: 'audit.t3Availability',
    phases: [
      { nameKey: 'audit.t3P1Name', labelKey: 'audit.t3P1Label', detailKey: 'audit.t3P1Detail' },
      { nameKey: 'audit.t3P2Name', labelKey: 'audit.t3P2Label', detailKey: 'audit.t3P2Detail' },
      { nameKey: 'audit.t3P3Name', labelKey: 'audit.t3P3Label', detailKey: 'audit.t3P3Detail' },
      { nameKey: 'audit.t3P4Name', labelKey: 'audit.t3P4Label', detailKey: 'audit.t3P4Detail' },
      { nameKey: 'audit.t3P5Name', labelKey: 'audit.t3P5Label', detailKey: 'audit.t3P5Detail' },
      { nameKey: 'audit.t3P6Name', labelKey: 'audit.t3P6Label', detailKey: 'audit.t3P6Detail' },
    ],
    includesKeys: ['audit.t3Inc1','audit.t3Inc2','audit.t3Inc3','audit.t3Inc4','audit.t3Inc5','audit.t3Inc6','audit.t3Inc7','audit.t3Inc8','audit.t3Inc9','audit.t3Inc10','audit.t3Inc11'],
    excludesKeys: ['audit.t3Exc1','audit.t3Exc2','audit.t3Exc3'],
    email: T3_EMAIL, ctaLabelKey: 'audit.t3CtaLabel', ctaNoteKey: 'audit.t3CtaNote',
  },
]

const tableRowKeys: { featureKey: string; t1?: string; t2?: string; t3?: string; t1k?: string; t2k?: string; t3k?: string }[] = [
  { featureKey: 'audit.tableRow1',  t1: '✓', t2: '✓', t3: '✓' },
  { featureKey: 'audit.tableRow2',  t1: '✓', t2: '✓', t3: '✓' },
  { featureKey: 'audit.tableRow3',  t1: '✓', t2: '✓', t3: '✓' },
  { featureKey: 'audit.tableRow4',  t1k: 'audit.tableRow4T1', t2k: 'audit.tableRow4T2', t3k: 'audit.tableRow4T3' },
  { featureKey: 'audit.tableRow5',  t1k: 'audit.tableRow5T1', t2k: 'audit.tableRow5T2', t3k: 'audit.tableRow5T3' },
  { featureKey: 'audit.tableRow6',  t1: '—', t2: '✓', t3: '✓' },
  { featureKey: 'audit.tableRow7',  t1: '—', t2: '✓', t3: '✓' },
  { featureKey: 'audit.tableRow8',  t1: '—', t2: '✓', t3: '✓' },
  { featureKey: 'audit.tableRow9',  t1: '—', t2: '✓', t3: '✓' },
  { featureKey: 'audit.tableRow10', t1: '—', t2: '✓', t3: '✓' },
  { featureKey: 'audit.tableRow11', t1: '—', t2: '✓', t3: '✓' },
  { featureKey: 'audit.tableRow12', t1: '—', t2: '✓', t3: '✓' },
  { featureKey: 'audit.tableRow13', t1: '—', t2: '—', t3: '✓' },
  { featureKey: 'audit.tableRow14', t1: '—', t2: '—', t3: '✓' },
  { featureKey: 'audit.tableRow15', t1: '—', t2: '—', t3: '✓' },
  { featureKey: 'audit.tableRow16', t1: '—', t2: '—', t3: '✓' },
  { featureKey: 'audit.tableRow17', t1: '—', t2: '—', t3: '✓' },
  { featureKey: 'audit.tableRow18', t1: '—', t2: '—', t3: '✓' },
]

function PhasesAccordion({ phases, featured }: { phases: TierKeys['phases']; featured: boolean }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-1">
      {phases.map((phase, i) => (
        <div key={i} className="rounded-sm border border-[var(--color-gold-muted)]">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className={`w-full text-left px-4 py-3 flex items-center justify-between gap-4 ${featured ? 'text-[var(--color-text-on-dark)]' : 'text-[var(--color-text)]'}`}
          >
            <span className="flex items-center gap-3">
              <span className={`text-[9px] tracking-[0.25em] uppercase font-bold shrink-0 ${featured ? 'text-[var(--color-gold-cta)]' : 'text-[var(--color-gold)]'}`}>
                {t(phase.nameKey)}
              </span>
              <span className="text-xs font-medium">{t(phase.labelKey)}</span>
            </span>
            <svg className={`shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''} ${featured ? 'text-[var(--color-gold-cta)]' : 'text-[var(--color-gold)]'}`} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 4.5l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {open === i && (
            <div className={`px-4 pb-4 text-xs leading-relaxed ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
              {t(phase.detailKey)}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function TierCard({ tier, featured = false }: { tier: TierKeys; featured?: boolean }) {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex flex-col rounded-sm border p-6 ${featured ? 'bg-[var(--color-navy)] border-[var(--color-gold-cta)] shadow-[0_0_40px_rgba(202,138,4,0.15)]' : 'bg-[var(--color-surface)] border-[var(--color-gold-muted)]'}`}
    >
      {featured && (
        <div className="absolute -top-3 left-6">
          <span className="text-[9px] tracking-[0.3em] uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-3 py-1 rounded-sm">
            {t('audit.coreProductBadge')}
          </span>
        </div>
      )}
      <div className="mb-4">
        <p className={`text-[10px] tracking-[0.3em] uppercase font-semibold mb-1 ${featured ? 'text-[var(--color-gold-cta)]' : 'text-[var(--color-gold)]'}`}>Tier {tier.id}</p>
        <h3 className={`font-serif text-xl leading-snug mb-1 ${featured ? 'text-[var(--color-text-on-dark)]' : 'text-[var(--color-text)]'}`}>{t(tier.nameKey)}</h3>
        <p className={`text-xs ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>{t(tier.taglineKey)}</p>
      </div>
      <div className="mb-4 pb-4 border-b border-[var(--color-gold-muted)]">
        <p className={`font-serif text-2xl mb-0.5 ${featured ? 'text-[var(--color-gold-cta)]' : 'text-[var(--color-gold)]'}`}>{tier.price}</p>
        <p className={`text-[10px] ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>{t(tier.lengthKey)} · {t(tier.priceSubKey).split('.')[0]}</p>
      </div>
      <p className={`text-xs leading-relaxed mb-4 flex-1 ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
        <span className={`font-semibold ${featured ? 'text-[var(--color-text-on-dark)]' : 'text-[var(--color-text)]'}`}>{t('audit.bestForLabel')} </span>
        {t(tier.bestForKey)}
      </p>
      <div className={`text-[10px] rounded-sm px-3 py-2 mb-5 leading-relaxed ${featured ? 'bg-[rgba(202,138,4,0.12)] text-[var(--color-gold-cta)]' : 'bg-[var(--color-gold-muted)] text-[var(--color-gold)]'}`}>
        {t(tier.guaranteeShortKey).split('.')[0]}.
      </div>
      <a href={tier.email} className={`block w-full text-center text-[11px] tracking-widest uppercase font-semibold px-6 py-3.5 rounded-sm transition-all ${featured ? 'text-[var(--color-navy)] bg-[var(--color-gold-cta)] hover:brightness-110 gold-pulse' : 'text-[var(--color-navy)] bg-[var(--color-gold)] hover:brightness-110'}`}>
        {t(tier.ctaLabelKey)}
      </a>
      <p className={`text-[9px] text-center mt-2 ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>{t(tier.ctaNoteKey)}</p>
    </motion.div>
  )
}

function TierDetail({ tier, reversed = false }: { tier: TierKeys; reversed?: boolean }) {
  const { t } = useTranslation()
  const ref = useScrollReveal<HTMLElement>()
  const featured = tier.id === 2
  return (
    <section ref={ref} id={`tier-${tier.id}`} className={`scroll-reveal border-y border-[var(--color-gold-muted)] ${featured ? 'bg-[var(--color-navy)]' : 'bg-[var(--color-bg)]'}`}>
      <div className={`max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${reversed ? 'lg:grid-flow-dense' : ''}`}>
        <div className={reversed ? 'lg:col-start-2' : ''}>
          <p className={`text-[10px] tracking-[0.3em] uppercase font-semibold mb-2 ${featured ? 'text-[var(--color-gold-cta)]' : 'text-[var(--color-gold)]'}`}>Tier {tier.id}</p>
          <h2 className={`font-serif text-3xl md:text-4xl leading-tight mb-4 ${featured ? 'text-[var(--color-text-on-dark)]' : 'text-[var(--color-text)]'}`}>{t(tier.nameKey)}</h2>
          <p className={`text-sm leading-relaxed mb-8 ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>{t(tier.promiseKey)}</p>
          <p className={`text-[10px] tracking-widest uppercase font-semibold mb-3 ${featured ? 'text-[var(--color-gold-cta)]' : 'text-[var(--color-gold)]'}`}>{t('audit.howItWorks')}</p>
          <div className="mb-8"><PhasesAccordion phases={tier.phases} featured={featured} /></div>
          <p className={`text-[10px] tracking-widest uppercase font-semibold mb-3 ${featured ? 'text-[var(--color-gold-cta)]' : 'text-[var(--color-gold)]'}`}>{t('audit.whatYouGet')}</p>
          <ul className="space-y-2 mb-6">
            {tier.includesKeys.map((key, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <svg className="shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 6l2.5 2.5L10 3.5" stroke={featured ? '#CA8A04' : 'var(--color-gold)'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className={`text-xs leading-relaxed ${i === 0 && tier.id > 1 ? (featured ? 'text-[var(--color-gold-cta)] font-semibold' : 'text-[var(--color-gold)] font-semibold') : (featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]')}`}>
                  {t(key)}
                </span>
              </li>
            ))}
          </ul>
          <p className={`text-[10px] tracking-widest uppercase font-semibold mb-3 ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>{t('audit.notIncluded')}</p>
          <ul className="space-y-1">
            {tier.excludesKeys.map((key, i) => (
              <li key={i} className={`text-xs flex items-start gap-2 ${featured ? 'text-[var(--color-text-muted-dark)]/70' : 'text-[var(--color-text-muted)]/70'}`}>
                <span className="mt-px shrink-0 opacity-50">—</span>{t(key)}
              </li>
            ))}
          </ul>
        </div>

        <div className={`lg:sticky lg:top-28 ${reversed ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
          <div className={`rounded-sm border p-6 ${featured ? 'bg-[var(--color-navy-2)] border-[var(--color-gold-cta)]' : 'bg-[var(--color-surface)] border-[var(--color-gold-muted)]'}`}>
            <p className={`text-[10px] tracking-[0.3em] uppercase mb-1 ${featured ? 'text-[var(--color-gold-cta)]' : 'text-[var(--color-gold)]'}`}>{t('audit.investmentLabel')}</p>
            <p className={`font-serif text-3xl mb-1 ${featured ? 'text-[var(--color-text-on-dark)]' : 'text-[var(--color-text)]'}`}>{tier.price}</p>
            <p className={`text-xs mb-6 leading-relaxed ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>{t(tier.priceSubKey)}</p>
            <div className="space-y-3 mb-6">
              {[{ labelKey: 'audit.durationLabel', valueKey: tier.lengthKey }, { labelKey: 'audit.leadTimeLabel', valueKey: tier.leadTimeKey }].map(({ labelKey, valueKey }) => (
                <div key={labelKey} className={`flex justify-between text-xs ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
                  <span className="uppercase tracking-wider text-[10px]">{t(labelKey)}</span>
                  <span className={`font-semibold text-right max-w-[60%] ${featured ? 'text-[var(--color-text-on-dark)]' : 'text-[var(--color-text)]'}`}>{t(valueKey)}</span>
                </div>
              ))}
              <div className={`text-xs ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
                <p className="uppercase tracking-wider text-[10px] mb-1">{t('audit.paymentLabel')}</p>
                <p className={`text-xs leading-relaxed ${featured ? 'text-[var(--color-text-on-dark)]' : 'text-[var(--color-text)]'}`}>{t(tier.paymentKey)}</p>
              </div>
            </div>
            <div className={`rounded-sm px-4 py-3 mb-4 text-xs leading-relaxed ${featured ? 'bg-[rgba(202,138,4,0.12)] text-[var(--color-gold-cta)]' : 'bg-[var(--color-gold-muted)] text-[var(--color-gold)]'}`}>
              <span className="font-semibold">{t('audit.guaranteeLabel')} </span>{t(tier.guaranteeKey)}
            </div>
            {tier.availabilityKey && (
              <div className={`rounded-sm px-4 py-3 mb-6 text-[10px] leading-relaxed border border-[var(--color-gold-muted)] ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>
                {t(tier.availabilityKey)}
              </div>
            )}
            <a href={tier.email} className={`block w-full text-center text-[11px] tracking-widest uppercase font-semibold px-6 py-3.5 rounded-sm transition-all ${featured ? 'text-[var(--color-navy)] bg-[var(--color-gold-cta)] hover:brightness-110 gold-pulse' : 'text-[var(--color-navy)] bg-[var(--color-gold)] hover:brightness-110'}`}>
              {t(tier.ctaLabelKey)}
            </a>
            <p className={`text-[9px] text-center mt-2 ${featured ? 'text-[var(--color-text-muted-dark)]' : 'text-[var(--color-text-muted)]'}`}>{t(tier.ctaNoteKey)}</p>
          </div>

          {tier.id === 2 && (
            <div className="mt-4 border border-[var(--color-gold-muted)] rounded-sm p-5">
              <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold-cta)] font-semibold mb-3">{t('audit.mathsEyebrow')}</p>
              <p className="text-xs text-[var(--color-text-muted-dark)] leading-relaxed mb-2">{t('audit.mathsBody1')} <span className="text-white font-semibold">{t('audit.mathsHighlight')}</span>.</p>
              <p className="text-xs text-[var(--color-text-muted-dark)] leading-relaxed">{t('audit.mathsBody2')}</p>
            </div>
          )}
          {tier.id === 3 && (
            <div className="mt-4 border border-[var(--color-gold-muted)] rounded-sm p-5">
              <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] font-semibold mb-3">{t('audit.successFeeEyebrow')}</p>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{t('audit.successFeeBody')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export function AuditPage() {
  const { t } = useTranslation()
  const heroRef    = useScrollReveal<HTMLElement>()
  const tableRef   = useScrollReveal<HTMLElement>()
  const upgradeRef = useScrollReveal<HTMLElement>()
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const upgradeKeys = [
    { fromKey: 'audit.upg1From', detailKey: 'audit.upg1Detail' },
    { fromKey: 'audit.upg2From', detailKey: 'audit.upg2Detail' },
    { fromKey: 'audit.upg3From', detailKey: 'audit.upg3Detail' },
  ]
  const decisionKeys = [
    { conditionKey: 'audit.dec1Condition', tierKey: 'audit.dec1Tier', color: 'text-[var(--color-gold)]' },
    { conditionKey: 'audit.dec2Condition', tierKey: 'audit.dec2Tier', color: 'text-[var(--color-gold-cta)]' },
    { conditionKey: 'audit.dec3Condition', tierKey: 'audit.dec3Tier', color: 'text-[var(--color-text-on-dark)]' },
    { conditionKey: 'audit.dec4Condition', tierKey: 'audit.dec4Tier', color: 'text-[var(--color-text-muted)]' },
  ]
  const crossNavLinks = [
    { to: '/diagnostic',      labelKey: 'audit.crossLink1Label', subKey: 'audit.crossLink1Sub' },
    { to: '/benchmark',       labelKey: 'audit.crossLink2Label', subKey: 'audit.crossLink2Sub' },
    { to: '/valuation',       labelKey: 'audit.crossLink3Label', subKey: 'audit.crossLink3Sub' },
    { to: '/symptom-checker', labelKey: 'audit.crossLink4Label', subKey: 'audit.crossLink4Sub' },
  ]

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
      <SEO title={t('audit.seoTitle')} description={t('audit.seoDesc')} url="/audit" />

      {/* Sticky CTA */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-3rem)] max-w-lg transition-all duration-500 ${showSticky ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="bg-[var(--color-navy)] border border-[var(--color-gold-cta)] rounded-sm p-4 shadow-2xl flex items-center justify-between gap-4">
          <div>
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold-cta)] font-semibold">{t('audit.stickyTiersLabel')}</p>
            <p className="text-xs text-white/90">{t('audit.stickyTagline')}</p>
          </div>
          <a href="#tiers" className="text-[10px] tracking-widest uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-5 py-2.5 rounded-sm hover:brightness-110 transition-all whitespace-nowrap">
            {t('audit.stickyBtn')}
          </a>
        </div>
      </div>

      {/* Hero */}
      <section ref={heroRef} className="scroll-reveal max-w-6xl mx-auto px-6 pt-12 pb-16 border-b border-[var(--color-gold-muted)]">
        <div className="max-w-3xl mb-12">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">{t('audit.eyebrow')}</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--color-text)] leading-tight mb-6">{t('audit.headline')}</h1>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-2xl mb-6">{t('audit.heroBody')}</p>
          <a href="#free-ebook" className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-semibold border border-[var(--color-gold-cta)] text-[var(--color-gold-cta)] px-4 py-3 rounded-sm hover:bg-[rgba(202,138,4,0.08)] transition-all w-fit">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 1v8M4 6.5l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {t('audit.heroFreeLink')}
          </a>
        </div>
        <div id="tiers" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map(tier => <TierCard key={tier.id} tier={tier} featured={tier.id === 2} />)}
        </div>
      </section>

      {/* Aerial break */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src="/images/audit/persian-gulf-ponds.jpg" alt="Large-scale shrimp farm operations — aerial view" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-[var(--color-navy)]/65" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="text-center max-w-2xl">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] mb-4">{t('audit.ladderEyebrow')}</p>
            <p className="font-serif text-2xl md:text-3xl text-white leading-snug">{t('audit.ladderQuote')}</p>
          </div>
        </div>
      </div>

      <TierDetail tier={tiers[0]} />
      <TierDetail tier={tiers[1]} reversed />

      <div className="relative h-56 overflow-hidden">
        <img src="/images/hero/aerators-sunset.jpg" alt="Pond aerators at sunset" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-[var(--color-navy)]/55" />
      </div>

      <TierDetail tier={tiers[2]} />

      {/* Comparison table */}
      <section ref={tableRef} className="scroll-reveal max-w-6xl mx-auto px-6 py-16 border-b border-[var(--color-gold-muted)]">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2">{t('audit.tableEyebrow')}</p>
        <h2 className="font-serif text-2xl text-[var(--color-text)] mb-8">{t('audit.tableHeadline')}</h2>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[520px] text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-gold-muted)]">
                <th className="text-left py-3 pr-6 text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] font-normal w-1/2">{t('audit.tableFeatureHeader')}</th>
                <th className="text-center py-3 px-4 text-[10px] tracking-widest uppercase text-[var(--color-gold)] font-semibold">Tier 1</th>
                <th className="text-center py-3 px-4 text-[10px] tracking-widest uppercase text-[var(--color-gold-cta)] font-semibold bg-[rgba(202,138,4,0.04)] rounded-t-sm">Tier 2</th>
                <th className="text-center py-3 px-4 text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] font-semibold">Tier 3</th>
              </tr>
            </thead>
            <tbody>
              {tableRowKeys.map((row, i) => (
                <tr key={i} className={`border-b border-[var(--color-gold-muted)] ${i % 2 === 0 ? '' : 'bg-[var(--color-surface-2)]/40'}`}>
                  <td className="py-3 pr-6 text-[var(--color-text-muted)]">{t(row.featureKey)}</td>
                  <td className="text-center py-3 px-4 text-[var(--color-gold)]">{row.t1k ? t(row.t1k) : row.t1}</td>
                  <td className="text-center py-3 px-4 text-[var(--color-gold-cta)] bg-[rgba(202,138,4,0.04)]">{row.t2k ? t(row.t2k) : row.t2}</td>
                  <td className="text-center py-3 px-4 text-[var(--color-text-muted)]">{row.t3k ? t(row.t3k) : row.t3}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-[var(--color-gold-muted)]">
                <td className="py-3 pr-6 font-semibold text-[var(--color-text)]">{t('audit.tablePriceRow')}</td>
                <td className="text-center py-3 px-4 font-semibold text-[var(--color-gold)]">$4.5K–$7.5K</td>
                <td className="text-center py-3 px-4 font-semibold text-[var(--color-gold-cta)] bg-[rgba(202,138,4,0.04)]">$15K–$25K</td>
                <td className="text-center py-3 px-4 font-semibold text-[var(--color-text-muted)]">$25K–$50K+</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Upgrade path */}
      <section ref={upgradeRef} className="scroll-reveal bg-[var(--color-navy)] border-y border-[var(--color-gold-muted)]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] mb-2">{t('audit.upgradeEyebrow')}</p>
          <h2 className="font-serif text-2xl text-[var(--color-text-on-dark)] mb-10">{t('audit.upgradeHeadline')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upgradeKeys.map((u, i) => (
              <div key={i} className="bg-[var(--color-navy-2)] border border-[var(--color-gold-muted)] rounded-sm p-5">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] font-semibold mb-3">{t(u.fromKey)}</p>
                <p className="text-xs text-[var(--color-text-muted-dark)] leading-relaxed">{t(u.detailKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Decision guide */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-b border-[var(--color-gold-muted)]">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2">{t('audit.decisionEyebrow')}</p>
        <h2 className="font-serif text-2xl text-[var(--color-text)] mb-8">{t('audit.decisionHeadline')}</h2>
        <div className="space-y-0">
          {decisionKeys.map((d, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 py-5 border-b border-[var(--color-gold-muted)] items-center">
              <div className="md:col-span-2"><p className="text-sm text-[var(--color-text-muted)]">{t(d.conditionKey)}</p></div>
              <div><span className={`text-sm font-semibold ${d.color}`}>{t(d.tierKey)}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-b border-[var(--color-gold-muted)]">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2">{t('audit.proofEyebrow')}</p>
        <h2 className="font-serif text-2xl text-[var(--color-text)] mb-10">{t('audit.proofHeadline')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {caseStudies.map(cs => (
            <div key={cs.client} className="flex flex-col gap-4 p-6 bg-[var(--color-surface-2)] border border-[var(--color-gold-muted)] rounded-sm">
              <div className="flex items-center gap-3">
                <span className="font-serif text-2xl text-[var(--color-gold)]">{cs.metric}</span>
                <span className="text-[9px] tracking-widest uppercase text-[var(--color-text-muted)]">{cs.metricLabel}</span>
              </div>
              <p className="text-xs italic text-[var(--color-text-muted)] leading-relaxed">"{cs.outcome.split('.')[0]}."</p>
              <div className="mt-auto pt-3 border-t border-[var(--color-gold-muted)]">
                <p className="text-[10px] font-semibold text-[var(--color-text)]">{cs.client}</p>
                <p className="text-[9px] text-[var(--color-text-muted)]">{cs.region}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Free ebook */}
      <section id="free-ebook" className="max-w-6xl mx-auto px-6 py-16 border-b border-[var(--color-gold-muted)]">
        <div className="bg-[var(--color-navy)] border border-[var(--color-gold-cta)] rounded-sm overflow-hidden flex flex-col md:flex-row items-stretch shadow-[0_0_40px_rgba(202,138,4,0.1)]">
          <div className="w-full md:w-48 shrink-0 bg-[var(--color-navy-2)] flex items-center justify-center p-6">
            <img src="/images/products/farm-audit-thumbnail.png" alt="Aquaculture Profit Leak Audit — Free Ebook" className="w-full max-w-[140px] md:max-w-none rounded-sm shadow-lg" />
          </div>
          <div className="flex flex-col justify-center px-8 py-8 gap-4 flex-1">
            <div>
              <p className="text-[9px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] font-semibold mb-2">{t('audit.ebookEyebrow')}</p>
              <h2 className="font-serif text-2xl md:text-3xl text-white leading-snug mb-3">{t('audit.ebookHeadline')}</h2>
              <p className="text-sm text-[var(--color-text-muted-dark)] leading-relaxed max-w-xl">{t('audit.ebookBody')}</p>
            </div>
            <a href="https://hazemshan.gumroad.com/l/cmcftu" target="_blank" rel="noopener noreferrer" className="gold-pulse inline-flex items-center gap-2 self-start text-[11px] tracking-widest uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-7 py-3 rounded-sm hover:brightness-110 transition-all">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 1v8M4 6.5l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {t('audit.ebookBtn')}
            </a>
          </div>
        </div>
      </section>

      {/* Cross-nav */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-b border-[var(--color-gold-muted)]">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-6">{t('audit.crossNavEyebrow')}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {crossNavLinks.map(l => (
            <Link key={l.to} to={l.to} className="block p-4 bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm hover:border-[var(--color-gold)] transition-all group text-center">
              <p className="text-xs font-semibold text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors mb-1">{t(l.labelKey)}</p>
              <p className="text-[10px] text-[var(--color-text-muted)] leading-snug">{t(l.subKey)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 pt-16">
        <div className="border border-[var(--color-gold-muted)] rounded-sm p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-serif text-2xl text-[var(--color-text)] mb-3">{t('audit.finalCtaHeadline')}</p>
            <p className="text-sm text-[var(--color-text-muted)] max-w-xl leading-relaxed">{t('audit.finalCtaBody')}</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['/images/hero/hazem-at-ponds.jpg', '/images/hero/hazem-teaching.jpg', '/images/hero/hazem-consulting.jpg'].map((src, i) => (
                  <img key={i} src={src} alt="" className="w-8 h-8 rounded-full border-2 border-[var(--color-surface)] object-cover" />
                ))}
              </div>
              <div>
                <p className="text-xs text-[var(--color-text)] font-medium">{t('audit.socialProofLine1')}</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">{t('audit.socialProofLine2')}</p>
              </div>
            </div>
          </div>
          <div className="shrink-0 flex flex-col gap-3">
            <a href={T2_EMAIL} className="gold-pulse inline-block text-center text-[11px] tracking-widest uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-8 py-3.5 rounded-sm hover:brightness-110 transition-all">
              {t('audit.finalApplyBtn')}
            </a>
            <a href={T1_EMAIL} className="inline-block text-center text-[11px] tracking-widest uppercase font-semibold text-[var(--color-text-muted)] border border-[var(--color-gold-muted)] px-8 py-3.5 rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all">
              {t('audit.finalBookBtn')}
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
