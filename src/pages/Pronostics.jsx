import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePronostics } from '../usePronostics';
import Logo from '../Logo';

// ─── PALETTE PARIS SPORTIFS (Winamax / Betclic style) ────────────────────────
const C = {
  bg:         '#0d0d14',   // fond ultra-sombre
  bgCard:     '#161622',   // carte
  bgCardHover:'#1e1e2e',
  border:     '#2a2a3e',
  accent:     '#ff3b3b',   // rouge vif Betclic
  accentGlow: 'rgba(255,59,59,0.3)',
  gold:       '#ffd700',   // or/jaune Winamax
  goldGlow:   'rgba(255,215,0,0.25)',
  green:      '#00e676',   // vert néon
  greenGlow:  'rgba(0,230,118,0.2)',
  blue:       '#2979ff',   // bleu électrique
  blueGlow:   'rgba(41,121,255,0.2)',
  purple:     '#aa00ff',   // violet
  purpleGlow: 'rgba(170,0,255,0.2)',
  orange:     '#ff6d00',   // orange
  text:       '#ffffff',
  textSub:    '#b0b0c8',
  textDim:    '#5a5a7a',
  live:       '#ff1744',
};

// ─── ÉTAPES ANIMATION ────────────────────────────────────────────────────────
const STEPS = [
  { icon: '⚡', label: 'Forme récente des équipes',      color: C.gold,   duration: 1100 },
  { icon: '🏥', label: 'Blessés & suspendus',            color: C.accent, duration: 1300 },
  { icon: '📊', label: 'Classement FIFA & statistiques', color: C.blue,   duration: 1500 },
  { icon: '🔥', label: 'Confrontations directes H2H',    color: C.orange, duration: 1100 },
  { icon: '🌡️', label: 'Conditions & enjeux du match',   color: C.purple, duration: 1200 },
  { icon: '🧠', label: 'Génération du pronostic IA',     color: C.green,  duration: 1200 },
];

// ─── ANIMATION ────────────────────────────────────────────────────────────────
function AnalysisAnimation({ onComplete, freeze }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stepPct, setStepPct] = useState(0);
  const totalDur = STEPS.reduce((a, s) => a + s.duration, 0);
  const startRef = useRef(Date.now());
  const elapsedRef = useRef(0);
  const stepElRef = useRef(0);
  const stepRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      const delta = now - startRef.current;
      startRef.current = now;
      elapsedRef.current += delta;
      stepElRef.current += delta;

      const g = Math.min(100, (elapsedRef.current / totalDur) * 100);
      setProgress(g);

      const sd = STEPS[stepRef.current]?.duration || 1000;
      setStepPct(Math.min(100, (stepElRef.current / sd) * 100));

      if (stepElRef.current >= sd && stepRef.current < STEPS.length - 1) {
        stepRef.current++;
        stepElRef.current = 0;
        setStepIndex(stepRef.current);
        setStepPct(0);
      }

      if (elapsedRef.current >= totalDur) {
        clearInterval(id);
        if (!freeze) onComplete?.();
      }
    }, 30);
    return () => clearInterval(id);
  }, []);

  const step = STEPS[stepIndex];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0d0d14 0%, #1a0a2e 50%, #0d0d14 100%)',
      border: `1px solid ${C.purple}40`,
      borderRadius: 16, padding: '24px 20px',
      boxShadow: `0 0 40px ${C.purpleGlow}, 0 20px 50px rgba(0,0,0,0.6)`,
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Ligne de lumière top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${C.purple}, ${C.gold}, ${C.purple}, transparent)`,
        animation: 'shimmer 2s ease-in-out infinite'
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 32, marginBottom: 6, animation: 'spin 3s linear infinite', display: 'inline-block' }}>⚽</div>
        <div style={{ fontSize: 15, fontWeight: 900, color: C.text, letterSpacing: '-0.02em' }}>
          ANALYSE EN COURS
        </div>
        <div style={{ fontSize: 11, color: C.textSub, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Intelligence artificielle — {STEPS.length} paramètres
        </div>
      </div>

      {/* Barre globale */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 10, color: C.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Progression</span>
          <span style={{ fontSize: 13, fontWeight: 900, color: C.gold }}>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 4,
            background: `linear-gradient(90deg, ${C.accent}, ${C.gold})`,
            width: `${progress}%`, transition: 'width 0.08s linear',
            boxShadow: `0 0 12px ${C.goldGlow}`
          }} />
        </div>
      </div>

      {/* Étapes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {STEPS.map((s, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: i > stepIndex ? 0.3 : 1, transition: 'opacity 0.3s' }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                background: done ? s.color + '20' : active ? s.color + '15' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${done || active ? s.color : 'rgba(255,255,255,0.08)'}`,
                boxShadow: active ? `0 0 12px ${s.color}60` : 'none',
                transition: 'all 0.3s'
              }}>
                {done ? <span style={{ color: s.color, fontSize: 12, fontWeight: 900 }}>✓</span> : s.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: done ? C.textDim : active ? C.text : C.textDim, marginBottom: 3 }}>
                  {s.label}
                </div>
                {active && (
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 2,
                      background: s.color, width: `${stepPct}%`,
                      transition: 'width 0.08s linear',
                      boxShadow: `0 0 8px ${s.color}`
                    }} />
                  </div>
                )}
                {done && <div style={{ height: 3, background: s.color + '50', borderRadius: 2 }} />}
              </div>
              {done && <span style={{ fontSize: 10, color: s.color, fontWeight: 900 }}>OK</span>}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}

// ─── PAYWALL ──────────────────────────────────────────────────────────────────
function PaywallModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0d0d14 0%, #1a0a2e 100%)',
        borderRadius: 20, padding: '32px 24px', maxWidth: 420, width: '100%',
        border: `1px solid ${C.gold}50`,
        boxShadow: `0 0 60px ${C.goldGlow}, 0 40px 80px rgba(0,0,0,0.7)`,
        textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '5%', right: '5%', height: 2,
          background: `linear-gradient(90deg, transparent, ${C.gold}, ${C.accent}, ${C.gold}, transparent)`
        }} />

        <div style={{ fontSize: 44, marginBottom: 10 }}>🏆</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: C.text, marginBottom: 8, letterSpacing: '-0.03em' }}>
          Votre pronostic est prêt !
        </h2>
        <p style={{ fontSize: 14, color: C.textSub, marginBottom: 24, lineHeight: 1.6 }}>
          Vous avez utilisé votre pronostic gratuit du jour.<br />
          Passez à <strong style={{ color: C.gold }}>AI Plus</strong> pour des pronostics illimités.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <Link to="/pronostics/abonnement" style={{
            background: `linear-gradient(135deg, ${C.gold}, #ff8c00)`,
            color: '#000', borderRadius: 12, padding: '14px 20px',
            fontSize: 15, fontWeight: 900, textDecoration: 'none',
            display: 'block', boxShadow: `0 4px 20px ${C.goldGlow}`,
          }}>
            🚀 AI Plus — 4,99€/mois · Pronostics illimités
          </Link>
          <Link to="/pronostics/abonnement" style={{
            background: `linear-gradient(135deg, ${C.accent}, #c62828)`,
            color: '#fff', borderRadius: 12, padding: '14px 20px',
            fontSize: 15, fontWeight: 900, textDecoration: 'none',
            display: 'block', boxShadow: `0 4px 20px ${C.accentGlow}`,
          }}>
            🧠 AI Premium — 9,99€/mois · Live IA Coach
          </Link>
        </div>

        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: C.textDim,
          cursor: 'pointer', fontSize: 12, textDecoration: 'underline'
        }}>
          Revenir demain pour mon pronostic gratuit
        </button>
      </div>
    </div>
  );
}

// ─── RÉSULTAT PRONOSTIC ───────────────────────────────────────────────────────
function PronosticResult({ pronostic }) {
  const confColor = pronostic.niveau_confiance === 'très élevée' ? C.green
    : pronostic.niveau_confiance === 'élevée' ? C.gold
    : pronostic.niveau_confiance === 'moyenne' ? C.blue : C.textSub;

  return (
    <div style={{
      background: 'rgba(0,230,118,0.05)',
      border: `1px solid ${C.green}30`,
      borderRadius: 12, padding: '16px', marginTop: 4
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: C.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Favori IA</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: C.text }}>{pronostic.favori}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: C.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Confiance</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: confColor, filter: `drop-shadow(0 0 8px ${confColor})` }}>
            {pronostic.score_confiance}%
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 10 }}>
        {[
          { label: '1', val: pronostic.prob_p1, color: C.blue },
          { label: 'N', val: pronostic.prob_nul, color: C.textSub },
          { label: '2', val: pronostic.prob_p2, color: C.accent },
        ].map(({ label, val, color }) => (
          <div key={label} style={{
            textAlign: 'center', background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${color}30`, borderRadius: 8, padding: '8px 4px'
          }}>
            <div style={{ fontSize: 10, color: C.textDim, fontWeight: 700, marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 16, fontWeight: 900, color }}>{val}%</div>
          </div>
        ))}
      </div>

      {pronostic.score_exact && (
        <div style={{
          textAlign: 'center', background: `${C.gold}10`,
          border: `1px solid ${C.gold}30`, borderRadius: 8, padding: '8px',
          fontSize: 13, color: C.gold, fontWeight: 800, marginBottom: 10
        }}>
          Score probable : {pronostic.score_exact}
        </div>
      )}

      {pronostic.analyse_texte && (
        <p style={{ fontSize: 12, color: C.textSub, lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
          "{pronostic.analyse_texte}"
        </p>
      )}
    </div>
  );
}

// ─── CARTE MATCH ─────────────────────────────────────────────────────────────
function MatchCard({ event, onGetPronostic, pronostic, animating, frozen, plan, quotaUsed }) {
  const isLive = event.statut === 'IN_PLAY' || event.statut === 'PAUSED';
  const isFinished = event.statut === 'FINISHED';
  const date = new Date(event.date_heure);
  const QUOTA_FREE = 1;

  return (
    <div style={{
      background: C.bgCard,
      border: `1px solid ${isLive ? C.live + '60' : C.border}`,
      borderRadius: 14, padding: '18px',
      boxShadow: isLive ? `0 0 20px ${C.live}20, 0 4px 20px rgba(0,0,0,0.4)` : '0 4px 20px rgba(0,0,0,0.3)',
      transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
    }}>
      {/* Barre top live */}
      {isLive && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${C.live}, ${C.gold}, ${C.live})`,
          animation: 'shimmer 2s ease-in-out infinite'
        }} />
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontSize: 10, color: C.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {event.competition_nom}
        </span>
        {isLive ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.live, fontWeight: 900,
            background: `${C.live}15`, padding: '3px 8px', borderRadius: 20, border: `1px solid ${C.live}40` }}>
            <span style={{ width: 6, height: 6, background: C.live, borderRadius: '50%', animation: 'blink 1s infinite', display: 'inline-block' }}></span>
            LIVE
          </span>
        ) : !isFinished ? (
          <span style={{ fontSize: 11, color: C.textSub, background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: 20 }}>
            {date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} · {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        ) : (
          <span style={{ fontSize: 11, color: C.textDim, background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: 20 }}>Terminé</span>
        )}
      </div>

      {/* Équipes */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          {event.participant1_logo && <img src={event.participant1_logo} alt="" style={{ width: 36, height: 36, objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))' }} />}
          <span style={{ fontWeight: 900, color: C.text, fontSize: 15, letterSpacing: '-0.02em' }}>{event.participant1}</span>
        </div>
        <div style={{ textAlign: 'center', padding: '0 12px' }}>
          {isLive || isFinished ? (
            <span style={{ fontWeight: 900, color: C.gold, fontSize: 24, letterSpacing: '-0.03em',
              filter: `drop-shadow(0 0 8px ${C.goldGlow})` }}>
              {event.score_p1 ?? 0} – {event.score_p2 ?? 0}
            </span>
          ) : (
            <span style={{ color: C.textDim, fontSize: 13, fontWeight: 700,
              background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: 20 }}>VS</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'flex-end' }}>
          <span style={{ fontWeight: 900, color: C.text, fontSize: 15, letterSpacing: '-0.02em' }}>{event.participant2}</span>
          {event.participant2_logo && <img src={event.participant2_logo} alt="" style={{ width: 36, height: 36, objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))' }} />}
        </div>
      </div>

      {/* Contenu */}
      {animating ? (
        <AnalysisAnimation freeze={frozen} onComplete={() => {}} />
      ) : pronostic ? (
        <PronosticResult pronostic={pronostic} />
      ) : (
        <button onClick={() => onGetPronostic(event.id)} style={{
          width: '100%',
          background: plan === 'free' && quotaUsed >= QUOTA_FREE
            ? `linear-gradient(135deg, ${C.gold}, #ff8c00)`
            : `linear-gradient(135deg, ${C.accent}, #c62828)`,
          color: plan === 'free' && quotaUsed >= QUOTA_FREE ? '#000' : '#fff',
          border: 'none', borderRadius: 10, padding: '13px 0',
          fontWeight: 900, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
          letterSpacing: '-0.01em',
          boxShadow: plan === 'free' && quotaUsed >= QUOTA_FREE
            ? `0 4px 20px ${C.goldGlow}`
            : `0 4px 20px ${C.accentGlow}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all 0.2s'
        }}>
          <span>🤖</span>
          {plan === 'free' && quotaUsed >= QUOTA_FREE ? 'Débloquer le pronostic IA' : 'Voir le pronostic IA'}
        </button>
      )}

      <style>{`
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }
        @keyframes shimmer { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────
export default function Pronostics() {
  const { user, plan, pronosticsApi } = usePronostics();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [pronostics, setPronostics] = useState({});
  const [animating, setAnimating] = useState({});
  const [frozen, setFrozen] = useState({});
  const [showPaywall, setShowPaywall] = useState(false);
  const [quotaUsed, setQuotaUsed] = useState(0);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState(null);
  const QUOTA_FREE = 1;

  useEffect(() => {
    pronosticsApi.get('/pronostics/events')
      .then(r => setEvents(r.data))
      .catch(() => setError('Impossible de charger les matchs'))
      .finally(() => setLoadingEvents(false));
    if (user) loadQuota();
  }, [user]);

  const loadQuota = async () => {
    try {
      const r = await pronosticsApi.get('/pronostics/auth/me');
      setQuotaUsed(r.data.quota?.used || 0);
    } catch (_) {}
  };

  const getPronostic = async (eventId) => {
    if (!user) { navigate('/pronostics/login'); return; }

    if (plan === 'free' && quotaUsed >= QUOTA_FREE) {
      setAnimating(p => ({ ...p, [eventId]: true }));
      setFrozen(p => ({ ...p, [eventId]: true }));
      setTimeout(() => {
        setAnimating(p => ({ ...p, [eventId]: false }));
        setShowPaywall(true);
      }, 8000);
      return;
    }

    setAnimating(p => ({ ...p, [eventId]: true }));
    setFrozen(p => ({ ...p, [eventId]: false }));

    try {
      await new Promise(resolve => setTimeout(resolve, 8000));
      const r = await pronosticsApi.get(`/pronostics/events/${eventId}/pronostic`);
      setPronostics(p => ({ ...p, [eventId]: r.data }));
      loadQuota();
    } catch (err) {
      if (err.response?.status === 429) {
        setShowPaywall(true);
      } else {
        setError('Erreur lors de la génération du pronostic');
      }
    } finally {
      setAnimating(p => ({ ...p, [eventId]: false }));
    }
  };

  const liveEvents = events.filter(e => e.statut === 'IN_PLAY' || e.statut === 'PAUSED');
  const upcomingEvents = events.filter(e => e.statut === 'SCHEDULED');

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif" }}>

      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(13,13,20,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${C.border}`,
        padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Logo size="sm" />
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: 16 }}>|</span>
          <span style={{ fontWeight: 900, fontSize: 14, color: C.text, letterSpacing: '-0.02em' }}>
            🤖 Prédictions IA
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: 12, fontWeight: 900,
                color: plan === 'free' ? C.textSub : plan === 'ai_plus' ? C.gold : C.accent,
                background: plan === 'free' ? 'rgba(255,255,255,0.06)' : plan === 'ai_plus' ? `${C.gold}15` : `${C.accent}15`,
                padding: '4px 10px', borderRadius: 20,
                border: `1px solid ${plan === 'free' ? 'rgba(255,255,255,0.1)' : plan === 'ai_plus' ? C.gold + '40' : C.accent + '40'}`
              }}>
                {plan === 'free' ? 'FREE' : plan === 'ai_plus' ? '🚀 AI PLUS' : '🧠 AI PREMIUM'}
              </div>
              {plan === 'free' && (
                <div style={{ fontSize: 10, color: C.textDim, marginTop: 2, textAlign: 'center' }}>
                  {quotaUsed}/{QUOTA_FREE} aujourd'hui
                </div>
              )}
            </div>
          ) : (
            <Link to="/pronostics/login" style={{
              background: `linear-gradient(135deg, ${C.accent}, #c62828)`,
              color: '#fff', borderRadius: 20, padding: '8px 18px',
              fontSize: 13, fontWeight: 900, textDecoration: 'none',
              boxShadow: `0 2px 12px ${C.accentGlow}`
            }}>Se connecter</Link>
          )}
        </div>
      </nav>

      {/* HERO */}
      <div style={{
        background: `linear-gradient(180deg, rgba(255,59,59,0.06) 0%, rgba(255,215,0,0.04) 40%, transparent 100%)`,
        padding: '52px 20px 44px', textAlign: 'center',
        borderBottom: `1px solid ${C.border}`,
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Effet de lumière background */}
        <div style={{
          position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 300,
          background: `radial-gradient(ellipse, ${C.accent}15 0%, transparent 70%)`,
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 580, margin: '0 auto', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: `${C.accent}15`, border: `1px solid ${C.accent}40`,
            borderRadius: 20, padding: '5px 14px', marginBottom: 18,
            fontSize: 11, fontWeight: 900, color: C.accent,
            textTransform: 'uppercase', letterSpacing: '0.1em'
          }}>
            ⚽ Coupe du Monde 2026
          </div>

          <h1 style={{
            fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 900, color: C.text,
            letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 16
          }}>
            Pronostics générés<br />
            <span style={{
              background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>par intelligence artificielle</span>
          </h1>

          <p style={{ fontSize: 15, color: C.textSub, lineHeight: 1.7, marginBottom: 22 }}>
            Notre IA analyse la forme, les blessés, les stats et l'historique<br />
            pour chaque match — en temps réel.
          </p>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: `${C.green}10`, border: `1px solid ${C.green}30`,
            borderRadius: 20, padding: '8px 18px', marginBottom: 24,
            fontSize: 13, fontWeight: 800, color: C.green
          }}>
            ✓ 1 pronostic gratuit par jour · Sans carte bancaire
          </div>

          {!user && (
            <div>
              <Link to="/pronostics/login" style={{
                display: 'inline-block',
                background: `linear-gradient(135deg, ${C.accent}, #c62828)`,
                color: '#fff', borderRadius: 24, padding: '14px 36px',
                fontSize: 16, fontWeight: 900, textDecoration: 'none',
                boxShadow: `0 6px 28px ${C.accentGlow}`,
                letterSpacing: '-0.02em'
              }}>
                Commencer gratuitement →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* CONTENU */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px' }}>

        {error && error !== 'QUOTA_REACHED' && (
          <div style={{
            background: `${C.accent}10`, border: `1px solid ${C.accent}40`,
            color: C.accent, borderRadius: 12, padding: '12px 16px', marginBottom: 24,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14
          }}>
            <span>{error}</span>
            <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: C.accent, cursor: 'pointer', fontSize: 18 }}>✕</button>
          </div>
        )}

        {/* Matchs en direct */}
        {liveEvents.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 16, fontWeight: 900, color: C.text, marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '-0.02em' }}>
              <span style={{ width: 8, height: 8, background: C.live, borderRadius: '50%',
                animation: 'blink 1s infinite', display: 'inline-block',
                boxShadow: `0 0 8px ${C.live}` }}></span>
              EN DIRECT
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {liveEvents.map(event => (
                <MatchCard key={event.id} event={event} onGetPronostic={getPronostic}
                  pronostic={pronostics[event.id]} animating={animating[event.id]}
                  frozen={frozen[event.id]} plan={plan} quotaUsed={quotaUsed} />
              ))}
            </div>
          </section>
        )}

        {/* Prochains matchs */}
        <section>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: C.text, marginBottom: 16, letterSpacing: '-0.02em' }}>
            ⚽ PROCHAINS MATCHS
          </h2>
          {loadingEvents ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: C.textSub }}>
              <div style={{ fontSize: 32, marginBottom: 12, animation: 'spin 2s linear infinite', display: 'inline-block' }}>⚽</div>
              <div>Chargement des matchs...</div>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14,
              padding: '40px', textAlign: 'center', color: C.textSub }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⚽</div>
              <p style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Aucun match à venir pour le moment.</p>
              <p style={{ fontSize: 13, marginTop: 6 }}>Les matchs seront synchronisés depuis le calendrier FIFA.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {upcomingEvents.map(event => (
                <MatchCard key={event.id} event={event} onGetPronostic={getPronostic}
                  pronostic={pronostics[event.id]} animating={animating[event.id]}
                  frozen={frozen[event.id]} plan={plan} quotaUsed={quotaUsed} />
              ))}
            </div>
          )}
        </section>

        <div style={{ textAlign: 'center', marginTop: 48, paddingTop: 32, borderTop: `1px solid ${C.border}` }}>
          <Link to="/" style={{ fontSize: 13, color: C.textDim, textDecoration: 'none', fontWeight: 600 }}>
            ← Retour à coupedumonde.ai
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }
      `}</style>
    </div>
  );
}
