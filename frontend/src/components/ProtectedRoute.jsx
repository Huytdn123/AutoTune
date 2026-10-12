import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * ProtectedRoute - Role-Based Access Control (RBAC) Guard
 * Ensures unauthenticated guests cannot view protected modules (e.g. Cart, Inventory, Fitment, Quotation, Dashboard)
 * and restricts modules based on user roles (GARAGE_OWNER, LEAD_TECHNICIAN, CAR_OWNER).
 */
export default function ProtectedRoute({ children, allowedRoles = null, requireAuth = true }) {
  const navigate = useNavigate()
  const { currentUser, role, isAuthenticated, setLoginModalOpen, switchPersona } = useAuth()

  // Case 1: Unauthenticated Guest attempting to access protected route
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 min-h-[calc(100vh-64px)] bg-[#F3F5FA] dark:bg-[#0B0C10] text-[#111827] dark:text-[#F8FAFC]">
        <div 
          className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-xl p-8 z-10 animate-in fade-in zoom-in-95 duration-200 text-center bg-[#E5E8F0] dark:bg-[#14151D] border border-[#CBD5E1] dark:border-[#282A3A]"
          style={{
            boxShadow: '0 20px 40px -12px rgba(15, 23, 42, 0.08)'
          }}
        >
          {/* Top Lock Badge */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#E8EDFF] dark:bg-[#161C3B] border border-[#CBD5E1] dark:border-[#282A3A] flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-3xl text-[#0213B2] dark:text-[#60A5FA]">lock</span>
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-[#E8EDFF] dark:bg-[#161C3B] border border-[#CBD5E1] dark:border-[#282A3A] text-[#0213B2] dark:text-[#60A5FA] text-[10px] font-mono font-bold tracking-widest uppercase mb-2">
            [ACCESS RESTRICTED · AUTHENTICATION REQUIRED]
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC] tracking-tight mb-2">
            Sign In Required
          </h2>

          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed mb-6">
            You must sign in to access this module (Parts Cart, Inventory, Fitment Matrix, Quotation, Dashboard).
            Unauthenticated guests can browse the 3D CAD Studio, Showroom Sales, Performance Store, and Warranty Passport.
          </p>

          {/* Quick 1-Click Persona Sign In */}
          <div className="mb-6 p-4 rounded-xl bg-[#E8EDFF] dark:bg-[#161C3B] border border-[#CBD5E1] dark:border-[#282A3A] text-left">
            <div className="text-[10px] font-mono font-bold text-[#0213B2] dark:text-[#60A5FA] uppercase tracking-wider mb-2.5">
              QUICK TEST SIGN-IN (1-CLICK DEMO):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => switchPersona('GARAGE_OWNER')}
                className="p-2.5 rounded-lg bg-[#0213B2] hover:bg-[#0115BC] text-white text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-white text-lg">admin_panel_settings</span>
                <span className="text-[11px] font-bold">Garage Owner</span>
                <span className="text-[9px] text-white/80 font-mono">Full Access</span>
              </button>

              <button
                type="button"
                onClick={() => switchPersona('LEAD_TECHNICIAN')}
                className="p-2.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-white text-lg">build</span>
                <span className="text-[11px] font-bold">Technician</span>
                <span className="text-[9px] text-white/80 font-mono">Inventory & Fitment</span>
              </button>

              <button
                type="button"
                onClick={() => switchPersona('CAR_OWNER')}
                className="p-2.5 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-white text-lg">directions_car</span>
                <span className="text-[11px] font-bold">Car Owner</span>
                <span className="text-[9px] text-white/80 font-mono">Cart & Quote</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setLoginModalOpen(true)}
              className="flex-1 py-2.5 px-4 rounded-lg bg-[#0213B2] hover:bg-[#0115BC] text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>Open Sign In Dialog</span>
            </button>

            <Link
              to="/shop"
              className="py-2.5 px-4 rounded-lg bg-[#E5E8F0] dark:bg-[#1B1D28] hover:bg-[#EEF2FF] dark:hover:bg-[#262938] text-[#475569] dark:text-[#CBD5E1] border border-[#CBD5E1] dark:border-[#282A3A] font-['Montserrat'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Back to Store</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Case 2: User is authenticated but their role does not have permission for this module
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 min-h-[calc(100vh-64px)] bg-[#F3F5FA] dark:bg-[#0B0C10] text-[#111827] dark:text-[#F8FAFC]">
        <div 
          className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-xl p-8 z-10 animate-in fade-in zoom-in-95 duration-200 text-center bg-[#E5E8F0] dark:bg-[#14151D] border border-[#CBD5E1] dark:border-[#282A3A]"
          style={{
            boxShadow: '0 20px 40px -12px rgba(15, 23, 42, 0.08)'
          }}
        >
          {/* Warning Icon Badge */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#FEF3C7] dark:bg-[#F59E0B]/20 border border-[#FDE68A] dark:border-[#F59E0B]/40 flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-3xl text-[#D97706] dark:text-[#FBBF24]">gpp_maybe</span>
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-[#FEF3C7] dark:bg-[#F59E0B]/20 border border-[#FDE68A] dark:border-[#F59E0B]/40 text-[#D97706] dark:text-[#FBBF24] text-[10px] font-mono font-bold tracking-widest uppercase mb-2">
            [ACCESS RESTRICTED · 403 INSUFFICIENT ROLE]
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC] tracking-tight mb-2">
            Role Permission Required
          </h2>

          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed mb-4">
            This operational module is not accessible with your current role: <strong className="text-[#D97706] dark:text-[#FBBF24] font-mono">{role}</strong> ({currentUser?.fullName}).
          </p>

          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-6">
            Requires one of the following roles: {allowedRoles.map(r => <span key={r} className="font-mono font-bold text-[#111827] dark:text-[#F8FAFC] px-1.5 py-0.5 mx-1 rounded bg-[#E8EDFF] dark:bg-[#161C3B] border border-[#CBD5E1] dark:border-[#282A3A]">{r}</span>)}
          </p>

          {/* Quick Role Switcher */}
          <div className="mb-6 p-4 rounded-xl bg-[#E8EDFF] dark:bg-[#161C3B] border border-[#CBD5E1] dark:border-[#282A3A] text-left">
            <div className="text-[10px] font-mono font-bold text-[#0213B2] dark:text-[#60A5FA] uppercase tracking-wider mb-2.5">
              SWITCH TO AUTHORIZED ROLE:
            </div>
            <div className="flex gap-2">
              {allowedRoles.includes('GARAGE_OWNER') && (
                <button
                  type="button"
                  onClick={() => switchPersona('GARAGE_OWNER')}
                  className="flex-1 p-2.5 rounded-lg bg-[#0213B2] hover:bg-[#0115BC] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-white text-base">admin_panel_settings</span>
                  <span>Garage Owner</span>
                </button>
              )}
              {allowedRoles.includes('LEAD_TECHNICIAN') && (
                <button
                  type="button"
                  onClick={() => switchPersona('LEAD_TECHNICIAN')}
                  className="flex-1 p-2.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-white text-base">build</span>
                  <span>Lead Technician</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="flex-1 py-2.5 px-4 rounded-lg bg-[#E5E8F0] dark:bg-[#1B1D28] hover:bg-[#EEF2FF] dark:hover:bg-[#262938] text-[#475569] dark:text-[#CBD5E1] border border-[#CBD5E1] dark:border-[#282A3A] font-['Montserrat'] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Return to Performance Store
            </button>
          </div>
        </div>
      </div>
    )
  }

  // All checks passed
  return children
}
