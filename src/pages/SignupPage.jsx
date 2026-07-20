import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import HeroSection from '../components/HeroSection.jsx'
import SignupForm from '../components/SignupForm.jsx'
import '../styles/App.css'

export default function SignupPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f9f9e6]">
      <div className="pa-leaf-bg" aria-hidden />
      
      {/* First Screen (Primary Content) */}
      <div className="flex min-h-screen flex-col lg:h-screen lg:min-h-[620px] w-full">
        <Navbar variant="signup" />
        <main className="relative z-[1] flex flex-1 items-center px-4 py-3 sm:px-6 md:px-8 lg:px-10 xl:px-12 lg:pb-8">
          <div className="pa-responsive-shell mx-auto grid w-full items-center gap-5 lg:grid-cols-[1fr_1fr] lg:gap-8 xl:gap-10">
            <HeroSection variant="signupLeft" />
            <div className="flex justify-center lg:justify-end">
              <SignupForm />
            </div>
          </div>
        </main>
      </div>

      {/* Secondary Content */}
      <Footer variant="authSignup" />
    </div>
  )
}
