import { UtensilsCrossed, Check, AlertTriangle, ArrowRight } from 'lucide-react'
import { useMemo } from 'react'
import salad from '../assets/images/salad-bowl.jpg'
import zen from '../assets/images/zen-stones.jpg'

export function DietaryProtocolCard({ recommendations, dominantDosha }) {
  const eatItems = useMemo(() => {
    if (recommendations?.foods_to_eat) {
      return recommendations.foods_to_eat.split(',').map((s) => s.trim()).filter(Boolean)
    }
    // Fallback based on dominantDosha
    if (dominantDosha === 'Vata') {
      return [
        'Warm soups, stews, and cooked grains like rice or oats.',
        'Root vegetables, ghee, and soaked nuts.',
        'Sweet fruits (bananas, mangoes) and warm dairy.',
      ]
    }
    if (dominantDosha === 'Kapha') {
      return [
        'Light grains (millet, barley, quinoa) and steamed vegetables.',
        'Legumes (lentils, mung beans) and raw honey in moderation.',
        'Spices like ginger and turmeric to stimulate digestion.',
      ]
    }
    // Default to Pitta
    return [
      'Sweet, juicy fruits and bitter greens to cool systemic heat.',
      'Cooling grains like basmati, barley, and fresh cilantro.',
      'Hydrating broths with cucumber and mint.',
    ]
  }, [recommendations, dominantDosha])

  const avoidItems = useMemo(() => {
    if (recommendations?.foods_to_avoid) {
      return recommendations.foods_to_avoid.split(',').map((s) => s.trim()).filter(Boolean)
    }
    if (dominantDosha === 'Vata') {
      return [
        'Raw salads, dry crackers, and cold beverages.',
        'Excessive beans and bitter or astringent foods.',
      ]
    }
    if (dominantDosha === 'Kapha') {
      return [
        'Heavy dairy, fried foods, and excessive sweets.',
        'Cold foods and excessive nut intake.',
      ]
    }
    // Default to Pitta
    return [
      'Pungent spices, excess vinegar, and fermented heat-forward condiments.',
      'Heavy caffeine loads after solar noon.',
    ]
  }, [recommendations, dominantDosha])

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
            {eatItems.map((item, idx) => (
              <li key={idx}>
                <span className="mr-2 text-emerald-600">+</span>
                {item}
              </li>
            ))}
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
            {avoidItems.map((item, idx) => (
              <li key={idx}>
                <span className="mr-2 text-[#b08968]">−</span>
                {item}
              </li>
            ))}
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

export function MovementCard({ recommendations, dominantDosha }) {
  const yogaDescription = recommendations?.yoga || (
    dominantDosha === 'Vata'
      ? 'Focus on slow, grounding, and warming sequences to steady the active Vata energy.'
      : dominantDosha === 'Kapha'
      ? 'Focus on dynamic, energizing, and heating practices to stimulate blood flow and metabolism.'
      : 'Focus on grounding, calming, and cooling sequences to balance internal heat.'
  )

  const items = useMemo(() => {
    if (dominantDosha === 'Vata') {
      return [
        { title: 'Sun Salutation', sub: 'Slow Surya Namaskar - 6 Reps' },
        { title: 'Child\'s Pose', sub: 'Balasana - 5 Min Hold' },
        { title: 'Corpse Pose', sub: 'Savasana - Grounding' },
      ]
    }
    if (dominantDosha === 'Kapha') {
      return [
        { title: 'Sun Salutation', sub: 'Vigorous Surya Namaskar - 12 Reps' },
        { title: 'Warrior Pose', sub: 'Virabhadrasana - 3 Min Hold' },
        { title: 'Breath of Fire', sub: 'Kapalabhati - 5 Min' },
      ]
    }
    // Default to Pitta
    return [
      { title: 'Moonsalutation', sub: 'Chandra Namaskar - 12 Reps' },
      { title: 'Pigeon Pose', sub: 'Kapotasana - 5 Min Hold' },
      { title: 'Savasana', sub: 'Corpse Pose - Deep Cooling' },
    ]
  }, [dominantDosha])

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
        {yogaDescription}
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

export function EveningRoutineCard({ recommendations, dominantDosha }) {
  const items = useMemo(() => {
    if (recommendations?.evening_routine) {
      // Split by semicolon, period, or comma if it contains them
      const delimiter = recommendations.evening_routine.includes(';') ? ';' : '.';
      return recommendations.evening_routine
        .split(delimiter)
        .map((s) => s.trim())
        .filter((s) => s.length > 2)
    }
    if (dominantDosha === 'Vata') {
      return [
        'Warm oil self-massage (Abhyanga) with sesame oil.',
        'Screen-free wind-down with warm herbal tea (Chamomile or Nutmeg milk).',
      ]
    }
    if (dominantDosha === 'Kapha') {
      return [
        'Light walk after dinner and warm cup of tulsi tea.',
        'Screen-free wind-down for 30 minutes before sleep.',
      ]
    }
    // Default/Pitta
    return [
      'Cool oil massage (Abhyanga) with coconut or sunflower.',
      'Screen-free wind-down for 45 minutes before sleep.',
    ]
  }, [recommendations, dominantDosha])

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
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-2">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pa-green-3" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  )
}

export function MentalHygieneCard({ recommendations, dominantDosha }) {
  const description = recommendations?.mental_hygiene || (
    dominantDosha === 'Vata'
      ? 'Calm the active mind through slow paced breathing, mindfulness practice, and regular journaling. Vata types benefit from grounding routines, reducing sensory inputs, and avoiding multitasking.'
      : dominantDosha === 'Kapha'
      ? 'Stimulate energy and motivation through creative projects, physical activity, and social connections. Kapha types benefit from shaking up routines, avoiding stagnation, and waking up early.'
      : 'Cultivate patience through paced breathing and reflective journaling. Pitta types benefit from softening ambition loops with sensory moderation and moonlit walks.'
  )

  const tags = useMemo(() => {
    if (dominantDosha === 'Vata') {
      return ['Grounding Breath', 'Warm Baths', 'Journaling']
    }
    if (dominantDosha === 'Kapha') {
      return ['Vigorous Walk', 'Creative Expression', 'Socializing']
    }
    return ['Meditation', 'Nature Walks', 'Cooling Pranayama']
  }, [dominantDosha])

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
          {description}
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((t) => (
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

export default function RecommendationCard({ variant = 'dietary', recommendations, dominantDosha }) {
  if (variant === 'movement') return <MovementCard recommendations={recommendations} dominantDosha={dominantDosha} />
  if (variant === 'evening') return <EveningRoutineCard recommendations={recommendations} dominantDosha={dominantDosha} />
  if (variant === 'mental') return <MentalHygieneCard recommendations={recommendations} dominantDosha={dominantDosha} />
  return <DietaryProtocolCard recommendations={recommendations} dominantDosha={dominantDosha} />
}
