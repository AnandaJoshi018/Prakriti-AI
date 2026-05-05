import { FlaskConical, History, Sparkles, Zap, UtensilsCrossed } from 'lucide-react'

import Footer from '../components/Footer.jsx'
import DashboardSidebar from '../components/DashboardSidebar.jsx'
import SymptomInput from '../components/SymptomInput.jsx'
import UploadCard from '../components/UploadCard.jsx'
import mint from '../assets/images/mint-wisdom.jpg'
import mapImg from '../assets/images/map-gray.jpg'

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-pa-shell">
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <DashboardSidebar active="dashboard" consultVariant="gold" />
        <div className="flex min-w-0 flex-1 flex-col bg-pa-shell-2">
          <div className="px-5 pb-8 pt-6 md:px-8 lg:px-10">

            <header className="mt-10">
              <h1 className="font-serif text-[2.35rem] italic leading-tight text-pa-green-2 md:text-[2.75rem]">
                Good morning, Arjun
              </h1>
              <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-[#6f7f6f] md:text-[0.95rem]">
                Today is a balanced day for your Pitta energy. Let&apos;s explore your current state of
                being.
              </p>
            </header>

            <div className="mt-10 grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
              <section className="relative overflow-hidden rounded-[28px] bg-[#eef4e4] p-7 shadow-sm md:p-8">
                <SymptomInput />
                <div className="relative my-8 flex items-center gap-4">
                  <div className="h-px flex-1 bg-black/10" />
                  <span className="font-sans text-xs font-bold text-[#9aa89a]">OR</span>
                  <div className="h-px flex-1 bg-black/10" />
                </div>
                <div className="relative grid gap-4 sm:grid-cols-[1fr_1.15fr]">
                  <UploadCard />
                  <button
                    type="button"
                    className="flex min-h-[120px] items-center justify-center gap-3 rounded-2xl bg-pa-green-2 px-6 py-5 font-sans text-sm font-bold uppercase tracking-wide text-white shadow-md transition hover:bg-[#153728]"
                  >
                    Predict Prakriti
                    <FlaskConical className="h-5 w-5" strokeWidth={1.75} />
                  </button>
                </div>
              </section>

              <aside className="flex flex-col rounded-[28px] bg-[#f7f8f1] p-7 shadow-sm md:p-8">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#b89b2c]" />
                  <Sparkles className="h-4 w-4 text-[#b89b2c]" />
                  <h2 className="font-serif text-xl italic text-pa-green-2">AI Suggestions</h2>
                </div>
                <div className="mt-6 flex flex-1 flex-col gap-3">
                  <div className="rounded-2xl border-l-4 border-[#c4a035] bg-[#fbf6dc] px-4 py-3">
                    <p className="font-sans text-[11px] font-bold uppercase tracking-wide text-[#7a6520]">
                      Morning Ritual
                    </p>
                    <p className="mt-1 font-sans text-sm font-semibold text-[#3a3a2a]">
                      Prakriti Cooling Session
                    </p>
                  </div>
                  <div className="rounded-2xl border-l-4 border-pa-green-2 bg-[#eef6e4] px-4 py-3">
                    <p className="font-sans text-[11px] font-bold uppercase tracking-wide text-pa-green-2">
                      Botanical Match
                    </p>
                    <p className="mt-1 font-sans text-sm font-semibold text-[#3a3a2a]">Brahmi Infusion</p>
                  </div>
                  <div className="rounded-2xl border-l-4 border-[#6d8aa8] bg-[#e8eef5] px-4 py-3">
                    <p className="font-sans text-[11px] font-bold uppercase tracking-wide text-[#4a5a6a]">
                      Dosha Focus
                    </p>
                    <p className="mt-1 font-sans text-sm font-semibold text-[#3a3a2a]">Grounding Foods</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-6 w-full rounded-xl border-2 border-[#b8c9a8] bg-transparent py-3 font-sans text-sm font-semibold text-pa-green-2 transition hover:bg-white/60"
                >
                  View Personalized Plan
                </button>
              </aside>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <section className="rounded-[28px] bg-white p-7 shadow-sm md:p-8">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-serif text-xl italic text-pa-green-2">Recent Activity</h2>
                  <History className="h-5 w-5 text-[#8a9a88]" strokeWidth={1.5} />
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3 rounded-2xl bg-[#f4faf0] px-4 py-3">
                    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600/15 text-emerald-700">
                      <Zap className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-sans text-sm font-semibold text-pa-green-2">Vata Spike Detected</p>
                      <p className="mt-1 font-sans text-xs text-[#7a8a78]">2 hours ago • Anxiety analysis</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl bg-[#f4f4ee] px-4 py-3">
                    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#e2e2da] text-[#5a5a50]">
                      <UtensilsCrossed className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-sans text-sm font-semibold text-pa-green-2">Dietary Update</p>
                      <p className="mt-1 font-sans text-xs text-[#7a8a78]">Yesterday • Ginger tea suggestion</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="relative min-h-[240px] overflow-hidden rounded-[28px] shadow-md">
                <img src={mint} alt="Mint leaves" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <p className="font-sans text-[11px] font-bold uppercase tracking-[0.2em]">Today&apos;s Wisdom</p>
                  <p className="mt-2 max-w-xs font-serif text-lg italic leading-snug">
                    Balance is not something you find, it&apos;s something you create.
                  </p>
                </div>
              </section>

              <section className="rounded-[28px] bg-white p-7 shadow-sm md:p-8">
                <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-pa-green-2">
                  Nearby Wellness Centers
                </h2>
                <div className="mt-4 overflow-hidden rounded-2xl border border-black/5">
                  <img src={mapImg} alt="Map preview" className="h-36 w-full object-cover grayscale" />
                </div>
                <p className="mt-4 font-sans text-sm font-bold text-pa-green-2">AyurLife Sanctuary</p>
                <p className="mt-1 font-sans text-xs text-[#7a8a78]">2.4 miles away • Top Rated</p>
              </section>
            </div>
          </div>
          <div className="mt-auto">
            <Footer variant="appShell" />
          </div>
        </div>
      </div>
    </div>
  )
}
