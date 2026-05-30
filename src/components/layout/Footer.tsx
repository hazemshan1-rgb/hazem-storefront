import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-gold-muted)] bg-[var(--color-surface)] mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-serif text-lg tracking-widest uppercase text-[var(--color-text)] mb-2">
            Hazem Shannak
          </p>
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed max-w-xs">
            30 years turning aquaculture ventures into high-yield, investment-ready enterprises.
          </p>
        </div>

        <div>
          <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-4">Resources</p>
          <div className="flex flex-col gap-2">
            <Link to="/shop" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">All Products</Link>
            <Link to="/shop?category=Ebook" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">Ebooks</Link>
            <Link to="/shop?category=SOP" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">SOPs</Link>
            <Link to="/shop?category=Toolkit" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">Toolkits</Link>
          </div>
        </div>

        <div>
          <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-4">Connect</p>
          <div className="flex flex-col gap-2">
            <Link to="/about" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">About Hazem</Link>
            <a
              href="https://www.linkedin.com/in/hazemhshannak"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--color-gold-muted)] max-w-6xl mx-auto px-6 py-4">
        <p className="text-[10px] text-[var(--color-text-muted)] tracking-wide">
          © {new Date().getFullYear()} Hazem Shannak. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
