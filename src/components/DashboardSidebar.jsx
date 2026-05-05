import { Link } from 'react-router-dom'
import { LayoutGrid, PlusSquare, BarChart3, Leaf, Sparkles } from 'lucide-react'

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid, key: 'dashboard' },
  { to: '/dashboard', label: 'Symptoms', icon: PlusSquare, key: 'symptoms' },
  { to: '/result', label: 'Dosha Analysis', icon: BarChart3, key: 'result' },
  { to: '/recommendation', label: 'Recommendations', icon: Leaf, key: 'recommendation' },
]

export default function DashboardSidebar({ active = 'dashboard', consultVariant = 'gold' }) {
  const resolvedActive = active

  return (
    <aside className="flex w-full flex-col border-b border-black/5 bg-pa-sidebar px-5 py-7 lg:w-[min(100%,280px)] lg:shrink-0 lg:border-b-0 lg:border-r">
      <Link
        to="/"
        className="font-sans text-[0.95rem] font-bold tracking-[0.12em] text-pa-green-2"
      >
        PRAKRITI AI
      </Link>
      <div className="mt-8">
        <p className="font-serif text-lg italic text-pa-green-2">Welcome Back</p>
        <p className="mt-1 font-sans text-xs text-[#7a8a78]">Your Ayurvedic Journey</p>
      </div>
      <nav className="mt-8 flex flex-1 flex-col gap-2 font-sans text-sm">
        {items.map((it) => {
          const Icon = it.icon
          const isActive = resolvedActive === it.key
          return (
            <Link
              key={it.key}
              to={it.to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-semibold transition ${
                isActive ? 'bg-[#e1e8d2] text-pa-green-2' : 'text-[#6f7f6f] hover:bg-black/[0.03]'
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
              {it.label}
            </Link>
          )
        })}
      </nav>
      <button
        type="button"
        className={`mt-8 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-sans text-sm font-semibold text-white shadow-md transition hover:opacity-95 ${
          consultVariant === 'slate' ? 'bg-pa-slate-4' : 'bg-pa-brown-2'
        }`}
      >
        {consultVariant === 'slate' ? (
          <>
            <Sparkles className="h-4 w-4" />+ AI Consult
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            AI Consult
          </>
        )}
      </button>
    </aside>
  )
}
