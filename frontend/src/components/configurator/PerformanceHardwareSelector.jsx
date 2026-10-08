import React from 'react'

/**
 * PerformanceHardwareSelector - Presentational component for Performance & Hardware options (Group 4)
 * Controls Exhaust, Suspension, Brakes add-on options
 * Keeps selectedParts state and handleToggleHardware handler in ConfiguratorPage parent
 */
export default function PerformanceHardwareSelector({
  partsCatalog = [],
  selectedParts = [],
  onToggleHardware,
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-xs text-primary">tune</span>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-white/70">4. Performance & Hardware</h4>
        </div>
      </div>

      <div className="space-y-2">
        {partsCatalog
          .filter(
            p =>
              !p.category?.toLowerCase().includes('wheel') &&
              !p.category?.toLowerCase().includes('aero') &&
              !p.category?.toLowerCase().includes('spoiler')
          )
          .slice(0, 3)
          .map(hw => {
            const isChecked = selectedParts.some(p => (p.partId || p.id) === (hw.partId || hw.id))
            const rawName = hw.name || hw.partName || ''

            // Concise short name to prevent container overflow
            let shortName = rawName
            if (rawName.includes('Akrapovič') || rawName.includes('Akrapovic')) {
              shortName = 'Akrapovič Evolution Titanium'
            } else if (rawName.includes('KW')) {
              shortName = 'KW V4 Clubsport Coilovers'
            } else if (rawName.includes('Brembo')) {
              shortName = 'Brembo GT-S 6-Piston Brakes'
            }

            // Concise short specs
            let shortSpec = hw.specifications || hw.sku || ''
            if (rawName.includes('Akrapovič') || rawName.includes('Akrapovic')) {
              shortSpec = 'Full Titanium · Valved'
            } else if (rawName.includes('KW')) {
              shortSpec = '3-Way Adjustable · Track'
            } else if (rawName.includes('Brembo')) {
              shortSpec = '380x34mm Monoblock'
            }

            // Concise category
            let shortCat = hw.category || ''
            if (/exhaust/i.test(shortCat)) shortCat = 'Exhaust'
            else if (/coilover|suspension/i.test(shortCat)) shortCat = 'Suspension'
            else if (/brake/i.test(shortCat)) shortCat = 'Brakes'

            return (
              <div
                key={hw.sku || hw.id}
                onClick={() => onToggleHardware && onToggleHardware(hw)}
                className={`p-2.5 rounded-lg border cursor-pointer transition-all overflow-hidden ${
                  isChecked
                    ? 'bg-primary/10 border-primary/40'
                    : 'bg-white/3 border-white/8 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <span className={`material-symbols-outlined text-base shrink-0 mt-0.5 ${isChecked ? 'text-primary' : 'text-white/30'}`}>
                      {isChecked ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[8px] font-mono text-white/40 uppercase">{hw.brand}</span>
                        <span className="px-1 py-0.2 rounded text-[7.5px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                          Verified
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white mt-0.5 leading-snug truncate" title={rawName}>
                        {shortName}
                      </p>
                      <p className="text-[9px] text-white/40 font-mono truncate">
                        {shortSpec}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-1">
                    <span className={`text-xs font-bold font-mono whitespace-nowrap block ${isChecked ? 'text-primary' : 'text-white/60'}`}>
                      +${(hw.priceUsd || 0).toLocaleString()} USD
                    </span>
                    <p className="text-[8px] text-white/30 uppercase mt-0.5 whitespace-nowrap">{shortCat}</p>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
