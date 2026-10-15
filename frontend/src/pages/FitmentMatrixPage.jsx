import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fitmentApi, carApi, partApi } from '../services/api'

/**
 * FitmentMatrixPage - Technical Fitment & Engineering Compliance Matrix
 * Fully connected to Spring Boot /api/fitment, /api/cars, /api/parts
 * Elevated with dark/light mode parity, high-contrast engineering gates, and CAD clearance feedback.
 */
export default function FitmentMatrixPage() {
  const navigate = useNavigate()
  const [cars, setCars] = useState([])
  const [parts, setParts] = useState([])
  const [overview, setOverview] = useState(null)
  const [selectedCar, setSelectedCar] = useState(null)
  const [selectedPart, setSelectedPart] = useState(null)
  const [checkResult, setCheckResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Load cars, parts, overview and run initial check
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, partsRes, overviewRes] = await Promise.allSettled([
          carApi.getAll(),
          partApi.getAll(),
          fitmentApi.getOverview()
        ])

        let activeCar = null
        let activePart = null

        if (carsRes.status === 'fulfilled' && carsRes.value) {
          const list = Array.isArray(carsRes.value) ? carsRes.value : (carsRes.value.data || [])
          setCars(list)
          if (list.length > 0) activeCar = list[0]
        }
        if (partsRes.status === 'fulfilled' && partsRes.value) {
          const list = Array.isArray(partsRes.value) ? partsRes.value : (partsRes.value.data || [])
          setParts(list)
          if (list.length > 0) activePart = list[0]
        }
        if (overviewRes.status === 'fulfilled' && overviewRes.value) {
          setOverview(overviewRes.value)
        }

        if (activeCar) setSelectedCar(activeCar)
        if (activePart) setSelectedPart(activePart)

        // Automatically run initial verification with live engine
        if (activeCar && activePart) {
          try {
            const initialResult = await fitmentApi.check({
              carId: activeCar.carId || activeCar.id,
              carSlug: activeCar.slug,
              partId: activePart.partId || activePart.id,
              partSku: activePart.sku
            })
            setCheckResult(initialResult)
          } catch (checkErr) {
            console.error('Initial fitment check error:', checkErr)
          }
        }
      } catch (err) {
        console.error('Fitment data error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const executeCheck = async (car, part) => {
    if (!car || !part) return
    setChecking(true)
    try {
      const res = await fitmentApi.check({
        carId: car.carId || car.id,
        carSlug: car.slug,
        partId: part.partId || part.id,
        partSku: part.sku
      })
      setCheckResult(res)
      if (res.status === 'PASS') {
        showToast(`Fitment Verified: ${part.partName} is COMPATIBLE with ${car.modelName || car.model}!`)
      } else if (res.status === 'WARNING') {
        showToast(`Advisory: ${part.partName} conditionally fits with technical notes.`)
      } else {
        showToast(`Incompatible: ${part.partName} does not fit ${car.modelName || car.model}.`)
      }
    } catch (err) {
      console.error('Fitment check error:', err)
      showToast('Error connecting to backend verification engine.')
    } finally {
      setChecking(false)
    }
  }

  const handleRunCheck = () => {
    executeCheck(selectedCar, selectedPart)
  }

  const handleCarChange = (carId) => {
    const found = cars.find(c => (c.carId || c.id) === Number(carId))
    if (found) {
      setSelectedCar(found)
      executeCheck(found, selectedPart)
    }
  }

  const handlePartChange = (partId) => {
    const found = parts.find(p => (p.partId || p.id) === Number(partId))
    if (found) {
      setSelectedPart(found)
      executeCheck(selectedCar, found)
    }
  }

  const getGateIcon = (gateId) => {
    switch (gateId) {
      case 1: return 'radio_button_checked'
      case 2: return 'disc_full'
      case 3: return 'height'
      case 4: return 'verified_user'
      default: return 'check_circle'
    }
  }

  const getGateStatusStyles = (status) => {
    if (status === 'PASS') {
      return {
        cardBorder: 'border-emerald-500/40 dark:border-emerald-500/30 hover:border-emerald-500',
        badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400',
        textValue: 'text-emerald-600 dark:text-emerald-400',
        iconColor: 'text-emerald-500',
        indicator: 'bg-emerald-500'
      }
    }
    if (status === 'WARNING') {
      return {
        cardBorder: 'border-amber-500/40 dark:border-amber-500/30 hover:border-amber-500',
        badgeBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400',
        textValue: 'text-amber-600 dark:text-amber-400',
        iconColor: 'text-amber-500',
        indicator: 'bg-amber-500'
      }
    }
    return {
      cardBorder: 'border-rose-500/40 dark:border-rose-500/30 hover:border-rose-500',
      badgeBg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400',
      textValue: 'text-rose-600 dark:text-rose-400',
      iconColor: 'text-rose-500',
      indicator: 'bg-rose-500'
    }
  }

  return (
    <div className="bg-[#F3F5FA] dark:bg-[#0B0C10] text-[#111827] dark:text-[#F8FAFC] min-h-[calc(100vh-4rem)] flex flex-col font-sans antialiased selection:bg-[#0213B2]/20 selection:text-[#0213B2] transition-colors duration-200">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#0213B2] border border-[#0213B2] text-white text-xs font-semibold rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-base text-white">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* INTERACTIVE CAR & COMPONENT SELECTOR TOOLBAR */}
        <section className="border-b border-slate-200 dark:border-[#282A3A] bg-white dark:bg-[#14151D] px-4 md:px-8 py-5 shadow-xs" data-preserve-white="true">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {/* Vehicle Select */}
              <div className="flex flex-col">
                <label className="text-[10px] font-mono text-[#0213B2] dark:text-[#60A5FA] uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">directions_car</span>
                  <span>1. Staged Chassis</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedCar?.carId || selectedCar?.id || ''}
                    onChange={(e) => handleCarChange(e.target.value)}
                    className="bg-[#F8FAFC] dark:bg-[#1A1C26] text-[#111827] dark:text-[#F8FAFC] border border-slate-300 dark:border-[#282A3A] rounded-xl px-3.5 py-2 text-xs font-semibold focus:border-[#0213B2] focus:ring-1 focus:ring-[#0213B2] focus:outline-none pr-8 cursor-pointer shadow-xs"
                  >
                    {cars.map(c => (
                      <option key={c.carId || c.id} value={c.carId || c.id} className="bg-white dark:bg-[#14151D] text-[#111827] dark:text-white">
                        {c.modelName || c.model} ({c.yearManufactured || c.year || '2024'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Component Select */}
              <div className="flex flex-col">
                <label className="text-[10px] font-mono text-[#0213B2] dark:text-[#60A5FA] uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">build</span>
                  <span>2. Upgrade Component</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedPart?.partId || selectedPart?.id || ''}
                    onChange={(e) => handlePartChange(e.target.value)}
                    className="bg-[#F8FAFC] dark:bg-[#1A1C26] text-[#111827] dark:text-[#F8FAFC] border border-slate-300 dark:border-[#282A3A] rounded-xl px-3.5 py-2 text-xs font-semibold focus:border-[#0213B2] focus:ring-1 focus:ring-[#0213B2] focus:outline-none pr-8 cursor-pointer shadow-xs max-w-xs truncate"
                  >
                    {parts.map(p => (
                      <option key={p.partId || p.id} value={p.partId || p.id} className="bg-white dark:bg-[#14151D] text-[#111827] dark:text-white">
                        {p.brand} - {p.partName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Engineering Database Metrics */}
              {overview && (
                <div className="hidden xl:flex items-center gap-3 pl-5 border-l border-slate-200 dark:border-[#282A3A] text-[11px] font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] dark:bg-[#1A1C26] border border-slate-200 dark:border-[#282A3A] text-[#111827] dark:text-[#F8FAFC]">
                    {overview.totalCars} Chassis
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#EEF2FF] dark:bg-[#1E293B] border border-[#0213B2]/20 dark:border-blue-900/40 text-[#0213B2] dark:text-[#60A5FA] font-semibold">
                    {overview.totalParts} Parts
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold">
                    {overview.accuracyRate} Verified
                  </span>
                </div>
              )}
            </div>

            {/* Actions Toolbar */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRunCheck}
                disabled={checking || !selectedCar || !selectedPart}
                className="px-5 py-2.5 bg-[#0213B2] hover:bg-[#0115BC] active:bg-[#06169B] disabled:opacity-50 text-white font-semibold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-md shadow-[#0213B2]/20 transition-all cursor-pointer"
              >
                {checking ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Evaluating Gates...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">fact_check</span>
                    <span>Verify Fitment Matrix</span>
                  </>
                )}
              </button>

              <Link
                to="/configurator"
                className="px-4 py-2.5 bg-[#F8FAFC] dark:bg-[#1A1C26] hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] border border-slate-300 dark:border-[#282A3A] hover:border-[#0213B2] text-[#111827] dark:text-[#F8FAFC] hover:text-[#0213B2] font-semibold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-base text-[#0213B2] dark:text-[#60A5FA]">view_in_ar</span>
                <span>Stage 3D CAD</span>
              </Link>
            </div>

          </div>
        </section>

        {/* Selected Vehicle & Part Active Status Banner */}
        <section className="border-b border-slate-200 dark:border-[#282A3A] bg-white dark:bg-[#14151D] px-4 md:px-8 py-4" data-preserve-white="true">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EEF2FF] to-[#D7E1FF] dark:from-[#1E293B] dark:to-[#0F172A] border border-[#0213B2]/20 dark:border-blue-900/40 flex items-center justify-center text-[#0213B2] dark:text-[#60A5FA] shadow-xs">
                <span className="material-symbols-outlined text-2xl">directions_car</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-base md:text-lg font-bold text-[#111827] dark:text-[#F8FAFC] tracking-tight">
                    {selectedCar?.modelName || selectedCar?.model || 'Porsche 911 Carrera (991)'}
                  </h1>
                  <span className="px-2 py-0.5 rounded-md bg-[#EEF2FF] dark:bg-[#1E293B] border border-[#0213B2]/20 dark:border-blue-900/40 text-[#0213B2] dark:text-[#60A5FA] font-mono font-bold text-[10px]">
                    {selectedCar?.stockBoltPattern || '5x112'} • ET{selectedCar?.stockOffsetEt || '35'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[#64748B] dark:text-[#94A3B8] text-xs font-mono mt-0.5 flex-wrap">
                  <span>VIN: <strong className="text-[#111827] dark:text-[#F8FAFC]">VT-CHASSIS-{selectedCar?.carId || '01'}</strong></span>
                  <span>•</span>
                  <span>Target Component: <strong className="text-[#0213B2] dark:text-[#60A5FA]">{selectedPart?.partName || 'Selected Part'}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {checkResult ? (
                <span className={`inline-flex items-center gap-2 text-xs font-mono px-3.5 py-1.5 rounded-xl font-bold border shadow-xs ${
                  checkResult.status === 'PASS' 
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                    : checkResult.status === 'WARNING'
                    ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                    : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
                }`}>
                  <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                    checkResult.status === 'PASS' ? 'bg-emerald-500' : checkResult.status === 'WARNING' ? 'bg-amber-500' : 'bg-rose-500'
                  }`} />
                  {checkResult.status === 'PASS' 
                    ? 'CAD FITMENT: 100% CLEARANCE PASS' 
                    : checkResult.status === 'WARNING' 
                    ? 'CAD FITMENT: ADVISORY WARNING' 
                    : 'CAD FITMENT: INCOMPATIBLE INTERFERENCE'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#64748B] dark:text-[#94A3B8] bg-[#F8FAFC] dark:bg-[#1A1C26] border border-slate-300 dark:border-[#282A3A] px-3 py-1.5 rounded-xl font-bold">
                  AWAITING VERIFICATION
                </span>
              )}
            </div>
          </div>
        </section>

        {/* 4 CRITICAL FITMENT GATES */}
        <section className="px-4 md:px-8 py-6 max-w-7xl mx-auto w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {checkResult?.checks && checkResult.checks.length > 0 ? (
              checkResult.checks.map((gate) => {
                const styles = getGateStatusStyles(gate.status)
                return (
                  <div 
                    key={gate.gateId} 
                    className={`bg-white dark:bg-[#14151D] border ${styles.cardBorder} rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md`}
                    data-preserve-white="true"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] uppercase font-bold tracking-wider">
                          Gate 0{gate.gateId} • {gate.gateName}
                        </span>
                        <span className={`material-symbols-outlined ${styles.iconColor} text-lg`}>
                          {getGateIcon(gate.gateId)}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-sm text-[#111827] dark:text-[#F8FAFC] mb-1.5">
                        {gate.value}
                      </h3>
                      <p className="font-sans text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                        {gate.message}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#282A3A] flex justify-between items-center text-xs">
                      <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8]">Tolerance Spec:</span>
                      <span className={`px-2 py-0.5 rounded-md ${styles.badgeBg} font-mono text-[10px] font-bold border`}>
                        {gate.status} ({gate.tolerance || 'OEM Spec'})
                      </span>
                    </div>
                  </div>
                )
              })
            ) : (
              // Default Gates Loading Placeholder
              [1, 2, 3, 4].map(id => (
                <div key={id} className="bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] rounded-2xl p-5 animate-pulse shadow-sm" data-preserve-white="true">
                  <div className="h-4 bg-slate-200 dark:bg-[#1E293B] rounded w-1/2 mb-3" />
                  <div className="h-6 bg-slate-200 dark:bg-[#1E293B] rounded w-3/4 mb-2" />
                  <div className="h-10 bg-slate-100 dark:bg-[#1A1C26] rounded w-full" />
                </div>
              ))
            )}

          </div>

          {/* Active Verification Results Package */}
          <div className="bg-white dark:bg-[#14151D] rounded-2xl border border-slate-200 dark:border-[#282A3A] p-6 space-y-5 shadow-sm" data-preserve-white="true">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#282A3A]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] dark:bg-[#1E293B] text-[#0213B2] dark:text-[#60A5FA] flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">analytics</span>
                </div>
                <h2 className="font-display font-bold text-base text-[#111827] dark:text-[#F8FAFC]">
                  Technical Fitment Analysis Package
                </h2>
              </div>
              <span className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5 bg-[#F8FAFC] dark:bg-[#1A1C26] px-3 py-1 rounded-lg border border-slate-200 dark:border-[#282A3A]">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Direct CAD Verification</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Spec Breakdown */}
              <div className="space-y-3 text-xs font-mono bg-[#F8FAFC] dark:bg-[#1A1C26] p-5 rounded-xl border border-slate-200 dark:border-[#282A3A]">
                <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-[#282A3A]">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">Vehicle Profile:</span>
                  <span className="text-[#111827] dark:text-[#F8FAFC] font-bold">{selectedCar?.modelName || selectedCar?.model || 'Supercar Chassis'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-[#282A3A]">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">Component SKU:</span>
                  <span className="text-[#0213B2] dark:text-[#60A5FA] font-bold">{selectedPart?.sku || 'VT-PART'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-[#282A3A]">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">Overall Compatibility:</span>
                  <span className={`font-bold ${
                    checkResult?.status === 'PASS' ? 'text-emerald-600 dark:text-emerald-400' : checkResult?.status === 'WARNING' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {checkResult ? `${checkResult.status} (${checkResult.compatible ? 'Direct Bolt-On Feasible' : 'Blocked Interference'})` : 'PENDING'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">Standard Homologation:</span>
                  <span className="text-[#111827] dark:text-[#F8FAFC]">{checkResult?.regulation || 'Engineering Fitment Verification (PCD • Offset • Clearance)'}</span>
                </div>

                {checkResult?.reasons && checkResult.reasons.length > 0 && (
                  <div className="pt-2.5 border-t border-slate-200 dark:border-[#282A3A]">
                    <span className="text-[#64748B] dark:text-[#94A3B8] block mb-1">Engineering Notes:</span>
                    <ul className="list-disc list-inside space-y-1 text-amber-600 dark:text-amber-400">
                      {checkResult.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Column: Next Steps & Direct Commercial Actions */}
              <div className="flex flex-col justify-between space-y-4 bg-[#EEF2FF] dark:bg-[#14151D] p-5 rounded-xl border border-[#0213B2]/20 dark:border-[#282A3A]">
                <div className="space-y-1.5">
                  <p className="text-xs font-display font-bold text-[#0213B2] dark:text-[#60A5FA] uppercase tracking-wider">
                    Recommended Workshop Actions:
                  </p>
                  <p className="text-xs text-[#334155] dark:text-[#94A3B8] leading-relaxed">
                    {checkResult?.status === 'PASS' && (
                      'This specification is verified for commercial quotation and workshop dispatch. Direct bolt-on fitment with zero arch rolling or spigot adapters required.'
                    )}
                    {checkResult?.status === 'WARNING' && (
                      'This setup is conditionally feasible for installation. Verify spigot hub rings or heavy bump fender clearance during bay dry-fitting.'
                    )}
                    {checkResult?.status === 'FAIL' && (
                      'Installation blocked by mechanical interference. Do not proceed to commercial quotation without conversion spacers or alternative component specs.'
                    )}
                    {!checkResult && (
                      'Select vehicle and upgrade component above, then click "Verify Fitment Matrix" to evaluate tolerances.'
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-3 pt-3">
                  <Link
                    to="/quotation"
                    className={`flex-1 py-2.5 px-4 text-white font-semibold text-xs uppercase tracking-wider rounded-xl text-center shadow-sm transition-all ${
                      checkResult?.status === 'FAIL' 
                        ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed pointer-events-none' 
                        : 'bg-[#0213B2] hover:bg-[#0115BC]'
                    }`}
                  >
                    Proceed to Quotation
                  </Link>
                  {checkResult?.status === 'FAIL' ? (
                    <button
                      disabled
                      title="Cannot add to cart: Mechanical interference detected (FAIL)"
                      className="py-2.5 px-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-semibold text-xs uppercase tracking-wider rounded-xl text-center cursor-not-allowed flex items-center justify-center gap-1 opacity-70"
                    >
                      <span className="material-symbols-outlined text-sm">block</span>
                      Add to Cart Blocked
                    </button>
                  ) : (
                    <Link
                      to="/cart"
                      className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wider rounded-xl text-center flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                      Add to Cart
                    </Link>
                  )}
                </div>
              </div>
            </div>

          </div>

        </section>

      </main>

    </div>
  )
}
