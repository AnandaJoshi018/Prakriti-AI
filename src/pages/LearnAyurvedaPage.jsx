import { useEffect, useState } from 'react'
import { ArrowLeft, BookOpen, ChevronDown, Compass, Leaf, Menu, Sparkles, SunMedium } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Footer from '../components/Footer.jsx'
import DashboardSidebar from '../components/DashboardSidebar.jsx'

const tocItems = [
  { id: 'ayurveda', label: 'What is Ayurveda?' },
  { id: 'vata', label: 'What is Vata?' },
  { id: 'pitta', label: 'What is Pitta?' },
  { id: 'kapha', label: 'What is Kapha?' },
  { id: 'diet', label: 'Seasonal Diet' },
  { id: 'yoga', label: 'Yoga Guide' }
]

const learningSections = [
  {
    id: 'ayurveda',
    category: 'Ayurveda',
    title: 'What is Ayurveda?',
    paragraphs: [
      'Ayurveda is one of the world\'s oldest holistic healthcare systems that originated in India over 5000 years ago.',
      'The word Ayurveda means "Science of Life."',
      'It focuses on maintaining physical, mental and emotional well-being through a balance of body, mind and lifestyle.',
      'Instead of only treating diseases, Ayurveda emphasizes prevention, healthy habits, proper diet, yoga, meditation and natural healing.'
    ],
    benefits: [
      'Personalized healthcare',
      'Preventive approach',
      'Natural healing',
      'Better lifestyle',
      'Improved immunity',
      'Mental wellness'
    ]
  },
  {
    id: 'vata',
    category: 'Vata',
    title: 'What is Vata?',
    overview: 'Vata is formed from Air and Space elements.',
    characteristics: [
      'Thin body frame',
      'Dry skin',
      'Cold hands and feet',
      'Fast thinking',
      'Creative',
      'Energetic',
      'Light sleeper'
    ],
    symptoms: [
      'Anxiety',
      'Constipation',
      'Dry skin',
      'Joint pain',
      'Insomnia',
      'Weight loss'
    ],
    diet: ['Warm cooked food', 'Milk', 'Ghee', 'Rice', 'Soups'],
    yoga: ['Child Pose', 'Gentle Yoga', 'Pranayama'],
    lifestyle: ['Sleep early', 'Regular routine', 'Reduce stress'],
    extra: 'It controls movement inside the body including breathing, circulation, nerve impulses and muscle movement.'
  },
  {
    id: 'pitta',
    category: 'Pitta',
    title: 'What is Pitta?',
    overview: 'Pitta is formed from Fire and Water elements.',
    characteristics: [
      'Medium body build',
      'Strong appetite',
      'Warm body',
      'Leadership',
      'Sharp memory'
    ],
    symptoms: ['Acidity', 'Anger', 'Skin rashes', 'Hair fall', 'Excess sweating'],
    diet: ['Coconut water', 'Fresh fruits', 'Cooling vegetables', 'Buttermilk'],
    yoga: ['Moon Salutation', 'Meditation', 'Cooling breathing'],
    lifestyle: ['Stay hydrated', 'Avoid excessive heat', 'Practice meditation'],
    extra: 'It controls digestion, metabolism, body temperature and intelligence.'
  },
  {
    id: 'kapha',
    category: 'Kapha',
    title: 'What is Kapha?',
    overview: 'Kapha is formed from Earth and Water elements.',
    characteristics: [
      'Broad body frame',
      'Calm personality',
      'Deep sleep',
      'Strong immunity',
      'Good endurance'
    ],
    symptoms: ['Weight gain', 'Laziness', 'Mucus', 'Slow digestion', 'Water retention'],
    diet: ['Light meals', 'Ginger tea', 'Millets', 'Warm herbal drinks'],
    yoga: ['Surya Namaskar', 'Power Yoga', 'Brisk Walking'],
    lifestyle: ['Daily exercise', 'Avoid overeating', 'Stay active'],
    extra: 'It provides stability, strength, immunity and nourishment.'
  },
  {
    id: 'diet',
    category: 'Diet',
    title: 'Seasonal Diet',
    sections: [
      {
        heading: 'Summer',
        recommended: ['Coconut water', 'Watermelon', 'Cucumber'],
        avoid: ['Spicy food', 'Excess fried food']
      },
      {
        heading: 'Monsoon',
        recommended: ['Ginger tea', 'Warm soups', 'Cooked vegetables'],
        avoid: ['Raw salads', 'Street food']
      },
      {
        heading: 'Winter',
        recommended: ['Ghee', 'Dry fruits', 'Warm milk', 'Millet'],
        avoid: ['Cold drinks']
      }
    ]
  },
  {
    id: 'yoga',
    category: 'Yoga',
    title: 'Yoga Guide',
    groups: [
      { heading: 'For Vata', items: ['Child Pose', 'Cat-Cow', 'Gentle Stretching', 'Anulom Vilom'] },
      { heading: 'For Pitta', items: ['Moon Salutation', 'Sheetali Pranayama', 'Meditation'] },
      { heading: 'For Kapha', items: ['Surya Namaskar', 'Warrior Pose', 'Power Yoga', 'Brisk Walking'] }
    ]
  }
]

const faqs = [
  {
    question: 'What is Prakriti?',
    answer:
      'Prakriti is an individual\'s natural body constitution determined by the balance of Vata, Pitta and Kapha from birth. It influences physical characteristics, metabolism, personality and overall health.'
  },
  {
    question: 'Can Prakriti change?',
    answer:
      'Your original Prakriti remains constant throughout life. However, your current dosha balance (Vikriti) may change due to diet, stress, weather, illness and lifestyle.'
  },
  {
    question: 'Can a person have more than one dominant dosha?',
    answer:
      'Yes. Many individuals have dual constitutions such as Vata-Pitta or Pitta-Kapha. One dosha is usually dominant while another may also have significant influence.'
  },
  {
    question: 'How does this AI prediction work?',
    answer:
      'The application analyzes the symptoms entered by the user using Machine Learning. Text is converted into numerical features using TF-IDF, then a Linear SVM model predicts the percentage of Vata, Pitta and Kapha. Optional assessment answers can further refine the prediction.'
  },
  {
    question: 'Is this prediction medically accurate?',
    answer:
      'This application is intended for educational and wellness purposes. It provides AI-assisted Ayurvedic insights and should not replace consultation with a qualified Ayurvedic physician or medical professional.'
  },
  {
    question: 'Why are diet and lifestyle important?',
    answer:
      'According to Ayurveda, proper food, sleep, exercise and daily habits help maintain dosha balance, improve digestion, strengthen immunity and prevent diseases.'
  },
  {
    question: 'How often should I check my Prakriti?',
    answer:
      'Prakriti itself usually remains constant, but your dosha balance can fluctuate. Rechecking every few months or after major lifestyle changes can help you monitor your wellness.'
  }
]

export default function LearnAyurvedaPage() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openAyurveda, setOpenAyurveda] = useState(true)
  const [openFaq, setOpenFaq] = useState(0)
  const [progress, setProgress] = useState(0)
  const [highlightedId, setHighlightedId] = useState(null)
  const [activeChip, setActiveChip] = useState('ayurveda')

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(Math.min(100, Math.max(0, percent)))
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setHighlightedId(id)
      window.clearTimeout(window.__prakritiHighlightTimer)
      window.__prakritiHighlightTimer = window.setTimeout(() => setHighlightedId(null), 1600)
    }
  }

  const navItems = [
    { id: 'ayurveda', label: 'Ayurveda' },
    { id: 'vata', label: 'Vata' },
    { id: 'pitta', label: 'Pitta' },
    { id: 'kapha', label: 'Kapha' },
    { id: 'diet', label: 'Diet' },
    { id: 'yoga', label: 'Yoga' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => document.getElementById(item.id)).filter(Boolean)
      const scrollPosition = window.scrollY + 180

      const activeSection = sections.findLast((section) => section.offsetTop <= scrollPosition)
      if (activeSection) {
        setActiveChip(activeSection.id)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="flex min-h-screen bg-pa-shell overflow-x-hidden">
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <DashboardSidebar active="dashboard" consultVariant="gold" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col bg-pa-shell-2">
          <div className="flex items-center justify-between border-b border-black/5 bg-pa-sidebar px-5 py-4 md:hidden">
            <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-1.5 hover:bg-black/[0.03]" aria-label="Open Navigation">
              <Menu className="h-5 w-5 text-pa-green-2" />
            </button>
            <span className="font-sans text-sm font-bold tracking-[0.12em] text-pa-green-2">PRAKRITI AI</span>
            <div className="w-8" />
          </div>

          <div className="px-5 pb-10 pt-6 md:px-8 lg:px-10">
            <div className="sticky top-0 z-10 -mx-5 md:-mx-8 lg:-mx-10 border-b border-black/5 bg-pa-shell-2/95 px-5 md:px-8 lg:px-10 py-4 backdrop-blur-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-pa-green-2 transition hover:bg-white"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Dashboard
                  </button>
                  <p className="mt-3 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-pa-green-2">Knowledge Guide</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <h1 className="font-serif text-[1.8rem] sm:text-[2.2rem] font-bold text-pa-green-2">Learn Ayurveda</h1>
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#dfe7d2] bg-[#f4f8eb] px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-pa-green-2">
                      <BookOpen className="h-3.5 w-3.5" />
                      Premium Guide
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-[#5f6f5f]">
                    A calm, structured introduction to Ayurveda, the three doshas, seasonal nourishment, and daily practices for balanced living.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {navItems.map((item) => {
                      const isActive = activeChip === item.id
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => scrollToSection(item.id)}
                          className={`rounded-full border px-3 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
                            isActive
                              ? 'border-pa-green-2 bg-pa-green-2 text-white shadow-sm'
                              : 'border-[#e7ebdc] bg-[#f7fbf1] text-[#4b564d] hover:bg-[#eef4e4]'
                          }`}
                        >
                          {item.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="w-full" />
              </div>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#edf2e5]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#4f7a4d] to-[#b58b28] transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>

            <div className="mt-6 rounded-[28px] border border-[#e7ebdc] bg-gradient-to-r from-[#f7f4e8] via-[#f4f8ee] to-[#eef4e4] p-6 shadow-sm md:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.18em] text-pa-green-2">
                    <Leaf className="h-3 w-3" />
                    Principles of Balance
                  </div>
                  <h2 className="mt-3 font-serif text-[1.45rem] font-bold text-pa-green-2 leading-tight">A gentle guide to living in harmony with nature.</h2>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-[#5f6f5f]">
                    Ayurveda teaches us to observe the body, mind, and seasons with compassion so that everyday habits support lasting vitality.
                  </p>
                </div>

                <div className="rounded-[20px] border border-white/70 bg-white/70 p-4 shadow-inner">
                  <div className="flex items-center gap-3 text-pa-green-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef5e3]">
                      <Compass className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="font-sans text-[9px] font-bold uppercase tracking-[0.14em]">Reading Guide</p>
                      <p className="font-serif text-sm font-bold">Read from top to bottom</p>
                    </div>
                  </div>
                  <div className="mt-3.5 grid gap-2 sm:grid-cols-2">
                    <div className="flex items-center gap-2.5 rounded-xl border border-black/5 bg-[#f7fbf1] p-2.5">
                      <SunMedium className="h-4.5 w-4.5 text-[#b58b28]" />
                      <p className="font-sans text-xs text-[#4b564d]">Seasonal awareness</p>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-xl border border-black/5 bg-[#f7fbf1] p-2.5">
                      <Sparkles className="h-4.5 w-4.5 text-[#4f7a4d]" />
                      <p className="font-sans text-xs text-[#4b564d]">Daily balance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <section id="ayurveda" className="rounded-[24px] border border-black/5 bg-white p-6 shadow-sm md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-pa-green-2">Introduction</p>
                    <h2 className="mt-1 font-serif text-[1.35rem] font-bold text-pa-green-2">What is Ayurveda?</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenAyurveda((prev) => !prev)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f6ea] text-pa-green-2 transition"
                  >
                    <ChevronDown className={`h-4.5 w-4.5 transition-transform duration-300 ${openAyurveda ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {openAyurveda && (
                  <div className="mt-5 border-t border-black/5 pt-5">
                    <div className="space-y-3 font-sans text-sm leading-relaxed text-[#5f6f5f]">
                      {learningSections[0].paragraphs.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>

                    <div className="mt-5 rounded-[20px] border border-[#e7ebdc] bg-[#f7fbf1] p-4">
                      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-pa-green-2">Core principles</p>
                      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                        {learningSections[0].benefits.map((item) => (
                          <li key={item} className="flex gap-2 font-sans text-sm text-[#4b564d]"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pa-green-2" /><span>{item}</span></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </section>

              {learningSections.slice(1).map((section) => (
                <section id={section.id} key={section.id} className={`rounded-[24px] border border-black/5 bg-white p-6 shadow-sm transition-all duration-500 md:p-7 ${highlightedId === section.id ? 'ring-2 ring-pa-green-2/20 bg-[#f7fbf1]' : ''}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-pa-green-2">{section.category}</p>
                      <h2 className="mt-1 font-serif text-[1.3rem] font-bold text-pa-green-2">{section.title}</h2>
                    </div>
                    <span className="rounded-full border border-[#e7ebdc] bg-[#f7fbf1] px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5f6f5f]">
                      {section.id === 'diet' ? 'Seasonal Guide' : section.id === 'yoga' ? 'Daily Practice' : 'Dosha Insight'}
                    </span>
                  </div>

                  <div className="mt-5 border-t border-black/5 pt-5">
                    {section.overview && (
                      <div className="rounded-[20px] border border-[#e7ebdc] bg-[#f7fbf1] p-4">
                        <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-pa-green-2">Definition</p>
                        <p className="mt-2 font-sans text-sm leading-relaxed text-[#4b564d]">{section.overview}</p>
                        {section.extra && <p className="mt-2 font-sans text-sm leading-relaxed text-[#4b564d]">{section.extra}</p>}
                      </div>
                    )}

                    {section.characteristics && (
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div className="rounded-[20px] border border-[#e7ebdc] bg-[#f8f8ee] p-4">
                          <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-pa-green-2">Characteristics</p>
                          <ul className="mt-3 space-y-2 font-sans text-sm text-[#4b564d]">
                            {section.characteristics.map((item) => (
                              <li key={item} className="flex gap-2"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pa-green-2" /><span>{item}</span></li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-[20px] border border-[#e7ebdc] bg-[#f8f8ee] p-4">
                          <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-pa-green-2">Symptoms of imbalance</p>
                          <ul className="mt-3 space-y-2 font-sans text-sm text-[#4b564d]">
                            {section.symptoms.map((item) => (
                              <li key={item} className="flex gap-2"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#b58b28]" /><span>{item}</span></li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {section.diet && (
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div className="rounded-[20px] border border-[#e7ebdc] bg-[#f7fbf1] p-4">
                          <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-pa-green-2">Foods to favor</p>
                          <ul className="mt-3 space-y-2 font-sans text-sm text-[#4b564d]">
                            {section.diet.map((item) => (
                              <li key={item} className="flex gap-2"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pa-green-2" /><span>{item}</span></li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-[20px] border border-[#e7ebdc] bg-[#f7fbf1] p-4">
                          <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-pa-green-2">Lifestyle tips</p>
                          <ul className="mt-3 space-y-2 font-sans text-sm text-[#4b564d]">
                            {section.lifestyle.map((item) => (
                              <li key={item} className="flex gap-2"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pa-green-2" /><span>{item}</span></li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {section.yoga && (
                      <div className="mt-4 rounded-[20px] border border-[#e7ebdc] bg-[#f8f8ee] p-4">
                        <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-pa-green-2">Yoga</p>
                        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                          {section.yoga.map((item) => (
                            <li key={item} className="flex gap-2 font-sans text-sm text-[#4b564d]"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#b58b28]" /><span>{item}</span></li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {section.sections && (
                      <div className="mt-4 space-y-3">
                        {section.sections.map((group) => (
                          <div key={group.heading} className="rounded-[20px] border border-[#e7ebdc] bg-[#f7fbf1] p-4">
                            <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-pa-green-2">{group.heading}</p>
                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                              <div>
                                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a8578]">Recommended</p>
                                <ul className="mt-2 space-y-2 font-sans text-sm text-[#4b564d]">
                                  {group.recommended.map((item) => (
                                    <li key={item} className="flex gap-2"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pa-green-2" /><span>{item}</span></li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a8578]">Avoid</p>
                                <ul className="mt-2 space-y-2 font-sans text-sm text-[#4b564d]">
                                  {group.avoid.map((item) => (
                                    <li key={item} className="flex gap-2"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#b58b28]" /><span>{item}</span></li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.groups && (
                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        {section.groups.map((group) => (
                          <div key={group.heading} className="rounded-[20px] border border-[#e7ebdc] bg-[#f7fbf1] p-4">
                            <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-pa-green-2">{group.heading}</p>
                            <ul className="mt-3 space-y-2 font-sans text-sm text-[#4b564d]">
                              {group.items.map((item) => (
                                <li key={item} className="flex gap-2"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pa-green-2" /><span>{item}</span></li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              ))}
            </div>

            <section className="mt-8 rounded-[28px] border border-black/5 bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#b58b28]" />
                <h3 className="font-serif text-xl font-bold text-pa-green-2">Frequently Asked Questions</h3>
              </div>

              <div className="mt-6 space-y-3">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index
                  return (
                    <div key={faq.question} className="rounded-xl border border-black/5 bg-[#f8f8ee] p-4 shadow-sm">
                      <button type="button" onClick={() => setOpenFaq(isOpen ? -1 : index)} className="flex w-full items-center justify-between gap-3 text-left cursor-pointer">
                        <span className="font-sans text-sm font-semibold text-pa-green-2">{faq.question}</span>
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-pa-green-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                          <ChevronDown className="h-4.5 w-4.5" />
                        </span>
                      </button>

                      {isOpen && (
                        <div className="mt-3 pt-3 border-t border-black/5 animate-scale-in">
                          <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#5f6f5f]">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          </div>

          <Footer variant="appShell" />
        </div>
      </div>
    </div>
  )
}
