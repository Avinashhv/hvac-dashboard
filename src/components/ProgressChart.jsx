const STATUS_COLORS = {
  'Done':             '#00C875',
  'Working on it':    '#FDAB3D',
  'Stuck':            '#E2445C',
  'Issued to Engg':   '#0096c7',
  'Issued to PM':     '#7F77DD',
  'Waiting for Info': '#ffcb00',
  'Not Started':      '#c4c4c4',
}

function DonutChart({ slices, size = 100 }) {
  const r = 36
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r

  let offset = 0
  const paths = slices.map((s) => {
    const dash = (s.pct / 100) * circumference
    const gap = circumference - dash
    const el = (
      <circle
        key={s.label}
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={s.color}
        strokeWidth={18}
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={-offset}
        style={{ transition: 'stroke-dasharray 0.4s ease' }}
      />
    )
    offset += dash
    return el
  })

  const total = slices.reduce((a, s) => a + s.count, 0)
  const done = slices.find(s => s.label === 'Done')?.count || 0
  const pct = total ? Math.round((done / total) * 100) : 0

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f0efe9" strokeWidth={18} />
      {paths}
      <text
        x={cx} y={cy}
        textAnchor="middle" dominantBaseline="middle"
        style={{ transform: 'rotate(90deg)', transformOrigin: `${cx}px ${cy}px`, fontSize: 15, fontWeight: 700, fill: '#1a1a1a' }}
      >
        {pct}%
      </text>
      <text
        x={cx} y={cy + 14}
        textAnchor="middle" dominantBaseline="middle"
        style={{ transform: 'rotate(90deg)', transformOrigin: `${cx}px ${cy}px`, fontSize: 8, fill: '#999' }}
      >
        done
      </text>
    </svg>
  )
}

export default function ProgressChart({ cards }) {
  const counts = {}
  cards.forEach(c => {
    const s = c.draftStatus || 'Not Started'
    counts[s] = (counts[s] || 0) + 1
  })

  const total = cards.length
  if (total === 0) return null

  const slices = Object.entries(STATUS_COLORS)
    .filter(([label]) => counts[label])
    .map(([label, color]) => ({
      label,
      color,
      count: counts[label] || 0,
      pct: ((counts[label] || 0) / total) * 100,
    }))

  const done = counts['Done'] || 0
  const inProgress = (counts['Working on it'] || 0) + (counts['Issued to Engg'] || 0) + (counts['Issued to PM'] || 0)
  const notStarted = counts['Not Started'] || 0
  const stuck = counts['Stuck'] || 0

  return (
    <div style={{
      background: 'white', borderRadius: 10, border: '0.5px solid #e0dfd8',
      padding: '16px 20px', marginBottom: 18,
      display: 'flex', alignItems: 'center', gap: 28,
    }}>
      {/* Donut */}
      <div style={{ flexShrink: 0 }}>
        <DonutChart slices={slices} size={100} />
      </div>

      {/* Summary numbers */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <Stat label="Total tasks" value={total} color="#1a1a1a" />
        <Stat label="Done" value={done} color="#00C875" />
        <Stat label="In progress" value={inProgress} color="#FDAB3D" />
        <Stat label="Not started" value={notStarted} color="#c4c4c4" />
        {stuck > 0 && <Stat label="Stuck" value={stuck} color="#E2445C" />}
      </div>

      {/* Legend + stacked bar */}
      <div style={{ flex: 1, minWidth: 160 }}>
        {/* Stacked bar */}
        <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 12, background: '#f0efe9' }}>
          {slices.map(s => (
            <div key={s.label} style={{ width: `${s.pct}%`, background: s.color, transition: 'width 0.4s ease' }} title={`${s.label}: ${s.count}`} />
          ))}
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 14px' }}>
          {slices.map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#666', whiteSpace: 'nowrap' }}>{s.label} ({s.count})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 10, color: '#aaa', marginTop: 1, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  )
}
