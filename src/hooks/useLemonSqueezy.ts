import { useEffect } from 'react'

declare global {
  interface Window {
    createLemonSqueezy?: () => void
    LemonSqueezy?: {
      Setup: (config: { eventHandler: (event: { event: string }) => void }) => void
    }
  }
}

export function useLemonSqueezy() {
  useEffect(() => {
    if (typeof window.createLemonSqueezy === 'function') {
      window.createLemonSqueezy()
    }
  }, [])

  const openCheckout = (checkoutUrl: string) => {
    window.open(checkoutUrl, '_blank', 'noopener')
  }

  return { openCheckout }
}
