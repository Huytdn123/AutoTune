import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { quotationApi } from '../services/api'

const INITIAL_CART_ITEMS = [
  {
    id: 1,
    name: 'BBS FI-R Forged Monoblock Wheel Set (20"/21")',
    sku: 'BBS-FIR-992-TITAN',
    spec: 'Titanium Silver • PCD 5x112 / ET35',
    image: '/images/bbs-fi-r-wheel.jpg',
    unitPrice: 8600,
    margin: '+27.4%',
    quantity: 1,
    selected: true
  },
  {
    id: 2,
    name: 'Akrapovič Evolution Line Titanium Exhaust System',
    sku: 'AKR-EVO-TITAN-992',
    spec: 'Valved Bypass • Weight -11.4 kg',
    image: '/images/akrapovic-evolution-line.jpg',
    unitPrice: 7400,
    margin: '+28.0%',
    quantity: 1,
    selected: true
  },
  {
    id: 3,
    name: 'KW Suspension V4 Clubsport 3-Way Coilover Kit',
    sku: 'KW-35271842-V4CS',
    spec: '16-Click Rebound • Independent Compression',
    image: '/images/kw-v4-clubsport.jpg',
    unitPrice: 4920,
    margin: '+20.0%',
    quantity: 1,
    selected: true
  },
  {
    id: 4,
    name: 'Brembo GT-S 6-Piston Big Brake Kit (Front 380x34mm)',
    sku: 'BRM-1N1.9042A2',
    spec: 'Monoblock Radial • Type 3 Slotted',
    image: '/images/brembo-gt-brake-kit.jpg',
    unitPrice: 3850,
    margin: '+21.4%',
    quantity: 1,
    selected: true
  }
]

export default function PartsCartCheckoutPage() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS)
  const [selectedBay, setSelectedBay] = useState('bay-1')
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const toggleSelect = (id) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) return { ...item, selected: !item.selected }
      return item
    }))
  }

  const toggleSelectAll = (checked) => {
    setCartItems(prev => prev.map(item => ({ ...item, selected: checked })))
  }

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
    showToast('Part removed from cart')
  }

  const clearCart = () => {
    setCartItems([])
    showToast('Cart cleared')
  }

  const allSelected = cartItems.length > 0 && cartItems.every(i => i.selected)
  const selectedItems = cartItems.filter(i => i.selected)

  const subtotal = selectedItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
  const b2bDiscount = subtotal * 0.08
  const shipping = subtotal > 0 ? 320 : 0
  const totalCost = subtotal > 0 ? (subtotal - b2bDiscount + shipping) : 0
  const estimatedProfit = subtotal * 0.405

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
  }

  const [requestingQuote, setRequestingQuote] = useState(false)

  const handleRequestQuotation = async () => {
    if (selectedItems.length === 0) return
    setRequestingQuote(true)
    try {
      const itemsPayload = selectedItems.map(item => ({
        partName: item.name,
        partSku: item.sku,
        category: 'Performance Component',
        quantity: item.quantity,
        unitPriceVnd: Math.round(item.unitPrice * 25000),
      }))
      const laborVnd = Math.round(800 * 25000)
      const discountVnd = Math.round(b2bDiscount * 25000)

      const payload = {
        carModel: 'Porsche 911 Carrera (991)',
        customerName: 'Alexander von Berg',
        notes: `B2B Tuning Package generated from Performance Store Cart (${selectedItems.length} items) - Allocated to ${selectedBay === 'bay-1' ? 'Bay 1 (Dyno Calibration)' : selectedBay === 'bay-2' ? 'Bay 2 (Lift Stage A)' : 'Bay 3 (Carbon Aero Bay)'}`,
        laborFee: laborVnd,
        discountAmount: discountVnd,
        items: itemsPayload
      }
      const created = await quotationApi.create(payload)
      showToast(`Official Quotation #${created.quotationNumber} created from cart!`)
      setTimeout(() => {
        navigate('/quotation')
      }, 700)
    } catch (err) {
      console.warn('Backend quotation creation fallback:', err)
      navigate('/quotation')
    } finally {
      setRequestingQuote(false)
    }
  }

  const handleAuthorizePO = () => {
    showToast(`B2B Purchase Order Authorized & Dispatched to ${selectedBay === 'bay-1' ? 'Bay 1 (Dyno Calibration)' : selectedBay === 'bay-2' ? 'Bay 2 (Lift Stage A)' : 'Bay 3 (Carbon Aero Bay)'}!`)
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F3F5FA] dark:bg-[#0B0C10] text-[#111827] dark:text-[#F8FAFC] font-['Inter',sans-serif] min-h-[calc(100vh-64px)] transition-colors duration-200 selection:bg-[#0213B2]/20 selection:text-[#0213B2]">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#0213B2] border border-white/20 text-white text-xs font-['Montserrat'] font-bold rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-base text-white">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Workspace */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1700px] w-full mx-auto space-y-6">
        
        {/* PAGE HEADER SECTION */}
        <div className="bg-gradient-to-r from-[#E8EDFF] via-[#EEF2FF] to-[#D7E1FF] dark:from-[#121833] dark:via-[#14151D] dark:to-[#0B0C10] rounded-2xl border border-slate-200 dark:border-[#282A3A] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 w-full">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#0213B2]/10 dark:bg-[#0213B2]/30 text-[#0213B2] dark:text-[#60A5FA] text-[10px] font-mono font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0213B2] dark:bg-[#60A5FA] animate-pulse" />
                STAGED B2B WORK ORDER ALLOCATION
              </div>
              <div className="flex items-baseline gap-3">
                <h1 className="text-2xl md:text-3xl font-extrabold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC] tracking-tight">
                  Parts Cart & Staged Checkout
                </h1>
                <span className="text-sm font-mono text-slate-400">•</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium font-mono">
                  {cartItems.length} items ({selectedItems.length} selected)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="material-symbols-outlined text-sm text-[#0213B2] dark:text-[#60A5FA]">directions_car</span>
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Allocated to:</span>
              <span className="font-mono text-xs font-bold text-[#0213B2] dark:text-[#60A5FA] bg-white/80 dark:bg-[#1B1D28] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#282A3A] shadow-xs">
                Porsche 911 Carrera (991)
              </span>
            </div>
          </div>
        </div>

        {/* WORKSHOP DELIVERY BAY SELECTOR */}
        <div className="bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] rounded-2xl p-4 shadow-xs" data-preserve-white="true">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-base">precision_manufacturing</span>
              <span className="text-xs font-bold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC] uppercase tracking-wider">
                Target Workshop Bay Dispatch
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">SELECT BAY FOR PARTS STAGING</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'bay-1', name: 'Bay 01 — Dyno Stage', status: 'Ready for Staging', badge: 'Active Calibration' },
              { id: 'bay-2', name: 'Bay 02 — Lift Stage A', status: 'Suspension & Brakes', badge: '2 Post Lift' },
              { id: 'bay-3', name: 'Bay 03 — Carbon Fitting', status: 'Aero & Exterior', badge: 'Dust-Free Booth' }
            ].map(bay => {
              const active = selectedBay === bay.id
              return (
                <button
                  key={bay.id}
                  type="button"
                  onClick={() => setSelectedBay(bay.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    active
                      ? 'border-[#0213B2] dark:border-[#60A5FA] bg-[#0213B2]/5 dark:bg-[#0213B2]/15 ring-2 ring-[#0213B2]/20'
                      : 'border-slate-200 dark:border-[#282A3A] bg-slate-50 dark:bg-[#1B1D28] hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC]">
                      {bay.name}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${active ? 'bg-[#0213B2] dark:bg-[#60A5FA]' : 'bg-slate-300 dark:bg-slate-600'}`} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <span>{bay.status}</span>
                    <span className="text-[10px] font-bold text-[#0213B2] dark:text-[#60A5FA]">{bay.badge}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 2-COLUMN SPLIT SCREEN B2B PROCUREMENT WORKSPACE */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Itemized Cart & Vehicle Allocation (8 cols) */}
          <div className="xl:col-span-8 space-y-4">
            
            {/* Table Controls Bar */}
            <div className="flex items-center justify-between py-3 px-4 text-xs font-mono bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] rounded-2xl shadow-xs" data-preserve-white="true">
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-600 dark:text-slate-300 hover:text-[#0213B2] dark:hover:text-[#60A5FA] select-none">
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  className="rounded border-slate-300 text-[#0213B2] focus:ring-0 w-4 h-4 cursor-pointer accent-[#0213B2]"
                />
                <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Select all items</span>
              </label>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => showToast('Syncing live B2B wholesale prices with OEM server...')}
                  className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors flex items-center gap-1.5 cursor-pointer text-slate-500 dark:text-slate-400"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  <span>Refresh OEM prices</span>
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            {cartItems.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] rounded-2xl space-y-4 shadow-xs" data-preserve-white="true">
                <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">shopping_cart_off</span>
                <p className="text-base font-medium text-slate-600 dark:text-slate-300">Your parts cart is currently empty</p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0213B2] hover:bg-[#0115BC] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-[#0213B2]/20 transition-all font-['Montserrat']"
                >
                  <span className="material-symbols-outlined text-sm">storefront</span>
                  <span>Browse Performance Store</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div 
                    key={item.id}
                    data-preserve-white="true"
                    className="bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] hover:border-[#0213B2]/50 dark:hover:border-[#60A5FA]/50 rounded-2xl p-4 transition-all duration-150 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <input 
                        type="checkbox" 
                        checked={item.selected}
                        onChange={() => toggleSelect(item.id)}
                        className="rounded border-slate-300 text-[#0213B2] focus:ring-0 w-4 h-4 shrink-0 cursor-pointer accent-[#0213B2]"
                      />
                      <div className="w-20 h-20 min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px] bg-slate-50 dark:bg-[#181A24] rounded-xl border border-slate-200 dark:border-[#282A3A] p-2 shrink-0 flex items-center justify-center overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="max-w-full max-h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 bg-[#0213B2]/10 dark:bg-[#0213B2]/30 text-[#0213B2] dark:text-[#60A5FA] border border-[#0213B2]/20 rounded text-[10px] font-mono tracking-wider font-semibold">
                            SKU: {item.sku}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm md:text-base text-[#111827] dark:text-[#F8FAFC] truncate font-['Montserrat']">
                          {item.name}
                        </h3>
                        <p className="font-mono text-xs text-slate-500 dark:text-slate-400 truncate">
                          {item.spec}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-[#282A3A] shrink-0">
                      {/* Qty Adjustment */}
                      <div className="flex items-center border border-slate-200 dark:border-[#282A3A] rounded-xl bg-slate-50 dark:bg-[#1B1D28] overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-3 py-1 text-slate-600 dark:text-slate-300 hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors cursor-pointer text-sm font-bold"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-1 font-mono text-[#111827] dark:text-[#F8FAFC] font-semibold text-xs min-w-[28px] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-3 py-1 text-slate-600 dark:text-slate-300 hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors cursor-pointer text-sm font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Price & Margin */}
                      <div className="text-right min-w-[120px]">
                        <div className="font-mono font-bold text-[#111827] dark:text-[#F8FAFC] text-base">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </div>
                        <div className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          {item.margin} margin
                        </div>
                      </div>

                      {/* Remove */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40" 
                        title="Remove"
                      >
                        <span className="material-symbols-outlined text-lg">close</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Actions Bar */}
            {cartItems.length > 0 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-[#282A3A]">
                <Link 
                  to="/shop"
                  className="text-xs font-bold font-['Montserrat'] uppercase tracking-wider text-[#0213B2] dark:text-[#60A5FA] hover:underline flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  <span>Add more parts from catalog</span>
                </Link>

                <button 
                  onClick={clearCart}
                  className="text-xs font-mono text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Clear cart
                </button>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: B2B Order Summary, Margin Intelligence & Checkout Authorization (4 cols) */}
          <div className="xl:col-span-4 space-y-4">
            <div className="bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] rounded-2xl p-6 shadow-md sticky top-20 space-y-5" data-preserve-white="true">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#282A3A] pb-3">
                <h2 className="text-lg font-bold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC]">Order Summary</h2>
                <span className="font-mono text-xs text-[#0213B2] dark:text-[#60A5FA] bg-[#0213B2]/10 dark:bg-[#0213B2]/30 px-2.5 py-1 rounded-full border border-[#0213B2]/20 font-bold">
                  Tier 1 B2B Pricing
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>Subtotal ({selectedItems.length} items)</span>
                  <span className="text-[#111827] dark:text-[#F8FAFC] font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>B2B Discount (8%)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">-{formatCurrency(b2bDiscount)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>Estimated Shipping</span>
                  <span className="text-[#111827] dark:text-[#F8FAFC] font-semibold">{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>Taxes & Customs</span>
                  <span className="text-[#111827] dark:text-[#F8FAFC] font-semibold">$0.00</span>
                </div>
                
                <div className="border-t border-slate-200 dark:border-[#282A3A] pt-4 flex justify-between items-baseline">
                  <span className="text-sm font-bold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC] uppercase tracking-wider">
                    Total Cost
                  </span>
                  <span className="text-2xl font-extrabold font-mono text-[#0213B2] dark:text-[#60A5FA]">
                    {formatCurrency(totalCost)}
                  </span>
                </div>
              </div>

              {/* Margin Intelligence ROI Card */}
              <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between font-mono">
                <div>
                  <span className="text-emerald-800 dark:text-emerald-300 block text-[10px] uppercase font-bold tracking-wider">ESTIMATED CLIENT PROFIT</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm font-['Montserrat']">+{formatCurrency(estimatedProfit)}</span>
                </div>
                <span className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-lg font-bold border border-emerald-300 dark:border-emerald-700">
                  +30.3% ROI
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button 
                  onClick={handleRequestQuotation}
                  disabled={selectedItems.length === 0 || requestingQuote}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0213B2] hover:bg-[#0115BC] active:bg-[#06169B] disabled:opacity-50 text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-[#0213B2]/20 cursor-pointer"
                >
                  {requestingQuote ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating Quotation...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">request_quote</span>
                      <span>Request Official Quotation</span>
                    </>
                  )}
                </button>

                <button 
                  onClick={handleAuthorizePO}
                  disabled={selectedItems.length === 0}
                  className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-[#1B1D28] hover:bg-slate-100 dark:hover:bg-[#262938] border border-slate-200 dark:border-[#282A3A] disabled:opacity-50 text-[#0213B2] dark:text-[#60A5FA] font-['Montserrat'] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-base">lock</span>
                  <span>Authorize & Dispatch PO</span>
                </button>

                <button 
                  onClick={() => {
                    navigate('/shop')
                  }}
                  className="w-full py-2 text-center text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">storefront</span>
                  <span>Continue Shopping at Performance Store</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </main>
    </div>
  )
}
