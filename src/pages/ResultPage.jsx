import { useMemo, useState } from 'react'
import { Download, Menu } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import DashboardSidebar from '../components/DashboardSidebar.jsx'
import { downloadReport, generateReport } from '../services/api.js'

export default function ResultPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const prediction = useMemo(() => {
    if (location.state?.prediction) {
      localStorage.setItem('latest_prediction', JSON.stringify(location.state.prediction))
      return location.state.prediction
    }
    const stored = localStorage.getItem('latest_prediction')
    try {
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }, [location.state?.prediction])

  const summary = useMemo(() => {
    if (!prediction) {
      return null
    }

    const { prediction: doshas, dominant_dosha, confidence, explanation, recommendations } = prediction
    return {
      doshas,
      dominant_dosha,
      confidence,
      explanation,
      recommendations,
    }
  }, [prediction])

  const difference = useMemo(() => {
    if (!summary?.doshas) return 0
    const sorted = Object.values(summary.doshas).sort((a, b) => b - a)
    return sorted[0] - sorted[1]
  }, [summary])

  const handleDownloadReport = async () => {
    if (!prediction?.id) {
      setDownloadError('A completed analysis is required before downloading a report.')
      return
    }

    setIsDownloading(true)
    setDownloadError('')

    try {
      const report = await generateReport({ prediction_id: prediction.id })
      await downloadReport(report.download_url)
    } catch (error) {
      setDownloadError(error.message || 'PDF generation failed. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

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
                surface your Prakriti Type pattern with transparent confidence intervals.
              </p>
            </header>

            {!summary ? (
              <div className="mt-10 rounded-[24px] border border-dashed border-[#b7c1ae] bg-white/70 p-8 text-sm text-[#4c5b4c]">
                <p className="font-semibold text-pa-green-2">No prediction available yet.</p>
                <p className="mt-2">Return to the dashboard and run a new analysis to view your results.</p>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="mt-4 rounded-full bg-pa-green-2 px-4 py-2 font-sans text-sm font-semibold text-white"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <>
                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                  <article className="relative overflow-hidden rounded-[28px] bg-pa-sage-2 p-8 shadow-sm md:p-10">
                    <div className="relative flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-2 rounded-full bg-pa-green-2 px-3 py-1 text-white">
                        <span className="font-sans text-[10px] font-bold uppercase tracking-wide">Prakriti Type</span>
                      </div>
                      {summary.dominant_dosha.endsWith('Blend') && (
                        <div className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-3 py-1 text-white shadow-sm">
                          <span className="font-sans text-[10px] font-bold uppercase tracking-wide">Blend</span>
                        </div>
                      )}
                    </div>
                    <h2 className="relative mt-6 font-serif text-[2.5rem] font-bold leading-tight text-pa-green-2 md:text-[3rem]">
                      {summary.dominant_dosha}
                    </h2>
                    <p className="relative mt-4 max-w-md font-sans text-sm leading-relaxed text-[#4f5f4f]">
                      {summary.explanation}
                    </p>
                    <div className="relative mt-6 rounded-2xl bg-white/70 p-4 text-sm text-[#4c5b4c]">
                      <p className="font-semibold text-pa-green-2">
                        {summary.dominant_dosha.endsWith('Blend') ? 'Primary Constitution' : 'Primary Dosha'}: {summary.confidence.toFixed(2)}%
                      </p>
                      {summary.dominant_dosha.endsWith('Blend') && (
                        <p className="mt-1.5 text-xs text-[#5f6f5f] font-semibold">
                          Difference: {difference.toFixed(2)}%
                        </p>
                      )}
                    </div>
                    <div className="relative mt-6 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleDownloadReport}
                        disabled={isDownloading}
                        className="inline-flex items-center gap-2 rounded-full bg-pa-green-2 px-4 py-2.5 font-sans text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <Download className="h-4 w-4" />
                        {isDownloading ? 'Generating PDF…' : 'Download Report'}
                      </button>
                      {downloadError ? (
                        <p className="text-sm text-[#a24d4d]">{downloadError}</p>
                      ) : null}
                    </div>
                  </article>

                  <article className="rounded-[28px] bg-[#eef2e4] p-8 shadow-sm md:p-10">
                    <p className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-pa-slate-2">
                      Tridosha Balance
                    </p>
                    <div className="mt-8 space-y-6">
                      {Object.entries(summary.doshas).map(([label, value]) => (
                        <div key={label}>
                          <div className="flex items-baseline justify-between gap-4">
                            <span className="font-serif text-lg text-pa-green-2">{label}</span>
                            <span className="font-serif text-lg italic text-pa-green-2">{value.toFixed(2)}%</span>
                          </div>
                          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                            <div className="h-full rounded-full bg-pa-green-2" style={{ width: `${value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <article className="rounded-[28px] bg-[#e4e4cc] p-8 shadow-sm md:p-10">
                    <h3 className="font-serif text-xl font-semibold text-[#5c4a22]">Personalized Recommendations</h3>
                    <div className="mt-5 space-y-3 font-sans text-sm leading-relaxed text-[#5a5538]">
                      {Object.entries(summary.recommendations).map(([key, value]) => (
                        <div key={key} className="rounded-2xl border border-white/50 bg-white/60 p-3">
                          <p className="font-semibold capitalize text-pa-green-2">{key.replace(/_/g, ' ')}</p>
                          <p className="mt-1">{value}</p>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="rounded-[28px] bg-[#f9f6e7] p-8 shadow-sm md:p-10">
                    <h3 className="font-serif text-xl font-semibold text-pa-green-2">How the system interpreted your input</h3>
                    <p className="mt-4 font-sans text-sm leading-relaxed text-[#4f5f4f]">
                      Symptoms accounted for 80% of the analysis, and any assessment answers were blended at 20% to refine the final result.
                    </p>
                  </article>
                </div>
              </>
            )}
          </div>
          <div className="mt-auto bg-pa-result-bg">
            <Footer variant="appShell" />
          </div>
        </div>
      </div>
    </div>
  )
}
