import React from 'react'

/**
 * PerformanceHardwareSelector - Image-First 2D Visual Product Cards for Performance & Hardware options (Group 4)
 * Controls Exhaust, Suspension, Brakes add-on options with real product imagery
 */
export default function PerformanceHardwareSelector({
  partsCatalog = [],
  selectedParts = [],
  onToggleHardware,
  isDark = true,
}) {
  const hardwareItems = partsCatalog
    .filter(
      p =>
        !p.category?.toLowerCase().includes('wheel') &&
        !p.category?.toLowerCase().includes('aero') &&
        !p.category?.toLowerCase().includes('spoiler') &&
        p.sku !== 'VOR-CF-AERO-992' &&
        p.sku !== 'CARB-AERO-F458'
    )
    .slice(0, 3)

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-[#6091C3]">tune</span>
          <h4 className={`text-xs font-['Montserrat'] font-bold uppercase tracking-wider ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            4. Performance & Hardware
          </h4>
        </div>
        <span className={`text-[10px] font-mono ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
          Exhaust · Suspension · Brakes
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {hardwareItems.map(hw => {
          const isChecked = selectedParts.some(p => (p.partId || p.id) === (hw.partId || hw.id))
          const rawName = hw.name || hw.partName || ''

          // Resolve image thumbnail
          let imgUrl = hw.imageUrl
          if (!imgUrl) {
            if (/akrapov/i.test(rawName) || /exhaust/i.test(hw.category || '') || hw.sku === 'AKR-EVO-TITAN-992') {
              imgUrl = '/images/akrapovic-evolution-line.jpg'
            } else if (/kw/i.test(rawName) || /coilover|suspension/i.test(hw.category || '') || hw.sku === 'KW-35271842-V4CS') {
              imgUrl = '/images/kw-v4-clubsport.jpg'
            } else if (/brembo/i.test(rawName) || /brake/i.test(hw.category || '') || hw.sku === 'BRM-1N1.9042A2') {
              imgUrl = '/images/brembo-gt-brake-kit.jpg'
            } else {
              imgUrl = '/images/vorsteiner-carbon-aero.jpg'
            }
          }

          // Concise short name
          let shortName = rawName
          if (/akrapov/i.test(rawName)) {
            shortName = 'Akrapovič Evolution Line Titanium Exhaust'
          } else if (/kw/i.test(rawName)) {
            shortName = 'KW Suspensions V4 Clubsport Coilovers'
          } else if (/brembo/i.test(rawName)) {
            shortName = 'Brembo GT-S 6-Piston Big Brake Kit'
          }

          // Concise category
          let shortCat = hw.category || ''
          if (/exhaust/i.test(shortCat)) shortCat = 'Exhaust System'
          else if (/coilover|suspension/i.test(shortCat)) shortCat = 'Coilovers'
          else if (/brake/i.test(shortCat)) shortCat = 'Brake Kit'

          return (
            <div
              key={hw.sku || hw.id}
              onClick={() => onToggleHardware && onToggleHardware(hw)}
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
                  src={imgUrl}
                  alt={shortName}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <span className={`text-[10px] font-mono uppercase font-black tracking-wider ${
                    isDark ? 'text-[#6091C3]' : 'text-[#0213B2]'
                  }`}>
                    {hw.brand || 'PERFORMANCE'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold bg-[#DCFCE7]/20 text-[#16A34A] border border-[#16A34A]/30">
                    Verified Fit
                  </span>
                </div>
                <h5 className={`text-[13px] font-['Montserrat'] font-black leading-snug truncate ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`} title={rawName}>
                  {shortName}
                </h5>
                <p className={`text-[10px] font-mono mt-0.5 truncate ${
                  isDark ? 'text-white/40' : 'text-slate-600 font-medium'
                }`}>
                  {shortCat} · Track Engineered
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <span className={`text-xs font-mono font-black ${
                    isChecked
                      ? isDark ? 'text-[#6091C3]' : 'text-[#0213B2]'
                      : isDark ? 'text-white/80' : 'text-slate-900'
                  }`}>
                    +${(hw.priceUsd || (hw.priceVnd ? Math.round(hw.priceVnd / 25000) : 1800)).toLocaleString()} USD
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
          )
        })}
      </div>
    </div>
  )
}
