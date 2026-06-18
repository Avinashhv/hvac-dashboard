import { Briefcase, Calculator, PencilLine, HardHat, ChevronRight } from 'lucide-react'
import { PROJECT } from '../lib/data'

const ROLES = [
  { key: 'pm',    icon: Briefcase,  iconColor: '#185FA5', bg: '#E6F1FB' },
  { key: 'eng',   icon: Calculator, iconColor: '#534AB7', bg: '#EEEDFE' },
  { key: 'draft', icon: PencilLine, iconColor: '#3B6D11', bg: '#EAF3DE' },
  { key: 'site',  icon: HardHat,    iconColor: '#993C1D', bg: '#FAECE7' },
]

export default function MainPage({ rolesData, onSelect }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      minHeight: 480, borderRadius: 12, overflow: 'hidden',
      border: '0.5px solid #e0dfd8',
    }}>
      {/* Left — image */}
      <div style={{ position: 'relative', background: '#1a2f45', minHeight: 480 }}>
        <img
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80"
          alt="V&A Broadbeach"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.15) 50%,rgba(0,0,0,0.6) 100%)' }} />
        <div style={{ position: 'absolute', top: 22, left: 22, right: 22 }}>
          <h2 style={{ fontSize: 22, fontWeight: 500, color: '#fff', lineHeight: 1.3 }}>{PROJECT.name}</h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.72)', marginTop: 5 }}>{PROJECT.description}</p>
          <span style={{
            display: 'inline-block', marginTop: 10,
            background: 'rgba(255,255,255,0.18)', border: '0.5px solid rgba(255,255,255,0.3)',
            borderRadius: 20, padding: '3px 12px', fontSize: 11, color: '#fff',
          }}>
            {PROJECT.number}
          </span>
        </div>
        <div style={{ position: 'absolute', bottom: 20, left: 22, right: 22 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
            Last meeting: {PROJECT.lastMeeting} · Attendees: {PROJECT.attendees}
          </p>
        </div>
      </div>

      {/* Right — role buttons */}
      <div style={{ background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '36px 28px', gap: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: '#aaa', letterSpacing: '0.06em', marginBottom: 4 }}>SELECT YOUR ROLE</p>
        {ROLES.map(({ key, icon: Icon, iconColor, bg }) => {
          const role = rolesData[key]
          const hasAlert = role.metrics.some(m => m.warn)
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', border: '0.5px solid #e0dfd8',
                borderRadius: 12, cursor: 'pointer', background: 'white', textAlign: 'left', width: '100%',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#bbb'; e.currentTarget.style.background = '#fafaf8' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0dfd8'; e.currentTarget.style.background = 'white' }}
            >
              <div style={{ width: 38, height: 38, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} color={iconColor} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>{role.label}</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{role.owner} — {role.desc}</div>
              </div>
              {hasAlert && (
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E24B4A', flexShrink: 0 }} title="Has overdue or over-budget items" />
              )}
              <ChevronRight size={14} color="#bbb" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
