import { useState } from 'react'

interface Props {
  source: string
  placeholder?: string
  btnLabel?: string
  successMsg?: string
}

export function SubscribeForm({
  source,
  placeholder = 'Your email address',
  btnLabel = 'Subscribe →',
  successMsg = "You're on the list.",
}: Props) {
  const [email, setEmail]     = useState('')
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errMsg, setErrMsg]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), source }),
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

  if (status === 'success') {
    return (
      <p className="text-[11px] tracking-wide text-[var(--color-gold-cta)]">
        ✓ {successMsg}
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={e => { setEmail(e.target.value); setStatus('idle') }}
        placeholder={placeholder}
        className="flex-1 bg-[rgba(255,255,255,0.06)] border border-white/10 rounded-sm px-4 py-2.5 text-xs text-[var(--color-text-on-dark)] placeholder:text-[var(--color-text-muted-dark)] focus:outline-none focus:border-[var(--color-gold-cta)]"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-5 py-2.5 text-[10px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all whitespace-nowrap cursor-pointer disabled:opacity-60"
      >
        {status === 'loading' ? '…' : btnLabel}
      </button>
      {status === 'error' && (
        <p className="text-[10px] text-red-400 mt-1 sm:col-span-2">{errMsg}</p>
      )}
    </form>
  )
}
