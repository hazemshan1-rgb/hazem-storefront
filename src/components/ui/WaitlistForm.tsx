import { useState } from 'react'
import { joinCourseWaitlist } from '../../lib/diagnosticPersistence'

interface WaitlistFormProps {
  courseSlug: string
  courseTitle: string
  compact?: boolean
}

export function WaitlistForm({ courseSlug, courseTitle, compact }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'duplicate' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('submitting')
    const result = await joinCourseWaitlist(email, courseSlug)
    if (result.success) {
      setStatus('success')
    } else if (result.duplicate) {
      setStatus('duplicate')
    } else {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={`bg-[rgba(20,184,166,0.08)] border border-[var(--color-teal-cta)]/30 rounded-sm ${compact ? 'p-3' : 'p-5'} text-center`}>
        <p className={`text-[var(--color-teal-cta)] ${compact ? 'text-xs' : 'text-sm'}`}>
          You're on the waitlist! We'll notify you when {courseTitle} launches.
        </p>
      </div>
    )
  }

  if (status === 'duplicate') {
    return (
      <div className={`bg-[rgba(202,138,4,0.06)] border border-[var(--color-gold-muted)] rounded-sm ${compact ? 'p-3' : 'p-5'} text-center`}>
        <p className={`text-[var(--color-gold)] ${compact ? 'text-xs' : 'text-sm'}`}>
          You're already on the waitlist for this course.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-sm px-3 py-2 text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)]"
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-4 py-2 text-[10px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all whitespace-nowrap cursor-pointer disabled:opacity-60"
      >
        {status === 'submitting' ? 'Joining…' : 'Join Waitlist'}
      </button>
    </form>
  )
}
