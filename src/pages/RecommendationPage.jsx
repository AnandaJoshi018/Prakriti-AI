import { useState, useEffect, useMemo } from 'react'
import { Menu } from 'lucide-react'
import Footer from '../components/Footer.jsx'
import DashboardSidebar from '../components/DashboardSidebar.jsx'
import {
  DietaryProtocolCard,
  MovementCard,
  EveningRoutineCard,
  MentalHygieneCard,
} from '../components/RecommendationCard.jsx'
import { listPredictions } from '../services/api.js'
import '../styles/App.css'

export default function RecommendationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [prediction, setPrediction] = useState(() => {
    const stored = localStorage.getItem('latest_prediction')
    try {
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    async function loadLatest() {
      try {
        const list = await listPredictions()
        if (list && list.length > 0) {
          setPrediction(list[0])
          localStorage.setItem('latest_prediction', JSON.stringify(list[0]))
        }
      } catch (err) {
        console.error('Failed to load predictions:', err)
      }
    }
    loadLatest()
  }, [])

  const dominantDosha = useMemo(() => {
    return prediction?.dominant_dosha || 'Pitta'
  }, [prediction])

  return (
    <div className="flex min-h-screen flex-col bg-pa-rec-bg overflow-x-hidden">
      <div className="flex min-h-0 flex-1 flex-col md:flex-row lg:flex-row">
        <DashboardSidebar
          active="recommendation"
          consultVariant="slate"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile Header Bar */}
          <div className="flex items-center justify-between border-b border-black/5 bg-pa-sidebar px-5 py-4 md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 hover:bg-black/[0.03]"
              aria-label="Open Navigation"
            >
              <Menu className="h-5 w-5 text-pa-green-2" />
            </button>
            <span className="font-sans text-sm font-bold tracking-[0.12em] text-pa-green-2">
              PRAKRITI AI
            </span>
            <div className="w-8" />
          </div>

          <div className="px-4 pb-10 pt-5 md:px-6 lg:px-8">
            <div className="relative mt-6 lg:mt-10 overflow-hidden rounded-[24px]">
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
              <p className="mt-3 font-sans text-sm text-[#4a4a3a] md:mt-0 flex items-center gap-2 flex-wrap">
                <span>Prakriti Type:</span>
                <span className="font-bold text-pa-green-3 uppercase">{dominantDosha}</span>
                {dominantDosha.endsWith('Blend') && (
                  <span className="font-sans text-[9px] bg-amber-600 text-white rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider shadow-sm">
                    Blend
                  </span>
                )}
                <span>constitution</span>
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:grid-rows-[auto_auto]">
              <div className="lg:row-span-2">
                <DietaryProtocolCard recommendations={prediction?.recommendations} dominantDosha={dominantDosha} />
              </div>
              <div className="lg:row-span-2">
                <MovementCard recommendations={prediction?.recommendations} dominantDosha={dominantDosha} />
              </div>
              <EveningRoutineCard recommendations={prediction?.recommendations} dominantDosha={dominantDosha} />
              <MentalHygieneCard recommendations={prediction?.recommendations} dominantDosha={dominantDosha} />
            </div>

          </div>
          <Footer variant="appShell" />
        </div>
      </div>
    </div>
  )
}
