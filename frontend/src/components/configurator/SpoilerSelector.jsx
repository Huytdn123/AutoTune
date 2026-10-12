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
          <h4 className="text-xs font-['Montserrat'] font-bold uppercase tracking-wider text-white">
            3. Rear Spoiler & Wing
          </h4>
        </div>
        <span className="text-[10px] font-mono text-white/50">Track Downforce Wing</span>
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
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                isThisChecked
                  ? 'bg-[#0213B2]/15 border-[#0213B2] ring-1 ring-[#0213B2]/60 shadow-lg shadow-[#0213B2]/10'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06]'
              }`}
            >
              {/* 2D Product Thumbnail */}
              <div className="w-[72px] h-[72px] rounded-lg bg-black/50 border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={wing.imageUrl || (wing.sku === 'GEN-GTWING-F458' ? '/images/carbon-gt-wing.jpg' : '/images/vorsteiner-carbon-aero.jpg')}
                  alt={wing.name || wing.partName}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <span className="text-[9px] font-mono text-[#6091C3] uppercase font-bold tracking-wider">
                    {wing.brand || 'Track Spec'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-[#DCFCE7]/15 text-[#16A34A] border border-[#16A34A]/30">
                    Track Wing
                  </span>
                </div>
                <h5 className="text-xs font-['Montserrat'] font-bold text-white leading-snug truncate" title={wing.name || wing.partName}>
                  {wing.name || wing.partName}
                </h5>
                <p className="text-[9.5px] text-white/40 font-mono mt-0.5 truncate">
                  {wing.sku === 'VOR-CF-AERO-992'
                    ? 'Carbon Wing Blade + Rear Diffuser'
                    : 'Carbon Airfoil · Twin Uprights'}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${isThisChecked ? 'text-[#6091C3]' : 'text-white/80'}`}>
                    +${(wing.priceUsd || (wing.priceVnd ? Math.round(wing.priceVnd / 25000) : 2450)).toLocaleString()} USD
                  </span>
                </div>
              </div>

              {/* Checkbox State */}
              <div className="shrink-0 pl-0.5">
                <span className={`material-symbols-outlined text-lg ${isThisChecked ? 'text-[#6091C3]' : 'text-white/20'}`}>
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
