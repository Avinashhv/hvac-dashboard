import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import KanbanBoard from '../components/KanbanBoard'

export default function RolePage({ roleKey, roleData, onBack, cards, setCards }) {
  const { label, owner, color, textColor, metrics, progress } = roleData

  return (
    <div style={{ padding: '0.9rem 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 5, fontSize: 12,
            color: '#888', cursor: 'pointer', border: '0.5px solid #e0dfd8',
            borderRadius: 8, padding: '5px 11px', background: 'white',
          }}
        >
          <ArrowLeft size={14} /> Back
        </button>
        <h1 style={{ fontSize: 17, fontWeight: 500, color: '#1a1a1a' }}>
          {label} — {owner}
        </h1>
        <span style={{
          marginLeft: 'auto', padding: '3px 12px', borderRadius: 20,
          fontSize: 11, fontWeight: 500, background: color, color: textColor,
        }}>
          V&A Broadbeach
        </span>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9, marginBottom: 18 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: '#f5f4f0', borderRadius: 8, padding: '11px 13px' }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 19, fontWeight: 500, color: m.warn ? '#BA7517' : '#1a1a1a' }}>{m.value}</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Board */}
      <KanbanBoard cards={cards} setCards={setCards} />

      {/* Progress bars */}
      {progress && progress.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#888', marginBottom: 10 }}>
            {roleKey === 'eng' ? 'Hours tracking (as at 1 Jun 2026)' :
             roleKey === 'draft' ? 'Drawing progress by zone' :
             roleKey === 'site' ? 'WBS — installation progress' :
             'D&C program milestones'}
          </div>
          {progress.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, marginBottom: 7 }}>
              <span style={{ width: 155, color: '#888', flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.label}
              </span>
              <div style={{ flex: 1, background: '#f0efe9', borderRadius: 3, height: 10 }}>
                <div style={{ height: 10, width: `${p.pct}%`, background: p.color, borderRadius: 3 }} />
              </div>
              <span style={{ width: 32, textAlign: 'right', color: '#888' }}>
                {roleKey === 'eng' ? (p.label === 'Target hours' ? '1129' : p.label === 'Hours used' ? '1264' : '48') : `${p.pct}%`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
