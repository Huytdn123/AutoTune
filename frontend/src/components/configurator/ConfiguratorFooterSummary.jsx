import React from 'react'

/**
 * ConfiguratorFooterSummary - Presentational component for the sticky bottom bar
 * Shows current 3D spec badges, estimated MSRP, options total, and CTA buttons
 * Keeps all business logic and callbacks in ConfiguratorPage parent
 */
export default function ConfiguratorFooterSummary({
  bodyColor,
  rimColor,
  interiorColor,
  glassColor,
  selectedBody,
  selectedInterior,
  selectedWheel,
  selectedBodykit,
  selectedSpoiler,
  optionsTotal = 0,
  selectedPartsCount = 0,
  totalEstimatedCost = 0,
  activeCar,
  onOpenSaveModal,
  onGetQuote,
}) {
  return (
    <div className="px-4 py-2.5 border-t border-white/8 shrink-0 bg-[#0a0a0f]">
      {/* Color & Staging summary strip */}
      <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-white/5 border border-white/8">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded border border-white/15 shrink-0" style={{ backgroundColor: bodyColor }} title="Body Paint" />
          <div className="w-4 h-4 rounded border border-white/15 shrink-0" style={{ backgroundColor: rimColor }} title="Rims" />
          <div className="w-4 h-4 rounded border border-white/15 shrink-0" style={{ backgroundColor: interiorColor }} title="Cockpit Leather" />
          <div className="w-4 h-4 rounded border border-white/15 opacity-75 shrink-0" style={{ backgroundColor: glassColor }} title="Glass Tint" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] text-white/40 uppercase tracking-wider leading-none">Current 3D Spec</p>
          <p className="text-[10px] text-white font-semibold truncate mt-0.5">
            {selectedBody?.name} · {selectedInterior?.name}
            {selectedWheel ? ' · WORK VS-XX 19"' : ' · OEM Rims'}
            {selectedBodykit ? ' · Carbon Aero' : ''}
            {selectedSpoiler ? ' · Carbon GT Wing' : ''}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 block">Estimated Build MSRP</span>
          {optionsTotal > 0 ? (
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              +${optionsTotal.toLocaleString()} ({selectedPartsCount} Parts)
            </span>
          ) : (
            <span className="text-[10px] font-mono text-slate-400 font-medium">Stock OEM Configuration</span>
          )}
        </div>
        <span className="text-xl font-black font-mono text-white">
          ${totalEstimatedCost.toLocaleString()}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onOpenSaveModal}
          className="flex-1 py-2 px-2 rounded-lg bg-white/10 border border-white/20 hover:border-white/35 hover:bg-white/15 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer min-w-0"
        >
          <span className="material-symbols-outlined text-sm text-[#6091C3] shrink-0">bookmark_add</span>
          <span className="truncate">Save 3D Build</span>
        </button>
        <button
          onClick={onGetQuote}
          className="flex-1 py-2 px-2 rounded-lg bg-[#0213B2] hover:bg-[#0115BC] active:bg-[#06169B] text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-all shadow-md shadow-[#0213B2]/30 cursor-pointer min-w-0"
        >
          <span className="material-symbols-outlined text-xs shrink-0">arrow_forward</span>
          <span className="truncate">Get Quote</span>
        </button>
      </div>
    </div>
  )
}
