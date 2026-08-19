import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePronostics } from '../usePronostics';
import NavMenu from '../components/NavMenu';

const C = {
  bg: '#0a0e1a', bgCard: '#111827', bgCardHover: '#151d2e',
  border: 'rgba(255,255,255,0.08)', borderHover: 'rgba(255,255,255,0.15)',
  text: '#f1f5f9', textSub: '#94a3b8', textDim: '#475569',
  gold: '#fbbf24', accent: '#e53e3e', live: '#22c55e',
};

const ADMIN_EMAILS = ['miloudchia@gmail.com', 'miloudc@hotmail.com'];
const PLAN_LABELS = { free: 'Gratuit', ai_plus: 'AI Plus', ai_premium: 'AI Premium' };
const PLAN_COLORS = { free: C.textDim, ai_plus: '#3b82f6', ai_premium: C.gold };

export default function Admin() {
  const { user, pronosticsApi } = usePronostics();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsPeriod, setAnalyticsPeriod] = useState('30');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [msg, setMsg] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (!ADMIN_EMAILS.includes(user.email)) { navigate('/'); return; }
    loadAll();
  }, [user]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsR, usersR, articlesR] = await Promise.all([
        pronosticsApi.get('/admin/stats'),
        pronosticsApi.get('/admin/users'),
        pronosticsApi.get('/articles/admin/all'),
      ]);
      setStats(statsR.data);
      setUsers(usersR.data);
      setArticles(articlesR.data);
    } catch (e) { setMsg({ type: 'error', text: e.response?.data?.error || 'Erreur chargement' }); }
    finally { setLoading(false); }
  };

  const changePlan = async (userId, plan) => {
    try {
      await pronosticsApi.put(`/admin/users/${userId}/plan`, { plan });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan } : u));
      if (userDetail?.user?.id === userId) setUserDetail(prev => ({ ...prev, user: { ...prev.user, plan } }));
      setMsg({ type: 'success', text: 'Plan mis à jour !' });
    } catch { setMsg({ type: 'error', text: 'Erreur' }); }
  };

  const resetPassword = async (userId, newPassword) => {
    if (!newPassword || newPassword.length < 8) { setMsg({ type: 'error', text: 'Mot de passe trop court' }); return; }
    try {
      await pronosticsApi.put(`/admin/users/${userId}/reset-password`, { newPassword });
      setMsg({ type: 'success', text: 'Mot de passe réinitialisé !' });
    } catch { setMsg({ type: 'error', text: 'Erreur' }); }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Supprimer cet utilisateur et tous ses pronostics ?')) return;
    try {
      await pronosticsApi.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setSelectedUser(null); setUserDetail(null);
      setMsg({ type: 'success', text: 'Utilisateur supprimé' });
    } catch { setMsg({ type: 'error', text: 'Erreur suppression' }); }
  };

  const loadUserDetail = async (userId) => {
    setSelectedUser(userId);
    try {
      const r = await pronosticsApi.get(`/admin/users/${userId}`);
      setUserDetail(r.data);
    } catch { setMsg({ type: 'error', text: 'Erreur chargement détail' }); }
  };

  const syncMatches = async () => {
    setSyncing(true);
    try {
      const r = await pronosticsApi.post('/admin/sync-matches');
      setMsg({ type: 'success', text: `✅ ${r.data.updated} matchs synchronisés` });
    } catch (e) { setMsg({ type: 'error', text: e.response?.data?.error || 'Erreur sync' }); }
    finally { setSyncing(false); }
  };

  const generateArticle = async () => {
    setGenerating(true);
    try {
      const r = await pronosticsApi.post('/articles/generate');
      setArticles(prev => [r.data.article, ...prev]);
      setMsg({ type: 'success', text: `✅ Article généré : "${r.data.article.titre}"` });
    } catch (e) { setMsg({ type: 'error', text: e.response?.data?.error || 'Erreur génération' }); }
    finally { setGenerating(false); }
  };

  const togglePublish = async (articleId, publie) => {
    try {
      await pronosticsApi.put(`/articles/${articleId}/publish`, { publie });
      setArticles(prev => prev.map(a => a.id === articleId ? { ...a, publie } : a));
    } catch { setMsg({ type: 'error', text: 'Erreur' }); }
  };

  const deleteArticle = async (articleId) => {
    if (!confirm('Supprimer cet article ?')) return;
    try {
      await pronosticsApi.delete(`/articles/${articleId}`);
      setArticles(prev => prev.filter(a => a.id !== articleId));
    } catch { setMsg({ type: 'error', text: 'Erreur suppression' }); }
  };

  const loadAnalytics = async (period) => {
    setAnalyticsLoading(true);
    try {
      const r = await pronosticsApi.get(`/analytics/stats?period=${period || analyticsPeriod}`);
      setAnalytics(r.data);
    } catch (e) { setMsg({ type: 'error', text: 'Erreur analytics: ' + (e.response?.data?.error || e.message) }); }
    finally { setAnalyticsLoading(false); }
  };

  if (!user || !ADMIN_EMAILS.includes(user.email)) return null;

  const tabs = [
    { id: 'stats', label: '📊 Stats' },
    { id: 'analytics', label: '📈 Visites' },
    { id: 'users', label: `👥 Clients (${users.length})` },
    { id: 'articles', label: `📝 Articles (${articles.length})` },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <NavMenu backLabel="← Retour" backPath="/" centerLabel="🔐 Panel Admin" />
      {/* Bouton sync matchs */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 20px 0', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={syncMatches} disabled={syncing} style={{ background: 'rgba(34,197,94,0.1)', border: `1px solid ${C.live}40`, color: C.live, borderRadius: 8, padding: '7px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}>
          {syncing ? '⏳' : '🔄'} Sync matchs
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>
        {msg && (
          <div onClick={() => setMsg(null)} style={{ background: msg.type === 'success' ? `${C.live}15` : `${C.accent}15`, border: `1px solid ${msg.type === 'success' ? C.live : C.accent}40`, borderRadius: 10, padding: '10px 16px', fontSize: 13, color: msg.type === 'success' ? C.live : C.accent, marginBottom: 16, cursor: 'pointer' }}>
            {msg.text} <span style={{ opacity: 0.5, float: 'right' }}>×</span>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 4 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); if (tab.id === 'analytics' && !analytics) loadAnalytics(); }} style={{
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
          <div style={{ textAlign: 'center', padding: '60px', color: C.textSub }}>Chargement...</div>
        ) : (
          <>
            {/* STATS */}
            {activeTab === 'stats' && stats && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                  {[
                    { label: 'Utilisateurs', value: stats.totalUsers, color: '#3b82f6' },
                    { label: 'Pronostics générés', value: stats.totalPronostics, color: C.gold },
                    { label: 'AI Premium', value: stats.planBreakdown?.find(p => p.plan === 'ai_premium')?.count || 0, color: C.gold },
                    { label: 'AI Plus', value: stats.planBreakdown?.find(p => p.plan === 'ai_plus')?.count || 0, color: '#3b82f6' },
                    { label: 'Gratuit', value: stats.planBreakdown?.find(p => p.plan === 'free')?.count || 0, color: C.textDim },
                    { label: 'Matchs en direct', value: stats.matchStats?.find(m => m.statut === 'IN_PLAY')?.count || 0, color: C.live },
                  ].map((s, i) => (
                    <div key={i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
                      <div style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{s.label}</div>
                      <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {/* Derniers inscrits */}
                  <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: C.text, marginBottom: 14 }}>Derniers inscrits</div>
                    {stats.recentUsers?.map(u => (
                      <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                        <div>
                          <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{u.prenom || u.email.split('@')[0]}</div>
                          <div style={{ fontSize: 11, color: C.textDim }}>{u.email}</div>
                        </div>
                        <span style={{ background: PLAN_COLORS[u.plan] + '20', color: PLAN_COLORS[u.plan], fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>
                          {PLAN_LABELS[u.plan]}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Derniers pronostics */}
                  <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: C.text, marginBottom: 14 }}>Derniers pronostics</div>
                    {stats.recentPronostics?.map(p => (
                      <div key={p.id} style={{ padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                        <div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{p.equipe1} vs {p.equipe2}</div>
                        <div style={{ fontSize: 11, color: C.textDim }}>{p.prenom || p.email.split('@')[0]} · {new Date(p.created_at).toLocaleDateString('fr-FR')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* USERS */}
            {activeTab === 'users' && (
              <div style={{ display: 'grid', gridTemplateColumns: selectedUser ? '1fr 380px' : '1fr', gap: 16 }}>
                {/* Liste */}
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>Tous les clients ({users.length})</div>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                          {['Nom', 'Email', 'Plan', 'Pronos', 'Connexions', 'Dernière connexion', 'Inscription', ''].map(h => (
                            <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, color: C.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id} onClick={() => loadUserDetail(u.id)}
                            style={{ borderTop: `1px solid ${C.border}`, cursor: 'pointer', background: selectedUser === u.id ? 'rgba(255,255,255,0.04)' : 'transparent', transition: 'background 0.15s' }}>
                            <td style={{ padding: '12px 16px', fontSize: 13, color: C.text, fontWeight: 600 }}>{u.prenom || '—'} {u.nom || ''}</td>
                            <td style={{ padding: '12px 16px', fontSize: 12, color: C.textSub }}>{u.email}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ background: PLAN_COLORS[u.plan] + '20', color: PLAN_COLORS[u.plan], fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>
                                {PLAN_LABELS[u.plan]}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', fontSize: 13, color: C.textSub, textAlign: 'center' }}>{u.nb_pronostics}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                              <span style={{ fontSize: 12, color: u.nb_logins > 0 ? C.live : C.textDim, fontWeight: u.nb_logins > 0 ? 700 : 400 }}>
                                {u.nb_logins || 0}x
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', fontSize: 11, whiteSpace: 'nowrap' }}>
                              {u.last_login ? (
                                <span style={{ color: (() => {
                                  const diff = (Date.now() - new Date(u.last_login)) / (1000 * 60 * 60);
                                  return diff < 24 ? C.live : diff < 72 ? C.gold : C.textDim;
                                })() }}>
                                  {new Date(u.last_login).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              ) : <span style={{ color: C.textDim }}>Jamais</span>}
                            </td>
                            <td style={{ padding: '12px 16px', fontSize: 11, color: C.textDim, whiteSpace: 'nowrap' }}>{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                            <td style={{ padding: '12px 16px', fontSize: 12, color: C.accent }}>→</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Détail utilisateur */}
                {selectedUser && userDetail && (
                  <UserDetailPanel
                    user={userDetail.user}
                    pronostics={userDetail.pronostics}
                    onChangePlan={changePlan}
                    onResetPassword={resetPassword}
                    onDelete={deleteUser}
                    onClose={() => { setSelectedUser(null); setUserDetail(null); }}
                  />
                )}
              </div>
            )}

            {/* ANALYTICS */}
            {activeTab === 'analytics' && (
              <AnalyticsTab
                analytics={analytics}
                loading={analyticsLoading}
                period={analyticsPeriod}
                onPeriodChange={(p) => { setAnalyticsPeriod(p); loadAnalytics(p); }}
                onRefresh={() => loadAnalytics()}
              />
            )}

            {/* ARTICLES */}
            {activeTab === 'articles' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button onClick={generateArticle} disabled={generating} style={{ background: `linear-gradient(135deg, ${C.accent}, #c62828)`, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 900, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {generating ? '⏳ Génération...' : '🤖 Générer un article IA'}
                  </button>
                </div>

                {articles.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', background: C.bgCard, borderRadius: 14, border: `1px solid ${C.border}`, color: C.textSub }}>
                    Aucun article. Cliquez sur "Générer un article IA" pour commencer.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {articles.map(a => (
                      <div key={a.id} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>{a.titre}</div>
                          <div style={{ fontSize: 11, color: C.textDim }}>{new Date(a.created_at).toLocaleDateString('fr-FR')} · {a.vues} vues</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ background: a.publie ? `${C.live}20` : 'rgba(255,255,255,0.05)', color: a.publie ? C.live : C.textDim, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                            {a.publie ? '✅ Publié' : '⏸ Brouillon'}
                          </span>
                          <button onClick={() => togglePublish(a.id, !a.publie)} style={{ background: a.publie ? 'rgba(255,255,255,0.06)' : `${C.live}20`, color: a.publie ? C.textDim : C.live, border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 11, cursor: 'pointer', fontWeight: 700 }}>
                            {a.publie ? 'Dépublier' : 'Publier'}
                          </button>
                          <button onClick={() => deleteArticle(a.id)} style={{ background: `${C.accent}15`, color: C.accent, border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 11, cursor: 'pointer', fontWeight: 700 }}>
                            🗑
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── PANNEAU DÉTAIL UTILISATEUR ───────────────────────────────────────────────
function UserDetailPanel({ user, pronostics, onChangePlan, onResetPassword, onDelete, onClose }) {
  const [newPw, setNewPw] = useState('');
  const [editingPlan, setEditingPlan] = useState(false);

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '80vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>Détail client</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textDim, cursor: 'pointer', fontSize: 18 }}>×</button>
      </div>

      {/* Infos */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: C.text, marginBottom: 4 }}>{user.prenom || ''} {user.nom || ''}</div>
        <div style={{ fontSize: 12, color: C.textSub, marginBottom: 2 }}>{user.email}</div>
        {user.telephone && <div style={{ fontSize: 12, color: C.textDim }}>{user.telephone}</div>}
        <div style={{ fontSize: 11, color: C.textDim, marginTop: 6 }}>Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}</div>
      </div>

      {/* Plan */}
      <div>
        <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8, fontWeight: 700, textTransform: 'uppercase' }}>Plan actuel</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['free', 'ai_plus', 'ai_premium'].map(p => (
            <button key={p} onClick={() => onChangePlan(user.id, p)} style={{
              flex: 1, background: user.plan === p ? PLAN_COLORS[p] + '25' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${user.plan === p ? PLAN_COLORS[p] + '60' : C.border}`,
              color: user.plan === p ? PLAN_COLORS[p] : C.textDim,
              borderRadius: 8, padding: '8px 4px', fontSize: 10, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit',
            }}>
              {PLAN_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Reset password */}
      <div>
        <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8, fontWeight: 700, textTransform: 'uppercase' }}>Réinitialiser le mot de passe</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Nouveau mot de passe" type="password"
            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, borderRadius: 8, padding: '9px 12px', color: C.text, fontSize: 12, fontFamily: 'inherit', outline: 'none' }} />
          <button onClick={() => { onResetPassword(user.id, newPw); setNewPw(''); }}
            style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: C.text, borderRadius: 8, padding: '9px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 700 }}>
            OK
          </button>
        </div>
      </div>

      {/* Historique pronostics */}
      {pronostics?.length > 0 && (
        <div>
          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8, fontWeight: 700, textTransform: 'uppercase' }}>Historique ({pronostics.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflowY: 'auto' }}>
            {pronostics.map(p => (
              <div key={p.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 12px' }}>
                <div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{p.equipe1} vs {p.equipe2}</div>
                <div style={{ fontSize: 10, color: C.textDim }}>{new Date(p.created_at).toLocaleDateString('fr-FR')} · {p.favori || '—'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supprimer */}
      <button onClick={() => onDelete(user.id)} style={{ background: `${C.accent}10`, border: `1px solid ${C.accent}30`, color: C.accent, borderRadius: 10, padding: '10px', fontSize: 12, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}>
        🗑 Supprimer ce compte
      </button>
    </div>
  );
}

// ─── ONGLET ANALYTICS ─────────────────────────────────────────────────────────
function AnalyticsTab({ analytics, loading, period, onPeriodChange, onRefresh }) {
  const PAGE_LABELS = {
    '/': 'Accueil (Pronostics)',
    '/blog': 'Blog',
    '/abonnement': 'Abonnements',
    '/dashboard': 'Mon espace',
    '/login': 'Connexion',
    '/contact': 'Contact',
    '/rgpd': 'RGPD',
    '/cgv': 'CGV',
    '/admin': 'Admin',
  };

  const SOURCE_ICONS = {
    'Direct': '🔗', 'Google': '🔍', 'Facebook': '📘',
    'Instagram': '📸', 'TikTok': '🎵', 'Twitter/X': '🐦',
    'YouTube': '▶️', 'prono-sport.io': '⚽', 'Autre': '🌐',
  };

  // Calcul du max pour les barres
  const maxViews = analytics?.dailyStats?.reduce((m, d) => Math.max(m, d.views), 1) || 1;

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px', color: C.textSub }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
      Chargement des analytics...
    </div>
  );

  if (!analytics) return (
    <div style={{ textAlign: 'center', padding: '60px', color: C.textSub }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>📈</div>
      <p>Cliquez sur l'onglet "Visites" pour charger les données.</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header avec sélecteur de période */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { val: '7', label: '7j' },
            { val: '30', label: '30j' },
            { val: '90', label: '90j' },
          ].map(p => (
            <button key={p.val} onClick={() => onPeriodChange(p.val)} style={{
              background: period === p.val ? C.accent : 'rgba(255,255,255,0.06)',
              color: period === p.val ? '#fff' : C.textSub,
              border: 'none', borderRadius: 8, padding: '6px 14px',
              fontSize: 12, cursor: 'pointer', fontWeight: period === p.val ? 700 : 400, fontFamily: 'inherit',
            }}>{p.label}</button>
          ))}
        </div>
        <button onClick={onRefresh} style={{ background: 'rgba(34,197,94,0.1)', border: `1px solid ${C.live}40`, color: C.live, borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}>
          🔄 Actualiser
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
        {[
          { label: 'Pages vues', value: analytics.totalViews?.toLocaleString('fr-FR'), color: '#4f8ef7', sub: `${analytics.period}j` },
          { label: 'Visiteurs uniques', value: analytics.uniqueVisitors?.toLocaleString('fr-FR'), color: '#a855f7', sub: `${analytics.period}j` },
          { label: "Aujourd'hui", value: analytics.todayViews?.toLocaleString('fr-FR'), color: C.gold, sub: 'pages vues' },
          { label: 'Uniques aujourd\'hui', value: analytics.todayUnique?.toLocaleString('fr-FR'), color: C.live, sub: 'visiteurs' },
          { label: 'En ce moment', value: analytics.realtimeActive || 0, color: C.accent, sub: '5 dernières min', blink: true },
        ].map((kpi, i) => (
          <div key={i} style={{ background: C.bgCard, border: `1px solid ${kpi.color}30`, borderRadius: 12, padding: 16, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${kpi.color}, transparent)` }} />
            <div style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{kpi.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: kpi.color, filter: `drop-shadow(0 0 8px ${kpi.color}40)` }}>
              {kpi.blink && kpi.value > 0 ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, background: kpi.color, borderRadius: '50%', display: 'inline-block', animation: 'blink 1s infinite' }} />
                  {kpi.value}
                </span>
              ) : kpi.value}
            </div>
            <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Graphique en barres (courbe journalière) */}
      {analytics.dailyStats?.length > 0 && (
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginBottom: 16 }}>
            📈 Évolution des visites ({analytics.period}j)
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120, overflowX: 'auto', paddingBottom: 8 }}>
            {analytics.dailyStats.map((day, i) => {
              const h = Math.max(4, (day.views / maxViews) * 100);
              const date = new Date(day.date);
              const label = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 32, flex: 1 }}
                  title={`${label}: ${day.views} vues, ${day.unique_visitors} uniques`}>
                  <div style={{ fontSize: 9, color: C.textDim, fontWeight: 600 }}>{day.views}</div>
                  <div style={{ width: '100%', background: `linear-gradient(180deg, #4f8ef7, #2563eb)`, borderRadius: '3px 3px 0 0', height: `${h}%`, minHeight: 4, transition: 'height 0.5s ease', boxShadow: '0 0 6px rgba(79,142,247,0.4)' }} />
                  <div style={{ fontSize: 8, color: C.textDim, textAlign: 'center', whiteSpace: 'nowrap' }}>{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Top pages */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginBottom: 14 }}>🔝 Pages les plus visitées</div>
          {analytics.topPages?.slice(0, 8).map((p, i) => {
            const maxP = analytics.topPages[0]?.views || 1;
            const pct = Math.round((p.views / maxP) * 100);
            return (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: C.textSub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                    {PAGE_LABELS[p.page] || p.page}
                  </span>
                  <span style={{ fontSize: 12, color: C.text, fontWeight: 700 }}>{p.views}</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #4f8ef7, #a855f7)', borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Sources de trafic */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginBottom: 14 }}>🌐 Sources de trafic</div>
          {analytics.referrers?.map((r, i) => {
            const total = analytics.referrers.reduce((s, x) => s + parseInt(x.views), 0);
            const pct = Math.round((r.views / total) * 100);
            const colors = ['#4f8ef7', '#a855f7', '#ffd700', '#ff3b3b', '#00e676', '#69c9d0', '#e1306c', '#1877f2'];
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{SOURCE_ICONS[r.source] || '🌐'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: C.textSub }}>{r.source}</span>
                    <span style={{ fontSize: 12, color: C.text, fontWeight: 700 }}>{pct}%</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: colors[i % colors.length], borderRadius: 4 }} />
                  </div>
                </div>
                <span style={{ fontSize: 11, color: C.textDim, flexShrink: 0 }}>{r.views}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
