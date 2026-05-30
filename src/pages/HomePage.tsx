import { useLemonSqueezy } from '../hooks/useLemonSqueezy'
import { Hero } from '../components/home/Hero'
import { FeaturedProducts } from '../components/home/FeaturedProducts'
import { TrustStrip } from '../components/home/TrustStrip'
import { Philosophy } from '../components/home/Philosophy'
import { EmailCapture } from '../components/home/EmailCapture'

export function HomePage() {
  useLemonSqueezy()
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <TrustStrip />
      <Philosophy />
      <EmailCapture />
    </main>
  )
}
