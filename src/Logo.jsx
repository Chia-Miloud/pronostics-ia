export default function Logo({ size = 'md' }) {
  const heights = { sm: 28, md: 40, lg: 56 }
  const h = heights[size] || 40

  return (
    <img
      src="/logo_v2.png"
      alt="Prono Sport"
      style={{
        height: h,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
      }}
    />
  )
}
