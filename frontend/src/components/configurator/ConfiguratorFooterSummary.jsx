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
  isDark = true,
}) {
  return (
    <div
      data-preserve-white="true"
      className={`px-4 py-3 border-t shrink-0 transition-colors duration-300 ${
        isDark
          ? 'bg-[#0a0a0f] border-white/10 text-white'
          : 'bg-white border-slate-300 text-slate-900 shadow-[0_-8px_25px_rgba(0,0,0,0.08)]'
      }`}
    >
      {/* Color & Staging summary strip */}
      <div
        data-preserve-bg="true"
        className={`flex items-center gap-2.5 mb-2.5 p-2 rounded-xl border ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100/90 border border-slate-300'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md border-2 border-slate-300 shrink-0 shadow-sm" style={{ backgroundColor: bodyColor }} title="Body Paint" />
          <div className="w-4 h-4 rounded border border-slate-300 shrink-0 shadow-sm" style={{ backgroundColor: rimColor }} title="Rims" />
          <div className="w-4 h-4 rounded border border-slate-300 shrink-0 shadow-sm" style={{ backgroundColor: interiorColor }} title="Cockpit Leather" />
          <div className="w-4 h-4 rounded border border-slate-300 opacity-75 shrink-0 shadow-sm" style={{ backgroundColor: glassColor }} title="Glass Tint" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[10px] uppercase font-bold tracking-wider leading-none ${
            isDark ? 'text-white/40' : 'text-slate-600'
          }`}>Current 3D Spec</p>
          <p className={`text-[11px] font-black truncate mt-0.5 ${
            isDark ? 'text-white' : 'text-slate-950'
          }`}>
            {selectedBody?.name} · {selectedInterior?.name}
            {selectedWheel ? ' · WORK VS-XX 19"' : ' · OEM Rims'}
            {selectedBodykit ? ' · Carbon Aero' : ''}
            {selectedSpoiler ? ' · Carbon GT Wing' : ''}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-3">
        <div>
          <span className={`text-[10px] font-black uppercase tracking-wider block ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>Estimated Build MSRP</span>
          {optionsTotal > 0 ? (
            <span className="text-[11px] font-mono text-emerald-600 font-bold vt-tabular">
              +${optionsTotal.toLocaleString()} ({selectedPartsCount} Parts)
            </span>
          ) : (
            <span className={`text-[10px] font-mono font-semibold ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>Stock OEM Configuration</span>
          )}
        </div>
        <span className={`text-2xl font-black font-mono vt-tabular tracking-tight ${
          isDark ? 'text-white' : 'text-slate-950'
        }`}>
          ${totalEstimatedCost.toLocaleString()}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onOpenSaveModal}
          data-preserve-white="true"
          className={`flex-1 py-2.5 px-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer min-w-0 border-2 ${
            isDark
              ? 'border-white/20 bg-white/10 hover:bg-white/15 text-white shadow-sm'
              : 'border-slate-400 bg-white hover:bg-slate-50 hover:border-slate-500 text-slate-900 shadow-xs'
          }`}
        >
          <span className={`material-symbols-outlined text-sm shrink-0 ${
            isDark ? 'text-[#6091C3]' : 'text-[#0213B2]'
          }`}>bookmark_add</span>
          <span className="truncate">Save Build</span>
        </button>
        <button
          onClick={onGetQuote}
          className={`flex-[1.4] py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer min-w-0 border-2 shadow-lg ${
            isDark
              ? 'bg-[#0213B2] hover:bg-[#000F96] text-white border-[#3B82F6]/60 shadow-[#0213B2]/40 hover:shadow-[#0213B2]/60'
              : 'bg-[#0213B2] hover:bg-[#000F96] text-white border-[#0213B2] shadow-[#0213B2]/30 hover:shadow-[#0213B2]/50'
          }`}
        >
          <span className="material-symbols-outlined text-sm shrink-0 text-white">request_quote</span>
          <span className="truncate">Generate Quotation</span>
        </button>
      </div>
    </div>
  )
}
