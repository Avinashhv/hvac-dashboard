import { useState } from 'react'
import ProjectsHome from './pages/ProjectsHome'
import MainPage from './pages/MainPage'
import RolePage from './pages/RolePage'
import { INITIAL_DATA } from './lib/data'
import { getDefaultRoles } from './lib/defaultRoles'
import { PROJECTS } from './lib/projects'

function initAllProjects() {
  const all = {}
  PROJECTS.forEach(p => {
    all[p.id] = p.id === 'va' ? INITIAL_DATA : getDefaultRoles(p.name)
  })
  return all
}

export default function App() {
  const [activeProject, setActiveProject] = useState(null)
  const [activeRole, setActiveRole] = useState(null)
  const [allData, setAllData] = useState(initAllProjects)

  const rolesData = activeProject ? allData[activeProject] : null

  const setCards = (roleKey) => (updater) => {
    setAllData(prev => ({
      ...prev,
      [activeProject]: {
        ...prev[activeProject],
        [roleKey]: {
          ...prev[activeProject][roleKey],
          cards: typeof updater === 'function' ? updater(prev[activeProject][roleKey].cards) : updater,
        },
      },
    }))
  }

  const project = PROJECTS.find(p => p.id === activeProject)

  const switchProject = (id) => {
    setActiveProject(id)
    setActiveRole(null)
  }

  return (
    <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>

      {/* Project switcher bar — only shown when inside a project */}
      {activeProject !== null && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '8px 32px', borderBottom: '0.5px solid #e0dfd8',
          background: 'white', overflowX: 'auto',
          position: 'sticky', top: 0, zIndex: 50,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <span style={{ fontSize: 11, color: '#aaa', fontWeight: 500, marginRight: 8, whiteSpace: 'nowrap' }}>Projects:</span>
          {PROJECTS.map(p => (
            <button
              key={p.id}
              onClick={() => switchProject(p.id)}
              style={{
                padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
                background: activeProject === p.id ? p.color : '#f0efe9',
                color: activeProject === p.id ? 'white' : '#555',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (activeProject !== p.id) e.currentTarget.style.background = '#e0dfd8' }}
              onMouseLeave={e => { if (activeProject !== p.id) e.currentTarget.style.background = '#f0efe9' }}
            >
              {p.name}
            </button>
          ))}
          <button
            onClick={() => { setActiveProject(null); setActiveRole(null) }}
            style={{ marginLeft: 'auto', padding: '5px 14px', borderRadius: 20, border: '0.5px solid #e0dfd8', cursor: 'pointer', fontSize: 12, color: '#888', background: 'white', whiteSpace: 'nowrap' }}
          >
            ← All Projects
          </button>
        </div>
      )}

      <div style={{ padding: '24px 32px' }}>
      {activeProject === null ? (
        <ProjectsHome onSelect={(id) => { setActiveProject(id); setActiveRole(null) }} />
      ) : activeRole === null ? (
        <MainPage
          project={project}
          rolesData={rolesData}
          onSelect={setActiveRole}
          onBack={() => setActiveProject(null)}
        />
      ) : (
        <RolePage
          roleKey={activeRole}
          roleData={rolesData[activeRole]}
          cards={rolesData[activeRole].cards}
          setCards={setCards(activeRole)}
          onBack={() => setActiveRole(null)}
          projectName={project?.name}
        />
      )}
      </div>
    </div>
  )
}
