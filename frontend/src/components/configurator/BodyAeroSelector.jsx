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
          <h4 className="text-xs font-['Montserrat'] font-bold uppercase tracking-wider text-white">
            2. Body & Aerodynamics
          </h4>
        </div>
        <span className="text-[10px] font-mono text-white/50">Splitter, Skirts & Diffuser</span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <div
          key={aeroPart.sku}
          onClick={() => onToggleBodykit && onToggleBodykit(aeroPart)}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
            isChecked
              ? 'bg-[#0213B2]/15 border-[#0213B2] ring-1 ring-[#0213B2]/60 shadow-lg shadow-[#0213B2]/10'
              : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06]'
          }`}
        >
          {/* 2D Product Thumbnail */}
          <div className="w-[72px] h-[72px] rounded-lg bg-black/50 border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src={aeroPart.imageUrl || '/images/carbon-aero-package.jpg'}
              alt={aeroPart.name || 'Carbon Fiber Aerodynamics Package'}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
              <span className="text-[9px] font-mono text-[#6091C3] uppercase font-bold tracking-wider">
                {aeroPart.brand || 'Track Aerodynamics'}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-[#DCFCE7]/15 text-[#16A34A] border border-[#16A34A]/30">
                Aero Extension
              </span>
            </div>
            <h5 className="text-xs font-['Montserrat'] font-bold text-white leading-snug truncate" title={aeroPart.name || aeroPart.partName}>
              {aeroPart.name || aeroPart.partName}
            </h5>
            <p className="text-[9.5px] text-white/40 font-mono mt-0.5 truncate">
              Front Splitter · Side Skirts · Rear Fins
            </p>
            <div className="mt-1 flex items-center justify-between">
              <span className={`text-xs font-mono font-bold ${isChecked ? 'text-[#6091C3]' : 'text-white/80'}`}>
                +${(aeroPart.priceUsd || 3200).toLocaleString()} USD
              </span>
            </div>
          </div>

          {/* Checkbox State */}
          <div className="shrink-0 pl-0.5">
            <span className={`material-symbols-outlined text-lg ${isChecked ? 'text-[#6091C3]' : 'text-white/20'}`}>
              {isChecked ? 'check_box' : 'check_box_outline_blank'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
