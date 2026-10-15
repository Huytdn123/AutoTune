import React, { useEffect, useState, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import UnifiedNavbar from './components/UnifiedNavbar'
import LoginModal from './components/LoginModal'
import ProtectedRoute from './components/ProtectedRoute'
import PageLoadingFallback from './components/PageLoadingFallback'

const HomePage = lazy(() => import('./pages/HomePage'))
const ConfiguratorPage = lazy(() => import('./pages/ConfiguratorPage'))
const FitmentMatrixPage = lazy(() => import('./pages/FitmentMatrixPage'))
const GarageDashboardPage = lazy(() => import('./pages/GarageDashboardPage'))
const QuotationInvoicePage = lazy(() => import('./pages/QuotationInvoicePage'))
const ModificationWarrantyPage = lazy(() => import('./pages/ModificationWarrantyPage'))
const GarageProfilePage = lazy(() => import('./pages/GarageProfilePage'))
const KnowledgeHubPage = lazy(() => import('./pages/KnowledgeHubPage'))
const PartsCartCheckoutPage = lazy(() => import('./pages/PartsCartCheckoutPage'))
const PartsStorePage = lazy(() => import('./pages/PartsStorePage'))
const AccountPage = lazy(() => import('./pages/AccountPage'))

// Replaces the old /login page — just opens the LoginModal overlay on the home screen
function LoginRedirect() {
  const { setLoginModalOpen } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    setLoginModalOpen(true)
    navigate('/', { replace: true })
  }, [setLoginModalOpen, navigate])
  return null
}

function InteractiveAppWrapper() {
  const navigate = useNavigate()
  const location = useLocation()
  const [toast, setToast] = useState(null)

  // Scroll to top when changing route
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  // GLOBAL SMART CLICK HANDLER: Helper navigation for marketing anchors
  const handleGlobalClick = (e) => {
    // NEVER intercept form controls, forms, buttons inside forms, navbar items, or on /login
    if (
      e.target.closest('form') ||
      e.target.closest('header') ||
      e.target.closest('input, textarea, select') ||
      location.pathname === '/login'
    ) {
      return
    }

    const clickable = e.target.closest('a, button, [role="button"]')
    if (!clickable) return

    // Never intercept submit buttons or buttons with data-no-global-intercept
    if (
      clickable.type === 'submit' ||
      clickable.closest('form') ||
      clickable.closest('header') ||
      clickable.hasAttribute('data-no-global-intercept')
    ) {
      return
    }

    const rawText = (clickable.innerText || clickable.textContent || '').trim().toLowerCase()
    const href = clickable.getAttribute('href')

    // 1. 3D Studio & Configurator shortcuts
    if (
      rawText.includes('try configurator') ||
      rawText.includes('cad configurator') ||
      rawText.includes('launch 3d') ||
      rawText.includes('start customizing') ||
      rawText.includes('3d config') ||
      rawText.includes('cad staging') ||
      rawText.includes('3d studio')
    ) {
      e.preventDefault()
      navigate('/configurator')
      return
    }


    // 3. Technical Fitment & Compliance shortcuts
    if (
      rawText.includes('fitment engine') ||
      rawText.includes('fitment matrix') ||
      rawText.includes('fitment check') ||
      rawText.includes('b2b fitment') ||
      rawText.includes('compliance') ||
      rawText.includes('compatibility') ||
      rawText.includes('caliper clearance') ||
      rawText.includes('tüv road legal')
    ) {
      e.preventDefault()
      navigate('/fitment')
      return
    }

    // 4. Parts Store & B2B Shop shortcuts
    if (
      rawText.includes('store') ||
      rawText.includes('parts') ||
      rawText.includes('performance parts') ||
      rawText.includes('shop') ||
      rawText.includes('b2b store') ||
      rawText.includes('bay dispatch') ||
      rawText.includes('work order') ||
      rawText.includes('dispatch') ||
      rawText.includes('shop floor bay')
    ) {
      e.preventDefault()
      navigate('/shop')
      return
    }

    // 5. Parts Inventory & Procurement shortcuts
    if (
      rawText.includes('inventory') ||
      rawText.includes('procurement') ||
      rawText.includes('parts stock') ||
      rawText.includes('b2b replenishment') ||
      rawText.includes('reorder') ||
      rawText.includes('order parts') ||
      rawText.includes('sku catalog')
    ) {
      e.preventDefault()
      navigate('/inventory')
      return
    }

    // 6. Quotation & Invoicing shortcuts
    if (
      rawText.includes('generate quote') ||
      rawText.includes('proceed to quote') ||
      rawText.includes('quotations') ||
      rawText.includes('invoice') ||
      rawText.includes('pricing') ||
      rawText.includes('quotes & margin') ||
      rawText.includes('calculate roi')
    ) {
      e.preventDefault()
      navigate('/quotation')
      return
    }

    // 7. Modification Records & Digital Warranty shortcuts
    if (
      rawText.includes('warranty') ||
      rawText.includes('modification record') ||
      rawText.includes('qr certificate') ||
      rawText.includes('build passport')
    ) {
      e.preventDefault()
      navigate('/warranty')
      return
    }

    // 8. Garage Operations Dashboard shortcuts
    if (
      rawText.includes('garage workspace') ||
      rawText.includes('garage dashboard') ||
      rawText.includes('operations dashboard') ||
      rawText.includes('dashboard') ||
      rawText.includes('revenue report')
    ) {
      e.preventDefault()
      navigate('/dashboard')
      return
    }

    // 9. Workshop Profile & Marketplace shortcuts
    if (
      rawText.includes('garage profile') ||
      rawText.includes('marketplace') ||
      rawText.includes('partner network') ||
      rawText.includes('switch workshop') ||
      rawText.includes('workshop profile')
    ) {
      e.preventDefault()
      navigate('/profile')
      return
    }

    // 10. Technical Documentation & Knowledge Hub shortcuts
    if (
      rawText.includes('docs') ||
      rawText.includes('knowledge') ||
      rawText.includes('technical support') ||
      rawText.includes('installation guide') ||
      rawText.includes('platform settings')
    ) {
      e.preventDefault()
      navigate('/knowledge')
      return
    }

    // 11. Interactive Actions (Toast Feedback)
    if (rawText.includes('save config') || rawText.includes('save spec') || rawText.includes('bookmark')) {
      e.preventDefault()
      showToast('Vehicle build specification saved to Virtual Tune Cloud!')
      return
    }
    if (rawText.includes('export') || rawText.includes('download cad') || rawText.includes('export step')) {
      e.preventDefault()
      showToast('Preparing 3D CAD (.STEP) and technical engineering package...')
      return
    }
    if (rawText.includes('print quote') || rawText.includes('print invoice')) {
      e.preventDefault()
      showToast('Generating official B2B commercial invoice printable format...')
      return
    }
    if (rawText.includes('reset view') || rawText.includes('reset camera')) {
      e.preventDefault()
      showToast('Viewport camera reset to standard 3/4 front angle!')
      return
    }

    // Prevent non-functional '#' jumps
    if (href === '#' || href === '') {
      e.preventDefault()
    }
  }

  return (
    <div 
      className="min-h-screen bg-[#F3F5FA] dark:bg-[#0B0C10] text-[#111827] dark:text-[#F8FAFC] flex flex-col font-['Inter',sans-serif] transition-colors duration-200"
      onClick={handleGlobalClick}
    >
      {/* STRICTLY SINGLE UNIFIED NAVBAR */}
      <UnifiedNavbar />

      {/* Brand Compliant Login & Role Selection Modal */}
      <LoginModal />

      {/* Professional Status Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#0213B2] border border-white/20 text-white text-xs font-['Montserrat'] font-bold rounded-xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="material-symbols-outlined text-base text-white">check_circle</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Dynamic Viewport Container */}
      <main className="flex-1 flex flex-col">
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            {/* Authentication: open the modal overlay and go home */}
            <Route path="/login" element={<LoginRedirect />} />

            {/* Main Precision Modules with RBAC */}
            <Route path="/" element={<HomePage />} />
            <Route path="/configurator" element={<ConfiguratorPage />} />
            <Route path="/shop" element={<PartsStorePage />} />
            <Route path="/warranty" element={<ModificationWarrantyPage />} />
            <Route path="/knowledge" element={<KnowledgeHubPage />} />

            {/* Protected Modules (Require Authentication & Specific Roles) */}
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <PartsCartCheckoutPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/inventory" 
              element={
                <ProtectedRoute allowedRoles={['GARAGE_OWNER', 'LEAD_TECHNICIAN', 'ADMIN']}>
                  <PartsStorePage defaultTab="inventory" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/fitment" 
              element={
                <ProtectedRoute allowedRoles={['GARAGE_OWNER', 'LEAD_TECHNICIAN', 'ADMIN']}>
                  <FitmentMatrixPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quotation" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <QuotationInvoicePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['GARAGE_OWNER', 'LEAD_TECHNICIAN']}>
                  <GarageDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <GarageProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/account" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <AccountPage />
                </ProtectedRoute>
              } 
            />

            {/* Legacy & Shortcut Aliases */}
            <Route path="/my-builds" element={<Navigate to="/account" replace />} />
            <Route path="/compatibility" element={<Navigate to="/fitment" replace />} />
            <Route path="/data-mapping" element={<Navigate to="/fitment" replace />} />
            <Route path="/marketplace" element={<Navigate to="/profile" replace />} />

            {/* Catch-all redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <InteractiveAppWrapper />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}
