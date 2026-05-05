import { Link } from 'react-router-dom'
import { Sprout, Sparkles, Leaf, BookOpen, UtensilsCrossed, Cross, Flower2 } from 'lucide-react'
import apples from '../assets/images/apples-jar.jpg'
import faceBio from '../assets/images/face-biometric.jpg'
import beachYoga from '../assets/images/beach-yoga.jpg'

function HomePrecision() {
  return (
    <section className="mt-24 md:mt-32">
      <div className="mb-10 md:mb-12">
        <h2 className="font-serif text-[2rem] font-semibold text-pa-green md:text-[2.35rem]">
          Precision Ayurveda
        </h2>
        <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-[#6f7f6f] md:text-[0.95rem]">
          Our algorithm analyzes thousands of variables to map your unique biological blueprint.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
        <article className="relative flex flex-col rounded-[28px] bg-pa-beige-soft p-7 shadow-sm lg:row-span-2">
          <Sprout className="h-6 w-6 text-pa-green" strokeWidth={1.75} />
          <h3 className="mt-5 font-serif text-xl font-bold text-[#1f1f1f]">Deep Prakriti Analysis</h3>
          <p className="mt-3 max-w-sm font-sans text-sm leading-relaxed text-[#5f6f5f]">
            A comprehensive digital assessment of your Doshas: Vata, Pitta, and Kapha.
          </p>
          <div className="mt-8 flex flex-1 items-end justify-center lg:justify-end">
            <div className="h-40 w-full max-w-[220px] rounded-2xl bg-[#d8d8d0] lg:h-48 lg:max-w-[260px]" />
          </div>
        </article>

        <article className="relative flex flex-col justify-between overflow-hidden rounded-[28px] bg-pa-slate p-7 text-white shadow-md lg:col-span-2">
          <div className="max-w-lg">
            <h3 className="font-serif text-xl font-bold">AI Consultant</h3>
            <p className="mt-3 font-sans text-sm leading-relaxed text-white/90">
              24/7 access to your personalized Ayurvedic advisor.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex w-fit items-center rounded-full border border-white/70 px-5 py-2 font-sans text-xs font-semibold text-white transition hover:bg-white/10"
            >
              Try Now
            </Link>
          </div>
          <div className="pointer-events-none absolute right-6 top-6 flex gap-2 opacity-40">
            <Sparkles className="h-6 w-6" />
            <Sparkles className="h-5 w-5 translate-y-2" />
            <Sparkles className="h-6 w-6 -translate-y-1" />
          </div>
        </article>

        <article className="flex min-h-[200px] flex-col justify-between rounded-[28px] bg-pa-beige-card p-6 shadow-sm">
          <Leaf className="h-6 w-6 text-[#a67c52]" strokeWidth={1.75} />
          <h3 className="font-serif text-lg font-bold text-[#1f1f1f]">Curated Herbology</h3>
        </article>

        <article className="flex min-h-[200px] flex-col justify-between rounded-[28px] bg-pa-green p-6 text-white shadow-sm">
          <BookOpen className="h-6 w-6 text-white/90" strokeWidth={1.75} />
          <h3 className="font-serif text-lg font-bold text-white">Ritual Guide</h3>
        </article>
      </div>
    </section>
  )
}

function LearnModalities() {
  return (
    <section className="mt-24 md:mt-32">
      <h2 className="text-center font-serif text-[1.75rem] italic text-pa-green-2 md:text-[2rem]">
        Our Core Modalities
      </h2>
      <div className="mx-auto mt-4 h-px w-14 bg-pa-green-2/25" />

      <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-stretch">
        <article className="flex flex-col overflow-hidden rounded-[28px] bg-pa-sage p-7 shadow-sm">
          <UtensilsCrossed className="h-6 w-6 text-pa-green-2" />
          <h3 className="mt-4 font-serif text-xl font-bold text-pa-green-2">Lifestyle and Nutrition</h3>
          <p className="mt-3 font-sans text-sm leading-relaxed text-[#5a6a5a]">
            Align your meals and daily rhythms with seasonal intelligence.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl">
            <img src={apples} alt="Seasonal fruits" className="h-40 w-full object-cover" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/70 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wide text-pa-green-2">
              Metabolic Sync
            </span>
            <span className="rounded-full bg-white/70 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wide text-pa-green-2">
              Seasonal Recipes
            </span>
          </div>
          <button
            type="button"
            className="mt-6 w-fit rounded-full border border-pa-green-2/40 bg-transparent px-5 py-2.5 font-sans text-xs font-semibold text-pa-green-2"
          >
            Personalize My Diet
          </button>
        </article>

        <article className="relative flex flex-col overflow-hidden rounded-[28px] bg-pa-green-deep p-7 text-white shadow-[0_24px_60px_rgba(27,67,50,0.25)] lg:-mt-4 lg:mb-4">
          <Cross className="h-6 w-6 text-white" />
          <h3 className="mt-4 font-serif text-xl font-bold">Preventive Medicine</h3>
          <p className="mt-3 font-sans text-sm leading-relaxed text-emerald-100/90">
            Predictive diagnostics rooted in Prakriti-first modeling.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl ring-2 ring-white/20">
            <img src={faceBio} alt="Biometric mapping" className="h-44 w-full object-cover" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wide text-pa-green-2">
              Predictive Analysis
            </span>
            <span className="rounded-full bg-white px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wide text-pa-green-2">
              Genome Mapping
            </span>
          </div>
          <button
            type="button"
            className="mt-6 w-fit rounded-full bg-white px-5 py-2.5 font-sans text-xs font-semibold text-pa-green-2"
          >
            Analyze Prakriti
          </button>
        </article>

        <article className="flex flex-col overflow-hidden rounded-[28px] bg-[#f9f7eb] p-7 shadow-sm">
          <Flower2 className="h-6 w-6 text-[#a67c52]" />
          <h3 className="mt-4 font-serif text-xl font-bold text-pa-green-2">Wellness Programs</h3>
          <p className="mt-3 font-sans text-sm leading-relaxed text-[#5a6a5a]">
            Structured routines for breath, movement, and recovery.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl">
            <img src={beachYoga} alt="Yoga on the beach" className="h-40 w-full object-cover" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-pa-sage px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wide text-pa-green-2">
              Yoga Flows
            </span>
            <span className="rounded-full bg-pa-sage px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wide text-pa-green-2">
              Circadian Alignment
            </span>
          </div>
          <button
            type="button"
            className="mt-6 w-fit rounded-full border border-pa-green-2/40 bg-transparent px-5 py-2.5 font-sans text-xs font-semibold text-pa-green-2"
          >
            Start Routine
          </button>
        </article>
      </div>
    </section>
  )
}

function LearnEcosystem() {
  return (
    <section className="mt-24 md:mt-32">
      <h2 className="text-center font-serif text-[1.75rem] italic text-pa-green-2 md:text-[2rem]">
        The Precision Ecosystem
      </h2>
      <div className="mx-auto mt-4 h-px w-14 bg-pa-green-2/25" />

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <article className="relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[28px] bg-gradient-to-b from-[#dfe5d8] via-[#ecebdc] to-[#f4f1e4] p-8 shadow-sm">
          <div>
            <h3 className="font-serif text-xl font-semibold text-pa-green-2">Real-time Biometric Tracking</h3>
            <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-[#5a6a5a]">
              Live vitals stream into your dosha model for adaptive guidance throughout the day.
            </p>
          </div>
          <div className="flex flex-col items-center py-8">
            <div className="rounded-2xl border border-white/60 bg-white/40 px-8 py-6 text-center shadow-inner backdrop-blur-sm">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-[#6a7a6a]">
                BIOMETRICS
              </p>
              <p className="mt-2 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-pa-green-2">
                SAFE WORK
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-black/5 pt-5 font-sans text-xs font-semibold text-pa-green-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-pa-green-2 text-white">
              ♥
            </span>
            ACTIVE STATUS <span className="font-normal text-[#5a6a5a]">Synchronized</span>
          </div>
        </article>

        <div className="grid gap-5">
          <article className="relative flex min-h-[180px] items-center justify-between overflow-hidden rounded-[28px] bg-pa-slate p-7 text-white shadow-sm">
            <div className="max-w-[70%]">
              <h3 className="font-serif text-xl font-semibold">Community Wisdom</h3>
              <p className="mt-2 font-sans text-sm text-white/85">
                Learn from anonymized cohort patterns across climates and seasons.
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white">
              <span className="font-sans text-lg">👥</span>
            </div>
          </article>

          <div className="grid gap-5 sm:grid-cols-2">
            <article className="flex min-h-[160px] flex-col justify-center rounded-[28px] bg-pa-gold p-6 text-pa-green-2 shadow-sm">
              <p className="font-serif text-5xl font-bold">98%</p>
              <p className="mt-2 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-pa-green-2/80">
                Accuracy Rate
              </p>
            </article>
            <article className="flex min-h-[160px] flex-col justify-center gap-3 rounded-[28px] bg-[#f4f6ea] p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/90 text-white">
                ✓
              </div>
              <h3 className="font-serif text-lg font-semibold text-pa-green-2">Privacy Guaranteed</h3>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function FeatureCards({ variant = 'home' }) {
  if (variant === 'learn') {
    return (
      <>
        <LearnModalities />
        <LearnEcosystem />
      </>
    )
  }
  return <HomePrecision />
}
