import { Routes, Route, Navigate } from 'react-router-dom'
import Pronostics from './pages/Pronostics'
import PronosticsAuth from './pages/PronosticsAuth'
import PronosticsAbonnement from './pages/PronosticsAbonnement'

export const API_BASE = 'https://app-fc4c031c-e53f-414b-9432-12308dc16cbd.cleverapps.io/api'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Pronostics />} />
      <Route path="/login" element={<PronosticsAuth />} />
      <Route path="/abonnement" element={<PronosticsAbonnement />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
