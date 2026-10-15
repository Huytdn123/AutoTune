import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

function SunIcon({ style, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

function MoonIcon({ style, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

/**
 * ThemeToggle - Compact premium automotive pill-shaped Light/Dark Mode toggle
 * Positioned immediately to the left of the shopping cart in UnifiedNavbar
 */
export default function ThemeToggle() {
  const { toggleTheme, setTheme, isDark } = useTheme()

  const tooltipText = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <div
      role="switch"
      aria-checked={isDark}
      aria-label={tooltipText}
      title={tooltipText}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggleTheme()
        }
      }}
      className="relative flex items-center h-8 w-[62px] p-0.5 rounded-full cursor-pointer select-none transition-all duration-200 shrink-0 border focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.16)',
        borderColor: 'rgba(255, 255, 255, 0.28)',
      }}
    >
      {/* Sliding Active Pill Indicator */}
      <div
        className="absolute top-0.5 bottom-0.5 w-[28px] rounded-full shadow-sm flex items-center justify-center transition-transform duration-250 ease-out"
        style={{
          transform: isDark ? 'translateX(30px)' : 'translateX(1px)',
          backgroundColor: isDark ? '#06169B' : '#FFFFFF',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.35)' : '1px solid rgba(2, 19, 178, 0.15)',
        }}
      />

      {/* Sun Button (Light Mode) */}
      <button
        type="button"
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation()
          setTheme('light')
        }}
        className="relative z-10 w-[28px] h-full flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer"
        aria-label="Activate light mode"
      >
        <SunIcon
          className="w-3.5 h-3.5 transition-all duration-200"
          style={{
            color: !isDark ? '#0213B2' : 'rgba(255, 255, 255, 0.65)',
            transform: !isDark ? 'scale(1.05)' : 'scale(0.9)',
          }}
        />
      </button>

      {/* Moon Button (Dark Mode) */}
      <button
        type="button"
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation()
          setTheme('dark')
        }}
        className="relative z-10 w-[28px] h-full flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer"
        aria-label="Activate dark mode"
      >
        <MoonIcon
          className="w-3.5 h-3.5 transition-all duration-200"
          style={{
            color: isDark ? '#93C5FD' : 'rgba(255, 255, 255, 0.65)',
            transform: isDark ? 'scale(1.05)' : 'scale(0.9)',
          }}
        />
      </button>
    </div>
  )
}
