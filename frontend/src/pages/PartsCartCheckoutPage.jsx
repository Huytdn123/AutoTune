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
        carModel: 'Porsche 911 GT3 (992)',
        customerName: 'Alexander von Berg',
        notes: `B2B Tuning Package generated from Performance Store Cart (${selectedItems.length} items)`,
        laborFee: laborVnd,
        discountAmount: discountVnd,
        items: itemsPayload
      }
      const created = await quotationApi.create(payload)
      showToast(`Đã tạo Báo giá chính thức #${created.quotationNumber} từ giỏ hàng!`)
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
    showToast('B2B Purchase Order Authorized & Dispatched to Central Warehouse!')
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F3F5FA] text-[#111827] font-['Inter',sans-serif] min-h-[calc(100vh-64px)] selection:bg-[#0213B2]/20 selection:text-[#0213B2]">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#0213B2] border border-[#0213B2] text-white text-xs font-['Montserrat'] font-bold rounded-lg shadow-2xl flex items-center gap-2.5 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-base text-white">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Workspace */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1700px] w-full mx-auto space-y-6">
        
        {/* PAGE HEADER SECTION */}
        <div className="bg-[#E8EDFF] rounded-2xl border border-[#BCC7D8] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 w-full">
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl md:text-3xl font-bold font-['Montserrat'] text-[#111827] tracking-tight">
                Parts Cart & Staged Checkout
              </h1>
              <span className="text-sm font-mono text-[#CBD5E1]">•</span>
              <span className="text-sm text-[#475569] font-medium font-mono">
                {cartItems.length} items ({selectedItems.length} selected)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#0213B2]">directions_car</span>
              <span className="font-mono text-xs text-[#06169B] font-semibold uppercase">Allocated to:</span>
              <span className="font-mono text-xs font-bold text-[#06169B] bg-[#D7E1FF] px-3 py-1.5 rounded-lg border border-[#0213B2]/30">
                Porsche 911 GT3 (992)
              </span>
            </div>
          </div>
        </div>

        {/* 2-COLUMN SPLIT SCREEN B2B PROCUREMENT WORKSPACE */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Itemized Cart & Vehicle Allocation (8 cols) */}
          <div className="xl:col-span-8 space-y-4">
            
            {/* Table Controls Bar */}
            <div className="flex items-center justify-between py-2.5 px-4 text-xs font-mono text-[#475569] dark:text-[#CBD5E1] bg-[#E5E8F0] dark:bg-[#14151D] border border-[#CBD5E1] dark:border-[#282A3A] rounded-2xl shadow-xs">
              <label className="flex items-center gap-2 cursor-pointer text-[#475569] dark:text-[#CBD5E1] hover:text-[#0213B2] dark:hover:text-[#60A5FA] select-none">
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  className="rounded border-[#CBD5E1] text-[#0213B2] focus:ring-0 w-4 h-4 cursor-pointer accent-[#0213B2]"
                />
                <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Select all</span>
              </label>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => showToast('Syncing live B2B wholesale prices with OEM server...')}
                  className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors flex items-center gap-1.5 cursor-pointer text-[#475569] dark:text-[#94A3B8]"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  <span>Refresh OEM prices</span>
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            {cartItems.length === 0 ? (
              <div className="p-12 text-center bg-[#E5E8F0] dark:bg-[#14151D] border border-[#CBD5E1] dark:border-[#282A3A] rounded-2xl space-y-4 shadow-xs">
                <span className="material-symbols-outlined text-5xl text-[#94A3B8]">shopping_cart_off</span>
                <p className="text-base font-medium text-[#475569] dark:text-[#CBD5E1]">Your parts cart is currently empty</p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0213B2] hover:bg-[#0115BC] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all font-['Montserrat']"
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
                    data-preserve-bg="true"
                    className="bg-white dark:bg-[#14151D] border border-[#CBD5E1] dark:border-[#282A3A] hover:border-[#0213B2]/50 dark:hover:border-[#60A5FA]/50 rounded-2xl p-4 transition-all duration-150 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <input 
                        type="checkbox" 
                        checked={item.selected}
                        onChange={() => toggleSelect(item.id)}
                        className="rounded border-[#CBD5E1] text-[#0213B2] focus:ring-0 w-4 h-4 shrink-0 cursor-pointer accent-[#0213B2]"
                      />
                      <div className="w-20 h-20 min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px] bg-white rounded-xl border border-[#CBD5E1] dark:border-[#282A3A] p-1 shrink-0 flex items-center justify-center overflow-hidden" data-preserve-white="true">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 bg-[#EEF2FF] dark:bg-[#1A224D] text-[#0213B2] dark:text-[#60A5FA] border border-[#CBD5E1] dark:border-[#282A3A] rounded text-[10px] font-mono tracking-wider font-semibold">
                            SKU: {item.sku}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm md:text-base text-[#111827] dark:text-[#F8FAFC] truncate font-['Montserrat']">
                          {item.name}
                        </h3>
                        <p className="font-mono text-xs text-[#475569] dark:text-[#CBD5E1] truncate">
                          {item.spec}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#CBD5E1] dark:border-[#282A3A] shrink-0">
                      {/* Qty Adjustment */}
                      <div className="flex items-center border border-[#CBD5E1] dark:border-[#282A3A] rounded-lg bg-white dark:bg-[#1B1D28]" data-preserve-bg="true">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2.5 py-1 text-[#475569] dark:text-[#CBD5E1] hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-1 font-mono text-[#111827] dark:text-[#F8FAFC] font-semibold text-xs min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2.5 py-1 text-[#475569] dark:text-[#CBD5E1] hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Price & Margin */}
                      <div className="text-right min-w-[120px]">
                        <div className="font-mono font-bold text-[#111827] text-base">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </div>
                        <div className="font-mono text-[11px] text-[#16A34A] font-medium">
                          {item.margin} margin
                        </div>
                      </div>

                      {/* Remove */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#DC2626] transition-colors cursor-pointer rounded hover:bg-[#FEE2E2]" 
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
              <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
                <Link 
                  to="/inventory"
                  className="text-xs font-bold font-['Montserrat'] uppercase tracking-wider text-[#0213B2] hover:underline flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  <span>Add more parts from catalog</span>
                </Link>

                <button 
                  onClick={clearCart}
                  className="text-xs font-mono text-[#64748B] hover:text-[#DC2626] transition-colors cursor-pointer"
                >
                  Clear cart
                </button>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: B2B Order Summary, Margin Intelligence & Checkout Authorization (4 cols) */}
          <div className="xl:col-span-4 space-y-4">
            <div className="bg-[#E8EDFF] border-2 border-[#0213B2]/30 rounded-2xl p-5 shadow-sm sticky top-20 space-y-5">
              
              <div className="flex items-center justify-between border-b border-[#BCC7D8] pb-3">
                <h2 className="text-lg font-bold font-['Montserrat'] text-[#111827]">Order Summary</h2>
                <span className="font-mono text-xs text-[#06169B] bg-[#D7E1FF] px-2.5 py-1 rounded-lg border border-[#0213B2]/30 font-bold">
                  Tier 1 B2B Pricing
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-[#475569]">
                  <span>Subtotal ({selectedItems.length} items)</span>
                  <span className="text-[#111827] font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-[#475569]">
                  <span>B2B Discount (8%)</span>
                  <span className="text-[#16A34A] font-semibold">-{formatCurrency(b2bDiscount)}</span>
                </div>
                <div className="flex justify-between items-center text-[#475569]">
                  <span>Estimated Shipping</span>
                  <span className="text-[#111827] font-semibold">{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between items-center text-[#475569]">
                  <span>Taxes & Customs</span>
                  <span className="text-[#111827] font-semibold">$0.00</span>
                </div>
                
                <div className="border-t border-[#BCC7D8] pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-bold font-['Montserrat'] text-[#06169B] uppercase tracking-wider">
                    Total Cost
                  </span>
                  <span className="text-2xl font-extrabold font-mono text-[#06169B]">
                    {formatCurrency(totalCost)}
                  </span>
                </div>
              </div>

              {/* Margin Intelligence ROI Card */}
              <div className="p-3.5 bg-[#D7E1FF] rounded-xl border border-[#BCC7D8] flex items-center justify-between font-mono">
                <div>
                  <span className="text-[#06169B] block text-[10px] uppercase font-bold">ESTIMATED CLIENT PROFIT</span>
                  <span className="text-[#06169B] font-extrabold text-sm font-['Montserrat']">+{formatCurrency(estimatedProfit)}</span>
                </div>
                <span className="text-xs bg-[#DCFCE7] text-[#16A34A] px-2.5 py-1 rounded-lg font-bold border border-[#16A34A]/30">
                  +30.3% ROI
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button 
                  onClick={handleRequestQuotation}
                  disabled={selectedItems.length === 0 || requestingQuote}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0213B2] hover:bg-[#0115BC] active:bg-[#06169B] disabled:opacity-50 text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-[#0213B2]/20 cursor-pointer"
                >
                  {requestingQuote ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang tạo Báo giá...</span>
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
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#D7E1FF] border border-[#0213B2]/30 disabled:opacity-50 text-[#0213B2] font-['Montserrat'] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-base text-[#0213B2]">lock</span>
                  <span>Authorize & Dispatch PO</span>
                </button>

                <button 
                  onClick={() => {
                    navigate('/shop')
                  }}
                  className="w-full py-2.5 text-center text-xs font-mono text-[#64748B] hover:text-[#0213B2] transition-colors flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#F1F5F9] rounded"
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
