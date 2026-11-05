import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { carApi } from '../services/api'
import { useTheme } from '../contexts/ThemeContext'
import HeroShowcaseSection from '../components/home/HeroShowcaseSection'
import FeaturedFleetSection, { CAR_IMAGE_MAP } from '../components/home/FeaturedFleetSection'
import CustomizationShowcaseSection, { CUSTOMIZATION_CATEGORIES } from '../components/home/CustomizationShowcaseSection'
import EcosystemWorkflowSection from '../components/home/EcosystemWorkflowSection'
import SharedFooter from '../components/common/SharedFooter'

export { CAR_IMAGE_MAP, CUSTOMIZATION_CATEGORIES }

/**
 * HomePage - Virtual Tune Landing Experience & Engineering Ecosystem.
 * Clean modular composition coordinating live vehicle fleet, customizer domains,
 * workshop workflow, and platform CTAs.
 */
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
      <HeroShowcaseSection onLaunchConfigurator={handleLaunchConfigurator} />

      {/* ── SECTION 2: FEATURED VEHICLES CATALOG (REAL API DATA) ───────────── */}
      <FeaturedFleetSection
        cars={cars}
        loadingCars={loadingCars}
        carError={carError}
        onLaunchConfigurator={handleLaunchConfigurator}
      />

      {/* ── SECTION 3: CUSTOMIZATION SHOWCASE (PARTS & DOMAINS) ─────────────── */}
      <CustomizationShowcaseSection />

      {/* ── SECTION 4 & 5: WORKFLOW & VALUE ECOSYSTEM ───────────────────────── */}
      <EcosystemWorkflowSection />

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
      <SharedFooter />
    </div>
  )
}
