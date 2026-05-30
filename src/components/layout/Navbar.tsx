import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '../ui/Button'

const links = [
  { to: '/', label: 'Home' },
  { to: '/audit', label: 'Farm Audit' },
  { to: '/newsletter', label: 'Newsletter' },
  { to: '/library', label: 'Library' },
  { to: '/about', label: 'About' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(255,255,255,0.08)] bg-[var(--color-navy)]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif text-2xl tracking-[0.12em] text-[var(--color-text-on-dark)] uppercase hover:text-[var(--color-gold-cta)] transition-colors duration-300">
          Hazem Shannak
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `text-xs tracking-widest uppercase transition-colors ${
                  isActive
                    ? 'text-[var(--color-gold-cta)]'
                    : 'text-[var(--color-text-muted-dark)] hover:text-[var(--color-text-on-dark)]'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Button as="link" to="/shop" size="sm">Browse Resources</Button>
          <Button as="link" to="/consultation" size="sm" variant="secondary">Book a Call</Button>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[var(--color-text-muted-dark)] hover:text-[var(--color-text-on-dark)]"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[rgba(255,255,255,0.08)] bg-[var(--color-navy-2)] px-6 py-4 flex flex-col gap-4">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="text-xs tracking-widest uppercase text-[var(--color-text-muted-dark)] hover:text-[var(--color-gold-cta)]"
            >
              {l.label}
            </NavLink>
          ))}
          <Button as="link" to="/shop" size="sm" className="w-fit">Browse Resources</Button>
          <Button as="link" to="/consultation" size="sm" variant="secondary" className="w-fit">Book a Call</Button>
        </div>
      )}
    </header>
  )
}
