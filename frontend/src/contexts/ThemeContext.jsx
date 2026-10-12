import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // 1. Initial state: restore saved preference if valid ('light' or 'dark').
  // If no saved preference exists, use 'light' as the default for first-time visitors.
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('vt_theme') || localStorage.getItem('theme')
        if (savedTheme === 'light' || savedTheme === 'dark') {
          return savedTheme
        }
      } catch (e) {
        console.warn('Unable to access localStorage for theme', e)
      }
    }
    return 'light'
  })

  // 2. Synchronize DOM classes, data attributes, and color scheme when theme changes.
  // Note: We do not write to localStorage here on initial mount so first-time visitors
  // without saved preference are not prematurely locked in until they make a choice.
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
      root.setAttribute('data-theme', 'dark')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
      root.setAttribute('data-theme', 'light')
      root.style.colorScheme = 'light'
    }
  }, [theme])

  // 3. User explicit selection: persist user's chosen theme to localStorage
  const setTheme = useCallback((newTheme) => {
    if (newTheme !== 'light' && newTheme !== 'dark') return
    setThemeState(newTheme)
    try {
      localStorage.setItem('vt_theme', newTheme)
    } catch (e) {
      console.warn('Unable to persist theme to localStorage', e)
    }
  }, [])

  // 4. User explicit toggle: flip theme and persist to localStorage
  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem('vt_theme', next)
      } catch (e) {
        console.warn('Unable to persist theme to localStorage', e)
      }
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext

