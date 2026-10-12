import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const logoImg = '/images/logo.jpg'

/**
 * LoginModal - Brand Compliant Login & Role Selection
 * Format: Template_Bonhannhien_VirtualTune (Tech Blue #0115bc, Soft Tech Blue #3352E8, Off-White #FDFAF9, Metallic Gray #7B95C4)
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
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      
      {/* Modal Container: Clean Surface · Brand Navy Header · #0213B2 Actions */}
      <div 
        className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl bg-[#E5E8F0] dark:bg-[#14151D] border border-[#CBD5E1] dark:border-[#282A3A]"
        style={{
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)'
        }}
      >
        {/* Modal Header */}
        <div 
          className="relative px-6 py-5 border-b flex items-center justify-between"
          style={{ backgroundColor: '#0213B2', borderColor: 'rgba(255,255,255,0.15)' }}
        >
          <div className="flex items-center gap-3">
            <img 
              src={logoImg} 
              alt="Virtual Tune" 
              className="h-9 w-auto object-contain"
            />
            <div className="border-l border-white/15 pl-3">
              <span 
                className="text-[10px] font-mono font-bold tracking-widest uppercase block text-[#FDFAF9]"
              >
                [AUTHENTICATION SYSTEM]
              </span>
              <span className="text-xs font-semibold text-white/90">
                B2B Automotive Platform
              </span>
            </div>
          </div>

          <button
            onClick={() => setLoginModalOpen(false)}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative p-6 space-y-6 bg-[#E5E8F0] dark:bg-[#14151D] text-[#111827] dark:text-[#F8FAFC]">

          {/* Quick Demo Persona Switcher (1-Click) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span 
                className="text-xs font-extrabold uppercase tracking-wider font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC]"
              >
                QUICK DEMO PERSONA (1-CLICK LOGIN)
              </span>
              <span 
                className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-[#EEF2FF] dark:bg-[#161C3B] text-[#0213B2] dark:text-[#93C5FD] border border-[#CBD5E1] dark:border-[#282A3A]"
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
                    className="p-3 rounded-xl text-left transition-all duration-150 border hover:scale-[1.02] cursor-pointer group bg-[#E8EDFF] dark:bg-[#161C3B] hover:bg-[#D7E1FF] dark:hover:bg-[#1A224D] border-[#BCC7D8] dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA]"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span 
                        className="material-symbols-outlined text-lg"
                        style={{ color: p.badgeColor }}
                      >
                        {icon}
                      </span>
                      <span 
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase bg-[#E5E8F0] dark:bg-[#14151D] border border-[#CBD5E1] dark:border-[#282A3A]"
                        style={{ color: p.badgeColor }}
                      >
                        {p.role.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC] truncate font-['Montserrat']">{p.fullName}</p>
                    <p className="text-[10px] text-[#475569] dark:text-[#CBD5E1] truncate mt-0.5">{p.roleLabel}</p>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#CBD5E1] dark:bg-[#282A3A]" />
            <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] uppercase tracking-widest">OR SIGN IN WITH CREDENTIALS</span>
            <div className="h-px flex-1 bg-[#CBD5E1] dark:bg-[#282A3A]" />
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleManualLogin} data-no-global-intercept="true" className="space-y-4">
            {error && (
              <div 
                className="p-3 rounded-lg text-xs font-medium flex items-center gap-2"
                style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626' }}
              >
                <span className="material-symbols-outlined text-base">error</span>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-[#475569] dark:text-[#CBD5E1] uppercase tracking-wider mb-1.5 font-mono">
                Username / Corporate Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#64748B] dark:text-[#94A3B8] text-base">person</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  placeholder="admin_garage"
                  className="w-full pl-9 pr-3 py-2 rounded-lg text-sm bg-[#E5E8F0] dark:bg-[#1B1D28] text-[#111827] dark:text-[#F8FAFC] placeholder-[#94A3B8] border border-[#CBD5E1] dark:border-[#282A3A] focus:outline-none focus:border-[#0213B2] dark:focus:border-[#60A5FA] focus:ring-1 focus:ring-[#0213B2] dark:focus:ring-[#60A5FA] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#475569] dark:text-[#CBD5E1] uppercase tracking-wider mb-1.5 font-mono">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#64748B] dark:text-[#94A3B8] text-base">lock</span>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg text-sm bg-[#E5E8F0] dark:bg-[#1B1D28] text-[#111827] dark:text-[#F8FAFC] placeholder-[#94A3B8] border border-[#CBD5E1] dark:border-[#282A3A] focus:outline-none focus:border-[#0213B2] dark:focus:border-[#60A5FA] focus:ring-1 focus:ring-[#0213B2] dark:focus:ring-[#60A5FA] transition-all"
                />
              </div>
              <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-1 font-mono">
                Default demo password: <code className="text-[#0213B2] dark:text-[#60A5FA] font-bold">password123</code>
              </p>
            </div>

            <button
              type="submit"
              data-no-global-intercept="true"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 font-['Montserrat'] cursor-pointer shadow-md hover:bg-[#0115BC] active:bg-[#06169B]"
              style={{
                backgroundColor: '#0213B2',
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
          className="px-6 py-3 border-t text-center text-[10px] font-mono flex items-center justify-between bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]"
        >
          <span>VIRTUAL TUNE OS · ISO 9001:2015</span>
          <span className="text-[#0213B2] font-bold">[LEGAL-CHECK PASSED]</span>
        </div>
      </div>
    </div>
  )
}
