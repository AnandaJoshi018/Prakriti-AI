import { useState, useEffect, useMemo } from 'react'
import { Brain, FlaskConical, Leaf, Sparkles, UtensilsCrossed, ArrowRight, BookOpen, X, Menu, Wind, Flame, Sprout } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Footer from '../components/Footer.jsx'
import DashboardSidebar from '../components/DashboardSidebar.jsx'
import SymptomInput from '../components/SymptomInput.jsx'
import UploadCard from '../components/UploadCard.jsx'
import yogaMeditation from '../assets/images/yoga-meditation.jpg'
import { buildPredictionPayload, createPrediction, uploadPrescription, getCurrentUser } from '../services/api.js'

const suggestionCards = [
  {
    title: "Today's Wellness Tip",
    description: 'A warm herbal infusion and a brief grounding breath can support your Pitta energy.',
    accent: 'border-[#c4a035] bg-[#fbf6dc] text-[#7a6520]',
    icon: Sparkles,
  },
  {
    title: 'Recommended Yoga',
    description: 'Gentle stretches and restorative poses can help recalibrate your energy.',
    accent: 'border-pa-green-2 bg-[#eef6e4] text-pa-green-2',
    icon: Leaf,
  },
  {
    title: 'Suggested Diet',
    description: 'Favor lighter meals with cooling spices and fresh greens to balance heat.',
    accent: 'border-[#6d8aa8] bg-[#e8eef5] text-[#4a5a6a]',
    icon: UtensilsCrossed,
  },
  {
    title: 'Herbal Recommendation',
    description: 'Ashwagandha and mint can help steady your body while supporting calm focus.',
    accent: 'border-[#9a8d61] bg-[#f4efe2] text-[#6f5b2e]',
    icon: Brain,
  },
]

const questions = [
  {
    prompt: 'How would you describe your body build?',
    options: ['Thin', 'Medium', 'Heavy'],
    key: 'Body Build',
  },
  {
    prompt: 'How is your appetite?',
    options: ['Irregular', 'Strong', 'Slow'],
    key: 'Appetite',
  },
  {
    prompt: 'How do you usually sleep?',
    options: ['Light', 'Moderate', 'Deep'],
    key: 'Sleep',
  },
  {
    prompt: 'How is your skin?',
    options: ['Dry', 'Warm', 'Oily'],
    key: 'Skin',
  },
  {
    prompt: 'Which best describes your personality?',
    options: ['Restless', 'Competitive', 'Calm'],
    key: 'Personality',
  },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [assessmentStatus, setAssessmentStatus] = useState('idle')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [symptoms, setSymptoms] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState('')
  const [uploadStatus, setUploadStatus] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [ocrText, setOcrText] = useState('')
  const [userName, setUserName] = useState('User')
  const [loadingStage, setLoadingStage] = useState(0)
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' })

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }))
    }, 4500)
  }

  useEffect(() => {
    async function fetchUser() {
      try {
        const profile = await getCurrentUser()
        if (profile && profile.full_name) {
          setUserName(profile.full_name)
        }
      } catch (err) {
        console.error('Failed to load user profile:', err)
        const msg = err.message || ''
        if (msg.includes('Session expired') || msg.includes('401') || msg.includes('Unauthorized')) {
          showToast("Session expired. Please login again.", "error")
          setTimeout(() => navigate('/login'), 2500)
        }
      }
    }
    fetchUser()
  }, [navigate])

  const greeting = useMemo(() => {
    const hours = new Date().getHours()
    if (hours < 12) return 'Good morning'
    if (hours < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const handleAnswerSelect = (questionIndex, value) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: value }))
  }

  const handleOpenAssessment = () => {
    setShowModal(true)
    setCurrentQuestion(0)
    setAssessmentStatus('draft')
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSaveAssessment = () => {
    setAssessmentStatus('completed')
  }

  const handleCloseRequest = () => {
    if (assessmentStatus === 'completed') {
      setShowModal(false)
      setCurrentQuestion(0)
      return
    }

    if (assessmentStatus === 'draft' || Object.keys(answers).length > 0) {
      setShowConfirmModal(true)
      return
    }

    setShowModal(false)
    setCurrentQuestion(0)
    setAssessmentStatus('idle')
  }

  const handleConfirmDiscard = () => {
    setShowConfirmModal(false)
    setShowModal(false)
    setCurrentQuestion(0)
    setAnswers({})
    setAssessmentStatus('idle')
  }

  const handleContinueAssessment = () => {
    setShowConfirmModal(false)
  }

  const handleFileSelect = async (file) => {
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['pdf', 'png', 'jpg', 'jpeg'].includes(ext)) {
      showToast("Only PDF, PNG, JPG and JPEG files are supported.", "error")
      return
    }

    setIsUploading(true)
    setUploadStatus('Reading prescription...')
    setUploadError('')
    setSelectedFileName(file.name)

    try {
      const uploadResult = await uploadPrescription(file)
      const extractedText = uploadResult.ocr_text || ''
      setOcrText(extractedText)
      
      if (uploadResult.ocr_error) {
        showToast("Prescription could not be read. Continuing with symptom analysis.", "warning")
        setUploadStatus('OCR could not extract text; continuing with symptoms only.')
        setUploadError(uploadResult.ocr_error)
      } else if (extractedText) {
        setUploadStatus('Prescription text extracted successfully.')
      } else {
        setUploadStatus('Prescription uploaded, but no text was extracted.')
      }
    } catch (error) {
      showToast("Prescription could not be read. Continuing with symptom analysis.", "warning")
      setUploadStatus('OCR could not be completed; continuing with symptoms only.')
      setUploadError(error.message || 'Upload failed. Please try again.')
      setOcrText('')
    } finally {
      setIsUploading(false)
    }
  }

  const handlePredict = async () => {
    if (isSubmitting) return // Prevent double submissions
    if (!symptoms.trim()) {
      showToast("Please enter your symptoms before prediction.", "error")
      return
    }

    setIsSubmitting(true)
    setLoadingStage(0)

    const stages = [
      "Uploading Prescription...",
      "Extracting OCR...",
      "Analyzing Symptoms...",
      "Running SVM Prediction...",
      "Generating AI Explanation...",
      "Preparing Recommendations...",
      "Almost Done..."
    ]

    let stageIdx = 0
    const interval = setInterval(() => {
      if (stageIdx < stages.length - 2) {
        stageIdx++
        setLoadingStage(stageIdx)
      }
    }, 450)

    try {
      const payload = buildPredictionPayload({
        symptoms,
        assessment: answers,
        ocrText: ocrText || '',
        ocrFilename: selectedFileName || '',
      })
      const result = await createPrediction(payload)

      clearInterval(interval)
      setLoadingStage(5) // Preparing Recommendations...
      await new Promise((r) => setTimeout(r, 450))
      setLoadingStage(6) // Almost Done...
      await new Promise((r) => setTimeout(r, 400))

      localStorage.setItem('latest_prediction', JSON.stringify(result))
      navigate('/result', { state: { prediction: result } })
    } catch (error) {
      clearInterval(interval)
      setIsSubmitting(false)
      const msg = error.message || ''
      if (msg.includes('Session expired') || msg.includes('401') || msg.includes('Unauthorized')) {
        showToast("Session expired. Please login again.", "error")
        setTimeout(() => navigate('/login'), 2000)
      } else if (msg.includes('Failed to fetch') || msg.includes('connect')) {
        showToast("Unable to connect to the server. Please try again.", "error")
      } else {
        showToast("Prediction failed. Please try again.", "error")
      }
    }
  }

  const progressPercent = ((currentQuestion + 1) / questions.length) * 100
  const isAnswerSelected = answers[currentQuestion] !== undefined
  const isLastQuestion = currentQuestion === questions.length - 1

  return (
    <div className="flex min-h-screen w-full bg-pa-shell overflow-x-hidden">
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <DashboardSidebar
          active="dashboard"
          consultVariant="gold"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <div className="flex min-w-0 flex-1 flex-col bg-pa-shell-2">
          {/* Mobile / Tablet Header Bar */}
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

          <div className="flex flex-col flex-1">
            {/* Primary Content (First Screen Viewport Fitting on Desktop) */}
            <div className="flex min-h-[calc(100vh-60px)] flex-col justify-between px-5 pb-6 pt-5 md:min-h-screen md:px-8 lg:h-screen lg:min-h-[500px] lg:px-10 lg:pb-7">
              <header className="mt-2 lg:mt-3">
                <h1 className="font-serif text-[2rem] italic leading-tight text-pa-green-2 sm:text-[2.3rem] md:text-[2.5rem]">
                  {greeting}, {userName}
                </h1>
                <p className="mt-1 max-w-2xl font-sans text-xs leading-relaxed text-[#6f7f6f] sm:text-sm">
                  Today is a balanced day for your Pitta energy. Let&apos;s explore your current state of being.
                </p>
              </header>

              <section className="mt-4 flex-1 overflow-hidden rounded-[30px] bg-[#eef4e4] p-4 shadow-sm sm:p-5 lg:mt-5 lg:p-5 flex flex-col justify-center">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] xl:grid-cols-[1.1fr_0.45fr] items-start">
                  
                  {/* Left Side (70%) */}
                  <div className="flex flex-col">
                    <div>
                      <h2 className="font-serif text-[1.4rem] italic text-pa-green-2 md:text-[1.6rem] flex items-center gap-2">
                        <span>🌿</span> Enter Your Symptoms
                      </h2>
                      <div className="mt-3">
                        <SymptomInput value={symptoms} onChange={setSymptoms} />
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="relative mb-4 flex items-center gap-3">
                        <div className="h-px flex-1 bg-black/10" />
                        <span className="font-sans text-[10px] font-bold text-[#9aa89a] tracking-widest">OR</span>
                        <div className="h-px flex-1 bg-black/10" />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 items-stretch">
                        <UploadCard
                          onFileSelect={handleFileSelect}
                          isUploading={isUploading}
                          selectedFileName={selectedFileName}
                          uploadStatus={uploadStatus}
                          uploadError={uploadError}
                        />
                        <button
                          type="button"
                          onClick={handlePredict}
                          disabled={isSubmitting}
                          className="flex h-full min-h-[110px] items-center justify-center gap-3 rounded-[20px] bg-pa-green-2 px-5 py-5 font-sans text-sm font-bold uppercase tracking-wide text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#153728] cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {isSubmitting ? 'Predicting...' : 'Predict Prakriti'}
                          <FlaskConical className="h-5 w-5" strokeWidth={1.75} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Side (30%) */}
                  <div className="flex w-full flex-col gap-4">
                    <div className="w-full overflow-hidden rounded-[24px] border border-white/70 bg-white/70 p-4 shadow-[0_20px_45px_rgba(27,67,50,0.08)] backdrop-blur-sm transition-all duration-300 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-[#b89b2c]" />
                          <h3 className="font-serif text-base font-semibold text-pa-green-2">
                            Optional Assessment
                          </h3>
                        </div>
                        <p className="mt-2 font-sans text-xs sm:text-sm leading-relaxed text-[#5f6f5f]">
                          Answer 5 optional questions to improve prediction accuracy.
                        </p>
                      </div>

                      <div className="mt-3 rounded-[18px] border border-black/5 bg-[#f8f8ee] p-3.5">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a6520]">
                          <span>{assessmentStatus === 'completed' ? 'Assessment Completed ✓' : '5 Questions'}</span>
                          <span>Est. &lt; 1 min</span>
                        </div>
                        <p className="mt-1.5 font-sans text-xs leading-relaxed text-[#5f6f5f]">
                          {assessmentStatus === 'completed'
                            ? 'Your responses are saved to refine your predictions.'
                            : 'Quickly describe your traits to customize recommendations.'}
                        </p>
                        <button
                          type="button"
                          onClick={handleOpenAssessment}
                          className="mt-3 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-[#f6f4e7] to-[#eef5e3] px-3.5 py-2.5 font-sans text-xs font-semibold text-pa-green-2 transition hover:shadow-sm border border-black/5 cursor-pointer"
                        >
                          {assessmentStatus === 'completed' ? 'Edit Answers' : 'Start Assessment →'}
                        </button>
                      </div>
                    </div>

                    <div className="w-full rounded-[20px] border border-[#e8e3cf] bg-[#f9f6e7] p-4 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-[#b58b28]" />
                        <h4 className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-pa-green-2">
                          Prediction Strategy
                        </h4>
                      </div>
                      <ul className="mt-3 space-y-1.5 font-sans text-xs text-[#5c604f]">
                        <li className="flex justify-between items-center">
                          <span className="flex gap-1.5 items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-pa-green-2" />
                            Symptom Analysis
                          </span>
                          <span className="font-bold text-pa-green-2">80%</span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span className="flex gap-1.5 items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#b58b28]" />
                            Optional Assessment
                          </span>
                          <span className="font-bold text-[#b58b28]">20%</span>
                        </li>
                      </ul>
                      <p className="mt-2.5 pt-2.5 border-t border-black/5 font-sans text-[10px] text-[#6f7f6f] leading-snug">
                        Final prediction combines both for improved personalization.
                      </p>
                    </div>
                  </div>

                </div>
              </section>
            </div>

            {/* Secondary Content Section (Scrollable on Desktop) */}
            <div className="border-t border-black/5 bg-pa-shell-2 px-5 pb-7 pt-7 md:px-8 lg:px-10">
              <div className="grid gap-4 lg:grid-cols-3 items-stretch">
                
                {/* Card 1: AI Suggestions */}
                <section className="rounded-[28px] bg-white border border-black/5 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 md:p-6 flex flex-col justify-between h-full min-h-[220px]">
                  <div>
                    <div className="flex items-center gap-2 text-pa-green-2">
                      <Sparkles className="h-5 w-5 text-[#8a9a88]" strokeWidth={1.5} />
                      <h2 className="font-serif text-xl italic text-pa-green-2">AI Suggestions</h2>
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                      {suggestionCards.map((card) => {
                        const Icon = card.icon
                        return (
                          <div
                            key={card.title}
                            className={`rounded-xl border-l-4 px-3 py-2 transition duration-200 hover:-translate-y-0.5 hover:shadow-sm ${card.accent}`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                              <p className="font-sans text-[10px] font-bold uppercase tracking-wide">
                                {card.title}
                              </p>
                            </div>
                            <p className="mt-1 font-sans text-xs font-semibold text-[#3a3a2a]">
                              {card.description}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </section>

                {/* Card 2: Daily Wisdom */}
                <section className="pa-card-hover relative overflow-hidden rounded-[28px] border border-black/5 bg-gradient-to-br from-[#fcfdf6] to-[#eef4e4] p-5 shadow-sm transition duration-200 md:p-6 flex flex-col justify-between h-full min-h-[220px]">
                  <img src={yogaMeditation} alt="Botanical wellness scene" className="absolute inset-x-0 bottom-0 h-[140px] w-full object-cover opacity-70 sm:h-[150px]" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#113426]/70 via-[#113426]/35 to-[#0f1f16]/65" />
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-lg">💬</span>
                      <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.18em]">Daily Wisdom</h2>
                    </div>
                    <div className="max-w-[95%]">
                      <p className="font-serif text-[1.1rem] italic leading-relaxed text-white/95">
                        “A calm routine brings more clarity than a crowded mind.”
                      </p>
                      <p className="mt-3 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
                        Ayurvedic Wisdom
                      </p>
                    </div>
                    <div className="mt-4 border-t border-white/20 pt-3">
                      <p className="font-sans text-xs font-bold uppercase tracking-wider text-white/85">
                        Today&apos;s Inspiration
                      </p>
                    </div>
                  </div>
                </section>

                {/* Card 3: Learn Ayurveda */}
                <section className="pa-card-hover rounded-[28px] border border-black/5 bg-white p-5 shadow-sm transition duration-200 md:p-6 flex flex-col justify-between h-full min-h-[220px]">
                  <div>
                    <div className="flex items-center gap-2 text-pa-green-2">
                      <BookOpen className="h-5 w-5 text-[#7a8a78]" strokeWidth={1.6} />
                      <h2 className="font-serif text-xl italic text-pa-green-2"> Learn Ayurveda</h2>
                    </div>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-[#5f6f5f]">
                      Discover the fundamentals of Ayurveda and understand your body better.
                    </p>

                    <div className="mt-4 space-y-2">
                      {[
                        { label: 'What is Vata?', icon: Wind },
                        { label: 'What is Pitta?', icon: Flame },
                        { label: 'What is Kapha?',  icon: Sprout },
                        { label: 'Seasonal Diet',  icon: UtensilsCrossed },
                        { label: 'Yoga Guide',  icon: Sparkles },
                      ].map((topic) => {
                        const TopicIcon = topic.icon
                        return (
                          <button
                            key={topic.label}
                            type="button"
                            className="flex w-full items-center justify-between rounded-[16px] border border-black/5 bg-[#f8f8ee] px-3 py-2 text-left transition duration-200 hover:-translate-y-0.5 hover:bg-[#f0f3e2]"
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eef4e4] text-pa-green-2">
                                <TopicIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
                              </span>
                              <span>
                                <span className="block font-sans text-sm font-semibold text-[#4b564d]">{topic.label}</span>
                                <span className="block font-sans text-[11px] text-[#7a8578]">{topic.subtitle}</span>
                              </span>
                            </span>
                            <ArrowRight className="h-4 w-4 text-[#7a8578] transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={1.7} />
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/learn-ayurveda')}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-pa-green-2 px-5 py-3 font-sans text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#153728] cursor-pointer"
                  >
                    Explore <ArrowRight className="h-4 w-4" />
                  </button>
                </section>

              </div>

              <div className="mt-10">
                <Footer variant="appShell" />
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Floating Glassmorphism Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-3 py-4 backdrop-blur-md sm:px-4">
          <div className="w-full max-w-[640px] rounded-[28px] border border-white/40 bg-white/85 p-6 shadow-[0_30px_80px_rgba(20,83,45,0.12)] backdrop-blur-md overflow-y-auto max-h-[calc(100vh-2rem)] animate-scale-in">
            
            {assessmentStatus === 'completed' ? (
              <div className="transition-all duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-[1.45rem] font-bold text-pa-green-2 flex items-center gap-2">
                      <span>🌿</span> Assessment Completed
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setCurrentQuestion(0)
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white/80 text-pa-green-2 transition hover:bg-white cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="mt-6 rounded-[20px] border border-[#e7ebdc] bg-[#f7fbf1] p-5">
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-pa-green-2">
                    Summary
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {questions.map((item) => (
                      <div key={item.key} className="flex items-center gap-2.5 rounded-xl border border-black/5 bg-white/80 px-4 py-2.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e8f0dc] text-[#6f8a4e] text-xs font-bold">✓</span>
                        <div>
                          <span className="block font-sans text-xs font-bold text-[#8a9585] uppercase tracking-wider">{item.key}</span>
                          <span className="block font-sans text-sm font-semibold text-[#4b564d]">{answers[questions.indexOf(item)] || 'Selected'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-5 font-sans text-sm leading-relaxed text-[#5f6f5f] text-center max-w-md mx-auto">
                  Your assessment will be combined with symptom analysis to improve prediction accuracy.
                </p>

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setCurrentQuestion(0)
                    }}
                    className="rounded-xl bg-pa-green-2 px-6 py-3 font-sans text-sm font-semibold text-white shadow-md transition hover:bg-[#153728] cursor-pointer"
                  >
                    Continue to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="transition-all duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-[1.35rem] font-bold text-pa-green-2 flex items-center gap-2">
                      <span>🌿</span> Optional Ayurvedic Assessment
                    </h3>
                    <p className="mt-1 font-sans text-xs text-[#7a8578]">
                      Help AI understand your body constitution.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseRequest}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white/80 text-pa-green-2 transition hover:bg-white cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5 rounded-[20px] border border-[#e8e3cf] bg-[#f9f6e7] p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#7a6520]">
                      Question {currentQuestion + 1} of {questions.length}
                    </p>
                    <p className="font-sans text-xs font-semibold text-pa-green-2">{Math.round(progressPercent)}%</p>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/85">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#5f7f4d] to-[#b58b28] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 rounded-[20px] border border-black/5 bg-white/90 p-5 shadow-inner">
                  <div key={currentQuestion} className="transition-all duration-300">
                    <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a6520]">
                      {questions[currentQuestion].key}
                    </p>
                    <h4 className="mt-2 font-serif text-lg font-semibold text-pa-green-2">
                      {questions[currentQuestion].prompt}
                    </h4>
                    <div className="mt-4 space-y-2.5">
                      {questions[currentQuestion].options.map((option) => {
                        const isSelected = answers[currentQuestion] === option
                        return (
                          <label
                            key={option}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 font-sans text-sm transition ${
                              isSelected
                                ? 'border-pa-green-2 bg-[#eef5e3] text-pa-green-2 shadow-sm'
                                : 'border-black/5 bg-[#f7f7eb] text-[#4d5548] hover:bg-[#eef3da]'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${currentQuestion}`}
                              checked={isSelected}
                              onChange={() => handleAnswerSelect(currentQuestion, option)}
                              className="h-4 w-4 accent-pa-green-2"
                            />
                            <span>{option}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className={`rounded-xl border border-black/10 px-4 py-2.5 font-sans text-xs sm:text-sm font-semibold text-[#5f6f5f] transition ${
                      currentQuestion === 0 ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#f3f3ea] cursor-pointer'
                    }`}
                  >
                    Previous
                  </button>
                  {isLastQuestion ? (
                    <button
                      type="button"
                      onClick={handleSaveAssessment}
                      disabled={!isAnswerSelected}
                      className={`rounded-xl bg-pa-green-2 px-5 py-2.5 font-sans text-xs sm:text-sm font-semibold text-white shadow-md transition ${
                        !isAnswerSelected ? 'cursor-not-allowed opacity-60' : 'hover:bg-[#153728] cursor-pointer'
                      }`}
                    >
                      Save Assessment
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!isAnswerSelected}
                      className={`rounded-xl bg-pa-green-2 px-5 py-2.5 font-sans text-xs sm:text-sm font-semibold text-white shadow-md transition ${
                        !isAnswerSelected ? 'cursor-not-allowed opacity-60' : 'hover:bg-[#153728] cursor-pointer'
                      }`}
                    >
                      Next →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Discard Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-[2px]">
          <div className="w-full max-w-[400px] rounded-[24px] border border-white/70 bg-[#fcfbef] p-5 shadow-[0_20px_60px_rgba(27,67,50,0.16)]">
            <h3 className="font-serif text-lg font-semibold text-pa-green-2">Discard Assessment?</h3>
            <p className="mt-3 font-sans text-xs sm:text-sm leading-relaxed text-[#5f6f5f]">
              Your progress has not been saved. Are you sure you want to close?
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleContinueAssessment}
                className="rounded-xl border border-black/10 bg-white px-4 py-2 font-sans text-xs sm:text-sm font-semibold text-[#5f6f5f] transition hover:bg-[#f3f3ea] cursor-pointer"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={handleConfirmDiscard}
                className="rounded-xl bg-pa-green-2 px-4 py-2 font-sans text-xs sm:text-sm font-semibold text-white transition hover:bg-[#153728] cursor-pointer"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Toast Alert */}
      {toast.show && (
        <div className="fixed bottom-5 right-5 z-[110] flex max-w-sm items-center gap-3 rounded-2xl border border-white/10 bg-[#121c16]/95 p-4 shadow-lg backdrop-blur-sm transition-all duration-500 animate-in fade-in slide-in-from-bottom-5">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-lg ${
            toast.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
          }`}>
            {toast.type === 'error' ? '✕' : '⚠'}
          </div>
          <div className="flex-1 font-sans text-xs font-semibold text-white">
            {toast.message}
          </div>
          <button
            onClick={() => setToast(prev => ({ ...prev, show: false }))}
            className="text-white/40 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0c2217]/85 backdrop-blur-md">
          <div className="relative flex flex-col items-center justify-center p-8 max-w-sm text-center">
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 rounded-full border-4 border-pa-green-3/30" />
              <div className="absolute inset-0 rounded-full border-4 border-t-pa-green-2 animate-spin" />
              <div className="absolute inset-4 flex items-center justify-center text-2xl">🌿</div>
            </div>
            <h3 className="mt-8 font-serif text-xl italic text-white font-semibold">Analyzing your constitution...</h3>
            
            <div className="mt-6 space-y-2 w-full text-left font-sans text-xs">
              {[
                "Uploading Prescription...",
                "Extracting OCR...",
                "Analyzing Symptoms...",
                "Running SVM Prediction...",
                "Generating AI Explanation...",
                "Preparing Recommendations...",
                "Almost Done..."
              ].map((stageText, idx) => {
                const isDone = loadingStage > idx
                const isActive = loadingStage === idx
                return (
                  <div key={idx} className="flex items-center gap-3 transition-opacity duration-300">
                    <span className={`h-2.5 w-2.5 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isDone ? "bg-emerald-400" : isActive ? "bg-white animate-pulse" : "bg-white/20"
                    }`} />
                    <span className={`transition-colors duration-300 ${
                      isDone ? "text-emerald-400/90 font-medium" : isActive ? "text-white font-bold" : "text-white/40"
                    }`}>
                      {stageText}
                    </span>
                    {isDone && <span className="ml-auto text-[10px] text-emerald-400 font-bold uppercase">✓</span>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
