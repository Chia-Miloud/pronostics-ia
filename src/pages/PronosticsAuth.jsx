import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { usePronostics } from '../usePronostics';
import Logo from '../Logo';

export default function PronosticsAuth() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [form, setForm] = useState({ email: '', prenom: '', nom: '', telephone: '', pseudo: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, register } = usePronostics();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        // Pseudo généré automatiquement si non renseigné
        const pseudo = form.pseudo || `${form.prenom}${form.nom}`.replace(/\s/g, '').toLowerCase().slice(0, 20) || form.email.split('@')[0];
        await register(form.email, pseudo, form.password, {
          prenom: form.prenom,
          nom: form.nom,
          telephone: form.telephone,
        });
      }
      navigate('/pronostics');
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#fff', border: '1.5px solid rgba(19,34,24,0.15)',
    borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#132218',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    transition: 'border-color 0.2s'
  };

  const labelStyle = {
    fontSize: 11, fontWeight: 700, color: '#5a6b60',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    display: 'block', marginBottom: 6
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f6f1e4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 14 }}>
            <Logo size="md" />
          </Link>
          <div style={{ fontWeight: 800, fontSize: 20, color: '#132218', letterSpacing: '-0.02em' }}>🤖 Prédictions IA</div>
          <div style={{ fontSize: 14, color: '#5a6b60', marginTop: 6 }}>
            {mode === 'login' ? 'Connectez-vous pour accéder à vos pronostics' : '3 pronostics gratuits par jour — sans carte bancaire'}
          </div>
        </div>

        <div style={{ background: '#fbf7ec', border: '1px solid rgba(19,34,24,0.10)', borderRadius: 20, padding: 28, boxShadow: '0 10px 30px -10px rgba(19,34,24,0.12)' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, background: '#ede8dc', borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: '9px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: 13, fontFamily: 'inherit',
                background: mode === m ? '#fff' : 'transparent',
                color: mode === m ? '#132218' : '#8a9288',
                boxShadow: mode === m ? '0 1px 4px rgba(19,34,24,0.10)' : 'none',
                transition: 'all 0.2s'
              }}>
                {m === 'login' ? 'Connexion' : 'Inscription gratuite'}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ background: '#f6e1e5', border: '1px solid #c8102e', color: '#c8102e', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Champs inscription */}
            {mode === 'register' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={labelStyle}>Prénom</label>
                    <input type="text" value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
                      required placeholder="Jean" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Nom</label>
                    <input type="text" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                      required placeholder="Dupont" style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Téléphone</label>
                  <input type="tel" value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))}
                    required placeholder="+33 6 00 00 00 00" style={inputStyle} />
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required placeholder="votre@email.com" style={inputStyle} />
            </div>

            {/* Mot de passe */}
            <div>
              <label style={labelStyle}>Mot de passe</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required placeholder="••••••••" minLength={8} style={inputStyle} />
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', background: loading ? '#c8ddce' : '#2f8553', color: '#fff',
              border: 'none', borderRadius: 12, padding: '13px 0', fontWeight: 800, fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: 4,
              transition: 'background 0.2s'
            }}>
              {loading ? '⏳ Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte gratuit →'}
            </button>

            {mode === 'register' && (
              <p style={{ fontSize: 11, color: '#8a9288', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
                En créant un compte, vous acceptez nos <Link to="/rgpd" style={{ color: '#5a6b60' }}>conditions d'utilisation</Link>.
                Vos données ne sont jamais partagées.
              </p>
            )}
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/pronostics" style={{ fontSize: 13, color: '#5a6b60', textDecoration: 'none', fontWeight: 600 }}>
            ← Retour aux pronostics
          </Link>
        </div>
      </div>
    </div>
  );
}
