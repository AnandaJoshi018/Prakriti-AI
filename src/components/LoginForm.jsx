import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AtSign, Lock, Apple } from 'lucide-react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email.trim() && password.trim()) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="relative z-10 mx-auto w-full max-w-[440px] rounded-[30px] border border-black/5 bg-pa-cream-card px-6 py-6 shadow-[0_30px_80px_rgba(0,0,0,0.14)] sm:px-8 sm:py-7 md:px-9 md:py-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pa-green-2 text-white shadow-md sm:h-14 sm:w-14">
          <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 3c-2 4-6 6-6 10a6 6 0 1012 0c0-4-4-6-6-10z" />
          </svg>
        </div>
        <h1 className="mt-4 font-serif text-xl sm:text-2xl font-bold tracking-wide text-pa-green-2">PRAKRITI AI</h1>
        <p className="mt-1 font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-pa-slate">
          THE BOTANICAL ALGORITHM
        </p>
        <p className="mt-4 sm:mt-5 font-serif text-lg sm:text-xl italic text-[#2a2a2a]">Welcome Back</p>
        <p className="mt-1 sm:mt-1.5 font-sans text-xs sm:text-sm text-[#6f6a60]">Realign with your natural essence</p>
      </div>

      <form className="mt-4 sm:mt-5 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block font-sans text-[11px] font-bold uppercase tracking-wide text-[#4d5548]">
            Email Address
          </label>
          <div className="mt-1.5 flex items-center gap-3 rounded-xl bg-pa-input-2 px-4 py-2.5 sm:py-3">
            <AtSign className="h-5 w-5 text-[#9a9a90]" strokeWidth={1.75} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@ayurveda.ai"
              className="w-full bg-transparent font-sans text-sm text-[#2a2a2a] outline-none placeholder:text-[#b5b5aa]"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between gap-2">
            <label className="font-sans text-[11px] font-bold uppercase tracking-wide text-[#4d5548]">
              Password
            </label>
          </div>
          <div className="mt-1.5 flex items-center gap-3 rounded-xl bg-pa-input-2 px-4 py-2.5 sm:py-3">
            <Lock className="h-5 w-5 text-[#9a9a90]" strokeWidth={1.75} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent font-sans text-sm text-[#2a2a2a] outline-none placeholder:text-[#b5b5aa]"
            />
          </div>
          <button type="button" className="mt-1.5 mb-1.5 float-right cursor-pointer font-sans text-[11px] font-bold text-[#a68b3a]">
            FORGOT?
          </button>
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-pa-slate py-2.5 sm:py-3 font-sans text-sm font-semibold text-white shadow-[0_10px_24px_rgba(74,98,138,0.35)] transition hover:bg-[#3f5372] cursor-pointer"
        >
          Login →
        </button>
      </form>

      <div className="relative my-4 sm:my-5">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-black/10" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-pa-cream-card px-3 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b0b0a8]">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-pa-input-2 py-2 sm:py-2.5 font-sans text-sm font-semibold text-[#2a2a2a] transition hover:bg-[#e4e2d4]"
        >
          <span className="font-bold">G</span> Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-pa-input-2 py-2 sm:py-2.5 font-sans text-sm font-semibold text-[#2a2a2a] transition hover:bg-[#e4e2d4]"
        >
          <Apple className="h-4 w-4" strokeWidth={2} />
          Apple
        </button>
      </div>

      <p className="mt-4 sm:mt-5 text-center font-sans text-xs sm:text-sm text-[#5a5a55]">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-bold text-pa-green-2 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  )
}
