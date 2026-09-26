import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api'

// Pre-defined demo account personas for quick testing (100% English)
export const DEMO_PERSONAS = [
  {
    id: 1,
    username: 'admin_garage',
    fullName: 'Tuan Tran',
    email: 'tuan.tran@autotune-saigon.vn',
    phone: '+84 908 112 345',
    role: 'GARAGE_OWNER',
    roleLabel: 'Garage Owner (B2B)',
    badgeColor: '#6091C3',
    garageName: 'AutoTune Saigon Performance Hub',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    status: 'ACTIVE',
    permissions: ['VIEW_DASHBOARD', 'MANAGE_FINANCE', 'DISPATCH_BAY', 'MANAGE_TEAM']
  },
  {
    id: 2,
    username: 'tech_lead',
    fullName: 'Long Nguyen',
    email: 'long.tech@autotune-saigon.vn',
    phone: '+84 912 345 678',
    role: 'LEAD_TECHNICIAN',
    roleLabel: 'Master Technician',
    badgeColor: '#10B981',
    garageName: 'AutoTune Saigon Performance Hub',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    status: 'ACTIVE',
    permissions: ['VIEW_DASHBOARD', 'DISPATCH_BAY', 'EXECUTE_WORK_ORDER', 'VALIDATE_FITMENT']
  },
  {
    id: 3,
    username: 'customer_vip',
    fullName: 'Khoi Dang',
    email: 'khoi.dang@gmail.com',
    phone: '+84 988 776 655',
    role: 'CAR_OWNER',
    roleLabel: 'VIP Client (Car Owner)',
    badgeColor: '#F59E0B',
    garageName: 'VIP Private Client',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    status: 'ACTIVE',
    permissions: ['CUSTOMIZE_3D', 'REQUEST_QUOTE', 'VIEW_WARRANTY']
  }
]

// Normalizer to guarantee uniform English names across backend & storage
export const normalizeUser = (u) => {
  if (!u) return null
  const englishNames = {
    'admin_garage': 'Tuan Tran',
    'tech_lead': 'Long Nguyen',
    'customer_vip': 'Khoi Dang',
    'tech_junior': 'Duc Vu'
  }
  let cleanName = u.fullName
  if (englishNames[u.username]) {
    cleanName = englishNames[u.username]
  } else if (cleanName && cleanName.includes('?')) {
    cleanName = u.username || 'User'
  }
  return { ...u, fullName: cleanName }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('vt_auth_user')
      const savedToken = localStorage.getItem('vt_auth_token')
      if (savedUser && savedToken) {
        return normalizeUser(JSON.parse(savedUser))
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

  // Verify authentication session with backend on start
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('vt_auth_token')
      if (savedToken) {
        try {
          const me = await authApi.getMe()
          if (me) {
            const normalized = normalizeUser(me)
            setCurrentUser(normalized)
            localStorage.setItem('vt_auth_user', JSON.stringify(normalized))
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

  // Login handler – with offline fallback for demo personas
  const login = async (username, password) => {
    try {
      const res = await authApi.login(username.trim(), password)
      if (res && res.success && res.token) {
        setToken(res.token)
        localStorage.setItem('vt_auth_token', res.token)
        // Call /api/auth/me from authenticated context
        try {
          const me = await authApi.getMe()
          if (me) {
            const normalized = normalizeUser(me)
            setCurrentUser(normalized)
            localStorage.setItem('vt_auth_user', JSON.stringify(normalized))
            setLoginModalOpen(false)
            return { success: true, user: normalized }
          }
        } catch {
          // fallback to user returned from login
        }
        const normalized = normalizeUser(res.user)
        setCurrentUser(normalized)
        localStorage.setItem('vt_auth_user', JSON.stringify(normalized))
        setLoginModalOpen(false)
        return { success: true, user: normalized }
      }
      return { success: false, message: res?.message || 'Authentication failed' }
    } catch (err) {
      // If backend is unreachable, try offline demo persona match
      const persona = DEMO_PERSONAS.find(p => p.username === username.trim())
      if (persona && password === 'password123') {
        const offlineUser = { ...persona, offlineMode: true }
        setCurrentUser(offlineUser)
        setToken('VT-TOKEN-OFFLINE-' + persona.username)
        localStorage.setItem('vt_auth_token', 'VT-TOKEN-OFFLINE-' + persona.username)
        localStorage.setItem('vt_auth_user', JSON.stringify(offlineUser))
        setLoginModalOpen(false)
        return { success: true, user: offlineUser }
      }
      const errorMsg = err.response?.data?.message || 'Invalid username or password!'
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

  // 1-Click quick role switcher calling real backend login
  const switchPersona = async (personaOrRole) => {
    let target = null
    if (typeof personaOrRole === 'string') {
      target = DEMO_PERSONAS.find(p => p.role === personaOrRole) || DEMO_PERSONAS[0]
    } else {
      target = personaOrRole
    }

    if (target) {
      try {
        const res = await authApi.login(target.username, 'password123')
        if (res && res.success && res.user) {
          setCurrentUser(res.user)
          setToken(res.token)
          localStorage.setItem('vt_auth_token', res.token)
          localStorage.setItem('vt_auth_user', JSON.stringify(res.user))
        }
      } catch {
        // Fallback local switch
        setCurrentUser(target)
      }
    }
    setLoginModalOpen(false)
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || 'GUEST',
        isAuthenticated: !!currentUser,
        token,
        login,
        logout,
        switchPersona,
        loginModalOpen,
        setLoginModalOpen,
        demoPersonas: DEMO_PERSONAS
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
