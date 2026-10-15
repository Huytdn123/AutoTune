import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    title: 'B2B Quotation Generated',
    description: 'Official quote #VT-QT-8891 ready for client review.',
    time: '10m ago',
    icon: 'request_quote',
    link: '/quotation',
    unread: true
  },
  {
    id: 2,
    title: 'Work Order Bay Dispatched',
    description: 'Bay 02 assigned to Porsche 911 Carrera 991.',
    time: '45m ago',
    icon: 'car_repair',
    link: '/quotation',
    unread: false
  },
  {
    id: 3,
    title: 'TÜV §21 Fitment Pass',
    description: 'Axle clearances verified for WORK VS-XX 19" rims.',
    time: '2h ago',
    icon: 'verified',
    link: '/fitment',
    unread: false
  }
]

export default function NavbarNotifications({ currentUser, isDark }) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS)
  const menuRef = useRef(null)

  const unreadCount = notifications.filter(n => n.unread).length

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!currentUser) return null

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center p-2 rounded-lg transition-all duration-150 cursor-pointer hover:bg-[#0115BC]"
        style={{
          backgroundColor: isOpen ? '#06169B' : 'rgba(255, 255, 255, 0.18)',
          border: isOpen ? '1.5px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.3)',
          color: '#FFFFFF'
        }}
        title="Notifications & Workshop Alerts"
        aria-label="Notifications"
      >
        <span className="material-symbols-outlined text-lg" style={{ color: '#FFFFFF' }}>notifications</span>
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold font-mono rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#EF4444' }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 rounded-xl p-2 z-[110] shadow-xl animate-in fade-in transition-colors duration-150"
          style={{
            backgroundColor: isDark ? '#14151D' : '#E5E8F0',
            border: isDark ? '1px solid #282A3A' : '1px solid #E2E8F0',
            boxShadow: isDark ? '0 12px 32px rgba(0, 0, 0, 0.5)' : '0 12px 32px rgba(15, 23, 42, 0.12)'
          }}
        >
          <div className="px-3 py-2 border-b flex items-center justify-between mb-1" style={{ borderColor: isDark ? '#282A3A' : '#CBD5E1' }}>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold" style={{ color: isDark ? '#F8FAFC' : '#111827' }}>Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#0213B2] text-white font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[10px] font-medium text-[#0213B2] dark:text-[#93C5FD] hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="space-y-1 max-h-72 overflow-y-auto">
            {notifications.map(item => (
              <Link
                key={item.id}
                to={item.link}
                onClick={() => setIsOpen(false)}
                className="flex items-start gap-2.5 p-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: item.unread ? (isDark ? '#1E202C' : '#F1F5F9') : 'transparent',
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    backgroundColor: isDark ? '#161C3B' : '#EEF2FF',
                    color: isDark ? '#93C5FD' : '#0213B2'
                  }}
                >
                  <span className="material-symbols-outlined text-sm">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold truncate" style={{ color: isDark ? '#F8FAFC' : '#111827' }}>
                      {item.title}
                    </p>
                    <span className="text-[9px] font-mono shrink-0" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[11px] line-clamp-2 mt-0.5" style={{ color: isDark ? '#94A3B8' : '#475569' }}>
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
