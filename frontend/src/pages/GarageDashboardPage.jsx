import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { garageApi, workOrderApi, quotationApi, carApi } from '../services/api'
import DashboardTelemetryMetrics from '../components/dashboard/DashboardTelemetryMetrics'
import DashboardActiveBays from '../components/dashboard/DashboardActiveBays'
import DashboardFitmentMatrix from '../components/dashboard/DashboardFitmentMatrix'
import DashboardConsultations from '../components/dashboard/DashboardConsultations'

/**
 * GarageDashboardPage - Garage Operations & Executive Dashboard
 * Virtual Tune Automotive Precision System
 */
export default function GarageDashboardPage() {
  const navigate = useNavigate()
  const { currentUser, role } = useAuth()
  const [metrics, setMetrics] = useState(null)
  const [workOrders, setWorkOrders] = useState([])
  const [quotations, setQuotations] = useState([])
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [metricsData, woData, quoteData, carsData] = await Promise.allSettled([
        garageApi.getMetrics(),
        workOrderApi.getAll(),
        quotationApi.getAll(),
        carApi.getAll()
      ])

      if (metricsData.status === 'fulfilled') setMetrics(metricsData.value)
      if (woData.status === 'fulfilled') {
        const data = woData.value
        setWorkOrders(Array.isArray(data) ? data : (data?.data || []))
      }
      if (quoteData.status === 'fulfilled') {
        const data = quoteData.value
        setQuotations(Array.isArray(data) ? data : (data?.data || []))
      }
      if (carsData.status === 'fulfilled') {
        const data = carsData.value
        setCars(Array.isArray(data) ? data : (data?.data || []))
      }
    } catch (err) {
      setError('Unable to load all data from server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const formatVnd = (num) => {
    if (!num) return '0 ₫'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num)
  }

  return (
    <div className="bg-[#F3F5FA] dark:bg-[#0B0C10] text-[#111827] dark:text-[#F8FAFC] antialiased min-h-[calc(100vh-64px)] flex flex-col font-['Inter',sans-serif] transition-colors duration-200 selection:bg-[#0213B2]/20 selection:text-[#0213B2]">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#0213B2] border border-white/20 text-white text-xs font-['Montserrat'] font-bold rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-base text-white">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1700px] w-full mx-auto space-y-6">

        {/* HERO / EXECUTIVE HEADER BAR */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 p-6 bg-gradient-to-r from-[#E8EDFF] via-[#EEF2FF] to-[#D7E1FF] dark:from-[#121833] dark:via-[#14151D] dark:to-[#0B0C10] rounded-2xl border border-slate-200 dark:border-[#282A3A] shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-[#1B1D28] text-[#0213B2] dark:text-[#60A5FA] text-[10px] font-mono font-bold uppercase tracking-wider border border-slate-200 dark:border-[#282A3A] shadow-xs">
                OPERATIONAL OVERVIEW
              </span>
              <span className="text-[#0213B2] dark:text-[#60A5FA] font-bold">•</span>
              <span className="text-slate-600 dark:text-slate-400 text-xs font-mono font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Telemetry Synchronized
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC] tracking-tight">
              Garage Operations Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              High-precision overview of ongoing vehicle builds, stage completions, dyno calibration cells, and client pipelines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button 
              onClick={() => navigate('/quotation')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0213B2] hover:bg-[#0115BC] active:bg-[#06169B] text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-[#0213B2]/20 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">assignment_add</span>
              <span>New Work Order</span>
            </button>
            <button 
              onClick={() => navigate('/configurator')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#1B1D28] hover:bg-slate-50 dark:hover:bg-[#262938] text-[#0213B2] dark:text-[#60A5FA] border border-slate-200 dark:border-[#282A3A] hover:border-[#0213B2] font-['Montserrat'] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">view_in_ar</span>
              <span>3D Configurator</span>
            </button>
            <button 
              onClick={() => navigate('/fitment')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#1B1D28] hover:bg-slate-50 dark:hover:bg-[#262938] text-slate-700 dark:text-slate-200 hover:text-[#0213B2] dark:hover:text-[#60A5FA] border border-slate-200 dark:border-[#282A3A] hover:border-[#0213B2] font-['Montserrat'] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">fact_check</span>
              <span>Fitment Check</span>
            </button>
            <button 
              onClick={() => showToast('Exporting official garage P&L financial statement (.PDF)...')}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white dark:bg-[#1B1D28] hover:bg-slate-50 dark:hover:bg-[#262938] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#282A3A] hover:border-slate-300 rounded-xl font-['Montserrat'] font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">file_download</span>
              <span>Export P&L</span>
            </button>
          </div>
        </div>

        {/* 4 TELEMETRY METRIC CARDS */}
        <DashboardTelemetryMetrics metrics={metrics} formatVnd={formatVnd} />

        {/* WORKSHOP FLOOR STATUS (BAYS 01 - 04) */}
        <DashboardActiveBays onRefresh={fetchDashboardData} />

        {/* 2-COLUMN LOWER SECTION: FITMENT MATRIX & UPCOMING CONSULTATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <DashboardFitmentMatrix />
          <DashboardConsultations onShowToast={showToast} />
        </div>

      </main>
    </div>
  )
}
