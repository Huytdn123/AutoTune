import React from 'react'

/**
 * CameraPresetsBar - Presentational component for camera angle switching buttons
 * Snaps camera smoothly to pre-configured angles
 */
export default function CameraPresetsBar({ onSelectPreset }) {
  const PRESET_VIEWS = [
    { label: 'Front 3/4', cam: [4.6, 1.9, 5.5] },
    { label: 'Side',      cam: [6.8, 1.2, 0] },
    { label: 'Rear 3/4',  cam: [-4.6, 1.9, -5.5] },
    { label: 'Front',     cam: [0, 1.3, 6.2] },
    { label: 'Top Down',  cam: [0, 8.0, 0.2] },
  ]

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2 py-1 rounded-xl bg-[#0d0d12]/90 backdrop-blur-md border border-white/10 shadow-xl">
      {PRESET_VIEWS.map(view => (
        <button
          key={view.label}
          onClick={() => onSelectPreset && onSelectPreset(view.cam)}
          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white/50 hover:text-white hover:bg-white/8 transition-all cursor-pointer"
        >
          {view.label}
        </button>
      ))}
    </div>
  )
}
