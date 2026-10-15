import React from 'react'

/**
 * BodyAeroSelector - Image-First 2D Visual Product Cards for Body & Aerodynamics (Group 2)
 * Strictly contains body kits, front splitters, side skirts, and rear diffusers (NO rear wings).
 * Wing components are strictly classified under Group 3 (Rear Spoiler & Wing).
 */
export default function BodyAeroSelector({
  partsCatalog = [],
  selectedBodykit,
  onToggleBodykit,
  isDark = true,
}) {
  // Pure body aero parts (excluding wings/spoilers)
  const aeroPart = partsCatalog.find(
    p => p.sku === 'CARB-AERO-F458' ||
         (p.category?.toLowerCase().includes('aero') && !p.name?.toLowerCase().includes('wing') && !p.partName?.toLowerCase().includes('wing') && p.sku !== 'VOR-CF-AERO-992')
  ) || {
    sku: 'CARB-AERO-F458',
    name: 'Carbon Fiber Aerodynamics Package',
    partName: 'Carbon Fiber Aerodynamics Package',
    brand: 'Track Aerodynamics',
    priceUsd: 3200,
    imageUrl: '/images/carbon-aero-package.jpg',
    material: 'Pre-preg 2x2 Carbon Fiber'
  }

  const isChecked = Boolean(selectedBodykit)

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-[#6091C3]">view_in_ar</span>
          <h4 className={`text-xs font-['Montserrat'] font-bold uppercase tracking-wider ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            2. Body & Aerodynamics
          </h4>
        </div>
        <span className={`text-[10px] font-mono ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
          Splitter, Skirts & Diffuser
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <div
          key={aeroPart.sku}
          onClick={() => onToggleBodykit && onToggleBodykit(aeroPart)}
          data-preserve-white="true"
          data-preserve-bg="true"
          className={`p-3 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${
            isChecked
              ? isDark
                ? 'border-2 border-[#3B82F6] bg-[#0213B2]/25 ring-2 ring-[#3B82F6]/50 shadow-lg shadow-[#0213B2]/15'
                : 'border-2 border-[#0213B2] bg-blue-50/95 ring-2 ring-[#0213B2]/30 shadow-md'
              : isDark
                ? 'border border-white/15 bg-white/[0.04] hover:border-white/30 hover:bg-white/[0.08]'
                : 'border-2 border-slate-300/90 bg-white hover:border-slate-400 hover:bg-slate-50/80 shadow-xs'
          }`}
        >
          {/* 2D Product Thumbnail */}
          <div
            data-preserve-white="true"
            className={`w-[72px] h-[72px] rounded-lg border-2 p-1 flex items-center justify-center shrink-0 overflow-hidden ${
              isDark ? 'bg-black/50 border-white/15' : 'bg-white border-slate-300 shadow-2xs'
            }`}
          >
            <img
              src={aeroPart.imageUrl || '/images/carbon-aero-package.jpg'}
              alt={aeroPart.name || 'Carbon Fiber Aerodynamics Package'}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
              <span className={`text-[10px] font-mono uppercase font-black tracking-wider ${
                isDark ? 'text-[#6091C3]' : 'text-[#0213B2]'
              }`}>
                {aeroPart.brand || 'Track Aerodynamics'}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold bg-[#DCFCE7]/20 text-[#16A34A] border border-[#16A34A]/30">
                Aero Extension
              </span>
            </div>
            <h5 className={`text-[13px] font-['Montserrat'] font-black leading-snug truncate ${
              isDark ? 'text-white' : 'text-slate-950'
            }`} title={aeroPart.name || aeroPart.partName}>
              {aeroPart.name || aeroPart.partName}
            </h5>
            <p className={`text-[10px] font-mono mt-0.5 truncate ${
              isDark ? 'text-white/40' : 'text-slate-600 font-medium'
            }`}>
              Front Splitter · Side Skirts · Rear Fins
            </p>
            <div className="mt-1 flex items-center justify-between">
              <span className={`text-xs font-mono font-black ${
                isChecked
                  ? isDark ? 'text-[#6091C3]' : 'text-[#0213B2]'
                  : isDark ? 'text-white/80' : 'text-slate-900'
              }`}>
                +${(aeroPart.priceUsd || 3200).toLocaleString()} USD
              </span>
            </div>
          </div>

          {/* Checkbox State */}
          <div className="shrink-0 pl-0.5">
            <span className={`material-symbols-outlined text-xl ${
              isChecked
                ? isDark ? 'text-[#6091C3]' : 'text-[#0213B2]'
                : isDark ? 'text-white/20' : 'text-slate-400'
            }`}>
              {isChecked ? 'check_box' : 'check_box_outline_blank'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
