import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('vt_auth_user')
      const savedToken = localStorage.getItem('vt_auth_token')
      if (savedUser && savedToken) {
        return JSON.parse(savedUser)
      }
      return null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('vt_auth_token') || null
  })

  const [loginModalOpen, setLoginModalOpen] = useState(false)

  const openLoginModal = () => setLoginModalOpen(true)
  const closeLoginModal = () => setLoginModalOpen(false)

  // Verify authentication session with backend on start
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('vt_auth_token')
      if (savedToken) {
        try {
          const me = await authApi.getMe()
          if (me) {
            setCurrentUser(me)
            localStorage.setItem('vt_auth_user', JSON.stringify(me))
          }
        } catch {
          // Token expired or invalid
          setCurrentUser(null)
          setToken(null)
          localStorage.removeItem('vt_auth_token')
          localStorage.removeItem('vt_auth_user')
        }
      }
    }
    initAuth()
  }, [])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vt_auth_user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('vt_auth_user')
    }
  }, [currentUser])

  // Real backend authentication
  const login = async (username, password) => {
    try {
      const res = await authApi.login(username.trim(), password)
      if (res && res.success && res.token) {
        setToken(res.token)
        localStorage.setItem('vt_auth_token', res.token)

        // Fetch /api/auth/me to get the full authenticated UserDTO
        let user = res.user
        try {
          const me = await authApi.getMe()
          if (me) user = me
        } catch {
          // use user from login response
        }

        setCurrentUser(user)
        localStorage.setItem('vt_auth_user', JSON.stringify(user))
        closeLoginModal()
        return { success: true, user }
      }
      return { success: false, message: res?.message || 'Invalid username or password' }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid username or password'
      return { success: false, message: errorMsg }
    }
  }

  // Logout handler
  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // Ignore network error on logout
    }
    setCurrentUser(null)
    setToken(null)
    localStorage.removeItem('vt_auth_token')
    localStorage.removeItem('vt_auth_user')
  }

  const updateCurrentUser = (updatedUser) => {
    if (!updatedUser) return
    setCurrentUser(updatedUser)
    localStorage.setItem('vt_auth_user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || 'GUEST',
        isAuthenticated: Boolean(currentUser && token),
        token,
        login,
        logout,
        updateCurrentUser,
        loginModalOpen,
        setLoginModalOpen,
        openLoginModal,
        closeLoginModal
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
