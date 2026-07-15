import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'
import { useContactModal } from '../../context/ContactModalContext'

export function Navbar() {
  const { t } = useTranslation()
  const { openContactModal } = useContactModal()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const links = [
    { to: '/',             label: t('nav.home') },
    { to: '/tools',        label: t('nav.tools') },
    { to: '/audit',        label: t('nav.audit') },
    { to: '/consultation', label: t('nav.consultation') },
    { to: '/shop',         label: t('nav.shop') },
    { to: '/library',      label: t('nav.library') },
    { to: '/about',        label: t('nav.about') },
  ]

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
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
        style={{
          backgroundColor: scrolled ? 'rgba(10, 22, 42, 0.98)' : '#0F172A',
          backdropFilter: scrolled ? 'blur(16px)' : undefined,
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : undefined,
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.4)' : 'none',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo + Name */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <img
              src="/images/hazem-logo.jpg"
              alt="Hazem Shannak"
              className="h-11 w-11 rounded-full object-cover border border-[var(--color-gold-muted)] shrink-0"
            />
            <span className="font-sans font-bold text-xl tracking-[0.2em] text-white uppercase group-hover:text-[var(--color-gold-cta)] transition-colors duration-300">
              Hazem Shannak
            </span>
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
                      : 'text-white/70 hover:text-white'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <a
              href="https://www.reddit.com/r/JumboShrimp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-widest uppercase transition-colors text-[var(--color-gold-cta)] hover:text-[var(--color-gold-cta)]/80"
            >
              {t('nav.community', { defaultValue: 'Community' })}
            </a>
            <button
              onClick={openContactModal}
              className="text-xs tracking-widest uppercase transition-colors text-white/70 hover:text-white"
            >
              {t('nav.contact')}
            </button>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white/70 hover:text-white p-2 -mr-2"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
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
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-16 left-0 right-0 z-50 md:hidden border-b border-white/10 shadow-2xl"
              style={{ backgroundColor: '#0F172A' }}
              aria-label={t('nav.mobileNav')}
            >
              <div className="px-6 pt-6 pb-8 flex flex-col">
                <div className="flex flex-col divide-y divide-white/10">
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
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between py-4 text-sm tracking-widest uppercase transition-colors ${
                            isActive
                              ? 'text-[var(--color-gold-cta)]'
                              : 'text-white/70 hover:text-white'
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

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: links.length * 0.04, duration: 0.18 }}
                >
                  <a
                    href="https://www.reddit.com/r/JumboShrimp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between py-4 text-sm tracking-widest uppercase text-[var(--color-gold-cta)]"
                  >
                    <span>{t('nav.community', { defaultValue: 'Community' })}</span>
                  </a>
                  <button
                    onClick={() => { setOpen(false); openContactModal() }}
                    className="flex items-center justify-between w-full py-4 text-sm tracking-widest uppercase text-white/70 hover:text-white transition-colors"
                  >
                    <span>{t('nav.contact')}</span>
                  </button>
                </motion.div>

                {/* CTA buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: links.length * 0.04 + 0.08, duration: 0.2 }}
                  className="mt-6 flex flex-col gap-3"
                >
                  <Button as="link" to="/diagnostic" size="lg" className="w-full justify-center" onClick={() => setOpen(false)}>
                    {t('nav.cta.farmScore')}
                  </Button>
                  <Button as="link" to="/audit" size="lg" variant="secondary" className="w-full justify-center" onClick={() => setOpen(false)}>
                    {t('nav.cta.audit')}
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
