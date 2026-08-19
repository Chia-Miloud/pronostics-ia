import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePronostics } from '../usePronostics';
import NavMenu from '../components/NavMenu';

const CAT = {
  analyse:   { label: 'Analyse',    color: '#4f8ef7', icon: '📊' },
  strategie: { label: 'Stratégie',  color: '#a855f7', icon: '♟️' },
  guide:     { label: 'Guide',      color: '#00e676', icon: '📖' },
  actualite: { label: 'Actu',       color: '#ffd700', icon: '⚡' },
};

const DEFAULT_IMAGES = [
  '/blog_card_tactics.jpg',
  '/blog_card_ai.jpg',
  '/blog_hero.jpg',
];

function getImg(article, idx) {
  if (article.image_url) return article.image_url;
  return DEFAULT_IMAGES[idx % DEFAULT_IMAGES.length];
}

function CatBadge({ cat, size = 11 }) {
  const c = CAT[cat] || CAT.actualite;
  return (
    <span style={{
      background: `${c.color}22`, color: c.color,
      border: `1px solid ${c.color}50`,
      fontSize: size, fontWeight: 800, padding: '3px 10px',
      borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.06em',
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      {c.icon} {c.label}
    </span>
  );
}

// ─── LISTE DES ARTICLES ───────────────────────────────────────────────────────
export function BlogList() {
  const { pronosticsApi } = usePronostics();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pronosticsApi.get('/articles')
      .then(r => setArticles(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0c14', color: '#f1f5f9', fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden' }}>
      <NavMenu backLabel="← Retour aux pronostics" backPath="/" centerLabel="⚽ Blog & Analyses" />

      {/* ── HERO STADE ── */}
      <div style={{
        position: 'relative', overflow: 'hidden', minHeight: 480,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 60px',
      }}>
        {/* Image de fond stade */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/blog_hero.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center 40%',
          filter: 'brightness(0.35)',
        }} />
        {/* Overlay dégradé */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(10,12,20,0.3) 0%, rgba(10,12,20,0.5) 50%, rgba(10,12,20,0.95) 100%)',
        }} />
        {/* Lumières néon */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 300, background: 'radial-gradient(ellipse, rgba(255,59,59,0.15) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: 350, height: 280, background: 'radial-gradient(ellipse, rgba(255,215,0,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />

        {/* Contenu hero */}
        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 700 }}>
          {/* Badge live */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,59,59,0.15)', border: '1px solid rgba(255,59,59,0.4)', borderRadius: 20, padding: '6px 16px', marginBottom: 20 }}>
            <span style={{ width: 7, height: 7, background: '#ff3b3b', borderRadius: '50%', display: 'inline-block', animation: 'blink 1.2s infinite' }} />
            <span style={{ fontSize: 11, fontWeight: 900, color: '#ff3b3b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Nouveaux articles lundi & vendredi</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(34px, 6vw, 62px)', fontWeight: 900,
            letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 16,
            textShadow: '0 2px 20px rgba(0,0,0,0.8)',
          }}>
            <span style={{ background: 'linear-gradient(135deg, #fff 20%, #ffd700 60%, #ff3b3b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Analyses & Stratégies
            </span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: 32, textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
            Chaque semaine, notre IA décrypte les matchs, les stats et les stratégies<br />de vos <strong style={{ color: '#ffd700' }}>compétitions préférées</strong>
          </p>

          {/* Cotes décoratives */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            {[
              { label: '1 Victoire', val: '2.10', color: '#4f8ef7' },
              { label: 'N Nul', val: '3.40', color: '#ffd700' },
              { label: '2 Défaite', val: '3.20', color: '#ff3b3b' },
            ].map(o => (
              <div key={o.label} style={{
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
                border: `1px solid ${o.color}50`, borderRadius: 10,
                padding: '8px 16px', textAlign: 'center', minWidth: 80,
              }}>
                <div style={{ fontSize: 10, color: o.color, fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>{o.label}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: o.color }}>{o.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ligne lumineuse bas */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #ff3b3b80, #ffd70080, transparent)' }} />
      </div>

      {/* ── CONTENU ARTICLES ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 20px 80px' }}>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, animation: 'spin 1.5s linear infinite', display: 'inline-block' }}>⚽</div>
            <div style={{ color: '#94a3b8', marginTop: 16 }}>Chargement des analyses...</div>
          </div>
        ) : articles.length === 0 ? (
          <EmptyState navigate={navigate} />
        ) : (
          <>
            {/* Article featured — grande carte avec image */}
            {articles[0] && (
              <FeaturedCard article={articles[0]} navigate={navigate} />
            )}

            {/* Grille des autres articles */}
            {articles.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20, marginTop: 24 }}>
                {articles.slice(1).map((article, idx) => (
                  <ArticleCard key={article.id} article={article} navigate={navigate} idx={idx + 1} />
                ))}
              </div>
            )}
          </>
        )}

        {/* CTA Premium */}
        <div style={{
          marginTop: 64, position: 'relative', overflow: 'hidden',
          borderRadius: 20, padding: '0',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/blog_card_tactics.jpg)',
            backgroundSize: 'cover', backgroundPosition: 'center',
            filter: 'brightness(0.25)',
          }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,59,59,0.3) 0%, rgba(10,12,20,0.8) 100%)' }} />
          <div style={{ position: 'relative', padding: '40px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: '#ff3b3b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>🤖 Intelligence Artificielle</div>
              <h3 style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>Testez nos pronostics en temps réel</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', maxWidth: 400 }}>3 pronostics gratuits par jour · Score exact · Live IA Coach avec Premium</p>
            </div>
            <button onClick={() => navigate('/')} style={{
              background: 'linear-gradient(135deg, #ff3b3b, #c62828)',
              color: '#fff', border: 'none', borderRadius: 14, padding: '16px 36px',
              fontWeight: 900, fontSize: 16, cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 4px 24px rgba(255,59,59,0.4)', whiteSpace: 'nowrap',
            }}>
              Voir les matchs du jour →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}

// ─── CARTE FEATURED ───────────────────────────────────────────────────────────
function FeaturedCard({ article, navigate }) {
  const [hov, setHov] = useState(false);
  const img = getImg(article, 0);
  return (
    <div
      onClick={() => navigate(`/blog/${article.slug}`)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: 20,
        cursor: 'pointer', minHeight: 380,
        transform: hov ? 'translateY(-4px)' : 'none',
        boxShadow: hov ? '0 20px 60px rgba(0,0,0,0.6)' : '0 8px 32px rgba(0,0,0,0.4)',
        transition: 'all 0.3s ease',
        animation: 'fadeUp 0.5s ease',
      }}
    >
      {/* Image de fond */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        transform: hov ? 'scale(1.04)' : 'scale(1)',
        transition: 'transform 0.5s ease',
        filter: 'brightness(0.45)',
      }} />
      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.95) 100%)' }} />
      {/* Badge À la une */}
      <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ background: 'linear-gradient(135deg, #ffd700, #ff8c00)', color: '#000', fontSize: 10, fontWeight: 900, padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.08em' }}>⭐ À la une</span>
        <CatBadge cat={article.categorie} />
      </div>
      {/* Contenu bas */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 28px 28px' }}>
        <h2 style={{ fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: 12, textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
          {article.titre}
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: 16, maxWidth: 680 }}>
          {article.resume}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #ff3b3b, #ffd700)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{article.auteur}</span>
          </div>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>👁 {article.vues} vues</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{new Date(article.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
          <span style={{ marginLeft: 'auto', color: '#ffd700', fontSize: 14, fontWeight: 800 }}>Lire l'analyse →</span>
        </div>
      </div>
    </div>
  );
}

// ─── CARTE ARTICLE ────────────────────────────────────────────────────────────
function ArticleCard({ article, navigate, idx }) {
  const [hov, setHov] = useState(false);
  const img = getImg(article, idx);
  const cat = CAT[article.categorie] || CAT.actualite;

  return (
    <div
      onClick={() => navigate(`/blog/${article.slug}`)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
        background: '#111520',
        border: hov ? `1px solid ${cat.color}60` : '1px solid rgba(255,255,255,0.08)',
        transform: hov ? 'translateY(-4px)' : 'none',
        boxShadow: hov ? `0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px ${cat.color}30` : '0 4px 20px rgba(0,0,0,0.3)',
        transition: 'all 0.25s ease',
        animation: `fadeUp 0.4s ease ${idx * 80}ms both`,
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          transform: hov ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 0.4s ease',
          filter: 'brightness(0.6)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(17,21,32,0.9) 100%)' }} />
        {/* Barre couleur catégorie */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${cat.color}, transparent)` }} />
        <div style={{ position: 'absolute', top: 12, left: 14 }}>
          <CatBadge cat={article.categorie} />
        </div>
      </div>

      {/* Contenu */}
      <div style={{ padding: '18px 20px 20px' }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.01em', lineHeight: 1.4, marginBottom: 10 }}>
          {article.titre}
        </h3>
        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 14 }}>
          {article.resume?.slice(0, 120)}{article.resume?.length > 120 ? '...' : ''}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#475569' }}>
            <span>👁 {article.vues}</span>
            <span>{new Date(article.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
          </div>
          <span style={{ fontSize: 12, color: cat.color, fontWeight: 700 }}>Lire →</span>
        </div>
      </div>
    </div>
  );
}

// ─── ÉTAT VIDE ────────────────────────────────────────────────────────────────
function EmptyState({ navigate }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 20, minHeight: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/blog_hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.2)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,59,59,0.2), rgba(10,12,20,0.8))' }} />
      <div style={{ position: 'relative', textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>📡</div>
        <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Premier article en préparation</h3>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, marginBottom: 28 }}>Notre IA prépare la première analyse. Publication ce jeudi à 9h.</p>
        <button onClick={() => navigate('/')} style={{ background: 'linear-gradient(135deg, #ff3b3b, #c62828)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px 28px', fontWeight: 900, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(255,59,59,0.4)' }}>
          ⚽ Voir les pronostics du jour
        </button>
      </div>
    </div>
  );
}

// ─── ARTICLE DÉTAILLÉ ─────────────────────────────────────────────────────────
export function BlogArticle() {
  const { slug } = useParams();
  const { pronosticsApi } = usePronostics();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSocial, setShowSocial] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    pronosticsApi.get(`/articles/${slug}`)
      .then(r => setArticle(r.data))
      .catch(() => navigate('/blog'))
      .finally(() => setLoading(false));
  }, [slug]);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0c14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 48, animation: 'spin 1.5s linear infinite' }}>⚽</div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (!article) return null;

  const cat = CAT[article.categorie] || CAT.actualite;
  const img = article.image_url || '/blog_hero.jpg';

  return (
    <div style={{ minHeight: '100vh', background: '#0a0c14', color: '#f1f5f9', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <NavMenu backLabel="← Tous les articles" backPath="/blog" centerLabel="⚽ Blog" />

      {/* Hero article avec image */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 340, display: 'flex', alignItems: 'flex-end', padding: '0 0 40px' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.3)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(10,12,20,0.7) 50%, rgba(10,12,20,0.98) 100%)' }} />
        <div style={{ position: 'relative', maxWidth: 740, margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <CatBadge cat={article.categorie} />
            {article.tags?.slice(0, 3).map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.08)', color: '#475569', fontSize: 10, padding: '3px 10px', borderRadius: 20 }}>#{tag}</span>
            ))}
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 38px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 16, textShadow: '0 2px 16px rgba(0,0,0,0.8)' }}>
            {article.titre}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            <span>🤖 {article.auteur}</span>
            <span>👁 {article.vues} vues</span>
            <span>{new Date(article.published_at).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '32px 24px 80px' }}>
        {article.resume && (
          <div style={{ background: `${cat.color}12`, border: `1px solid ${cat.color}30`, borderLeft: `3px solid ${cat.color}`, borderRadius: '0 12px 12px 0', padding: '16px 20px', marginBottom: 32, fontSize: 15, color: '#b0b8cc', lineHeight: 1.7, fontStyle: 'italic' }}>
            {article.resume}
          </div>
        )}

        <div style={{ lineHeight: 1.85, fontSize: 15, color: '#94a3b8' }}
          dangerouslySetInnerHTML={{ __html: article.contenu
            ?.replace(/<h2>/g, `<h2 style="font-size:21px;font-weight:900;color:#f1f5f9;margin:36px 0 14px;letter-spacing:-0.02em;border-left:3px solid ${cat.color};padding-left:14px">`)
            ?.replace(/<h3>/g, `<h3 style="font-size:17px;font-weight:800;color:#f1f5f9;margin:24px 0 10px">`)
            ?.replace(/<p>/g, `<p style="margin:0 0 18px;color:#94a3b8;line-height:1.85">`)
            ?.replace(/<ul>/g, `<ul style="margin:0 0 18px;padding-left:22px;color:#94a3b8">`)
            ?.replace(/<li>/g, `<li style="margin-bottom:8px;line-height:1.7">`)
            ?.replace(/<strong>/g, `<strong style="color:#f1f5f9;font-weight:700">`)
          }}
        />

        {/* CTA */}
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, marginTop: 40, marginBottom: 40 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/blog_card_tactics.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.2)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,59,59,0.25), rgba(10,12,20,0.8))' }} />
          <div style={{ position: 'relative', padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, color: '#fff', fontSize: 17, marginBottom: 6 }}>🤖 Pronostics IA en direct</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>1 gratuit/jour · Score exact + Live Coach avec Premium</div>
            </div>
            <button onClick={() => navigate('/')} style={{ background: 'linear-gradient(135deg, #ff3b3b, #c62828)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 900, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(255,59,59,0.35)', whiteSpace: 'nowrap' }}>
              Voir les matchs →
            </button>
          </div>
        </div>

        {/* Posts sociaux */}
        {(article.social_fb || article.social_insta || article.social_tiktok) && (
          <div style={{ background: '#111520', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 12, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>📢 Posts réseaux sociaux</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: showSocial ? 14 : 0 }}>
              {[
                { key: 'fb', label: 'Facebook', icon: '📘', color: '#1877f2', text: article.social_fb },
                { key: 'insta', label: 'Instagram', icon: '📸', color: '#e1306c', text: article.social_insta },
                { key: 'tiktok', label: 'TikTok', icon: '🎵', color: '#69c9d0', text: article.social_tiktok },
              ].filter(s => s.text).map(s => (
                <button key={s.key} onClick={() => setShowSocial(showSocial === s.key ? null : s.key)} style={{ background: showSocial === s.key ? `${s.color}25` : `${s.color}12`, color: s.color, border: `1px solid ${s.color}${showSocial === s.key ? '60' : '30'}`, borderRadius: 10, padding: '8px 16px', fontSize: 12, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}>
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
            {showSocial && (() => {
              const s = { fb: article.social_fb, insta: article.social_insta, tiktok: article.social_tiktok }[showSocial];
              return (
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 14 }}>
                  <pre style={{ fontSize: 13, color: '#94a3b8', whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: '0 0 10px', lineHeight: 1.6 }}>{s}</pre>
                  <button onClick={() => copyText(s)} style={{ background: copied ? 'rgba(0,230,118,0.15)' : 'rgba(255,255,255,0.07)', border: `1px solid ${copied ? 'rgba(0,230,118,0.4)' : 'rgba(255,255,255,0.1)'}`, color: copied ? '#00e676' : '#94a3b8', borderRadius: 8, padding: '7px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}>
                    {copied ? '✅ Copié !' : '📋 Copier'}
                  </button>
                </div>
              );
            })()}
          </div>
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
