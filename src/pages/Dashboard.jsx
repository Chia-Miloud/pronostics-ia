import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePronostics } from '../usePronostics';
import NavMenu from '../components/NavMenu';

const C = {
  bg: '#0a0e1a', bgCard: '#111827', bgCardHover: '#151d2e',
  border: 'rgba(255,255,255,0.08)', borderHover: 'rgba(255,255,255,0.15)',
  text: '#f1f5f9', textSub: '#94a3b8', textDim: '#475569',
  gold: '#fbbf24', accent: '#e53e3e', live: '#22c55e', blue: '#4f8ef7',
};

const PLAN_COLORS = { free: '#94a3b8', ai_plus: '#fbbf24', ai_premium: '#e53e3e' };
const PLAN_LABELS = { free: 'Gratuit', ai_plus: '🚀 AI Plus', ai_premium: '🧠 AI Premium' };

export default function Dashboard() {
  const { user, plan, pronosticsApi, logout } = usePronostics();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    pronosticsApi.get('/auth/me')
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const tabs = [
    { id: 'dashboard', label: '📊 Tableau de bord' },
    { id: 'account', label: '👤 Mon compte' },
    { id: 'subscription', label: '💳 Abonnement' },
  ];

  if (!user) return null;
  const fullUser = data?.user || user;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <NavMenu backLabel="← Retour aux pronostics" backPath="/" centerLabel="📊 Mon espace" />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px' }}>
        {/* Profil rapide */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 56, height: 56, background: `linear-gradient(135deg, ${C.accent}, ${C.gold})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
            {(fullUser.prenom || fullUser.email)?.[0]?.toUpperCase() || '?'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900, fontSize: 18, color: C.text, letterSpacing: '-0.02em' }}>
              {fullUser.prenom ? `${fullUser.prenom} ${fullUser.nom || ''}`.trim() : fullUser.pseudo || fullUser.email}
            </div>
            <div style={{ fontSize: 13, color: C.textSub, marginTop: 2 }}>{fullUser.email}</div>
          </div>
          <div style={{ background: PLAN_COLORS[plan] + '20', color: PLAN_COLORS[plan], border: `1px solid ${PLAN_COLORS[plan]}40`, borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 900 }}>
            {PLAN_LABELS[plan] || plan}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 4 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, background: activeTab === tab.id ? C.bgCard : 'transparent',
              border: activeTab === tab.id ? `1px solid ${C.border}` : '1px solid transparent',
              color: activeTab === tab.id ? C.text : C.textDim,
              borderRadius: 10, padding: '10px 8px', fontSize: 12, cursor: 'pointer',
              fontWeight: activeTab === tab.id ? 700 : 400, fontFamily: 'inherit',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: C.textSub }}>Chargement...</div>
        ) : (
          <>
            {activeTab === 'dashboard' && <DashboardTab data={data} plan={plan} navigate={navigate} />}
            {activeTab === 'account' && <AccountTab user={fullUser} pronosticsApi={pronosticsApi} onUpdate={(u) => setData(prev => ({ ...prev, user: u }))} />}
            {activeTab === 'subscription' && <SubscriptionTab plan={plan} pronosticsApi={pronosticsApi} navigate={navigate} />}
          </>
        )}
      </div>
    </div>
  );
}

// ─── ONGLET TABLEAU DE BORD ───────────────────────────────────────────────────
function DashboardTab({ data, plan, navigate }) {
  const quota = data?.quota;
  const QUOTA_MAX = plan === 'free' ? 3 : '∞';
  const planColor = PLAN_COLORS[plan] || C.textDim;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {[
          { label: "Pronostics aujourd'hui", value: `${quota?.used || 0} / ${QUOTA_MAX}`, color: C.gold },
          { label: 'Plan actuel', value: PLAN_LABELS[plan] || plan, color: planColor },
          { label: 'Score exact', value: plan !== 'free' ? '✅ Inclus' : '🔒 AI Plus', color: plan !== 'free' ? C.live : C.textDim },
          { label: 'Live IA Coach', value: plan === 'ai_premium' ? '✅ Actif' : '🔒 Premium', color: plan === 'ai_premium' ? C.live : C.textDim },
        ].map((stat, i) => (
          <div key={i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{stat.label}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Upgrade CTA si free */}
      {plan === 'free' && (
        <div style={{ background: `linear-gradient(135deg, ${C.accent}15, ${C.gold}10)`, border: `1px solid ${C.accent}30`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontWeight: 800, color: C.text, marginBottom: 4 }}>🚀 Passez à AI Plus ou Premium</div>
          <div style={{ fontSize: 13, color: C.textSub, marginBottom: 12 }}>Analyses illimitées + score exact probable + explication détaillée</div>
          <button onClick={() => navigate('/abonnement')} style={{ background: `linear-gradient(135deg, ${C.accent}, #c62828)`, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 900, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            Voir les plans →
          </button>
        </div>
      )}

      <button onClick={() => navigate('/')} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, color: C.textSub, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>⚽ Voir les matchs du jour</span>
        <span>→</span>
      </button>
    </div>
  );
}

// ─── ONGLET MON COMPTE ────────────────────────────────────────────────────────
function AccountTab({ user, pronosticsApi, onUpdate }) {
  const [form, setForm] = useState({ prenom: user.prenom || '', nom: user.nom || '', telephone: user.telephone || '' });
  const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [msg, setMsg] = useState(null);
  const [pwMsg, setPwMsg] = useState(null);

  const saveProfile = async () => {
    setSaving(true); setMsg(null);
    try {
      await pronosticsApi.put('/auth/profile', form);
      onUpdate({ ...user, ...form });
      setMsg({ type: 'success', text: '✅ Profil mis à jour !' });
    } catch (e) {
      setMsg({ type: 'error', text: e.response?.data?.error || 'Erreur lors de la sauvegarde' });
    } finally { setSaving(false); }
  };

  const savePassword = async () => {
    if (pwForm.new !== pwForm.confirm) { setPwMsg({ type: 'error', text: 'Les mots de passe ne correspondent pas' }); return; }
    if (pwForm.new.length < 6) { setPwMsg({ type: 'error', text: 'Minimum 6 caractères' }); return; }
    setSavingPw(true); setPwMsg(null);
    try {
      await pronosticsApi.put('/auth/password', { currentPassword: pwForm.current, newPassword: pwForm.new });
      setPwForm({ current: '', new: '', confirm: '' });
      setPwMsg({ type: 'success', text: '✅ Mot de passe modifié !' });
    } catch (e) {
      setPwMsg({ type: 'error', text: e.response?.data?.error || 'Erreur' });
    } finally { setSavingPw(false); }
  };

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 14px', color: C.text, fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' };
  const labelStyle = { fontSize: 11, color: C.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'block' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Infos personnelles */}
      <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 20 }}>Informations personnelles</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Prénom</label>
            <input style={inputStyle} value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} placeholder="Votre prénom" />
          </div>
          <div>
            <label style={labelStyle}>Nom</label>
            <input style={inputStyle} value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder="Votre nom" />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Email</label>
          <input style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} value={user.email} disabled />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Téléphone</label>
          <input style={inputStyle} value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} placeholder="+33 6 00 00 00 00" />
        </div>
        {msg && <div style={{ background: msg.type === 'success' ? `${C.live}15` : `${C.accent}15`, border: `1px solid ${msg.type === 'success' ? C.live : C.accent}40`, borderRadius: 8, padding: '8px 14px', fontSize: 13, color: msg.type === 'success' ? C.live : C.accent, marginBottom: 12 }}>{msg.text}</div>}
        <button onClick={saveProfile} disabled={saving} style={{ background: `linear-gradient(135deg, ${C.blue}, #2563eb)`, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          {saving ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
        </button>
      </div>

      {/* Mot de passe */}
      <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 20 }}>Changer le mot de passe</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Mot de passe actuel', key: 'current' },
            { label: 'Nouveau mot de passe', key: 'new' },
            { label: 'Confirmer le nouveau', key: 'confirm' },
          ].map(({ label, key }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input type="password" style={inputStyle} value={pwForm[key]} onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
        </div>
        {pwMsg && <div style={{ background: pwMsg.type === 'success' ? `${C.live}15` : `${C.accent}15`, border: `1px solid ${pwMsg.type === 'success' ? C.live : C.accent}40`, borderRadius: 8, padding: '8px 14px', fontSize: 13, color: pwMsg.type === 'success' ? C.live : C.accent, marginBottom: 12 }}>{pwMsg.text}</div>}
        <button onClick={savePassword} disabled={savingPw} style={{ background: 'rgba(255,255,255,0.08)', color: C.text, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 24px', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          {savingPw ? '⏳...' : '🔐 Changer le mot de passe'}
        </button>
      </div>
    </div>
  );
}

// ─── ONGLET ABONNEMENT ────────────────────────────────────────────────────────
function SubscriptionTab({ plan, pronosticsApi, navigate }) {
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const PLANS = [
    {
      id: 'free', label: 'Gratuit', price: '0€', color: C.textDim,
      features: ['3 matchs distincts / jour', 'Probabilités 1/N/2', 'Bilan vérifié dès échantillon suffisant'],
      current: plan === 'free',
    },
    {
      id: 'ai_plus', label: '🚀 AI Plus', price: '4,99€/mois', color: C.gold,
      features: ['Analyses illimitées', 'Score exact probable', 'Probabilités 1/N/2', 'Analyse détaillée'],
      current: plan === 'ai_plus',
      upgrade: plan === 'free',
      downgrade: plan === 'ai_premium',
    },
    {
      id: 'ai_premium', label: '🧠 AI Premium', price: '9,99€/mois', color: C.accent,
      features: ['Tout AI Plus', 'Live IA Coach en direct', 'Questions IA pendant les matchs', 'Priorité support'],
      current: plan === 'ai_premium',
      upgrade: plan === 'free' || plan === 'ai_plus',
    },
  ];

  const handleUpgrade = async (targetPlan) => {
    setLoading(true); setMsg(null);
    try {
      const r = await pronosticsApi.post('/subscription/checkout', { plan: targetPlan });
      if (r.data.url) window.location.href = r.data.url;
    } catch (e) {
      setMsg({ type: 'error', text: e.response?.data?.error || 'Erreur lors du paiement' });
    } finally { setLoading(false); }
  };

  const handlePortal = async () => {
    setLoading(true); setMsg(null);
    try {
      const r = await pronosticsApi.post('/subscription/portal');
      if (r.data.url) window.location.href = r.data.url;
    } catch (e) {
      setMsg({ type: 'error', text: e.response?.data?.error || 'Erreur portail Stripe' });
    } finally { setLoading(false); }
  };

  const handleCancel = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ? Vous conserverez votre accès jusqu\'à la fin de la période en cours.')) return;
    setCancelLoading(true); setMsg(null);
    try {
      await pronosticsApi.post('/subscription/cancel');
      setMsg({ type: 'success', text: '✅ Abonnement annulé. Votre accès reste actif jusqu\'à la fin de la période.' });
    } catch (e) {
      setMsg({ type: 'error', text: e.response?.data?.error || 'Erreur annulation' });
    } finally { setCancelLoading(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {msg && (
        <div style={{ background: msg.type === 'success' ? `${C.live}15` : `${C.accent}15`, border: `1px solid ${msg.type === 'success' ? C.live : C.accent}40`, borderRadius: 10, padding: '12px 16px', fontSize: 13, color: msg.type === 'success' ? C.live : C.accent }}>
          {msg.text}
        </div>
      )}

      {/* Plans */}
      {PLANS.map(p => (
        <div key={p.id} style={{
          background: p.current ? `${p.color}10` : C.bgCard,
          border: `1px solid ${p.current ? p.color + '50' : C.border}`,
          borderRadius: 14, padding: 20, position: 'relative', overflow: 'hidden',
        }}>
          {p.current && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${p.color}, transparent)` }} />
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: p.current ? p.color : C.text }}>{p.label}</div>
              <div style={{ fontSize: 14, color: C.textSub, marginTop: 2 }}>{p.price}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {p.current && (
                <span style={{ background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}40`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 900 }}>
                  ✓ Plan actuel
                </span>
              )}
              {p.upgrade && (
                <button onClick={() => handleUpgrade(p.id)} disabled={loading} style={{
                  background: `linear-gradient(135deg, ${p.color}, ${p.id === 'ai_premium' ? '#c62828' : '#ff8c00'})`,
                  color: p.id === 'ai_plus' ? '#000' : '#fff', border: 'none', borderRadius: 20,
                  padding: '6px 16px', fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  {loading ? '⏳...' : `Passer à ${p.label}`}
                </button>
              )}
              {p.downgrade && (
                <button onClick={() => handleUpgrade(p.id)} disabled={loading} style={{
                  background: 'rgba(255,255,255,0.06)', color: C.textDim, border: `1px solid ${C.border}`,
                  borderRadius: 20, padding: '5px 14px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  Rétrograder
                </button>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {p.features.map(f => (
              <span key={f} style={{ fontSize: 11, color: p.current ? C.textSub : C.textDim, background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: 20 }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* Gestion abonnement Stripe */}
      {plan !== 'free' && (
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginBottom: 12 }}>Gérer mon abonnement</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={handlePortal} disabled={loading} style={{
              background: `linear-gradient(135deg, ${C.blue}, #2563eb)`, color: '#fff', border: 'none',
              borderRadius: 10, padding: '10px 20px', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {loading ? '⏳...' : '💳 Portail de facturation Stripe'}
            </button>
            <button onClick={handleCancel} disabled={cancelLoading} style={{
              background: 'transparent', color: C.textDim, border: `1px solid rgba(255,255,255,0.1)`,
              borderRadius: 10, padding: '10px 20px', fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {cancelLoading ? '⏳...' : 'Annuler l\'abonnement'}
            </button>
          </div>
          <div style={{ fontSize: 11, color: C.textDim, marginTop: 10 }}>
            Sans engagement · Annulable à tout moment · Accès conservé jusqu'à la fin de la période
          </div>
        </div>
      )}
    </div>
  );
}
