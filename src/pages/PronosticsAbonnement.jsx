import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePronostics } from '../usePronostics';
import Logo from '../Logo';

const plans = [
  {
    id: 'free', label: 'Free', emoji: '🆓', price: '0€', period: '/mois',
    border: 'rgba(19,34,24,0.15)', bg: '#fbf7ec', btnBg: '#ede8dc', btnColor: '#132218',
    features: [
      { text: '3 pronostics IA par jour', ok: true },
      { text: 'Favori du match', ok: true },
      { text: 'Score de confiance', ok: true },
      { text: 'Classement public', ok: true },
      { text: 'Analyse IA détaillée', ok: false },
      { text: 'Score exact probable', ok: false },
      { text: 'TrapScore', ok: false },
      { text: 'Live IA Coach', ok: false },
    ],
  },
  {
    id: 'ai_plus', label: 'AI Plus', emoji: '🚀', price: '4,99€', period: '/mois',
    border: '#2f8553', bg: '#e4efe5', btnBg: '#2f8553', btnColor: '#fff',
    badge: 'Populaire', badgeBg: '#2f8553',
    features: [
      { text: 'Pronostics illimités', ok: true },
      { text: 'Analyse IA détaillée', ok: true },
      { text: 'Score exact probable', ok: true },
      { text: 'TrapScore (risque de surprise)', ok: true },
      { text: 'Alertes avant les matchs', ok: true },
      { text: 'Sans publicité', ok: true },
      { text: 'Live IA Coach', ok: false },
      { text: 'Simulations de compétition', ok: false },
    ],
  },
  {
    id: 'ai_premium', label: 'AI Premium', emoji: '🧠', price: '9,99€', period: '/mois',
    border: '#ff7a3a', bg: '#fff0e4', btnBg: '#ff7a3a', btnColor: '#fff',
    badge: 'Meilleur', badgeBg: '#ff7a3a',
    features: [
      { text: 'Tout AI Plus inclus', ok: true },
      { text: '🔴 Live IA Coach', ok: true, highlight: true },
      { text: 'Questions contextuelles en direct', ok: true, highlight: true },
      { text: 'Score évolutif en temps réel', ok: true, highlight: true },
      { text: 'Simulations de compétition', ok: true },
      { text: 'Analyse blessures et suspensions', ok: true },
      { text: 'Badge Premium 👑', ok: true },
      { text: 'Accès anticipé aux nouveautés', ok: true },
    ],
  },
];

export default function PronosticsAbonnement() {
  const { user, plan: currentPlan, pronosticsApi } = usePronostics();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const handleSubscribe = async (planId) => {
    if (!user) { navigate('/pronostics/login'); return; }
    if (planId === 'free') { navigate('/pronostics'); return; }
    setLoading(planId);
    setError(null);
    try {
      const r = await pronosticsApi.post('/pronostics/subscribe', { plan: planId });
      if (r.data.checkout_url) window.location.href = r.data.checkout_url;
    } catch {
      setError('Erreur lors de la création de l\'abonnement. Réessayez.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f6f1e4', fontFamily: "'Inter', system-ui, sans-serif", color: '#132218' }}>

      {/* NAV */}
      <nav style={{
        background: 'rgba(246,241,228,0.92)', backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(19,34,24,0.10)',
        padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}><Logo size="sm" /></Link>
        <span style={{ color: 'rgba(19,34,24,0.22)', fontSize: 16 }}>|</span>
        <Link to="/pronostics" style={{ fontSize: 14, color: '#5a6b60', textDecoration: 'none', fontWeight: 600 }}>← Prédictions IA</Link>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 12 }}>
            Choisissez votre plan
          </h1>
          <p style={{ fontSize: 16, color: '#5a6b60' }}>Analysez chaque match avec l'IA. Commencez gratuitement.</p>
        </div>

        {error && (
          <div style={{ background: '#f6e1e5', border: '1px solid #c8102e', color: '#c8102e', borderRadius: 12, padding: '14px 18px', marginBottom: 32, textAlign: 'center', fontSize: 14 }}>
            {error}
          </div>
        )}

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 48 }}>
          {plans.map(p => {
            const isCurrent = currentPlan === p.id;
            return (
              <div key={p.id} style={{
                position: 'relative', background: p.bg,
                border: `2px solid ${isCurrent ? '#132218' : p.border}`,
                borderRadius: 20, padding: '28px 24px',
                display: 'flex', flexDirection: 'column',
                boxShadow: isCurrent ? '0 8px 24px -8px rgba(19,34,24,0.20)' : '0 2px 8px -2px rgba(19,34,24,0.08)'
              }}>
                {p.badge && (
                  <div style={{
                    position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                    background: p.badgeBg, color: '#fff', borderRadius: 20, padding: '3px 14px',
                    fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em'
                  }}>{p.badge}</div>
                )}
                {isCurrent && (
                  <div style={{
                    position: 'absolute', top: -13, right: 16,
                    background: '#132218', color: '#fff', borderRadius: 20, padding: '3px 14px',
                    fontSize: 11, fontWeight: 800
                  }}>Plan actuel</div>
                )}

                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{p.emoji} <strong style={{ fontSize: 20 }}>{p.label}</strong></div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: 32, fontWeight: 900 }}>{p.price}</span>
                    <span style={{ fontSize: 14, color: '#5a6b60' }}>{p.period}</span>
                  </div>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {p.features.map((f, i) => (
                    <li key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13,
                      color: f.ok ? (f.highlight ? '#132218' : '#2d4438') : '#8a9288',
                      fontWeight: f.highlight ? 700 : 400
                    }}>
                      <span style={{ flexShrink: 0, color: f.ok ? '#2f8553' : '#c8ddce', fontWeight: 700 }}>{f.ok ? '✓' : '✗'}</span>
                      {f.text}
                    </li>
                  ))}
                </ul>

                <button onClick={() => handleSubscribe(p.id)} disabled={loading === p.id || isCurrent} style={{
                  width: '100%', background: isCurrent ? '#ede8dc' : p.btnBg, color: isCurrent ? '#8a9288' : p.btnColor,
                  border: 'none', borderRadius: 12, padding: '13px 0', fontWeight: 800, fontSize: 14,
                  cursor: (loading === p.id || isCurrent) ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                  transition: 'opacity 0.2s'
                }}>
                  {loading === p.id ? '⏳...' : isCurrent ? 'Plan actuel' : p.id === 'free' ? 'Commencer gratuitement' : `Choisir ${p.label}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Feature highlight */}
        <div style={{
          background: 'linear-gradient(135deg, #e4efe5, #fff0e4)',
          border: '1.5px solid rgba(255,122,58,0.3)', borderRadius: 20, padding: '36px 32px', textAlign: 'center', marginBottom: 32
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔴</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 10 }}>Live IA Coach — La killer feature</h2>
          <p style={{ fontSize: 15, color: '#2d4438', lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
            Pendant le match, posez vos questions à l'IA en temps réel. Elle analyse les stats live et prédit les prochains événements. Score évolutif recalculé à chaque minute.
          </p>
        </div>

        <div style={{ textAlign: 'center', fontSize: 13, color: '#8a9288' }}>
          Sans engagement · Annulable à tout moment · Paiement sécurisé par Stripe
        </div>
      </div>
    </div>
  );
}
