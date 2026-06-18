import { useState } from 'react'
import ProjectsHome from './pages/ProjectsHome'
import MainPage from './pages/MainPage'
import RolePage from './pages/RolePage'
import LoginPage from './pages/LoginPage'
import { INITIAL_DATA } from './lib/data'
import { getDefaultRoles, TEMPLATE_DRAFT_CARDS } from './lib/defaultRoles'
import { PROJECTS } from './lib/projects'
import { ChevronLeft, ChevronRight, LayoutGrid, Home, LogOut } from 'lucide-react'

function initAllProjects() {
  const all = {}
  PROJECTS.forEach(p => {
    if (p.id === 'va') {
      all[p.id] = INITIAL_DATA
    } else if (p.id === 'test') {
      // Test project is the template — shows the canonical task list with stable IDs
      const roles = getDefaultRoles(p.name)
      roles.draft.cards = TEMPLATE_DRAFT_CARDS
      all[p.id] = roles
    } else {
      // All other projects get a fresh copy of the template with unique IDs
      all[p.id] = getDefaultRoles(p.name)
    }
  })
  return all
}

const ROLE_LABELS = { pm: 'Project Management', eng: 'Engineering', draft: 'Drafting', site: 'Site' }

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem('de_auth') === '1')
  const [activeProject, setActiveProject] = useState(null)
  const [activeRole, setActiveRole] = useState(null)
  const [allData, setAllData] = useState(initAllProjects)
  const [extraProjects, setExtraProjects] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  if (!loggedIn) {
    return <LoginPage onLogin={() => { sessionStorage.setItem('de_auth', '1'); setLoggedIn(true) }} />
  }

  const handleLogout = () => { sessionStorage.removeItem('de_auth'); setLoggedIn(false) }

  const allProjects = [...PROJECTS, ...extraProjects]

  const handleAddProject = ({ name, jobNumber, address, type, color }) => {
    const id = `proj_${Date.now()}`
    const newProject = {
      id, name, jobNumber, address, type, color,
      image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    }
    setExtraProjects(prev => [...prev, newProject])
    const roles = getDefaultRoles(name)
    setAllData(prev => ({ ...prev, [id]: roles }))
    setActiveProject(id)
    setActiveRole(null)
  }

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

  const project = allProjects.find(p => p.id === activeProject)

  const switchProject = (id) => { setActiveProject(id); setActiveRole(null) }

  const SIDEBAR_W = sidebarOpen ? 220 : 52

  const showSidebar = activeProject !== null && activeRole !== null

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>

      {/* ── Sidebar — only when inside a role board ── */}
      {showSidebar && <div style={{
        width: SIDEBAR_W, flexShrink: 0, background: '#1f1f2e',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
        transition: 'width 0.2s ease', overflow: 'hidden',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}>
        {/* Logo / toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: '16px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {sidebarOpen && (
            <span style={{ fontSize: 13, fontWeight: 700, color: 'white', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
              D&amp;E Group
            </span>
          )}
          <button onClick={() => setSidebarOpen(o => !o)}
            style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#aaa', padding: 6, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>

        {/* Home */}
        <button
          onClick={() => { setActiveProject(null); setActiveRole(null) }}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
            background: activeProject === null ? 'rgba(255,255,255,0.1)' : 'none',
            border: 'none', cursor: 'pointer', color: activeProject === null ? 'white' : '#aaa',
            width: '100%', textAlign: 'left', borderRadius: 0,
          }}
          onMouseEnter={e => { if (activeProject !== null) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
          onMouseLeave={e => { if (activeProject !== null) e.currentTarget.style.background = 'none' }}
        >
          <Home size={15} style={{ flexShrink: 0 }} />
          {sidebarOpen && <span style={{ fontSize: 13, whiteSpace: 'nowrap' }}>All Projects</span>}
        </button>

        {/* Divider + label */}
        {sidebarOpen && (
          <div style={{ padding: '12px 14px 4px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Workspace
          </div>
        )}

        {/* Project list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {allProjects.filter(p => !p.isTemplate).map(p => {
            const isActive = activeProject === p.id
            return (
              <div key={p.id}>
                {/* Project row */}
                <button
                  onClick={() => switchProject(p.id)}
                  title={p.name}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: sidebarOpen ? '9px 14px' : '9px 0', justifyContent: sidebarOpen ? 'flex-start' : 'center',
                    background: isActive ? 'rgba(255,255,255,0.12)' : 'none',
                    border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                    borderLeft: isActive ? `3px solid ${p.color}` : '3px solid transparent',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'none' }}
                >
                  {/* colour dot */}
                  <div style={{ width: 22, height: 22, borderRadius: 5, background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, fontWeight: 700, color: 'white' }}>
                    {p.name.charAt(0)}
                  </div>
                  {sidebarOpen && (
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: isActive ? 'white' : '#ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150 }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>{p.jobNumber}</div>
                    </div>
                  )}
                </button>

                {/* Role sub-items — only shown when this project is active and sidebar is open */}
                {isActive && sidebarOpen && (
                  <div style={{ paddingLeft: 36 }}>
                    {['pm', 'eng', 'draft', 'site'].map(role => (
                      <button key={role} onClick={() => setActiveRole(role)}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left', padding: '6px 12px',
                          background: activeRole === role ? 'rgba(255,255,255,0.08)' : 'none',
                          border: 'none', cursor: 'pointer', fontSize: 11,
                          color: activeRole === role ? 'white' : 'rgba(255,255,255,0.45)',
                          borderRadius: 4,
                        }}
                        onMouseEnter={e => { if (activeRole !== role) e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                        onMouseLeave={e => { if (activeRole !== role) e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
                      >
                        {ROLE_LABELS[role]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center' }}>
          {sidebarOpen && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>Mechanical Services — D&amp;E Group</span>}
          <button onClick={handleLogout} title="Sign out"
            style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 6, display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(226,68,92,0.2)'; e.currentTarget.style.color = '#E2445C' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}>
            <LogOut size={13} />
          </button>
        </div>
      </div>}

      {/* ── Main content ── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'auto', height: '100vh' }}>
        <div style={{ padding: activeRole ? '16px 20px' : '24px 32px', flex: 1, width: '100%', boxSizing: 'border-box' }}>
          {activeProject === null ? (
            <ProjectsHome onSelect={(id) => { setActiveProject(id); setActiveRole(null) }} onAddProject={handleAddProject} />
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
    </div>
  )
}
