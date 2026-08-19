import React, { useState, useEffect, useRef } from 'react';
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
          <Link to="/abonnement" style={{
            background: `linear-gradient(135deg, ${C.gold}, #ff8c00)`,
            color: '#000', borderRadius: 12, padding: '14px 20px',
            fontSize: 15, fontWeight: 900, textDecoration: 'none',
            display: 'block', boxShadow: `0 4px 20px ${C.goldGlow}`,
          }}>
            🚀 AI Plus — 4,99€/mois · Pronostics illimités
          </Link>
          <Link to="/abonnement" style={{
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
  const p1 = pronostic.prob_p1 || 0;
  const pN = pronostic.prob_nul || 0;
  const p2 = pronostic.prob_p2 || 0;
  const conf = pronostic.score_confiance || 0;
  const confColor = conf >= 73 ? C.green : conf >= 60 ? C.gold : C.blue;
  const confLabel = conf >= 73 ? 'Élevée' : conf >= 60 ? 'Modérée' : 'Faible';
  const circumference = 2 * Math.PI * 20;

  return (
    <div style={{ marginTop: 8 }}>

      {/* ─ BARRE TRICOLORE PRINCIPALE ─ */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: C.blue }}>{p1}%</div>
            <div style={{ fontSize: 9, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Victoire 1</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: C.textSub }}>{pN}%</div>
            <div style={{ fontSize: 9, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nul</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: C.accent }}>{p2}%</div>
            <div style={{ fontSize: 9, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Victoire 2</div>
          </div>
        </div>
        {/* Barre tricolore style ADI PredictStreet */}
        <div style={{ height: 8, borderRadius: 8, overflow: 'hidden', display: 'flex', background: 'rgba(255,255,255,0.05)' }}>
          <div style={{ width: `${p1}%`, background: `linear-gradient(90deg, #1a56db, ${C.blue})`, transition: 'width 1s ease', minWidth: p1 > 0 ? 4 : 0 }} />
          <div style={{ width: `${pN}%`, background: 'linear-gradient(90deg, #4a5568, #718096)', transition: 'width 1s ease', minWidth: pN > 0 ? 4 : 0 }} />
          <div style={{ width: `${p2}%`, background: `linear-gradient(90deg, #c62828, ${C.accent})`, transition: 'width 1s ease', minWidth: p2 > 0 ? 4 : 0 }} />
        </div>
      </div>

      {/* ─ FAVORI + JAUGE CONFIANCE ─ */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <div style={{ fontSize: 9, color: C.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>Favori</div>
          <div style={{ fontSize: 14, fontWeight: 900, color: C.text }}>{pronostic.favori}</div>
        </div>
        {/* Jauge circulaire de confiance */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: 52, height: 52 }}>
            <svg width="52" height="52" viewBox="0 0 52 52" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
              <circle cx="26" cy="26" r="20" fill="none" stroke={confColor}
                strokeWidth="5" strokeLinecap="round"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={`${circumference * (1 - conf / 100)}`}
                style={{ filter: `drop-shadow(0 0 4px ${confColor})` }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 900, color: confColor }}>{conf}%</span>
            </div>
          </div>
          <div style={{ fontSize: 9, color: confColor, fontWeight: 700, marginTop: 2 }}>{confLabel}</div>
        </div>
      </div>

      {/* ─ SCORE EXACT ─ */}
      {pronostic.score_exact ? (
        <div style={{
          textAlign: 'center',
          background: `linear-gradient(135deg, ${C.gold}12, ${C.gold}06)`,
          border: `1px solid ${C.gold}40`, borderRadius: 10, padding: '10px',
          marginBottom: 10, position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${C.gold}80, transparent)` }} />
          <div style={{ fontSize: 9, color: C.gold, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Score probable</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: C.gold, letterSpacing: '-0.02em', filter: `drop-shadow(0 0 8px ${C.goldGlow})` }}>
            {pronostic.score_exact}
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: 'center', background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '9px',
          fontSize: 11, color: C.textDim, marginBottom: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
        }}>
          🔒 Score exact — <strong style={{ color: C.gold }}>AI Plus</strong>
        </div>
      )}

      {/* ─ COTES BOOKMAKERS ─ */}
      {pronostic.cotes && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 14px', marginBottom: 10 }}>
          <div style={{ fontSize: 9, color: C.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            📊 Cotes moyennes — {pronostic.cotes.source || 'Betclic/Unibet/Winamax/PMU'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: pronostic.cotes.score_exact ? 8 : 0 }}>
            {[
              { label: '1', val: pronostic.cotes.victoire_1, color: C.blue },
              { label: 'N', val: pronostic.cotes.nul, color: C.textSub },
              { label: '2', val: pronostic.cotes.victoire_2, color: C.accent },
            ].map(({ label, val, color }) => val ? (
              <div key={label} style={{ textAlign: 'center', background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 8, padding: '6px 4px' }}>
                <div style={{ fontSize: 9, color: C.textDim, fontWeight: 700, marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 15, fontWeight: 900, color }}>{typeof val === 'number' ? val.toFixed(2) : val}</div>
              </div>
            ) : null)}
          </div>
          {pronostic.cotes.score_exact && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `${C.gold}08`, border: `1px solid ${C.gold}25`, borderRadius: 8, padding: '6px 10px' }}>
              <span style={{ fontSize: 10, color: C.textDim }}>Score exact {pronostic.score_exact}</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: C.gold }}>{typeof pronostic.cotes.score_exact === 'number' ? pronostic.cotes.score_exact.toFixed(2) : pronostic.cotes.score_exact}</span>
            </div>
          )}
        </div>
      )}

      {/* ─ BUTEURS POTENTIELS ─ */}
      {pronostic.buteurs && pronostic.buteurs.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 14px', marginBottom: 10 }}>
          <div style={{ fontSize: 9, color: C.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            ⚽ Buteurs potentiels
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {pronostic.buteurs.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, textAlign: 'center', background: `${C.gold}15`, border: `1px solid ${C.gold}30`, borderRadius: 6, padding: '3px 0', flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 900, color: C.gold }}>{b.pct}%</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.nom}</div>
                  <div style={{ fontSize: 10, color: C.textDim }}>{b.equipe}</div>
                </div>
                {b.raison && <div style={{ fontSize: 10, color: C.textSub, maxWidth: 120, textAlign: 'right', lineHeight: 1.3 }}>{b.raison}</div>}
              </div>
            ))}
            {/* Si plan free, afficher le verrou pour les autres buteurs */}
            {pronostic._buteurs_locked && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.5, padding: '4px 0' }}>
                <div style={{ width: 36, textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '3px 0' }}>
                  <span style={{ fontSize: 11, color: C.textDim }}>🔒</span>
                </div>
                <span style={{ fontSize: 11, color: C.textDim }}>+3 buteurs — <strong style={{ color: C.gold }}>AI Plus</strong></span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─ ANALYSE ─ */}
      {pronostic.analyse_texte && (
        <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: `2px solid ${C.green}50`, borderRadius: '0 8px 8px 0', padding: '9px 12px' }}>
          <div style={{ fontSize: 9, color: C.green, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Analyse</div>
          <p style={{ fontSize: 11, color: C.textSub, lineHeight: 1.65, margin: 0 }}>{pronostic.analyse_texte}</p>
        </div>
      )}
    </div>
  );
}

// ─── LIVE IA COACH INLINE ───────────────────────────────────────────────────
function LiveIACoachInline({ matchId, pronosticsApi }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [sugLoading, setSugLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    // Charger les questions contextuelles au montage
    setSugLoading(true);
    pronosticsApi.get(`/pronostics/live/${matchId}/questions`)
      .then(r => setSuggestions(r.data.questions || []))
      .catch(() => {})
      .finally(() => setSugLoading(false));
  }, [matchId]);

  useEffect(() => {
    // Scroller dans le conteneur messages uniquement, pas dans la page
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text) => {
    const q = text || input.trim();
    if (!q || loading) return;
    setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    try {
      const r = await pronosticsApi.post(`/pronostics/live/${matchId}/chat`, { question: q });
      setMessages(prev => [...prev, { role: 'ai', text: r.data.answer }]);
      // Régénérer les suggestions après chaque réponse
      pronosticsApi.get(`/pronostics/live/${matchId}/questions`)
        .then(r => setSuggestions(r.data.questions || []))
        .catch(() => {});
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Erreur — réessayez dans un instant.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 16, borderTop: `1px solid ${C.live}30`, paddingTop: 14 }}>
      <div style={{ fontSize: 11, color: C.live, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 6, height: 6, background: C.live, borderRadius: '50%', display: 'inline-block', animation: 'blink 1s infinite' }}></span>
        Live IA Coach
      </div>

      {/* Messages */}
      {messages.length > 0 && (
        <div ref={messagesContainerRef} style={{ maxHeight: 180, overflowY: 'auto', marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              background: m.role === 'user' ? 'rgba(255,255,255,0.06)' : `${C.live}10`,
              border: `1px solid ${m.role === 'user' ? 'rgba(255,255,255,0.08)' : C.live + '30'}`,
              borderRadius: 10, padding: '8px 12px',
              fontSize: 12, color: m.role === 'user' ? C.textSub : C.text,
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}>
              {m.role === 'ai' && <span style={{ fontSize: 10, color: C.live, fontWeight: 700, display: 'block', marginBottom: 3 }}>🤖 IA Coach</span>}
              {m.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Suggestions contextuelles */}
      {suggestions.length > 0 && !loading && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {suggestions.map((q, i) => (
            <button key={i} onClick={() => sendMessage(q)} style={{
              background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.live}30`,
              color: C.textSub, borderRadius: 20, padding: '5px 12px',
              fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}>{q}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Posez votre question sur le match..."
          style={{
            flex: 1, background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.live}40`,
            borderRadius: 10, padding: '9px 14px', color: C.text, fontSize: 12,
            fontFamily: 'inherit', outline: 'none'
          }}
        />
        <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{
          background: loading ? 'rgba(255,255,255,0.06)' : `linear-gradient(135deg, ${C.live}, #00b248)`,
          color: loading ? C.textDim : '#000', border: 'none', borderRadius: 10,
          padding: '9px 16px', fontWeight: 900, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit'
        }}>
          {loading ? '...' : '→'}
        </button>
      </div>
    </div>
  );
}

// ─── CARTE MATCH ─────────────────────────────────────────────────────────────
function MatchCard({ event, onGetPronostic, pronostic, animating, frozen, plan, quotaUsed, pronosticsApi }) {
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 10, color: C.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {event.competition_nom}
          </span>
          {event.phase && event.phase !== 'GROUP_STAGE' && (() => {
            const phaseLabels = {
              'LAST_32': '⚡ Seizièmes de finale',
              'LAST_16': '⚡ Huitièmes de finale',
              'QUARTER_FINALS': '🏆 Quarts de finale',
              'SEMI_FINALS': '🔥 Demi-finales',
              'FINAL': '👑 FINALE',
              'THIRD_PLACE': '🥉 Match 3ème place',
            };
            const label = phaseLabels[event.phase];
            if (!label) return null;
            return (
              <span style={{ fontSize: 12, color: C.gold, fontWeight: 800, letterSpacing: '-0.01em' }}>
                {label}
              </span>
            );
          })()}
          {event.phase === 'GROUP_STAGE' && event.group_name && (
            <span style={{ fontSize: 11, color: C.textSub, fontWeight: 600 }}>
              Groupe {event.group_name}
            </span>
          )}
        </div>
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'nowrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          {event.participant1_logo && <img src={event.participant1_logo} alt="" style={{ width: 32, height: 32, objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))', flexShrink: 0 }} />}
          <span style={{ fontWeight: 900, color: C.text, fontSize: 14, letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.participant1}</span>
        </div>
        <div style={{ textAlign: 'center', flexShrink: 0, padding: '0 8px' }}>
          {isLive || isFinished ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
              <span style={{ fontWeight: 900, color: C.gold, fontSize: 22, letterSpacing: '-0.02em', filter: `drop-shadow(0 0 8px ${C.goldGlow})` }}>{event.score_p1 ?? 0}</span>
              <span style={{ fontWeight: 700, color: C.textDim, fontSize: 16 }}>-</span>
              <span style={{ fontWeight: 900, color: C.gold, fontSize: 22, letterSpacing: '-0.02em', filter: `drop-shadow(0 0 8px ${C.goldGlow})` }}>{event.score_p2 ?? 0}</span>
            </div>
          ) : (
            <span style={{ color: C.textDim, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
              background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 20 }}>VS</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end', minWidth: 0 }}>
          <span style={{ fontWeight: 900, color: C.text, fontSize: 14, letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{event.participant2}</span>
          {event.participant2_logo && <img src={event.participant2_logo} alt="" style={{ width: 32, height: 32, objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))', flexShrink: 0 }} />}
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

      {/* LIVE IA COACH pour AI Premium sur les matchs en direct */}
      {isLive && plan === 'ai_premium' && pronosticsApi && (
        <LiveIACoachInline matchId={event.id} pronosticsApi={pronosticsApi} />
      )}

      <style>{`
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }
        @keyframes shimmer { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}

// ─── MENU UTILISATEUR ───────────────────────────────────────────────────────
const ADMIN_EMAILS = ['miloudchia@gmail.com', 'miloudc@hotmail.com'];

function UserMenu({ user, plan, quotaUsed, QUOTA_FREE, logout, navigate }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const planColor = plan === 'free' ? C.textSub : plan === 'ai_plus' ? C.gold : C.accent;
  const planLabel = plan === 'free' ? 'FREE' : plan === 'ai_plus' ? '🚀 AI PLUS' : '🧠 AI PREMIUM';
  const isAdmin = ADMIN_EMAILS.includes(user?.email);

  const menuItems = [
    { icon: '📊', label: 'Tableau de bord', path: '/dashboard' },
    { icon: '👤', label: 'Mon compte', path: '/dashboard' },
    { icon: '💳', label: 'Mes abonnements', path: '/dashboard' },
    ...(isAdmin ? [{ icon: '🔐', label: 'Panel Admin', path: '/admin', admin: true }] : []),
    { icon: '📝', label: 'Blog', path: '/blog' },
    { separator: true },
    { icon: '🚪', label: 'Déconnexion', action: () => { logout(); navigate('/'); } },
  ];

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        background: plan === 'free' ? 'rgba(255,255,255,0.06)' : plan === 'ai_plus' ? `${C.gold}15` : `${C.accent}15`,
        border: `1px solid ${plan === 'free' ? 'rgba(255,255,255,0.1)' : plan === 'ai_plus' ? C.gold + '40' : C.accent + '40'}`,
        color: planColor, borderRadius: 20, padding: '6px 14px',
        fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', gap: 6
      }}>
        {planLabel}
        <span style={{ fontSize: 10, opacity: 0.7, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: '#1a1f2e', border: `1px solid ${C.border}`,
          borderRadius: 14, padding: '6px', minWidth: 200,
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)', zIndex: 1000
        }}>
          {/* Profil */}
          <div style={{ padding: '10px 14px 10px', borderBottom: `1px solid ${C.border}`, marginBottom: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{user.prenom || user.pseudo || user.email.split('@')[0]}</div>
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{user.email}</div>
            {plan === 'free' && <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>{quotaUsed}/{QUOTA_FREE} pronostic aujourd'hui</div>}
          </div>

          {menuItems.map((item, i) => {
            if (item.separator) return <div key={i} style={{ height: 1, background: C.border, margin: '4px 0' }} />;
            return (
              <button key={i} onClick={() => { setOpen(false); item.action ? item.action() : navigate(item.path); }}
                style={{
                  width: '100%', background: item.admin ? `${C.accent}10` : 'transparent',
                  border: 'none', color: item.admin ? C.accent : item.label === 'Déconnexion' ? '#ff6b6b' : C.textSub,
                  borderRadius: 10, padding: '10px 14px', fontSize: 13, cursor: 'pointer',
                  fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                  transition: 'background 0.15s', fontWeight: item.admin ? 700 : 400
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = item.admin ? `${C.accent}10` : 'transparent'}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────
export default function Pronostics() {
  const { user, plan, pronosticsApi, logout } = usePronostics();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [pronostics, setPronostics] = useState({});
  const [animating, setAnimating] = useState({});
  const [frozen, setFrozen] = useState({});
  const [showPaywall, setShowPaywall] = useState(false);
  const [quotaUsed, setQuotaUsed] = useState(0);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeComp, setActiveComp] = useState('2000'); // Prono Sport par défaut
  const QUOTA_FREE = 1;

  const COMPS = [
    { id: '2000', label: '🌍 Prono Sport', flag: '🌍', active: true },
    { id: '2001', label: '🇪🇺 Champions League', flag: '🇪🇺', active: true },
    { id: '2021', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', active: true },
    { id: '2015', label: '🇫🇷 Ligue 1', flag: '🇫🇷', active: true },
    { id: '2002', label: '🇩🇪 Bundesliga', flag: '🇩🇪', active: true },
    { id: '2019', label: '🇮🇹 Serie A', flag: '🇮🇹', active: true },
    { id: '2014', label: '🇪🇸 La Liga', flag: '🇪🇸', active: true },
  ];

  const loadCompMatches = (compId) => {
    setLoadingEvents(true);
    if (compId === '2000') {
      pronosticsApi.get('/matches')
        .then(r => setEvents(r.data))
        .catch(() => setError('Impossible de charger les matchs'))
        .finally(() => setLoadingEvents(false));
    } else {
      fetch(`https://app-7a3df0bb-9561-4735-b916-cfffb7487eba.cleverapps.io/api/competitions/${compId}/matches`)
        .then(r => r.json())
        .then(data => {
          const matches = (data.matches || []).map(m => ({
            ...m, id: m.id || m.external_id,
            participant1: m.participant1 || m.equipe1,
            participant2: m.participant2 || m.equipe2,
            participant1_logo: m.participant1_logo || m.logo1,
            participant2_logo: m.participant2_logo || m.logo2,
          }));
          setEvents(matches);
          setLoadingEvents(false);
        })
        .catch(() => { setLoadingEvents(false); });
    }
  };

  const refreshMatches = () => {
    if (activeComp === '2000') {
      pronosticsApi.get('/matches')
        .then(r => setEvents(r.data))
        .catch(() => {});
    }
  };

  useEffect(() => {
    loadCompMatches(activeComp);
    pronosticsApi.get('/stats')
      .then(r => setStats(r.data))
      .catch(() => {});
    // Charger les pronostics génériques de l'IA pour le bilan (public)
    pronosticsApi.get('/pronostics/results')
      .then(r => setPronostics(prev => ({ ...r.data, ...prev })))
      .catch(() => {});
    if (user) loadQuota();

    // Polling toutes les 30s pour les scores en temps réel
    const pollInterval = setInterval(refreshMatches, 30 * 1000);
    return () => clearInterval(pollInterval);
  }, [user, activeComp]);

  const loadQuota = async () => {
    try {
      const r = await pronosticsApi.get('/auth/me');
      setQuotaUsed(r.data.quota?.used || 0);
    } catch (_) {}
  };

  const getPronostic = async (eventId) => {
    if (!user) { navigate('/login'); return; }

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
      const r = await pronosticsApi.get(`/pronostics/${eventId}`);
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
  const scheduledEvents = events.filter(e => e.statut === 'SCHEDULED' || e.statut === 'TIMED');
  const finishedEvents = [...events].filter(e => e.statut === 'FINISHED').reverse().slice(0, 12);
  // Si pas de matchs à venir, afficher les derniers résultats
  const upcomingEvents = scheduledEvents.length > 0 ? scheduledEvents : finishedEvents;
  const sectionTitle = scheduledEvents.length > 0 ? '⚽ PROCHAINS MATCHS' : '📊 DERNIERS RÉSULTATS';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🤖</span>
          <span style={{ fontWeight: 900, fontSize: 16, color: C.text, letterSpacing: '-0.02em' }}>Prono Sport</span>
          <span style={{ fontSize: 10, color: C.accent, fontWeight: 700, background: `${C.accent}15`, border: `1px solid ${C.accent}40`, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Prono Sport</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/blog" style={{ fontSize: 12, color: C.textSub, textDecoration: 'none', fontWeight: 600 }}>📝 Blog</Link>
          {user ? (
            <UserMenu user={user} plan={plan} quotaUsed={quotaUsed} QUOTA_FREE={QUOTA_FREE} logout={logout} navigate={navigate} />
          ) : (
            <Link to="/login" style={{
              background: `linear-gradient(135deg, ${C.accent}, #c62828)`,
              color: '#fff', borderRadius: 20, padding: '8px 18px',
              fontSize: 13, fontWeight: 900, textDecoration: 'none',
              boxShadow: `0 2px 12px ${C.accentGlow}`
            }}>Se connecter</Link>
          )}
        </div>
      </nav>

      {/* BARRE COMPÉTITIONS */}
      <div style={{ background: 'rgba(6,8,15,0.98)', borderBottom: '1px solid rgba(255,255,255,0.07)', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', gap: 2, padding: '0 20px', maxWidth: 1200, margin: '0 auto' }}>
          {COMPS.map(comp => (
            <button key={comp.id} onClick={() => { setActiveComp(comp.id); setPronostics({}); }} style={{
              background: activeComp === comp.id ? `${C.accent}20` : 'transparent',
              border: 'none',
              borderBottom: activeComp === comp.id ? `2px solid ${C.accent}` : '2px solid transparent',
              color: activeComp === comp.id ? C.text : C.textDim,
              padding: '12px 14px', fontSize: 12, cursor: 'pointer',
              fontWeight: activeComp === comp.id ? 800 : 400, fontFamily: 'inherit',
              whiteSpace: 'nowrap', transition: 'all 0.15s',
            }}>
              {comp.label}
            </button>
          ))}
          {[{label:'🏀 Basketball'},{label:'🎾 Tennis'},{label:'🏉 Rugby'},{label:'🏒 Hockey'}].map(s => (
            <button key={s.label} disabled style={{ background: 'transparent', border: 'none', borderBottom: '2px solid transparent', color: C.textDim, padding: '12px 14px', fontSize: 12, cursor: 'not-allowed', fontFamily: 'inherit', whiteSpace: 'nowrap', opacity: 0.4 }}>
              {s.label} <span style={{ fontSize: 9, background: 'rgba(255,255,255,0.08)', padding: '1px 4px', borderRadius: 8 }}>Bientôt</span>
            </button>
          ))}
        </div>
      </div>

      {/* HERO */}
      <div style={{
        backgroundImage: `linear-gradient(180deg, rgba(13,13,20,0.75) 0%, rgba(13,13,20,0.55) 50%, rgba(13,13,20,0.88) 100%), url('/stadium_bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        padding: '72px 20px 56px', textAlign: 'center',
        borderBottom: `1px solid rgba(255,255,255,0.08)`,
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
            ⚽ Prono Sport
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
              <Link to="/login" style={{
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
                  frozen={frozen[event.id]} plan={plan} quotaUsed={quotaUsed}
                  pronosticsApi={pronosticsApi} />
              ))}
            </div>
          </section>
        )}

        {/* Prochains matchs */}
        <section>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: C.text, marginBottom: 16, letterSpacing: '-0.02em' }}>
            {sectionTitle}
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
                  frozen={frozen[event.id]} plan={plan} quotaUsed={quotaUsed}
                  pronosticsApi={pronosticsApi} />
              ))}
            </div>
          )}
        </section>

        {/* SECTION BILAN STATS */}
        <section style={{ marginTop: 64, marginBottom: 48 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: C.accent, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Transparence</div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 900, color: C.text, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 10 }}>
              Le bilan de nos pronostics.
            </h2>
            <p style={{ fontSize: 14, color: C.textSub, maxWidth: 480, lineHeight: 1.7 }}>
              On ne cache pas nos erreurs. Voici les derniers matchs joués : ce que notre IA avait prédit, le résultat réel, et si on était dans le vrai.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {[
              {
                pct: stats ? `${stats.bestCorrect.pct}%` : '—',
                label: 'Bon résultat (1·N·2)',
                sub: stats ? `${stats.bestCorrect.count}/${stats.bestCorrect.total} matchs · ${stats.bestCorrect.label}` : 'Calcul en cours...',
                color: C.green
              },
              {
                pct: stats ? `${stats.bestScoreExact.pct}%` : '—',
                label: 'Score exact',
                sub: stats ? `${stats.bestScoreExact.count}/${stats.bestScoreExact.total} matchs · ${stats.bestScoreExact.label}` : 'Calcul en cours...',
                color: C.gold
              },

            ].map(({ pct, label, sub, color }) => (
              <div key={label} style={{
                background: C.bgCard, border: `1px solid ${C.border}`,
                borderRadius: 14, padding: '24px 20px', textAlign: 'center'
              }}>
                <div style={{ fontSize: 42, fontWeight: 900, color, filter: `drop-shadow(0 0 12px ${color}60)`, marginBottom: 8 }}>{pct}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.5 }}>{sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* RÉSULTATS PASSÉS */}
        {finishedEvents.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {finishedEvents.map(event => {
                const p = pronostics[event.id];
                const scoreReel = `${event.score_p1 ?? '?'}-${event.score_p2 ?? '?'}`;
                const gagnantReel = event.score_p1 > event.score_p2 ? event.participant1
                  : event.score_p2 > event.score_p1 ? event.participant2 : 'Nul';
                const iaOk = p && (p.favori === gagnantReel || (gagnantReel === 'Nul' && p.favori?.toLowerCase().includes('nul')));
                const badge = !p ? null
                  : iaOk ? { label: '✓ Correct', color: C.green, bg: `${C.green}12`, border: `${C.green}40` }
                  : { label: '✕ Manqué', color: C.accent, bg: `${C.accent}10`, border: `${C.accent}40` };
                return (
                  <div key={event.id} style={{
                    background: C.bgCard,
                    border: `1px solid ${badge ? badge.border : 'rgba(255,255,255,0.05)'}`,
                    borderLeft: `3px solid ${badge ? badge.color : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 10, padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap'
                  }}>
                    {/* Equipe 1 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
                      {event.participant1_logo && <img src={event.participant1_logo} alt="" style={{ width: 24, height: 24, objectFit: 'contain', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.6))' }} />}
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{event.participant1}</span>
                    </div>
                    {/* Score */}
                    <div style={{
                      fontSize: 18, fontWeight: 900, color: C.text,
                      background: 'rgba(255,255,255,0.06)', borderRadius: 8,
                      padding: '4px 14px', letterSpacing: '-0.02em', flexShrink: 0
                    }}>{scoreReel}</div>
                    {/* Equipe 2 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{event.participant2}</span>
                      {event.participant2_logo && <img src={event.participant2_logo} alt="" style={{ width: 24, height: 24, objectFit: 'contain', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.6))' }} />}
                    </div>
                    {/* Prédiction IA */}
                    <div style={{ flex: 1, fontSize: 12, color: C.textDim, minWidth: 120 }}>
                      {p && (
                        <span>IA : <strong style={{ color: C.textSub }}>{p.favori}</strong>{p.score_exact ? <span style={{ color: C.textDim }}> · {p.score_exact}</span> : null}</span>
                      )}
                    </div>
                    {/* Badge */}
                    {badge && (
                      <div style={{ fontSize: 11, fontWeight: 800, color: badge.color, background: badge.bg, border: `1px solid ${badge.border}`, padding: '4px 14px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {badge.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer style={{ marginTop: 64, paddingTop: 40, borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 32, marginBottom: 40 }}>
            {/* Marque */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>🤖</span>
                <span style={{ fontWeight: 900, color: C.text, fontSize: 15 }}>Prono Sport</span>
              </div>
              <p style={{ fontSize: 12, color: C.textDim, lineHeight: 1.7, margin: 0 }}>
                Pronostics sportifs générés par intelligence artificielle pour la Prono Sport.
              </p>
            </div>
            {/* Navigation */}
            <div>
              <div style={{ fontSize: 11, color: C.textSub, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Navigation</div>
              {[{label: '⚽ Pronostics', path: '/'}, {label: '📝 Blog & Analyses', path: '/blog'}, {label: '💳 Abonnements', path: '/abonnement'}, {label: '📊 Mon espace', path: '/dashboard'}].map(l => (
                <Link key={l.path} to={l.path} style={{ display: 'block', fontSize: 13, color: C.textDim, textDecoration: 'none', marginBottom: 6, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = C.text} onMouseLeave={e => e.target.style.color = C.textDim}>
                  {l.label}
                </Link>
              ))}
            </div>
            {/* Légal */}
            <div>
              <div style={{ fontSize: 11, color: C.textSub, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Légal</div>
              {[{label: '🔒 Politique de confidentialité', path: '/rgpd'}, {label: '📄 Conditions Générales de Vente', path: '/cgv'}, {label: '📧 Nous contacter', path: '/contact'}].map(l => (
                <Link key={l.path} to={l.path} style={{ display: 'block', fontSize: 13, color: C.textDim, textDecoration: 'none', marginBottom: 6, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = C.text} onMouseLeave={e => e.target.style.color = C.textDim}>
                  {l.label}
                </Link>
              ))}
            </div>
            {/* Contact */}
            <div>
              <div style={{ fontSize: 11, color: C.textSub, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Contact</div>
              <a href="mailto:contact@prono-sport.io" style={{ display: 'block', fontSize: 13, color: C.textDim, textDecoration: 'none', marginBottom: 6 }}>contact@prono-sport.io</a>
              <div style={{ fontSize: 11, color: C.textDim, marginTop: 12, lineHeight: 1.6 }}>
                ⚠️ Les pronostics sont fournis à titre informatif uniquement. Jouez de manière responsable.
              </div>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 12, color: C.textDim }}>© 2026 Prono Sport — Tous droits réservés</div>
            <div style={{ fontSize: 11, color: C.textDim }}>Propulsé par l'IA · Données football-data.org · Hébergé sur Clever Cloud</div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }
      `}</style>
    </div>
  );
}
