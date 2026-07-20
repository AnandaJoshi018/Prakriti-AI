import { Link } from 'react-router-dom'

const linkDef = {
  home: { to: '/', label: 'Home' },
  about: { to: '/#about', label: 'About' },
  features: { to: '/learn-more', label: 'Features' },
  contact: { to: '/#contact', label: 'Contact' },
}

function NavUnderline({ show }) {
  if (!show) return null
  return (
    <span
      className="pointer-events-none absolute -bottom-2 left-1/2 h-[2px] w-[calc(100%+10px)] max-w-[120%] -translate-x-1/2 bg-pa-green-2"
      aria-hidden
    />
  )
}

export default function Navbar({
  variant = 'marketing',
  active = 'home',
  linkOrder = ['home', 'about', 'features', 'contact'],
  signupVariant = 'slate',
  loginItalic = false,
}) {
  if (variant === 'signup') {
    return (
      <header className="relative z-10 w-full px-5 py-5 sm:px-6 md:px-8 lg:px-10 xl:px-14">
        <div className="pa-responsive-shell mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="font-sans text-[0.95rem] font-bold tracking-[0.12em] text-pa-green-signup"
          >
            PRAKRITI AI
          </Link>
          <Link
            to="/"
            className="font-sans text-sm font-medium text-[#4a5a45] transition hover:text-pa-green-signup"
          >
            ← Back to Home
          </Link>
        </div>
      </header>
    )
  }

  if (variant === 'dashboard') {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 pb-5">
        <nav className="flex flex-wrap items-center gap-8 font-sans text-sm text-[#5a6a5a]">
          {linkOrder.map((key) => {
            const item = linkDef[key]
            const isActive = active === key
            return (
              <Link
                key={key}
                to={item.to}
                className={`relative font-medium transition hover:text-pa-green-2 ${
                  isActive ? 'text-pa-green-2' : ''
                }`}
              >
                {item.label}
                <NavUnderline show={isActive} />
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center gap-5 font-sans">
          <Link
            to="/signup"
            className={`rounded-full px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 ${
              signupVariant === 'green'
                ? 'bg-pa-green-3'
                : 'bg-[#5d7293]'
            }`}
          >
            Signup
          </Link>
          <Link
            to="/login"
            className={`text-sm font-semibold text-pa-green-2 transition hover:opacity-80 ${
              loginItalic ? 'font-serif italic' : ''
            }`}
          >
            Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <header className="relative z-10 w-full px-5 py-5 sm:px-6 md:px-8 lg:px-10 xl:px-14">
      <div className="pa-responsive-shell mx-auto flex flex-wrap items-center justify-between gap-4 sm:gap-6">
        <Link
          to="/"
          className="font-serif text-lg font-bold tracking-[0.08em] text-pa-green md:text-xl"
        >
          PRAKRITI AI
        </Link>
        <nav className="mx-auto flex w-full flex-1 flex-wrap items-center justify-center gap-x-6 gap-y-2 font-sans text-sm text-[#5a6a5a] sm:gap-x-9">
          {linkOrder.map((key) => {
            const item = linkDef[key]
            const isActive = active === key
            return (
              <Link
                key={key}
                to={item.to}
                className={`relative font-medium transition hover:text-pa-green-2 ${
                  isActive ? 'text-pa-green-2' : ''
                }`}
              >
                {item.label}
                <NavUnderline show={isActive} />
              </Link>
            )
          })}
        </nav>
        <div className="ml-auto flex items-center gap-5 font-sans md:ml-0">
          <Link
            to="/login"
            className="text-sm font-semibold text-pa-green-2 transition hover:opacity-80"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-pa-slate px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#435a7a]"
          >
            Signup
          </Link>
        </div>
      </div>
    </header>
  )
}
