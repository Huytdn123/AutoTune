import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { carApi } from '../services/api'
import { useTheme } from '../contexts/ThemeContext'

// High-resolution real automotive imagery mapped directly to verified car models
const CAR_IMAGE_MAP = {
  'ferrari-458': '/images/cars/ferrari-458.webp',
  'porsche-gt3': '/images/cars/porsche-911-carrera.webp',
  'lamborghini-aventador': '/images/cars/lamborghini-aventador.webp',
  'bmw-m4-csl': '/images/cars/bmw-connecteddrive.webp',
  'mclaren-720s': '/images/cars/mclaren-720s.webp'
}

// 4 Verified Mechanical Domains with real database parts & specifications
const CUSTOMIZATION_CATEGORIES = [
  {
    id: 'wheels',
    title: 'Forged Monoblock & Modular Wheels',
    subtitle: 'Track-Tuned Lightweight Rims',
    desc: 'BBS FI-R Titanium, Volk Racing TE37 Ultra M-Spec, WORK VS-XX. Drastically lowers unsprung rotational mass for razor-sharp steering feedback.',
    image: '/images/bbs-fi-r-wheel.jpg',
    specs: ['PCD 5x114.3 / 5x130 Bolt Patterns', 'Aerospace 6061-T6 Forged Aluminum', 'Unsprung Mass Reduction up to -18.4%'],
    actionLabel: 'Browse Wheels in Store',
    link: '/shop'
  },
  {
    id: 'aero',
    title: 'Pre-Preg Carbon Fiber Aerodynamics',
    subtitle: 'Wind-Tunnel Tested Downforce',
    desc: 'Carbon GT Wings, front splitter extensions, and rear diffusers. Balances aerodynamic drag with real downforce under high-speed cornering.',
    image: '/images/carbon-aero-package.jpg',
    specs: ['Autoclaved Pre-preg 3K Carbon Fiber', 'Adds up to +140 kg Downforce @ 200 km/h', 'Computational Fluid Dynamics Verified'],
    actionLabel: 'Explore Aero Packages',
    link: '/shop'
  },
  {
    id: 'brakes',
    title: 'Competition Big Brake Systems',
    subtitle: 'Monobloc Calipers & 380mm Rotors',
    desc: 'Brembo GT-S 6-piston monobloc radial calipers paired with 2-piece slotted discs. Rigorously checked for inner-wheel barrel and spoke clearance.',
    image: '/images/brembo-gt-brake-kit.jpg',
    specs: ['Radial Monobloc 6-Piston Architecture', '800°C Thermal Fade Resistance', 'Dynamic Caliper-to-Spoke Sweep Checked'],
    actionLabel: 'Inspect Brake Kits',
    link: '/shop'
  },
  {
    id: 'suspension',
    title: 'Track Suspension & Titanium Exhaust',
    subtitle: '3-Way Adjustable Coilovers & Pipes',
    desc: 'KW V4 Clubsport 3-way adjustable dampers with Akrapovič Evolution titanium exhaust systems for maximum mechanical grip and acoustic excellence.',
    image: '/images/kw-v4-clubsport.jpg',
    specs: ['Independent High/Low Speed Bump & Rebound', 'Lowers Ride Height 20mm to 45mm', 'Ultra-Lightweight Titanium Acoustic Valving'],
    actionLabel: 'View Coilovers & Exhaust',
    link: '/shop'
  }
]

export default function HomePage() {
  const navigate = useNavigate()
  const { isDark } = useTheme()

  const [cars, setCars] = useState([])
  const [loadingCars, setLoadingCars] = useState(true)
  const [carError, setCarError] = useState(null)

  // Fetch real vehicles directly from backend database
  useEffect(() => {
    let isMounted = true
    setLoadingCars(true)
    setCarError(null)

    carApi.getAll()
      .then(res => {
        if (!isMounted) return
        const list = Array.isArray(res) ? res : []
        setCars(list)
      })
      .catch(err => {
        if (!isMounted) return
        console.error('Failed to load cars for HomePage:', err)
        setCarError('Unable to load vehicle catalog from server. Please retry.')
      })
      .finally(() => {
        if (isMounted) setLoadingCars(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Cinematic scroll reveal using browser native IntersectionObserver
  useEffect(() => {
    // Graceful fallback for SSR or environments without IntersectionObserver
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        el.classList.add('is-revealed')
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.08
      }
    )

    const elements = document.querySelectorAll('.reveal-on-scroll')
    elements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [loadingCars, cars])

  const handleLaunchConfigurator = (carSlug) => {
    if (carSlug) {
      navigate(`/configurator?model=${carSlug}`)
    } else {
      navigate('/configurator')
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F5FA] dark:bg-[#0B0C10] text-[#111827] dark:text-[#F8FAFC] flex flex-col font-['Inter',sans-serif] selection:bg-[#0213B2] selection:text-white transition-colors duration-200">
      
      {/* ── SECTION 1: CINEMATIC AUTOMOTIVE HERO ─────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-[#D8DFEA] dark:border-[#282A3A] bg-gradient-to-b from-[#E8EDFF]/70 via-[#F3F5FA] to-[#F3F5FA] dark:from-[#121833]/60 dark:via-[#0B0C10] dark:to-[#0B0C10]">
        
        {/* Subtle engineering background mesh */}
        <div className="absolute inset-0 blueprint-grid opacity-20 dark:opacity-10 pointer-events-none"></div>
        <div className="absolute -top-32 right-0 w-[550px] h-[550px] bg-[#0213B2]/10 dark:bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Core Value Proposition & Actionable CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start z-10">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#14151D] border border-[#CBD5E1] dark:border-[#282A3A] shadow-xs mb-6 animate-hero-pill" data-preserve-white="true">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse"></span>
              <span className="text-xs font-['Montserrat'] font-bold text-[#0213B2] dark:text-[#60A5FA] uppercase tracking-wider">
                Virtual Tune 3D Studio & Workshop Network
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-['Montserrat'] text-3xl sm:text-4xl lg:text-5xl font-black text-[#111827] dark:text-white tracking-tight leading-[1.15] mb-6 animate-hero-title">
              Precision 3D Customization. <br className="hidden sm:inline" />
              <span className="text-[#0213B2] dark:text-[#60A5FA]">Directly Connected</span> to Garages.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#475569] dark:text-[#CBD5E1] leading-relaxed max-w-xl mb-8 animate-hero-desc">
              Visualize your bespoke sports car in interactive 3D: customize body paint finishes, forged wheels, and carbon aerodynamics with zero-clearance fitment verification before sending direct work orders to certified workshops.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10 animate-hero-cta">
              <button
                id="hero-launch-configurator-btn"
                onClick={() => handleLaunchConfigurator()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[#0213B2] hover:bg-[#0115BC] active:bg-[#06169B] text-white font-['Montserrat'] font-bold text-sm tracking-wider uppercase transition-all duration-150 shadow-lg shadow-[#0213B2]/25 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">view_in_ar</span>
                <span>Launch 3D Studio</span>
              </button>

              <Link
                to="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white dark:bg-[#14151D] hover:bg-slate-50 dark:hover:bg-[#1B1D28] border-2 border-[#CBD5E1] dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] text-[#111827] dark:text-white font-['Montserrat'] font-bold text-sm tracking-wider uppercase transition-all duration-150 active:scale-95 shadow-xs cursor-pointer"
                data-preserve-white="true"
              >
                <span className="material-symbols-outlined text-lg text-[#0213B2] dark:text-[#60A5FA]">storefront</span>
                <span>Browse Performance Parts</span>
              </Link>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#D8DFEA] dark:border-[#282A3A] w-full text-left animate-hero-stats">
              <div>
                <p className="text-xs font-mono font-bold uppercase text-[#0213B2] dark:text-[#60A5FA]">Real-Time</p>
                <p className="text-xs sm:text-sm font-semibold text-[#111827] dark:text-white mt-0.5">3D Canvas 360°</p>
              </div>
              <div>
                <p className="text-xs font-mono font-bold uppercase text-[#0213B2] dark:text-[#60A5FA]">Sub-Millimeter</p>
                <p className="text-xs sm:text-sm font-semibold text-[#111827] dark:text-white mt-0.5">Fitment Engine</p>
              </div>
              <div>
                <p className="text-xs font-mono font-bold uppercase text-[#0213B2] dark:text-[#60A5FA]">100% Transparent</p>
                <p className="text-xs sm:text-sm font-semibold text-[#111827] dark:text-white mt-0.5">Automated Quotes</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-6 relative animate-hero-visual">
            <div className="relative rounded-2xl overflow-hidden border border-[#CBD5E1] dark:border-[#282A3A] bg-white dark:bg-[#14151D] shadow-2xl p-2.5 transition-all group" data-preserve-white="true">
              
              {/* Studio Window Bar */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#E2E8F0] dark:border-[#282A3A] bg-[#F8FAFC] dark:bg-[#1A1D28] rounded-t-xl mb-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                  <span className="ml-2 font-bold text-[#0213B2] dark:text-[#60A5FA]">VirtualTune_Studio_3D</span>
                </div>
                <div className="flex items-center gap-2 text-[#64748B] dark:text-[#94A3B8]">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                  <span>Interactive Engine Ready</span>
                </div>
              </div>

              {/* Main Cinematic Visual */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 group">
                <img
                  src="/images/cars/ferrari-458.webp"
                  alt="Virtual Tune Ferrari 458 Italia High-Performance Supercar in 3D Showroom"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />

                {/* Ambient vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>

                {/* Floating Interactive Badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <div className="bg-slate-900/85 backdrop-blur-md border border-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-mono">
                    <span className="text-[#60A5FA] font-bold">Ferrari 458 Italia</span> · Rosso Corsa · BBS FI-R 20"
                  </div>
                  <div className="hidden sm:inline-flex bg-[#0213B2]/90 backdrop-blur-md border border-white/25 text-white px-3 py-1.5 rounded-xl text-xs font-['Montserrat'] font-bold uppercase tracking-wider">
                    Ready for Staging
                  </div>
                </div>
              </div>

              {/* Quick Launch Bottom Bar */}
              <div className="p-3 flex items-center justify-between text-xs text-[#475569] dark:text-[#94A3B8]">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#0213B2] dark:text-[#60A5FA]">check_circle</span>
                  <span>Full 360° orbit, custom paint matching, aero wings, and caliper clearances</span>
                </span>
                <button
                  onClick={() => handleLaunchConfigurator()}
                  className="text-xs font-['Montserrat'] font-bold text-[#0213B2] dark:text-[#60A5FA] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Full Studio</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 2: FEATURED VEHICLES CATALOG (REAL API DATA) ───────────── */}
      <section className="py-20 border-b border-[#D8DFEA] dark:border-[#282A3A] bg-[#FFFFFF] dark:bg-[#10121A]" id="featured-fleet" data-preserve-white="true">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 reveal-on-scroll">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EDFF] dark:bg-[#1E254A] border border-[#0213B2]/30 dark:border-[#384580] mb-3">
                <span className="text-xs font-mono font-bold uppercase text-[#0213B2] dark:text-[#60A5FA]">Verified Database Fleet</span>
              </div>
              <h2 className="font-['Montserrat'] text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] dark:text-white uppercase tracking-tight">
                Production Supercars Ready for 3D Customization
              </h2>
              <p className="text-sm sm:text-base text-[#475569] dark:text-[#CBD5E1] mt-2 max-w-2xl">
                Select any vehicle below to launch directly into the 3D studio with authentic factory telemetry, curb weight, and hub bolt patterns.
              </p>
            </div>

            <Link
              to="/configurator"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-['Montserrat'] font-bold text-[#0213B2] dark:text-[#60A5FA] hover:text-[#0115BC] dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap self-start md:self-end"
            >
              <span>Explore All in 3D Studio</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>

          {/* Loading State */}
          {loadingCars && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(n => (
                <div key={n} className="rounded-2xl border border-[#E2E8F0] dark:border-[#282A3A] bg-[#F8FAFC] dark:bg-[#14151D] p-5 space-y-4 animate-pulse">
                  <div className="w-full aspect-[16/10] bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                  <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loadingCars && carError && (
            <div className="rounded-2xl border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/20 p-8 text-center max-w-xl mx-auto space-y-4">
              <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-4xl">cloud_off</span>
              <p className="text-sm text-red-800 dark:text-red-300 font-medium">{carError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider hover:bg-red-700 cursor-pointer"
              >
                Retry Connection
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loadingCars && !carError && cars.length === 0 && (
            <div className="rounded-2xl border border-[#CBD5E1] dark:border-[#282A3A] bg-white dark:bg-[#14151D] p-10 text-center max-w-md mx-auto space-y-3" data-preserve-white="true">
              <span className="material-symbols-outlined text-4xl text-[#64748B]">directions_car</span>
              <h3 className="font-['Montserrat'] text-base font-bold text-[#111827] dark:text-white">No Vehicles Found</h3>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">Please check that the backend server is running and retry.</p>
            </div>
          )}

          {/* Loaded Cars Grid */}
          {!loadingCars && !carError && cars.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car, index) => {
                const carImage = CAR_IMAGE_MAP[car.slug] || CAR_IMAGE_MAP[car.id] || '/images/cars/ferrari-458.webp'
                const hp = car.horsepower || car.specs?.performance?.find(p => p.label?.toLowerCase().includes('power'))?.value || null
                const zeroToHundred = car.specs?.performance?.find(p => p.label?.includes('0–100') || p.label?.includes('0-100'))?.value || null
                const boltPattern = car.stockBoltPattern || null
                const staggerClass = `stagger-${(index % 3) + 1}`

                return (
                  <div
                    key={car.id || car.slug}
                    className={`group rounded-2xl border border-[#CBD5E1] dark:border-[#282A3A] bg-white dark:bg-[#14151D] hover:border-[#0213B2] dark:hover:border-[#60A5FA] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden reveal-on-scroll ${staggerClass}`}
                    data-preserve-white="true"
                  >
                    <div>
                      {/* Vehicle Image Viewport */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 border-b border-[#E2E8F0] dark:border-[#282A3A]">
                        <img
                          src={carImage}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-mono text-[11px] font-bold border border-white/20">
                          {car.brand?.toUpperCase()}
                        </div>
                        {car.year && (
                          <div className="absolute top-3 right-3 bg-white/90 dark:bg-[#14151D]/90 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-mono font-semibold text-[#111827] dark:text-white border border-[#CBD5E1] dark:border-[#282A3A]">
                            {car.year}
                          </div>
                        )}
                      </div>

                      {/* Content & Specs */}
                      <div className="p-6">
                        <div className="flex items-baseline justify-between mb-2">
                          <h3 className="font-['Montserrat'] text-lg font-black text-[#111827] dark:text-white tracking-tight">
                            {car.brand} {car.model}
                          </h3>
                        </div>

                        {car.tagline && (
                          <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-medium mb-4 line-clamp-1">
                            {car.tagline}
                          </p>
                        )}

                        {/* Verified Technical Badges */}
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E2E8F0] dark:border-[#282A3A] text-xs font-mono">
                          {hp && (
                            <div className="bg-[#F8FAFC] dark:bg-[#1B1D28] p-2 rounded-lg border border-[#E2E8F0] dark:border-[#282A3A]">
                              <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] block">Horsepower</span>
                              <span className="font-bold text-[#111827] dark:text-white">{typeof hp === 'number' ? `${hp} HP` : hp}</span>
                            </div>
                          )}

                          {zeroToHundred && (
                            <div className="bg-[#F8FAFC] dark:bg-[#1B1D28] p-2 rounded-lg border border-[#E2E8F0] dark:border-[#282A3A]">
                              <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] block">0–100 km/h</span>
                              <span className="font-bold text-[#0213B2] dark:text-[#60A5FA]">{zeroToHundred}</span>
                            </div>
                          )}

                          {boltPattern && (
                            <div className="bg-[#F8FAFC] dark:bg-[#1B1D28] p-2 rounded-lg border border-[#E2E8F0] dark:border-[#282A3A]">
                              <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] block">Bolt Pattern</span>
                              <span className="font-bold text-[#111827] dark:text-white">{boltPattern}</span>
                            </div>
                          )}

                          {car.curbWeightKg && (
                            <div className="bg-[#F8FAFC] dark:bg-[#1B1D28] p-2 rounded-lg border border-[#E2E8F0] dark:border-[#282A3A]">
                              <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] block">Curb Weight</span>
                              <span className="font-bold text-[#111827] dark:text-white">{car.curbWeightKg} kg</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="p-6 pt-0">
                      <button
                        onClick={() => handleLaunchConfigurator(car.slug || car.id)}
                        className="w-full py-3 px-4 rounded-xl bg-[#0213B2] hover:bg-[#0115BC] text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-150 shadow-sm cursor-pointer group-hover:shadow-md"
                      >
                        <span className="material-symbols-outlined text-base">tune</span>
                        <span>Customize in 3D</span>
                      </button>
                    </div>

                  </div>
                )
              })}
            </div>
          )}

        </div>
      </section>

      {/* ── SECTION 3: CUSTOMIZATION SHOWCASE (PARTS & DOMAINS) ─────────────── */}
      <section className="py-24 border-b border-[#D8DFEA] dark:border-[#282A3A] bg-[#F3F5FA] dark:bg-[#0B0C10]" id="customization">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          
          <div className="max-w-3xl mb-16 reveal-on-scroll">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EDFF] dark:bg-[#1E254A] border border-[#0213B2]/30 dark:border-[#384580] mb-3">
              <span className="text-xs font-mono font-bold uppercase text-[#0213B2] dark:text-[#60A5FA]">Precision Hardware</span>
            </div>
            <h2 className="font-['Montserrat'] text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] dark:text-white uppercase tracking-tight">
              4 Engineered Customization Domains
            </h2>
            <p className="text-sm sm:text-base text-[#475569] dark:text-[#CBD5E1] mt-2">
              Every aftermarket component in our catalog is mathematically cross-referenced against OEM laser scans to ensure perfect zero-clearance fitment upon shop floor arrival.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CUSTOMIZATION_CATEGORIES.map((cat, index) => (
              <div
                key={cat.id}
                className={`rounded-2xl border border-[#CBD5E1] dark:border-[#282A3A] bg-white dark:bg-[#14151D] hover:border-[#0213B2] dark:hover:border-[#60A5FA] overflow-hidden flex flex-col sm:flex-row shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal-on-scroll stagger-${(index % 2) + 1}`}
                data-preserve-white="true"
              >
                {/* Part Image Frame */}
                <div className="w-full sm:w-5/12 aspect-square sm:aspect-auto relative bg-slate-100 dark:bg-[#181A24] p-4 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-[#E2E8F0] dark:border-[#282A3A]">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="max-w-full max-h-48 sm:max-h-full object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Part Details & Specs */}
                <div className="w-full sm:w-7/12 p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase text-[#0213B2] dark:text-[#60A5FA]">
                      {cat.subtitle}
                    </span>
                    <h3 className="font-['Montserrat'] text-base sm:text-lg font-bold text-[#111827] dark:text-white mt-1 mb-2">
                      {cat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed mb-4">
                      {cat.desc}
                    </p>

                    <ul className="space-y-1.5 text-xs font-mono text-[#334155] dark:text-[#CBD5E1]">
                      {cat.specs.map((spec, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0213B2] dark:bg-[#60A5FA]"></span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#E2E8F0] dark:border-[#282A3A]">
                    <Link
                      to={cat.link}
                      className="inline-flex items-center gap-1.5 text-xs font-['Montserrat'] font-bold text-[#0213B2] dark:text-[#60A5FA] hover:text-[#0115BC] dark:hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <span>{cat.actionLabel}</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SECTION 4: PLATFORM WORKFLOW: HOW IT WORKS ──────────────────────── */}
      <section className="py-24 border-b border-[#D8DFEA] dark:border-[#282A3A] bg-[#FFFFFF] dark:bg-[#10121A]" id="how-it-works" data-preserve-white="true">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          
          <div className="text-center max-w-3xl mx-auto mb-16 reveal-on-scroll">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EDFF] dark:bg-[#1E254A] border border-[#0213B2]/30 dark:border-[#384580] mb-3">
              <span className="text-xs font-mono font-bold uppercase text-[#0213B2] dark:text-[#60A5FA]">Standardized Platform Architecture</span>
            </div>
            <h2 className="font-['Montserrat'] text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] dark:text-white uppercase tracking-tight">
              From Virtual Conception to Workshop Floor
            </h2>
            <p className="text-sm sm:text-base text-[#475569] dark:text-[#CBD5E1] mt-2">
              Virtual Tune bridges customer aspiration with engineering reality through a seamless three-stage operational workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="rounded-2xl border border-[#CBD5E1] dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] bg-[#F8FAFC] dark:bg-[#14151D] p-8 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative reveal-on-scroll stagger-1">
              <div className="w-12 h-12 rounded-xl bg-[#E8EDFF] dark:bg-[#1E254A] border border-[#0213B2]/30 dark:border-[#384580] text-[#0213B2] dark:text-[#60A5FA] flex items-center justify-center font-['Montserrat'] font-black text-lg mb-6">
                01
              </div>
              <div>
                <h3 className="font-['Montserrat'] text-lg font-bold text-[#111827] dark:text-white mb-2">
                  Interactive 3D Configuration
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
                  Select your base vehicle, rotate 360°, test bespoke color shades (Gloss, Satin, Metallic), and swap authentic forged wheels, spoilers, and aero kits.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] dark:border-[#282A3A] text-xs font-mono text-[#0213B2] dark:text-[#60A5FA] font-bold">
                Real-Time 360° Studio
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border-2 border-[#0213B2] dark:border-[#60A5FA] bg-[#F8FAFC] dark:bg-[#14151D] p-8 flex flex-col justify-between shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative reveal-on-scroll stagger-2">
              <div className="w-12 h-12 rounded-xl bg-[#0213B2] text-white flex items-center justify-center font-['Montserrat'] font-black text-lg mb-6 shadow-sm">
                02
              </div>
              <div>
                <h3 className="font-['Montserrat'] text-lg font-bold text-[#0213B2] dark:text-[#60A5FA] mb-2">
                  Mechanical Fitment Verification
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
                  The automated Fitment Engine cross-references axle clearances, brake caliper profiles, bolt circle diameters, and tire stance before ordering.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#0213B2]/20 dark:border-[#60A5FA]/20 text-xs font-mono text-[#0213B2] dark:text-[#60A5FA] font-bold">
                Zero Scrap & Clearance Checked
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-[#CBD5E1] dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] bg-[#F8FAFC] dark:bg-[#14151D] p-8 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative reveal-on-scroll stagger-3">
              <div className="w-12 h-12 rounded-xl bg-[#E8EDFF] dark:bg-[#1E254A] border border-[#0213B2]/30 dark:border-[#384580] text-[#0213B2] dark:text-[#60A5FA] flex items-center justify-center font-['Montserrat'] font-black text-lg mb-6">
                03
              </div>
              <div>
                <h3 className="font-['Montserrat'] text-lg font-bold text-[#111827] dark:text-white mb-2">
                  Transparent Quotes & Work Orders
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
                  Generate instant itemized bills of materials with transparent part pricing and installation labor, dispatching directly to partner garages for scheduling.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] dark:border-[#282A3A] text-xs font-mono text-[#0213B2] dark:text-[#60A5FA] font-bold">
                Direct Garage Work Orders
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 5: FOR CAR OWNERS & CERTIFIED GARAGES ──────────────────── */}
      <section className="py-24 border-b border-[#D8DFEA] dark:border-[#282A3A] bg-[#F3F5FA] dark:bg-[#0B0C10]" id="value-ecosystem">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          
          <div className="max-w-3xl mb-16 reveal-on-scroll">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EDFF] dark:bg-[#1E254A] border border-[#0213B2]/30 dark:border-[#384580] mb-3">
              <span className="text-xs font-mono font-bold uppercase text-[#0213B2] dark:text-[#60A5FA]">Two-Sided Platform Value</span>
            </div>
            <h2 className="font-['Montserrat'] text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] dark:text-white uppercase tracking-tight">
              Engineered for Drivers & Tuning Workshops
            </h2>
            <p className="text-sm sm:text-base text-[#475569] dark:text-[#CBD5E1] mt-2">
              Virtual Tune bridges customer vision with engineering execution, eliminating miscommunication and delivering build perfection.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Card 1: For Car Owners */}
            <div className="rounded-2xl border border-[#CBD5E1] dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] bg-white dark:bg-[#14151D] p-8 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between reveal-on-scroll stagger-1" data-preserve-white="true">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#E8EDFF] dark:bg-[#1E254A] text-[#0213B2] dark:text-[#60A5FA] flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">person</span>
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold uppercase text-[#0213B2] dark:text-[#60A5FA]">For Car Enthusiasts</span>
                    <h3 className="font-['Montserrat'] text-xl font-bold text-[#111827] dark:text-white">Drivers & Car Owners</h3>
                  </div>
                </div>

                <ul className="space-y-4 text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1]">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#16A34A] text-lg mt-0.5">check_circle</span>
                    <span><strong>Visual Peace of Mind:</strong> See exactly how your performance build looks under studio lighting before committing substantial funds.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#16A34A] text-lg mt-0.5">check_circle</span>
                    <span><strong>Zero Compatibility Guesswork:</strong> Avoid buying incompatible parts that rub fenders or hit oversized multi-piston calipers.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#16A34A] text-lg mt-0.5">check_circle</span>
                    <span><strong>Transparent Cost Breakdown:</strong> Receive instant itemized BOM quotations for parts and certified bay installation labor.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#16A34A] text-lg mt-0.5">check_circle</span>
                    <span><strong>Digital Vehicle Passport:</strong> Access your verified modification history and QR digital warranty certificates anytime.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E2E8F0] dark:border-[#282A3A]">
                <Link
                  to="/configurator"
                  className="w-full py-3 px-4 rounded-xl bg-[#0213B2] hover:bg-[#0115BC] text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">tune</span>
                  <span>Start Customizing Your Supercar</span>
                </Link>
              </div>
            </div>

            {/* Card 2: For Garages */}
            <div className="rounded-2xl border border-[#CBD5E1] dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] bg-white dark:bg-[#14151D] p-8 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between reveal-on-scroll stagger-2" data-preserve-white="true">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#E8EDFF] dark:bg-[#1E254A] text-[#0213B2] dark:text-[#60A5FA] flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">precision_manufacturing</span>
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold uppercase text-[#0213B2] dark:text-[#60A5FA]">For Certified Partners</span>
                    <h3 className="font-['Montserrat'] text-xl font-bold text-[#111827] dark:text-white">Tuning Garages & Workshops</h3>
                  </div>
                </div>

                <ul className="space-y-4 text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1]">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-lg mt-0.5">check_circle</span>
                    <span><strong>Higher Sales Conversions:</strong> Leverage the Showroom Sales consultation mode to visually present builds and close client packages faster.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-lg mt-0.5">check_circle</span>
                    <span><strong>Eliminate Bay Downtime:</strong> Verify clearance specifications before parts arrive, preventing cars from sitting idle on service lifts.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-lg mt-0.5">check_circle</span>
                    <span><strong>Professional Bay Operations:</strong> Assign lead technicians, manage bay numbers, track build stages, and monitor wholesale inventory.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-lg mt-0.5">check_circle</span>
                    <span><strong>One-Click Commercial Invoicing:</strong> Generate formal quotations with configurable shop margins and printable work order documentation.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E2E8F0] dark:border-[#282A3A]">
                <Link
                  to="/sales"
                  className="w-full py-3 px-4 rounded-xl bg-white dark:bg-[#1E254A] hover:bg-slate-50 dark:hover:bg-[#23348C] border-2 border-[#CBD5E1] dark:border-[#384580] hover:border-[#0213B2] dark:hover:border-[#60A5FA] text-[#0213B2] dark:text-[#60A5FA] font-['Montserrat'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  data-preserve-white="true"
                >
                  <span className="material-symbols-outlined text-sm">tablet_mac</span>
                  <span>Explore Showroom Sales Mode</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 6: CLOSING CONVERSION BANNER ────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-[#0213B2] to-[#0115BC] text-white relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-15 pointer-events-none"></div>
        <div className="absolute -bottom-24 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 reveal-on-scroll">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#93C5FD]">Precision Engineering</span>
            <h2 className="font-['Montserrat'] text-2xl sm:text-3xl lg:text-4xl font-black uppercase mt-1 leading-tight">
              Ready to Modernize Your Customization Experience?
            </h2>
            <p className="text-sm sm:text-base text-blue-100 mt-2 font-normal leading-relaxed">
              Experience real-time 3D vehicle styling with sub-millimeter mechanical accuracy, backed by our certified tuning workshop network.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              to="/configurator"
              className="px-7 py-4 rounded-xl bg-white hover:bg-blue-50 text-[#0213B2] font-['Montserrat'] font-bold text-xs tracking-wider uppercase transition-all duration-150 shadow-xl active:scale-95 cursor-pointer"
            >
              Launch 3D Configurator
            </Link>
            <Link
              to="/shop"
              className="px-7 py-4 rounded-xl bg-transparent hover:bg-white/10 border-2 border-white text-white font-['Montserrat'] font-bold text-xs tracking-wider uppercase transition-all duration-150 active:scale-95 cursor-pointer"
            >
              Browse Parts Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: COMPREHENSIVE FOOTER ─────────────────────────────────── */}
      <footer className="bg-[#E5E8F0] dark:bg-[#08090D] border-t border-[#D8DFEA] dark:border-[#282A3A] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0213B2] text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-lg">tune</span>
                </div>
                <span className="font-['Montserrat'] text-lg font-black text-[#111827] dark:text-white uppercase tracking-tight">
                  Virtual Tune
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-sm">
                Next-generation 3D vehicle customization platform and certified workshop operational network. Real-time visual staging, fitment validation, and automated margin quoting.
              </p>
              <div className="flex items-center gap-2 pt-2 text-xs font-mono text-[#16A34A]">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                <span>System Operational · 3D Engine Active</span>
              </div>
            </div>

            {/* Navigation Group 1 */}
            <div>
              <p className="text-xs font-['Montserrat'] font-bold uppercase tracking-wider text-[#111827] dark:text-white mb-4">
                3D & Studio
              </p>
              <ul className="space-y-2.5 text-xs text-[#475569] dark:text-[#CBD5E1]">
                <li><Link to="/configurator" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">3D CAD Configurator</Link></li>
                <li><Link to="/sales" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Showroom Sales</Link></li>
                <li><Link to="/account" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Saved Build Gallery</Link></li>
              </ul>
            </div>

            {/* Navigation Group 2 */}
            <div>
              <p className="text-xs font-['Montserrat'] font-bold uppercase tracking-wider text-[#111827] dark:text-white mb-4">
                Engineering & Depot
              </p>
              <ul className="space-y-2.5 text-xs text-[#475569] dark:text-[#CBD5E1]">
                <li><Link to="/fitment" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Fitment Check</Link></li>
                <li><Link to="/shop" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Performance Store</Link></li>
                <li><Link to="/inventory" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Warehouse Inventory</Link></li>
                <li><Link to="/knowledge" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Technical Knowledge Hub</Link></li>
              </ul>
            </div>

            {/* Navigation Group 3 */}
            <div>
              <p className="text-xs font-['Montserrat'] font-bold uppercase tracking-wider text-[#111827] dark:text-white mb-4">
                Operations & Warranty
              </p>
              <ul className="space-y-2.5 text-xs text-[#475569] dark:text-[#CBD5E1]">
                <li><Link to="/quotation" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Quotes & Margin</Link></li>
                <li><Link to="/warranty" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Digital Warranty QR</Link></li>
                <li><Link to="/dashboard" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Garage Dashboard</Link></li>
                <li><Link to="/profile" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Workshop Profile</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[#D8DFEA] dark:border-[#282A3A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B] dark:text-[#94A3B8]">
            <p>© 2026 Virtual Tune Automotive Precision Systems. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-[#0213B2] dark:hover:text-white transition-colors cursor-pointer">Terms of Service</span>
              <span className="hover:text-[#0213B2] dark:hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-[#0213B2] dark:hover:text-white transition-colors cursor-pointer">Engineering Compliance</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  )
}
