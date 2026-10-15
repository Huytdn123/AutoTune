import React from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../ThemeToggle'

export default function NavbarMobileDrawer({
  mobileMenuOpen,
  setMobileMenuOpen,
  filteredGroups,
  currentUser,
  logout,
  openLoginModal,
  setLoginModalOpen,
  isDark,
  location,
  navigate
}) {
  if (!mobileMenuOpen) return null

  return (
    <div
      className="lg:hidden px-4 py-4 space-y-4 max-h-[85vh] overflow-y-auto transition-colors duration-150"
      style={{
        backgroundColor: isDark ? '#14151D' : '#E5E8F0',
        borderTop: isDark ? '1px solid #282A3A' : '1px solid #E2E8F0',
        color: isDark ? '#F8FAFC' : '#111827'
      }}
    >
      {/* Mobile Theme Toggle Row */}
      <div
        className="flex items-center justify-between p-2.5 rounded-lg"
        style={{
          backgroundColor: isDark ? '#1B1D28' : '#F8FAFC',
          border: isDark ? '1px solid #282A3A' : '1px solid #E2E8F0',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm" style={{ color: isDark ? '#93C5FD' : '#0213B2' }}>
            {isDark ? 'dark_mode' : 'light_mode'}
          </span>
          <span className="text-xs font-bold" style={{ color: isDark ? '#F8FAFC' : '#111827' }}>
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </span>
        </div>
        <ThemeToggle />
      </div>

      <Link
        to="/"
        onClick={() => setMobileMenuOpen(false)}
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          backgroundColor: location.pathname === '/' ? (isDark ? '#161C3B' : '#EEF2FF') : 'transparent',
          color: location.pathname === '/' ? (isDark ? '#93C5FD' : '#0213B2') : (isDark ? '#F8FAFC' : '#111827'),
          border: location.pathname === '/' ? (isDark ? '1px solid #282A3A' : '1px solid #CBD5E1') : '1px solid transparent',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '17px', color: '#0213B2' }}>home</span>
        <span>Platform Landing</span>
      </Link>

      {filteredGroups.map((group) => (
        <div key={group.groupId} className="space-y-1">
          <div
            className="px-3 py-1 text-[10px] uppercase tracking-widest font-extrabold flex items-center gap-2"
            style={{ color: isDark ? '#93C5FD' : '#0213B2' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{group.icon}</span>
            <span>{group.label}</span>
          </div>
          <div className="space-y-1 pl-1">
            {group.items.map((item) => {
              const isCurrent = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    color: isCurrent ? (isDark ? '#93C5FD' : '#0213B2') : (isDark ? '#CBD5E1' : '#475569'),
                    backgroundColor: isCurrent ? (isDark ? '#161C3B' : '#EEF2FF') : 'transparent',
                    borderLeft: `3px solid ${isCurrent ? '#0213B2' : 'transparent'}`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined" style={{ fontSize: '17px', color: isCurrent ? (isDark ? '#93C5FD' : '#0213B2') : (isDark ? '#94A3B8' : '#64748B') }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold"
                      style={{
                        backgroundColor: isDark ? '#161C3B' : '#EEF2FF',
                        border: isDark ? '1px solid #282A3A' : '1px solid #CBD5E1',
                        color: isDark ? '#93C5FD' : '#0213B2',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => {
          setMobileMenuOpen(false)
          if (!currentUser) {
            setLoginModalOpen(true)
          } else {
            navigate('/cart')
          }
        }}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          backgroundColor: location.pathname === '/cart' ? (isDark ? '#161C3B' : '#EEF2FF') : 'transparent',
          color: location.pathname === '/cart' ? (isDark ? '#93C5FD' : '#0213B2') : (isDark ? '#F8FAFC' : '#111827'),
          border: location.pathname === '/cart' ? (isDark ? '1px solid #282A3A' : '1px solid #CBD5E1') : '1px solid transparent',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: '17px', color: isDark ? '#93C5FD' : '#0213B2' }}>shopping_cart</span>
          <span>Parts Cart & Checkout</span>
        </div>
        {currentUser ? (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#0213B2] text-white">4</span>
        ) : (
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/40 flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px]">lock</span>
            <span>SIGN IN</span>
          </span>
        )}
      </button>

      <Link
        to="/knowledge"
        onClick={() => setMobileMenuOpen(false)}
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          backgroundColor: location.pathname === '/knowledge' ? (isDark ? '#161C3B' : '#EEF2FF') : 'transparent',
          color: location.pathname === '/knowledge' ? (isDark ? '#93C5FD' : '#0213B2') : (isDark ? '#F8FAFC' : '#111827'),
          border: location.pathname === '/knowledge' ? (isDark ? '1px solid #282A3A' : '1px solid #CBD5E1') : '1px solid transparent',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '17px', color: isDark ? '#93C5FD' : '#0213B2' }}>menu_book</span>
        <span>Knowledge Hub</span>
      </Link>

      {currentUser ? (
        <div className="space-y-2 pt-2 border-t" style={{ borderColor: isDark ? '#282A3A' : '#E2E8F0' }}>
          <Link
            to="/account"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              backgroundColor: location.pathname === '/account' ? (isDark ? '#161C3B' : '#EEF2FF') : 'transparent',
              color: location.pathname === '/account' ? (isDark ? '#93C5FD' : '#0213B2') : (isDark ? '#F8FAFC' : '#111827'),
              border: location.pathname === '/account' ? (isDark ? '1px solid #282A3A' : '1px solid #CBD5E1') : '1px solid transparent',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '17px', color: isDark ? '#93C5FD' : '#0213B2' }}>account_circle</span>
            <span>My Account & Builds</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false)
              logout()
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Sign Out ({currentUser.fullName})</span>
          </button>
        </div>
      ) : (
        <div className="pt-2 border-t" style={{ borderColor: isDark ? '#282A3A' : '#E2E8F0' }}>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false)
              openLoginModal()
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-white uppercase tracking-wider bg-[#0213B2] hover:bg-[#0115BC] transition-colors cursor-pointer shadow-sm font-['Montserrat']"
          >
            <span className="material-symbols-outlined text-base">login</span>
            <span>SIGN IN</span>
          </button>
        </div>
      )}
    </div>
  )
}
