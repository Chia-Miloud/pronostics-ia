export default function Logo({ size = 'md' }) {
  const s = size === 'sm' ? 28 : size === 'md' ? 36 : 48
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: s, height: s, borderRadius: '50%',
        background: 'linear-gradient(135deg, #ff3b3b, #c62828)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: s * 0.55, boxShadow: '0 2px 8px rgba(255,59,59,0.4)'
      }}>⚽</div>
      <span style={{ fontWeight: 900, fontSize: s * 0.45, color: '#fff', letterSpacing: '-0.03em' }}>
        CoupeDuMonde<span style={{ color: '#ff3b3b' }}>.ai</span>
      </span>
    </div>
  )
}
