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
      <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">Select Vehicle</p>
      {carList.map(car => (
        <button
          key={car.id}
          id={`car-model-${car.id}`}
          onClick={() => onSelectModel(car)}
          className={`w-full p-3 rounded-lg border text-left transition-all ${
            selectedModelId === car.id
              ? 'border-primary/60 bg-primary/10'
              : 'border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/6'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                style={{ backgroundColor: car.defaultBody }}
              />
              <div>
                <p className={`text-xs font-bold ${selectedModelId === car.id ? 'text-primary' : 'text-white'}`}>
                  {car.brand} {car.model}
                </p>
                <p className="text-[9px] text-white/30 font-mono mt-0.5">{car.tagline}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[9px] font-bold font-mono" style={{ color: car.accentColor }}>
                ${car.price.toLocaleString()}
              </p>
              <p className="text-[8px] text-white/25">{car.year}</p>
            </div>
          </div>
          {selectedModelId === car.id && (
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1 text-[9px] text-primary/70 font-mono">
              <span className="material-symbols-outlined text-xs">check_circle</span>
              Currently selected · {car.badge}
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
