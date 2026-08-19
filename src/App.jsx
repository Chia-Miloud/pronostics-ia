import { Routes, Route, Navigate } from 'react-router-dom'
import { useAnalytics } from './useAnalytics'
import PronosticsProvider from './usePronostics'
import Pronostics from './pages/Pronostics'
import PronosticsV2 from './pages/PronosticsV2'
import { CompetitionsHome, CompetitionPage, MatchPage } from './pages/PronosticsPostCDM'
import PronosticsAuth from './pages/PronosticsAuth'
import PronosticsAbonnement from './pages/PronosticsAbonnement'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import { BlogList, BlogArticle } from './pages/Blog'
import { RGPD, CGV, Contact } from './pages/Legal'

export const API_BASE = 'https://app-7a3df0bb-9561-4735-b916-cfffb7487eba.cleverapps.io/api'

function AnalyticsTracker() {
  useAnalytics();
  return null;
}

export default function App() {
  return (
    <PronosticsProvider>
      <AnalyticsTracker />
      <Routes>
        <Route path="/" element={<CompetitionsHome />} />
        <Route path="/classic" element={<Pronostics />} />
        <Route path="/v2" element={<PronosticsV2 />} />
        <Route path="/competitions" element={<CompetitionsHome />} />
        <Route path="/competition/:compId" element={<CompetitionPage />} />
        <Route path="/match/:matchId" element={<MatchPage />} />
        <Route path="/login" element={<PronosticsAuth />} />
        <Route path="/abonnement" element={<PronosticsAbonnement />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogArticle />} />
        <Route path="/rgpd" element={<RGPD />} />
        <Route path="/cgv" element={<CGV />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PronosticsProvider>
  )
}
