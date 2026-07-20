import { useState } from 'react'
import { Menu } from 'lucide-react'
import Footer from '../components/Footer.jsx'
import DashboardSidebar from '../components/DashboardSidebar.jsx'
import ResultCard from '../components/ResultCard.jsx'

export default function ResultPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-pa-result-bg overflow-x-hidden">
      <div className="flex min-h-0 flex-1 flex-col md:flex-row lg:flex-row">
        <DashboardSidebar
          active="result"
          consultVariant="gold"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col bg-pa-result-bg">
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

          <div className="px-5 pb-10 pt-6 md:px-8 lg:px-10">
            <header className="mt-4 lg:mt-8 max-w-3xl">
              <h1 className="font-serif text-[2.25rem] font-bold text-pa-green-2 md:text-[2.6rem]">
                Your Prakriti Analysis
              </h1>
              <p className="mt-4 font-sans text-sm leading-relaxed text-[#5f6f5f] md:text-[0.95rem]">
                Our model synthesizes symptom language, seasonal context, and constitutional markers to
                surface your dominant dosha pattern with transparent confidence intervals.
              </p>
            </header>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <ResultCard variant="dominant" />
              <ResultCard variant="balance" />
            </div>
            <div className="mt-6">
              <ResultCard variant="seasonal" />
            </div>
          </div>
          <div className="mt-auto bg-pa-result-bg">
            <Footer variant="appShell" />
          </div>
        </div>
      </div>
    </div>
  )
}
