import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import HeroSection from '../components/HeroSection.jsx'
import FeatureCards from '../components/FeatureCards.jsx'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-pa-cream">
      <Navbar variant="marketing" active="home" />
      <main className="relative z-[1] flex-1 px-6 pb-20 pt-4 md:px-10 lg:px-14">
        <div className="mx-auto max-w-[1320px]">
          <HeroSection variant="home" />
          <FeatureCards variant="home" />
        </div>
      </main>
      <Footer variant="marketing" />
    </div>
  )
}
