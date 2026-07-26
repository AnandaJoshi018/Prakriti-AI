import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, ShieldCheck } from 'lucide-react'
import { registerUser, setStoredToken } from '../services/api.js'

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
      setErrorMessage(error.message || 'Unable to create your account right now.')
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

      <p className="mt-4 sm:mt-5 text-center font-sans text-xs sm:text-sm text-[#5f6f55]">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-pa-green-signup hover:underline">
          Login
        </Link>
      </p>
    </div>
  )
}
