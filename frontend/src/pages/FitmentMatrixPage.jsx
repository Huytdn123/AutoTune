import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fitmentApi, carApi, partApi } from '../services/api'

/**
 * FitmentMatrixPage - Technical Fitment & Legal Compliance Matrix
 * Fully connected to Spring Boot /api/fitment, /api/cars, /api/parts
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
        cardBorder: 'border-[#16A34A]/30 hover:border-[#16A34A]',
        badgeBg: 'bg-[#DCFCE7] border-[#16A34A]/40 text-[#16A34A]',
        textValue: 'text-[#16A34A]',
        iconColor: 'text-[#16A34A]'
      }
    }
    if (status === 'WARNING') {
      return {
        cardBorder: 'border-[#D97706]/30 hover:border-[#D97706]',
        badgeBg: 'bg-[#FEF3C7] border-[#D97706]/40 text-[#D97706]',
        textValue: 'text-[#D97706]',
        iconColor: 'text-[#D97706]'
      }
    }
    return {
      cardBorder: 'border-[#DC2626]/30 hover:border-[#DC2626]',
      badgeBg: 'bg-[#FEE2E2] border-[#DC2626]/40 text-[#DC2626]',
      textValue: 'text-[#DC2626]',
      iconColor: 'text-[#DC2626]'
    }
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

      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* INTERACTIVE CAR & COMPONENT SELECTOR TOOLBAR */}
        <section className="border-b border-[#BCC7D8] bg-[#E8EDFF] px-6 py-4 shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Vehicle Select */}
              <div className="flex flex-col">
                <label className="text-[10px] font-mono text-[#06169B] uppercase font-bold tracking-wider mb-1">
                  1. Select Staged Vehicle
                </label>
                <div className="relative">
                  <select
                    value={selectedCar?.carId || selectedCar?.id || ''}
                    onChange={(e) => handleCarChange(e.target.value)}
                    className="bg-white text-[#111827] border border-[#BCC7D8] rounded-lg px-3 py-2 text-xs font-semibold focus:border-[#0213B2] focus:ring-1 focus:ring-[#0213B2] focus:outline-none pr-8 cursor-pointer font-['Montserrat']"
                  >
                    {cars.map(c => (
                      <option key={c.carId || c.id} value={c.carId || c.id}>
                        {c.modelName || c.model} ({c.yearManufactured || c.year || '2024'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Component Select */}
              <div className="flex flex-col">
                <label className="text-[10px] font-mono text-[#06169B] uppercase font-bold tracking-wider mb-1">
                  2. Select Performance Part
                </label>
                <div className="relative">
                  <select
                    value={selectedPart?.partId || selectedPart?.id || ''}
                    onChange={(e) => handlePartChange(e.target.value)}
                    className="bg-white text-[#111827] border border-[#BCC7D8] rounded-lg px-3 py-2 text-xs font-semibold focus:border-[#0213B2] focus:ring-1 focus:ring-[#0213B2] focus:outline-none pr-8 cursor-pointer font-['Montserrat']"
                  >
                    {parts.map(p => (
                      <option key={p.partId || p.id} value={p.partId || p.id}>
                        {p.brand} - {p.partName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Engineering Database Metrics */}
              {overview && (
                <div className="hidden xl:flex items-center gap-3 pl-4 border-l border-[#BCC7D8] text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-white border border-[#BCC7D8] text-[#111827]">
                    {overview.totalCars} Chassis
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#D7E1FF] border border-[#0213B2]/30 text-[#0213B2] font-semibold">
                    {overview.totalParts} Parts
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#DCFCE7] border border-[#16A34A]/30 text-[#16A34A] font-bold">
                    {overview.accuracyRate} Accurate
                  </span>
                </div>
              )}
            </div>

            {/* Actions Toolbar */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRunCheck}
                disabled={checking || !selectedCar || !selectedPart}
                className="px-5 py-2.5 bg-[#0213B2] hover:bg-[#0115BC] active:bg-[#06169B] disabled:opacity-50 text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 shadow-sm transition-all cursor-pointer"
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
                className="px-4 py-2.5 bg-white hover:bg-[#EEF2FF] border border-[#CBD5E1] hover:border-[#0213B2] text-[#111827] hover:text-[#0213B2] font-['Montserrat'] font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-base text-[#0213B2]">view_in_ar</span>
                <span>Stage in 3D</span>
              </Link>
            </div>

          </div>
        </section>

        {/* Selected Vehicle & Part Banner */}
        <section className="border-b border-[#E2E8F0] bg-white px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#D7E1FF] border border-[#0213B2]/30 flex items-center justify-center text-[#0213B2]">
                <span className="material-symbols-outlined text-2xl">directions_car</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-['Montserrat'] text-base md:text-lg font-bold text-[#111827] tracking-wide">
                    {selectedCar?.modelName || selectedCar?.model || 'Porsche 911 GT3 RS'}
                  </h1>
                  <span className="px-2 py-0.5 rounded bg-[#E8EDFF] border border-[#0213B2]/30 text-[#0213B2] font-mono font-bold text-[10px]">
                    {selectedCar?.stockBoltPattern || '5x112'} • ET{selectedCar?.stockOffsetEt || '35'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[#64748B] text-xs font-mono mt-0.5">
                  <span>VIN: <strong className="text-[#111827]">VT-CHASSIS-{selectedCar?.carId || '01'}</strong></span>
                  <span>•</span>
                  <span>Target: <strong className="text-[#0213B2]">{selectedPart?.partName || 'Selected Part'}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {checkResult ? (
                <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg font-bold ${
                  checkResult.status === 'PASS' 
                    ? 'text-[#16A34A] bg-[#DCFCE7] border border-[#16A34A]/30'
                    : checkResult.status === 'WARNING'
                    ? 'text-[#D97706] bg-[#FEF3C7] border border-[#D97706]/30'
                    : 'text-[#DC2626] bg-[#FEE2E2] border border-[#DC2626]/30'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    checkResult.status === 'PASS' ? 'bg-[#16A34A]' : checkResult.status === 'WARNING' ? 'bg-[#D97706]' : 'bg-[#DC2626]'
                  }`} />
                  {checkResult.status === 'PASS' 
                    ? 'CAD FITMENT: 100% PASS' 
                    : checkResult.status === 'WARNING' 
                    ? 'CAD FITMENT: ADVISORY WARNING' 
                    : 'CAD FITMENT: INCOMPATIBLE FAIL'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#64748B] bg-[#F1F5F9] border border-[#CBD5E1] px-3 py-1.5 rounded-lg font-bold">
                  READY FOR VERIFICATION
                </span>
              )}
            </div>
          </div>
        </section>

        {/* 4 CRITICAL FITMENT GATES */}
        <section className="px-6 py-6 max-w-7xl mx-auto w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {checkResult?.checks && checkResult.checks.length > 0 ? (
              checkResult.checks.map((gate) => {
                const styles = getGateStatusStyles(gate.status)
                return (
                  <div 
                    key={gate.gateId} 
                    className={`bg-white border ${styles.cardBorder} rounded-xl p-4 flex flex-col justify-between transition-all shadow-xs`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold">
                          0{gate.gateId} / {gate.gateName}
                        </span>
                        <span className={`material-symbols-outlined ${styles.iconColor} text-base`}>
                          {getGateIcon(gate.gateId)}
                        </span>
                      </div>
                      <h3 className="font-['Montserrat'] font-bold text-sm text-[#111827] mb-1">
                        {gate.value}
                      </h3>
                      <p className="font-mono text-xs text-[#475569] leading-relaxed">
                        {gate.message}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex justify-between items-center text-xs">
                      <span className="text-[10px] font-mono text-[#64748B]">Tolerance Spec:</span>
                      <span className={`px-2 py-0.5 rounded ${styles.badgeBg} font-mono text-[10px] font-bold`}>
                        {gate.status} ({gate.tolerance || 'OEM Spec'})
                      </span>
                    </div>
                  </div>
                )
              })
            ) : (
              // Default Gates Placeholder
              [1, 2, 3, 4].map(id => (
                <div key={id} className="bg-white border border-[#E2E8F0] rounded-xl p-4 animate-pulse shadow-xs">
                  <div className="h-4 bg-[#F1F5F9] rounded w-1/2 mb-3" />
                  <div className="h-6 bg-[#F1F5F9] rounded w-3/4 mb-2" />
                  <div className="h-10 bg-[#F8FAFC] rounded w-full" />
                </div>
              ))
            )}

          </div>

          {/* Active Verification Results Package */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0213B2] text-xl">analytics</span>
                <h2 className="font-['Montserrat'] font-bold text-base text-[#111827]">
                  Technical Fitment Analysis Package
                </h2>
              </div>
              <span className="text-xs font-mono text-[#64748B] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                <span>Engineering Fitment Verification</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 text-xs font-mono bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">Vehicle Profile:</span>
                  <span className="text-[#111827] font-bold">{selectedCar?.modelName || selectedCar?.model || 'Supercar Chassis'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">Component SKU:</span>
                  <span className="text-[#0213B2] font-bold">{selectedPart?.sku || 'VT-PART'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">Overall Compatibility:</span>
                  <span className={`font-bold ${
                    checkResult?.status === 'PASS' ? 'text-[#16A34A]' : checkResult?.status === 'WARNING' ? 'text-[#D97706]' : 'text-[#DC2626]'
                  }`}>
                    {checkResult ? `${checkResult.status} (${checkResult.compatible ? 'Mechanically Feasible' : 'Blocked Interference'})` : 'PENDING'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#64748B]">Standard Homologation:</span>
                  <span className="text-[#111827]">{checkResult?.regulation || 'Engineering Fitment Verification (PCD • Offset • Clearance)'}</span>
                </div>

                {checkResult?.reasons && checkResult.reasons.length > 0 && (
                  <div className="pt-2 border-t border-[#E2E8F0]">
                    <span className="text-[#64748B] block mb-1">Engineering Notes:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-[#D97706]">
                      {checkResult.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between space-y-3 bg-[#E8EDFF] p-4 rounded-xl border border-[#BCC7D8]">
                <div className="space-y-1">
                  <p className="text-xs font-['Montserrat'] font-bold text-[#06169B]">
                    Next Recommended Actions:
                  </p>
                  <p className="text-xs text-[#334155] leading-relaxed">
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

                <div className="flex gap-3 pt-2">
                  <Link
                    to="/quotation"
                    className={`flex-1 py-2 px-3 text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider rounded-lg text-center shadow-xs ${
                      checkResult?.status === 'FAIL' 
                        ? 'bg-[#E2E8F0] text-[#94A3B8] opacity-50 cursor-not-allowed pointer-events-none' 
                        : 'bg-[#0213B2] hover:bg-[#0115BC]'
                    }`}
                  >
                    Proceed to Quotation
                  </Link>
                  {checkResult?.status === 'FAIL' ? (
                    <button
                      disabled
                      title="Không thể thêm vào giỏ: Linh kiện bị xung đột kỹ thuật (FAIL)"
                      className="py-2 px-3 bg-[#FEE2E2] border border-[#DC2626]/30 text-[#DC2626] font-['Montserrat'] font-bold text-xs uppercase tracking-wider rounded-lg text-center cursor-not-allowed flex items-center gap-1 opacity-70"
                    >
                      <span className="material-symbols-outlined text-sm">block</span>
                      Chặn thêm vào Giỏ (FAIL)
                    </button>
                  ) : (
                    <Link
                      to="/cart"
                      className="py-2 px-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider rounded-lg text-center flex items-center gap-1 shadow-xs transition-all"
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
