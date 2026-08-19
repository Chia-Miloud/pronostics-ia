import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'https://app-7a3df0bb-9561-4735-b916-cfffb7487eba.cleverapps.io/api';

// Générer ou récupérer un session_id persistant
function getSessionId() {
  let sid = sessionStorage.getItem('cdm_session');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem('cdm_session', sid);
  }
  return sid;
}

// Hook de tracking automatique des pages vues
export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('pronostics_token');
    const sessionId = getSessionId();
    const page = location.pathname + (location.search || '');
    const referrer = document.referrer || '';

    // Tracker la page vue (silencieux, ne bloque pas l'UI)
    axios.post(`${API_BASE}/analytics/track`, {
      session_id: sessionId,
      page,
      referrer,
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      timeout: 5000,
    }).catch(() => {}); // Silencieux en cas d'erreur

  }, [location.pathname]);
}

export default useAnalytics;
