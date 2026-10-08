import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { quotationApi, workOrderApi, buildApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

/**
 * QuotationInvoicePage - B2B Quotation Engine & Work Order Bay Management
 * Fully connected to Spring Boot /api/quotations & /api/work-orders
 * Supports full lifecycle: DRAFT -> SENT -> APPROVED -> WORK ORDER DISPATCH -> IN_PROGRESS -> COMPLETED
 */
export default function QuotationInvoicePage() {
  const navigate = useNavigate()
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

  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
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

  const selectWorkOrder = (wo) => {
    setCurrentWorkOrder(wo)
    setSelectedTechId(wo.technicianId || '')
    setSelectedBay(wo.bayNumber || 'Bay 01 - Dyno & Performance Alignment')
    setSelectedStatus(wo.status || 'PENDING')
    setSelectedProgress(wo.progress || 0)
    setTechNotes(wo.notes || '')
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
        customerName: currentUser?.fullName || 'Khách hàng VIP Virtual Tune',
        customerPhone: currentUser?.phone || '+84 908 123 456',
        notes: `Cấu hình độ xe 3D (${b.shareCode}): Sơn ${cfg.bodyColorName || b.bodyColor}, Nội thất ${cfg.interiorColorName || 'Leather'}, Mâm ${cfg.selectedWheelSku || 'OEM'}, Bodykit ${cfg.selectedBodykitSku || 'OEM'}, Cánh gió ${cfg.selectedSpoilerSku || 'OEM'}.`,
        items: itemsToSend
      }

      const res = await quotationApi.create(payload)
      showToast(`Đã tạo Báo giá chính thức #${res.quotationNumber} từ bản độ 3D!`)
      await fetchQuotations()
      setCurrentQuote(res)
      setBuildPreview(null)
    } catch (err) {
      console.error('Failed to create quotation from build:', err)
      showToast(err.response?.data?.message || 'Không thể tạo báo giá từ bản độ 3D.')
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

  // Filtered lists
  const filteredQuotes = quotations.filter(q => {
    if (quoteFilter === 'ALL') return true
    return q.status === quoteFilter
  })

  const filteredWorkOrders = workOrders.filter(w => {
    if (workOrderFilter === 'ALL') return true
    return w.status === workOrderFilter
  })

  return (
    <div className="bg-[#0d131f] text-[#e3e8f5] min-h-[calc(100vh-4rem)] flex flex-col font-['Inter',sans-serif] antialiased selection:bg-[#1f2f57] selection:text-[#dae2ff]">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#1f2f57] border border-[#6091c3] text-[#dae2ff] text-xs font-['Montserrat'] font-bold rounded-lg shadow-2xl flex items-center gap-2.5 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-base text-[#6091c3]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP WORKSPACE NAVIGATION & TAB SWITCHER */}
      <section className="bg-[#162447] border-b border-[#45464e]/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#8f9099] uppercase tracking-wider">
              <span>COMMERCIAL WORKSHOP</span>
              <span>/</span>
              <span className="text-[#6091c3] font-bold">WORKFLOW EXECUTION</span>
            </div>
            <h1 className="font-['Montserrat'] text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Quotation & Work Order Workflow</span>
            </h1>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-[#0d131f] border border-white/15 shadow-inner self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('quotations')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-['Montserrat'] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'quotations'
                  ? 'bg-[#6091c3] text-white shadow-md'
                  : 'text-[#c8d4ea] hover:text-white'
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
                  ? 'bg-[#10b981] text-white shadow-md'
                  : 'text-[#c8d4ea] hover:text-white'
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
          <div className="bg-gradient-to-r from-[#162447] to-[#1f2f57] border-2 border-[#6091c3] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#6091c3]/20 border border-[#6091c3]/40 flex items-center justify-center text-[#6091c3] shrink-0">
                  <span className="material-symbols-outlined text-2xl">view_in_ar</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#6091c3]/30 text-white border border-[#6091c3]/50">
                      3D Configurator Staging
                    </span>
                    <span className="text-xs font-mono text-[#8f9099]">Mã bản độ: {buildPreview.build.shareCode}</span>
                  </div>
                  <h2 className="text-lg font-black text-white mt-1">
                    {buildPreview.config?.carName || buildPreview.build.buildName || 'Ferrari 458 Italia Custom Build'}
                  </h2>
                  <p className="text-xs text-[#c8d4ea]/80 mt-0.5">
                    Ngoại thất: <strong className="text-white">{buildPreview.config?.bodyColorName || buildPreview.build.bodyColor}</strong> · 
                    Nội thất: <strong className="text-white">{buildPreview.config?.interiorColorName || 'Nero'}</strong> · 
                    Mâm: <strong className="text-white">{buildPreview.config?.selectedWheelSku ? 'NOVITEC 21"' : 'Ferrari OEM'}</strong> · 
                    Bodykit: <strong className="text-white">{buildPreview.config?.selectedBodykitSku ? 'LB-WORKS Full Carbon' : 'OEM'}</strong> · 
                    Cánh gió: <strong className="text-white">{buildPreview.config?.selectedSpoilerSku ? (buildPreview.config.selectedSpoilerSku.includes('ducktail') ? 'LB Ducktail' : 'LB GT Wing') : 'OEM Clean'}</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#8f9099] block uppercase">Tổng giá trị dự toán</span>
                  <span className="text-xl font-black font-mono text-emerald-400">
                    ${(buildPreview.build.totalEstimatedCost || 328000).toLocaleString()} USD
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCreateQuoteFromBuild}
                  disabled={creatingQuoteFromBuild}
                  className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-on-primary rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">receipt_long</span>
                  <span>{creatingQuoteFromBuild ? 'Đang tạo...' : 'Lập Báo Giá Ngay'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: QUOTATIONS WORKSPACE                                              */}
        {/* ========================================================================= */}
        {activeTab === 'quotations' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT: Quotations List */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#162447] rounded-xl p-4 border border-[#6091c3]/30 shadow space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h2 className="font-['Montserrat'] text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#6091c3] text-base">format_list_bulleted</span>
                    <span>All Quotations</span>
                  </h2>
                  <span className="text-[11px] font-mono text-[#8f9099]">{filteredQuotes.length} Records</span>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 text-[11px] font-mono overflow-x-auto pb-1 scrollbar-none">
                  {['ALL', 'APPROVED', 'SENT', 'DRAFT', 'REJECTED'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setQuoteFilter(st)}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        quoteFilter === st
                          ? 'bg-[#6091c3] text-white font-bold'
                          : 'bg-white/5 text-[#c8d4ea] hover:bg-white/10'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* List items */}
                {loadingQuotes ? (
                  <div className="py-12 text-center text-xs font-mono text-[#8f9099] flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#6091c3] border-t-transparent rounded-full animate-spin" />
                    <span>Loading quotations...</span>
                  </div>
                ) : filteredQuotes.length === 0 ? (
                  <div className="py-12 text-center text-xs font-mono text-[#8f9099]">
                    No quotations found for "{quoteFilter}"
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                    {filteredQuotes.map(q => {
                      const isSelected = currentQuote?.id === q.id
                      const statusColor = q.status === 'APPROVED' ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40'
                                        : q.status === 'SENT' ? 'text-blue-400 border-blue-500/40 bg-blue-950/40'
                                        : q.status === 'REJECTED' ? 'text-rose-400 border-rose-500/40 bg-rose-950/40'
                                        : 'text-amber-400 border-amber-500/40 bg-amber-950/40'
                      return (
                        <div
                          key={q.id}
                          onClick={() => setCurrentQuote(q)}
                          className={`p-3 rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#1f2f57] border-[#6091c3] shadow-md ring-1 ring-[#6091c3]'
                              : 'bg-[#0d131f]/70 border-white/10 hover:border-white/25 hover:bg-[#0d131f]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs font-bold text-white">{q.quotationNumber}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${statusColor}`}>
                              {q.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#c8d4ea] truncate font-medium">{q.carModel}</p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[11px] font-mono">
                            <span className="text-[#8f9099] truncate">{q.customerName}</span>
                            <span className="text-[#6091c3] font-bold">{formatUsd(q.finalTotal)}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Active Quotation Details */}
            {currentQuote ? (
              <div className="lg:col-span-8 space-y-6">
                
                {/* Quotation Header & Actions Bar */}
                <div className="bg-[#162447] rounded-xl p-5 border border-[#6091c3]/30 shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold text-[#6091c3]">{currentQuote.quotationNumber}</span>
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase border ${
                        currentQuote.status === 'APPROVED' ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/50'
                        : currentQuote.status === 'SENT' ? 'text-blue-400 border-blue-500/40 bg-blue-950/50'
                        : currentQuote.status === 'REJECTED' ? 'text-rose-400 border-rose-500/40 bg-rose-950/50'
                        : 'text-amber-400 border-amber-500/40 bg-amber-950/50'
                      }`}>
                        {currentQuote.status}
                      </span>
                      {currentQuote.hasWorkOrder && (
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">precision_manufacturing</span>
                          <span>Dispatched: {currentQuote.workOrderNumber}</span>
                        </span>
                      )}
                    </div>
                    <h2 className="font-['Montserrat'] text-xl font-bold text-white">{currentQuote.carModel}</h2>
                    <p className="text-xs text-[#8f9099] font-mono mt-0.5">
                      Client: <strong className="text-white">{currentQuote.customerName}</strong> ({currentQuote.customerPhone || 'N/A'}) • {currentQuote.garageName}
                    </p>
                  </div>

                  {/* Actions: Approve / Reject or Dispatch Work Order */}
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    {/* Customer or Owner: Approve / Reject */}
                    {currentQuote.status === 'SENT' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuoteStatus('APPROVED')}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-['Montserrat'] font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          <span>Approve Quote</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuoteStatus('REJECTED')}
                          className="px-3.5 py-2 bg-rose-600/80 hover:bg-rose-500 text-white rounded-lg text-xs font-['Montserrat'] font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">cancel</span>
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {/* If APPROVED: Dispatch to Work Order */}
                    {currentQuote.status === 'APPROVED' && !currentQuote.hasWorkOrder && (
                      <button
                        type="button"
                        onClick={handleCreateWorkOrder}
                        className="px-4 py-2 bg-[#10b981] hover:brightness-110 text-white rounded-lg text-xs font-['Montserrat'] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-all cursor-pointer animate-pulse"
                      >
                        <span className="material-symbols-outlined text-base">precision_manufacturing</span>
                        <span>Dispatch & Create Work Order</span>
                      </button>
                    )}

                    {/* If Work Order already exists: switch view */}
                    {currentQuote.hasWorkOrder && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('work-orders')
                          const target = workOrders.find(w => w.quotationId === currentQuote.id)
                          if (target) selectWorkOrder(target)
                        }}
                        className="px-3.5 py-2 bg-[#1f2f57] border border-[#6091c3]/50 text-white rounded-lg text-xs font-['Montserrat'] font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:bg-[#6091c3]/20"
                      >
                        <span className="material-symbols-outlined text-sm text-[#6091c3]">visibility</span>
                        <span>View Active Work Order</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Quotation Line Items Table */}
                <div className="bg-[#162447] rounded-xl p-5 border border-[#6091c3]/30 shadow space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="font-['Montserrat'] text-sm font-bold text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#6091c3] text-base">tune</span>
                      <span>Staged Performance Components & Hardware</span>
                    </h3>
                    <span className="text-xs font-mono text-[#8f9099]">{currentQuote.items?.length || 0} Line Items</span>
                  </div>

                  <div className="divide-y divide-white/10">
                    {currentQuote.items && currentQuote.items.length > 0 ? (
                      currentQuote.items.map((it, idx) => (
                        <div key={it.itemId || idx} className="py-3 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#0d131f] flex items-center justify-center text-[#6091c3] shrink-0 border border-white/10">
                              <span className="material-symbols-outlined text-xl">
                                {it.category?.toLowerCase().includes('wheel') ? 'adjust'
                                 : it.category?.toLowerCase().includes('exhaust') ? 'mode_fan'
                                 : it.category?.toLowerCase().includes('brake') ? 'album'
                                 : it.category?.toLowerCase().includes('aero') ? 'speed' : 'settings'}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-['Montserrat'] text-sm font-bold text-white">{it.partName}</h4>
                              <p className="text-xs text-[#8f9099] font-mono">
                                SKU: {it.partSku || 'OEM-SPEC'} • Qty: {it.quantity}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-mono text-sm font-bold text-white block">
                              {formatUsd(it.totalPriceVnd)}
                            </span>
                            <span className="text-[11px] font-mono text-[#8f9099]">
                              {formatVnd(it.totalPriceVnd)}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-xs font-mono text-[#8f9099]">
                        Baseline OEM Performance Staging Package included
                      </div>
                    )}
                  </div>
                </div>

                {/* Financial Summary Card */}
                <div className="bg-[#162447] rounded-xl p-6 border border-[#6091c3]/30 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="font-['Montserrat'] font-bold text-sm text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#6091c3] text-lg">receipt_long</span>
                      <span>Commercial Financial Breakdown</span>
                    </h3>
                    <span className="text-xs font-mono text-[#8f9099]">TÜV & ECE Compliant Staging</span>
                  </div>

                  <div className="space-y-3 text-xs font-mono">
                    <div className="flex justify-between items-center text-[#c8d4ea]">
                      <span>Parts Subtotal (Authentic OEM Stock):</span>
                      <span className="font-bold text-white">
                        {formatUsd(currentQuote.partsTotal)} ({formatVnd(currentQuote.partsTotal)})
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[#c8d4ea]">
                      <span>Installation, Calibration & Dyno Labor:</span>
                      <span className="font-bold text-white">
                        {formatUsd(currentQuote.laborTotal)} ({formatVnd(currentQuote.laborTotal)})
                      </span>
                    </div>
                    {currentQuote.discountAmount > 0 && (
                      <div className="flex justify-between items-center text-emerald-400">
                        <span>Preferred Commercial VIP Discount:</span>
                        <span className="font-bold">
                          -{formatUsd(currentQuote.discountAmount)} (-{formatVnd(currentQuote.discountAmount)})
                        </span>
                      </div>
                    )}
                    {currentQuote.taxAmount > 0 && (
                      <div className="flex justify-between items-center text-[#c8d4ea]">
                        <span>Applicable VAT & Statutory Compliance Tax:</span>
                        <span className="font-bold text-white">
                          +{formatUsd(currentQuote.taxAmount)} (+{formatVnd(currentQuote.taxAmount)})
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 p-4 rounded-xl bg-[#0d131f] border border-[#6091c3]/40 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8f9099] block">
                        TOTAL ESTIMATED PAYABLE
                      </span>
                      <span className="text-[11px] text-[#6091c3] mt-0.5 block font-mono">
                        VAT Included • 24M Warranty Protection Included
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-2xl font-extrabold text-[#6091c3] block">
                        {formatUsd(currentQuote.finalTotal)}
                      </span>
                      <span className="text-[11px] font-mono text-[#8f9099]">
                        {formatVnd(currentQuote.finalTotal)}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="lg:col-span-8 bg-[#162447] rounded-xl p-12 text-center text-xs font-mono text-[#8f9099] border border-white/10">
                Please select a quotation from the list on the left to view details.
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: WORK ORDERS WORKSPACE                                             */}
        {/* ========================================================================= */}
        {activeTab === 'work-orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT: Work Orders List */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#162447] rounded-xl p-4 border border-[#10b981]/30 shadow space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h2 className="font-['Montserrat'] text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#10b981] text-base">precision_manufacturing</span>
                    <span>Service Bay Work Orders</span>
                  </h2>
                  <span className="text-[11px] font-mono text-[#8f9099]">{filteredWorkOrders.length} Orders</span>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 text-[11px] font-mono overflow-x-auto pb-1 scrollbar-none">
                  {['ALL', 'IN_PROGRESS', 'PENDING', 'COMPLETED', 'CANCELLED'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setWorkOrderFilter(st)}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        workOrderFilter === st
                          ? 'bg-[#10b981] text-white font-bold'
                          : 'bg-white/5 text-[#c8d4ea] hover:bg-white/10'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* List items */}
                {loadingWorkOrders ? (
                  <div className="py-12 text-center text-xs font-mono text-[#8f9099] flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
                    <span>Loading work orders...</span>
                  </div>
                ) : filteredWorkOrders.length === 0 ? (
                  <div className="py-12 text-center text-xs font-mono text-[#8f9099]">
                    No work orders found for "{workOrderFilter}"
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                    {filteredWorkOrders.map(wo => {
                      const isSelected = currentWorkOrder?.id === wo.id
                      const statusColor = wo.status === 'COMPLETED' ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40'
                                        : wo.status === 'IN_PROGRESS' ? 'text-blue-400 border-blue-500/40 bg-blue-950/40'
                                        : wo.status === 'CANCELLED' ? 'text-rose-400 border-rose-500/40 bg-rose-950/40'
                                        : 'text-amber-400 border-amber-500/40 bg-amber-950/40'
                      return (
                        <div
                          key={wo.id}
                          onClick={() => selectWorkOrder(wo)}
                          className={`p-3 rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#1f2f57] border-[#10b981] shadow-md ring-1 ring-[#10b981]'
                              : 'bg-[#0d131f]/70 border-white/10 hover:border-white/25 hover:bg-[#0d131f]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs font-bold text-white">{wo.workOrderNumber}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${statusColor}`}>
                              {wo.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#c8d4ea] truncate font-medium">{wo.vehicleModel}</p>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-mono text-[#8f9099]">
                              <span>Progress:</span>
                              <span className="text-[#10b981] font-bold">{wo.progress}%</span>
                            </div>
                            <div className="w-full bg-[#0d131f] h-1.5 rounded-full overflow-hidden border border-white/10">
                              <div
                                className="bg-[#10b981] h-full rounded-full transition-all duration-300"
                                style={{ width: `${wo.progress}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] font-mono text-[#8f9099]">
                            <span>Tech: <strong className="text-white">{wo.technicianName || 'Unassigned'}</strong></span>
                            <span>{wo.bayNumber?.split('-')[0] || 'Bay 01'}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Active Work Order Bay Execution Console */}
            {currentWorkOrder ? (
              <div className="lg:col-span-8 space-y-6">
                
                {/* Work Order Header */}
                <div className="bg-[#162447] rounded-xl p-5 border border-[#10b981]/30 shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold text-[#10b981]">{currentWorkOrder.workOrderNumber}</span>
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-blue-950/60 border border-blue-500/40 text-blue-400">
                        {currentWorkOrder.status}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#8f9099] border border-white/10">
                        Linked Quote: {currentWorkOrder.quotationNumber}
                      </span>
                    </div>
                    <h2 className="font-['Montserrat'] text-xl font-bold text-white">{currentWorkOrder.vehicleModel}</h2>
                    <p className="text-xs text-[#8f9099] font-mono mt-0.5">
                      Client: <strong className="text-white">{currentWorkOrder.customerName}</strong> • {currentWorkOrder.bayNumber}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-[#0d131f] border border-white/10 text-xs font-mono text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Bay Active</span>
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Stage Controls */}
                <div className="bg-[#162447] rounded-xl p-5 border border-[#10b981]/30 shadow space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-['Montserrat'] text-sm font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#10b981] text-base">speed</span>
                        <span>Service Bay Execution Progress</span>
                      </h3>
                      <p className="text-xs text-[#8f9099] font-mono mt-0.5">Real-time workshop bay telemetry & staging checkpoints</p>
                    </div>
                    <span className="font-mono text-2xl font-extrabold text-[#10b981]">{currentWorkOrder.progress}%</span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-[#0d131f] h-3 rounded-full overflow-hidden border border-white/10 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-[#6091c3] to-[#10b981] h-full rounded-full transition-all duration-500"
                      style={{ width: `${currentWorkOrder.progress}%` }}
                    />
                  </div>

                  {/* Quick Stage Progression Buttons (For Technicians / Garage Staff) */}
                  {isGarageStaff && (
                    <div className="pt-2">
                      <span className="text-[11px] font-mono uppercase text-[#8f9099] block mb-2">Execution Milestones:</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateWorkOrderStatus('IN_PROGRESS', 25)}
                          className="px-2.5 py-1.5 rounded bg-[#0d131f] border border-white/10 hover:border-[#6091c3] text-xs font-mono text-left transition-all"
                        >
                          <span className="text-[10px] text-[#6091c3] block font-bold">25%</span>
                          <span className="text-white text-[11px] truncate block">Pre-Check & Alignment</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateWorkOrderStatus('IN_PROGRESS', 50)}
                          className="px-2.5 py-1.5 rounded bg-[#0d131f] border border-white/10 hover:border-[#6091c3] text-xs font-mono text-left transition-all"
                        >
                          <span className="text-[10px] text-[#6091c3] block font-bold">50%</span>
                          <span className="text-white text-[11px] truncate block">Hardware Staging</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateWorkOrderStatus('IN_PROGRESS', 75)}
                          className="px-2.5 py-1.5 rounded bg-[#0d131f] border border-white/10 hover:border-[#6091c3] text-xs font-mono text-left transition-all"
                        >
                          <span className="text-[10px] text-[#6091c3] block font-bold">75%</span>
                          <span className="text-white text-[11px] truncate block">Dyno Calibration</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateWorkOrderStatus('COMPLETED', 100)}
                          className="px-2.5 py-1.5 rounded bg-[#0d131f] border border-emerald-500/40 hover:bg-emerald-950/40 text-xs font-mono text-left transition-all"
                        >
                          <span className="text-[10px] text-emerald-400 block font-bold">100%</span>
                          <span className="text-emerald-300 text-[11px] truncate block font-bold">Final QC & Complete</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Technician Assignment & Operations Console (Staff Only) */}
                {isGarageStaff && (
                  <div className="bg-[#162447] rounded-xl p-5 border border-[#6091c3]/30 shadow space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <h3 className="font-['Montserrat'] text-sm font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#6091c3] text-base">engineering</span>
                        <span>Technician Assignment & Bay Dispatch</span>
                      </h3>
                      <span className="text-xs font-mono text-[#8f9099]">Garage Owner / Manager Control</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Technician Selector */}
                      <div>
                        <label className="text-xs font-mono text-[#8f9099] block mb-1.5">Assign Lead Technician:</label>
                        <select
                          value={selectedTechId}
                          onChange={e => setSelectedTechId(e.target.value)}
                          disabled={!isOwnerOrAdmin}
                          className="w-full px-3 py-2 rounded-lg bg-[#0d131f] border border-[#45464e]/40 text-xs font-mono text-white focus:border-[#6091c3] focus:outline-none"
                        >
                          <option value="">-- Select Certified Technician --</option>
                          <option value="3">Long Nguyen (Master Technician - Lead)</option>
                          <option value="4">Duc Vu (Service Technician - Junior)</option>
                          <option value="2">Tuan Tran (Garage Owner & Shop Foreman)</option>
                        </select>
                      </div>

                      {/* Bay Selector */}
                      <div>
                        <label className="text-xs font-mono text-[#8f9099] block mb-1.5">Service Bay Location:</label>
                        <select
                          value={selectedBay}
                          onChange={e => setSelectedBay(e.target.value)}
                          disabled={!isOwnerOrAdmin}
                          className="w-full px-3 py-2 rounded-lg bg-[#0d131f] border border-[#45464e]/40 text-xs font-mono text-white focus:border-[#6091c3] focus:outline-none"
                        >
                          <option value="Bay 01 - Dyno & Performance Alignment">Bay 01 - Dyno & Performance Alignment</option>
                          <option value="Bay 02 - Suspension & Clubsport Lift">Bay 02 - Suspension & Clubsport Lift</option>
                          <option value="Bay 03 - Laser Kinematics & BBK Clearance">Bay 03 - Laser Kinematics & BBK Clearance</option>
                          <option value="Bay 04 - Aero Staging & Bodywork">Bay 04 - Aero Staging & Bodywork</option>
                        </select>
                      </div>
                    </div>

                    {/* Operational Notes */}
                    <div>
                      <label className="text-xs font-mono text-[#8f9099] block mb-1.5">Execution Notes / Diagnostic Log:</label>
                      <textarea
                        rows={2}
                        value={techNotes}
                        onChange={e => setTechNotes(e.target.value)}
                        placeholder="Add bay notes, torque specifications, sensor readings..."
                        className="w-full px-3 py-2 rounded-lg bg-[#0d131f] border border-[#45464e]/40 text-xs font-mono text-white placeholder-white/30 focus:border-[#6091c3] focus:outline-none"
                      />
                    </div>

                    {/* Submit Assignment Buttons */}
                    <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                      {isOwnerOrAdmin && (
                        <button
                          type="button"
                          onClick={handleAssignTechnician}
                          className="px-4 py-2 bg-[#6091c3] hover:brightness-110 text-white rounded-lg text-xs font-['Montserrat'] font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">badge</span>
                          <span>Save Bay & Technician Assignment</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleUpdateWorkOrderStatus()}
                        className="px-4 py-2 bg-[#10b981] hover:brightness-110 text-white rounded-lg text-xs font-['Montserrat'] font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">save</span>
                        <span>Save Status & Notes</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="lg:col-span-8 bg-[#162447] rounded-xl p-12 text-center text-xs font-mono text-[#8f9099] border border-white/10">
                Please select a work order from the list on the left to monitor or manage bay execution.
              </div>
            )}

          </div>
        )}

      </main>

    </div>
  )
}
