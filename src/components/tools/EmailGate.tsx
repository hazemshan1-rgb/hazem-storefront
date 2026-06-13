import { useState, type ReactNode } from 'react'

interface CapturedEmail { name: string; email: string }

const STORAGE_KEY = 'tools_email_captured'

function load(): CapturedEmail | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

interface Props {
  toolName: string
  children: ReactNode
}

export function EmailGate({ toolName, children }: Props) {
  const [captured, setCaptured] = useState<CapturedEmail | null>(() => load())
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (captured) return <>{children}</>

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim()) {
      setError('Please fill in both fields.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setSubmitting(true)
    const data: CapturedEmail = { name: name.trim(), email: email.trim() }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch { /* storage unavailable */ }
    setCaptured(data)
    setSubmitting(false)
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">
          Free Tool
        </p>
        <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-text)] leading-tight mb-3">
          Access the {toolName}
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-8">
          Enter your name and email to unlock the calculator. No spam — just the tool.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-2 font-semibold">
              First Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your first name"
              className="w-full bg-[var(--color-surface)] border border-[var(--color-gold-muted)] text-[var(--color-text)] px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors placeholder:text-[var(--color-text-muted)]"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-2 font-semibold">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[var(--color-surface)] border border-[var(--color-gold-muted)] text-[var(--color-text)] px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors placeholder:text-[var(--color-text-muted)]"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[var(--color-gold-cta)] text-[var(--color-navy)] py-3.5 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all disabled:opacity-60"
          >
            {submitting ? 'Opening…' : 'Access Free Tool'}
          </button>
        </form>

        <p className="text-[10px] text-[var(--color-text-muted)] mt-4 leading-relaxed">
          Your information is used only to deliver relevant aquaculture resources. Unsubscribe anytime.
        </p>
      </div>
    </div>
  )
}
