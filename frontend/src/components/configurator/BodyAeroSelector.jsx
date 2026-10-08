import React from 'react'

/**
 * BodyAeroSelector - Presentational component for Body & Aerodynamics Selection (Group 2)
 * Controls Carbon Fiber Aerodynamics Package Checkbox (Unchecked by default)
 * Keeps selectedBodykit state and handleToggleBodykit handler in ConfiguratorPage parent
 */
export default function BodyAeroSelector({
  partsCatalog = [],
  selectedBodykit,
  onToggleBodykit,
}) {
  const aeroPart = partsCatalog.find(
    p => p.sku === 'CARB-AERO-F458' || p.sku === 'VOR-CF-AERO-992'
  ) || {
    sku: 'CARB-AERO-F458',
    name: 'Carbon Fiber Aerodynamics Package',
    partName: 'Carbon Fiber Aerodynamics Package',
    brand: 'Track Aerodynamics',
    priceUsd: 3200,
    material: 'Pre-preg 2x2 Carbon Fiber'
  }

  const isChecked = Boolean(selectedBodykit)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-xs text-primary">view_in_ar</span>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-white/70">2. Body & Aerodynamics</h4>
        </div>
        <span className="text-[9px] font-mono text-white/30">Aerodynamics Package</span>
      </div>

      <div className="space-y-2">
        <div
          key={aeroPart.sku}
          onClick={() => onToggleBodykit && onToggleBodykit(aeroPart)}
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
                  <span className="text-[8px] font-mono text-primary uppercase font-bold">Track Spec</span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    Aero Extension
                  </span>
                </div>
                <p className="text-xs font-bold text-white mt-0.5">{aeroPart.name || aeroPart.partName}</p>
                <p className="text-[9px] text-white/40 font-mono">Carbon Front Splitter Extension · Side Skirts · Rear Diffuser</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className={`text-xs font-bold font-mono ${isChecked ? 'text-primary' : 'text-white/70'}`}>
                +${(aeroPart.priceUsd || 3200).toLocaleString()} USD
              </span>
              <p className="text-[8px] text-white/30 uppercase mt-0.5">Reference Price</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
