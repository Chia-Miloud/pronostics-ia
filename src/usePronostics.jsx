import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : 'https://app-fc4c031c-e53f-414b-9432-12308dc16cbd.cleverapps.io/api';

const pronosticsApi = axios.create({ baseURL: apiBaseUrl });

pronosticsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('pronostics_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const PronosticsContext = createContext(null);

export const PronosticsProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('pronostics_token');
    if (token) {
      pronosticsApi.get('/pronostics/auth/me')
        .then(r => setUser(r.data))
        .catch(() => { localStorage.removeItem('pronostics_token'); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const r = await pronosticsApi.post('/pronostics/auth/login', { email, password });
    localStorage.setItem('pronostics_token', r.data.token);
    setUser(r.data.user);
    return r.data;
  };

  const register = async (email, pseudo, password) => {
    const r = await pronosticsApi.post('/pronostics/auth/register', { email, pseudo, password });
    localStorage.setItem('pronostics_token', r.data.token);
    setUser(r.data.user);
    return r.data;
  };

  const logout = () => {
    localStorage.removeItem('pronostics_token');
    setUser(null);
  };

  const plan = user?.plan || 'free';
  const isPremium = plan === 'ai_premium';
  const isPlus = plan === 'ai_plus' || isPremium;

  return (
    <PronosticsContext.Provider value={{ user, loading, login, register, logout, plan, isPremium, isPlus, pronosticsApi }}>
      {children}
    </PronosticsContext.Provider>
  );
};

export const usePronostics = () => {
  const ctx = useContext(PronosticsContext);
  if (!ctx) throw new Error('usePronostics must be used within PronosticsProvider');
  return ctx;
};

export default PronosticsProvider;
