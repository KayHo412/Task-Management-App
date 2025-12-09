import { useState, useEffect } from 'react'
import './App.css'
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

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="app">
      {!auth ? (
        <AuthPage onLogin={handleLogin} />
      ) : (
        <TaskBoard token={auth.token} onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App