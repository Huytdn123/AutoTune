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

const SKU_IMAGE_MAP = {
  'BBS-FIR-992-TITAN': '/images/bbs-fi-r-wheel.jpg',
  'RAYS-TE37-ULTRA-20': '/images/rays-te37-ultra.jpg',
  'WORK-VSXX-19-F458': '/images/work-vs-xx-wheel.jpg',
  'GEN-GTWING-F458': '/images/carbon-gt-wing.jpg',
  'CARB-AERO-F458': '/images/carbon-aero-package.jpg',
  'AKR-EVO-TITAN-992': '/images/akrapovic-evolution-line.jpg',
  'KW-35271842-V4CS': '/images/kw-v4-clubsport.jpg',
  'BRM-1N1.9042A2': '/images/brembo-gt-brake-kit.jpg',
  'VOR-CF-AERO-992': '/images/vorsteiner-carbon-aero.jpg'
}

export default function PartsStorePage({ defaultTab }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, role, setLoginModalOpen } = useAuth()
  const isGarageStaff = currentUser && ['GARAGE_OWNER', 'LEAD_TECHNICIAN', 'ADMIN'].includes(role)

  const determineActiveTab = () => {
    if (!isGarageStaff) return 'store'
    if (defaultTab === 'inventory') return 'inventory'
    if (location.pathname === '/inventory') return 'inventory'
    if (location.search.includes('inventory')) return 'inventory'
    return 'store'
  }

  const [activeTab, setActiveTab] = useState(determineActiveTab)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState(null)
  const [cartCount, setCartCount] = useState(4)
  const [viewItem, setViewItem] = useState(null)
  const [partsList, setPartsList] = useState([])
  const [loadingParts, setLoadingParts] = useState(true)
  const [partsError, setPartsError] = useState(null)

  const fetchParts = () => {
    setLoadingParts(true)
    setPartsError(null)
    partApi.getAll().then(res => {
      if (Array.isArray(res) && res.length > 0) {
        setPartsList(res.map(p => ({
          id: p.partId || p.id,
          name: p.partName || p.name,
          brand: p.brand,
          category: (p.category || '').toLowerCase().includes('wheel') ? 'wheels'
                  : (p.category || '').toLowerCase().includes('exhaust') ? 'exhaust'
                  : (p.category || '').toLowerCase().includes('brake') ? 'brakes'
                  : (p.category || '').toLowerCase().includes('shock') || (p.category || '').toLowerCase().includes('suspension') ? 'suspension'
                  : (p.category || '').toLowerCase().includes('aero') ? 'aero' : (p.category || 'all').toLowerCase(),
          sku: p.sku,
          priceVnd: p.priceVnd || p.price,
          priceUsd: p.priceUsd || Math.round((p.priceVnd || 0) / 25000),
          spec: p.specifications || p.spec,
          compatible: p.compatibleVehicles || p.compatible || 'Universal Supercar Fitment',
          stock: p.stockQuantity ?? p.stock ?? 0,
          rating: p.rating ? Number(p.rating) : 4.9,
          badge: p.badge || 'HOT / BESTSELLER',
          image: SKU_IMAGE_MAP[p.sku] || p.imageUrl || p.image || '/images/bbs-fi-r-wheel.jpg'
        })))
      } else {
        setPartsError('No parts found in the backend database.')
      }
    }).catch(err => {
      console.error('Backend parts fetch failed:', err)
      setPartsError('Unable to connect to the backend parts catalog (/api/parts). Please try again.')
    }).finally(() => {
      setLoadingParts(false)
    })
  }

  useEffect(() => {
    fetchParts()
  }, [])

  useEffect(() => {
    if (!isGarageStaff) {
      setActiveTab('store')
      return
    }
    if (location.pathname === '/inventory' || defaultTab === 'inventory' || location.search.includes('inventory')) {
      setActiveTab('inventory')
    } else if (location.pathname === '/shop' && !location.search.includes('inventory')) {
      setActiveTab('store')
    }
  }, [location.pathname, location.search, defaultTab, isGarageStaff])

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

  const filteredItems = partsList.filter(item => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (item.compatible && item.compatible.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchCategory && matchSearch
  })

  const formatVnd = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F3F5FA] dark:bg-[#0B0C10] text-[#111827] dark:text-[#F8FAFC] font-['Inter',sans-serif] min-h-[calc(100vh-64px)] transition-colors duration-200">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#0213B2] border border-white/20 text-white text-xs font-['Montserrat'] font-bold rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="material-symbols-outlined text-base text-white">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* STORE HERO BANNER */}
      <section className="relative py-8 md:py-10 px-6 lg:px-12 border-b border-slate-200 dark:border-[#282A3A] bg-gradient-to-r from-[#E8EDFF] via-[#EEF2FF] to-[#D7E1FF] dark:from-[#121833] dark:via-[#14151D] dark:to-[#0B0C10] overflow-hidden">
        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0213B2]/10 dark:bg-[#0213B2]/30 border border-[#0213B2]/30 text-[#0213B2] dark:text-[#60A5FA] text-[10px] font-mono font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0213B2] dark:bg-[#60A5FA] animate-pulse" />
              {activeTab === 'inventory' ? 'OFFICIAL B2B WAREHOUSE DEPOT' : 'OFFICIAL B2B PERFORMANCE STORE'}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] dark:text-[#F8FAFC] font-['Montserrat'] tracking-tight">
              {activeTab === 'inventory' ? 'Warehouse Inventory & Procurement' : 'High-Performance Parts & Tuning Store'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeTab === 'inventory' 
                ? 'Live OEM stock tracking, inventory valuation, depot compliance, and supplier replenishment.'
                : 'Explore authentic OEM and aftermarket upgrades (BBS, Akrapovič, KW, Brembo, Rays, Vorsteiner). Verified CAD fitment matrix and seamless 3D Configurator staging.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            {/* Unified Mode Toggle: STRICTLY HIDDEN from guests and regular car owners */}
            {isGarageStaff && (
              <div className="flex items-center p-1 rounded-xl bg-white/80 dark:bg-[#1B1D28] border border-slate-200 dark:border-[#282A3A] shadow-xs backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('store')
                    navigate('/shop')
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-['Montserrat'] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'store'
                      ? 'bg-[#0213B2] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-[#0213B2] dark:hover:text-[#60A5FA] hover:bg-slate-100 dark:hover:bg-[#262938]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">storefront</span>
                  <span>Storefront</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('inventory')
                    navigate('/inventory')
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-['Montserrat'] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'inventory'
                      ? 'bg-[#16A34A] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-[#16A34A] dark:hover:text-[#4ADE80] hover:bg-slate-100 dark:hover:bg-[#262938]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">inventory_2</span>
                  <span>Warehouse Inventory</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                if (!currentUser) {
                  setLoginModalOpen(true)
                } else {
                  navigate('/cart')
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0213B2] hover:bg-[#0115BC] active:bg-[#06169B] text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#0213B2]/20 hover:shadow-lg active:scale-98 cursor-pointer"
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
          <InventoryProcurementPage isEmbedded={true} />
        </div>
      ) : (
        <>
          {/* FILTER & SEARCH TOOLBAR */}
          <section className="sticky top-16 z-30 bg-white/90 dark:bg-[#0B0C10]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#282A3A] px-6 lg:px-12 py-3.5 shadow-xs transition-colors duration-200">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
              {/* Categories Tab */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                {STORE_CATEGORIES.map(cat => {
                  const active = selectedCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer font-['Montserrat'] ${
                        active
                          ? 'bg-[#0213B2] text-white shadow-sm ring-2 ring-[#0213B2]/20'
                          : 'bg-white dark:bg-[#14151D] text-slate-700 dark:text-slate-300 hover:border-[#0213B2] dark:hover:border-[#60A5FA] hover:text-[#0213B2] dark:hover:text-[#60A5FA] border border-slate-200 dark:border-[#282A3A]'
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
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-base">search</span>
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by part name, brand, SKU..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] text-xs text-[#111827] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:border-[#0213B2] dark:focus:border-[#60A5FA] focus:ring-2 focus:ring-[#0213B2]/20 transition-all shadow-xs"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

            </div>
          </section>

          {/* PRODUCTS GRID */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-8">
            
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200 dark:border-[#282A3A]">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-bold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC] tracking-tight">
                  VERIFIED PERFORMANCE CATALOG
                </span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#0213B2]/10 dark:bg-[#0213B2]/30 text-[#0213B2] dark:text-[#60A5FA] border border-[#0213B2]/20">
                  {filteredItems.length} PRODUCTS
                </span>
              </div>

              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#16A34A]">verified</span>
                24-MONTH OFFICIAL WARRANTY • TÜV HOMOLOGATED & COMPLIANT
              </span>
            </div>

            {loadingParts ? (
              <div className="py-24 text-center flex flex-col items-center justify-center space-y-4 bg-white dark:bg-[#14151D] rounded-2xl border border-slate-200 dark:border-[#282A3A] shadow-xs">
                <div className="w-12 h-12 rounded-full border-4 border-[#0213B2]/20 border-t-[#0213B2] animate-spin" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC] font-['Montserrat']">Loading Parts Catalog</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Synchronizing verified parts inventory...</p>
              </div>
            ) : partsError && partsList.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-white dark:bg-[#14151D] rounded-2xl border border-red-200 dark:border-red-900/40 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600 dark:text-red-400 mx-auto">
                  <span className="material-symbols-outlined text-2xl">cloud_off</span>
                </div>
                <h3 className="text-sm font-bold text-[#111827] dark:text-[#F8FAFC] uppercase tracking-wider font-['Montserrat']">Parts Catalog Connection Error</h3>
                <p className="text-xs text-red-600 dark:text-red-400 max-w-md mx-auto">{partsError}</p>
                <button
                  onClick={fetchParts}
                  className="px-5 py-2.5 rounded-xl bg-[#0213B2] hover:bg-[#0115BC] text-white text-xs font-bold font-['Montserrat'] uppercase tracking-wider transition-all shadow-md shadow-[#0213B2]/20"
                >
                  Retry Connection
                </button>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="py-20 text-center space-y-3 bg-white dark:bg-[#14151D] rounded-2xl border border-slate-200 dark:border-[#282A3A] shadow-xs">
                <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">search_off</span>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">No performance components match "{searchQuery}"</p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all') }}
                  className="text-xs text-[#0213B2] dark:text-[#60A5FA] hover:underline font-mono cursor-pointer"
                >
                  Reset search & filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <div 
                    key={item.id}
                    data-preserve-white="true"
                    className="group bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] hover:border-[#0213B2]/50 dark:hover:border-[#60A5FA]/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-xs hover:shadow-xl"
                  >
                    {/* Product Image & Badges */}
                    <div className="relative aspect-[16/10] bg-slate-50 dark:bg-[#181A24] border-b border-slate-100 dark:border-[#282A3A] overflow-hidden flex items-center justify-center p-4">
                      <div className="w-full h-full bg-white dark:bg-[#10121A] rounded-xl p-3 flex items-center justify-center shadow-xs border border-slate-100 dark:border-transparent" data-preserve-white="true">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
                        <span className="px-2.5 py-1 rounded-md text-[9px] font-mono font-bold bg-[#0213B2] text-white shadow-sm tracking-wide">
                          {item.badge}
                        </span>
                        <span className="px-2.5 py-1 rounded-md text-[9px] font-mono font-bold bg-slate-900/80 text-white backdrop-blur-sm border border-slate-700/60 shadow-xs tracking-wide">
                          {item.brand}
                        </span>
                      </div>

                      {/* Stock Status */}
                      <div className="absolute bottom-2.5 left-3 z-10 pointer-events-none">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          In Stock: {item.stock} sets
                        </span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          SKU: <strong className="text-[#111827] dark:text-[#F8FAFC]">{item.sku}</strong>
                        </div>
                        <h3 
                          className="font-bold text-base text-[#111827] dark:text-[#F8FAFC] font-['Montserrat'] line-clamp-2 leading-snug group-hover:text-[#0213B2] dark:group-hover:text-[#60A5FA] transition-colors"
                          title={item.name}
                        >
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {item.spec}
                        </p>
                        <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                          <span className="material-symbols-outlined text-sm text-[#0213B2] dark:text-[#60A5FA]">directions_car</span>
                          <span className="truncate">{item.compatible}</span>
                        </div>
                      </div>

                      {/* Pricing & CTA */}
                      <div className="pt-4 border-t border-slate-100 dark:border-[#282A3A] flex items-center justify-between gap-3">
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">B2B Workshop Price</div>
                          <div className="text-base font-extrabold text-[#0213B2] dark:text-[#60A5FA] font-mono">
                            ${item.priceUsd.toLocaleString()} USD
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            ({formatVnd(item.priceVnd)})
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setViewItem(item)}
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#1B1D28] hover:bg-[#EEF2FF] dark:hover:bg-[#262938] border border-slate-200 dark:border-[#282A3A] text-slate-600 dark:text-slate-300 hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-all cursor-pointer"
                            title="View Technical Specifications"
                          >
                            <span className="material-symbols-outlined text-base">info</span>
                          </button>

                          <button
                            onClick={() => handleAddToCart(item)}
                            className={`px-4 py-2.5 rounded-xl font-['Montserrat'] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                              currentUser
                                ? 'bg-[#0213B2] hover:bg-[#0115BC] active:bg-[#06169B] active:scale-95 text-white shadow-md shadow-[#0213B2]/20'
                                : 'bg-slate-100 dark:bg-[#1B1D28] hover:bg-[#EEF2FF] dark:hover:bg-[#262938] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#282A3A]'
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="relative w-full max-w-lg rounded-2xl p-6 space-y-5 bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] shadow-2xl" data-preserve-white="true">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#0213B2] dark:text-[#60A5FA] uppercase tracking-wider">
                      DETAILED TECHNICAL SPECIFICATIONS
                    </span>
                    <h3 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC] font-['Montserrat'] mt-0.5" title={viewItem.name}>
                      {viewItem.name}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setViewItem(null)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#282A3A] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>

                <div className="w-full h-52 bg-slate-50 dark:bg-[#10121A] rounded-xl border border-slate-200 dark:border-[#282A3A] p-4 flex items-center justify-center overflow-hidden">
                  <img 
                    src={viewItem.image} 
                    alt={viewItem.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-2 text-xs font-mono bg-slate-50 dark:bg-[#1B1D28] p-4 rounded-xl border border-slate-200 dark:border-[#282A3A]">
                  <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-[#282A3A]">
                    <span className="text-slate-500 dark:text-slate-400">Brand / Manufacturer:</span>
                    <span className="text-[#111827] dark:text-[#F8FAFC] font-bold">{viewItem.brand}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-[#282A3A]">
                    <span className="text-slate-500 dark:text-slate-400">SKU Code:</span>
                    <span className="text-[#0213B2] dark:text-[#60A5FA] font-bold">{viewItem.sku}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-[#282A3A]">
                    <span className="text-slate-500 dark:text-slate-400">Vehicle Fitment:</span>
                    <span className="text-[#111827] dark:text-[#F8FAFC]">{viewItem.compatible}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500 dark:text-slate-400">B2B Workshop Price:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">${viewItem.priceUsd.toLocaleString()} USD ({formatVnd(viewItem.priceVnd)})</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      handleAddToCart(viewItem)
                      if (currentUser) setViewItem(null)
                    }}
                    className={`flex-1 py-3 rounded-xl font-['Montserrat'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      currentUser
                        ? 'bg-[#0213B2] text-white hover:bg-[#0115BC] shadow-md shadow-[#0213B2]/20'
                        : 'bg-slate-100 dark:bg-[#1B1D28] hover:bg-[#EEF2FF] dark:hover:bg-[#262938] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#282A3A]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">{currentUser ? 'add_shopping_cart' : 'lock'}</span>
                    <span>{currentUser ? 'Add To Cart' : 'Sign In To Order'}</span>
                  </button>
                  <Link
                    to="/configurator"
                    className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-[#1B1D28] hover:bg-[#EEF2FF] dark:hover:bg-[#262938] border border-slate-200 dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] text-slate-700 dark:text-slate-200 hover:text-[#0213B2] dark:hover:text-[#60A5FA] font-['Montserrat'] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
                  >
                    <span className="material-symbols-outlined text-sm text-[#0213B2] dark:text-[#60A5FA]">view_in_ar</span>
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
