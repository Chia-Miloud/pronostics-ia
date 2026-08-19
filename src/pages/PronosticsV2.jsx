import { useState, useEffect, useRef } from 'react'
import BilanStats from '../components/BilanStats'
import NavMenu from '../components/NavMenu'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { usePronostics } from '../usePronostics'

const API_BASE = 'https://app-7a3df0bb-9561-4735-b916-cfffb7487eba.cleverapps.io/api'

const C = {
  bg: '#0a0e1a', bgCard: '#111827', bgCardHover: '#151d2e', bgSidebar: '#0d1120',
  border: 'rgba(255,255,255,0.07)', borderHover: 'rgba(255,255,255,0.15)',
  text: '#f1f5f9', textSub: '#94a3b8', textDim: '#475569',
  gold: '#fbbf24', goldGlow: 'rgba(251,191,36,0.3)',
  accent: '#e53e3e', accentGlow: 'rgba(229,62,62,0.3)',
  green: '#22c55e', blue: '#4f8ef7', live: '#22c55e',
  sidebarActive: 'rgba(229,62,62,0.15)',
}

// ─── SPORTS DISPONIBLES ───────────────────────────────────────────────────────
const SPORTS = [
  { id: 'football', label: 'Football', icon: '⚽', available: true },
  { id: 'basketball', label: 'Basketball', icon: '🏀', available: false },
  { id: 'tennis', label: 'Tennis', icon: '🎾', available: false },
  { id: 'rugby', label: 'Rugby', icon: '🏉', available: false },
  { id: 'hockey', label: 'Hockey', icon: '🏒', available: false },
  { id: 'baseball', label: 'Baseball', icon: '⚾', available: false },
  { id: 'mma', label: 'MMA / Boxe', icon: '🥊', available: false },
  { id: 'cyclisme', label: 'Cyclisme', icon: '🚴', available: false },
]

// ─── COMPÉTITIONS FOOTBALL ────────────────────────────────────────────────────
const COMPS_FOOTBALL = [
  { id: '2000', nom: 'Prono Sport', pays: 'Monde', flag: '🌍', hot: true },
  { id: '2001', nom: 'Champions League', pays: 'Europe', flag: '🇪🇺' },
  { id: '2021', nom: 'Premier League', pays: 'Angleterre', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: '2015', nom: 'Ligue 1', pays: 'France', flag: '🇫🇷' },
  { id: '2002', nom: 'Bundesliga', pays: 'Allemagne', flag: '🇩🇪' },
  { id: '2019', nom: 'Serie A', pays: 'Italie', flag: '🇮🇹' },
  { id: '2014', nom: 'La Liga', pays: 'Espagne', flag: '🇪🇸' },
  { id: '2017', nom: 'Primeira Liga', pays: 'Portugal', flag: '🇵🇹' },
  { id: '2003', nom: 'Eredivisie', pays: 'Pays-Bas', flag: '🇳🇱' },
]

const PHASE_LABELS = {
  'LAST_32': '⚡ Seizièmes', 'LAST_16': '⚡ Huitièmes',
  'QUARTER_FINALS': '🏆 Quarts', 'SEMI_FINALS': '🔥 Demi-finales',
  'FINAL': '👑 FINALE', 'THIRD_PLACE': '🥉 3ème place',
  'GROUP_STAGE': 'Phase de groupes', 'REGULAR_SEASON': 'Championnat',
}

// ─── COMPOSANT MATCH CARD COMPACT ─────────────────────────────────────────────
function MatchCardCompact({ match, onGetPronostic, pronostic, plan, pronosticsApi }) {
  const isLive = match.statut === 'IN_PLAY' || match.statut === 'PAUSED'
  const isFinished = match.statut === 'FINISHED'
  const date = new Date(match.date_heure)
  const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const dateStr = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

  return (
    <div style={{
      background: C.bgCard,
      border: `1px solid ${isLive ? C.live + '50' : C.border}`,
      borderLeft: isLive ? `3px solid ${C.live}` : `3px solid transparent`,
      borderRadius: 10, padding: '12px 14px',
      transition: 'all 0.15s',
    }}>
      {/* Phase + date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 10, color: match.phase && match.phase !== 'GROUP_STAGE' && match.phase !== 'REGULAR_SEASON' ? C.gold : C.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {PHASE_LABELS[match.phase] || match.phase || 'Match'}
        </span>
        {isLive ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: C.live, fontWeight: 900, background: `${C.live}15`, padding: '2px 7px', borderRadius: 20 }}>
            <span style={{ width: 5, height: 5, background: C.live, borderRadius: '50%', display: 'inline-block' }}></span>
            LIVE
          </span>
        ) : isFinished ? (
          <span style={{ fontSize: 10, color: C.textDim }}>Terminé</span>
        ) : (
          <span style={{ fontSize: 10, color: C.textSub }}>{dateStr} · {timeStr}</span>
        )}
      </div>

      {/* Équipes + score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        {/* Équipe 1 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
          {match.participant1_logo && <img src={match.participant1_logo} alt="" style={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0 }} />}
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{match.participant1}</span>
        </div>
        {/* Score */}
        <div style={{ fontSize: 15, fontWeight: 900, color: C.text, background: 'rgba(255,255,255,0.07)', borderRadius: 6, padding: '3px 10px', flexShrink: 0, letterSpacing: '-0.02em' }}>
          {isFinished || isLive ? `${match.score_p1 ?? 0} - ${match.score_p2 ?? 0}` : 'VS'}
        </div>
        {/* Équipe 2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0, justifyContent: 'flex-end' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{match.participant2}</span>
          {match.participant2_logo && <img src={match.participant2_logo} alt="" style={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0 }} />}
        </div>
      </div>

      {/* Pronostic ou bouton */}
      {pronostic ? (
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px' }}>
          {/* Barre 1/N/2 */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
            {[
              { l: '1', v: pronostic.prob_p1, c: C.blue },
              { l: 'N', v: pronostic.prob_nul, c: C.textSub },
              { l: '2', v: pronostic.prob_p2, c: C.accent },
            ].map(({ l, v, c }) => (
              <div key={l} style={{ flex: 1, textAlign: 'center', background: `${c}12`, border: `1px solid ${c}25`, borderRadius: 6, padding: '4px 2px' }}>
                <div style={{ fontSize: 8, color: C.textDim, fontWeight: 700 }}>{l}</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: c }}>{v}%</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: C.textSub }}>Favori : <strong style={{ color: C.text }}>{pronostic.favori}</strong></span>
            {pronostic.score_exact && <span style={{ fontSize: 11, color: C.gold, fontWeight: 800 }}>{pronostic.score_exact}</span>}
          </div>
        </div>
      ) : !isFinished && (
        <button onClick={() => onGetPronostic(match.id)} style={{
          width: '100%', background: `linear-gradient(135deg, ${C.accent}, #c62828)`,
          color: '#fff', border: 'none', borderRadius: 8, padding: '8px',
          fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          🤖 Pronostic IA
        </button>
      )}
    </div>
  )
}

// ─── PAGE PRINCIPALE V2 ───────────────────────────────────────────────────────
export default function PronosticsV2() {
  const { user, plan, pronosticsApi, logout } = usePronostics()
  const navigate = useNavigate()
  const [activeSport, setActiveSport] = useState('football')
  const [activeComp, setActiveComp] = useState('2000')
  const [matches, setMatches] = useState([])
  const [competitions, setCompetitions] = useState([])
  const [loading, setLoading] = useState(true)
  const [pronostics, setPronostics] = useState({})
  const [activeTab, setActiveTab] = useState('upcoming') // upcoming, live, finished
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentComp, setCurrentComp] = useState(null)

  // Charger les compétitions
  useEffect(() => {
    fetch(`${API_BASE}/competitions`)
      .then(r => r.json())
      .then(data => setCompetitions(data))
      .catch(() => {})
  }, [])

  // Charger les matchs de la compétition active
  useEffect(() => {
    setLoading(true)
    setMatches([])
    const url = `${API_BASE}/competitions/${activeComp}/matches?status=${activeTab}`
    fetch(url)
      .then(r => r.json())
      .then(data => {
        setMatches(data.matches || [])
        setCurrentComp(data.competition || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [activeComp, activeTab])

  // Polling 30s pour les matchs en direct
  useEffect(() => {
    if (activeTab !== 'live') return
    const interval = setInterval(() => {
      fetch(`${API_BASE}/competitions/${activeComp}/matches?status=live`)
        .then(r => r.json())
        .then(data => setMatches(data.matches || []))
        .catch(() => {})
    }, 30000)
    return () => clearInterval(interval)
  }, [activeComp, activeTab])

  const getPronostic = async (matchId) => {
    if (!user) { navigate('/login'); return }
    try {
      const r = await pronosticsApi.get(`/pronostics/${matchId}`)
      setPronostics(prev => ({ ...prev, [matchId]: r.data }))
    } catch (e) {
      if (e.response?.status === 429) alert('Quota journalier atteint — passez à AI Plus pour des pronostics illimités')
      else if (e.response?.status === 401) navigate('/login')
    }
  }

  const activeCompData = COMPS_FOOTBALL.find(c => c.id === activeComp)

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* ─── TOPBAR ─── */}
      <div style={{ background: C.bgSidebar, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', gap: 16, height: 52 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
            <span style={{ fontSize: 20 }}>🤖</span>
            <span style={{ fontWeight: 900, color: C.text, fontSize: 15, letterSpacing: '-0.02em' }}>Prono Sport</span>
            <span style={{ fontSize: 10, background: C.accent, color: '#fff', padding: '1px 6px', borderRadius: 20, fontWeight: 700 }}>Prono Sport</span>
          </Link>

          {/* Sports tabs */}
          <div style={{ display: 'flex', gap: 2, flex: 1, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {SPORTS.map(sport => (
              <button key={sport.id} onClick={() => sport.available && setActiveSport(sport.id)} style={{
                background: activeSport === sport.id ? `${C.accent}20` : 'transparent',
                border: activeSport === sport.id ? `1px solid ${C.accent}40` : '1px solid transparent',
                color: sport.available ? (activeSport === sport.id ? C.accent : C.textSub) : C.textDim,
                borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: sport.available ? 'pointer' : 'not-allowed',
                fontWeight: activeSport === sport.id ? 800 : 400, fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, whiteSpace: 'nowrap',
                opacity: sport.available ? 1 : 0.5,
              }}>
                <span>{sport.icon}</span>
                <span>{sport.label}</span>
                {!sport.available && <span style={{ fontSize: 9, color: C.textDim, background: 'rgba(255,255,255,0.07)', padding: '1px 4px', borderRadius: 10 }}>Bientôt</span>}
              </button>
            ))}
          </div>

          {/* Menu user - dropdown complet avec admin/dashboard */}
          <NavMenu inline={true} />
        </div>
      </div>

      {/* ─── LAYOUT PRINCIPAL ─── */}
      <div style={{ display: 'flex', flex: 1, maxWidth: 1400, margin: '0 auto', width: '100%' }}>

        {/* ─── SIDEBAR COMPÉTITIONS ─── */}
        <div style={{
          width: sidebarOpen ? 240 : 0, flexShrink: 0, background: C.bgSidebar,
          borderRight: `1px solid ${C.border}`, overflowY: 'auto', overflowX: 'hidden',
          transition: 'width 0.2s ease', position: 'sticky', top: 52, height: 'calc(100vh - 52px)',
        }}>
          {sidebarOpen && (
            <div style={{ padding: '12px 0' }}>
              {/* Football */}
              <div style={{ padding: '8px 16px 4px', fontSize: 10, color: C.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                ⚽ Football
              </div>
              {COMPS_FOOTBALL.map(comp => (
                <button key={comp.id} onClick={() => setActiveComp(comp.id)} style={{
                  width: '100%', background: activeComp === comp.id ? C.sidebarActive : 'transparent',
                  border: 'none', borderLeft: activeComp === comp.id ? `3px solid ${C.accent}` : '3px solid transparent',
                  color: activeComp === comp.id ? C.text : C.textSub,
                  padding: '9px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left',
                  transition: 'all 0.1s',
                }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{comp.flag}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: activeComp === comp.id ? 800 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{comp.nom}</div>
                    <div style={{ fontSize: 10, color: C.textDim }}>{comp.pays}</div>
                  </div>
                  {comp.hot && <span style={{ fontSize: 9, background: C.accent, color: '#fff', padding: '1px 5px', borderRadius: 10, fontWeight: 700, flexShrink: 0 }}>LIVE</span>}
                </button>
              ))}

              {/* Autres sports - bientôt */}
              <div style={{ padding: '16px 16px 4px', fontSize: 10, color: C.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 8, borderTop: `1px solid ${C.border}` }}>
                Bientôt disponible
              </div>
              {SPORTS.filter(s => !s.available).map(sport => (
                <div key={sport.id} style={{ padding: '9px 16px', fontSize: 13, color: C.textDim, display: 'flex', alignItems: 'center', gap: 8, opacity: 0.5 }}>
                  <span>{sport.icon}</span>
                  <span>{sport.label}</span>
                  <span style={{ fontSize: 9, background: 'rgba(255,255,255,0.07)', color: C.textDim, padding: '1px 5px', borderRadius: 10, marginLeft: 'auto' }}>Bientôt</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── CONTENU PRINCIPAL ─── */}
        <div style={{ flex: 1, minWidth: 0, padding: '20px 20px' }}>
          {/* Header compétition */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
              background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`,
              color: C.textSub, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14,
            }}>☰</button>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 900, color: C.text, margin: 0, letterSpacing: '-0.02em' }}>
                {activeCompData?.flag} {activeCompData?.nom || currentComp?.nom || 'Compétition'}
              </h1>
              <div style={{ fontSize: 12, color: C.textDim, marginTop: 2 }}>{activeCompData?.pays}</div>
            </div>
          </div>

          {/* Tabs upcoming/live/finished */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
            {[
              { id: 'upcoming', label: '📅 À venir' },
              { id: 'live', label: '🔴 En direct' },
              { id: 'finished', label: '✅ Terminés' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                background: activeTab === tab.id ? C.bgCard : 'transparent',
                border: activeTab === tab.id ? `1px solid ${C.border}` : '1px solid transparent',
                color: activeTab === tab.id ? C.text : C.textDim,
                borderRadius: 8, padding: '8px 16px', fontSize: 12, cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 700 : 400, fontFamily: 'inherit',
              }}>{tab.label}</button>
            ))}
          </div>

          {/* Matchs */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: C.textSub }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⚽</div>
              Chargement des matchs...
            </div>
          ) : matches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: C.textSub }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📅</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 8 }}>
                {activeTab === 'live' ? 'Aucun match en direct' : activeTab === 'upcoming' ? 'Aucun match à venir' : 'Aucun résultat'}
              </div>
              <div style={{ fontSize: 13, color: C.textDim }}>
                {activeTab === 'live' ? 'Les matchs en direct apparaîtront ici automatiquement' : 'La saison n\'a pas encore commencé ou aucun match n\'est programmé'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
              {matches.map(match => (
                <MatchCardCompact
                  key={match.id}
                  match={match}
                  onGetPronostic={getPronostic}
                  pronostic={pronostics[match.id]}
                  plan={plan}
                  pronosticsApi={pronosticsApi}
                />
              ))}
            </div>
          )}
        </div>

        {/* ─── BILAN STATS ─── */}
        <div style={{ marginTop: 32 }}>
          <BilanStats compact={true} competitionId={activeComp} competitionNom={activeCompData?.nom || currentComp?.nom} />
        </div>
      </div>
    </div>
  )
}
