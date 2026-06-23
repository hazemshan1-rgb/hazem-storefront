import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { SEO } from '../components/ui/SEO'

function getMultiple(years: string, docs: string, species: string, certified: string): number {
  const base: Record<string, number> = { under3: 3.0, '3to7': 3.8, over7: 4.5 }
  const bonus: Record<string, number> = { none: 0, basic: 0.3, full: 0.7 }
  const speciesBonus: Record<string, number> = { single: 0, mixed: 0.2, imta: 0.4 }
  const certBonus: Record<string, number> = { none: 0, local: 0.15, international: 0.35 }
  return (base[years] ?? 3.0) + (bonus[docs] ?? 0) + (speciesBonus[species] ?? 0) + (certBonus[certified] ?? 0)
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${Math.round(n / 1000)}K`
  return `$${Math.round(n)}`
}

const multipleFactors = [
  { key: 'years',     labelKey: 'valuation.factorYearsLabel', options: [
    { value: 'under3', labelKey: 'valuation.factorYears1', delta: 0   },
    { value: '3to7',   labelKey: 'valuation.factorYears2', delta: 0.8 },
    { value: 'over7',  labelKey: 'valuation.factorYears3', delta: 1.5 },
  ]},
  { key: 'docs',      labelKey: 'valuation.factorDocsLabel', options: [
    { value: 'none',  labelKey: 'valuation.factorDocs1', delta: 0   },
    { value: 'basic', labelKey: 'valuation.factorDocs2', delta: 0.3 },
    { value: 'full',  labelKey: 'valuation.factorDocs3', delta: 0.7 },
  ]},
  { key: 'species',   labelKey: 'valuation.factorSpeciesLabel', options: [
    { value: 'single', labelKey: 'valuation.factorSpecies1', delta: 0   },
    { value: 'mixed',  labelKey: 'valuation.factorSpecies2', delta: 0.2 },
    { value: 'imta',   labelKey: 'valuation.factorSpecies3', delta: 0.4 },
  ]},
  { key: 'certified', labelKey: 'valuation.factorCertLabel', options: [
    { value: 'none',          labelKey: 'valuation.factorCert1', delta: 0    },
    { value: 'local',         labelKey: 'valuation.factorCert2', delta: 0.15 },
    { value: 'international', labelKey: 'valuation.factorCert3', delta: 0.35 },
  ]},
]

export function ValuationPage() {
  const { t } = useTranslation()
  const [revenue,    setRevenue]    = useState(500_000)
  const [margin,     setMargin]     = useState(14)
  const [years,      setYears]      = useState('3to7')
  const [docs,       setDocs]       = useState('basic')
  const [species,    setSpecies]    = useState('single')
  const [certified,  setCertified]  = useState('none')
  const [revealed,   setRevealed]   = useState(false)

  const ebitda      = revenue * (margin / 100)
  const multiple    = getMultiple(years, docs, species, certified)
  const currentVal  = ebitda * multiple

  const postMargin   = Math.min(margin + 10, 45)
  const postEbitda   = revenue * (postMargin / 100)
  const postMultiple = multiple + 0.75
  const postVal      = postEbitda * postMultiple
  const uplift       = postVal - currentVal

  const getVal = (key: string) => key === 'years' ? years : key === 'docs' ? docs : key === 'species' ? species : certified
  const setVal = (key: string, val: string) => {
    if (key === 'years') setYears(val)
    else if (key === 'docs') setDocs(val)
    else if (key === 'species') setSpecies(val)
    else setCertified(val)
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">
      <SEO title={t('valuation.seoTitle')}
        description={t('valuation.seoDesc')}
        url="/valuation" />

      <div className="max-w-4xl mx-auto px-6">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">{t('valuation.eyebrow')}</p>
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] leading-tight mb-4">
          {t('valuation.headline')}
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-10 max-w-xl">
          {t('valuation.body')}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Inputs */}
          <div className="space-y-8">
            {/* Revenue slider */}
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-3 font-semibold">{t('valuation.labelRevenue')}</label>
              <input type="range" min={50000} max={5000000} step={25000} value={revenue}
                onChange={e => setRevenue(Number(e.target.value))} className="w-full accent-[var(--color-gold)]" />
              <div className="flex justify-between mt-1">
                <span className="font-serif text-sm text-[var(--color-text)]">{fmt(revenue)}</span>
                <span className="text-[10px] text-[var(--color-text-muted)]">$5M</span>
              </div>
            </div>

            {/* Margin slider */}
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-3 font-semibold">{t('valuation.labelMargin')}</label>
              <input type="range" min={2} max={40} step={1} value={margin}
                onChange={e => setMargin(Number(e.target.value))} className="w-full accent-[var(--color-gold)]" />
              <div className="flex justify-between mt-1">
                <span className="font-serif text-sm text-[var(--color-text)]">{margin}%</span>
                <span className="text-[10px] text-[var(--color-text-muted)]">40%</span>
              </div>
            </div>

            {/* Multiple factors */}
            {multipleFactors.map(factor => (
              <div key={factor.key}>
                <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-3 font-semibold">
                  {t(factor.labelKey)}
                  <span className="ml-2 normal-case font-normal text-[var(--color-text-muted)] opacity-70">— {t('valuation.affectsMultiple')}</span>
                </label>
                <div className={`grid gap-2 ${factor.options.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  {factor.options.map(o => (
                    <button key={o.value} onClick={() => setVal(factor.key, o.value)}
                      className={`py-2.5 px-3 text-xs border rounded-sm transition-all leading-snug ${
                        getVal(factor.key) === o.value
                          ? 'border-[var(--color-gold-cta)] bg-[var(--color-gold-cta)]/8 text-[var(--color-text)] font-semibold'
                          : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-gold)]'
                      }`}>
                      <span className="block">{t(o.labelKey)}</span>
                      {o.delta > 0 && (
                        <span className="block text-[9px] text-[var(--color-gold)] mt-0.5">
                          +{o.delta.toFixed(2)}× {t('valuation.multipleLabel')}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Valuation cards */}
          <div className="flex flex-col gap-5">
            {/* Current */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6">
              <p className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-4">{t('valuation.cardCurrentTitle')}</p>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">{t('valuation.ebitdaLabel')}</span>
                  <span className="text-[var(--color-text)] font-semibold">{fmt(ebitda)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">{t('valuation.multipleRowLabel')}</span>
                  <span className="text-[var(--color-text)] font-semibold">{multiple.toFixed(2)}×</span>
                </div>
                <div className="h-px bg-[var(--color-gold-muted)]" />
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--color-text-muted)]">{t('valuation.estimatedValueLabel')}</span>
                  <motion.span key={currentVal} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="font-serif text-2xl text-[var(--color-text)]">{fmt(currentVal)}</motion.span>
                </div>
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed">
                {t('valuation.cardCurrentNote', { multiple: multiple.toFixed(2) })}
              </p>
            </div>

            {/* Post-programme */}
            <div className="bg-[var(--color-navy)] border border-[var(--color-gold-cta)] rounded-sm p-6">
              <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold-cta)] mb-4">{t('valuation.cardPostTitle')}</p>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted-dark)]">{t('valuation.ebitdaPostLabel')}</span>
                  <span className="text-[var(--color-text-on-dark)] font-semibold">{fmt(postEbitda)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted-dark)]">{t('valuation.multiplePostLabel')}</span>
                  <span className="text-[var(--color-text-on-dark)] font-semibold">{postMultiple.toFixed(2)}×</span>
                </div>
                <div className="h-px bg-[rgba(255,255,255,0.08)]" />
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--color-text-muted-dark)]">{t('valuation.estimatedValueLabel')}</span>
                  <motion.span key={postVal} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="font-serif text-2xl text-[var(--color-text-on-dark)]">{fmt(postVal)}</motion.span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.08)]">
                <span className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted-dark)]">{t('valuation.valueUpliftLabel')}</span>
                <motion.span key={uplift} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="font-serif text-3xl text-[var(--color-gold-cta)]">+{fmt(uplift)}</motion.span>
              </div>
            </div>

            {/* CTA */}
            {!revealed ? (
              <button onClick={() => setRevealed(true)}
                className="w-full bg-[var(--color-gold-cta)] text-[var(--color-navy)] py-4 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all">
                {t('valuation.ctaReveal')}
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-5 space-y-3">
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  {t('valuation.revealedText', { uplift: fmt(uplift) })}
                </p>
                <Link to="/audit"
                  className="block text-center bg-[var(--color-gold-cta)] text-[var(--color-navy)] py-3.5 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all">
                  {t('valuation.seeProgrammeBtn')}
                </Link>
                <a href="mailto:connect@hazemshannak.cc?subject=Booking%20a%20Call"
                  className="block text-center border border-[var(--color-gold-muted)] text-[var(--color-text-muted)] py-3 text-[10px] tracking-widest uppercase rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all">
                  {t('valuation.talkFirstBtn')}
                </a>
              </motion.div>
            )}
          </div>
        </div>

        <p className="text-[10px] text-[var(--color-text-muted)] mt-8 mb-10 leading-relaxed max-w-xl">
          {t('valuation.disclaimer')}
        </p>

        {/* Cross-links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { to: '/diagnostic',      labelKey: 'valuation.crossLink1Label', subKey: 'valuation.crossLink1Sub' },
            { to: '/benchmark',       labelKey: 'valuation.crossLink2Label', subKey: 'valuation.crossLink2Sub' },
            { to: '/newsletter',      labelKey: 'valuation.crossLink3Label', subKey: 'valuation.crossLink3Sub' },
          ].map(l => (
            <Link key={l.to} to={l.to}
              className="block p-5 bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm hover:border-[var(--color-gold)] transition-all group">
              <p className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors mb-1">{t(l.labelKey)}</p>
              <p className="text-xs text-[var(--color-text-muted)] leading-snug">{t(l.subKey)}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
