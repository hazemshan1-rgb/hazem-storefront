import { useState } from 'react'
import type { CapturedEmail } from './EmailGate'

export interface ReportField { label: string; value: string }

interface Props {
  toolName: string
  source: string
  inputs: ReportField[]
  results: ReportField[]
  capturedEmail?: CapturedEmail | null
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ReportExport({ toolName, source, inputs, results, capturedEmail }: Props) {
  const [showPrompt, setShowPrompt] = useState(false)
  const [name, setName]   = useState(capturedEmail?.name ?? '')
  const [email, setEmail] = useState(capturedEmail?.email ?? '')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  async function sendReport(e?: React.FormEvent) {
    e?.preventDefault()
    if (!name.trim() || !email.trim()) {
      setErrMsg('Enter your name and email to receive the report.')
      return
    }
    if (!EMAIL_RE.test(email)) {
      setErrMsg('Enter a valid email address.')
      return
    }
    setStatus('loading')
    setErrMsg('')
    try {
      const res = await fetch('/api/report-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          source,
          toolName,
          inputs,
          results,
        }),
      })
      const data = await res.json() as { success?: boolean; error?: string }
      if (data.success) {
        setStatus('success')
      } else {
        setErrMsg(data.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch {
      setErrMsg('Network error — please try again.')
      setStatus('error')
    }
  }

  function handleEmailClick() {
    if (capturedEmail) {
      void sendReport()
    } else {
      setShowPrompt(true)
    }
  }

  const timestamp = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="no-print mt-8 pt-8 border-t border-[var(--color-gold-muted)]">
      <div className="flex flex-wrap gap-3 items-center">
        <button
          type="button"
          onClick={() => window.print()}
          className="text-[10px] tracking-widest uppercase font-semibold text-[var(--color-text-muted)] border border-[var(--color-gold-muted)] px-5 py-2.5 rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all"
        >
          Save as PDF
        </button>

        {status === 'success' ? (
          <p className="text-[11px] text-[var(--color-gold-cta)]">✓ Report sent to {email}</p>
        ) : (
          <button
            type="button"
            onClick={handleEmailClick}
            disabled={status === 'loading'}
            className="text-[10px] tracking-widest uppercase font-semibold text-[var(--color-text-muted)] border border-[var(--color-gold-muted)] px-5 py-2.5 rounded-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all disabled:opacity-60"
          >
            {status === 'loading' ? 'Sending…' : 'Email Me This Report'}
          </button>
        )}
      </div>

      {showPrompt && status !== 'success' && !capturedEmail && (
        <form onSubmit={sendReport} className="mt-4 flex flex-wrap gap-2 max-w-md">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your first name"
            className="flex-1 min-w-[140px] bg-[var(--color-surface)] border border-[var(--color-gold-muted)] text-[var(--color-text)] px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[var(--color-gold)]"
          />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 min-w-[160px] bg-[var(--color-surface)] border border-[var(--color-gold-muted)] text-[var(--color-text)] px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[var(--color-gold)]"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="text-[10px] tracking-widest uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-4 py-2 rounded-sm hover:brightness-110 transition-all disabled:opacity-60"
          >
            {status === 'loading' ? 'Sending…' : 'Send'}
          </button>
        </form>
      )}

      {errMsg && <p className="text-xs text-red-400 mt-2">{errMsg}</p>}

      {/* Print-only report block — hidden on screen, shown by @media print in globals.css */}
      <div className="print-report">
        <p className="report-title">{toolName} — Report</p>
        <p className="report-meta">Prepared {timestamp} · hazemshannak.cc</p>

        <h3>Inputs</h3>
        <ul>
          {inputs.map(f => (
            <li key={f.label}><span>{f.label}</span><span>{f.value}</span></li>
          ))}
        </ul>

        <h3>Results</h3>
        <ul>
          {results.map(f => (
            <li key={f.label}><span>{f.label}</span><span>{f.value}</span></li>
          ))}
        </ul>

        <p className="report-footer">
          Prepared by Hazem Shannak, Director &amp; Business Growth Architect — hazemshannak.cc
        </p>
      </div>
    </div>
  )
}
