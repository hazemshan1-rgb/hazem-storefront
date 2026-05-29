import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '../ui/Button'

const links = [
  { to: '/shop', label: 'Resources' },
  { to: '/about', label: 'About' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-gold-muted)] bg-[var(--color-bg)]/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif text-lg tracking-widest text-[var(--color-text)] uppercase">
          Hazem Shanshal
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-xs tracking-widest uppercase transition-colors ${
                  isActive
                    ? 'text-[var(--color-gold)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Button as="a" href="/shop" size="sm">Browse Resources</Button>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--color-gold-muted)] bg-[var(--color-surface)] px-6 py-4 flex flex-col gap-4">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="text-xs tracking-widest uppercase text-[var(--color-text-muted)] hover:text-[var(--color-gold)]"
            >
              {l.label}
            </NavLink>
          ))}
          <Button as="a" href="/shop" size="sm" className="w-fit">Browse Resources</Button>
        </div>
      )}
    </header>
  )
}
