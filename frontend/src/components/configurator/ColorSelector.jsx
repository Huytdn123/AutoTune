import React from 'react'

/**
 * ColorSelector - Presentational component for Vehicle Color Customization
 * Controls Body Paint, Rim Finish, Cockpit Leather, Glass Tint, and Custom Hex
 * All state & handlers remain in ConfiguratorPage parent
 */
export default function ColorSelector({
  bodyColors = [],
  rimColors = [],
  interiorColors = [],
  glassColors = [],
  selectedBody,
  selectedRim,
  selectedInterior,
  selectedGlass,
  bodyColor,
  onBodyColorChange,
  onRimColorChange,
  onInteriorColorChange,
  onGlassColorChange,
  onCustomBodyColorChange,
  isDark = true,
}) {
  return (
    <div className="space-y-3.5">
      {/* Body Color */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className={`text-[11px] font-black uppercase tracking-wider ${
              isDark ? 'text-white/50' : 'text-slate-800'
            }`}>Body Paint</h3>
            <p className={`text-sm font-black leading-tight mt-0.5 ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>{selectedBody?.name}</p>
            <p className={`text-[10px] font-mono font-semibold ${
              isDark ? 'text-white/40' : 'text-slate-600'
            }`}>{selectedBody?.finish} · {selectedBody?.hex}</p>
          </div>
          <div
            className={`w-9 h-9 rounded-xl border-2 shadow-sm shrink-0 ${
              isDark ? 'border-white/20' : 'border-slate-300'
            }`}
            style={{ backgroundColor: selectedBody?.hex }}
          />
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {bodyColors.map(c => (
            <button
              key={c.hex}
              onClick={() => onBodyColorChange && onBodyColorChange(c)}
              title={c.name}
              className={`relative h-7 rounded-lg transition-all duration-150 border cursor-pointer ${
                selectedBody?.hex === c.hex
                  ? isDark
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#0f0f16] scale-105 border-white'
                    : 'ring-2 ring-[#0213B2] ring-offset-2 ring-offset-white scale-105 border-[#0213B2] shadow-sm'
                  : isDark
                    ? 'hover:scale-102 border-white/20'
                    : 'hover:scale-102 border-slate-300/80 shadow-2xs'
              }`}
              style={{ backgroundColor: c.hex }}
            >
              {selectedBody?.hex === c.hex && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xs drop-shadow">check</span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className={`h-px ${isDark ? 'bg-white/10' : 'bg-slate-300/80'}`} />

      {/* Rim Color */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className={`text-[11px] font-black uppercase tracking-wider ${
              isDark ? 'text-white/50' : 'text-slate-800'
            }`}>Rim Finish</h3>
            <p className={`text-sm font-black leading-tight mt-0.5 ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>{selectedRim?.name}</p>
          </div>
          <div
            className={`w-8 h-8 rounded-lg border-2 shadow-sm shrink-0 ${
              isDark ? 'border-white/20' : 'border-slate-300'
            }`}
            style={{ backgroundColor: selectedRim?.hex }}
          />
        </div>
        <div className="flex gap-1.5">
          {rimColors.map(c => (
            <button
              key={c.hex}
              onClick={() => onRimColorChange && onRimColorChange(c)}
              title={c.name}
              className={`flex-1 h-7 rounded-lg transition-all border cursor-pointer ${
                selectedRim?.hex === c.hex
                  ? isDark
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#0f0f16] scale-105 border-white'
                    : 'ring-2 ring-[#0213B2] ring-offset-2 ring-offset-white scale-105 border-[#0213B2] shadow-sm'
                  : isDark
                    ? 'hover:scale-102 border-white/20'
                    : 'hover:scale-102 border-slate-300/80'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <div className={`h-px ${isDark ? 'bg-white/10' : 'bg-slate-300/80'}`} />

      {/* Interior Cockpit Leather */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className={`text-[11px] font-black uppercase tracking-wider ${
              isDark ? 'text-white/50' : 'text-slate-800'
            }`}>Cockpit Interior Leather</h3>
            <p className={`text-sm font-black leading-tight mt-0.5 ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>{selectedInterior?.name}</p>
            <p className={`text-[10px] font-mono font-semibold ${
              isDark ? 'text-white/40' : 'text-slate-600'
            }`}>{selectedInterior?.finish}</p>
          </div>
          <div
            className={`w-8 h-8 rounded-lg border-2 shadow-sm shrink-0 ${
              isDark ? 'border-white/20' : 'border-slate-300'
            }`}
            style={{ backgroundColor: selectedInterior?.hex }}
          />
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {interiorColors.map(c => (
            <button
              key={c.hex}
              onClick={() => onInteriorColorChange && onInteriorColorChange(c)}
              title={`${c.name} (${c.finish})`}
              className={`h-7 rounded-lg transition-all relative border cursor-pointer ${
                selectedInterior?.hex === c.hex
                  ? isDark
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#0f0f16] scale-105 border-white'
                    : 'ring-2 ring-[#0213B2] ring-offset-2 ring-offset-white scale-105 border-[#0213B2] shadow-sm'
                  : isDark
                    ? 'hover:scale-102 border-white/20'
                    : 'hover:scale-102 border-slate-300/80'
              }`}
              style={{ backgroundColor: c.hex }}
            >
              {selectedInterior?.hex === c.hex && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xs drop-shadow">check</span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className={`h-px ${isDark ? 'bg-white/10' : 'bg-slate-300/80'}`} />

      {/* Glass Color */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className={`text-[11px] font-black uppercase tracking-wider ${
              isDark ? 'text-white/50' : 'text-slate-800'
            }`}>Glass Tint</h3>
            <p className={`text-sm font-black leading-tight mt-0.5 ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>{selectedGlass?.name}</p>
          </div>
          <div
            className={`w-8 h-8 rounded-lg border-2 shadow-sm shrink-0 ${
              isDark ? 'border-white/20' : 'border-slate-300'
            }`}
            style={{ backgroundColor: selectedGlass?.hex, opacity: 0.8 }}
          />
        </div>
        <div className="flex gap-1.5">
          {glassColors.map(c => (
            <button
              key={c.hex}
              onClick={() => onGlassColorChange && onGlassColorChange(c)}
              title={c.name}
              className={`flex-1 h-7 rounded-lg transition-all border cursor-pointer ${
                selectedGlass?.hex === c.hex
                  ? isDark
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#0f0f16] scale-105 border-white'
                    : 'ring-2 ring-[#0213B2] ring-offset-2 ring-offset-white scale-105 border-[#0213B2] shadow-sm'
                  : isDark
                    ? 'hover:scale-102 border-white/20'
                    : 'hover:scale-102 border-slate-300/80'
              }`}
              style={{ backgroundColor: c.hex, opacity: 0.8 }}
            />
          ))}
        </div>
      </div>

      {/* Custom hex input */}
      <div
        data-preserve-white="true"
        className={`p-3 rounded-xl border-2 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-300 shadow-xs'
        }`}
      >
        <p className={`text-[10px] font-black uppercase tracking-wider mb-2 font-mono ${
          isDark ? 'text-white/50' : 'text-slate-800'
        }`}>Custom Body Color</p>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={bodyColor}
            onChange={e => onCustomBodyColorChange && onCustomBodyColorChange(e.target.value)}
            className={`w-8 h-8 rounded-lg border-2 cursor-pointer bg-transparent ${
              isDark ? 'border-white/20' : 'border-slate-300'
            }`}
          />
          <div className="flex-1">
            <input
              type="text"
              value={bodyColor}
              onChange={e => {
                const val = e.target.value
                if (/^#[0-9a-fA-F]{6}$/.test(val)) {
                  onCustomBodyColorChange && onCustomBodyColorChange(val)
                }
              }}
              data-preserve-white="true"
              className={`w-full rounded-lg px-3 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-[#0213B2] border-2 ${
                isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
              }`}
              placeholder="#CC0000"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
