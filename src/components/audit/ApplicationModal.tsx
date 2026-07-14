import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { submitAuditApplication } from '../../lib/auditApplication'

interface ApplicationModalProps {
  tier: 2 | 3 | null
  onClose: () => void
}

const REVENUE_BANDS = [
  '$200K–$400K/year',
  '$400K–$800K/year',
  '$800K–$1.2M/year',
  '$1.2M–$2M/year',
  '$2M+/year',
]

const inputCls = 'w-full bg-[var(--color-surface-2)] border border-[var(--color-gold-muted)] rounded-sm px-3 py-2.5 text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)]'
const labelCls = 'block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-1.5'

export function ApplicationModal({ tier, onClose }: ApplicationModalProps) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [farmLocation, setFarmLocation] = useState('')
  const [monthlyRevenueBand, setMonthlyRevenueBand] = useState('')
  const [pondCount, setPondCount] = useState('')
  const [species, setSpecies] = useState('')
  const [biggestProblem, setBiggestProblem] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  if (!tier) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !farmLocation.trim() || !monthlyRevenueBand || !biggestProblem.trim()) {
      setError(t('audit.apply.errorRequired'))
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('audit.apply.errorEmail'))
      return
    }
    setStatus('submitting')
    const result = await submitAuditApplication({
      tier: tier as 2 | 3,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      farmLocation: farmLocation.trim(),
      monthlyRevenueBand,
      pondCount: pondCount.trim(),
      species: species.trim(),
      biggestProblem: biggestProblem.trim(),
    })
    if (result.success) {
      setStatus('success')
    } else {
      setStatus('error')
      setError(t('audit.apply.errorSubmit'))
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        <motion.div
          role="dialog" aria-modal="true"
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--color-bg)] border border-[var(--color-gold-muted)] rounded-sm p-6 md:p-8"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={onClose}
            aria-label={t('audit.apply.close')}
            className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>

          {status === 'success' ? (
            <div className="text-center py-8">
              <p className="font-serif text-2xl text-[var(--color-text)] mb-3">{t('audit.apply.successHeadline')}</p>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{t('audit.apply.successBody')}</p>
            </div>
          ) : (
            <>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-1">
                {t(`audit.apply.tier${tier}Eyebrow`)}
              </p>
              <h2 className="font-serif text-2xl text-[var(--color-text)] mb-2">{t('audit.apply.headline')}</h2>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-6">{t('audit.apply.subhead')}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls} htmlFor="app-name">{t('audit.apply.nameLabel')}</label>
                    <input id="app-name" className={inputCls} value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="app-email">{t('audit.apply.emailLabel')}</label>
                    <input id="app-email" type="email" className={inputCls} value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls} htmlFor="app-location">{t('audit.apply.locationLabel')}</label>
                    <input id="app-location" className={inputCls} value={farmLocation} onChange={e => setFarmLocation(e.target.value)} placeholder={t('audit.apply.locationPlaceholder')} required />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="app-revenue">{t('audit.apply.revenueLabel')}</label>
                    <select id="app-revenue" className={inputCls} value={monthlyRevenueBand} onChange={e => setMonthlyRevenueBand(e.target.value)} required>
                      <option value="">{t('audit.apply.revenuePlaceholder')}</option>
                      {REVENUE_BANDS.map(band => <option key={band} value={band}>{band}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls} htmlFor="app-ponds">{t('audit.apply.pondsLabel')}</label>
                    <input id="app-ponds" className={inputCls} value={pondCount} onChange={e => setPondCount(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="app-species">{t('audit.apply.speciesLabel')}</label>
                    <input id="app-species" className={inputCls} value={species} onChange={e => setSpecies(e.target.value)} placeholder={t('audit.apply.speciesPlaceholder')} />
                  </div>
                </div>

                <div>
                  <label className={labelCls} htmlFor="app-problem">{t('audit.apply.problemLabel')}</label>
                  <textarea id="app-problem" rows={4} className={inputCls} value={biggestProblem} onChange={e => setBiggestProblem(e.target.value)} required />
                </div>

                {error && <p className="text-xs text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full text-center text-[11px] tracking-widest uppercase font-semibold px-6 py-3.5 rounded-sm transition-all text-[var(--color-navy)] bg-[var(--color-gold-cta)] hover:brightness-110 disabled:opacity-60"
                >
                  {status === 'submitting' ? t('audit.apply.submitting') : t(`audit.apply.tier${tier}SubmitBtn`)}
                </button>
                <p className="text-[9px] text-center text-[var(--color-text-muted)]">{t('audit.apply.note')}</p>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
