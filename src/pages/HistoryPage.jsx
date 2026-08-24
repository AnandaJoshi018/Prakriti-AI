import { useState, useEffect } from 'react'
import { Menu, Calendar, Download, Eye, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import DashboardSidebar from '../components/DashboardSidebar.jsx'
import { getPredictionHistory, generateReport, downloadReport } from '../services/api.js'

export default function HistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloadingId, setDownloadingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getPredictionHistory()
        setHistory(data)
      } catch (err) {
        setError(err.message || 'Failed to load history. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    loadHistory()
  }, [])

  const handleViewDetails = (item) => {
    localStorage.setItem('latest_prediction', JSON.stringify(item))
    navigate('/result', { state: { prediction: item } })
  }

  const handleDownload = async (id) => {
    setDownloadingId(id)
    try {
      const report = await generateReport({ prediction_id: id })
      await downloadReport(report.download_url)
    } catch (err) {
      alert(err.message || 'PDF generation failed.')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-pa-shell overflow-x-hidden">
      <div className="flex min-h-0 flex-1 flex-col md:flex-row lg:flex-row">
        <DashboardSidebar
          active="history"
          consultVariant="slate"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col bg-pa-shell-2">
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

          <div className="flex-1 px-5 pb-10 pt-6 md:px-8 lg:px-10">
            <header className="mt-4 lg:mt-6">
              <h1 className="font-serif text-[2.2rem] italic text-pa-green-2 leading-tight">
                Prediction History
              </h1>
              <p className="mt-1.5 font-sans text-xs leading-relaxed text-[#6f7f6f] sm:text-sm">
                Access your past Prakriti analyses, view dynamic recommendations, and download full PDF reports.
              </p>
            </header>

            {loading ? (
              <div className="mt-12 flex flex-col items-center justify-center p-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-pa-green-2 border-t-transparent" />
                <p className="mt-4 font-sans text-sm text-[#5f6f5f]">Loading history...</p>
              </div>
            ) : error ? (
              <div className="mt-10 rounded-[20px] bg-red-50 p-6 text-sm text-red-800 border border-red-200">
                <p className="font-semibold">Error Loading History</p>
                <p className="mt-1">{error}</p>
              </div>
            ) : history.length === 0 ? (
              <div className="mt-10 rounded-[24px] border border-dashed border-[#b7c1ae] bg-white/70 p-8 text-center text-sm text-[#4c5b4c]">
                <FileText className="mx-auto h-12 w-12 text-[#9aa89a] opacity-60" strokeWidth={1.5} />
                <p className="mt-4 font-semibold text-pa-green-2 text-base">No analyses found.</p>
                <p className="mt-1.5 max-w-sm mx-auto">
                  You haven't run any Prakriti predictions yet. Go back to the dashboard to begin.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="mt-5 rounded-full bg-pa-green-2 px-5 py-2.5 font-sans text-xs font-semibold text-white shadow hover:opacity-95"
                >
                  Start Assessment
                </button>
              </div>
            ) : (
              <div className="mt-8 space-y-4 max-w-4xl">
                {history.map((item) => {
                  const dateStr = item.created_at
                    ? new Date(item.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A'

                  return (
                    <article
                      key={item.id}
                      className="rounded-[24px] border border-white/60 bg-white/70 p-5 shadow-sm transition duration-200 hover:shadow-md backdrop-blur-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2 text-xs text-[#6f7f6f]">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{dateStr}</span>
                        </div>
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h3 className="font-serif text-lg font-bold text-pa-green-2 flex items-center gap-2 flex-wrap">
                            <span>Prakriti Type: {item.dominant_dosha}</span>
                            {item.dominant_dosha.endsWith('Blend') && (
                              <span className="font-sans text-[9px] bg-amber-600 text-white rounded-full px-2 py-0.5 font-bold uppercase tracking-wider shadow-sm">
                                Blend
                              </span>
                            )}
                          </h3>
                          <span className="font-sans text-[11px] text-pa-green-3 bg-[#eef4e4] rounded-full px-2.5 py-0.5 font-semibold">
                            ID: #{item.id}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#5c604f]">
                          <span>
                            Vata: <strong className="text-pa-green-2">{item.prediction.Vata.toFixed(1)}%</strong>
                          </span>
                          <span>
                            Pitta: <strong className="text-[#a67c52]">{item.prediction.Pitta.toFixed(1)}%</strong>
                          </span>
                          <span>
                            Kapha: <strong className="text-[#4a5a6a]">{item.prediction.Kapha.toFixed(1)}%</strong>
                          </span>
                          {item.ocr_filename && (
                            <span className="text-[#6d8aa8] truncate max-w-[200px]" title={item.ocr_filename}>
                              📄 {item.ocr_filename}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 w-full md:w-auto">
                        <button
                          type="button"
                          onClick={() => handleViewDetails(item)}
                          className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 rounded-full border border-pa-green-2/20 bg-white px-4 py-2 font-sans text-xs font-bold text-pa-green-2 transition hover:bg-pa-green-2/[0.03]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(item.id)}
                          disabled={downloadingId === item.id}
                          className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 rounded-full bg-pa-green-2 px-4 py-2 font-sans text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                          <Download className="h-3.5 w-3.5" />
                          {downloadingId === item.id ? 'Saving…' : 'Report'}
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
          <Footer variant="appShell" />
        </div>
      </div>
    </div>
  )
}
