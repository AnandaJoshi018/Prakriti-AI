import { UtensilsCrossed, Check, AlertTriangle, ArrowRight } from 'lucide-react'
import salad from '../assets/images/salad-bowl.jpg'
import zen from '../assets/images/zen-stones.jpg'

export function DietaryProtocolCard() {
  return (
    <article className="relative h-full overflow-hidden rounded-[28px] bg-pa-sage p-7 shadow-sm md:p-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-pa-green-2 text-white">
          <UtensilsCrossed className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <h3 className="font-serif text-xl font-semibold text-pa-green-3">Dietary Protocol</h3>
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <p className="font-sans text-sm font-bold text-pa-green-3">Favored Foods</p>
          </div>
          <ul className="mt-4 space-y-3 font-sans text-sm leading-relaxed text-[#3f4f3f]">
            <li>
              <span className="mr-2 text-emerald-600">+</span>Sweet, juicy fruits and bitter greens to
              cool systemic heat.
            </li>
            <li>
              <span className="mr-2 text-emerald-600">+</span>Cooling grains like basmati, barley, and
              fresh cilantro.
            </li>
            <li>
              <span className="mr-2 text-emerald-600">+</span>Hydrating broths with cucumber and mint.
            </li>
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#c58a54] text-white">
              <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            <p className="font-sans text-sm font-bold text-[#5c3d24]">Minimize Intake</p>
          </div>
          <ul className="mt-4 space-y-3 font-sans text-sm leading-relaxed text-[#4a3a2a]">
            <li>
              <span className="mr-2 text-[#b08968]">−</span>Pungent spices, excess vinegar, and
              fermented heat-forward condiments.
            </li>
            <li>
              <span className="mr-2 text-[#b08968]">−</span>Heavy caffeine loads after solar noon.
            </li>
          </ul>
        </div>
      </div>
      <img
        src={salad}
        alt="Cooling salad"
        className="pointer-events-none absolute -bottom-6 right-[-12px] hidden h-44 w-44 rounded-full object-cover shadow-lg ring-8 ring-white/70 md:block lg:h-52 lg:w-52"
      />
    </article>
  )
}

export function MovementCard() {
  const items = [
    { title: 'Moonsalutation', sub: 'Chandra Namaskar - 12 Reps' },
    { title: 'Pigeon Pose', sub: 'Kapotasana - 5 Min Hold' },
    { title: 'Savasana', sub: 'Corpse Pose - Deep Cooling' },
  ]
  return (
    <article className="flex h-full flex-col rounded-[28px] bg-[#c5daf5] p-7 shadow-sm md:p-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1e2a3a] shadow-sm">
          <span className="text-lg" aria-hidden>
            🧘
          </span>
        </span>
        <h3 className="font-serif text-xl font-semibold text-[#1b2b45]">Movement</h3>
      </div>
      <p className="mt-4 font-sans text-sm leading-relaxed text-[#2f3f55]">
        Focus on grounding, calming, and cooling sequences to balance internal heat.
      </p>
      <div className="mt-6 flex flex-1 flex-col gap-3">
        {items.map((it) => (
          <div
            key={it.title}
            className="rounded-2xl border border-white/50 bg-white/45 px-4 py-3 backdrop-blur-sm"
          >
            <p className="font-sans text-xs font-bold uppercase tracking-wide text-[#1b2b45]">{it.title}</p>
            <p className="mt-1 font-serif text-xs italic text-[#2f3f55]">{it.sub}</p>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#455a64] py-3 font-sans text-sm font-semibold text-white transition hover:bg-[#3a4d56]"
      >
        View Yoga Routine <ArrowRight className="h-4 w-4" />
      </button>
    </article>
  )
}

export function EveningRoutineCard() {
  return (
    <article className="rounded-[28px] bg-pa-sage p-7 shadow-sm md:p-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#8d6e63] text-white">
          <span className="text-lg" aria-hidden>
            ☽
          </span>
        </span>
        <h3 className="font-serif text-lg font-semibold text-pa-green-3">Evening Routine</h3>
      </div>
      <ul className="mt-6 space-y-3 font-sans text-sm leading-relaxed text-[#2f4f2f]">
        <li className="flex gap-2">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pa-green-3" />
          Cool oil massage (Abhyanga) with coconut or sunflower.
        </li>
        <li className="flex gap-2">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pa-green-3" />
          Screen-free wind-down for 45 minutes before sleep.
        </li>
      </ul>
    </article>
  )
}

export function MentalHygieneCard() {
  return (
    <article className="h-full rounded-[28px] bg-[#f6f4df] p-7 shadow-sm md:p-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-pa-green-3 text-white">
          <span className="text-sm font-bold">⌘</span>
        </span>
        <h3 className="font-serif text-lg font-semibold text-pa-green-3">Mental Hygiene</h3>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-[160px_1fr] md:items-center">
        <img
          src={zen}
          alt="Zen stones"
          className="h-36 w-full rounded-2xl object-cover shadow-md md:h-40 md:w-40"
        />
        <p className="font-sans text-sm leading-relaxed text-[#3f4f3f]">
          Cultivate patience through paced breathing and reflective journaling. Pitta types benefit from
          softening ambition loops with sensory moderation and moonlit walks.
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {['Meditation', 'Nature Walks', 'Cooling Pranayama'].map((t) => (
          <span
            key={t}
            className="rounded-full border border-emerald-300/80 bg-white/60 px-3 py-1 font-sans text-[11px] font-semibold text-pa-green-3"
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  )
}

export default function RecommendationCard({ variant = 'dietary' }) {
  if (variant === 'movement') return <MovementCard />
  if (variant === 'evening') return <EveningRoutineCard />
  if (variant === 'mental') return <MentalHygieneCard />
  return <DietaryProtocolCard />
}
