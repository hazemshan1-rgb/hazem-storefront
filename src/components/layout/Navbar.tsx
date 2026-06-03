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
      <div
        className={`fixed inset-0 top-16 z-40 bg-[var(--color-navy)]/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />
      <div
        className={`fixed top-16 left-0 right-0 z-50 border-t border-[rgba(255,255,255,0.08)] bg-[var(--color-navy-2)] px-6 py-8 flex flex-col gap-6 transition-all duration-300 ease-in-out md:hidden ${
          open ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `text-sm tracking-widest uppercase transition-colors ${
                isActive ? 'text-[var(--color-gold-cta)]' : 'text-[var(--color-text-muted-dark)]'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
        <div className="pt-4 border-t border-[rgba(255,255,255,0.08)] flex flex-col gap-3">
          <Button as="link" to="/shop" size="lg" className="w-full text-center py-4" onClick={() => setOpen(false)}>Browse Resources</Button>
          <Button as="link" to="/consultation" size="lg" variant="secondary" className="w-full text-center py-4" onClick={() => setOpen(false)}>Book a Call</Button>
        </div>
      </div>
    </header>
  )
}
