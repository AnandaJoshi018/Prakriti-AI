import { Link } from 'react-router-dom'
import { LayoutGrid, PlusSquare, BarChart3, Leaf, Sparkles, X, History } from 'lucide-react'

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid, key: 'dashboard' },
  { to: '/dashboard', label: 'Symptoms', icon: PlusSquare, key: 'symptoms' },
  { to: '/result', label: 'Dosha Analysis', icon: BarChart3, key: 'result' },
  { to: '/recommendation', label: 'Recommendations', icon: Leaf, key: 'recommendation' },
  { to: '/history', label: 'History', icon: History, key: 'history' },
]

export default function DashboardSidebar({ active = 'dashboard', consultVariant = 'gold', isOpen = false, onClose }) {
  const resolvedActive = active

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-black/5 bg-pa-sidebar px-5 py-5 transition-transform duration-300 md:translate-x-0 md:static md:w-[80px] md:h-screen md:sticky md:top-0 md:overflow-y-auto lg:w-[250px] xl:w-[280px] ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="font-sans text-[0.95rem] font-bold tracking-[0.12em] text-pa-green-2 md:hidden lg:block"
          >
            PRAKRITI AI
          </Link>
          {/* Tablet Logo - Leaf Icon */}
          <Link
            to="/"
            className="mx-auto hidden md:block lg:hidden text-pa-green-2"
          >
            <Leaf className="h-6 w-6" strokeWidth={2} />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-black/[0.03] md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-[#5a6a5a]" />
          </button>
        </div>

        <div className="mt-5 lg:mt-8 md:text-center lg:text-left">
          <p className="font-serif text-lg italic text-pa-green-2 md:hidden lg:block">Welcome Back</p>
          <p className="mt-1 font-sans text-xs text-[#7a8a78] md:hidden lg:block">Your Ayurvedic Journey</p>
          {/* Tablet Divider */}
          <div className="hidden md:block lg:hidden h-px bg-black/5 w-full my-2" />
        </div>

        <nav className="mt-5 lg:mt-8 flex flex-1 flex-col gap-1.5 lg:gap-2 font-sans text-sm">
          {items.map((it) => {
            const Icon = it.icon
            const isActive = resolvedActive === it.key
            return (
              <Link
                key={it.key}
                to={it.to}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-semibold transition md:justify-center lg:justify-start ${
                  isActive ? 'bg-[#e1e8d2] text-pa-green-2' : 'text-[#6f7f6f] hover:bg-black/[0.03]'
                }`}
                title={it.label}
              >
                <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                <span className="md:hidden lg:block">{it.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto">
          {/* Desktop/Mobile button */}
          <button
            type="button"
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-sans text-sm font-semibold text-white shadow-md transition hover:opacity-95 md:hidden lg:flex ${
              consultVariant === 'slate' ? 'bg-pa-slate-4' : 'bg-pa-brown-2'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Consult</span>
          </button>

          {/* Tablet collapsed button */}
          <button
            type="button"
            className={`mx-auto hidden md:flex lg:hidden h-11 w-11 items-center justify-center rounded-xl text-white shadow-md transition hover:opacity-95 ${
              consultVariant === 'slate' ? 'bg-pa-slate-4' : 'bg-pa-brown-2'
            }`}
            title="AI Consult"
          >
            <Sparkles className="h-5 w-5" />
          </button>
        </div>
      </aside>
    </>
  )
}
