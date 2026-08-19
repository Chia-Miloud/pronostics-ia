import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { usePronostics } from '../usePronostics'
import NavMenu from '../components/NavMenu'

const API_BASE = 'https://app-7a3df0bb-9561-4735-b916-cfffb7487eba.cleverapps.io/api'

const C = {
  bg: '#0a0e1a', bgCard: '#111827', bgCardHover: '#151d2e', bgSidebar: '#0d1120',
  border: 'rgba(255,255,255,0.07)', text: '#f1f5f9', textSub: '#b0bec5', textDim: '#64748b',
  gold: '#fbbf24', goldGlow: 'rgba(251,191,36,0.3)', accent: '#e53e3e',
  green: '#22c55e', blue: '#4f8ef7', live: '#22c55e',
}

// Compétitions disponibles avec leurs saisons 2026-2027
const COMPETITIONS = [
  {
    id: '2015', nom: 'Ligue 1', flag: '🇫🇷', pays: 'France',
    saison: '2026-2027', debut: 'Août 2026', couleur: '#003189',
    description: 'Le championnat de France — suivez vos clubs préférés',
    logo: 'https://crests.football-data.org/FL1.png',
    hot: true,
  },
  {
    id: '2001', nom: 'UEFA Champions League', flag: '🇪🇺', pays: 'Europe',
    saison: '2026-2027', debut: 'Sept 2026', couleur: '#1a56db',
    description: 'La plus grande compétition de clubs au monde',
    logo: 'https://crests.football-data.org/CL.png',
    hot: true,
  },
  {
    id: '2021', nom: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', pays: 'Angleterre',
    saison: '2026-2027', debut: 'Août 2026', couleur: '#3d0c6e',
    description: 'Le championnat anglais, le plus regardé au monde',
    logo: 'https://crests.football-data.org/PL.png',
  },
  {
    id: '2002', nom: 'Bundesliga', flag: '🇩🇪', pays: 'Allemagne',
    saison: '2026-2027', debut: 'Août 2026', couleur: '#d20515',
    description: 'Le championnat allemand, ambiance unique',
    logo: 'https://crests.football-data.org/BL1.png',
  },
  {
    id: '2019', nom: 'Serie A', flag: '🇮🇹', pays: 'Italie',
    saison: '2026-2027', debut: 'Août 2026', couleur: '#0066cc',
    description: 'Le championnat italien, tactique et passionné',
    logo: 'https://crests.football-data.org/SA.png',
  },
  {
    id: '2014', nom: 'La Liga', flag: '🇪🇸', pays: 'Espagne',
    saison: '2026-2027', debut: 'Août 2026', couleur: '#ff4500',
    description: 'Le championnat espagnol, terre de champions',
    logo: 'https://crests.football-data.org/PD.png',
  },
  {
    id: '2017', nom: 'Primeira Liga', flag: '🇵🇹', pays: 'Portugal',
    saison: '2026-2027', debut: 'Août 2026', couleur: '#006600',
    description: 'Le championnat portugais',
    logo: 'https://crests.football-data.org/PPL.png',
  },
  {
    id: '2003', nom: 'Eredivisie', flag: '🇳🇱', pays: 'Pays-Bas',
    saison: '2026-2027', debut: 'Août 2026', couleur: '#ff6600',
    description: 'Le championnat néerlandais, vivier de talents',
    logo: 'https://crests.football-data.org/DED.png',
  },
]


// ─── COMPOSANT MATCHS CHOCS ──────────────────────────────────────────────────
function FeaturedMatches() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  const loadFeatured = () => {
    fetch(`${API_BASE}/matches/featured`)
      .then(r => r.json())
      .then(data => { setMatches(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    loadFeatured()
    const interval = setInterval(loadFeatured, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return null
  if (matches.length === 0) return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(16px, 3vw, 24px) clamp(12px, 3vw, 20px) 0' }}>
      <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 32 }}>📅</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>Aucun match choc prévu dans les 7 prochains jours</div>
          <div style={{ fontSize: 13, color: '#b0bec5' }}>Ligue 1 · Champions League · Premier League · La Liga · Bundesliga · Serie A</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>La sélection est actualisée automatiquement dès que le calendrier évolue.</div>
        </div>
        <Link to="/competition/2015" style={{ marginLeft: 'auto', background: `linear-gradient(135deg, #003189, #0044cc)`, color: '#fff', textDecoration: 'none', borderRadius: 20, padding: '8px 18px', fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap' }}>
          🇫🇷 Voir la Ligue 1 →
        </Link>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(16px, 3vw, 24px) clamp(12px, 3vw, 20px) 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 11, color: C.accent, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>🔥 Matchs chocs de la semaine</span>
        <span style={{ fontSize: 10, color: C.textDim }}>· Actualisé automatiquement</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 10 }}>
        {matches.slice(0, 6).map(match => {
          const isLive = match.statut === 'IN_PLAY' || match.statut === 'PAUSED'
          const date = new Date(match.date_heure)
          return (
            <Link key={match.id} to={`/match/${match.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: isLive ? `${C.live}10` : C.bgCard,
                border: `1px solid ${isLive ? C.live + '50' : C.border}`,
                borderLeft: `3px solid ${isLive ? C.live : C.accent}`,
                borderRadius: 12, padding: '12px 14px', cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 10, color: C.textDim, fontWeight: 700 }}>{match.competition_flag} {match.competition_nom}</span>
                  {isLive ? (
                    <span style={{ fontSize: 10, color: C.live, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 5, height: 5, background: C.live, borderRadius: '50%', display: 'inline-block' }}></span>LIVE
                    </span>
                  ) : (
                    <span style={{ fontSize: 10, color: C.textSub }}>
                      {date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} · {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                    {match.participant1_logo && <img src={match.participant1_logo} alt="" style={{ width: 22, height: 22, objectFit: 'contain', flexShrink: 0 }} />}
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{match.participant1}</span>
                  </div>
                  <div style={{ flexShrink: 0, background: 'rgba(255,255,255,0.07)', borderRadius: 6, padding: '3px 8px', fontSize: 13, fontWeight: 900, color: isLive ? C.gold : C.textDim, whiteSpace: 'nowrap' }}>
                    {isLive ? `${match.score_p1 ?? 0} - ${match.score_p2 ?? 0}` : 'VS'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0, justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{match.participant2}</span>
                    {match.participant2_logo && <img src={match.participant2_logo} alt="" style={{ width: 22, height: 22, objectFit: 'contain', flexShrink: 0 }} />}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// ─── PAGE COMPÉTITIONS (accueil post-saison) ─────────────────────────────────────
export function CompetitionsHome() {
  const { user, plan } = usePronostics()
  const navigate = useNavigate()
  const [showPromo, setShowPromo] = useState(true)

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <NavMenu backLabel={null} />

      {/* PROMO BANNER - Offre Lancement */}
      {showPromo && (
        <div style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #0d0d14 100%)', borderBottom: '1px solid rgba(251,191,36,0.3)', padding: '20px 20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, #fbbf24, #e53e3e, #fbbf24, transparent)' }} />
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 15, fontWeight: 900, color: '#fbbf24', letterSpacing: '-0.01em' }}>🔥 OFFRE LANCEMENT — 100 PREMIERS ABONNÉS</span>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
              {/* Offre AI Plus */}
              <div style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.4)', borderRadius: 12, padding: '12px 18px', textAlign: 'center', minWidth: 200 }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>🚀 AI Plus</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#fbbf24', lineHeight: 1 }}>1,99€<span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 400 }}>/mois</span></div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}><s style={{ color: '#475569' }}>4,99€</s> · Code : <strong style={{ color: '#fbbf24' }}>LANCEMENT100</strong></div>
              </div>
              {/* Offre AI Premium */}
              <div style={{ background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.4)', borderRadius: 12, padding: '12px 18px', textAlign: 'center', minWidth: 200 }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>🧠 AI Premium</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#e53e3e', lineHeight: 1 }}>4,99€<span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 400 }}>/mois</span></div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}><s style={{ color: '#475569' }}>9,99€</s> · Code : <strong style={{ color: '#e53e3e' }}>LANCEMENT100PREMIUM</strong></div>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Link to="/abonnement" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #fbbf24, #ff8c00)', color: '#000', textDecoration: 'none', borderRadius: 20, padding: '10px 24px', fontSize: 14, fontWeight: 900 }}>
                Profiter de l'offre →
              </Link>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 8 }}>⏰ Expire le 15 septembre 2026 · Réduction sur le 1er mois · Sans engagement</div>
            </div>
          </div>
          <button onClick={() => setShowPromo(false)} style={{ position: 'absolute', right: 14, top: 14, background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* HERO */}
      <div style={{
        background: 'linear-gradient(180deg, #0d0d14 0%, #1a0a2e 50%, #0d0d14 100%)',
        padding: '48px 20px 40px', textAlign: 'center',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ fontSize: 11, color: C.accent, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12 }}>
          Prono Sport · Saison 2026-2027
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: C.text, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
          Les championnats reprennent.<br />
          <span style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Vos pronostics IA aussi.
          </span>
        </h1>
        <p style={{ fontSize: 15, color: '#b0bec5', maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.7 }}>
          Retrouvez toutes vos compétitions préférées avec des pronostics IA basés sur les données réelles.
        </p>
        {!user && (
          <Link to="/login" style={{ display: 'inline-block', background: `linear-gradient(135deg, ${C.accent}, #c62828)`, color: '#fff', textDecoration: 'none', borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 900, boxShadow: `0 4px 20px ${C.accent}40` }}>
            Commencer gratuitement →
          </Link>
        )}
      </div>

      {/* Matchs chocs : sélection actualisée automatiquement, Ligue 1 en priorité. */}
      <FeaturedMatches />

      {/* GRILLE COMPÉTITIONS */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ fontSize: 11, color: C.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
          ⚽ Compétitions disponibles
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {COMPETITIONS.map(comp => (
            <Link key={comp.id} to={`/competition/${comp.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: C.bgCard,
                border: `1px solid ${comp.hot ? comp.couleur + '50' : C.border}`,
                borderTop: `3px solid ${comp.couleur}`,
                borderRadius: 14, padding: 20,
                transition: 'all 0.2s', cursor: 'pointer',
                position: 'relative', overflow: 'hidden',
              }}
                onMouseEnter={e => e.currentTarget.style.background = C.bgCardHover}
                onMouseLeave={e => e.currentTarget.style.background = C.bgCard}
              >
                {comp.hot && (
                  <div style={{ position: 'absolute', top: 12, right: 12, background: C.accent, color: '#fff', fontSize: 9, fontWeight: 900, padding: '2px 7px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Populaire
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  {comp.logo && <img src={comp.logo} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />}
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: C.text }}>{comp.flag} {comp.nom}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{comp.pays}</div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: C.textSub, margin: '0 0 12px', lineHeight: 1.5 }}>{comp.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: comp.couleur, fontWeight: 700, background: comp.couleur + '15', padding: '3px 8px', borderRadius: 20 }}>
                    {comp.saison} · {comp.debut}
                  </span>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Voir les matchs →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── PAGE COMPÉTITION (liste des matchs) ──────────────────────────────────────
export function CompetitionPage() {
  const { compId } = useParams()
  const { user, plan, pronosticsApi } = usePronostics()
  const navigate = useNavigate()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming')

  const comp = COMPETITIONS.find(c => c.id === compId) || { nom: 'Compétition', flag: '⚽', couleur: C.accent }

  useEffect(() => {
    setLoading(true)
    fetch(`${API_BASE}/competitions/${compId}/matches?status=${activeTab}`)
      .then(r => r.json())
      .then(data => { setMatches(data.matches || []); setLoading(false); })
      .catch(() => setLoading(false))
  }, [compId, activeTab])

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <NavMenu backLabel="← Compétitions" backPath="/competitions" />

      {/* Header compétition */}
      <div style={{ background: `linear-gradient(135deg, ${comp.couleur}20, #0d0d14)`, borderBottom: `1px solid ${comp.couleur}30`, padding: '28px 20px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          {comp.logo && <img src={comp.logo} alt="" style={{ width: 56, height: 56, objectFit: 'contain' }} />}
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: C.text, margin: 0 }}>{comp.flag} {comp.nom}</h1>
            <div style={{ fontSize: 13, color: C.textSub, marginTop: 4 }}>{comp.pays} · {comp.saison}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 20px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
          {[{id:'upcoming',l:'📅 À venir'},{id:'live',l:'🔴 En direct'},{id:'finished',l:'✅ Terminés'}].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              background: activeTab === t.id ? C.bgCard : 'transparent',
              border: activeTab === t.id ? `1px solid ${C.border}` : '1px solid transparent',
              color: activeTab === t.id ? C.text : C.textDim,
              borderRadius: 8, padding: '8px 16px', fontSize: 12, cursor: 'pointer',
              fontWeight: activeTab === t.id ? 700 : 400, fontFamily: 'inherit',
            }}>{t.l}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#b0bec5' }}>Chargement...</div>
        ) : matches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: C.textSub }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📅</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 8 }}>
              {activeTab === 'upcoming' ? 'La saison n\'a pas encore commencé' : 'Aucun match'}
            </div>
            <div style={{ fontSize: 13, color: C.textDim }}>Les matchs programmés sont actualisés automatiquement.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {matches.map(match => (
              <Link key={match.id} to={`/match/${match.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: C.bgCard, border: `1px solid ${C.border}`,
                  borderRadius: 12, padding: '14px 18px',
                  display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                  transition: 'all 0.15s', cursor: 'pointer',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.bgCardHover; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.bgCard; e.currentTarget.style.borderColor = C.border; }}
                >
                  {/* Date */}
                  <div style={{ fontSize: 11, color: C.textDim, minWidth: 80, flexShrink: 0 }}>
                    {new Date(match.date_heure).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    <br />
                    {new Date(match.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {/* Équipes */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 200 }}>
                    {match.participant1_logo && <img src={match.participant1_logo} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />}
                    <span style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{match.participant1}</span>
                    <span style={{ color: C.textDim, fontSize: 12, fontWeight: 700, background: 'rgba(255,255,255,0.06)', padding: '3px 10px', borderRadius: 20 }}>
                      {match.statut === 'FINISHED' || match.statut === 'IN_PLAY' ? `${match.score_p1}-${match.score_p2}` : 'VS'}
                    </span>
                    <span style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{match.participant2}</span>
                    {match.participant2_logo && <img src={match.participant2_logo} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />}
                  </div>
                  {/* Phase + CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    {match.phase && match.phase !== 'REGULAR_SEASON' && (
                      <span style={{ fontSize: 10, color: C.gold, fontWeight: 700 }}>
                        {match.phase === 'QUARTER_FINALS' ? '🏆 Quarts' : match.phase === 'SEMI_FINALS' ? '🔥 Demis' : match.phase === 'FINAL' ? '👑 Finale' : match.phase}
                      </span>
                    )}
                    <span style={{ fontSize: 12, color: C.accent, fontWeight: 700 }}>Pronostic →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── PAGE MATCH DÉDIÉ ─────────────────────────────────────────────────────────
export function MatchPage() {
  const { matchId } = useParams()
  const { user, plan, pronosticsApi } = usePronostics()
  const navigate = useNavigate()
  const [match, setMatch] = useState(null)
  const [pronostic, setPronostic] = useState(null)
  const [animating, setAnimating] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    // Les calendriers de championnat utilisent un identifiant composé (ex. 2015_559715).
    // Le backend le résout depuis la source officielle et retourne un match exploitable.
    const loadMatch = () => {
      fetch(`${API_BASE}/competitions/match/${encodeURIComponent(matchId)}`)
        .then(r => {
          if (!r.ok) throw new Error('Match introuvable')
          return r.json()
        })
        .then(m => {
          if (active) {
            setMatch(m)
            setLoading(false)
          }
        })
        .catch(() => {
          if (active) setLoading(false)
        })
    }

    loadMatch()
    const interval = setInterval(loadMatch, 30 * 1000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [matchId])

  const getPronostic = async () => {
    if (!user) { navigate('/login'); return }
    setAnimating(true)
    try {
      await new Promise(r => setTimeout(r, 6000))
      const r = await pronosticsApi.get(`/pronostics/${match.id}`)
      setPronostic(r.data)
    } catch (e) {
      if (e.response?.status === 429) navigate('/abonnement')
    } finally {
      setAnimating(false)
    }
  }

  if (loading) return <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b0bec5' }}>Chargement...</div>
  if (!match) return <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textSub }}>Match introuvable</div>

  const isLive = match.statut === 'IN_PLAY' || match.statut === 'PAUSED'
  const isFinished = match.statut === 'FINISHED'

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <NavMenu backLabel="← Retour" backPath="/" />

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 20px' }}>
        {/* Header match */}
        <div style={{
          background: `linear-gradient(135deg, #1a0a2e, #0d0d14)`,
          border: `1px solid ${isLive ? C.live + '60' : C.border}`,
          borderRadius: 20, padding: '28px 24px', marginBottom: 24,
          position: 'relative', overflow: 'hidden',
        }}>
          {isLive && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.live}, ${C.gold}, ${C.live})` }} />}

          <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{match.competition_nom}</span>
            {isLive && <span style={{ color: C.live, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, background: C.live, borderRadius: '50%', display: 'inline-block' }}></span>LIVE</span>}
          </div>

          {/* Équipes + score */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'nowrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
              {match.participant1_logo && <img src={match.participant1_logo} alt="" style={{ width: 64, height: 64, objectFit: 'contain' }} />}
              <span style={{ fontWeight: 900, fontSize: 16, color: C.text, textAlign: 'center' }}>{match.participant1}</span>
            </div>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              {isLive || isFinished ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 40, fontWeight: 900, color: C.gold }}>{match.score_p1 ?? 0}</span>
                  <span style={{ fontSize: 24, color: C.textDim }}>-</span>
                  <span style={{ fontSize: 40, fontWeight: 900, color: C.gold }}>{match.score_p2 ?? 0}</span>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 14, color: C.textDim, fontWeight: 700, background: 'rgba(255,255,255,0.05)', padding: '8px 20px', borderRadius: 20 }}>VS</div>
                  <div style={{ fontSize: 12, color: C.textSub, marginTop: 8 }}>
                    {new Date(match.date_heure).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                    <br />
                    {new Date(match.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
              {match.participant2_logo && <img src={match.participant2_logo} alt="" style={{ width: 64, height: 64, objectFit: 'contain' }} />}
              <span style={{ fontWeight: 900, fontSize: 16, color: C.text, textAlign: 'center' }}>{match.participant2}</span>
            </div>
          </div>
        </div>

        {/* Pronostic IA */}
        {animating ? (
          <div style={{ background: 'linear-gradient(135deg, #0d0d14, #1a0a2e)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: 16, padding: 24, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #8b5cf6, #fbbf24, #8b5cf6, transparent)', animation: 'shimmer 2s ease-in-out infinite' }} />
            <div style={{ fontSize: 40, animation: 'spin 3s linear infinite', display: 'inline-block', marginBottom: 12 }}>⚽</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: C.text, marginBottom: 6 }}>ANALYSE EN COURS</div>
            <div style={{ fontSize: 12, color: C.textSub }}>Intelligence artificielle · Données temps réel · 6 paramètres</div>
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} @keyframes shimmer{0%,100%{opacity:0.5}50%{opacity:1}}`}</style>
          </div>
        ) : pronostic ? (
          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>🤖 Pronostic IA</div>
            {/* Barre 1/N/2 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                {[{l:'1',v:pronostic.prob_p1,c:C.blue},{l:'N',v:pronostic.prob_nul,c:C.textSub},{l:'2',v:pronostic.prob_p2,c:C.accent}].map(({l,v,c})=>(
                  <div key={l} style={{textAlign:'center',flex:1}}>
                    <div style={{fontSize:20,fontWeight:900,color:c}}>{v}%</div>
                    <div style={{fontSize:10,color:C.textDim,textTransform:'uppercase'}}>Victoire {l==='N'?'Nul':l}</div>
                  </div>
                ))}
              </div>
              <div style={{height:10,borderRadius:8,overflow:'hidden',display:'flex',background:'rgba(255,255,255,0.05)'}}>
                <div style={{width:`${pronostic.prob_p1}%`,background:`linear-gradient(90deg,#1a56db,${C.blue})`}}/>
                <div style={{width:`${pronostic.prob_nul}%`,background:'linear-gradient(90deg,#4a5568,#718096)'}}/>
                <div style={{width:`${pronostic.prob_p2}%`,background:`linear-gradient(90deg,#c62828,${C.accent})`}}/>
              </div>
            </div>
            {/* Favori + score */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', marginBottom: 6 }}>Favori</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: C.text }}>{pronostic.favori}</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: C.green, marginTop: 4 }}>{pronostic.score_confiance}% confiance</div>
              </div>
              {pronostic.score_exact ? (
                <div style={{ background: `${C.gold}10`, border: `1px solid ${C.gold}40`, borderRadius: 10, padding: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: C.gold, textTransform: 'uppercase', marginBottom: 6 }}>Score probable</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: C.gold }}>{pronostic.score_exact}</div>
                </div>
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 14, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 12, color: C.textDim }}>🔒 Score exact<br /><strong style={{ color: C.gold }}>AI Plus</strong></div>
                </div>
              )}
            </div>
            {/* Cotes */}
            {pronostic.cotes && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', marginBottom: 10 }}>📊 Cotes moyennes</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {[{l:'1',v:pronostic.cotes.victoire_1,c:C.blue},{l:'N',v:pronostic.cotes.nul,c:C.textSub},{l:'2',v:pronostic.cotes.victoire_2,c:C.accent}].map(({l,v,c})=>v?(
                    <div key={l} style={{textAlign:'center',background:`${c}10`,border:`1px solid ${c}30`,borderRadius:8,padding:'8px 4px'}}>
                      <div style={{fontSize:10,color:C.textDim}}>{l}</div>
                      <div style={{fontSize:18,fontWeight:900,color:c}}>{typeof v==='number'?v.toFixed(2):v}</div>
                    </div>
                  ):null)}
                </div>
              </div>
            )}
            {/* Buteurs */}
            {pronostic.buteurs && pronostic.buteurs.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', marginBottom: 10 }}>⚽ Buteurs potentiels</div>
                {pronostic.buteurs.map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 40, textAlign: 'center', background: `${C.gold}15`, border: `1px solid ${C.gold}30`, borderRadius: 6, padding: '3px 0', flexShrink: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 900, color: C.gold }}>{b.pct}%</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{b.nom}</div>
                      <div style={{ fontSize: 10, color: C.textDim }}>{b.equipe}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Analyse */}
            {pronostic.analyse_texte && (
              <div style={{ borderLeft: `2px solid ${C.green}50`, padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '0 8px 8px 0' }}>
                <div style={{ fontSize: 10, color: C.green, textTransform: 'uppercase', marginBottom: 6 }}>Analyse</div>
                <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.65, margin: 0 }}>{pronostic.analyse_texte}</p>
              </div>
            )}
          </div>
        ) : !isFinished && (
          <button onClick={getPronostic} style={{
            width: '100%', background: `linear-gradient(135deg, ${C.accent}, #c62828)`,
            color: '#fff', border: 'none', borderRadius: 14, padding: '16px',
            fontSize: 16, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: `0 4px 24px ${C.accent}40`,
          }}>
            <span>🤖</span> Voir le pronostic IA
          </button>
        )}
      </div>
    </div>
  )
}

export default CompetitionsHome
