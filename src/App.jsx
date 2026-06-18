import { useState } from 'react'
import MainPage from './pages/MainPage'
import RolePage from './pages/RolePage'
import { INITIAL_DATA } from './lib/data'

export default function App() {
  const [activeRole, setActiveRole] = useState(null)
  const [rolesData, setRolesData] = useState(INITIAL_DATA)

  const setCards = (roleKey) => (updater) => {
    setRolesData(prev => ({
      ...prev,
      [roleKey]: {
        ...prev[roleKey],
        cards: typeof updater === 'function' ? updater(prev[roleKey].cards) : updater,
      },
    }))
  }

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '24px 16px', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      {activeRole === null ? (
        <MainPage rolesData={rolesData} onSelect={setActiveRole} />
      ) : (
        <RolePage
          roleKey={activeRole}
          roleData={rolesData[activeRole]}
          cards={rolesData[activeRole].cards}
          setCards={setCards(activeRole)}
          onBack={() => setActiveRole(null)}
        />
      )}
    </div>
  )
}
