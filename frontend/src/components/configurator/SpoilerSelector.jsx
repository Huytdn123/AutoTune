import React from 'react'

/**
 * SpoilerSelector - Presentational component for Rear Spoiler & Wing Selection (Group 3)
 * Controls Big Country Labs Style GT Wing Checkbox (Unchecked by default)
 * Keeps selectedSpoiler state and handleToggleSpoiler handler in ConfiguratorPage parent
 */
export default function SpoilerSelector({
  partsCatalog = [],
  selectedSpoiler,
  onToggleSpoiler,
}) {
  const spoilerPart = partsCatalog.find(p => p.sku === 'GEN-GTWING-F458') || {
    sku: 'GEN-GTWING-F458',
    name: 'Big Country Labs Style GT Wing',
    partName: 'Big Country Labs Style GT Wing',
    priceUsd: 2450,
    brand: 'Big Country Labs'
  }
  const isChecked = Boolean(selectedSpoiler)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-xs text-primary">air</span>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-white/70">3. Rear Spoiler & Wing</h4>
        </div>
        <span className="text-[9px] font-mono text-white/30">Track Downforce Wing</span>
      </div>

      <div className="space-y-2">
        <div
          key={spoilerPart.sku}
          onClick={() => onToggleSpoiler && onToggleSpoiler(spoilerPart)}
          className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
            isChecked
              ? 'bg-primary/10 border-primary/60 ring-1 ring-primary/40'
              : 'bg-white/3 border-white/8 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-base ${isChecked ? 'text-primary' : 'text-white/30'}`}>
                {isChecked ? 'check_box' : 'check_box_outline_blank'}
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-mono text-primary uppercase font-bold">Big Country Labs</span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    Direct Decklid Fit
                  </span>
                </div>
                <p className="text-xs font-bold text-white mt-0.5">{spoilerPart.name || spoilerPart.partName}</p>
                <p className="text-[9px] text-white/40 font-mono">Dark Carbon Airfoil · Twin Decklid Uprights · CC BY 4.0</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className={`text-xs font-bold font-mono ${isChecked ? 'text-primary' : 'text-white/70'}`}>
                +${(spoilerPart.priceUsd || 2450).toLocaleString()} USD
              </span>
              <p className="text-[8px] text-white/30 uppercase mt-0.5">Reference Price</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
