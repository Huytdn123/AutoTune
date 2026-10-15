import React from 'react'

/**
 * SpoilerSelector - Image-First 2D Visual Product Cards for Rear Spoiler & Wing (Group 3)
 * Strictly contains rear spoilers, GT wings, and aero wing packages.
 * Includes Vorsteiner Aero Carbon Wing Package and Big Country Labs Style GT Wing.
 */
export default function SpoilerSelector({
  partsCatalog = [],
  selectedSpoiler,
  onToggleSpoiler,
  isDark = true,
}) {
  const gtWingPart = partsCatalog.find(p => p.sku === 'GEN-GTWING-F458') || {
    sku: 'GEN-GTWING-F458',
    name: 'Carbon Aero GT Wing',
    partName: 'Carbon Aero GT Wing',
    priceUsd: 2450,
    imageUrl: '/images/carbon-gt-wing.jpg',
    brand: 'Track Aerodynamics'
  }

  // Vorsteiner Aero Carbon Wing & Diffuser package (classified under Rear Spoiler & Wing)
  const vorsteinerPart = partsCatalog.find(p => p.sku === 'VOR-CF-AERO-992') || {
    sku: 'VOR-CF-AERO-992',
    name: 'Vorsteiner Aero Carbon Wing & Rear Diffuser Package',
    partName: 'Vorsteiner Aero Carbon Wing & Rear Diffuser Package',
    priceUsd: 5800,
    imageUrl: '/images/vorsteiner-carbon-aero.jpg',
    brand: 'Vorsteiner USA'
  }

  const wingOptions = [gtWingPart, vorsteinerPart]

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-[#6091C3]">air</span>
          <h4 className={`text-xs font-['Montserrat'] font-bold uppercase tracking-wider ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            3. Rear Spoiler & Wing
          </h4>
        </div>
        <span className={`text-[10px] font-mono ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
          Track Downforce Wing
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {wingOptions.map(wing => {
          const isThisChecked = Boolean(
            selectedSpoiler &&
            (selectedSpoiler === wing.sku ||
             (wing.sku === 'GEN-GTWING-F458' && selectedSpoiler === 'big-country-labs-style-wing'))
          )

          return (
            <div
              key={wing.sku}
              onClick={() => onToggleSpoiler && onToggleSpoiler(wing)}
              data-preserve-white="true"
              data-preserve-bg="true"
              className={`p-3 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${
                isThisChecked
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
                  src={wing.imageUrl || (wing.sku === 'GEN-GTWING-F458' ? '/images/carbon-gt-wing.jpg' : '/images/vorsteiner-carbon-aero.jpg')}
                  alt={wing.name || wing.partName}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <span className={`text-[10px] font-mono uppercase font-black tracking-wider ${
                    isDark ? 'text-[#6091C3]' : 'text-[#0213B2]'
                  }`}>
                    {wing.brand || 'Track Spec'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold bg-[#DCFCE7]/20 text-[#16A34A] border border-[#16A34A]/30">
                    Track Wing
                  </span>
                </div>
                <h5 className={`text-[13px] font-['Montserrat'] font-black leading-snug truncate ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`} title={wing.name || wing.partName}>
                  {wing.name || wing.partName}
                </h5>
                <p className={`text-[10px] font-mono mt-0.5 truncate ${
                  isDark ? 'text-white/40' : 'text-slate-600 font-medium'
                }`}>
                  {wing.sku === 'VOR-CF-AERO-992'
                    ? 'Carbon Wing Blade + Rear Diffuser'
                    : 'Carbon Airfoil · Twin Uprights'}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <span className={`text-xs font-mono font-black ${
                    isThisChecked
                      ? isDark ? 'text-[#6091C3]' : 'text-[#0213B2]'
                      : isDark ? 'text-white/80' : 'text-slate-900'
                  }`}>
                    +${(wing.priceUsd || (wing.priceVnd ? Math.round(wing.priceVnd / 25000) : 2450)).toLocaleString()} USD
                  </span>
                </div>
              </div>

              {/* Checkbox State */}
              <div className="shrink-0 pl-0.5">
                <span className={`material-symbols-outlined text-xl ${
                  isThisChecked
                    ? isDark ? 'text-[#6091C3]' : 'text-[#0213B2]'
                    : isDark ? 'text-white/20' : 'text-slate-400'
                }`}>
                  {isThisChecked ? 'check_box' : 'check_box_outline_blank'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
