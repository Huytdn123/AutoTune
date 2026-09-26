import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import logoImg from '../assets/logo.jpg'

/**
 * LoginModal - Brand Compliant Login & Role Selection
 * Format: Template_Bonhannhien_VirtualTune (Deep Navy #1F2F57, Soft Tech Blue #6091C3, Off-White #FDFAF9, Metallic Gray #A8A8A8)
 * Style: Tech-Industrial Minimalist · One Concept - One Message - One Visual Focus
 */
export default function LoginModal() {
  const { loginModalOpen, setLoginModalOpen, login, switchPersona, demoPersonas } = useAuth()
  const [username, setUsername] = useState('admin_garage')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  if (!loginModalOpen) return null

  const handleManualLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await login(username, password)
    setLoading(false)
    if (!res.success) {
      setError(res.message || 'Invalid username or password!')
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 select-none">
      
      {/* Modal Container: Tech-Industrial Minimalist · Deep Navy #1F2F57 Background */}
      <div 
        className="relative w-full max-w-lg rounded-xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: '#162447',
          border: '1.5px solid rgba(96,145,195,0.4)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(96,145,195,0.2)'
        }}
      >
        {/* Subtle CAD grid overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'radial-gradient(rgba(96,145,195,0.5) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Modal Header */}
        <div 
          className="relative px-6 py-5 border-b flex items-center justify-between"
          style={{ backgroundColor: '#1F2F57', borderColor: 'rgba(96,145,195,0.25)' }}
        >
          <div className="flex items-center gap-3">
            <img 
              src={logoImg} 
              alt="Virtual Tune" 
              className="h-9 w-auto object-contain"
              style={{ filter: 'brightness(1.1)' }}
            />
            <div className="border-l border-white/15 pl-3">
              <span 
                className="text-[10px] font-mono font-bold tracking-widest uppercase block"
                style={{ color: '#6091C3' }}
              >
                [AUTHENTICATION SYSTEM]
              </span>
              <span className="text-xs font-semibold text-white/70">
                B2B Automotive Platform
              </span>
            </div>
          </div>

          <button
            onClick={() => setLoginModalOpen(false)}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative p-6 space-y-6">

          {/* Quick Demo Persona Switcher (1-Click) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span 
                className="text-xs font-extrabold uppercase tracking-wider font-['Montserrat']"
                style={{ color: '#FDFAF9' }}
              >
                QUICK DEMO PERSONA (1-CLICK LOGIN)
              </span>
              <span 
                className="text-[10px] font-mono px-2 py-0.5 rounded font-bold"
                style={{ backgroundColor: 'rgba(96,145,195,0.15)', color: '#6091C3', border: '1px solid rgba(96,145,195,0.3)' }}
              >
                3 ROLES
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {demoPersonas.map((p) => {
                const icon = p.role === 'GARAGE_OWNER' ? 'admin_panel_settings' : p.role === 'LEAD_TECHNICIAN' ? 'engineering' : 'directions_car'
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => switchPersona(p)}
                    className="p-3 rounded-lg text-left transition-all duration-150 border hover:scale-[1.02] cursor-pointer group"
                    style={{
                      backgroundColor: 'rgba(31,47,87,0.7)',
                      borderColor: 'rgba(96,145,195,0.3)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = 'rgba(96,145,195,0.25)'
                      e.currentTarget.style.borderColor = '#6091C3'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'rgba(31,47,87,0.7)'
                      e.currentTarget.style.borderColor = 'rgba(96,145,195,0.3)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span 
                        className="material-symbols-outlined text-lg"
                        style={{ color: p.badgeColor }}
                      >
                        {icon}
                      </span>
                      <span 
                        className="text-[9px] font-mono font-bold px-1 rounded uppercase"
                        style={{ color: p.badgeColor, backgroundColor: 'rgba(0,0,0,0.3)' }}
                      >
                        {p.role.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white truncate font-['Montserrat']">{p.fullName}</p>
                    <p className="text-[10px] text-white/50 truncate mt-0.5">{p.roleLabel}</p>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">OR SIGN IN WITH CREDENTIALS</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleManualLogin} data-no-global-intercept="true" className="space-y-4">
            {error && (
              <div 
                className="p-3 rounded-lg text-xs font-medium flex items-center gap-2"
                style={{ backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
              >
                <span className="material-symbols-outlined text-base">error</span>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider mb-1.5 font-mono">
                Username / Corporate Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-white/40 text-base">person</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  placeholder="admin_garage"
                  className="w-full pl-9 pr-3 py-2 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none transition-all"
                  style={{
                    backgroundColor: 'rgba(31,47,87,0.8)',
                    border: '1px solid rgba(96,145,195,0.3)',
                  }}
                  onFocus={e => e.target.style.borderColor = '#6091C3'}
                  onBlur={e => e.target.style.borderColor = 'rgba(96,145,195,0.3)'}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider mb-1.5 font-mono">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-white/40 text-base">lock</span>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none transition-all"
                  style={{
                    backgroundColor: 'rgba(31,47,87,0.8)',
                    border: '1px solid rgba(96,145,195,0.3)',
                  }}
                  onFocus={e => e.target.style.borderColor = '#6091C3'}
                  onBlur={e => e.target.style.borderColor = 'rgba(96,145,195,0.3)'}
                />
              </div>
              <p className="text-[10px] text-white/40 mt-1 font-mono">
                Default demo password: <code className="text-[#6091C3]">password123</code>
              </p>
            </div>

            <button
              type="submit"
              data-no-global-intercept="true"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 font-['Montserrat'] cursor-pointer shadow-lg hover:brightness-110 active:scale-98"
              style={{
                backgroundColor: '#6091C3',
                boxShadow: '0 4px 14px rgba(96,145,195,0.4)'
              }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">login</span>
                  <span>SIGN IN TO WORKSPACE</span>
                </>
              )}
            </button>
          </form>

        </div>

        {/* Modal Footer */}
        <div 
          className="px-6 py-3 border-t text-center text-[10px] font-mono text-white/40 flex items-center justify-between"
          style={{ backgroundColor: '#1F2F57', borderColor: 'rgba(96,145,195,0.15)' }}
        >
          <span>VIRTUAL TUNE OS · ISO 9001:2015</span>
          <span style={{ color: '#6091C3' }}>[LEGAL-CHECK PASSED]</span>
        </div>
      </div>
    </div>
  )
}
