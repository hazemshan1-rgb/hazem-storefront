import { useTranslation } from 'react-i18next'

const logos = [
  { abbr: 'AISP',  full: 'Association of International Seafood Professionals' },
  { abbr: 'IUCN',  full: 'International Union for Conservation of Nature' },
  { abbr: 'FAO',   full: 'Food and Agriculture Organization of the United Nations' },
  { abbr: 'JSOF',  full: 'Jordanian Society for Organic Farming — IFOAM' },
  { abbr: 'RAED',  full: 'Arab Network for Environment & Development' },
  { abbr: 'JAEA',  full: 'Jordan Agricultural Engineers Association' },
]

export function TrustLogos() {
  const { t } = useTranslation()

  return (
    <section className="border-b border-[var(--color-gold-muted)] bg-[var(--color-bg)] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <p className="text-center text-[9px] tracking-[0.35em] uppercase text-[var(--color-text-muted)] mb-5">
          {t('trustLogos.heading')}
        </p>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-[var(--color-bg)] to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-[var(--color-bg)] to-transparent" />

          <div className="flex animate-ticker whitespace-nowrap">
            {[...logos, ...logos].map((logo, i) => (
              <div key={i} title={logo.full} className="inline-flex items-center gap-2 mx-8 shrink-0 group">
                <span className="font-serif text-base font-bold tracking-[0.08em] text-[var(--color-text-muted)] group-hover:text-[var(--color-gold)] transition-colors duration-300">
                  {logo.abbr}
                </span>
                <span className="text-[var(--color-gold-muted)] text-xs">·</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 28s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
