import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SubscribeForm } from '../ui/SubscribeForm'

const footerLink = 'text-xs text-[var(--color-text-muted-dark)] hover:text-[var(--color-gold-cta)] transition-colors'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[var(--color-navy)] mt-24">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/images/hazem-logo.jpg"
              alt="Hazem Shannak"
              className="h-10 w-10 rounded-full object-cover border border-[var(--color-gold-muted)] shrink-0"
            />
            <p className="font-serif font-bold text-lg tracking-[0.12em] uppercase text-white">
              Hazem Shannak
            </p>
          </div>
          <p className="text-xs text-[var(--color-text-muted-dark)] leading-relaxed mb-5">
            {t('footer.tagline')}
          </p>
          <a
            href="https://hazemshan.gumroad.com/l/cmcftu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-semibold text-[var(--color-gold-cta)] border border-[var(--color-gold-cta)] px-3 py-2 rounded-sm hover:bg-[rgba(202,138,4,0.1)] transition-all"
          >
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1v8M4 6.5l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('footer.freeAudit')}
          </a>
        </div>

        {/* Diagnose */}
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[var(--color-gold-cta)] mb-4">{t('footer.diagnose')}</p>
          <div className="flex flex-col gap-2.5">
            <Link to="/tools"            className={footerLink}>{t('footer.allTools')}</Link>
            <Link to="/diagnostic"       className={footerLink}>{t('footer.diagnostic')}</Link>
            <Link to="/benchmark"        className={footerLink}>{t('footer.benchmark')}</Link>
            <Link to="/valuation"        className={footerLink}>{t('footer.valuation')}</Link>
            <Link to="/newsletter"       className={footerLink}>{t('footer.newsletter')}</Link>
            <Link to="/about"            className={footerLink}>{t('footer.aboutHazem')}</Link>
          </div>
        </div>

        {/* Work with Hazem */}
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[var(--color-gold-cta)] mb-4">{t('footer.workWithMe')}</p>
          <div className="flex flex-col gap-2.5">
            <Link to="/audit"          className={footerLink}>{t('footer.farmAudit')}</Link>
            <Link to="/consultation"   className={footerLink}>{t('footer.bookConsultation')}</Link>
            <Link to="/courses"        className={footerLink}>{t('footer.courses')}</Link>
            <Link to="/case-studies"   className={footerLink}>{t('footer.caseStudies')}</Link>
          </div>

          <p className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[var(--color-gold-cta)] mb-4 mt-7">{t('footer.products')}</p>
          <div className="flex flex-col gap-2.5">
            <Link to="/shop"                   className={footerLink}>{t('footer.allProducts')}</Link>
            <Link to="/shop?category=Ebook"    className={footerLink}>{t('footer.ebooks')}</Link>
            <Link to="/shop?category=SOP"      className={footerLink}>{t('footer.sops')}</Link>
            <Link to="/shop?category=Toolkit"  className={footerLink}>{t('footer.toolkits')}</Link>
          </div>
        </div>

        {/* Connect */}
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[var(--color-gold-cta)] mb-4">{t('footer.connect')}</p>
          <div className="flex flex-col gap-2.5">
            <Link to="/about"       className={footerLink}>{t('footer.aboutHazem')}</Link>
            <Link to="/library"     className={footerLink}>{t('footer.resourcesLibrary')}</Link>
            <Link to="/newsletter"  className={footerLink}>{t('footer.newsletter')}</Link>
            <a
              href="https://www.linkedin.com/in/hazemhshannak"
              target="_blank"
              rel="noopener noreferrer"
              className={footerLink}
            >
              {t('footer.linkedin')}
            </a>
            {/* Community link hidden pending upgrades - re-enable when ready
            <a
              href="https://www.skool.com/the-aquapreneur-inner-circle-5684"
              target="_blank"
              rel="noopener noreferrer"
              className={footerLink}
            >
              {t('footer.community', { defaultValue: 'Community' })}
            </a>
            */}
          </div>

          <div className="mt-7 border border-[rgba(255,255,255,0.08)] rounded-sm p-4">
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold-cta)] mb-2">{t('footer.notSureWhere')}</p>
            <Link
              to="/diagnostic"
              className="block text-center text-[10px] tracking-widest uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-4 py-2.5 rounded-sm hover:brightness-110 transition-all"
            >
              {t('footer.takeScorecard')}
            </Link>
          </div>

          <div className="mt-5 border border-[rgba(255,255,255,0.08)] rounded-sm p-4">
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold-cta)] mb-1">Stay in the loop</p>
            <p className="text-[10px] text-[var(--color-text-muted-dark)] mb-3 leading-relaxed">Field notes, frameworks, and insights — direct to your inbox.</p>
            <SubscribeForm source="footer" placeholder="Your email" btnLabel="Join →" successMsg="Welcome aboard." />
          </div>
        </div>

      </div>

      <div className="border-t border-[rgba(255,255,255,0.06)] max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-[10px] text-[var(--color-text-muted-dark)] tracking-wide">
          {t('footer.rights', { year: new Date().getFullYear() })}
        </p>
        <p className="text-[10px] text-[var(--color-text-muted-dark)]">
          {t('footer.descriptor')}
        </p>
      </div>
    </footer>
  )
}
