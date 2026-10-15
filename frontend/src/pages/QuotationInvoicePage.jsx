import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { quotationApi, workOrderApi, buildApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import QuotationList from '../components/quotation/QuotationList'
import QuotationDetailCard from '../components/quotation/QuotationDetailCard'
import WorkOrderWorkspace from '../components/quotation/WorkOrderWorkspace'
import InvoiceModal from '../components/quotation/InvoiceModal'

/**
 * QuotationInvoicePage - B2B Quotation Engine & Work Order Bay Management Orchestrator
 * Fully connected to Spring Boot /api/quotations & /api/work-orders
 * Supports full lifecycle: DRAFT -> SENT -> APPROVED -> WORK ORDER DISPATCH -> IN_PROGRESS -> COMPLETED
 */
export default function QuotationInvoicePage() {
  const location = useLocation()
  const { currentUser, role } = useAuth()
  const isGarageStaff = currentUser && ['GARAGE_OWNER', 'LEAD_TECHNICIAN', 'ADMIN', 'TECHNICIAN'].includes(role)
  const isOwnerOrAdmin = currentUser && ['GARAGE_OWNER', 'ADMIN'].includes(role)

  const [activeTab, setActiveTab] = useState(location.search.includes('work-order') ? 'work-orders' : 'quotations')

  // Quotations state
  const [quotations, setQuotations] = useState([])
  const [currentQuote, setCurrentQuote] = useState(null)
  const [loadingQuotes, setLoadingQuotes] = useState(true)
  const [quoteFilter, setQuoteFilter] = useState('ALL')
  const [quoteSearchQuery, setQuoteSearchQuery] = useState('')

  // 3D Build Staging Quote Preview state
  const [buildPreview, setBuildPreview] = useState(null)
  const [creatingQuoteFromBuild, setCreatingQuoteFromBuild] = useState(false)

  // Work Orders state
  const [workOrders, setWorkOrders] = useState([])
  const [currentWorkOrder, setCurrentWorkOrder] = useState(null)
  const [loadingWorkOrders, setLoadingWorkOrders] = useState(true)
  const [workOrderFilter, setWorkOrderFilter] = useState('ALL')

  // Work Order assignment / update state
  const [selectedTechId, setSelectedTechId] = useState('')
  const [selectedBay, setSelectedBay] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedProgress, setSelectedProgress] = useState(0)
  const [techNotes, setTechNotes] = useState('')

  // Invoice Modal state
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)

  // Feedback Toast state
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const selectWorkOrder = (wo) => {
    setCurrentWorkOrder(wo)
    setSelectedTechId(wo.technicianId || '')
    setSelectedBay(wo.bayNumber || 'Bay 01 - Dyno & Performance Alignment')
    setSelectedStatus(wo.status || 'PENDING')
    setSelectedProgress(wo.progress || 0)
    setTechNotes(wo.notes || '')
  }

  const fetchQuotations = async () => {
    setLoadingQuotes(true)
    try {
      const data = isGarageStaff ? await quotationApi.getAll() : await quotationApi.getMy()
      const list = Array.isArray(data) ? data : (data?.data || [])
      setQuotations(list)
      if (list.length > 0) {
        if (!currentQuote || !list.some(q => q.id === currentQuote.id)) {
          setCurrentQuote(list[0])
        } else {
          const updated = list.find(q => q.id === currentQuote.id)
          if (updated) setCurrentQuote(updated)
        }
      }
    } catch (err) {
      console.error('Failed to fetch quotations:', err)
      showToast('Unable to load quotations from backend database.')
    } finally {
      setLoadingQuotes(false)
    }
  }

  const fetchWorkOrders = async () => {
    setLoadingWorkOrders(true)
    try {
      const data = isGarageStaff ? await workOrderApi.getAll() : await workOrderApi.getMy()
      const list = Array.isArray(data) ? data : (data?.data || [])
      setWorkOrders(list)
      if (list.length > 0) {
        if (!currentWorkOrder || !list.some(w => w.id === currentWorkOrder.id)) {
          selectWorkOrder(list[0])
        } else {
          const updated = list.find(w => w.id === currentWorkOrder.id)
          if (updated) selectWorkOrder(updated)
        }
      }
    } catch (err) {
      console.error('Failed to fetch work orders:', err)
    } finally {
      setLoadingWorkOrders(false)
    }
  }

  useEffect(() => {
    fetchQuotations()
    fetchWorkOrders()
  }, [role, currentUser])

  // Fetch 3D Staged Build when linked from ?build=SHARE_CODE
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const code = params.get('build')
    if (code) {
      buildApi.getByCode(code).then(b => {
        if (b) {
          let cfg = null
          try {
            cfg = b.selectedPartsJson ? (typeof b.selectedPartsJson === 'string' ? JSON.parse(b.selectedPartsJson) : b.selectedPartsJson) : null
          } catch (e) {}
          setBuildPreview({ build: b, config: cfg })
        }
      }).catch(err => console.warn('Could not load build preview in quotation:', err))
    }
  }, [location.search])

  const handleCreateQuoteFromBuild = async () => {
    if (!buildPreview?.build) return
    setCreatingQuoteFromBuild(true)
    try {
      const b = buildPreview.build
      const cfg = buildPreview.config || {}
      const itemsToSend = (cfg.selectedParts || []).map(p => ({
        partId: p.partId || p.id,
        partName: p.name || p.partName,
        partSku: p.sku,
        category: p.category,
        quantity: 1,
        unitPriceVnd: p.priceVnd || ((p.priceUsd || 0) * 25000)
      }))

      const payload = {
        shareCode: b.shareCode,
        carModel: cfg.carName || `${b.car?.brand || 'Ferrari'} ${b.car?.model || '458 Italia'}`,
        customerName: currentUser?.fullName || 'Virtual Tune VIP Client',
        customerPhone: currentUser?.phone || '+84 908 123 456',
        notes: `3D Custom Build (${b.shareCode}): Paint ${cfg.bodyColorName || b.bodyColor}, Interior ${cfg.interiorColorName || 'Leather'}, Wheels ${cfg.selectedWheelSku || 'OEM'}, Bodykit ${cfg.selectedBodykitSku || 'OEM'}, Spoiler ${cfg.selectedSpoilerSku || 'OEM'}.`,
        items: itemsToSend
      }

      const res = await quotationApi.create(payload)
      showToast(`Official Quotation #${res.quotationNumber} generated from 3D build!`)
      await fetchQuotations()
      setCurrentQuote(res)
      setBuildPreview(null)
    } catch (err) {
      console.error('Failed to create quotation from build:', err)
      showToast(err.response?.data?.message || 'Failed to generate quotation from 3D build.')
    } finally {
      setCreatingQuoteFromBuild(false)
    }
  }

  // Quotation Status Handlers
  const handleUpdateQuoteStatus = async (status) => {
    if (!currentQuote) return
    try {
      await quotationApi.updateStatus(currentQuote.id, status)
      showToast(`Quotation #${currentQuote.quotationNumber} updated to ${status}!`)
      await fetchQuotations()
    } catch (err) {
      console.error('Update status error:', err)
      showToast(err.response?.data?.message || 'Failed to update quotation status.')
    }
  }

  // Work Order Creation Handler
  const handleCreateWorkOrder = async () => {
    if (!currentQuote) return
    if (currentQuote.status !== 'APPROVED') {
      showToast('Cannot dispatch work order: Quotation must be APPROVED first!')
      return
    }
    try {
      const created = await workOrderApi.create({
        quotationId: currentQuote.id,
        bayNumber: 'Bay 01 - Dyno & Performance Alignment',
        priority: 'HIGH',
        notes: currentQuote.notes || 'Dispatched from official quotation'
      })
      showToast(`Work Order #${created.workOrderNumber} successfully dispatched!`)
      await fetchQuotations()
      await fetchWorkOrders()
      setActiveTab('work-orders')
      selectWorkOrder(created)
    } catch (err) {
      console.error('Create work order error:', err)
      showToast(err.response?.data?.message || 'Failed to dispatch work order.')
    }
  }

  // Work Order Technician Assignment
  const handleAssignTechnician = async () => {
    if (!currentWorkOrder) return
    if (!selectedTechId) {
      showToast('Please select a technician to assign.')
      return
    }
    try {
      const updated = await workOrderApi.assignTechnician(
        currentWorkOrder.id,
        Number(selectedTechId),
        selectedBay
      )
      showToast(`Technician successfully assigned to Work Order #${currentWorkOrder.workOrderNumber}!`)
      await fetchWorkOrders()
      selectWorkOrder(updated)
    } catch (err) {
      console.error('Assign technician error:', err)
      showToast(err.response?.data?.message || 'Failed to assign technician.')
    }
  }

  // Work Order Status & Progress Update
  const handleUpdateWorkOrderStatus = async (statusOverride, progressOverride) => {
    if (!currentWorkOrder) return
    const statusToSend = statusOverride || selectedStatus
    const progressToSend = progressOverride !== undefined ? progressOverride : selectedProgress

    try {
      const updated = await workOrderApi.updateStatus(
        currentWorkOrder.id,
        statusToSend,
        progressToSend,
        techNotes
      )
      showToast(`Work Order #${currentWorkOrder.workOrderNumber} status updated to ${statusToSend} (${progressToSend}%)!`)
      await fetchWorkOrders()
      selectWorkOrder(updated)
    } catch (err) {
      console.error('Update work order status error:', err)
      showToast(err.response?.data?.message || 'Failed to update work order.')
    }
  }

  const formatVnd = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0)
  }

  const formatUsd = (vnd) => {
    const usd = Math.round((vnd || 0) / 25000)
    return `$${usd.toLocaleString()} USD`
  }

  const renderStatusBadge = (status) => {
    const configs = {
      APPROVED: {
        pill: 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC] dark:bg-[#16A34A]/25 dark:text-[#4ADE80] dark:border-[#16A34A]/50',
        dot: 'bg-[#16A34A] dark:bg-[#4ADE80]'
      },
      SENT: {
        pill: 'bg-[#DBEAFE] text-[#1D4ED8] border-[#93C5FD] dark:bg-[#0213B2]/30 dark:text-[#60A5FA] dark:border-[#60A5FA]/40',
        dot: 'bg-[#2563EB] dark:bg-[#60A5FA]'
      },
      REJECTED: {
        pill: 'bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5] dark:bg-[#DC2626]/25 dark:text-[#F87171] dark:border-[#DC2626]/50',
        dot: 'bg-[#DC2626] dark:bg-[#F87171]'
      },
      DRAFT: {
        pill: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A] dark:bg-[#D97706]/25 dark:text-[#FBBF24] dark:border-[#D97706]/50',
        dot: 'bg-[#D97706] dark:bg-[#FBBF24]'
      },
      IN_PROGRESS: {
        pill: 'bg-[#DBEAFE] text-[#1D4ED8] border-[#93C5FD] dark:bg-[#0213B2]/30 dark:text-[#60A5FA] dark:border-[#60A5FA]/40',
        dot: 'bg-[#2563EB] dark:bg-[#60A5FA]'
      },
      COMPLETED: {
        pill: 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC] dark:bg-[#16A34A]/25 dark:text-[#4ADE80] dark:border-[#16A34A]/50',
        dot: 'bg-[#16A34A] dark:bg-[#4ADE80]'
      },
      CANCELLED: {
        pill: 'bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5] dark:bg-[#DC2626]/25 dark:text-[#F87171] dark:border-[#DC2626]/40',
        dot: 'bg-[#DC2626] dark:bg-[#F87171]'
      },
      PENDING: {
        pill: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A] dark:bg-[#D97706]/25 dark:text-[#FBBF24] dark:border-[#D97706]/40',
        dot: 'bg-[#D97706] dark:bg-[#FBBF24]'
      }
    }
    const conf = configs[status] || configs.DRAFT
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border inline-flex items-center gap-1.5 shadow-2xs ${conf.pill}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
        <span>{status}</span>
      </span>
    )
  }

  return (
    <div className="bg-[#F3F5FA] text-[#111827] min-h-[calc(100vh-4rem)] flex flex-col font-['Inter',sans-serif] antialiased selection:bg-[#0213B2]/20 selection:text-[#0213B2]">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#0213B2] border border-[#0213B2] text-white text-xs font-['Montserrat'] font-bold rounded-lg shadow-2xl flex items-center gap-2.5 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-base text-white">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP WORKSPACE NAVIGATION & TAB SWITCHER */}
      <section className="bg-[#E8EDFF] border-b border-[#BCC7D8] px-6 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#06169B] uppercase tracking-wider">
              <span>COMMERCIAL WORKSHOP</span>
              <span>/</span>
              <span className="text-[#0213B2] font-bold">WORKFLOW EXECUTION</span>
            </div>
            <h1 className="font-['Montserrat'] text-2xl font-extrabold text-[#111827] tracking-tight flex items-center gap-3">
              <span>Quotation & Work Order Workflow</span>
            </h1>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-[#D7E1FF] border border-[#BCC7D8] shadow-inner self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('quotations')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-['Montserrat'] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'quotations'
                  ? 'bg-[#0213B2] text-white shadow-xs'
                  : 'text-[#06169B] hover:text-[#111827] hover:bg-white/50'
              }`}
            >
              <span className="material-symbols-outlined text-sm">receipt_long</span>
              <span>Quotations ({quotations.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('work-orders')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-['Montserrat'] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'work-orders'
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'text-[#06169B] hover:text-[#111827] hover:bg-white/50'
              }`}
            >
              <span className="material-symbols-outlined text-sm">precision_manufacturing</span>
              <span>Work Orders ({workOrders.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* MAIN WORKSPACE CONTENT */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Staged 3D Build Quotation Link Banner */}
        {buildPreview && (
          <div className="bg-[#E8EDFF] border-2 border-[#0213B2]/40 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#D7E1FF] border border-[#0213B2]/30 flex items-center justify-center text-[#0213B2] shrink-0">
                  <span className="material-symbols-outlined text-2xl">view_in_ar</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D7E1FF] text-[#06169B] border border-[#0213B2]/30">
                      3D Configurator Staging
                    </span>
                    <span className="text-xs font-mono text-[#475569]">Build Code: {buildPreview.build.shareCode}</span>
                  </div>
                  <h2 className="text-lg font-black text-[#111827] mt-1">
                    {buildPreview.config?.carName || buildPreview.build.buildName || 'Ferrari 458 Italia Custom Build'}
                  </h2>
                  <p className="text-xs text-[#475569] mt-0.5">
                    Exterior: <strong className="text-[#111827]">{buildPreview.config?.bodyColorName || buildPreview.build.bodyColor}</strong> · 
                    Interior: <strong className="text-[#111827]">{buildPreview.config?.interiorColorName || 'Leather'}</strong> · 
                    Wheels: <strong className="text-[#111827]">{buildPreview.config?.selectedWheelSku ? 'NOVITEC 21"' : 'Ferrari OEM'}</strong> · 
                    Bodykit: <strong className="text-[#111827]">{buildPreview.config?.selectedBodykitSku ? 'LB-WORKS Full Carbon' : 'OEM'}</strong> · 
                    Spoiler: <strong className="text-[#111827]">{buildPreview.config?.selectedSpoilerSku ? (buildPreview.config.selectedSpoilerSku.includes('ducktail') ? 'LB Ducktail' : 'LB GT Wing') : 'OEM Clean'}</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#475569] block uppercase font-medium">Estimated Total Value</span>
                  <span className="text-xl font-black font-mono text-[#06169B]">
                    ${(buildPreview.build.totalEstimatedCost || 328000).toLocaleString()} USD
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCreateQuoteFromBuild}
                  disabled={creatingQuoteFromBuild}
                  className="px-4 py-2.5 bg-[#0213B2] hover:bg-[#0115BC] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">receipt_long</span>
                  <span>{creatingQuoteFromBuild ? 'Generating...' : 'Generate Quote Now'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: QUOTATIONS WORKSPACE */}
        {activeTab === 'quotations' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <QuotationList
              quotations={quotations}
              currentQuote={currentQuote}
              onSelectQuote={setCurrentQuote}
              quoteFilter={quoteFilter}
              onFilterChange={setQuoteFilter}
              searchQuery={quoteSearchQuery}
              onSearchChange={setQuoteSearchQuery}
              loading={loadingQuotes}
              formatUsd={formatUsd}
              renderStatusBadge={renderStatusBadge}
            />

            <QuotationDetailCard
              currentQuote={currentQuote}
              onUpdateStatus={handleUpdateQuoteStatus}
              onCreateWorkOrder={handleCreateWorkOrder}
              onViewWorkOrder={() => {
                setActiveTab('work-orders')
                const target = workOrders.find(w => w.quotationId === currentQuote?.id)
                if (target) selectWorkOrder(target)
              }}
              onOpenInvoice={() => setIsInvoiceModalOpen(true)}
              formatUsd={formatUsd}
              formatVnd={formatVnd}
              renderStatusBadge={renderStatusBadge}
            />
          </div>
        )}

        {/* TAB 2: WORK ORDERS WORKSPACE */}
        {activeTab === 'work-orders' && (
          <WorkOrderWorkspace
            workOrders={workOrders}
            currentWorkOrder={currentWorkOrder}
            onSelectWorkOrder={selectWorkOrder}
            workOrderFilter={workOrderFilter}
            onFilterChange={setWorkOrderFilter}
            loading={loadingWorkOrders}
            isGarageStaff={isGarageStaff}
            isOwnerOrAdmin={isOwnerOrAdmin}
            selectedTechId={selectedTechId}
            setSelectedTechId={setSelectedTechId}
            selectedBay={selectedBay}
            setSelectedBay={setSelectedBay}
            techNotes={techNotes}
            setTechNotes={setTechNotes}
            handleAssignTechnician={handleAssignTechnician}
            handleUpdateWorkOrderStatus={handleUpdateWorkOrderStatus}
            renderStatusBadge={renderStatusBadge}
          />
        )}
      </main>

      {/* Official B2B Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        quote={currentQuote}
        formatUsd={formatUsd}
        formatVnd={formatVnd}
      />
    </div>
  )
}
