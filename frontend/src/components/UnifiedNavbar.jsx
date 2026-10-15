import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from './ThemeToggle'
import NavbarNotifications from './navbar/NavbarNotifications'
import NavbarUserMenu from './navbar/NavbarUserMenu'
import NavbarMobileDrawer from './navbar/NavbarMobileDrawer'

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
      items = items.filter(it => ['/configurator', '/warranty', '/shop'].includes(it.path))
    } else if (role === 'CAR_OWNER') {
      items = items.filter(it => ['/configurator', '/quotation', '/warranty', '/shop'].includes(it.path))
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
          <ThemeToggle />

          <NavbarNotifications currentUser={currentUser} isDark={isDark} />

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

          <NavbarUserMenu
            currentUser={currentUser}
            role={role}
            userMenuOpen={userMenuOpen}
            setUserMenuOpen={setUserMenuOpen}
            logout={logout}
            openLoginModal={openLoginModal}
            isDark={isDark}
          />

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors hover:bg-[#0115BC] cursor-pointer"
            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.18)', border: '1px solid rgba(255, 255, 255, 0.3)' }}
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      <NavbarMobileDrawer
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        filteredGroups={filteredGroups}
        currentUser={currentUser}
        logout={logout}
        openLoginModal={openLoginModal}
        setLoginModalOpen={setLoginModalOpen}
        isDark={isDark}
        location={location}
        navigate={navigate}
      />
    </header>
  )
}
