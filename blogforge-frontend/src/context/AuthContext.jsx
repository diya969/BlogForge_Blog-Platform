import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token    = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    const id       = localStorage.getItem('userId')
    if (token && username) {
      setUser({ token, username, id })
      // ✅ Fetch fresh profile including photo
      api.get('/profile')
         .then(res => setUser(prev => ({ ...prev, ...res.data })))
         .catch(() => {})
    }
    setLoading(false)
  }, [])

  const login = (data) => {
    localStorage.setItem('token',    data.token)
    localStorage.setItem('username', data.username)
    localStorage.setItem('userId',   data.id)
    setUser({ token: data.token, username: data.username, id: data.id })
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  // ✅ Called after profile photo update
  const updateUser = (data) => {
    setUser(prev => ({ ...prev, ...data }))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}