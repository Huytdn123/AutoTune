import React from 'react'

/**
 * ModelSelector - Presentational component for selecting a vehicle model
 * Keeps state & handler in ConfiguratorPage parent
 */
export default function ModelSelector({
  carList = [],
  selectedModelId,
  onSelectModel,
}) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-2 font-mono">
        Select Vehicle
      </p>
      {carList.map(car => {
        const isSelected = selectedModelId === car.id || selectedModelId === car.slug
        return (
          <button
            key={car.id}
            id={`car-model-${car.id}`}
            onClick={() => onSelectModel(car)}
            className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
              isSelected
                ? 'border-[#0213B2] bg-[#0213B2]/25 shadow-lg ring-1 ring-[#0213B2]/70'
                : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-4 h-4 rounded-full border border-white/40 shrink-0 shadow-sm"
                  style={{ backgroundColor: car.defaultBodyColor || car.defaultBody }}
                />
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-white tracking-wide truncate">
                    {car.brand} {car.model}
                  </p>
                  <p className="text-[10px] text-slate-300 font-mono mt-0.5 leading-tight truncate">
                    {car.tagline}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-bold font-mono text-white">
                  ${car.price ? car.price.toLocaleString() : '328,000'}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">{car.year}</p>
              </div>
            </div>
            {isSelected && (
              <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center gap-1.5 text-[10px] text-[#93C5FD] font-mono font-semibold">
                <span className="material-symbols-outlined text-sm text-[#60A5FA]">check_circle</span>
                <span>Currently selected · {car.badge || `${car.brand} Studio`}</span>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
