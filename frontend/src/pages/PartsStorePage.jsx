import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { partApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import InventoryProcurementPage from './InventoryProcurementPage'

const STORE_CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: 'apps' },
  { id: 'wheels', label: 'Wheels & Rims', icon: 'adjust' },
  { id: 'exhaust', label: 'Exhaust Systems', icon: 'mode_fan' },
  { id: 'brakes', label: 'Brake Systems', icon: 'album' },
  { id: 'suspension', label: 'Coilovers & Shocks', icon: 'height' },
  { id: 'aero', label: 'Carbon Aero Kits', icon: 'speed' }
]

const CURATED_PARTS = [
  {
    id: 1,
    name: 'BBS FI-R Forged Monoblock Wheel Set 20"/21"',
    brand: 'BBS Germany',
    category: 'wheels',
    sku: 'BBS-FIR-992-TITAN',
    priceVnd: 215000000,
    priceUsd: 8600,
    spec: 'Ultra-lightweight aerospace forged aluminum • PCD 5x112 / ET35 • 7.8 kg/wheel',
    compatible: 'Porsche 911 GT3 (992), BMW M3/M4 (G80/G82)',
    stock: 8,
    rating: 4.9,
    badge: 'HOT / BESTSELLER',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsdY7AkDaD-730M6oc9RX4EfMoKg7AVPrqnQ0pi0pa09fTRPi8YSnpLnR7M3LyLw6O144lf3wSbuLmZHYw7nkoorXQIdhw_sL3wj7v1eH_OHzSSvwbDcjzbVyhQoHwx1B-ahqOZW1tiaRqnkhF0R7xn3VJ6jXeGhzyDVUXT4nx5M4RTJulhLin53pWLSXptIYcZ5yZ2UyCOGn5ywhztN2OKX_cgN8i0Y-cw2c3VK599d2TRs4iciY9'
  },
  {
    id: 2,
    name: 'Volk Racing TE37 Ultra M-Spec Forged 20"',
    brand: 'Rays Japan',
    category: 'wheels',
    sku: 'RAYS-TE37-ULTRA-20',
    priceVnd: 185000000,
    priceUsd: 7400,
    spec: 'Motorsport-grade forged monoblock • PCD 5x114.3 • Bronze Anodized finish',
    compatible: 'Ferrari 458, Nissan GT-R R35, Honda Civic Type R',
    stock: 6,
    rating: 5.0,
    badge: 'TRACK LEGEND',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=600'
  },
  {
    id: 3,
    name: 'Akrapovič Evolution Line Titanium Exhaust System',
    brand: 'Akrapovič',
    category: 'exhaust',
    sku: 'AKR-EVO-TITAN-992',
    priceVnd: 185000000,
    priceUsd: 7400,
    spec: 'Full Titanium construction • Bluetooth active flap control • -11.4 kg weight savings',
    compatible: 'Porsche 992 GT3 / GT3 RS, Carrera S',
    stock: 3,
    rating: 4.95,
    badge: 'SIGNATURE SOUND',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ47eXVMCWcObYU3ZZdBeLsUTGhO_fkICz9lX3xbi-wLgK86SdSvbNaV0yDxuTj49cuIu5EDLUnAp6kGTXJ2g5IQVlDtICek-6s4CxsdZouTQ0A8ZRGVRXCFNowhI0jn3cN6qf3dfcj8ZNSt-V4-bvwlWzzfR0Rg1-vMM0nllJOjP9svw7EZ1gQP9B_-3nNRJsuUzrtnATawlS4MU5zYSSSBVsIm8AZQqduE1GS_p3eRsC_eYF44za'
  },
  {
    id: 4,
    name: 'KW Suspensions V4 Clubsport 3-Way Coilover Kit',
    brand: 'KW Automotive',
    category: 'suspension',
    sku: 'KW-35271842-V4CS',
    priceVnd: 123000000,
    priceUsd: 4920,
    spec: '16-click rebound & independent high/low speed compression • Uniball camber plates',
    compatible: 'BMW M3 G80, M4 G82, Porsche 911 (992)',
    stock: 4,
    rating: 4.88,
    badge: 'NÜRBURGRING SPEC',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARRBsKuWRBzkECezJu5ItEIUGaMb96LgTdd2Vq2UVzjieHukjvsSoOPcj6JReoE06pUz1XuHEyI13O25_TPh5mBqjXw6rxdLRKMzZBTgr1K8i4wbbcYMGwWrCm7E_6IdSK4Ii_YGcnxm8fUquO2fdhbwE2kaegGkAMINyMkxxkRDaoEH7zMSR6mhZ0-3vy37uyN3fQ7EEJXeGIu6NErHaYp0Y7MT4KZQuzB7ELa0FUcMIj6zA5Wgva'
  },
  {
    id: 5,
    name: 'Brembo GT-S 6-Piston Big Brake Kit 380x34mm',
    brand: 'Brembo Racing',
    category: 'brakes',
    sku: 'BRM-1N1.9042A2',
    priceVnd: 96250000,
    priceUsd: 3850,
    spec: 'Radial monoblock caliper • 2-piece Type 3 slotted disc • 800°C thermal endurance',
    compatible: 'Universal PCD 5x112 / 5x114.3 / 5x120',
    stock: 5,
    rating: 4.92,
    badge: 'TÜV COMPLIANT',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSNTBW0tas2QMTVD3RS0cdRlmYn4dvL_b955aloixkhxxuWGDQWx9m2SdYZGG3wBDs8-sE1wx7OhpQw-09QXMByElGuGXb8Jel_sEM4Ep3e77HBvnLSfujyNvyDK7k0-rX9j3MvOVoUmtsk2k_tIL9-iKJ14Tz4BVJIeCvXQV6PG8CKC-gTtcqs1BJW42tXYxQJyZQ70TfBL1IH9qdwoYN8qQRtLyEOdgxHHq0x3mxxAnF90G3bqWv'
  },
  {
    id: 6,
    name: 'Vorsteiner Aero Carbon Wing & Rear Diffuser Package',
    brand: 'Vorsteiner USA',
    category: 'aero',
    sku: 'VOR-CF-AERO-992',
    priceVnd: 145000000,
    priceUsd: 5800,
    spec: 'Pre-preg 2x2 weave vacuum autoclave carbon • Aerodynamic downforce profile',
    compatible: 'Porsche 911 GT3 / Turbo S, BMW M4 G82',
    stock: 2,
    rating: 4.98,
    badge: 'PRE-PREG CARBON',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600'
  }
]

export default function PartsStorePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, setLoginModalOpen } = useAuth()
  const [activeTab, setActiveTab] = useState(location.search.includes('inventory') ? 'inventory' : 'store')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState(null)
  const [cartCount, setCartCount] = useState(4)
  const [viewItem, setViewItem] = useState(null)

  useEffect(() => {
    if (location.search.includes('inventory')) {
      setActiveTab('inventory')
    }
  }, [location.search])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleAddToCart = (item) => {
    if (!currentUser) {
      setLoginModalOpen(true)
      showToast('Please sign in to add items to cart and place orders!')
      return
    }
    setCartCount(prev => prev + 1)
    showToast(`Added "${item.name}" to Parts Cart!`)
  }

  const filteredItems = CURATED_PARTS.filter(item => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.compatible.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  const formatVnd = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0d131f] text-[#e3e8f5] font-['Inter',sans-serif] min-h-[calc(100vh-64px)] select-none">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#1f2f57] border border-[#6091c3] text-[#dae2ff] text-xs font-['Montserrat'] font-bold rounded-lg shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="material-symbols-outlined text-base text-[#6091c3]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* STORE HERO BANNER */}
      <section 
        className="relative py-10 px-6 lg:px-12 border-b border-[#45464e]/30 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #162447 0%, #1f2f57 50%, #0d131f 100%)',
        }}
      >
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'radial-gradient(rgba(96,145,195,0.6) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#6091c3]/15 border border-[#6091c3]/30 text-[#6091c3] text-[10px] font-mono font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6091c3] animate-pulse" />
              OFFICIAL B2B PERFORMANCE STORE
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-['Montserrat'] tracking-tight">
              High-Performance Parts & Tuning Store
            </h1>
            <p className="text-xs sm:text-sm text-[#c8d4ea] leading-relaxed">
              Explore authentic OEM and aftermarket upgrades (BBS, Akrapovič, KW, Brembo, Rays, Vorsteiner). Verified CAD fitment matrix and seamless 3D Configurator staging.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            {/* Unified Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-[#0d131f]/90 border border-white/15 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab('store')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-['Montserrat'] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'store'
                    ? 'bg-[#6091c3] text-white shadow-md'
                    : 'text-[#c8d4ea] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">storefront</span>
                <span>Storefront</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    setLoginModalOpen(true)
                    showToast('Sign in required to access Warehouse Inventory & Stock!')
                    return
                  }
                  setActiveTab('inventory')
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-['Montserrat'] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'inventory'
                    ? 'bg-[#10b981] text-white shadow-md'
                    : 'text-[#c8d4ea] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">inventory_2</span>
                <span>Warehouse Inventory</span>
                {!currentUser && <span className="material-symbols-outlined text-xs text-amber-400">lock</span>}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!currentUser) {
                  setLoginModalOpen(true)
                } else {
                  navigate('/cart')
                }
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#6091c3] hover:brightness-110 text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">{currentUser ? 'shopping_cart' : 'lock'}</span>
              <span>{currentUser ? `CART (${cartCount})` : 'CART'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* RENDER INVENTORY TAB OR STOREFRONT */}
      {activeTab === 'inventory' ? (
        <div className="flex-1 flex flex-col">
          <InventoryProcurementPage />
        </div>
      ) : (
        <>
          {/* FILTER & SEARCH TOOLBAR */}
          <section className="sticky top-16 z-30 bg-[#162447]/95 backdrop-blur-md border-b border-[#45464e]/30 px-6 lg:px-12 py-3.5">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Categories Tab */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {STORE_CATEGORIES.map(cat => {
              const active = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer font-['Montserrat'] ${
                    active
                      ? 'bg-[#6091c3] text-white shadow-md'
                      : 'bg-white/5 text-[#c8d4ea] hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80 shrink-0">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#8f9099] text-base">search</span>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by part name, brand, SKU or vehicle..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0d131f] border border-[#45464e]/40 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#6091c3] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-[#8f9099] hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

        </div>
      </section>

      {/* PRODUCTS GRID */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-8">
        
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#45464e]/20">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-['Montserrat'] text-white">
              VERIFIED PERFORMANCE CATALOG
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#1f2f57] text-[#6091c3] border border-[#6091c3]/30">
              {filteredItems.length} PRODUCTS
            </span>
          </div>

          <span className="text-[11px] font-mono text-[#8f9099] hidden sm:block">
            24-MONTH OFFICIAL WARRANTY • TÜV HOMOLOGATED & COMPLIANT
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-[#162447]/40 rounded-2xl border border-white/10">
            <span className="material-symbols-outlined text-5xl text-[#8f9099]">search_off</span>
            <p className="text-sm text-[#c8d4ea]">No performance components match "{searchQuery}"</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('all') }}
              className="text-xs text-[#6091c3] hover:underline font-mono"
            >
              Reset search & filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div 
                key={item.id}
                className="group rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
                style={{
                  backgroundColor: '#162447',
                  border: '1.5px solid rgba(96,145,195,0.25)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
              >
                {/* Product Image & Badges */}
                <div className="relative aspect-video bg-[#0d131f] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#162447] via-transparent to-transparent opacity-80" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#6091c3] text-white shadow">
                      {item.badge}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-black/60 text-white/90 backdrop-blur-sm border border-white/10">
                      {item.brand}
                    </span>
                  </div>

                  {/* Stock Status */}
                  <div className="absolute bottom-2.5 left-3">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      In Stock: {item.stock} sets
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono text-[#8f9099]">
                      SKU: <strong className="text-white/80">{item.sku}</strong>
                    </div>
                    <h3 className="font-bold text-base text-white font-['Montserrat'] line-clamp-1 group-hover:text-[#6091c3] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#c8d4ea] line-clamp-2">
                      {item.spec}
                    </p>
                    <div className="pt-2 text-[11px] text-[#8f9099] flex items-center gap-1 font-mono">
                      <span className="material-symbols-outlined text-xs text-[#6091c3]">directions_car</span>
                      <span className="truncate">{item.compatible}</span>
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-mono text-[#8f9099] uppercase">B2B Price</div>
                      <div className="text-base font-extrabold text-[#6091c3] font-mono">
                        ${item.priceUsd.toLocaleString()} USD
                      </div>
                      <div className="text-[10px] font-mono text-white/50">
                        ({formatVnd(item.priceVnd)})
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setViewItem(item)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                        title="View Technical Specifications"
                      >
                        <span className="material-symbols-outlined text-base">info</span>
                      </button>

                      <button
                        onClick={() => handleAddToCart(item)}
                        className={`px-3.5 py-2 rounded-lg font-['Montserrat'] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                          currentUser
                            ? 'bg-[#6091c3] hover:brightness-110 active:scale-95 text-white'
                            : 'bg-white/10 hover:bg-white/20 text-[#dae2ff] border border-white/15'
                        }`}
                        title={currentUser ? 'Add item to cart' : 'Sign in required to add items to cart'}
                      >
                        <span className="material-symbols-outlined text-sm">{currentUser ? 'add_shopping_cart' : 'lock'}</span>
                        <span>{currentUser ? 'ADD TO CART' : 'SIGN IN TO BUY'}</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      {/* QUICK VIEW TECHNICAL MODAL */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl"
            style={{
              backgroundColor: '#162447',
              border: '1.5px solid #6091C3',
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#6091c3] uppercase tracking-wider">
                  DETAILED TECHNICAL SPECIFICATIONS
                </span>
                <h3 className="text-lg font-bold text-white font-['Montserrat'] mt-0.5">
                  {viewItem.name}
                </h3>
              </div>
              <button 
                onClick={() => setViewItem(null)}
                className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <img 
              src={viewItem.image} 
              alt={viewItem.name}
              className="w-full h-48 object-cover rounded-xl border border-white/10"
            />

            <div className="space-y-2 text-xs font-mono bg-[#0d131f] p-3.5 rounded-xl border border-white/10">
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-white/60">Brand / Manufacturer:</span>
                <span className="text-white font-bold">{viewItem.brand}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-white/60">SKU Code:</span>
                <span className="text-[#6091c3] font-bold">{viewItem.sku}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-white/60">Vehicle Fitment:</span>
                <span className="text-white">{viewItem.compatible}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white/60">B2B Workshop Price:</span>
                <span className="text-emerald-400 font-bold">${viewItem.priceUsd.toLocaleString()} USD ({formatVnd(viewItem.priceVnd)})</span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => {
                  handleAddToCart(viewItem)
                  if (currentUser) setViewItem(null)
                }}
                className={`flex-1 py-2.5 rounded-lg font-['Montserrat'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  currentUser
                    ? 'bg-[#6091c3] text-white hover:brightness-110 shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-[#dae2ff] border border-white/20'
                }`}
              >
                <span className="material-symbols-outlined text-base">{currentUser ? 'add_shopping_cart' : 'lock'}</span>
                <span>{currentUser ? 'Add To Cart' : 'Sign In To Order'}</span>
              </button>
              <Link
                to="/configurator"
                className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">view_in_ar</span>
                <span>Stage in 3D</span>
              </Link>
            </div>
          </div>
        </div>
      )}
        </>
      )}

    </div>
  )
}
