import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import HomePage from './pages/HomePage.jsx'
import LearnMorePage from './pages/LearnMorePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ResultPage from './pages/ResultPage.jsx'
import RecommendationPage from './pages/RecommendationPage.jsx'
import YogaRoutinePage from './pages/YogaRoutinePage.jsx'
import LearnAyurvedaPage from './pages/LearnAyurvedaPage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import './styles/App.css'

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn-more" element={<LearnMorePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/recommendation" element={<RecommendationPage />} />
          <Route path="/yoga-routine" element={<YogaRoutinePage />} />
          <Route path="/learn-ayurveda" element={<LearnAyurvedaPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}
