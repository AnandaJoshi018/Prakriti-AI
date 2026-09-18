import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AtSign, Lock, Apple } from 'lucide-react'
import { loginUser, setStoredToken } from '../services/api.js'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please complete both fields before continuing.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await loginUser({ email: email.trim(), password })
      setStoredToken(response.access_token)
      navigate('/dashboard')
    } catch (error) {
      setErrorMessage(error.message || 'Unable to sign in right now.')
    } finally {
      setIsSubmitting(false)
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
        {errorMessage ? (
          <p className="font-sans text-xs font-semibold text-[#a3522b]">{errorMessage}</p>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-pa-slate py-2.5 sm:py-3 font-sans text-sm font-semibold text-white shadow-[0_10px_24px_rgba(74,98,138,0.35)] transition hover:bg-[#3f5372] cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Signing in...' : 'Login →'}
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
          {/* Official Google G logo SVG */}
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
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
