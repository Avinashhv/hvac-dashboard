import { Building2, FlaskConical, Heart, Copy } from 'lucide-react'
import { PROJECTS } from '../lib/projects'

const TYPE_ICONS = {
  Residential: Building2,
  Health: Heart,
  Test: FlaskConical,
  Template: Copy,
}

export default function ProjectsHome({ onSelect }) {
  const activeProjects = PROJECTS.filter(p => !p.isTemplate)
  const templateProject = PROJECTS.find(p => p.isTemplate)

  return (
    <div style={{ padding: '1.5rem 0' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: '#1a1a1a', margin: 0 }}>Projects</h1>
        <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Mechanical Services — D&E Group</p>
      </div>

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
    </div>
  )
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
      onMouseEnter={e => e.currentTarget.style.boxShadow = isTemplate ? '0 0 0 1.5px #bbb' : '0 0 0 1.5px #bbb'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = isTemplate ? 'none' : '0 0 0 0.5px #e0dfd8'}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 140, overflow: 'hidden', background: '#1a2f45' }}>
        <img
          src={project.image}
          alt={project.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: isTemplate ? 'grayscale(60%)' : 'none' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.55))' }} />
        {isTemplate && (
          <div style={{ position: 'absolute', top: 10, left: 12, background: '#888780', color: 'white', fontSize: 10, fontWeight: 700, borderRadius: 6, padding: '2px 8px', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Copy size={9} /> Template
          </div>
        )}
        <div style={{
          position: 'absolute', bottom: 10, left: 12, right: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '2px 8px' }}>
            {project.jobNumber}
          </span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon size={10} />
            {project.type}
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ background: 'white', padding: '12px 14px' }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', marginBottom: 3 }}>
          {project.name}
        </div>
        <div style={{ fontSize: 11, color: '#888', lineHeight: 1.4 }}>
          {project.address}
        </div>
        <div style={{ marginTop: 10, height: 3, background: '#f0efe9', borderRadius: 2 }}>
          <div style={{ height: '100%', width: isTemplate ? '100%' : '30%', background: project.color, borderRadius: 2 }} />
        </div>
      </div>
    </button>
  )
}
