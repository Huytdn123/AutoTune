import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import logoImg from '../assets/logo.jpg'

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
        label: 'Performance Store & Inventory',
        desc: 'Curated performance parts, live SKU inventory & B2B procurement',
        icon: 'storefront',
        badge: 'Store & Stock'
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
        path: '/dashboard',
        label: 'Diagnostics Telemetry',
        desc: 'Workshop operations dashboard, throughput & bay metrics',
        icon: 'speed',
        badge: 'Analytics'
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
  const { currentUser, role, logout, setLoginModalOpen } = useAuth()
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
      items = items.filter(it => ['/configurator', '/fitment', '/shop', '/warranty', '/dashboard'].includes(it.path))
    }
    // GARAGE_OWNER retains all items
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
    color: active ? '#ffffff' : '#c8d4ea',
    backgroundColor: active ? 'rgba(96,145,195,0.18)' : 'transparent',
    border: active ? '1px solid rgba(96,145,195,0.4)' : '1px solid transparent',
  })

  return (
    <header
      ref={navRef}
      style={{ backgroundColor: '#1F2F57', borderBottom: '1px solid rgba(96,145,195,0.2)' }}
      className="sticky top-0 z-50 h-16 text-white shadow-2xl select-none"
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
              className="block w-auto group-hover:brightness-110 transition-all duration-200"
              style={{ height: '46px', maxWidth: '240px', filter: 'brightness(1.05)', objectFit: 'contain', objectPosition: 'left center' }}
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
                  className="px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all duration-150 whitespace-nowrap cursor-pointer"
                  style={navLinkStyle(isGroupActive || isOpen)}
                >
                  <span>{group.label}</span>
                  <span
                    className="material-symbols-outlined transition-transform duration-200"
                    style={{ fontSize: '16px', color: '#A8A8A8', transform: isOpen ? 'rotate(180deg)' : 'none' }}
                  >
                    expand_more
                  </span>
                </button>

                {/* Dropdown Panel — centered under trigger */}
                {isOpen && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 rounded-xl p-2 z-[100]"
                    style={{
                      backgroundColor: '#162447',
                      border: '1.5px solid rgba(96,145,195,0.3)',
                      boxShadow: '0 24px 64px -12px rgba(0,0,0,0.85)',
                    }}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {/* Panel Header */}
                    <div
                      className="px-3 py-2 mb-1.5 rounded-lg flex items-center justify-between"
                      style={{ backgroundColor: 'rgba(31,47,87,0.8)', border: '1px solid rgba(96,145,195,0.12)' }}
                    >
                      <span className="uppercase tracking-wider text-[11px] font-extrabold" style={{ color: '#e2e8f6' }}>
                        {group.label}
                      </span>
                      <span
                        className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{ color: '#6091C3', backgroundColor: 'rgba(96,145,195,0.12)', border: '1px solid rgba(96,145,195,0.3)' }}
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
                              backgroundColor: isCurrent ? 'rgba(96,145,195,0.22)' : 'rgba(31,47,87,0.5)',
                              border: isCurrent ? '1px solid rgba(96,145,195,0.6)' : '1px solid rgba(96,145,195,0.08)',
                              color: isCurrent ? '#ffffff' : '#c8d4ea',
                            }}
                            onMouseEnter={e => {
                              if (!isCurrent) {
                                e.currentTarget.style.backgroundColor = 'rgba(96,145,195,0.14)'
                                e.currentTarget.style.borderColor = 'rgba(96,145,195,0.3)'
                                e.currentTarget.style.color = '#ffffff'
                              }
                            }}
                            onMouseLeave={e => {
                              if (!isCurrent) {
                                e.currentTarget.style.backgroundColor = 'rgba(31,47,87,0.5)'
                                e.currentTarget.style.borderColor = 'rgba(96,145,195,0.08)'
                                e.currentTarget.style.color = '#c8d4ea'
                              }
                            }}
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor: isCurrent ? '#6091C3' : 'rgba(96,145,195,0.15)',
                                border: isCurrent ? 'none' : '1px solid rgba(96,145,195,0.25)',
                              }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: isCurrent ? '#fff' : '#6091C3' }}>
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
                                    style={{ backgroundColor: 'rgba(96,145,195,0.12)', border: '1px solid rgba(96,145,195,0.35)', color: '#6091C3' }}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] mt-0.5 line-clamp-1" style={{ color: '#A8A8A8' }}>
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
            className="px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all duration-150 whitespace-nowrap"
            style={navLinkStyle(location.pathname === '/knowledge')}
          >
            <span>Knowledge</span>
          </Link>
        </nav>

        {/* ── ZONE 3: ACTIONS (right, fixed) ──────────────── */}
        <div className="shrink-0 flex items-center gap-2 sm:gap-2.5">
          {/* Shopping Cart Button (Locked for unauthenticated guests) */}
          <button
            type="button"
            onClick={() => {
              if (!currentUser) {
                setLoginModalOpen(true)
              } else {
                navigate('/cart')
              }
            }}
            className="relative flex items-center justify-center p-2 rounded-lg transition-all duration-150 cursor-pointer"
            style={{
              backgroundColor: location.pathname === '/cart' ? 'rgba(96,145,195,0.25)' : 'rgba(31,47,87,0.7)',
              border: location.pathname === '/cart' ? '1.5px solid #6091C3' : '1px solid rgba(96,145,195,0.3)',
              color: location.pathname === '/cart' ? '#ffffff' : '#c8d4ea'
            }}
            title={currentUser ? "Parts Cart & B2B Procurement" : "Sign in required to view Cart"}
          >
            <span className="material-symbols-outlined text-lg" style={{ color: currentUser ? '#6091C3' : '#c8d4ea' }}>shopping_cart</span>
            {currentUser ? (
              <span 
                className="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold font-mono rounded-full flex items-center justify-center text-white shadow"
                style={{ backgroundColor: '#6091C3' }}
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
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer"
                style={{
                  backgroundColor: 'rgba(31,47,87,0.7)',
                  border: '1px solid rgba(96,145,195,0.3)',
                }}
              >
                <div 
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
                  style={{
                    backgroundColor: role === 'GARAGE_OWNER' ? '#6091C3' : role === 'LEAD_TECHNICIAN' ? '#10B981' : '#F59E0B',
                    color: '#ffffff'
                  }}
                >
                  {currentUser.fullName ? currentUser.fullName.charAt(0) : 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-white truncate max-w-[120px]">
                    {currentUser.fullName || currentUser.username}
                  </div>
                  <div 
                    className="text-[9px] font-mono font-bold uppercase truncate"
                    style={{
                      color: role === 'GARAGE_OWNER' ? '#6091C3' : role === 'LEAD_TECHNICIAN' ? '#10B981' : '#F59E0B'
                    }}
                  >
                    {role.replace('_', ' ')}
                  </div>
                </div>
                <span className="material-symbols-outlined text-white/50 text-sm">expand_more</span>
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-xl p-2 z-[110] shadow-2xl animate-in fade-in"
                  style={{
                    backgroundColor: '#162447',
                    border: '1.5px solid rgba(96,145,195,0.3)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.85)'
                  }}
                >
                  <div className="p-2.5 border-b border-white/10 mb-1">
                    <p className="text-xs font-bold text-white">{currentUser.fullName}</p>
                    <p className="text-[10px] text-white/50 font-mono truncate">{currentUser.email || currentUser.username}</p>
                    <span 
                      className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase"
                      style={{
                        backgroundColor: 'rgba(96,145,195,0.15)',
                        color: role === 'GARAGE_OWNER' ? '#6091C3' : role === 'LEAD_TECHNICIAN' ? '#10B981' : '#F59E0B'
                      }}
                    >
                      {role}
                    </span>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-base" style={{ color: '#6091C3' }}>dashboard</span>
                    <span>Dashboard</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false)
                      setLoginModalOpen(true)
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base" style={{ color: '#10B981' }}>switch_account</span>
                    <span>Switch Demo Persona</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false)
                      logout()
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer border-t border-white/10 mt-1 pt-2"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold font-['Montserrat'] uppercase tracking-wider transition-all duration-150 hover:bg-white/10"
              style={{
                backgroundColor: 'rgba(31,47,87,0.8)',
                border: '1px solid rgba(96,145,195,0.4)',
                color: '#dae2ff',
              }}
            >
              <span className="material-symbols-outlined text-base" style={{ color: '#6091C3' }}>login</span>
              <span>SIGN IN</span>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: '#c8d4ea', backgroundColor: 'rgba(255,255,255,0.06)' }}
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
          className="lg:hidden px-4 py-4 space-y-4 max-h-[85vh] overflow-y-auto"
          style={{ backgroundColor: '#162447', borderTop: '1px solid rgba(96,145,195,0.2)' }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              ...navLinkStyle(location.pathname === '/'),
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '17px', color: '#6091C3' }}>home</span>
            <span>Platform Landing</span>
          </Link>

          {filteredGroups.map((group) => (
            <div key={group.groupId} className="space-y-1">
              <div
                className="px-3 py-1 text-[10px] uppercase tracking-widest font-extrabold flex items-center gap-2"
                style={{ color: '#6091C3' }}
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
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        color: isCurrent ? '#ffffff' : '#c8d4ea',
                        backgroundColor: isCurrent ? 'rgba(96,145,195,0.2)' : 'rgba(31,47,87,0.4)',
                        borderLeft: `3px solid ${isCurrent ? '#6091C3' : 'transparent'}`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined" style={{ fontSize: '17px', color: '#6091C3' }}>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold"
                          style={{ backgroundColor: 'rgba(96,145,195,0.12)', border: '1px solid rgba(96,145,195,0.35)', color: '#6091C3' }}
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
              ...navLinkStyle(location.pathname === '/cart'),
            }}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: '17px', color: '#6091C3' }}>shopping_cart</span>
              <span>Parts Cart & Checkout</span>
            </div>
            {currentUser ? (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#6091C3] text-white">4</span>
            ) : (
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px]">lock</span>
                <span>SIGN IN</span>
              </span>
            )}
          </button>

          <Link
            to="/knowledge"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              ...navLinkStyle(location.pathname === '/knowledge'),
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '17px', color: '#6091C3' }}>menu_book</span>
            <span>Knowledge Hub</span>
          </Link>
        </div>
      )}
    </header>
  )
}
