import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const GUIDES = [
  {
    checkoutUrl: 'https://hazemshan.gumroad.com/l/zbhut',
    tagKey: 'emailCapture.guide1Tag',
    titleKey: 'products.free-biofloc-guide.title',
    bodyKey: 'products.free-biofloc-guide.description',
    featured: true,
    cover: '/images/guides/biofloc-guide-cover.png',
    coverAltKey: 'products.free-biofloc-guide.title',
  },
  {
    checkoutUrl: 'https://hazemshan.gumroad.com/l/qhfbbp',
    tagKey: 'emailCapture.guide2Tag',
    titleKey: 'products.free-7-strategies.title',
    bodyKey: 'products.free-7-strategies.description',
    featured: false,
    cover: '/images/guides/7-strategies-cover.png',
    coverAltKey: 'products.free-7-strategies.title',
  },
]

export function EmailCapture() {
  const { t } = useTranslation()
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} id="email-capture" className="scroll-reveal bg-[var(--color-navy)] border-y border-[rgba(255,255,255,0.08)]">
      <div className="max-w-6xl mx-auto px-6 py-20">

        <div className="text-center mb-14">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold-cta)] mb-4">
            {t('emailCapture.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-text-on-dark)] mb-4">
            {t('emailCapture.headline')}
          </h2>
          <p className="text-sm text-[var(--color-text-muted-dark)] max-w-xl mx-auto leading-relaxed">
            {t('emailCapture.body')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {GUIDES.map(guide => (
            <div
              key={guide.titleKey}
              className={`bg-[var(--color-surface)] rounded-sm overflow-hidden flex flex-col gap-6 ${
                guide.featured
                  ? 'border border-[var(--color-gold-cta)] shadow-[0_0_32px_rgba(202,138,4,0.08)]'
                  : 'border border-[var(--color-border)]'
              }`}
            >
              <div className="relative">
                <img
                  src={guide.cover}
                  alt={t(guide.coverAltKey)}
                  className="w-full h-48 object-cover object-top"
                />
                {guide.featured && (
                  <span className="absolute top-3 left-3 text-[9px] tracking-[0.2em] uppercase font-semibold bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-2.5 py-1 rounded-sm">
                    {t('emailCapture.mostDownloaded')}
                  </span>
                )}
              </div>

              <div className="px-8 pb-8 flex flex-col gap-6">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-gold)] mb-2">
                    {t(guide.tagKey)}
                  </p>
                  <h3 className="font-serif text-xl text-[var(--color-text)] leading-snug mb-3">
                    {t(guide.titleKey)}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    {t(guide.bodyKey)}
                  </p>
                </div>
                <a
                  href={guide.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 self-start bg-[var(--color-gold-cta)] text-[var(--color-navy)] px-6 py-3 text-[11px] tracking-widest uppercase font-semibold rounded-sm hover:brightness-110 transition-all"
                >
                  {t('emailCapture.getCopy')}
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
