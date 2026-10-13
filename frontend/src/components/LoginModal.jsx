import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const logoImg = '/images/logo.jpg'

/**
 * LoginModal - Clean & Compact Authentication Modal
 * Simple email/username field, password field, Sign In button, and Close button.
 * No unnecessary role cards, technical labels, or intermediate confirmation screens.
 */
export default function LoginModal() {
  const { loginModalOpen, closeLoginModal, login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  if (!loginModalOpen) return null

  const handleClose = () => {
    setError(null)
    closeLoginModal()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password) return

    setLoading(true)
    setError(null)

    const res = await login(username, password)
    setLoading(false)

    if (!res.success) {
      setError(res.message || 'Invalid username or password')
    } else {
      setUsername('')
      setPassword('')
    }
  }

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div 
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] transition-all"
        style={{
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)'
        }}
      >
        {/* Header */}
        <div 
          className="px-6 py-4 border-b flex items-center justify-between text-white"
          style={{ backgroundColor: '#0213B2', borderColor: 'rgba(255, 255, 255, 0.15)' }}
        >
          <div className="flex items-center gap-3">
            <img 
              src={logoImg} 
              alt="Virtual Tune" 
              className="h-8 w-auto object-contain rounded"
            />
            <div className="border-l border-white/20 pl-3">
              <h2 className="text-sm font-bold font-['Montserrat'] tracking-tight">
                Sign In
              </h2>
              <p className="text-[11px] text-white/80">
                Virtual Tune Platform
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} data-no-global-intercept="true" className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 flex items-center gap-2 animate-in fade-in duration-150">
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5 font-['Montserrat']">
              Username or Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-base">
                person
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                placeholder="e.g. admin_garage"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-[#1B1D28] text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-slate-300 dark:border-[#282A3A] focus:outline-none focus:border-[#0213B2] dark:focus:border-[#60A5FA] focus:ring-1 focus:ring-[#0213B2] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5 font-['Montserrat']">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-base">
                lock
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-[#1B1D28] text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-slate-300 dark:border-[#282A3A] focus:outline-none focus:border-[#0213B2] dark:focus:border-[#60A5FA] focus:ring-1 focus:ring-[#0213B2] transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
              Demo accounts: <span className="font-mono font-medium text-slate-700 dark:text-slate-300">admin_garage, tech_lead, customer_vip</span> (pwd: <span className="font-mono">password123</span>)
            </p>
          </div>

          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 px-4 rounded-lg text-xs font-bold font-['Montserrat'] text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#1B1D28] hover:bg-slate-200 dark:hover:bg-[#252838] border border-slate-200 dark:border-[#282A3A] transition-colors cursor-pointer text-center"
            >
              Close
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-lg text-xs font-bold font-['Montserrat'] uppercase tracking-wider text-white bg-[#0213B2] hover:bg-[#0115BC] active:bg-[#06169B] transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">login</span>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
