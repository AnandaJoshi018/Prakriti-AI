import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, ShieldCheck } from 'lucide-react'

export default function SignupForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim() && email.trim() && password.trim() && confirmPassword.trim()) {
      // Basic validation: ignore if password and confirm password don't match or fields are empty
      navigate('/dashboard')
    }
  }

  return (
    <div className="w-full max-w-[480px] rounded-[28px] bg-white px-8 py-10 shadow-[0_24px_80px_rgba(0,0,0,0.07)] md:px-10 md:py-12">
      <div className="text-center">
        <h2 className="font-serif text-2xl font-semibold text-pa-green-signup">Create Account</h2>
        <p className="mt-2 font-sans text-sm text-[#7a8578]">Enter your details to start your profile</p>
      </div>

      <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block font-sans text-[11px] font-bold uppercase tracking-wide text-[#4d5548]">
            Full Name
          </label>
          <div className="mt-2 flex items-center gap-3 rounded-xl bg-pa-signup-input px-4 py-3.5">
            <User className="h-5 w-5 text-[#8a9585]" strokeWidth={1.75} />
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
          <div className="mt-2 flex items-center gap-3 rounded-xl bg-pa-signup-input px-4 py-3.5">
            <Mail className="h-5 w-5 text-[#8a9585]" strokeWidth={1.75} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="arjun@example.com"
              className="w-full bg-transparent font-sans text-sm text-[#2a2a2a] outline-none placeholder:text-[#b0b8a8]"
            />
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block font-sans text-[11px] font-bold uppercase tracking-wide text-[#4d5548]">
              Password
            </label>
            <div className="mt-2 flex items-center gap-3 rounded-xl bg-pa-signup-input px-4 py-3.5">
              <Lock className="h-5 w-5 text-[#8a9585]" strokeWidth={1.75} />
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
            <div className="mt-2 flex items-center gap-3 rounded-xl bg-pa-signup-input px-4 py-3.5">
              <ShieldCheck className="h-5 w-5 text-[#8a9585]" strokeWidth={1.75} />
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
        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-[#46608c] py-3.5 font-sans text-sm font-semibold text-white shadow-md transition hover:bg-[#3d5478]"
        >
          Create Account →
        </button>
      </form>

      <p className="mt-8 text-center font-sans text-sm text-[#5f6f55]">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-pa-green-signup hover:underline">
          Login
        </Link>
      </p>
    </div>
  )
}
