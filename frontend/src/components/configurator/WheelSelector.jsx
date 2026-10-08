import React from 'react'

/**
 * WheelSelector - Presentational component for Wheels & Rims Selection (Group 1)
 * Controls OEM Wheel vs WORK VS-XX 19" Aftermarket Wheel
 * Keeps selectedWheel state and handleSelectWheel handler in ConfiguratorPage parent
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
    material: '3-Piece Modular Forged'
  }

  const isSelected = Boolean(
    selectedWheel &&
    (selectedWheel === workWheel.sku ||
      (typeof selectedWheel === 'string' &&
        (selectedWheel.toLowerCase().includes('work') || selectedWheel.toLowerCase().includes('vsxx'))))
  )

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-xs text-primary">adjust</span>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-white/70">1. Wheels & Rims</h4>
        </div>
        <span className="text-[9px] font-mono text-white/30">Select 1 Wheel Option</span>
      </div>

      <div className="space-y-2">
        {/* OEM Wheel Card */}
        <div
          onClick={() => onSelectWheel && onSelectWheel(null)}
          className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
            !selectedWheel
              ? 'bg-primary/10 border-primary/60 ring-1 ring-primary/40'
              : 'bg-white/3 border-white/8 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-sm ${!selectedWheel ? 'text-primary' : 'text-white/30'}`}>
                {!selectedWheel ? 'radio_button_checked' : 'radio_button_unchecked'}
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-mono text-white/40 uppercase">Ferrari OEM</span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    Stock Fitment
                  </span>
                </div>
                <p className="text-xs font-bold text-white mt-0.5">Ferrari 458 20" Star-Spoke Forged</p>
                <p className="text-[9px] text-white/40 font-mono">Factory Original Equipment · Ultra-Lightweight Alloy</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-bold font-mono text-emerald-400">$0 USD</span>
              <p className="text-[8px] text-white/30 uppercase mt-0.5">OEM Included</p>
            </div>
          </div>
        </div>

        {/* Aftermarket Wheel Option: WORK VS-XX 19" */}
        <div
          key={workWheel.sku}
          onClick={() => onSelectWheel && onSelectWheel(isSelected ? null : workWheel)}
          className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
            isSelected
              ? 'bg-primary/10 border-primary/60 ring-1 ring-primary/40'
              : 'bg-white/3 border-white/8 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-sm ${isSelected ? 'text-primary' : 'text-white/30'}`}>
                {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-mono text-primary uppercase font-bold">WORK JAPAN</span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    ✓ Direct Fit (PCD 5x114.3)
                  </span>
                </div>
                <p className="text-xs font-bold text-white mt-0.5">{workWheel.name || workWheel.partName}</p>
                <p className="text-[9px] text-white/40 font-mono">3-Piece Modular Forged · Classic Sport Mesh · CC BY 4.0</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className={`text-xs font-bold font-mono ${isSelected ? 'text-primary' : 'text-white/70'}`}>
                +${(workWheel.priceUsd || 4200).toLocaleString()} USD
              </span>
              <p className="text-[8px] text-white/30 uppercase mt-0.5">Reference Price</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
