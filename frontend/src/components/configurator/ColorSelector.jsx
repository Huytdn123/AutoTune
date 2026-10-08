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
}) {
  return (
    <div className="space-y-3">
      {/* Body Color */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50">Body Paint</h3>
            <p className="text-xs font-bold text-white leading-tight">{selectedBody?.name}</p>
            <p className="text-[9px] font-mono text-white/30">{selectedBody?.finish} · {selectedBody?.hex}</p>
          </div>
          <div
            className="w-8 h-8 rounded-lg border-2 border-white/20 shadow-md shrink-0"
            style={{ backgroundColor: selectedBody?.hex }}
          />
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {bodyColors.map(c => (
            <button
              key={c.hex}
              onClick={() => onBodyColorChange && onBodyColorChange(c)}
              title={c.name}
              className={`relative h-7 rounded-md transition-all duration-150 ${
                selectedBody?.hex === c.hex
                  ? 'ring-2 ring-primary ring-offset-1 ring-offset-[#0f0f16] scale-105'
                  : 'hover:scale-102 ring-1 ring-white/10'
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

      <div className="h-px bg-white/6" />

      {/* Rim Color */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50">Rim Finish</h3>
            <p className="text-xs font-bold text-white leading-tight">{selectedRim?.name}</p>
          </div>
          <div
            className="w-6 h-6 rounded-md border border-white/20 shadow shrink-0"
            style={{ backgroundColor: selectedRim?.hex }}
          />
        </div>
        <div className="flex gap-1.5">
          {rimColors.map(c => (
            <button
              key={c.hex}
              onClick={() => onRimColorChange && onRimColorChange(c)}
              title={c.name}
              className={`flex-1 h-6 rounded-md transition-all ${
                selectedRim?.hex === c.hex
                  ? 'ring-2 ring-primary ring-offset-1 ring-offset-[#0f0f16] scale-105'
                  : 'hover:scale-102 ring-1 ring-white/10'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <div className="h-px bg-white/6" />

      {/* Interior Cockpit Leather */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50">Cockpit Interior Leather</h3>
            <p className="text-xs font-bold text-white leading-tight">{selectedInterior?.name}</p>
            <p className="text-[9px] font-mono text-white/30">{selectedInterior?.finish}</p>
          </div>
          <div
            className="w-6 h-6 rounded-md border border-white/20 shadow shrink-0"
            style={{ backgroundColor: selectedInterior?.hex }}
          />
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {interiorColors.map(c => (
            <button
              key={c.hex}
              onClick={() => onInteriorColorChange && onInteriorColorChange(c)}
              title={`${c.name} (${c.finish})`}
              className={`h-7 rounded-md transition-all relative ${
                selectedInterior?.hex === c.hex
                  ? 'ring-2 ring-primary ring-offset-1 ring-offset-[#0f0f16] scale-105'
                  : 'hover:scale-102 ring-1 ring-white/10'
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

      <div className="h-px bg-white/6" />

      {/* Glass Color */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50">Glass Tint</h3>
            <p className="text-xs font-bold text-white leading-tight">{selectedGlass?.name}</p>
          </div>
          <div
            className="w-6 h-6 rounded-md border border-white/20 shadow shrink-0"
            style={{ backgroundColor: selectedGlass?.hex, opacity: 0.8 }}
          />
        </div>
        <div className="flex gap-1.5">
          {glassColors.map(c => (
            <button
              key={c.hex}
              onClick={() => onGlassColorChange && onGlassColorChange(c)}
              title={c.name}
              className={`flex-1 h-6 rounded-md transition-all ${
                selectedGlass?.hex === c.hex
                  ? 'ring-2 ring-primary ring-offset-1 ring-offset-[#0f0f16] scale-105'
                  : 'hover:scale-102 ring-1 ring-white/10'
              }`}
              style={{ backgroundColor: c.hex, opacity: 0.8 }}
            />
          ))}
        </div>
      </div>

      {/* Custom hex input */}
      <div className="p-2 rounded-lg bg-white/5 border border-white/8">
        <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1.5">Custom Body Color</p>
        <div className="flex gap-1.5 items-center">
          <input
            type="color"
            value={bodyColor}
            onChange={e => onCustomBodyColorChange && onCustomBodyColorChange(e.target.value)}
            className="w-7 h-7 rounded border border-white/20 cursor-pointer bg-transparent"
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
              className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs font-mono text-white/70 focus:outline-none focus:border-primary"
              placeholder="#CC0000"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
