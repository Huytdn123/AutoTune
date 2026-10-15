import React from 'react'

/**
 * SpecsViewer - Presentational component for viewing car technical specifications
 * Keeps state & activeTab handler in ConfiguratorPage parent
 */
export default function SpecsViewer({
  activeCar,
  activeTab = 'performance',
  onTabChange,
  isDark = true,
}) {
  if (!activeCar || !activeCar.specs) return null

  return (
    <div className="space-y-3">
      {/* Sub-tabs */}
      <div className={`flex gap-1 p-1 rounded-xl border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-slate-200/90 border-slate-300'
      }`}>
        {Object.keys(activeCar.specs).map(key => (
          <button
            key={key}
            onClick={() => onTabChange && onTabChange(key)}
            data-preserve-white="true"
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
              activeTab === key
                ? isDark
                  ? 'bg-white/20 text-white shadow-xs border-white/30'
                  : 'bg-[#0213B2] text-white shadow-xs border-[#0213B2]'
                : isDark
                  ? 'bg-transparent border-transparent text-white/50 hover:text-white'
                  : 'bg-white border-slate-300 text-slate-800 hover:text-slate-950 shadow-2xs'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Specs Details Card */}
      <div
        data-preserve-white="true"
        className={`p-3.5 rounded-xl border-2 shadow-xs space-y-1.5 ${
          isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-slate-300'
        }`}
      >
        {(activeCar.specs[activeTab] || []).map(item => (
          <div
            key={item.label}
            className={`flex justify-between items-center py-1.5 border-b last:border-0 ${
              isDark ? 'border-white/8' : 'border-slate-200'
            }`}
          >
            <span className={`text-[11px] font-bold ${
              isDark ? 'text-white/60' : 'text-slate-600'
            }`}>{item.label}</span>
            <span className={`text-[12px] font-black font-mono text-right max-w-[60%] ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Car brand badge */}
      <div
        data-preserve-white="true"
        className="p-3.5 rounded-xl text-center border-2 shadow-xs"
        style={{
          backgroundColor: isDark ? activeCar.accentColor + '15' : '#FFFFFF',
          borderColor: isDark ? activeCar.accentColor + '40' : '#CBD5E1'
        }}
      >
        <p className={`text-[10px] font-mono uppercase font-black tracking-widest ${
          isDark ? 'text-white/50' : 'text-slate-600'
        }`}>{activeCar.badge}</p>
        <p className="text-lg font-black mt-0.5 tracking-tight" style={{ color: activeCar.accentColor }}>{activeCar.model}</p>
        <p className={`text-[10px] mt-0.5 font-mono font-bold ${
          isDark ? 'text-white/40' : 'text-slate-500'
        }`}>{activeCar.brand} · {activeCar.year}</p>
      </div>
    </div>
  )
}
