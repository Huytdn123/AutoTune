import React from 'react'

/**
 * CameraPresetsBar - Presentational component for camera angle switching and auto-rotate
 * Supports Front, Side, Rear, Top, Front 3/4, Rear 3/4 presets and 360° turntable toggle
 */
export default function CameraPresetsBar({
  onSelectPreset,
  activePreset = 'Front 3/4',
  autoRotate = false,
  onToggleAutoRotate,
  prefersReducedMotion = false,
  isDark = true
}) {
  const PRESET_VIEWS = [
    { id: '34_front', label: '3/4 Front', cam: [4.6, 1.9, 5.5],  target: [0, 0.45, 0] },
    { id: 'front',    label: 'Front',     cam: [0, 1.3, 6.2],    target: [0, 0.45, 0] },
    { id: 'side',     label: 'Side',      cam: [6.8, 1.2, 0],    target: [0, 0.45, 0] },
    { id: 'rear',     label: 'Rear',      cam: [0, 1.4, -6.2],   target: [0, 0.45, 0] },
    { id: '34_rear',  label: '3/4 Rear',  cam: [-4.6, 1.9, -5.5], target: [0, 0.45, 0] },
    { id: 'top',      label: 'Top',       cam: [0, 7.8, 0.2],    target: [0, 0.45, 0] },
  ]

  return (
    <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md shadow-2xl max-w-[calc(100vw-2rem)] overflow-x-auto no-scrollbar transition-colors ${
      isDark
        ? 'bg-[#0d0d12]/95 border border-white/15 text-white'
        : 'bg-white/95 border border-slate-300 text-slate-800 shadow-xl shadow-slate-400/20'
    }`}>
      <div className="flex items-center gap-1">
        {PRESET_VIEWS.map(view => {
          const isActive = activePreset === view.label || activePreset === view.id
          return (
            <button
              key={view.id}
              onClick={() => onSelectPreset && onSelectPreset(view.cam, view.target, view.label)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? isDark
                    ? 'bg-[#0213B2] text-white font-bold border-[#3B82F6]/60 shadow-md ring-1 ring-[#3B82F6]/40'
                    : 'bg-[#0213B2] text-white font-bold border-[#0213B2] shadow-sm'
                  : isDark
                    ? 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-white hover:border-slate-300 shadow-2xs'
              }`}
              title={`View ${view.label}`}
            >
              {view.label}
            </button>
          )
        })}
      </div>

      {onToggleAutoRotate && (
        <>
          <div className={`h-4 w-px mx-0.5 shrink-0 ${isDark ? 'bg-white/20' : 'bg-slate-300'}`} />
          <button
            onClick={onToggleAutoRotate}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              autoRotate
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30 font-bold ring-1 ring-emerald-400/40'
                : isDark
                  ? 'bg-white/10 border-white/20 text-white/80 hover:text-white hover:bg-white/15 hover:border-white/30'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-200 hover:border-slate-400 font-semibold shadow-2xs'
            }`}
            title={
              prefersReducedMotion && !autoRotate
                ? 'Auto-rotate disabled by default (prefers-reduced-motion active). Click to turn on.'
                : autoRotate
                  ? 'Click to Stop 360° Auto-Rotate'
                  : 'Click to Start 360° Auto-Rotate'
            }
          >
            <span
              className={`material-symbols-outlined text-xs ${autoRotate ? 'animate-spin' : ''}`}
              style={{ animationDuration: '2.5s' }}
            >
              sync
            </span>
            <span>360°</span>
            {autoRotate ? (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse ml-0.5" title="360° Active" />
            ) : (
              <span className={`text-[9px] font-mono px-1 py-0.2 rounded border ${
                isDark ? 'bg-black/30 border-white/15 text-white/50' : 'bg-white border-slate-300 text-slate-600'
              }`}>OFF</span>
            )}
          </button>
        </>
      )}
    </div>
  )
}

