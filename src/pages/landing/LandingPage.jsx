import Navbar from '../../sections/landing/Navbar'
import HeroSection from '../../sections/landing/HeroSection'
import EkosistemSection from '../../sections/landing/EkosistemSection'
import StatsBentoSection from '../../sections/landing/StatsBentoSection'
import CTASection from '../../sections/landing/CTASection'
import Footer from '../../sections/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-w-[280px]">
      <Navbar />
      <main>
        <HeroSection />
        <EkosistemSection />
        <StatsBentoSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
