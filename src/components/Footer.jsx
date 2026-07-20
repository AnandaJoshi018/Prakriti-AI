import { Link } from 'react-router-dom'

const links = [
  { to: '/#privacy', label: 'Privacy Policy' },
  { to: '/#terms', label: 'Terms of Service' },
  { to: '/#ayurveda', label: 'Ayurvedic Principles' },
  { to: '/#ethics', label: 'AI Ethics' },
]

const linksAlt = [
  { to: '/#privacy', label: 'Privacy Policy' },
  { to: '/#terms', label: 'Terms of Service' },
  { to: '/#ethics', label: 'AI Ethics' },
]

export default function Footer({ variant = 'marketing' }) {
  if (variant === 'authLogin') {
    return (
      <footer className="relative z-10 mt-auto px-6 pb-10 pt-6 text-center font-sans">
        <div className="mx-auto flex max-w-xl flex-wrap items-center justify-center gap-x-10 gap-y-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5f6b55]">
          {linksAlt.map((l) => (
            <Link key={l.to} to={l.to} className="transition hover:text-pa-green-2">
              {l.label}
            </Link>
          ))}
        </div>
        <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.12em] text-[#a0a89a]">
          © 2024 PRAKRITI AI - THE BOTANICAL ALGORITHM
        </p>
      </footer>
    )
  }

  if (variant === 'authSignup') {
    return (
      <footer className="relative z-10 mt-auto border-t border-black/10 px-4 py-3 sm:px-6 md:px-8 lg:px-10 xl:px-12 overflow-hidden">
        <div className="pa-footer-leaf" aria-hidden />
        <div className="relative mx-auto flex max-w-[1320px] flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-4">
          <div>
            <p className="font-sans text-sm font-bold tracking-[0.12em] text-pa-green-signup">
              PRAKRITI AI
            </p>
            <p className="mt-1 font-sans text-[11px] text-[#8a9585]">
              © 2024 PRAKRITI AI - The Botanical Algorithm
            </p>
          </div>
          <div className="flex flex-wrap gap-4 font-sans text-[11px] text-[#7a8578]">
            {linksAlt.map((l) => (
              <Link key={l.to} to={l.to} className="transition hover:text-pa-green-signup">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    )
  }

  if (variant === 'appShell') {
    return (
      <footer className="mt-auto border-t border-black/10 px-6 py-8 md:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 text-center font-sans text-xs text-[#7a8578] md:flex-row md:flex-wrap md:justify-between md:text-left">
          <p className="font-bold tracking-[0.1em] text-pa-green-2">PRAKRITI AI</p>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="transition hover:text-pa-green-2">
                {l.label}
              </Link>
            ))}
          </nav>
          <p className="text-[11px]">© 2024 PRAKRITI AI - The Botanical Algorithm</p>
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t border-black/10 px-6 py-10 md:px-10 lg:px-14">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-serif text-lg font-bold tracking-[0.08em] text-pa-green">PRAKRITI AI</p>
          <p className="mt-3 max-w-sm font-sans text-[11px] leading-relaxed text-[#8a9585]">
            © 2024 PRAKRITI AI - THE BOTANICAL ALGORITHM
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-3 font-sans text-sm text-[#7a8578]">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="transition hover:text-pa-green-2">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
