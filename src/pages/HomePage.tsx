import { useLemonSqueezy } from '../hooks/useLemonSqueezy'
import { Hero } from '../components/home/Hero'
import { FeaturedProducts } from '../components/home/FeaturedProducts'
import { TrustStrip } from '../components/home/TrustStrip'
import { Philosophy } from '../components/home/Philosophy'
import { EmailCapture } from '../components/home/EmailCapture'
import { ProfitabilityCalculator } from '../components/home/ProfitabilityCalculator'
import { SEO } from '../components/ui/SEO'

export function HomePage() {
  useLemonSqueezy()
  return (
    <main>
      <SEO
        title="Hazem Shannak — Aquaculture Systems & Profitability"
        description="Turning aquaculture ventures into high-yield, investment-ready enterprises through field-tested frameworks and 30 years of expertise."
      />
      <Hero />
      <FeaturedProducts />
      <TrustStrip />
      <ProfitabilityCalculator />
      <Philosophy />
      <EmailCapture />
    </main>
  )
}
