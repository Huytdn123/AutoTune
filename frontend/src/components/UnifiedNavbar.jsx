import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from './ThemeToggle'

const logoImg = '/images/logo.jpg'

export const NAVIGATION_GROUPS = [
  {
    groupId: 'studio',
    label: '3D & Studio',
    icon: 'view_in_ar',
    items: [
      {
        path: '/configurator',
        label: '3D CAD Studio',
        desc: 'Real-time 3D vehicle customization, raytracing & CAD staging',
        icon: 'view_in_ar',
        badge: 'Core 3D'
      },
      {
        path: '/sales',
        label: 'Showroom Sales',
        desc: 'Interactive client presentation & sales consultation',
        icon: 'tablet_mac',
        badge: 'Showroom'
      },
    ]
  },
  {
    groupId: 'engineering',
    label: 'Engineering',
    icon: 'precision_manufacturing',
    items: [
      {
        path: '/fitment',
        label: 'Fitment Check',
        desc: 'Axle clearances, PCD bolt patterns & TÜV tolerance matrix',
        icon: 'fact_check',
        badge: 'Matrix'
      },
      {
        path: '/shop',
        label: 'Performance Store',
        desc: 'Curated performance parts catalog and tuning components',
        icon: 'storefront',
        badge: 'Store'
      },
      {
        path: '/inventory',
        label: 'Warehouse Inventory',
        desc: 'Live SKU depot stock levels, ERP valuation & OEM procurement',
        icon: 'inventory_2',
        badge: 'Depot'
      },
    ]
  },
  {
    groupId: 'operations',
    label: 'Workshop Ops',
    icon: 'dashboard',
    items: [
      {
        path: '/quotation',
        label: 'Quotes & Margin',
        desc: 'Automated quotation, BOM, markup & commercial invoicing',
        icon: 'request_quote',
        badge: 'Billing'
      },
      {
        path: '/warranty',
        label: 'Modification & Warranty',
        desc: 'Vehicle build passport, modification records & digital warranty QR',
        icon: 'verified_user',
        badge: 'Warranty'
      },
      {
        path: '/profile',
        label: 'Workshop Profile',
        desc: 'Certified garage credentials, facility & B2B marketplace',
        icon: 'domain',
        badge: 'Network'
      },
    ]
  }
]

export default function UnifiedNavbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, role, logout, setLoginModalOpen, openLoginModal } = useAuth()
  const { isDark } = useTheme()
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navRef = useRef(null)

  // Role-based navigation filtering: Guest only sees public modules (like Car Owner, minus cart & quotation)
  const filteredGroups = NAVIGATION_GROUPS.map((group) => {
    let items = group.items
    if (!currentUser || role === 'GUEST') {
      items = items.filter(it => ['/configurator', '/sales', '/warranty', '/shop'].includes(it.path))
    } else if (role === 'CAR_OWNER') {
      items = items.filter(it => ['/configurator', '/sales', '/quotation', '/warranty', '/shop'].includes(it.path))
    } else if (role === 'LEAD_TECHNICIAN') {
      items = items.filter(it => ['/configurator', '/fitment', '/shop', '/inventory', '/warranty', '/dashboard'].includes(it.path))
    }
    // GARAGE_OWNER and ADMIN retain all items
    return { ...group, items }
  }).filter((group) => group.items.length > 0)

  useEffect(() => {
    setActiveDropdown(null)
    setMobileMenuOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null)
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinkStyle = (active) => ({
    color: '#FFFFFF',
    backgroundColor: active ? '#06169B' : 'transparent',
    border: active ? '1px solid rgba(255, 255, 255, 0.35)' : '1px solid transparent',
  })

  return (
    <header
      ref={navRef}
      style={{ backgroundColor: '#0213B2', borderBottom: '1px solid rgba(255, 255, 255, 0.15)' }}
      className="sticky top-0 z-50 h-16 text-white shadow-md select-none"
    >
      {/*
        Layout: 3 zones in one flex row
        [logo: shrink-0] [nav: flex-1 justify-center] [actions: shrink-0]
        This guarantees nav is always truly centered regardless of logo/action widths.
      */}
      <div className="w-full px-5 lg:px-8 xl:px-12 h-full flex items-center justify-between gap-4 xl:gap-8">

        {/* ── ZONE 1: LOGO (left, fixed) ─────────────────── */}
        <div className="shrink-0">
          <Link to="/" className="block group" aria-label="Virtual Tune — Home">
            <img
              src={logoImg}
              alt="Virtual Tune Logo"
              className="block w-auto transition-transform duration-200 group-hover:scale-[1.02]"
              style={{ height: '46px', maxWidth: '240px', objectFit: 'contain', objectPosition: 'left center' }}
            />
          </Link>
        </div>

        {/* ── ZONE 2: NAVIGATION (center, flex-1) ─────────── */}
        <nav
          className="hidden lg:flex flex-1 items-center justify-center gap-2 xl:gap-3"
          style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13.5px', fontWeight: 600 }}
        >
          {/* Grouped Dropdown Menus */}
          {filteredGroups.map((group) => {
            const isGroupActive = group.items.some(item => item.path === location.pathname)
            const isOpen = activeDropdown === group.groupId

            return (
              <div key={group.groupId} className="relative">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(isOpen ? null : group.groupId)}
                  onMouseEnter={() => setActiveDropdown(group.groupId)}
                  className="px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all duration-150 whitespace-nowrap cursor-pointer hover:bg-[#0115BC] active:bg-[#06169B]"
                  style={navLinkStyle(isGroupActive || isOpen)}
                >
                  <span>{group.label}</span>
                  <span
                    className="material-symbols-outlined transition-transform duration-200"
                    style={{ fontSize: '16px', color: '#FFFFFF', transform: isOpen ? 'rotate(180deg)' : 'none' }}
                  >
                    expand_more
                  </span>
                </button>

                {/* Dropdown Panel — centered under trigger */}
                {isOpen && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 rounded-xl p-2 z-[100] transition-colors duration-150"
                    style={{
                      backgroundColor: isDark ? '#14151D' : '#E5E8F0',
                      border: isDark ? '1px solid #282A3A' : '1px solid #E2E8F0',
                      boxShadow: isDark ? '0 12px 32px rgba(0, 0, 0, 0.5)' : '0 12px 32px rgba(15, 23, 42, 0.12)',
                    }}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {/* Panel Header */}
                    <div
                      className="px-3 py-2 mb-1.5 rounded-lg flex items-center justify-between"
                      style={{
                        backgroundColor: isDark ? '#1B1D28' : '#F8FAFC',
                        border: isDark ? '1px solid #282A3A' : '1px solid #E2E8F0',
                      }}
                    >
                      <span className="uppercase tracking-wider text-[11px] font-extrabold" style={{ color: isDark ? '#F8FAFC' : '#111827' }}>
                        {group.label}
                      </span>
                      <span
                        className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{
                          color: isDark ? '#93C5FD' : '#0213B2',
                          backgroundColor: isDark ? '#161C3B' : '#EEF2FF',
                          border: isDark ? '1px solid #282A3A' : '1px solid #CBD5E1',
                        }}
                      >
                        {group.items.length} MODULES
                      </span>
                    </div>

                    {/* Panel Items */}
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const isCurrent = location.pathname === item.path
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center gap-3 p-2.5 rounded-lg transition-all duration-150"
                            style={{
                              backgroundColor: isCurrent ? (isDark ? '#161C3B' : '#EEF2FF') : 'transparent',
                              border: isCurrent ? (isDark ? '1px solid #282A3A' : '1px solid #CBD5E1') : '1px solid transparent',
                              color: isCurrent ? (isDark ? '#93C5FD' : '#0213B2') : (isDark ? '#F8FAFC' : '#111827'),
                            }}
                            onMouseEnter={e => {
                              if (!isCurrent) {
                                e.currentTarget.style.backgroundColor = isDark ? '#1E202C' : '#F1F5F9'
                                e.currentTarget.style.borderColor = isDark ? '#282A3A' : '#E2E8F0'
                                e.currentTarget.style.color = isDark ? '#93C5FD' : '#0213B2'
                              }
                            }}
                            onMouseLeave={e => {
                              if (!isCurrent) {
                                e.currentTarget.style.backgroundColor = 'transparent'
                                e.currentTarget.style.borderColor = 'transparent'
                                e.currentTarget.style.color = isDark ? '#F8FAFC' : '#111827'
                              }
                            }}
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor: isCurrent ? '#0213B2' : (isDark ? '#1B1D28' : '#F1F5F9'),
                                border: isCurrent ? 'none' : (isDark ? '1px solid #282A3A' : '1px solid #E2E8F0'),
                              }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: isCurrent ? '#ffffff' : (isDark ? '#93C5FD' : '#0213B2') }}>
                                {item.icon}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold truncate" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                  {item.label}
                                </span>
                                {item.badge && (
                                  <span
                                    className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0"
                                    style={{
                                      backgroundColor: isDark ? '#161C3B' : '#EEF2FF',
                                      border: isDark ? '1px solid #282A3A' : '1px solid #CBD5E1',
                                      color: isDark ? '#93C5FD' : '#0213B2',
                                    }}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] mt-0.5 line-clamp-1" style={{ color: isDark ? '#94A3B8' : '#475569' }}>
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Knowledge */}
          <Link
            to="/knowledge"
            className="px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all duration-150 whitespace-nowrap hover:bg-[#0115BC] active:bg-[#06169B]"
            style={navLinkStyle(location.pathname === '/knowledge')}
          >
            <span>Knowledge</span>
          </Link>
        </nav>

        {/* ── ZONE 3: ACTIONS (right, fixed) ──────────────── */}
        <div className="shrink-0 flex items-center gap-2 sm:gap-2.5">
          {/* Theme Toggle (immediately to the LEFT of the shopping cart) */}
          <ThemeToggle />

          {/* Shopping Cart Button */}
          <button
            type="button"
            onClick={() => {
              if (!currentUser) {
                openLoginModal()
              } else {
                navigate('/cart')
              }
            }}
            className="relative flex items-center justify-center p-2 rounded-lg transition-all duration-150 cursor-pointer hover:bg-[#0115BC]"
            style={{
              backgroundColor: location.pathname === '/cart' ? '#06169B' : 'rgba(255, 255, 255, 0.18)',
              border: location.pathname === '/cart' ? '1.5px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF'
            }}
            title={currentUser ? "Parts Cart & B2B Procurement" : "Sign in required to view Cart"}
          >
            <span className="material-symbols-outlined text-lg" style={{ color: '#FFFFFF' }}>shopping_cart</span>
            {currentUser ? (
              <span 
                className="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold font-mono rounded-full flex items-center justify-center text-white shadow-xs"
                style={{ backgroundColor: '#EF4444' }}
              >
                4
              </span>
            ) : (
              <span 
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white shadow bg-amber-500/90"
                title="Sign in required"
              >
                <span className="material-symbols-outlined text-[10px]">lock</span>
              </span>
            )}
          </button>

          {/* Authentication State: User Info & Logout or Login Button */}
          {currentUser ? (
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
          ) : (
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
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors hover:bg-[#0115BC]"
            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.18)', border: '1px solid rgba(255, 255, 255, 0.3)' }}
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* ── MOBILE DRAWER ───────────────────────────────── */}
      {mobileMenuOpen && (
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
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left"
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
      )}
    </header>
  )
}
