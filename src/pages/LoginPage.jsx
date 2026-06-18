import { useState } from 'react'

const VALID_USER = 'admin'
const VALID_PASS = 'admin'

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username === VALID_USER && password === VALID_PASS) {
      onLogin()
    } else {
      setError('Incorrect username or password.')
      setPassword('')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f7f6f2', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
    }}>
      <div style={{
        background: 'white', borderRadius: 16, padding: '40px 36px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.10)', width: 340,
      }}>
        {/* Logo area */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: '#1f1f2e',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px', fontSize: 20,
          }}>🏗️</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>D&E Group</div>
          <div style={{ fontSize: 12, color: '#999', marginTop: 3 }}>Mechanical Services Dashboard</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5 }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError('') }}
              placeholder="Enter username"
              autoFocus
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 13,
                border: '1px solid #e0dfd8', outline: 'none', boxSizing: 'border-box',
                background: '#fafaf8', color: '#1a1a1a',
              }}
              onFocus={e => e.target.style.borderColor = '#7F77DD'}
              onBlur={e => e.target.style.borderColor = '#e0dfd8'}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              placeholder="Enter password"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 13,
                border: '1px solid #e0dfd8', outline: 'none', boxSizing: 'border-box',
                background: '#fafaf8', color: '#1a1a1a',
              }}
              onFocus={e => e.target.style.borderColor = '#7F77DD'}
              onBlur={e => e.target.style.borderColor = '#e0dfd8'}
            />
          </div>

          {error && (
            <div style={{ fontSize: 12, color: '#E2445C', marginBottom: 14, textAlign: 'center', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <button type="submit" style={{
            width: '100%', padding: '11px', borderRadius: 8, border: 'none',
            background: '#1f1f2e', color: 'white', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', letterSpacing: '0.02em',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#7F77DD'}
            onMouseLeave={e => e.currentTarget.style.background = '#1f1f2e'}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
