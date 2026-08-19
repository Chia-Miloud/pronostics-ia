import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePronostics } from '../usePronostics';

const ADMIN_EMAILS = ['miloudchia@gmail.com', 'miloudc@hotmail.com'];

const PLAN_COLORS = {
  free: '#94a3b8',
  ai_plus: '#fbbf24',
  ai_premium: '#ff3b3b',
};
const PLAN_LABELS = {
  free: 'FREE',
  ai_plus: '🚀 AI PLUS',
  ai_premium: '🧠 AI PREMIUM',
};

export default function NavMenu({ backLabel = '← Retour', backPath = '/', centerLabel = null }) {
  const { user, plan, logout } = usePronostics();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isAdmin = ADMIN_EMAILS.includes(user?.email);
  const planColor = PLAN_COLORS[plan] || '#94a3b8';
  const planLabel = PLAN_LABELS[plan] || 'FREE';

  const menuItems = [
    { icon: '📊', label: 'Tableau de bord', path: '/dashboard' },
    { icon: '👤', label: 'Mon compte', path: '/dashboard' },
    { icon: '💳', label: 'Mes abonnements', path: '/dashboard' },
    ...(isAdmin ? [{ icon: '🔐', label: 'Panel Admin', path: '/admin', admin: true }] : []),
    { icon: '📝', label: 'Blog', path: '/blog' },
    { icon: '⚽', label: 'Pronostics', path: '/' },
    { separator: true },
    { icon: '🚪', label: 'Déconnexion', action: () => { logout(); navigate('/'); }, danger: true },
  ];

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(6,8,15,0.95)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      padding: '14px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Gauche */}
      <button onClick={() => navigate(backPath)} style={{
        background: 'none', border: 'none', color: '#94a3b8',
        cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        {backLabel}
      </button>

      {/* Centre */}
      {centerLabel && (
        <div style={{ fontSize: 12, fontWeight: 900, color: '#ffd700', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          {centerLabel}
        </div>
      )}

      {/* Droite — menu utilisateur */}
      {user ? (
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button onClick={() => setOpen(!open)} style={{
            background: `${planColor}15`,
            border: `1px solid ${planColor}40`,
            color: planColor, borderRadius: 20, padding: '6px 14px',
            fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {planLabel}
            <span style={{
              fontSize: 9, opacity: 0.7,
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s', display: 'inline-block',
            }}>▼</span>
          </button>

          {open && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: '#141820', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14, padding: 6, minWidth: 210,
              boxShadow: '0 8px 40px rgba(0,0,0,0.7)', zIndex: 1000,
            }}>
              {/* Profil */}
              <div style={{ padding: '10px 14px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9' }}>
                  {user.prenom || user.pseudo || user.email.split('@')[0]}
                </div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{user.email}</div>
                <div style={{ marginTop: 6, display: 'inline-block', background: `${planColor}20`, color: planColor, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>
                  {planLabel}
                </div>
              </div>

              {menuItems.map((item, i) => {
                if (item.separator) return (
                  <div key={i} style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
                );
                return (
                  <button key={i}
                    onClick={() => { setOpen(false); item.action ? item.action() : navigate(item.path); }}
                    style={{
                      width: '100%', background: item.admin ? 'rgba(255,59,59,0.08)' : 'transparent',
                      border: 'none',
                      color: item.danger ? '#ff6b6b' : item.admin ? '#ff3b3b' : '#94a3b8',
                      borderRadius: 10, padding: '10px 14px', fontSize: 13,
                      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: 10,
                      fontWeight: item.admin || item.danger ? 700 : 400,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = item.admin ? 'rgba(255,59,59,0.08)' : 'transparent'}
                  >
                    <span>{item.icon}</span> {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <button onClick={() => navigate('/login')} style={{
          background: 'linear-gradient(135deg, #ff3b3b, #c62828)',
          color: '#fff', border: 'none', borderRadius: 20, padding: '7px 16px',
          fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Se connecter
        </button>
      )}
    </div>
  );
}
