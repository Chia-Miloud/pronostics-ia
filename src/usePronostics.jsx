import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const apiBaseUrl = 'https://app-7a3df0bb-9561-4735-b916-cfffb7487eba.cleverapps.io/api';

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
      pronosticsApi.get('/auth/me')
        .then(r => setUser(r.data.user || r.data))
        .catch(() => { localStorage.removeItem('pronostics_token'); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const r = await pronosticsApi.post('/auth/login', { email, password });
    localStorage.setItem('pronostics_token', r.data.token);
    setUser(r.data.user);
    return r.data;
  };

  const register = async (email, pseudo, password, extra = {}) => {
    const r = await pronosticsApi.post('/auth/register', { email, pseudo, password, ...extra });
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
