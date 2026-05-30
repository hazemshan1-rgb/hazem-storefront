import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { articles, articleTags } from '../data/articles'
import type { Article } from '../data/articles'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="card-hover flex flex-col bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm overflow-hidden hover:border-[var(--color-gold)] transition-colors group">
      {/* Cover image */}
      <div className="relative h-48 overflow-hidden shrink-0">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)]/60 to-transparent" />
        {article.tag && (
          <span className="absolute top-3 right-3 text-[9px] tracking-widest uppercase text-[var(--color-gold)] bg-[var(--color-bg)]/90 px-2 py-1 rounded-sm">
            {article.tag}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <time className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)]">
          {formatDate(article.date)}
        </time>

        <h2 className="font-serif text-base text-[var(--color-text)] leading-snug group-hover:text-[var(--color-gold)] transition-colors">
          {article.title}
        </h2>

        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed flex-1">
          {article.summary}
        </p>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-[var(--color-gold)] hover:underline mt-auto pt-1"
        >
          Read on LinkedIn
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </article>
  )
}

export function NewsletterPage() {
  const headerRef = useScrollReveal<HTMLElement>()
  const gridRef = useScrollReveal<HTMLDivElement>()
  const [activeTag, setActiveTag] = useState('All')

  const filtered = activeTag === 'All'
    ? articles
    : articles.filter(a => a.tag === activeTag)

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-24 pb-24">

      {/* Header */}
      <section ref={headerRef} className="scroll-reveal max-w-6xl mx-auto px-6 pt-12 pb-16 border-b border-[var(--color-gold-muted)]">
        <div className="max-w-2xl">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4">LinkedIn Newsletter</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] leading-tight mb-6">
            Aquaculture: The Last Frontier
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-8 max-w-xl">
            A newsletter on aquaculture business, sustainability, and systems thinking — written from 30 years of field experience across 15 countries. No theory without practice. No opinion without evidence.
          </p>
          <a
            href="https://www.linkedin.com/newsletters/aquaculture-the-last-frontier-6927281798808776705/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold text-[var(--color-bg)] bg-[var(--color-gold)] px-5 py-2.5 rounded-sm hover:opacity-90 transition-opacity"
          >
            Subscribe on LinkedIn
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-2">
          {articleTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`text-[10px] tracking-widest uppercase px-4 py-2 rounded-sm border transition-colors ${
                activeTag === tag
                  ? 'border-[var(--color-gold)] text-[var(--color-gold)] bg-[var(--color-gold-muted)]'
                  : 'border-[var(--color-gold-muted)] text-[var(--color-text-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-text)]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Article grid */}
      <section className="max-w-6xl mx-auto px-6">
        <div ref={gridRef} className="stagger-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(article => (
            <ArticleCard key={article.url + article.date} article={article} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-sm text-[var(--color-text-muted)] py-12 text-center">No articles in this category yet.</p>
        )}
      </section>

      {/* CTA strip */}
      <section className="max-w-6xl mx-auto px-6 mt-20">
        <div className="border border-[var(--color-gold-muted)] rounded-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-serif text-xl text-[var(--color-text)] mb-2">Get new articles in your feed</p>
            <p className="text-xs text-[var(--color-text-muted)]">Published when there is something worth saying. Not on a schedule.</p>
          </div>
          <a
            href="https://www.linkedin.com/newsletters/aquaculture-the-last-frontier-6927281798808776705/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs tracking-widest uppercase font-semibold text-[var(--color-bg)] bg-[var(--color-gold)] px-6 py-3 rounded-sm hover:opacity-90 transition-opacity"
          >
            Follow the Newsletter →
          </a>
        </div>
      </section>

    </main>
  )
}
