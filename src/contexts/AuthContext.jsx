import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

/**
 * AuthProvider - Manages authentication state globally
 *
 * User object structure:
 * {
 *   id: string,
 *   name: string,
 *   email: string,
 *   role: 'COMMUNITY' | 'COLLECTOR' | 'STAKEHOLDER',
 *   phone: string,
 *   profile: { ... },
 *   createdAt: string,
 *   updatedAt: string
 * }
 *
 * Role values are UPPERCASE: COMMUNITY, COLLECTOR, STAKEHOLDER
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }

    setIsLoading(false)
  }, [])

  const login = (token, user) => {
    setToken(token)
    setUser(user)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
