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
}
