import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 border-b"
      animate={{
        backgroundColor: scrolled ? 'rgba(15, 23, 42, 0.85)' : 'rgba(15, 23, 42, 1)',
        borderColor: scrolled ? 'rgba(139, 105, 20, 0.2)' : 'rgba(255, 255, 255, 0.08)',
        backdropFilter: scrolled ? 'blur(16px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-sans font-bold text-xl tracking-[0.2em] text-[var(--color-text-on-dark)] uppercase hover:text-[var(--color-gold-cta)] transition-colors duration-300">
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
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? 'close' : 'open'}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      {/* Backdrop overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 bg-[var(--color-navy)]/60 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile menu — animated slide */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-[rgba(255,255,255,0.08)] bg-[var(--color-navy-2)]"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                >
                  <NavLink
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
                </motion.div>
              ))}
              <div className="pt-4 border-t border-[rgba(255,255,255,0.08)] flex flex-col gap-3">
                <Button as="link" to="/shop" size="lg" className="w-full text-center py-4" onClick={() => setOpen(false)}>Browse Resources</Button>
                <Button as="link" to="/consultation" size="lg" variant="secondary" className="w-full text-center py-4" onClick={() => setOpen(false)}>Book a Call</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
