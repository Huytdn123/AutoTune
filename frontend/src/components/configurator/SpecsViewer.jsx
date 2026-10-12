import React from 'react'

/**
 * SpecsViewer - Presentational component for viewing car technical specifications
 * Keeps state & activeTab handler in ConfiguratorPage parent
 */
export default function SpecsViewer({
  activeCar,
  activeTab = 'performance',
  onTabChange,
}) {
  if (!activeCar || !activeCar.specs) return null

  return (
    <div className="space-y-2">
      {/* Sub-tabs */}
      <div className="flex gap-1 p-0.5 rounded-md bg-white/5">
        {Object.keys(activeCar.specs).map(key => (
          <button
            key={key}
            onClick={() => onTabChange && onTabChange(key)}
            className={`flex-1 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-wider transition-all ${
              activeTab === key ? 'bg-white/15 text-white' : 'text-white/30 hover:text-white/60'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="space-y-0.5">
        {(activeCar.specs[activeTab] || []).map(item => (
          <div key={item.label} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
            <span className="text-[9.5px] text-white/40 font-medium">{item.label}</span>
            <span className="text-[10.5px] text-white font-bold font-mono text-right max-w-[55%]">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Car brand badge */}
      <div className="p-2 rounded-md text-center border" style={{ backgroundColor: activeCar.accentColor + '15', borderColor: activeCar.accentColor + '40' }}>
        <p className="text-[8.5px] font-mono text-white/30 uppercase tracking-widest">{activeCar.badge}</p>
        <p className="text-base font-black mt-0.5" style={{ color: activeCar.accentColor }}>{activeCar.model}</p>
        <p className="text-[8.5px] text-white/30 mt-0.5 font-mono">{activeCar.brand} · {activeCar.year}</p>
      </div>
    </div>
  )
}
