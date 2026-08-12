import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('medsafe_token')
    const storedUser = localStorage.getItem('medsafe_user')
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('medsafe_token')
        localStorage.removeItem('medsafe_user')
      }
    }
    setLoading(false)
  }, [])

  function login(userData, jwtToken) {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem('medsafe_token', jwtToken)
    localStorage.setItem('medsafe_user', JSON.stringify(userData))
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('medsafe_token')
    localStorage.removeItem('medsafe_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
