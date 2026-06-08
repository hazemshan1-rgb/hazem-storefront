import { useState, useMemo, useRef, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { GoldBadge } from '../components/ui/GoldBadge'
import { SEO } from '../components/ui/SEO'
import { Search } from 'lucide-react'
import { resources, resourceCategories } from '../data/resources'
import type { ResourceCategory } from '../data/resources'

function ResourceCard({ title, description, url, category, free }: {
  title: string; description: string; url: string; category: ResourceCategory; free: boolean
}) {
  const { t } = useTranslation()
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-6 flex flex-col gap-3 hover:border-[var(--color-gold)] hover:shadow-[0_16px_40px_rgba(139,108,58,0.13)] hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between gap-3">
        <span className="flex-1 min-w-0"><GoldBadge label={category} /></span>
        <span className={`shrink-0 text-[9px] tracking-widest uppercase font-semibold px-2 py-0.5 rounded-sm ${free ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border border-[var(--color-gold-muted)]'}`}>
          {free ? t('library.freeLabel') : t('library.subscriptionLabel')}
        </span>
      </div>
      <h3 className="font-serif text-lg text-[var(--color-text)] leading-snug">{title}</h3>
      <p className="text-xs text-[var(--color-text-muted)] leading-relaxed flex-1">{description}</p>
      <a href={url} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-semibold text-[var(--color-gold)] hover:underline mt-auto pt-2 border-t border-[var(--color-gold-muted)]">
        {t('library.visitResource')}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </div>
  )
}

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

function AiChat() {
  const { t } = useTranslation()
  const [messages,  setMessages] = useState<Message[]>([])
  const [input,     setInput]    = useState('')
  const [loading,   setLoading]  = useState(false)
  const [error,     setError]    = useState<string | null>(null)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLTextAreaElement>(null)

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

  const followUps = [t('library.aiFollowUp1'), t('library.aiFollowUp2'), t('library.aiFollowUp3')]

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 280px)' }}>
      <p className="text-xs text-[var(--color-text-muted)] mb-6 leading-relaxed">
        {t('library.aiContextNote')}
      </p>

      <div className="flex-1 overflow-y-auto mb-4">
        <div className="space-y-6">
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-4">{t('library.aiSuggestedQ')}</p>
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

          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[var(--color-navy)] border border-[var(--color-gold-muted)] flex items-center justify-center shrink-0 mt-1 mr-3">
                    <span className="font-serif text-[10px] text-[var(--color-gold)]">H</span>
                  </div>
                )}
                <div className={`max-w-[85%] rounded-sm px-5 py-4 ${msg.role === 'user' ? 'bg-[var(--color-navy)] text-[var(--color-text-on-dark)] ml-8' : 'bg-[var(--color-surface)] border border-[var(--color-gold-muted)] text-[var(--color-text)]'}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

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

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="p-4 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700">
              {error}
              {error.includes('ANTHROPIC') && (
                <p className="text-xs text-red-500 mt-1">{t('library.apiKeyError')}</p>
              )}
            </motion.div>
          )}

          {messages.length > 0 && !loading && (
            <div className="flex flex-wrap gap-2">
              {followUps.map(f => (
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

      <div className="border-t border-[var(--color-border)] pt-4 sticky bottom-0 bg-[var(--color-bg)] pb-2">
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
            placeholder={t('library.aiPlaceholder')}
            rows={2}
            className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] resize-none leading-relaxed" />
          <button type="submit" disabled={loading || input.trim().length < 3}
            className="shrink-0 bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-5 py-3 text-[10px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            {t('library.aiSendBtn')}
          </button>
        </form>
        <p className="text-[9px] text-[var(--color-text-muted)] mt-2">{t('library.aiPressEnter')}</p>
      </div>
    </div>
  )
}

type Filter = 'All' | ResourceCategory
type PageTab = 'library' | 'ai'

export function ResourcesPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [tab,    setTab]    = useState<PageTab>(searchParams.get('tab') === 'ai' ? 'ai' : 'library')
  const [active, setActive] = useState<Filter>('All')
  const [query,  setQuery]  = useState('')
  const headerRef = useScrollReveal<HTMLElement>()

  const filters: Filter[] = ['All', ...resourceCategories]

  const filtered = useMemo(() => {
    return resources.filter(r => {
      const matchesCategory = active === 'All' || r.category === active
      const matchesSearch   = r.title.toLowerCase().includes(query.toLowerCase()) ||
                              r.description.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [active, query])

  const tabs: { id: PageTab; labelKey: string }[] = [
    { id: 'library', labelKey: 'library.tabLibrary' },
    { id: 'ai',      labelKey: 'library.tabAi' },
  ]

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-12 md:pb-24">
      <SEO
        title={tab === 'ai' ? t('library.seoTitleAi') : t('library.seoTitle')}
        description={t('library.seoDesc')}
        url="/library"
      />

      <section ref={headerRef} className="scroll-reveal max-w-6xl mx-auto px-6 pt-12 pb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-3">{t('library.eyebrow')}</p>
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] mb-5 max-w-2xl leading-tight">
          {t('library.headline')}
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
          {t('library.body')}
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-4">
          {t('library.resourceCount', { n: resources.length, m: resources.filter(r => r.free).length })}
        </p>
      </section>

      <div className="border-b border-[var(--color-gold-muted)] bg-[var(--color-surface)] sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex">
            {tabs.map(t2 => (
              <button key={t2.id} onClick={() => setTab(t2.id)}
                className={`text-[10px] tracking-widest uppercase font-semibold px-5 py-4 border-b-2 transition-colors whitespace-nowrap ${tab === t2.id ? 'border-[var(--color-gold)] text-[var(--color-gold)]' : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}>
                {t(t2.labelKey)}
              </button>
            ))}
          </div>

          {tab === 'library' && (
            <div className="flex items-stretch flex-1 min-w-0 overflow-hidden ml-4">
              <div className="flex-1 min-w-0 overflow-hidden relative">
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[var(--color-surface)] to-transparent z-10" />
                <div className="flex gap-0 overflow-x-auto no-scrollbar w-full">
                  {filters.map(f => (
                    <button key={f} onClick={() => setActive(f)}
                      className={`shrink-0 text-[10px] tracking-widest uppercase font-semibold px-4 py-4 border-b-2 transition-colors whitespace-nowrap ${active === f ? 'border-[var(--color-gold)] text-[var(--color-gold)]' : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="shrink-0 flex items-center pl-4 border-l border-[var(--color-gold-muted)]">
                <div className="relative w-28 sm:w-44">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={14} />
                  <input type="text" placeholder={t('library.searchPlaceholder')} value={query} onChange={e => setQuery(e.target.value)}
                    className="w-full bg-[var(--color-surface-2)] border border-[var(--color-gold-muted)] rounded-sm pl-9 pr-3 py-2 text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div style={{ display: tab === 'library' ? 'block' : 'none' }}>
          <section className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(r => <ResourceCard key={r.url} {...r} />)}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-sm text-[var(--color-text-muted)] py-16">{t('library.noResults')}</p>
            )}
          </section>

          <section className="mt-10 md:mt-20 mb-10">
            <div className="bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2">{t('library.goDeeper')}</p>
                <h2 className="font-serif text-2xl text-[var(--color-text)] mb-2">{t('library.ctaTitle')}</h2>
                <p className="text-sm text-[var(--color-text-muted)] max-w-lg leading-relaxed">
                  {t('library.ctaBody')}
                </p>
              </div>
              <Link to="/consultation"
                className="inline-flex items-center justify-center bg-[var(--color-gold)] text-[var(--color-bg)] px-8 py-4 text-xs tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all whitespace-nowrap shrink-0">
                {t('library.ctaBtn')}
              </Link>
            </div>
          </section>

          <section className="pb-10">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-5">{t('library.crossNavTitle')}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { to: '/diagnostic',      labelKey: 'library.crossLink1Label', subKey: 'library.crossLink1Sub' },
                { to: '/benchmark',       labelKey: 'library.crossLink2Label', subKey: 'library.crossLink2Sub' },
                { to: '/valuation',       labelKey: 'library.crossLink3Label', subKey: 'library.crossLink3Sub' },
                { to: '/symptom-checker', labelKey: 'library.crossLink4Label', subKey: 'library.crossLink4Sub' },
              ].map(l => (
                <Link key={l.to} to={l.to}
                  className="block p-4 bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm hover:border-[var(--color-gold)] transition-all group text-center">
                  <p className="text-xs font-semibold text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors mb-1">{t(l.labelKey)}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)] leading-snug">{t(l.subKey)}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div style={{ display: tab === 'ai' ? 'block' : 'none' }}>
          <div className="pt-10 max-w-3xl">
            <AiChat />
          </div>
        </div>
      </div>
    </main>
  )
}
