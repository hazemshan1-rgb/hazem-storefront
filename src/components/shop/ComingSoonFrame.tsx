import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GoldBadge } from '../ui/GoldBadge'
import type { Product } from '../../types/product'

interface ComingSoonFrameProps {
  products: Product[]
}

export function ComingSoonFrame({ products }: ComingSoonFrameProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  if (products.length === 0) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), source: 'shop-comingsoon-waitlist' }),
      })
      const data = await res.json() as { success?: boolean; error?: string }
      if (data.success) {
        setStatus('success')
      } else {
        setErrMsg(data.error ?? 'Something went wrong.')
        setStatus('error')
      }
    } catch {
      setErrMsg('Network error — please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="mt-6 bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6 md:p-8">
      <div className="mb-6">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-1">
          In Production
        </p>
        <h3 className="font-serif text-xl text-[var(--color-text)]">More resources on the way</h3>
      </div>

      <ul className="divide-y divide-[var(--color-gold-muted)]">
        {products.map(p => {
          const title = t(`products.${p.slug}.title`, { defaultValue: p.title })
          const tagline = t(`products.${p.slug}.tagline`, { defaultValue: p.tagline })
          return (
            <li key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
              <div className="shrink-0">
                <GoldBadge label={t(`shop.categories.${p.category}`, { defaultValue: p.category })} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-serif text-base text-[var(--color-text)] leading-snug">{title}</p>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mt-0.5 line-clamp-1">
                  {tagline}
                </p>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="mt-6 pt-6 border-t border-[var(--color-gold-muted)] flex justify-center">
        {status === 'success' ? (
          <p className="text-sm text-[var(--color-gold-cta)] text-center">
            ✓ You're on the list — we'll email you the moment any of these ship.
          </p>
        ) : !open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-8 py-3.5 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all"
          >
            Notify Me When Available
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={e => { setEmail(e.target.value); setStatus('idle') }}
                placeholder="Your email address"
                className="flex-1 bg-white/70 border border-[var(--color-gold-muted)] rounded-sm px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)]"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-6 py-3 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all disabled:opacity-60 whitespace-nowrap"
              >
                {status === 'loading' ? '…' : 'Join Waitlist'}
              </button>
            </div>
            {status === 'error' && (
              <p className="text-xs text-red-400 text-center">{errMsg}</p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
