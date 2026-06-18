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

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '24px 16px', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
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
  )
}
