import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import HeroSection from '../components/HeroSection.jsx'
import FeatureCards from '../components/FeatureCards.jsx'

export default function LearnMorePage() {
  return (
    <div className="flex flex-col bg-pa-cream-2">
      {/* First Screen (Primary Content) */}
      <div className="flex min-h-screen flex-col lg:h-screen lg:min-h-[600px] w-full">
        <Navbar
          variant="marketing"
          active="features"
          linkOrder={['home', 'features', 'about', 'contact']}
        />
        <main className="relative z-[1] flex flex-1 items-center px-6 pb-8 pt-2 md:px-10 lg:px-14 lg:pb-12">
          <div className="mx-auto w-full max-w-[1320px]">
            <HeroSection variant="learn" />
          </div>
        </main>
      </div>

      {/* Scrollable Content (Secondary Content) */}
      <div className="px-6 py-12 md:px-10 lg:px-14">
        <div className="mx-auto max-w-[1320px]">
          <FeatureCards variant="learn" />
        </div>
      </div>
      <Footer variant="marketing" />
    </div>
  )
}
