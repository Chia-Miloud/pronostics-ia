import { useState, useEffect } from 'react'

const API_BASE = 'https://app-7a3df0bb-9561-4735-b916-cfffb7487eba.cleverapps.io/api'

const C = {
  bg: '#0a0e1a', bgCard: '#111827',
  border: 'rgba(255,255,255,0.08)',
  text: '#f1f5f9', textSub: '#94a3b8', textDim: '#475569',
  gold: '#fbbf24', accent: '#e53e3e',
  green: '#22c55e', blue: '#4f8ef7',
}

export default function BilanStats({ compact = false, competitionId = '2000', competitionNom = 'Prono Sport' }) {
  const [stats, setStats] = useState(null)
  const [finishedMatches, setFinishedMatches] = useState([])
  const [pronostics, setPronostics] = useState({})

  useEffect(() => {
    // Charger les stats FILTRÉES par compétition
    fetch(`${API_BASE}/stats?competition_id=${competitionId}`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})

    // Charger les matchs terminés de cette compétition
    fetch(`${API_BASE}/competitions/${competitionId}/matches?status=finished`)
      .then(r => r.json())
      .then(data => setFinishedMatches((data.matches || []).slice(0, compact ? 5 : 12)))
      .catch(() => {})

    // Charger les pronostics génériques
    fetch(`${API_BASE}/pronostics/results`)
      .then(r => r.json())
      .then(setPronostics)
      .catch(() => {})
  }, [competitionId])

  const hasStats = Boolean(stats?.available !== false && stats?.bestCorrect && stats?.bestScoreExact)

  return (
    <section style={{ marginBottom: compact ? 24 : 48 }}>
      {/* Titre */}
      {!compact && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: C.accent, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Transparence</div>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: C.text, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 8 }}>
            Le bilan de nos pronostics
          </h2>
          <p style={{ fontSize: 13, color: C.textSub, maxWidth: 480, lineHeight: 1.7, margin: 0 }}>
            On ne cache pas nos erreurs. Ce que notre IA avait prédit, le résultat réel, et si on était dans le vrai.
          </p>
        </div>
      )}

      {compact && (
        <div style={{ fontSize: 12, color: C.accent, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
          📊 Bilan de nos pronostics
        </div>
      )}

      {!hasStats && !loading && (
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px', marginBottom: 16, color: C.textSub, fontSize: 13, lineHeight: 1.6 }}>
          📊 {stats?.message || 'Les statistiques réelles de cette compétition seront disponibles après les premiers matchs analysés.'}
        </div>
      )}

      {/* Cartes stats — affichées uniquement avec des résultats réels. */}
      {hasStats && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { pct: `${stats.bestCorrect.pct}%`, label: 'Bon résultat (1·N·2)', sub: `${stats.bestCorrect.count}/${stats.bestCorrect.total} matchs · ${stats.bestCorrect.label}`, color: C.green },
          { pct: `${stats.bestScoreExact.pct}%`, label: 'Score exact', sub: `${stats.bestScoreExact.count}/${stats.bestScoreExact.total} matchs · ${stats.bestScoreExact.label}`, color: C.gold },
        ].map(({ pct, label, sub, color }) => (
          <div key={label} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: compact ? '14px 12px' : '20px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: compact ? 32 : 40, fontWeight: 900, color, filter: `drop-shadow(0 0 10px ${color}50)`, marginBottom: 6 }}>{pct}</div>
            <div style={{ fontSize: compact ? 11 : 12, fontWeight: 800, color: C.text, marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 10, color: C.textDim, lineHeight: 1.4 }}>{sub}</div>
          </div>
        ))}
      </div>}

      {/* Résultats passés */}
      {finishedMatches.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {finishedMatches.map(event => {
            const p = pronostics[event.id]
            const gagnantReel = event.score_p1 > event.score_p2 ? event.participant1
              : event.score_p2 > event.score_p1 ? event.participant2 : 'Nul'
            const iaOk = p && (
              p.favori === gagnantReel ||
              (gagnantReel === 'Nul' && p.favori?.toLowerCase().includes('nul')) ||
              (gagnantReel !== 'Nul' && p.favori?.toLowerCase().includes(gagnantReel.toLowerCase().slice(0, 4)))
            )
            const borderColor = !p ? 'rgba(255,255,255,0.05)' : iaOk ? `${C.green}40` : `${C.accent}40`

            return (
              <div key={event.id} style={{
                background: C.bgCard,
                border: `1px solid ${borderColor}`,
                borderLeft: `3px solid ${!p ? 'rgba(255,255,255,0.08)' : iaOk ? C.green : C.accent}`,
                borderRadius: 8, padding: '10px 12px',
                display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                {/* Ligne 1 : équipes + score */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1, minWidth: 0 }}>
                    {event.participant1_logo && <img src={event.participant1_logo} alt="" style={{ width: 16, height: 16, objectFit: 'contain' }} />}
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.participant1}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: C.text, background: 'rgba(255,255,255,0.07)', borderRadius: 6, padding: '2px 8px', flexShrink: 0 }}>
                    {event.score_p1}-{event.score_p2}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1, minWidth: 0, justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{event.participant2}</span>
                    {event.participant2_logo && <img src={event.participant2_logo} alt="" style={{ width: 16, height: 16, objectFit: 'contain' }} />}
                  </div>
                </div>
                {/* Ligne 2 : vainqueur + prono IA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 9, color: C.textDim, textTransform: 'uppercase' }}>Résultat :</span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: C.text, background: 'rgba(255,255,255,0.07)', padding: '1px 7px', borderRadius: 20 }}>
                      {gagnantReel === 'Nul' ? '= Nul' : `🏆 ${gagnantReel}`}
                    </span>
                  </div>
                  {p && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 9, color: C.textDim, textTransform: 'uppercase' }}>IA :</span>
                      <span style={{
                        fontSize: 11, fontWeight: 800,
                        color: iaOk ? C.green : C.accent,
                        background: iaOk ? `${C.green}15` : `${C.accent}12`,
                        border: `1px solid ${iaOk ? C.green : C.accent}40`,
                        padding: '1px 7px', borderRadius: 20,
                      }}>
                        {iaOk ? '✓' : '✗'} {p.favori}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
