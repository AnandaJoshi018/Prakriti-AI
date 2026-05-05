import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

function DominantCard() {
  return (
    <article className="relative overflow-hidden rounded-[28px] bg-pa-sage-2 p-8 shadow-sm md:p-10">
      <div className="pa-dominant-leaf" aria-hidden />
      <div className="relative inline-flex items-center gap-2 rounded-full bg-pa-green-2 px-3 py-1 text-white">
        <Sparkles className="h-3.5 w-3.5" />
        <span className="font-sans text-[10px] font-bold uppercase tracking-wide">Dominant Energy</span>
      </div>
      <h2 className="relative mt-6 font-serif text-[2.75rem] font-bold leading-none text-pa-green-2 md:text-[3.25rem]">
        Pitta-Vata
      </h2>
      <p className="relative mt-4 max-w-md font-sans text-sm leading-relaxed text-[#4f5f4f]">
        You possess the fiery intellect of Pitta combined with the creative agility of Vata.
      </p>
      <Link
        to="/recommendation"
        className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-pa-slate-2 px-6 py-2.5 font-sans text-sm font-semibold text-white shadow-sm transition hover:bg-[#3f5578]"
      >
        View Recommendations <span aria-hidden>→</span>
      </Link>
    </article>
  )
}

function BalanceCard() {
  const rows = [
    { label: 'Pitta', value: 55, bar: 'bg-pa-green-2', track: 'bg-emerald-100' },
    { label: 'Vata', value: 30, bar: 'bg-pa-slate-2', track: 'bg-slate-200' },
    { label: 'Kapha', value: 15, bar: 'bg-[#8a6a1f]', track: 'bg-amber-100/80' },
  ]
  return (
    <article className="rounded-[28px] bg-[#eef2e4] p-8 shadow-sm md:p-10">
      <p className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-pa-slate-2">
        Tridosha Balance
      </p>
      <div className="mt-8 space-y-6">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-serif text-lg text-pa-green-2">{r.label}</span>
              <span className="font-serif text-lg italic text-pa-green-2">{r.value}%</span>
            </div>
            <div className={`mt-2 h-2.5 w-full overflow-hidden rounded-full ${r.track}`}>
              <div className={`h-full rounded-full ${r.bar}`} style={{ width: `${r.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

function SeasonalCard() {
  return (
    <article className="flex flex-col gap-6 rounded-[28px] bg-[#e4e4cc] p-8 shadow-sm md:flex-row md:items-center md:justify-between md:p-10">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#a67c3a] text-white shadow-inner">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-semibold text-[#5c4a22]">AI Seasonal Insight</h3>
          <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-[#5a5538]">
            Grishma (Summer) increases Pitta. Prioritize lunar practices and cooling botanicals during peak
            daylight hours to preserve Ojas.
          </p>
        </div>
      </div>
      <button
        type="button"
        className="shrink-0 self-start rounded-full border-2 border-[#6b5420] px-6 py-2 font-sans text-sm font-semibold text-[#5c4a22] transition hover:bg-white/40 md:self-center"
      >
        Deep Dive
      </button>
    </article>
  )
}

export default function ResultCard({ variant = 'dominant' }) {
  if (variant === 'balance') return <BalanceCard />
  if (variant === 'seasonal') return <SeasonalCard />
  return <DominantCard />
}
