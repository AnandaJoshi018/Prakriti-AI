import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import HeroSection from '../components/HeroSection.jsx'
import FeatureCards from '../components/FeatureCards.jsx'

export default function HomePage() {
  return (
    <div className="flex flex-col bg-pa-cream">
      <div className="flex min-h-screen flex-col lg:h-screen lg:min-h-[620px] w-full">
        <Navbar variant="marketing" active="home" />
        <main className="relative z-[1] flex flex-1 items-center px-5 pb-6 pt-2 sm:px-6 md:px-8 lg:px-10 lg:pb-8 xl:px-14">
          <div className="pa-responsive-shell w-full">
            <HeroSection variant="home" />
          </div>
        </main>
      </div>

      <div className="px-5 py-10 sm:px-6 md:px-8 lg:px-10 xl:px-14 lg:py-12">
        <div className="pa-responsive-shell">
          <FeatureCards variant="home" />
        </div>
      </div>
      <Footer variant="marketing" />
    </div>
  )
}
