import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import heroHerbs from '../assets/images/hero-herbs.jpg'
import fernHero from '../assets/images/fern-hero.jpg'
import yogaMeditation from '../assets/images/yoga-meditation.jpg'

export default function HeroSection({ variant = 'home' }) {
  if (variant === 'learn') {
    return (
      <section className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        <div className="order-2 lg:order-1">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-pa-green-2">
            THE BOTANICAL ALGORITHM
          </p>
          <h1 className="mt-4 font-serif text-[2.2rem] font-medium leading-[1.08] text-pa-green-2 md:text-[2.8rem] lg:text-[2.4rem] xl:text-[3rem]">
            <span className="block font-serif italic text-[#2f5d45]">Ancient Wisdom</span>
            <span className="block font-bold">Digital Precision</span>
          </h1>
          <p className="mt-4 max-w-xl font-sans text-sm lg:text-[0.95rem] leading-relaxed text-[#5a6a5a]">
            Discover harmony where centuries of Ayurvedic knowledge meets deep learning. Our platform
            interprets your unique biological signals to deliver preventive care with scientific
            rigor.
          </p>
          <Link
            to="/signup"
            className="mt-6 lg:mt-8 inline-flex items-center gap-2 rounded-xl bg-pa-green-2 px-6 py-3 font-sans text-sm font-semibold text-white shadow-md transition hover:bg-[#153728]"
          >
            Get Started <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="relative order-1 lg:order-2">
          <div className="relative overflow-hidden rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f766e]/85 via-[#0d9488]/55 to-[#134e4a]/80" />
            <img
              src={yogaMeditation}
              alt="Wellness illustration"
              className="aspect-[4/3] lg:aspect-[1.05] max-h-[280px] sm:max-h-[340px] lg:max-h-[42vh] xl:max-h-[48vh] w-full object-cover mix-blend-overlay opacity-90"
            />
            <div className="pointer-events-none absolute inset-0 flex flex-col">
              <div className="flex justify-center pt-6">
                <span className="font-sans text-xs font-bold uppercase tracking-[0.35em] text-white">
                  WELNESS
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-end pb-4">
                <span className="text-center font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
                  SAFE FOR WORK
                </span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 left-6 max-w-[240px] rounded-2xl bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)] hidden sm:block">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pa-tag text-pa-green-2">
                <Sparkles className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-serif text-sm font-semibold text-pa-green-2">Real-time Analysis</p>
                <p className="mt-1 font-sans text-xs leading-relaxed text-[#6f7f6f]">
                  Continuous dosha mapping synced to your daily rhythms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'signupLeft') {
    return (
      <div className="flex flex-col gap-2.5 md:gap-3 lg:gap-2.5">
        <span className="inline-flex w-fit rounded-full bg-[#e8ebcf] px-3.5 py-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-pa-green-signup">
          THE BOTANICAL ALGORITHM
        </span>
        <h1 className="font-serif text-[1.95rem] font-semibold leading-[1.08] text-pa-green-signup md:text-[2.2rem] lg:text-[1.95rem] xl:text-[2.2rem]">
          Begin Your
          <br />
          Harmonious
          <br />
          Journey.
        </h1>
        <p className="max-w-md font-sans text-[0.85rem] sm:text-[0.9rem] leading-relaxed text-[#5f6f55]">
          Join a community where ancient Ayurvedic wisdom meets precision technology to cultivate your
          unique biological vitality.
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl bg-[#f2f5db] px-2.5 py-2.5 shadow-sm">
            <div className="text-pa-green-signup">
              <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3c-2 4-6 6-6 10a6 6 0 1012 0c0-4-4-6-6-10z" />
              </svg>
            </div>
            <p className="mt-1.5 font-sans text-xs sm:text-sm font-bold text-pa-green-signup">Daily Rituals</p>
          </div>
          <div className="rounded-xl bg-[#f2f5db] px-2.5 py-2.5 shadow-sm">
            <div className="text-[#7a6a2a]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 22C12 22 4 16 4 9a4 4 0 018-1 4 4 0 018 1c0 7-8 13-8 13z" />
              </svg>
            </div>
            <p className="mt-1.5 font-sans text-xs sm:text-sm font-bold text-pa-green-signup">Dosha Insight</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl shadow-md max-w-sm lg:max-w-none">
          <img src={fernHero} alt="Fern in nature" className="h-[120px] md:h-[130px] lg:h-[110px] xl:h-[130px] w-full object-cover" />
        </div>
      </div>
    )
  }

  return (
    <section className="grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 xl:gap-14">
      <div className="relative mx-auto w-full max-w-[520px] order-2 lg:order-1">
        <div className="pa-hero-frame">
          <img src={heroHerbs} alt="Ayurvedic herbs and vessels" className="aspect-[4/3] max-h-[270px] w-full object-cover sm:max-h-[320px] lg:aspect-[3/4] lg:max-h-[420px] xl:max-h-[460px]" />
        </div>
        <div className="absolute -bottom-4 right-2 max-w-[250px] rounded-2xl border border-black/5 bg-pa-beige-card p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.12)] md:right-4">
          <div className="flex items-center gap-2 text-[#b8860b]">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#6a6040]">
              Daily Insight
            </span>
          </div>
          <p className="mt-1.5 font-sans text-xs leading-snug text-[#4a4a45]">
            Your Vata constitution thrives with warm, grounding ashwagandha today.
          </p>
        </div>
      </div>
      <div className="order-1 lg:order-2">
        <span className="inline-flex rounded-full bg-pa-tag px-3.5 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-pa-green">
          THE BOTANICAL ALGORITHM
        </span>
        <h1 className="mt-4 font-serif text-[2.1rem] font-bold leading-[1.08] text-[#1a1a1a] sm:text-[2.4rem] lg:text-[2.2rem] xl:text-[2.7rem]">
          Providing <span className="italic text-pa-green">Natural</span> and Intelligent Ayurvedic Healthcare
        </h1>
        <p className="mt-4 max-w-lg font-sans text-sm leading-relaxed text-[#5f6f5f] lg:text-[0.95rem]">
          Know your Prakriti and receive personalized recommendations using advanced AI. We bridge the
          gap between ancient wisdom and digital precision.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 sm:gap-4">
          <Link
            to="/signup"
            className="rounded-xl bg-pa-slate px-6 py-3 font-sans text-sm font-semibold text-white shadow-sm transition hover:bg-[#3f5372]"
          >
            Sign Up
          </Link>
          <Link
            to="/learn-more"
            className="rounded-xl border border-[#c9c4b8] bg-transparent px-6 py-3 font-sans text-sm font-semibold text-[#2a2a2a] transition hover:bg-black/[0.03]"
          >
            Learn More
          </Link>
        </div>
        <div className="mt-8 grid max-w-md grid-cols-2 gap-6 border-t border-black/5 pt-6">

          <div>
            <p className="font-serif text-3xl font-semibold text-pa-green md:text-[2.3rem]">88.74%</p>
            <p className="mt-1 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6f7f6f]">
              AI Accuracy
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
