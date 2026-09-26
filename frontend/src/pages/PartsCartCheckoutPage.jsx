import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const INITIAL_CART_ITEMS = [
  {
    id: 1,
    name: 'BBS FI-R Forged Monoblock Wheel Set (20"/21")',
    sku: 'BBS-FIR-992-TITAN',
    spec: 'Titanium Silver • PCD 5x112 / ET35',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsdY7AkDaD-730M6oc9RX4EfMoKg7AVPrqnQ0pi0pa09fTRPi8YSnpLnR7M3LyLw6O144lf3wSbuLmZHYw7nkoorXQIdhw_sL3wj7v1eH_OHzSSvwbDcjzbVyhQoHwx1B-ahqOZW1tiaRqnkhF0R7xn3VJ6jXeGhzyDVUXT4nx5M4RTJulhLin53pWLSXptIYcZ5yZ2UyCOGn5ywhztN2OKX_cgN8i0Y-cw2c3VK599d2TRs4iciY9',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ47eXVMCWcObYU3ZZdBeLsUTGhO_fkICz9lX3xbi-wLgK86SdSvbNaV0yDxuTj49cuIu5EDLUnAp6kGTXJ2g5IQVlDtICek-6s4CxsdZouTQ0A8ZRGVRXCFNowhI0jn3cN6qf3dfcj8ZNSt-V4-bvwlWzzfR0Rg1-vMM0nllJOjP9svw7EZ1gQP9B_-3nNRJsuUzrtnATawlS4MU5zYSSSBVsIm8AZQqduE1GS_p3eRsC_eYF44za',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARRBsKuWRBzkECezJu5ItEIUGaMb96LgTdd2Vq2UVzjieHukjvsSoOPcj6JReoE06pUz1XuHEyI13O25_TPh5mBqjXw6rxdLRKMzZBTgr1K8i4wbbcYMGwWrCm7E_6IdSK4Ii_YGcnxm8fUquO2fdhbwE2kaegGkAMINyMkxxkRDaoEH7zMSR6mhZ0-3vy37uyN3fQ7EEJXeGIu6NErHaYp0Y7MT4KZQuzB7ELa0FUcMIj6zA5Wgva',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSNTBW0tas2QMTVD3RS0cdRlmYn4dvL_b955aloixkhxxuWGDQWx9m2SdYZGG3wBDs8-sE1wx7OhpQw-09QXMByElGuGXb8Jel_sEM4Ep3e77HBvnLSfujyNvyDK7k0-rX9j3MvOVoUmtsk2k_tIL9-iKJ14Tz4BVJIeCvXQV6PG8CKC-gTtcqs1BJW42tXYxQJyZQ70TfBL1IH9qdwoYN8qQRtLyEOdgxHHq0x3mxxAnF90G3bqWv',
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

  const handleAuthorizePO = () => {
    showToast('B2B Purchase Order Authorized & Dispatched to Central Warehouse!')
  }

  return (
    <div className="flex-1 flex flex-col bg-[#121414] text-[#e3e2e2] font-['Inter',sans-serif] min-h-[calc(100vh-64px)] selection:bg-[#1f2f57] selection:text-[#b6c5f6]">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#1f2f57] border border-[#6091c3] text-[#dae2ff] text-xs font-['Montserrat'] font-bold rounded-lg shadow-2xl flex items-center gap-2.5 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-base text-[#6091c3]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Workspace */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1700px] w-full mx-auto space-y-6">
        
        {/* PAGE HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#45464e]/30">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 w-full">
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl md:text-3xl font-bold font-['Montserrat'] text-white tracking-tight">
                Parts Cart
              </h1>
              <span className="text-sm font-mono text-[#8f9099]">•</span>
              <span className="text-sm text-[#c5c6cf] font-medium font-mono">
                {cartItems.length} items ({selectedItems.length} selected)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#6091C3]">directions_car</span>
              <span className="font-mono text-xs text-[#8f9099] uppercase">Allocated to:</span>
              <span className="font-mono text-xs font-semibold text-white bg-[#1e2020] px-3 py-1.5 rounded border border-[#45464e]/40">
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
            <div className="flex items-center justify-between py-2 px-3 text-xs font-mono text-[#8f9099] bg-[#1a1c1c] border border-[#45464e]/30 rounded">
              <label className="flex items-center gap-2 cursor-pointer text-[#c5c6cf] hover:text-white select-none">
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  className="rounded border-[#45464e] bg-[#343535] text-[#6091C3] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold">Select all</span>
              </label>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => showToast('Syncing live B2B wholesale prices with OEM server...')}
                  className="hover:text-[#6091C3] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  <span>Refresh OEM prices</span>
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            {cartItems.length === 0 ? (
              <div className="p-12 text-center bg-[#1a1c1c] border border-[#45464e]/30 rounded-xl space-y-4">
                <span className="material-symbols-outlined text-5xl text-[#8f9099]">shopping_cart_off</span>
                <p className="text-base font-medium text-[#c5c6cf]">Your parts cart is currently empty</p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#6091C3] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow hover:brightness-110 transition-all font-['Montserrat']"
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
                    className="bg-[#1a1c1c] border border-[#45464e]/30 hover:border-[#6091C3]/60 rounded-xl p-4 transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <input 
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => toggleSelect(item.id)}
                        className="rounded border-[#45464e] bg-[#343535] text-[#6091C3] focus:ring-0 w-4 h-4 shrink-0 cursor-pointer"
                      />
                      <div className="w-18 h-18 bg-[#0d0e0f] rounded-lg border border-[#45464e]/30 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 bg-[#1e2020] text-[#6091C3] border border-[#6091C3]/30 rounded text-[10px] font-mono tracking-wider">
                            SKU: {item.sku}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm md:text-base text-white truncate font-['Montserrat']">
                          {item.name}
                        </h3>
                        <p className="font-mono text-xs text-[#8f9099] truncate">
                          {item.spec}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#45464e]/20 shrink-0">
                      {/* Qty Adjustment */}
                      <div className="flex items-center border border-[#45464e]/50 rounded bg-[#15203C]">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2.5 py-1 text-[#8f9099] hover:text-white transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-1 font-mono text-white font-semibold text-xs min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2.5 py-1 text-[#8f9099] hover:text-white transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Price & Margin */}
                      <div className="text-right min-w-[120px]">
                        <div className="font-mono font-bold text-white text-base">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </div>
                        <div className="font-mono text-[11px] text-[#6091C3] font-medium">
                          {item.margin} margin
                        </div>
                      </div>

                      {/* Remove */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-[#8f9099] hover:text-rose-400 transition-colors cursor-pointer rounded hover:bg-white/5" 
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
              <div className="flex items-center justify-between pt-4 border-t border-[#45464e]/20">
                <Link 
                  to="/inventory"
                  className="text-xs font-bold font-['Montserrat'] uppercase tracking-wider text-[#6091C3] hover:underline flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  <span>Add more parts from catalog</span>
                </Link>

                <button 
                  onClick={clearCart}
                  className="text-xs font-mono text-[#8f9099] hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Clear cart
                </button>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: B2B Order Summary, Margin Intelligence & Checkout Authorization (4 cols) */}
          <div className="xl:col-span-4 space-y-4">
            <div className="bg-[#1a1c1c] border border-[#45464e]/40 rounded-xl p-5 shadow-2xl sticky top-20 space-y-5">
              
              <div className="flex items-center justify-between border-b border-[#45464e]/30 pb-3">
                <h2 className="text-lg font-bold font-['Montserrat'] text-white">Summary</h2>
                <span className="font-mono text-xs text-[#8f9099] bg-[#1e2020] px-2 py-0.5 rounded border border-[#45464e]/30">
                  Tier 1 B2B Pricing
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-[#c5c6cf]">
                  <span>Subtotal ({selectedItems.length} items)</span>
                  <span className="text-white font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-[#c5c6cf]">
                  <span>B2B Discount (8%)</span>
                  <span className="text-emerald-400 font-semibold">-{formatCurrency(b2bDiscount)}</span>
                </div>
                <div className="flex justify-between items-center text-[#c5c6cf]">
                  <span>Estimated Shipping</span>
                  <span className="text-white font-semibold">{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between items-center text-[#c5c6cf]">
                  <span>Taxes & Customs</span>
                  <span className="text-white font-semibold">$0.00</span>
                </div>
                
                <div className="border-t border-[#45464e]/30 pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-bold font-['Montserrat'] text-white uppercase tracking-wider">
                    Total Cost
                  </span>
                  <span className="text-xl font-bold font-mono text-[#6091C3]">
                    {formatCurrency(totalCost)}
                  </span>
                </div>
              </div>

              {/* Margin Intelligence ROI Card */}
              <div className="p-3.5 bg-[#15203C] rounded-lg border border-[#6091c3]/30 flex items-center justify-between font-mono">
                <div>
                  <span className="text-[#8f9099] block text-[10px] uppercase font-bold">ESTIMATED CLIENT PROFIT</span>
                  <span className="text-[#6091C3] font-bold text-sm font-['Montserrat']">+{formatCurrency(estimatedProfit)}</span>
                </div>
                <span className="text-xs bg-[#6091c3]/20 text-[#6091C3] px-2.5 py-1 rounded font-bold border border-[#6091c3]/30">
                  +30.3% ROI
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button 
                  onClick={handleAuthorizePO}
                  disabled={selectedItems.length === 0}
                  className="w-full py-3.5 px-4 rounded-lg bg-[#6091C3] hover:brightness-110 disabled:opacity-50 text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-98 shadow-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">lock</span>
                  <span>Authorize & Dispatch PO</span>
                </button>

                <button 
                  onClick={() => {
                    navigate('/shop')
                  }}
                  className="w-full py-2.5 text-center text-xs font-mono text-[#8f9099] hover:text-[#6091C3] transition-colors flex items-center justify-center gap-1.5 cursor-pointer hover:bg-white/5 rounded"
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
