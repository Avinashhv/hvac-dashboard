import { useState } from 'react'
import { Building2, FlaskConical, Heart, Copy, Plus, X } from 'lucide-react'
import { PROJECTS } from '../lib/projects'
import { getDefaultRoles, TEMPLATE_DRAFT_CARDS } from '../lib/defaultRoles'

const TYPE_ICONS = {
  Residential: Building2,
  Health: Heart,
  Test: FlaskConical,
  Template: Copy,
}

const PROJECT_TYPES = ['Residential', 'Commercial', 'Health', 'Industrial', 'Education', 'Retail']
const PROJECT_COLORS = ['#7F77DD', '#1D9E75', '#378ADD', '#D85A30', '#E2445C', '#FDAB3D', '#0096c7', '#888780']

export default function ProjectsHome({ onSelect, onAddProject }) {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', jobNumber: '', address: '', type: 'Residential', color: '#7F77DD' })
  const [error, setError] = useState('')

  const activeProjects = PROJECTS.filter(p => !p.isTemplate)
  const templateProject = PROJECTS.find(p => p.isTemplate)

  const handleAdd = () => {
    if (!form.name.trim()) { setError('Project name is required.'); return }
    if (!form.jobNumber.trim()) { setError('Job number is required.'); return }
    onAddProject({ ...form, name: form.name.trim(), jobNumber: form.jobNumber.trim(), address: form.address.trim() })
    setShowModal(false)
    setForm({ name: '', jobNumber: '', address: '', type: 'Residential', color: '#7F77DD' })
    setError('')
  }

  return (
    <div style={{ padding: '1.5rem 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: '#1a1a1a', margin: 0 }}>Projects</h1>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Mechanical Services — D&E Group</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#1f1f2e', color: 'white', border: 'none',
            borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#7F77DD'}
          onMouseLeave={e => e.currentTarget.style.background = '#1f1f2e'}
        >
          <Plus size={15} /> Add Project
        </button>
      </div>

      {/* Project grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {activeProjects.map(project => <ProjectCard key={project.id} project={project} onSelect={onSelect} />)}
      </div>

      {/* Template section */}
      {templateProject && (
        <div style={{ marginTop: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#bbb', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
            Template
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            <ProjectCard project={templateProject} onSelect={onSelect} isTemplate />
          </div>
        </div>
      )}

      {/* Add Project modal */}
      {showModal && (
        <>
          <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 400 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            background: 'white', borderRadius: 14, padding: '28px 28px 24px',
            width: 440, zIndex: 500, boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>New Project</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', padding: 4 }}>
                <X size={16} />
              </button>
            </div>

            <Field label="Project Name *">
              <input
                autoFocus
                value={form.name}
                onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setError('') }}
                placeholder="e.g. Chevron One Apartments"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#7F77DD'}
                onBlur={e => e.target.style.borderColor = '#e0dfd8'}
              />
            </Field>

            <Field label="Job Number *">
              <input
                value={form.jobNumber}
                onChange={e => { setForm(f => ({ ...f, jobNumber: e.target.value })); setError('') }}
                placeholder="e.g. QBM00031"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#7F77DD'}
                onBlur={e => e.target.style.borderColor = '#e0dfd8'}
              />
            </Field>

            <Field label="Address">
              <input
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                placeholder="e.g. 12 Example St, Brisbane QLD"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#7F77DD'}
                onBlur={e => e.target.style.borderColor = '#e0dfd8'}
              />
            </Field>

            <Field label="Project Type">
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inputStyle}>
                {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>

            <Field label="Colour">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {PROJECT_COLORS.map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                    style={{
                      width: 28, height: 28, borderRadius: 7, background: c, border: 'none', cursor: 'pointer',
                      outline: form.color === c ? `3px solid ${c}` : 'none',
                      outlineOffset: 2,
                      transform: form.color === c ? 'scale(1.15)' : 'scale(1)',
                      transition: 'transform 0.1s',
                    }}
                  />
                ))}
              </div>
            </Field>

            {error && <div style={{ fontSize: 12, color: '#E2445C', marginBottom: 12 }}>{error}</div>}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => setShowModal(false)}
                style={{ padding: '9px 16px', borderRadius: 8, border: '0.5px solid #e0dfd8', background: 'white', fontSize: 13, cursor: 'pointer', color: '#666' }}>
                Cancel
              </button>
              <button onClick={handleAdd}
                style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: '#1f1f2e', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#7F77DD'}
                onMouseLeave={e => e.currentTarget.style.background = '#1f1f2e'}
              >
                Create Project
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8, fontSize: 13,
  border: '1px solid #e0dfd8', outline: 'none', boxSizing: 'border-box',
  background: '#fafaf8', color: '#1a1a1a',
}

function ProjectCard({ project, onSelect, isTemplate }) {
  const Icon = TYPE_ICONS[project.type] || Building2
  return (
    <button
      onClick={() => onSelect(project.id)}
      style={{
        border: isTemplate ? '1.5px dashed #ccc' : 'none',
        padding: 0, background: 'none',
        cursor: 'pointer', textAlign: 'left', borderRadius: 12, overflow: 'hidden',
        boxShadow: isTemplate ? 'none' : '0 0 0 0.5px #e0dfd8',
        opacity: isTemplate ? 0.85 : 1,
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 0 1.5px #bbb'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = isTemplate ? 'none' : '0 0 0 0.5px #e0dfd8'}
    >
      <div style={{ position: 'relative', height: 140, overflow: 'hidden', background: '#1a2f45' }}>
        <img
          src={project.image || `https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80`}
          alt={project.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: isTemplate ? 'grayscale(60%)' : 'none' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.55))' }} />
        {isTemplate && (
          <div style={{ position: 'absolute', top: 10, left: 12, background: '#888780', color: 'white', fontSize: 10, fontWeight: 700, borderRadius: 6, padding: '2px 8px', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Copy size={9} /> Template
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '2px 8px' }}>
            {project.jobNumber}
          </span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon size={10} />{project.type}
          </span>
        </div>
      </div>
      <div style={{ background: 'white', padding: '12px 14px' }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', marginBottom: 3 }}>{project.name}</div>
        <div style={{ fontSize: 11, color: '#888', lineHeight: 1.4 }}>{project.address}</div>
        <div style={{ marginTop: 10, height: 3, background: '#f0efe9', borderRadius: 2 }}>
          <div style={{ height: '100%', width: isTemplate ? '100%' : '30%', background: project.color, borderRadius: 2 }} />
        </div>
      </div>
    </button>
  )
}
