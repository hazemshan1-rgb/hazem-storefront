import { Link } from 'react-router-dom'

const footerLink = 'text-xs text-[var(--color-text-muted-dark)] hover:text-white transition-colors'

export function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[var(--color-navy)] mt-24">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="lg:col-span-1">
          <p className="font-serif font-bold text-lg tracking-[0.12em] uppercase text-white mb-3">
            Hazem Shannak
          </p>
          <p className="text-xs text-[var(--color-text-muted-dark)] leading-relaxed mb-5">
            30 years turning aquaculture ventures into high-yield, investment-ready enterprises across 15 countries.
          </p>
          <a
            href="/downloads/aquaculture-profit-leak-audit.pdf"
            download
            className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-semibold text-[var(--color-gold-cta)] border border-[var(--color-gold-cta)] px-3 py-2 rounded-sm hover:bg-[rgba(202,138,4,0.1)] transition-all"
          >
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1v8M4 6.5l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Free Audit Guide
          </a>
        </div>

        {/* Diagnose */}
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[var(--color-gold-cta)] mb-4">Diagnose Your Farm</p>
          <div className="flex flex-col gap-2.5">
            <Link to="/tools"            className={footerLink}>All Diagnostic Tools</Link>
            <Link to="/diagnostic"       className={footerLink}>Farm Diagnostic Scorecard</Link>
            <Link to="/benchmark"        className={footerLink}>Benchmark Calculator</Link>
            <Link to="/valuation"        className={footerLink}>Farm Valuation Tool</Link>
            <Link to="/symptom-checker"  className={footerLink}>Symptom Checker</Link>
            <Link to="/ask"              className={footerLink}>AI Library Assistant</Link>
          </div>
        </div>

        {/* Work with Hazem */}
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[var(--color-gold-cta)] mb-4">Work with Hazem</p>
          <div className="flex flex-col gap-2.5">
            <Link to="/audit"          className={footerLink}>Farm Audit Programme</Link>
            <Link to="/consultation"   className={footerLink}>Book a Consultation</Link>
            <Link to="/courses"        className={footerLink}>Courses</Link>
            <Link to="/case-studies"   className={footerLink}>Case Studies</Link>
          </div>

          <p className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[var(--color-gold-cta)] mb-4 mt-7">Products</p>
          <div className="flex flex-col gap-2.5">
            <Link to="/shop"                   className={footerLink}>All Products</Link>
            <Link to="/shop?category=Ebook"    className={footerLink}>Ebooks</Link>
            <Link to="/shop?category=SOP"      className={footerLink}>SOPs</Link>
            <Link to="/shop?category=Toolkit"  className={footerLink}>Toolkits</Link>
          </div>
        </div>

        {/* Connect */}
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[var(--color-gold-cta)] mb-4">Connect</p>
          <div className="flex flex-col gap-2.5">
            <Link to="/about"       className={footerLink}>About Hazem</Link>
            <Link to="/library"     className={footerLink}>Resources Library</Link>
            <Link to="/newsletter"  className={footerLink}>Newsletter</Link>
            <a
              href="https://www.linkedin.com/in/hazemhshannak"
              target="_blank"
              rel="noopener noreferrer"
              className={footerLink}
            >
              LinkedIn ↗
            </a>
          </div>

          <div className="mt-7 border border-[rgba(255,255,255,0.08)] rounded-sm p-4">
            <p className="text-[9px] tracking-widest uppercase text-[var(--color-gold-cta)] mb-2">Not sure where to start?</p>
            <Link
              to="/diagnostic"
              className="block text-center text-[10px] tracking-widest uppercase font-semibold text-[var(--color-navy)] bg-[var(--color-gold-cta)] px-4 py-2.5 rounded-sm hover:brightness-110 transition-all"
            >
              Take the Scorecard
            </Link>
          </div>
        </div>

      </div>

      <div className="border-t border-[rgba(255,255,255,0.06)] max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-[10px] text-[var(--color-text-muted-dark)] tracking-wide">
          © {new Date().getFullYear()} Hazem Shannak. All rights reserved.
        </p>
        <p className="text-[10px] text-[var(--color-text-muted-dark)]">
          Aquaculture consulting · Business growth · Farm audits
        </p>
      </div>
    </footer>
  )
}
