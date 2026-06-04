import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'

const links = [
  { to: '/', label: 'Home' },
  { to: '/audit', label: 'Farm Audit' },
  { to: '/consultation', label: 'Consultation' },
  { to: '/shop', label: 'Shop' },
  { to: '/library', label: 'Library' },
  { to: '/about', label: 'About' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Close on navigation
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 border-b"
        animate={{
          backgroundColor: scrolled ? 'rgba(15, 23, 42, 0.92)' : 'rgba(15, 23, 42, 1)',
          borderColor: scrolled ? 'rgba(139, 105, 20, 0.2)' : 'rgba(255, 255, 255, 0.08)',
        }}
        style={{
          backdropFilter: scrolled ? 'blur(16px)' : undefined,
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : undefined,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="font-serif font-bold text-lg tracking-[0.12em] text-[var(--color-text-on-dark)] uppercase hover:text-[var(--color-gold-cta)] transition-colors duration-300"
          >
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
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-[var(--color-text-muted-dark)] hover:text-[var(--color-text-on-dark)] p-2 -mr-2"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'close' : 'open'}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.15 }}
                className="block"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      {/* Mobile menu — rendered outside header to avoid stacking context conflict */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-16 z-40 bg-[var(--color-navy)]/70 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-16 left-0 right-0 z-50 md:hidden bg-[var(--color-navy)] border-b border-[rgba(255,255,255,0.08)] shadow-2xl"
              aria-label="Mobile navigation"
            >
              <div className="px-6 pt-6 pb-8 flex flex-col">
                {/* Nav links */}
                <div className="flex flex-col divide-y divide-[rgba(255,255,255,0.06)]">
                  {links.map((l, i) => (
                    <motion.div
                      key={l.to}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.18 }}
                    >
                      <NavLink
                        to={l.to}
                        end={l.to === '/'}
                        className={({ isActive }) =>
                          `flex items-center justify-between py-4 text-sm tracking-widest uppercase transition-colors ${
                            isActive
                              ? 'text-[var(--color-gold-cta)]'
                              : 'text-[var(--color-text-muted-dark)] hover:text-[var(--color-text-on-dark)]'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span>{l.label}</span>
                            {isActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold-cta)]" />
                            )}
                          </>
                        )}
                      </NavLink>
                    </motion.div>
                  ))}
                </div>

                {/* CTA buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: links.length * 0.04 + 0.04, duration: 0.2 }}
                  className="mt-6 flex flex-col gap-3"
                >
                  <Button as="link" to="/shop" size="lg" className="w-full justify-center">
                    Browse Resources
                  </Button>
                  <Button as="link" to="/consultation" size="lg" variant="secondary" className="w-full justify-center">
                    Book a Call — $500
                  </Button>
                </motion.div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
