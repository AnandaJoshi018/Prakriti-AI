import { useState, useEffect, useMemo, useRef } from 'react'
import { Menu, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import DashboardSidebar from '../components/DashboardSidebar.jsx'
import { listPredictions } from '../services/api.js'
import { yogaPractices } from '../data/yogaData.js'
import '../styles/App.css'

function VideoCard({ practice, userNormalizedDosha }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [videoError, setVideoError] = useState(false)

  // Construct local video file path dynamically based on practice and user active doshas
  const videoPath = useMemo(() => {
    if (practice.folder === 'Additional-Practice') {
      return `/Yoga-Videos/Additional-Practice/${practice.fileName}`
    }
    
    // Parse userNormalizedDosha (e.g. 'VATA-PITTA' or 'PITTA') to titlecase array (e.g. ['Vata', 'Pitta'])
    const activeDoshas = userNormalizedDosha
      .split('-')
      .map(d => d.trim().charAt(0).toUpperCase() + d.trim().slice(1).toLowerCase())
      
    // Find the first matching dosha between user active doshas and practice doshas
    const matchedDosha = activeDoshas.find(ad => practice.doshas.includes(ad))
    
    if (matchedDosha) {
      return `/Yoga-Videos/${matchedDosha}/${practice.fileName}`
    }
    
    // Fallback to the first dosha mapped to the practice
    return `/Yoga-Videos/${practice.doshas[0]}/${practice.fileName}`
  }, [practice, userNormalizedDosha])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch((err) => {
        console.error('Failed to play video:', err)
        setVideoError(true)
      })
    }
  }

  const toggleMute = (e) => {
    e.stopPropagation() // Prevent triggering play/pause toggle
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setIsMuted(videoRef.current.muted)
  }

  const toggleFullscreen = (e) => {
    e.stopPropagation() // Prevent triggering play/pause toggle
    if (!videoRef.current) return
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen()
    } else if (videoRef.current.webkitRequestFullscreen) { /* Safari */
      videoRef.current.webkitRequestFullscreen()
    } else if (videoRef.current.msRequestFullscreen) { /* IE11 */
      videoRef.current.msRequestFullscreen()
    }
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-[28px] bg-white border border-[#1b4332]/5 shadow-sm p-4 md:p-5 pa-card-hover">
      {/* Video container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black/5">
        {videoError ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-pa-cream-card px-4 text-center">
            <span className="text-2xl" aria-hidden="true">⚠️</span>
            <p className="mt-2 font-sans text-xs font-semibold text-pa-green-2">
              Video Demonstration Unavailable
            </p>
            <p className="mt-1 font-sans text-[10px] text-pa-muted break-all">
              Path: {videoPath}
            </p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              src={videoPath}
              preload="metadata"
              className="h-full w-full object-cover cursor-pointer"
              onClick={togglePlay}
              onEnded={() => setIsPlaying(false)}
              onError={() => setVideoError(true)}
              playsInline
            />
            {/* Play Overlay Button (only shows when paused) */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/35 transition-colors group cursor-pointer"
                aria-label="Play video"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-md group-hover:scale-105 transition-transform duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#7b5e0b"
                    className="h-6 w-6 ml-0.5"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            )}
            
            {/* Controls Overlay (top right) */}
            <div className="absolute right-3 top-3 flex gap-1.5 z-10">
              {/* Mute/Unmute toggle (only visible when playing) */}
              {isPlaying && (
                <button
                  onClick={toggleMute}
                  className="rounded-full bg-black/60 hover:bg-black/85 p-1.5 text-white transition-colors cursor-pointer"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                  )}
                </button>
              )}

              {/* Fullscreen Expand */}
              <button
                onClick={toggleFullscreen}
                className="rounded-full bg-black/60 hover:bg-black/85 p-1.5 text-white transition-colors cursor-pointer"
                aria-label="Fullscreen expand"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0l-6-6" />
                </svg>
              </button>
            </div>
            
            {/* Badges on top left */}
            <div className="absolute left-3 top-3 flex gap-1.5">
              <span className="rounded-full bg-black/60 px-2.5 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider text-white">
                1080p
              </span>
              <span className="rounded-full bg-black/60 px-2.5 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider text-white">
                10 sec
              </span>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="font-serif text-lg font-bold text-pa-green-2 leading-tight">
          {practice.englishName}
        </h3>
        <p className="mt-1 font-serif text-sm italic text-[#a67c52]">
          {practice.sanskritName}
        </p>

        {/* Pills */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-pa-tag px-3 py-1 font-sans text-[10px] font-bold text-pa-green-2 uppercase tracking-wide">
            {practice.type}
          </span>
          {practice.doshas.map((d) => (
            <span
              key={d}
              className="rounded-full bg-pa-tag px-3 py-1 font-sans text-[10px] font-bold text-pa-green-2 uppercase tracking-wide"
            >
              {d}
            </span>
          ))}
          {practice.isAdvanced && (
            <span className="rounded-full bg-amber-100 px-3 py-1 font-sans text-[10px] font-bold text-amber-800 uppercase tracking-wide">
              Advanced
            </span>
          )}
        </div>

        {/* Advanced Section if applicable */}
        {practice.isAdvanced && (
          <div className="mt-4 rounded-2xl bg-amber-50/70 border border-amber-100/60 p-3.5 text-xs leading-relaxed text-amber-900 font-sans">
            <p className="font-bold text-[11px] text-amber-900 uppercase tracking-wider">⚡ Advanced Practice Guidance</p>
            <p className="mt-1.5"><span className="font-semibold">Preparation:</span> {practice.preparation}</p>
            <p className="mt-1"><span className="font-semibold">Beginner Alternative:</span> {practice.alternative}</p>
          </div>
        )}

        {/* Buttons Footer */}
        <div className="mt-auto pt-5 grid grid-cols-2 gap-3">
          <button
            onClick={togglePlay}
            disabled={videoError}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-pa-cream-2 border border-pa-input py-2.5 font-sans text-xs font-semibold text-pa-green-2 hover:bg-pa-input transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlaying ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                </svg>
                <span>Pause</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Play</span>
              </>
            )}
          </button>
          <a
            href={videoPath}
            download={practice.fileName}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#7b5e0b] py-2.5 font-sans text-xs font-semibold text-white hover:opacity-90 transition text-center cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span>Download 1080p</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function YogaRoutinePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
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

  // Normalize dominantDosha string to uppercase, strip "BLEND", and trim spaces
  const normalizedDosha = useMemo(() => {
    return dominantDosha.toUpperCase().replace(/\s*BLEND\s*/g, '').trim()
  }, [dominantDosha])

  // Filter video collection based on doshas (supporting blends)
  const routinePractices = useMemo(() => {
    // 1. Single Dosha routines: Show top 8
    if (normalizedDosha === 'VATA') {
      return yogaPractices.filter((p) => p.doshas.includes('Vata')).slice(0, 8)
    }
    if (normalizedDosha === 'PITTA') {
      return yogaPractices.filter((p) => p.doshas.includes('Pitta')).slice(0, 8)
    }
    if (normalizedDosha === 'KAPHA') {
      return yogaPractices.filter((p) => p.doshas.includes('Kapha')).slice(0, 8)
    }

    // 2. Blended Dosha routines: Top 5 from each dosha (avoiding duplicates)
    let doshaA = ''
    let doshaB = ''

    if (normalizedDosha.includes('VATA') && normalizedDosha.includes('PITTA')) {
      doshaA = 'Vata'
      doshaB = 'Pitta'
    } else if (normalizedDosha.includes('VATA') && normalizedDosha.includes('KAPHA')) {
      doshaA = 'Vata'
      doshaB = 'Kapha'
    } else if (normalizedDosha.includes('PITTA') && normalizedDosha.includes('KAPHA')) {
      doshaA = 'Pitta'
      doshaB = 'Kapha'
    } else {
      // Default fallback
      return yogaPractices.filter((p) => p.doshas.includes('Pitta')).slice(0, 8)
    }

    const selectTop5 = (doshaName, excludeList = []) => {
      const candidates = yogaPractices.filter((p) => p.doshas.includes(doshaName))
      const result = []
      for (const cand of candidates) {
        if (result.length >= 5) break
        const isExcluded = excludeList.some((ex) => ex.englishName === cand.englishName)
        if (!isExcluded) {
          result.push(cand)
        }
      }
      return result
    }

    const firstSet = selectTop5(doshaA)
    const secondSet = selectTop5(doshaB, firstSet)
    return [...firstSet, ...secondSet]
  }, [normalizedDosha])

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
            {/* Back to Recommendations button */}
            <div className="mt-4">
              <Link
                to="/recommendation"
                className="inline-flex items-center gap-2 font-sans text-xs font-semibold text-pa-green-2 hover:opacity-85 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Recommendations</span>
              </Link>
            </div>

            <header className="relative mt-6 lg:mt-8 overflow-hidden rounded-[24px]">
              <div className="pa-leaf-watermark-lg" aria-hidden />
              <div className="relative">
                <span className="inline-flex rounded-full bg-pa-green-3 px-4 py-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                  Prescribed Daily Routine
                </span>
                <h1 className="mt-5 font-serif text-[2.1rem] font-semibold leading-tight text-pa-green-3 md:text-[2.45rem]">
                  Your Balanced <span className="italic text-[#a67c52]">{normalizedDosha}</span> Routine
                </h1>
                <p className="mt-3.5 max-w-3xl font-sans text-sm leading-relaxed text-pa-muted">
                  These custom practices have been filtered specifically for your dominant constitution. Follow the recommended breath rhythms and alignments to balance systemic qualities.
                </p>
              </div>
            </header>

            <div className="mt-6 rounded-2xl bg-[#fbf4dc] px-5 py-4 md:flex md:items-center md:gap-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c9a24a] text-white">
                🧘
              </span>
              <p className="mt-3 font-sans text-sm text-[#4a4a3a] md:mt-0 flex items-center gap-2 flex-wrap">
                <span>Active Constitution:</span>
                <span className="font-bold text-pa-green-3 uppercase">{dominantDosha}</span>
                {dominantDosha.endsWith('Blend') && (
                  <span className="font-sans text-[9px] bg-amber-600 text-white rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider shadow-sm">
                    Blend
                  </span>
                )}
                <span className="text-xs text-pa-muted italic">(Routine Filtered for both parts of your Blend)</span>
              </p>
            </div>

            {/* Video Cards Grid */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {routinePractices.map((practice) => (
                <VideoCard
                  key={practice.englishName}
                  practice={practice}
                  userNormalizedDosha={normalizedDosha}
                />
              ))}
            </div>

          </div>
          <Footer variant="appShell" />
        </div>
      </div>
    </div>
  )
}

