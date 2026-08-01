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
        <div id="tentang">
          <HeroSection />
        </div>
        <div id="cara-kerja">
          <EkosistemSection />
        </div>
        <div id="manfaat">
          <StatsBentoSection />
        </div>
        <div id="kontak">
          <CTASection />
        </div>
      </main>
      <Footer />
    </div>
  )
}
