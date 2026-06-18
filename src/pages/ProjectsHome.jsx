import { useState } from 'react'
import { Building2, Heart, Copy, Plus, X, Archive, ArchiveRestore, ChevronDown, ChevronRight } from 'lucide-react'
import { PROJECTS } from '../lib/projects'

const TYPE_ICONS = {
  Residential: Building2, Health: Heart, Commercial: Building2,
  Industrial: Building2, Education: Building2, Retail: Building2, Template: Copy,
}

const PROJECT_TYPES = ['Residential', 'Commercial', 'Health', 'Industrial', 'Education', 'Retail']
const PROJECT_COLORS = ['#7F77DD', '#1D9E75', '#378ADD', '#D85A30', '#E2445C', '#FDAB3D', '#0096c7', '#888780']

export default function ProjectsHome({ onSelect, onAddProject, archivedIds, onArchive, onUnarchive }) {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', jobNumber: '', address: '', type: 'Residential', color: '#7F77DD' })
  const [error, setError] = useState('')
  const [archiveOpen, setArchiveOpen] = useState(false)

  const allActive = PROJECTS.filter(p => !p.isTemplate && !archivedIds.has(p.id))
  const archived  = PROJECTS.filter(p => !p.isTemplate && archivedIds.has(p.id))

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
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: '#1a1a1a', margin: 0 }}>Projects</h1>
        <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Mechanical Services — D&E Group</p>
      </div>

      {/* Active projects grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {allActive.map(project => (
          <ProjectCard key={project.id} project={project} onSelect={onSelect} onArchive={onArchive} />
        ))}

        {/* New Project tile */}
        <button
          onClick={() => { setShowModal(true); setError('') }}
          style={{ border: '2px dashed #d0cfc8', borderRadius: 12, background: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#7F77DD'; e.currentTarget.style.background = '#f8f7ff' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#d0cfc8'; e.currentTarget.style.background = 'none' }}
        >
          <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, width: '100%' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f0efe9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={22} color="#7F77DD" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#7F77DD' }}>New Project</span>
          </div>
          <div style={{ background: 'white', padding: '12px 14px', borderTop: '1px solid #f0efe9', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#aaa' }}>Create from template</div>
            <div style={{ fontSize: 11, color: '#ccc', marginTop: 3 }}>Starts with standard HVAC task list</div>
          </div>
        </button>
      </div>

      {/* Archive section */}
      <div style={{ marginTop: 36 }}>
        <button
          onClick={() => setArchiveOpen(o => !o)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', width: '100%' }}
        >
          <div style={{ width: 28, height: 28, borderRadius: 7, background: '#f0efe9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Archive size={14} color="#888" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#888' }}>Archive</span>
          {archived.length > 0 && (
            <span style={{ fontSize: 11, background: '#f0efe9', color: '#888', borderRadius: 10, padding: '1px 7px', fontWeight: 600 }}>
              {archived.length}
            </span>
          )}
          {archiveOpen ? <ChevronDown size={14} color="#aaa" style={{ marginLeft: 'auto' }} /> : <ChevronRight size={14} color="#aaa" style={{ marginLeft: 'auto' }} />}
        </button>

        {archiveOpen && (
          <div style={{ marginTop: 12 }}>
            {archived.length === 0 ? (
              <div style={{ fontSize: 13, color: '#bbb', padding: '20px 0', textAlign: 'center', border: '1.5px dashed #e0dfd8', borderRadius: 10 }}>
                No archived projects yet — hover a project card and click Archive to move it here.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {archived.map(project => (
                  <ProjectCard key={project.id} project={project} onSelect={onSelect} onUnarchive={onUnarchive} isArchived />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Project modal */}
      {showModal && (
        <>
          <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 400 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'white', borderRadius: 14, padding: '28px 28px 24px', width: 440, zIndex: 500, boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>New Project</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', padding: 4 }}><X size={16} /></button>
            </div>

            <Field label="Project Name *">
              <input autoFocus value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setError('') }}
                placeholder="e.g. Chevron One Apartments" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#7F77DD'} onBlur={e => e.target.style.borderColor = '#e0dfd8'}
                onKeyDown={e => { if (e.key === 'Enter') handleAdd() }} />
            </Field>

            <Field label="Job Number *">
              <input value={form.jobNumber} onChange={e => { setForm(f => ({ ...f, jobNumber: e.target.value })); setError('') }}
                placeholder="e.g. QBM00031" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#7F77DD'} onBlur={e => e.target.style.borderColor = '#e0dfd8'}
                onKeyDown={e => { if (e.key === 'Enter') handleAdd() }} />
            </Field>

            <Field label="Address">
              <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                placeholder="e.g. 12 Example St, Brisbane QLD" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#7F77DD'} onBlur={e => e.target.style.borderColor = '#e0dfd8'}
                onKeyDown={e => { if (e.key === 'Enter') handleAdd() }} />
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
                    style={{ width: 28, height: 28, borderRadius: 7, background: c, border: 'none', cursor: 'pointer', outline: form.color === c ? `3px solid ${c}` : 'none', outlineOffset: 2, transform: form.color === c ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.1s' }} />
                ))}
              </div>
            </Field>

            {error && <div style={{ fontSize: 12, color: '#E2445C', marginBottom: 12 }}>{error}</div>}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '9px 16px', borderRadius: 8, border: '0.5px solid #e0dfd8', background: 'white', fontSize: 13, cursor: 'pointer', color: '#666' }}>Cancel</button>
              <button onClick={handleAdd}
                style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: '#1f1f2e', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#7F77DD'}
                onMouseLeave={e => e.currentTarget.style.background = '#1f1f2e'}>
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

function ProjectCard({ project, onSelect, onArchive, onUnarchive, isArchived }) {
  const [hovered, setHovered] = useState(false)
  const Icon = TYPE_ICONS[project.type] || Building2

  return (
    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', boxShadow: '0 0 0 0.5px #e0dfd8' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={() => !isArchived && onSelect(project.id)}
        style={{ border: 'none', padding: 0, background: 'none', cursor: isArchived ? 'default' : 'pointer', textAlign: 'left', width: '100%', display: 'block' }}
      >
        <div style={{ position: 'relative', height: 140, overflow: 'hidden', background: '#1a2f45' }}>
          <img
            src={project.image || 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80'}
            alt={project.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: isArchived ? 'grayscale(70%)' : 'none', opacity: isArchived ? 0.7 : 1 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.55))' }} />
          {isArchived && (
            <div style={{ position: 'absolute', top: 10, left: 12, background: 'rgba(0,0,0,0.55)', color: '#ccc', fontSize: 10, fontWeight: 700, borderRadius: 6, padding: '2px 8px', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Archive size={9} /> Archived
            </div>
          )}
          <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '2px 8px' }}>{project.jobNumber}</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon size={10} />{project.type}
            </span>
          </div>
        </div>
        <div style={{ background: 'white', padding: '12px 14px' }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: isArchived ? '#aaa' : '#1a1a1a', marginBottom: 3 }}>{project.name}</div>
          <div style={{ fontSize: 11, color: '#aaa', lineHeight: 1.4 }}>{project.address}</div>
          <div style={{ marginTop: 10, height: 3, background: '#f0efe9', borderRadius: 2 }}>
            <div style={{ height: '100%', width: '30%', background: isArchived ? '#ccc' : project.color, borderRadius: 2 }} />
          </div>
        </div>
      </button>

      {/* Archive / Restore button — appears on hover */}
      {hovered && (
        <button
          onClick={e => { e.stopPropagation(); isArchived ? onUnarchive(project.id) : onArchive(project.id) }}
          title={isArchived ? 'Restore project' : 'Move to archive'}
          style={{
            position: 'absolute', top: 10, right: 10,
            background: isArchived ? 'rgba(0,200,117,0.85)' : 'rgba(0,0,0,0.55)',
            border: 'none', borderRadius: 7, cursor: 'pointer',
            color: 'white', padding: '5px 9px', fontSize: 11, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 5,
            backdropFilter: 'blur(4px)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = isArchived ? '#00C875' : 'rgba(0,0,0,0.8)'}
          onMouseLeave={e => e.currentTarget.style.background = isArchived ? 'rgba(0,200,117,0.85)' : 'rgba(0,0,0,0.55)'}
        >
          {isArchived ? <><ArchiveRestore size={12} /> Restore</> : <><Archive size={12} /> Archive</>}
        </button>
      )}
    </div>
  )
}
