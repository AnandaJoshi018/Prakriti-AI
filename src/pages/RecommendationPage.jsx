
import Footer from '../components/Footer.jsx'
import DashboardSidebar from '../components/DashboardSidebar.jsx'
import {
  DietaryProtocolCard,
  MovementCard,
  EveningRoutineCard,
  MentalHygieneCard,
} from '../components/RecommendationCard.jsx'
import '../styles/App.css'

export default function RecommendationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-pa-rec-bg">
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <DashboardSidebar active="recommendation" consultVariant="slate" />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="px-4 pb-10 pt-5 md:px-6 lg:px-8">


            <div className="relative mt-10 overflow-hidden rounded-[24px]">
              <div className="pa-leaf-watermark-lg" aria-hidden />
              <div className="relative">
                <span className="inline-flex rounded-full bg-pa-green-3 px-4 py-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                  AI-Synthesized Insights
                </span>
                <h1 className="mt-5 font-serif text-[2.1rem] font-semibold leading-tight text-pa-green-3 md:text-[2.45rem]">
                  Your Path to <span className="italic text-[#a67c52]">Balance</span>
                </h1>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-[#fbf4dc] px-5 py-4 md:flex md:items-center md:gap-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c9a24a] text-white">
                ⚡
              </span>
              <p className="mt-3 font-sans text-sm text-[#4a4a3a] md:mt-0">
                Current Constitution: Selected for your{' '}
                <span className="font-bold text-pa-green-3">PITTA</span> constitution
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:grid-rows-[auto_auto]">
              <div className="lg:row-span-2">
                <DietaryProtocolCard />
              </div>
              <div className="lg:row-span-2">
                <MovementCard />
              </div>
              <EveningRoutineCard />
              <MentalHygieneCard />
            </div>

          </div>
          <Footer variant="appShell" />
        </div>
      </div>
    </div>
  )
}
