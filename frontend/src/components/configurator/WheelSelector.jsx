import React from 'react'

/**
 * WheelSelector - Image-First 2D Visual Product Cards for Wheels & Rims Selection (Group 1)
 * Displays OEM Wheel and Aftermarket Wheel Options with clear thumbnails, prices, and fitment badges
 */
export default function WheelSelector({
  partsCatalog = [],
  selectedWheel,
  onSelectWheel,
}) {
  const workWheel = partsCatalog.find(p => p.sku === 'WORK-VSXX-19-F458') || {
    sku: 'WORK-VSXX-19-F458',
    name: 'WORK VS-XX 19" Aftermarket Wheel',
    partName: 'WORK VS-XX 19" Aftermarket Wheel',
    brand: 'WORK Wheels',
    priceUsd: 4200,
    imageUrl: '/images/work-vs-xx-wheel.jpg',
    material: '3-Piece Modular Forged'
  }

  // Other wheel options if available from catalog
  const extraWheels = partsCatalog.filter(
    p => p.sku !== 'WORK-VSXX-19-F458' &&
         (p.category?.toLowerCase().includes('wheel') || p.sku?.includes('FIR') || p.sku?.includes('TE37'))
  )

  const isWorkSelected = Boolean(
    selectedWheel &&
    (selectedWheel === workWheel.sku ||
      (typeof selectedWheel === 'string' &&
        (selectedWheel.toLowerCase().includes('work') || selectedWheel.toLowerCase().includes('vsxx'))))
  )

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-[#6091C3]">adjust</span>
          <h4 className="text-xs font-['Montserrat'] font-bold uppercase tracking-wider text-white">
            1. Wheels & Rims
          </h4>
        </div>
        <span className="text-[10px] font-mono text-white/50">Select 1 Option</span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {/* OEM Stock Wheel Card */}
        <div
          onClick={() => onSelectWheel && onSelectWheel(null)}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
            !selectedWheel
              ? 'bg-[#0213B2]/15 border-[#0213B2] ring-1 ring-[#0213B2]/60 shadow-lg shadow-[#0213B2]/10'
              : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06]'
          }`}
        >
          {/* 2D Product Thumbnail */}
          <div className="w-[72px] h-[72px] rounded-lg bg-black/50 border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src="/images/bbs-fi-r-wheel.jpg"
              alt="Ferrari OEM 20-inch Star-Spoke Forged Wheel"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
              <span className="text-[9px] font-mono text-white/50 uppercase font-bold tracking-wider">
                Ferrari OEM
              </span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-[#DCFCE7]/15 text-[#16A34A] border border-[#16A34A]/30">
                Stock Fitment
              </span>
            </div>
            <h5 className="text-xs font-['Montserrat'] font-bold text-white leading-snug truncate" title="Ferrari 458 20-inch Star-Spoke Forged">
              Ferrari 458 20" Star-Spoke Forged
            </h5>
            <p className="text-[9.5px] text-white/40 font-mono mt-0.5 truncate">
              PCD 5x114.3 · Monoblock Forged
            </p>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#16A34A]">
                $0 USD (Stock OEM)
              </span>
            </div>
          </div>

          {/* Radio State */}
          <div className="shrink-0 pl-0.5">
            <span className={`material-symbols-outlined text-lg ${!selectedWheel ? 'text-[#6091C3]' : 'text-white/20'}`}>
              {!selectedWheel ? 'radio_button_checked' : 'radio_button_unchecked'}
            </span>
          </div>
        </div>

        {/* WORK VS-XX 19" Aftermarket Wheel Card */}
        <div
          onClick={() => onSelectWheel && onSelectWheel(isWorkSelected ? null : workWheel)}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
            isWorkSelected
              ? 'bg-[#0213B2]/15 border-[#0213B2] ring-1 ring-[#0213B2]/60 shadow-lg shadow-[#0213B2]/10'
              : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06]'
          }`}
        >
          {/* 2D Product Thumbnail */}
          <div className="w-[72px] h-[72px] rounded-lg bg-black/50 border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src={workWheel.imageUrl || '/images/work-vs-xx-wheel.jpg'}
              alt={workWheel.name || 'WORK VS-XX 19-inch Aftermarket Wheel'}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
              <span className="text-[9px] font-mono text-[#6091C3] uppercase font-bold tracking-wider">
                {workWheel.brand || 'WORK JAPAN'}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-[#DCFCE7]/15 text-[#16A34A] border border-[#16A34A]/30">
                ✓ Direct Fit (5x114.3)
              </span>
            </div>
            <h5 className="text-xs font-['Montserrat'] font-bold text-white leading-snug truncate" title={workWheel.name || workWheel.partName}>
              {workWheel.name || workWheel.partName}
            </h5>
            <p className="text-[9.5px] text-white/40 font-mono mt-0.5 truncate">
              3-Piece Modular · Deep Lip Mesh
            </p>
            <div className="mt-1 flex items-center justify-between">
              <span className={`text-xs font-mono font-bold ${isWorkSelected ? 'text-[#6091C3]' : 'text-white/80'}`}>
                +${(workWheel.priceUsd || 4200).toLocaleString()} USD
              </span>
            </div>
          </div>

          {/* Radio State */}
          <div className="shrink-0 pl-0.5">
            <span className={`material-symbols-outlined text-lg ${isWorkSelected ? 'text-[#6091C3]' : 'text-white/20'}`}>
              {isWorkSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
            </span>
          </div>
        </div>

        {/* Additional Catalog Wheels if populated from backend */}
        {extraWheels.map(wheel => {
          const isThisSelected = selectedWheel === wheel.sku
          return (
            <div
              key={wheel.sku}
              onClick={() => onSelectWheel && onSelectWheel(isThisSelected ? null : wheel)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                isThisSelected
                  ? 'bg-[#0213B2]/15 border-[#0213B2] ring-1 ring-[#0213B2]/60 shadow-lg shadow-[#0213B2]/10'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06]'
              }`}
            >
              <div className="w-[72px] h-[72px] rounded-lg bg-black/50 border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={wheel.imageUrl || (wheel.sku?.includes('TE37') ? '/images/rays-te37-ultra.jpg' : '/images/bbs-fi-r-wheel.jpg')}
                  alt={wheel.name || wheel.partName}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <span className="text-[9px] font-mono text-[#6091C3] uppercase font-bold tracking-wider">
                    {wheel.brand || 'BBS MOTORSPORT'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-[#DCFCE7]/15 text-[#16A34A] border border-[#16A34A]/30">
                    Verified Fit
                  </span>
                </div>
                <h5 className="text-xs font-['Montserrat'] font-bold text-white leading-snug truncate" title={wheel.name || wheel.partName}>
                  {wheel.name || wheel.partName}
                </h5>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white/80">
                    +${(wheel.priceUsd || (wheel.priceVnd ? Math.round(wheel.priceVnd / 25000) : 3800)).toLocaleString()} USD
                  </span>
                </div>
              </div>
              <div className="shrink-0 pl-0.5">
                <span className={`material-symbols-outlined text-lg ${isThisSelected ? 'text-[#6091C3]' : 'text-white/20'}`}>
                  {isThisSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
