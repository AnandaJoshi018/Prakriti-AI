import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, ShieldCheck, Apple } from 'lucide-react'
import { registerUser, setStoredToken } from '../services/api.js'

/**
 * Extracts a human-readable string from a backend API error response.
 *
 * FastAPI can return detail as:
 *   - A plain string:  { "detail": "Email already registered" }
 *   - A Pydantic list: { "detail": [{ "loc": [...], "msg": "...", "type": "..." }, ...] }
 *
 * The Error thrown by registerUser() already calls `new Error(errorBody.detail || ...)`
 * which means:
 *   - If detail is a string  → error.message is the string  (fine)
 *   - If detail is an array  → error.message is "[object Object]" (broken)
 *
 * We catch both cases here.
 */
function extractErrorMessage(error) {
  const raw = error?.message ?? ''

  // Already a clean string (not an object coercion)
  if (raw && raw !== '[object Object]') {
    return raw
  }

  // Fallback: inspect the raw response data attached by the API helper (not present here,
  // but guard against future changes).
  return 'Unable to create your account right now. Please try again.'
}

export default function SignupForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage('Please fill out all the fields before continuing.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please try again.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await registerUser({ full_name: name.trim(), email: email.trim(), password })
      setStoredToken(response.access_token)
      navigate('/dashboard')
    } catch (error) {
      setErrorMessage(extractErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-[430px] rounded-[28px] border border-black/5 bg-white px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.07)] sm:px-6 sm:py-5 md:px-7 md:py-6 lg:max-w-[420px]">
      <div className="text-center">
        <h2 className="font-serif text-[1.25rem] font-semibold text-pa-green-signup sm:text-[1.45rem]">Create Account</h2>
        <p className="mt-1 font-sans text-xs sm:text-sm text-[#7a8578]">Enter your details to start your profile</p>
      </div>

      <form className="mt-4 space-y-2.5 sm:space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="block font-sans text-[11px] font-bold uppercase tracking-wide text-[#4d5548]">
            Full Name
          </label>
          <div className="mt-1.5 flex items-center gap-3 rounded-xl bg-pa-signup-input px-3.5 py-2 sm:py-2.5">
            <User className="h-4 w-4 text-[#8a9585]" strokeWidth={1.75} />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Arjun Sharma"
              className="w-full bg-transparent font-sans text-sm text-[#2a2a2a] outline-none placeholder:text-[#b0b8a8]"
            />
          </div>
        </div>
        <div>
          <label className="block font-sans text-[11px] font-bold uppercase tracking-wide text-[#4d5548]">
            Email
          </label>
          <div className="mt-1.5 flex items-center gap-3 rounded-xl bg-pa-signup-input px-3.5 py-2 sm:py-2.5">
            <Mail className="h-4 w-4 text-[#8a9585]" strokeWidth={1.75} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="arjun@example.com"
              className="w-full bg-transparent font-sans text-sm text-[#2a2a2a] outline-none placeholder:text-[#b0b8a8]"
            />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          <div>
            <label className="block font-sans text-[11px] font-bold uppercase tracking-wide text-[#4d5548]">
              Password
            </label>
            <div className="mt-1.5 flex items-center gap-3 rounded-xl bg-pa-signup-input px-3.5 py-2 sm:py-2.5">
              <Lock className="h-4 w-4 text-[#8a9585]" strokeWidth={1.75} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent font-sans text-sm outline-none placeholder:text-[#b0b8a8]"
              />
            </div>
          </div>
          <div>
            <label className="block font-sans text-[11px] font-bold uppercase tracking-wide text-[#4d5548]">
              Confirm Password
            </label>
            <div className="mt-1.5 flex items-center gap-3 rounded-xl bg-pa-signup-input px-3.5 py-2 sm:py-2.5">
              <ShieldCheck className="h-4 w-4 text-[#8a9585]" strokeWidth={1.75} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent font-sans text-sm outline-none placeholder:text-[#b0b8a8]"
              />
            </div>
          </div>
        </div>
        {errorMessage ? (
          <p className="font-sans text-xs font-semibold text-[#a3522b]">{errorMessage}</p>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 w-full rounded-xl bg-[#46608c] py-2.5 sm:py-3 font-sans text-sm font-semibold text-white shadow-md transition hover:bg-[#3d5478] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Creating account...' : 'Create Account →'}
        </button>
      </form>

      {/* Social sign-up — styled to match LoginForm's "Or continue with" section */}
      <div className="relative my-4 sm:my-5">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-black/10" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b0b0a8]">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Google — no OAuth configured; button is UI-ready for future integration */}
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-pa-signup-input py-2 sm:py-2.5 font-sans text-sm font-semibold text-[#2a2a2a] transition hover:bg-[#e4e2d4]"
          title="Google sign-in (OAuth not yet configured)"
        >
          {/* Official Google G logo SVG */}
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </button>

        {/* Apple — no OAuth configured; button is UI-ready for future integration */}
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-pa-signup-input py-2 sm:py-2.5 font-sans text-sm font-semibold text-[#2a2a2a] transition hover:bg-[#e4e2d4]"
          title="Apple sign-in (OAuth not yet configured)"
        >
          <Apple className="h-4 w-4" strokeWidth={2} />
          Apple
        </button>
      </div>

      <p className="mt-4 sm:mt-5 text-center font-sans text-xs sm:text-sm text-[#5f6f55]">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-pa-green-signup hover:underline">
          Login
        </Link>
      </p>
    </div>
  )
}
