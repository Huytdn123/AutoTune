import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * ProtectedRoute - Role-Based Access Control (RBAC) Guard
 * 
 * Case 1: Unauthenticated Guest
 *   - Automatically opens the login modal directly without redirecting through separate 401/403 pages.
 *   - Renders a clean, quiet placeholder if the modal is dismissed.
 *   - Once the user logs in, modal closes and the protected page content is shown.
 * 
 * Case 2: Authenticated User with Insufficient Permissions
 *   - Shows one short, clear message without bypassing authorization.
 */
export default function ProtectedRoute({ children, allowedRoles = null, requireAuth = true }) {
  const { role, isAuthenticated, openLoginModal } = useAuth()

  // Case 1: Guest needs to sign in
  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      openLoginModal()
    }
  }, [requireAuth, isAuthenticated, openLoginModal])

  if (requireAuth && !isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 min-h-[calc(100vh-64px)] bg-[#F3F5FA] dark:bg-[#0B0C10] text-[#111827] dark:text-[#F8FAFC]">
        <div className="w-full max-w-sm rounded-2xl p-6 text-center bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] shadow-lg animate-in fade-in duration-150">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-[#1B1D28] flex items-center justify-center text-[#0213B2] dark:text-[#60A5FA]">
            <span className="material-symbols-outlined text-2xl">lock</span>
          </div>

          <h3 className="text-base font-bold font-['Montserrat'] mb-1">
            Sign In Required
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Please sign in to access this page.
          </p>

          <div className="flex items-center gap-2 justify-center">
            <button
              type="button"
              onClick={() => openLoginModal()}
              className="py-2 px-4 rounded-lg bg-[#0213B2] hover:bg-[#0115BC] text-white text-xs font-bold font-['Montserrat'] shadow-sm transition-all cursor-pointer"
            >
              Sign In
            </button>
            <Link
              to="/shop"
              className="py-2 px-4 rounded-lg bg-slate-100 dark:bg-[#1B1D28] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#252838] text-xs font-semibold font-['Montserrat'] transition-colors"
            >
              Store
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Case 2: Authenticated user lacks permission
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 min-h-[calc(100vh-64px)] bg-[#F3F5FA] dark:bg-[#0B0C10] text-[#111827] dark:text-[#F8FAFC]">
        <div className="w-full max-w-sm rounded-2xl p-6 text-center bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] shadow-lg animate-in fade-in duration-150">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <span className="material-symbols-outlined text-2xl">block</span>
          </div>

          <h3 className="text-base font-bold font-['Montserrat'] mb-1">
            Access Denied
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            You do not have permission to access this page.
          </p>

          <Link
            to="/shop"
            className="inline-block py-2 px-4 rounded-lg bg-slate-100 dark:bg-[#1B1D28] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#252838] text-xs font-semibold font-['Montserrat'] transition-colors"
          >
            Return to Store
          </Link>
        </div>
      </div>
    )
  }

  // All checks passed
  return children
}
