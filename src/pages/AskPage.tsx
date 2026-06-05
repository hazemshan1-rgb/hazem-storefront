import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SEO } from '../components/ui/SEO'

interface Message { role: 'user' | 'assistant'; content: string; id: number }

const STARTERS = [
  'What FCR should I expect from vannamei at 80 PL/m² in a lined pond?',
  'My morning DO is crashing — what are the most likely causes?',
  'How do I manage C:N ratio in a biofloc system during a rainy season?',
  'What certification do I need to export shrimp to Europe?',
  'How should I prepare my farm financials for investor due diligence?',
  'What causes invisible mortality in intensive shrimp culture?',
]

let msgCount = 0

export function AskPage() {
  const [messages, setMessages]   = useState<Message[]>([])
  const [input,    setInput]      = useState('')
  const [loading,  setLoading]    = useState(false)
  const [error,    setError]      = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text: string) {
    const userMsg: Message = { role: 'user', content: text.trim(), id: ++msgCount }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/library-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.content })) }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error ?? 'Request failed')
      }
      const { reply } = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: reply, id: ++msgCount }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input.trim().length > 2 && !loading) send(input)
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e as unknown as React.FormEvent) }
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] flex flex-col pt-16">
      <SEO
        title="Ask the Aquaculture AI — Library Knowledge Assistant"
        description="Ask any question about shrimp production, water quality, FCR, biofloc, disease, or farm economics. Powered by 30 years of field experience and a curated library of 35+ technical resources."
        url="/ask"
      />

      {/* Header */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-1">AI Library Assistant</p>
              <h1 className="font-serif text-xl text-[var(--color-text)]">Ask anything about aquaculture</h1>
            </div>
            <Link to="/library" className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors hidden sm:block">
              Browse Library →
            </Link>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-2 leading-relaxed">
            Draws on 35 curated technical resources and 30 years of field experience across vannamei, monodon, and freshwater prawn systems.
            Ask about water quality, FCR, disease, biofloc, farm economics, or certifications.
          </p>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

          {/* Empty state */}
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-4">Suggested questions</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STARTERS.map(s => (
                  <button key={s} onClick={() => send(s)}
                    className="text-left text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-gold-muted)] rounded-sm px-4 py-3 transition-all leading-snug">
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[var(--color-navy)] border border-[var(--color-gold-muted)] flex items-center justify-center shrink-0 mt-1 mr-3">
                    <span className="font-serif text-[10px] text-[var(--color-gold)]">H</span>
                  </div>
                )}
                <div className={`max-w-[85%] rounded-sm px-5 py-4 ${
                  msg.role === 'user'
                    ? 'bg-[var(--color-navy)] text-[var(--color-text-on-dark)] ml-8'
                    : 'bg-[var(--color-surface)] border border-[var(--color-gold-muted)] text-[var(--color-text)]'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-[var(--color-navy)] border border-[var(--color-gold-muted)] flex items-center justify-center shrink-0 mt-1 mr-3">
                <span className="font-serif text-[10px] text-[var(--color-gold)]">H</span>
              </div>
              <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm px-5 py-4">
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="p-4 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700">
              {error}
              {error.includes('ANTHROPIC') && (
                <p className="text-xs text-red-500 mt-1">Add ANTHROPIC_API_KEY to your Vercel environment variables.</p>
              )}
            </motion.div>
          )}

          {messages.length > 0 && !loading && (
            <div className="flex flex-wrap gap-2 mt-2">
              {['Tell me more', 'What resource covers this?', 'How does this apply to biofloc?'].map(f => (
                <button key={f} onClick={() => send(f)}
                  className="text-[10px] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--color-gold-muted)] rounded-sm px-3 py-1.5 transition-all">
                  {f}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] sticky bottom-0">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about water quality, FCR, disease, biofloc, farm economics…"
              rows={2}
              className="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] resize-none leading-relaxed"
            />
            <button type="submit" disabled={loading || input.trim().length < 3}
              className="shrink-0 bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-5 py-3 text-[10px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              Ask
            </button>
          </form>
          <p className="text-[9px] text-[var(--color-text-muted)] mt-2">Press Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </main>
  )
}
