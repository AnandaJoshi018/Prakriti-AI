import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import HeroSection from '../components/HeroSection.jsx'
import FeatureCards from '../components/FeatureCards.jsx'

export default function LearnMorePage() {
  return (
    <div className="flex min-h-screen flex-col bg-pa-cream-2">
      <Navbar
        variant="marketing"
        active="features"
        linkOrder={['home', 'features', 'about', 'contact']}
      />
      <main className="relative z-[1] flex-1 px-6 pb-24 pt-6 md:px-10 lg:px-14">
        <div className="mx-auto max-w-[1320px]">
          <HeroSection variant="learn" />
          <FeatureCards variant="learn" />
        </div>
      </main>
      <Footer variant="marketing" />
    </div>
  )
}
