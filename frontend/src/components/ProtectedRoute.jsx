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
      <div className="flex-1 flex items-center justify-center p-6 min-h-[calc(100vh-64px)] bg-[#0d131f] text-[#e3e8f5]">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'radial-gradient(rgba(96,145,195,0.5) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div 
          className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl p-8 z-10 animate-in fade-in zoom-in-95 duration-200 text-center"
          style={{
            backgroundColor: '#162447',
            border: '1.5px solid rgba(96,145,195,0.35)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(96,145,195,0.15)'
          }}
        >
          {/* Top Lock Badge */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#6091c3]/15 border border-[#6091c3]/40 flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-3xl text-[#6091c3]">lock</span>
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-[#6091c3]/15 border border-[#6091c3]/30 text-[#6091c3] text-[10px] font-mono font-bold tracking-widest uppercase mb-2">
            [ACCESS RESTRICTED · AUTHENTICATION REQUIRED]
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] text-white tracking-tight mb-2">
            Sign In Required
          </h2>

          <p className="text-xs sm:text-sm text-[#c8d4ea] leading-relaxed mb-6">
            You must sign in to access this module (Parts Cart, Inventory, Fitment Matrix, Quotation, Dashboard).
            Unauthenticated guests can only browse the 3D CAD Studio, Showroom Sales, Performance Store, and Warranty Passport.
          </p>

          {/* Quick 1-Click Persona Sign In */}
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 text-left">
            <div className="text-[10px] font-mono font-bold text-[#6091c3] uppercase tracking-wider mb-2.5">
              QUICK TEST SIGN-IN (1-CLICK DEMO):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => switchPersona('GARAGE_OWNER')}
                className="p-2.5 rounded-lg bg-[#1f2f57] hover:bg-[#6091c3]/20 border border-[#6091c3]/30 text-white text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[#6091c3] text-lg">admin_panel_settings</span>
                <span className="text-[11px] font-bold">Garage Owner</span>
                <span className="text-[9px] text-[#A8A8A8] font-mono">Full Access</span>
              </button>

              <button
                type="button"
                onClick={() => switchPersona('LEAD_TECHNICIAN')}
                className="p-2.5 rounded-lg bg-[#1f2f57] hover:bg-[#10b981]/20 border border-[#10b981]/30 text-white text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[#10b981] text-lg">build</span>
                <span className="text-[11px] font-bold">Technician</span>
                <span className="text-[9px] text-[#A8A8A8] font-mono">Inventory & Fitment</span>
              </button>

              <button
                type="button"
                onClick={() => switchPersona('CAR_OWNER')}
                className="p-2.5 rounded-lg bg-[#1f2f57] hover:bg-[#f59e0b]/20 border border-[#f59e0b]/30 text-white text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[#f59e0b] text-lg">directions_car</span>
                <span className="text-[11px] font-bold">Car Owner</span>
                <span className="text-[9px] text-[#A8A8A8] font-mono">Cart & Quote</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setLoginModalOpen(true)}
              className="flex-1 py-2.5 px-4 rounded-lg bg-[#6091c3] hover:brightness-110 active:scale-98 text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>Open Sign In Dialog</span>
            </button>

            <Link
              to="/shop"
              className="py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/15 text-[#dae2ff] font-['Montserrat'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
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
      <div className="flex-1 flex items-center justify-center p-6 min-h-[calc(100vh-64px)] bg-[#0d131f] text-[#e3e8f5]">
        <div 
          className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl p-8 z-10 animate-in fade-in zoom-in-95 duration-200 text-center"
          style={{
            backgroundColor: '#162447',
            border: '1.5px solid rgba(245,158,11,0.4)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245,158,11,0.15)'
          }}
        >
          {/* Warning Icon Badge */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-3xl text-amber-400">gpp_maybe</span>
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold tracking-widest uppercase mb-2">
            [ACCESS RESTRICTED · 403 INSUFFICIENT ROLE]
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] text-white tracking-tight mb-2">
            Role Permission Required
          </h2>

          <p className="text-xs sm:text-sm text-[#c8d4ea] leading-relaxed mb-4">
            This operational module is not accessible with your current role: <strong className="text-amber-400 font-mono">{role}</strong> ({currentUser?.fullName}).
          </p>

          <p className="text-xs text-[#A8A8A8] mb-6">
            Requires one of the following roles: {allowedRoles.map(r => <span key={r} className="font-mono font-bold text-white px-1.5 py-0.5 mx-1 rounded bg-white/10">{r}</span>)}
          </p>

          {/* Quick Role Switcher */}
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 text-left">
            <div className="text-[10px] font-mono font-bold text-[#6091c3] uppercase tracking-wider mb-2.5">
              SWITCH TO AUTHORIZED ROLE:
            </div>
            <div className="flex gap-2">
              {allowedRoles.includes('GARAGE_OWNER') && (
                <button
                  type="button"
                  onClick={() => switchPersona('GARAGE_OWNER')}
                  className="flex-1 p-2 rounded-lg bg-[#1f2f57] hover:bg-[#6091c3]/20 border border-[#6091c3]/30 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[#6091c3] text-base">admin_panel_settings</span>
                  <span>Garage Owner</span>
                </button>
              )}
              {allowedRoles.includes('LEAD_TECHNICIAN') && (
                <button
                  type="button"
                  onClick={() => switchPersona('LEAD_TECHNICIAN')}
                  className="flex-1 p-2 rounded-lg bg-[#1f2f57] hover:bg-[#10b981]/20 border border-[#10b981]/30 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[#10b981] text-base">build</span>
                  <span>Lead Technician</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="flex-1 py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/15 text-[#dae2ff] font-['Montserrat'] font-bold text-xs uppercase tracking-wider transition-all"
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
