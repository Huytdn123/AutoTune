import React from 'react'
import { Link } from 'react-router-dom'

export default function NavbarUserMenu({
  currentUser,
  role,
  userMenuOpen,
  setUserMenuOpen,
  logout,
  openLoginModal,
  isDark
}) {
  if (!currentUser) {
    return (
      <button
        type="button"
        onClick={() => openLoginModal()}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold font-['Montserrat'] uppercase tracking-wider transition-all duration-150 hover:bg-[#0115BC] active:bg-[#06169B] shadow-xs cursor-pointer"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          color: '#ffffff',
        }}
      >
        <span className="material-symbols-outlined text-base" style={{ color: '#ffffff' }}>login</span>
        <span>SIGN IN</span>
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer hover:bg-[#0115BC]"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.18)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <div 
          className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            border: '1.5px solid rgba(255, 255, 255, 0.6)',
            color: '#FFFFFF'
          }}
        >
          {currentUser.fullName ? currentUser.fullName.charAt(0) : 'U'}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-xs font-bold text-white truncate max-w-[120px]">
            {currentUser.fullName || currentUser.username}
          </div>
          <div 
            className="text-[9px] font-mono font-bold uppercase tracking-wider truncate text-white/80"
          >
            {role.replace('_', ' ')}
          </div>
        </div>
        <span className="material-symbols-outlined text-white text-sm">expand_more</span>
      </button>

      {/* User Dropdown */}
      {userMenuOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 rounded-xl p-2 z-[110] shadow-xl animate-in fade-in transition-colors duration-150"
          style={{
            backgroundColor: isDark ? '#14151D' : '#E5E8F0',
            border: isDark ? '1px solid #282A3A' : '1px solid #E2E8F0',
            boxShadow: isDark ? '0 12px 32px rgba(0, 0, 0, 0.5)' : '0 12px 32px rgba(15, 23, 42, 0.12)'
          }}
        >
          <div className="p-2.5 border-b mb-1" style={{ borderColor: isDark ? '#282A3A' : '#E2E8F0' }}>
            <p className="text-xs font-bold" style={{ color: isDark ? '#F8FAFC' : '#111827' }}>{currentUser.fullName}</p>
            <p className="text-[10px] font-mono truncate" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>{currentUser.email || currentUser.username}</p>
            <span 
              className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase"
              style={{
                backgroundColor: isDark ? '#161C3B' : '#EEF2FF',
                color: role === 'GARAGE_OWNER' ? (isDark ? '#93C5FD' : '#0213B2') : role === 'LEAD_TECHNICIAN' ? '#16A34A' : '#D97706',
                border: isDark ? '1px solid #282A3A' : '1px solid #CBD5E1'
              }}
            >
              {role}
            </span>
          </div>

          <Link
            to="/account"
            onClick={() => setUserMenuOpen(false)}
            className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors"
            style={{ color: isDark ? '#CBD5E1' : '#475569' }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = isDark ? '#1E202C' : '#F1F5F9'
              e.currentTarget.style.color = isDark ? '#93C5FD' : '#0213B2'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = isDark ? '#CBD5E1' : '#475569'
            }}
          >
            <span className="material-symbols-outlined text-base" style={{ color: isDark ? '#93C5FD' : '#0213B2' }}>account_circle</span>
            <span>My Account & Builds</span>
          </Link>

          {currentUser && ['GARAGE_OWNER', 'LEAD_TECHNICIAN', 'ADMIN'].includes(role) && (
            <Link
              to="/dashboard"
              onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors"
              style={{ color: isDark ? '#CBD5E1' : '#475569' }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = isDark ? '#1E202C' : '#F1F5F9'
                e.currentTarget.style.color = isDark ? '#93C5FD' : '#0213B2'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = isDark ? '#CBD5E1' : '#475569'
              }}
            >
              <span className="material-symbols-outlined text-base" style={{ color: isDark ? '#93C5FD' : '#0213B2' }}>dashboard</span>
              <span>Dashboard</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => {
              setUserMenuOpen(false)
              logout()
            }}
            className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-[#DC2626] hover:bg-[#FEE2E2] dark:hover:bg-[#DC2626]/20 transition-colors cursor-pointer border-t mt-1 pt-2"
            style={{ borderColor: isDark ? '#282A3A' : '#E2E8F0' }}
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  )
}
