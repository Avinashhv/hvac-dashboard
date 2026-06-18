import { useState } from 'react'
import { X } from 'lucide-react'
import { STATUSES, CATEGORY_STYLES } from '../lib/data'

export default function CardModal({ card, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({ ...card })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: 12, padding: '24px 28px',
        width: 480, maxWidth: '95vw', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a' }}>Edit item</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
            <X size={18} />
          </button>
        </div>

        <label style={labelStyle}>Title</label>
        <input
          value={form.title}
          onChange={e => set('title', e.target.value)}
          style={inputStyle}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)} style={inputStyle}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} style={inputStyle}>
              {Object.keys(CATEGORY_STYLES).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Owner</label>
            <input value={form.owner} onChange={e => set('owner', e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Due date</label>
            <input value={form.due} onChange={e => set('due', e.target.value)} style={inputStyle} placeholder="e.g. 5/6/26" />
          </div>
        </div>

        <label style={labelStyle}>Progress — {form.pct}%</label>
        <input
          type="range" min={0} max={100} step={5}
          value={form.pct}
          onChange={e => set('pct', Number(e.target.value))}
          style={{ width: '100%', marginBottom: 6 }}
        />
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: '#888', display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" checked={form.overdue} onChange={e => set('overdue', e.target.checked)} />
            Mark as overdue
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <button onClick={() => onDelete(card.id)} style={deleteBtnStyle}>Delete</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
            <button onClick={() => onSave(form)} style={saveBtnStyle}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: 11, color: '#888', marginBottom: 4, fontWeight: 500 }
const inputStyle = {
  width: '100%', padding: '7px 10px', fontSize: 13, border: '0.5px solid #ddd',
  borderRadius: 6, marginBottom: 0, outline: 'none', background: '#fafafa',
  boxSizing: 'border-box',
}
const saveBtnStyle = {
  padding: '7px 20px', background: '#185FA5', color: 'white', border: 'none',
  borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500,
}
const cancelBtnStyle = {
  padding: '7px 16px', background: 'none', color: '#555', border: '0.5px solid #ddd',
  borderRadius: 6, cursor: 'pointer', fontSize: 13,
}
const deleteBtnStyle = {
  padding: '7px 14px', background: 'none', color: '#E24B4A', border: '0.5px solid #E24B4A',
  borderRadius: 6, cursor: 'pointer', fontSize: 13,
}
