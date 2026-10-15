import React from 'react'

/**
 * ModelSelector - Presentational component for selecting a vehicle model
 * Keeps state & handler in ConfiguratorPage parent
 */
export default function ModelSelector({
  carList = [],
  selectedModelId,
  onSelectModel,
  isDark = true,
}) {
  return (
    <div className="space-y-2.5">
      <p className={`text-[11px] font-black uppercase tracking-wider mb-2 font-mono flex items-center justify-between ${
        isDark ? 'text-slate-300' : 'text-slate-800'
      }`}>
        <span>Select Vehicle</span>
        <span className={`text-[10px] font-mono font-semibold ${
          isDark ? 'text-white/40' : 'text-slate-500'
        }`}>{carList.length} Models Available</span>
      </p>
      {carList.map(car => {
        const isSelected = selectedModelId === car.id || selectedModelId === car.slug
        return (
          <button
            key={car.id}
            id={`car-model-${car.id}`}
            onClick={() => onSelectModel(car)}
            data-preserve-white="true"
            data-preserve-bg="true"
            className={`w-full p-3.5 rounded-xl text-left transition-all cursor-pointer ${
              isSelected
                ? isDark
                  ? 'border-2 border-[#3B82F6] bg-[#0213B2]/30 shadow-lg ring-2 ring-[#3B82F6]/50'
                  : 'border-2 border-[#0213B2] bg-blue-50/95 shadow-md ring-2 ring-[#0213B2]/30'
                : isDark
                  ? 'border border-white/15 bg-white/[0.04] hover:border-white/30 hover:bg-white/[0.08]'
                  : 'border-2 border-slate-300/90 bg-white hover:border-slate-400 hover:bg-slate-50/80 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-5 h-5 rounded-full border-2 shrink-0 shadow-sm ${
                    isSelected
                      ? isDark ? 'border-white' : 'border-[#0213B2]'
                      : isDark ? 'border-white/40' : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: car.defaultBodyColor || car.defaultBody }}
                />
                <div className="min-w-0">
                  <p className={`text-[13px] font-black tracking-tight truncate ${
                    isSelected
                      ? isDark ? 'text-white' : 'text-[#0213B2]'
                      : isDark ? 'text-white' : 'text-slate-950'
                  }`}>
                    {car.brand} {car.model}
                  </p>
                  <p className={`text-[11px] font-mono mt-0.5 leading-tight truncate ${
                    isSelected
                      ? isDark ? 'text-blue-200' : 'text-slate-700 font-medium'
                      : isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {car.tagline}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-[13px] font-black font-mono ${
                  isSelected
                    ? isDark ? 'text-white' : 'text-[#0213B2]'
                    : isDark ? 'text-white' : 'text-slate-950'
                }`}>
                  ${car.price ? car.price.toLocaleString() : '328,000'}
                </p>
                <p className={`text-[10px] font-mono font-bold ${
                  isSelected
                    ? isDark ? 'text-blue-300' : 'text-slate-600'
                    : isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>{car.year}</p>
              </div>
            </div>
            {isSelected && (
              <div className={`mt-2.5 pt-2 border-t flex items-center gap-1.5 text-[11px] font-mono font-bold ${
                isDark
                  ? 'border-white/20 text-blue-300'
                  : 'border-blue-200 text-[#0213B2]'
              }`}>
                <span className={`material-symbols-outlined text-sm ${
                  isDark ? 'text-[#60A5FA]' : 'text-[#0213B2]'
                }`}>check_circle</span>
                <span>Currently selected · {car.badge || `${car.brand} Studio`}</span>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
