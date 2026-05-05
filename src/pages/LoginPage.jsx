import LoginForm from '../components/LoginForm.jsx'
import Footer from '../components/Footer.jsx'
import '../styles/App.css'

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-pa-cream-login">
      <div className="pa-login-floral" aria-hidden />
      <div className="relative z-[1] flex flex-1 flex-col items-center justify-center px-4 py-12">
        <LoginForm />
      </div>
      <Footer variant="authLogin" />
    </div>
  )
}
