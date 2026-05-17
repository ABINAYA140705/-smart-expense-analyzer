export default function InsightCard({ insight, index }) {
  const txt = insight.toLowerCase()
  const isAlert  = txt.includes('exceeded') || txt.includes('🚨')
  const isWarn   = txt.includes('warning')  || txt.includes('⚠')
  const isHigh   = txt.includes('high')     || txt.includes('reduce')
  const isGood   = txt.includes('balanced') || txt.includes('keep')
  const isMod    = txt.includes('moderate') || txt.includes('monitor')

  const color = isAlert ? '#ff5e7d' : isWarn ? '#ffb347' : isHigh ? '#ff8c6b' : isGood ? '#00d4aa' : isMod ? '#ffb347' : 'var(--blue)'
  const bg    = isAlert ? 'rgba(255,94,125,0.07)'  : isWarn ? 'rgba(255,179,71,0.07)'  : isHigh ? 'rgba(255,140,107,0.07)' : isGood ? 'rgba(0,212,170,0.07)' : isMod ? 'rgba(255,179,71,0.07)' : 'rgba(79,163,255,0.07)'
  const icon  = isAlert ? '🚨' : isWarn ? '⚠️' : isHigh ? '↑' : isGood ? '✓' : isMod ? '◎' : '→'

  return (
    <div style={{
      background: bg,
      border: `1px solid ${color}28`,
      borderLeft: `3px solid ${color}`,
      borderRadius: '10px',
      padding: '13px 16px',
      display: 'flex', gap: '10px', alignItems: 'flex-start',
      animation: `fadeUp .4s ${index * 0.08}s ease both`,
    }}>
      <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
      <p style={{ fontSize: '.84rem', lineHeight: '1.6', color: 'var(--text)', fontFamily: 'var(--font-body)' }}>
        {insight.replace('🚨 ', '').replace('⚠ ', '')}
      </p>
    </div>
  )
}
