import { createContext, useContext, useState, type ReactNode } from 'react'
import { ContactModal } from '../components/layout/ContactModal'

interface ContactModalContextValue {
  openContactModal: () => void
}

const ContactModalContext = createContext<ContactModalContextValue | null>(null)

// Lives at the app root so Navbar and Footer — two independent components —
// can both trigger the same modal instance instead of each owning their own.
export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ContactModalContext.Provider value={{ openContactModal: () => setIsOpen(true) }}>
      {children}
      {isOpen && <ContactModal onClose={() => setIsOpen(false)} />}
    </ContactModalContext.Provider>
  )
}

export function useContactModal(): ContactModalContextValue {
  const ctx = useContext(ContactModalContext)
  if (!ctx) {
    throw new Error('useContactModal must be used within a ContactModalProvider')
  }
  return ctx
}
