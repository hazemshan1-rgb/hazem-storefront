import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { submitContactMessage } from '../../lib/contactForm'

interface ContactModalProps {
  onClose: () => void
}

const inputCls = 'w-full bg-[var(--color-surface-2)] border border-[var(--color-gold-muted)] rounded-sm px-3 py-2.5 text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)]'
const labelCls = 'block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-1.5'

export function ContactModal({ onClose }: ContactModalProps) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError(t('contact.errorRequired'))
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('contact.errorEmail'))
      return
    }
    setStatus('submitting')
    const result = await submitContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      honeypot,
    })
    if (result.success) {
      setStatus('success')
    } else {
      setStatus('error')
      setError(t('contact.errorSubmit'))
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
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[var(--color-bg)] border border-[var(--color-gold-muted)] rounded-sm p-6 md:p-8"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={onClose}
            aria-label={t('contact.close')}
            className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>

          {status === 'success' ? (
            <div className="text-center py-8">
              <p className="font-serif text-2xl text-[var(--color-text)] mb-3">{t('contact.successHeadline')}</p>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{t('contact.successBody')}</p>
            </div>
          ) : (
            <>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-1">{t('contact.eyebrow')}</p>
              <h2 className="font-serif text-2xl text-[var(--color-text)] mb-2">{t('contact.headline')}</h2>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-6">{t('contact.subhead')}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelCls} htmlFor="contact-name">{t('contact.nameLabel')}</label>
                  <input id="contact-name" className={inputCls} value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div>
                  <label className={labelCls} htmlFor="contact-email">{t('contact.emailLabel')}</label>
                  <input id="contact-email" type="email" className={inputCls} value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                  <label className={labelCls} htmlFor="contact-message">{t('contact.messageLabel')}</label>
                  <textarea id="contact-message" rows={4} className={inputCls} value={message} onChange={e => setMessage(e.target.value)} required />
                </div>

                {/* Honeypot — hidden from real visitors, invisible to screen readers via tabIndex/aria-hidden, bots fill every field they can find */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} />
                </div>

                {error && <p className="text-xs text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full text-center text-[11px] tracking-widest uppercase font-semibold px-6 py-3.5 rounded-sm transition-all text-[var(--color-navy)] bg-[var(--color-gold-cta)] hover:brightness-110 disabled:opacity-60"
                >
                  {status === 'submitting' ? t('contact.submitting') : t('contact.submitBtn')}
                </button>
                <p className="text-[9px] text-center text-[var(--color-text-muted)]">{t('contact.note')}</p>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
