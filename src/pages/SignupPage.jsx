import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import HeroSection from '../components/HeroSection.jsx'
import SignupForm from '../components/SignupForm.jsx'
import '../styles/App.css'

export default function SignupPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#f9f9e6]">
      <div className="pa-leaf-bg" aria-hidden />
      <Navbar variant="signup" />
      <main className="relative z-[1] flex-1 px-6 py-10 md:px-10 lg:px-14">
        <div className="mx-auto grid max-w-[1320px] items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <HeroSection variant="signupLeft" />
          <div className="flex justify-center lg:justify-end">
            <SignupForm />
          </div>
        </div>
      </main>
      <Footer variant="authSignup" />
    </div>
  )
}
