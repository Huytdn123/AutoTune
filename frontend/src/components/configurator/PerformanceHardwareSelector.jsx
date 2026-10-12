import React from 'react'

/**
 * PerformanceHardwareSelector - Image-First 2D Visual Product Cards for Performance & Hardware options (Group 4)
 * Controls Exhaust, Suspension, Brakes add-on options with real product imagery
 */
export default function PerformanceHardwareSelector({
  partsCatalog = [],
  selectedParts = [],
  onToggleHardware,
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
          <h4 className="text-xs font-['Montserrat'] font-bold uppercase tracking-wider text-white">
            4. Performance & Hardware
          </h4>
        </div>
        <span className="text-[10px] font-mono text-white/50">Exhaust · Suspension · Brakes</span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {hardwareItems.map(hw => {
          const isChecked = selectedParts.some(p => (p.partId || p.id) === (hw.partId || hw.id))
          const rawName = hw.name || hw.partName || ''

          // Resolve image thumbnail
          let imgUrl = hw.imageUrl
          if (!imgUrl || imgUrl.includes('hero-car')) {
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
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                isChecked
                  ? 'bg-[#0213B2]/15 border-[#0213B2] ring-1 ring-[#0213B2]/60 shadow-lg shadow-[#0213B2]/10'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06]'
              }`}
            >
              {/* 2D Product Thumbnail */}
              <div className="w-[72px] h-[72px] rounded-lg bg-black/50 border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={imgUrl}
                  alt={shortName}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <span className="text-[9px] font-mono text-[#6091C3] uppercase font-bold tracking-wider">
                    {hw.brand || 'PERFORMANCE'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-[#DCFCE7]/15 text-[#16A34A] border border-[#16A34A]/30">
                    Verified Fit
                  </span>
                </div>
                <h5 className="text-xs font-['Montserrat'] font-bold text-white leading-snug truncate" title={rawName}>
                  {shortName}
                </h5>
                <p className="text-[9.5px] text-white/40 font-mono mt-0.5 truncate">
                  {shortCat} · Track Engineered
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${isChecked ? 'text-[#6091C3]' : 'text-white/80'}`}>
                    +${(hw.priceUsd || (hw.priceVnd ? Math.round(hw.priceVnd / 25000) : 1800)).toLocaleString()} USD
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
          )
        })}
      </div>
    </div>
  )
}
