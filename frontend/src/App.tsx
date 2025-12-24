import { useState, useEffect } from 'react'
import './styles/global.css'
import AuthPage from './pages/AuthPage'
import TaskBoard from './pages/TaskBoard'

interface AuthToken {
  token: string
  userId: string
}

function App() {
  const [auth, setAuth] = useState<AuthToken | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userId = localStorage.getItem('userId')
    if (token && userId) {
      setAuth({ token, userId })
    }
    setLoading(false)
  }, [])

  const handleLogin = (token: string, userId: string) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('userId', userId)
    setAuth({ token, userId })
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userId')
    setAuth(null)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
          <div style={{ color: 'var(--text-light)', fontSize: '1rem' }}>Loading TaskFlow...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      {!auth ? (
        <AuthPage onLogin={handleLogin} />
      ) : (
        <TaskBoard token={auth.token} onLogout={handleLogout} />
      )}
    </>
  )
}

export default App