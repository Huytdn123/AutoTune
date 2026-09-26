import React, { useState, useCallback, Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import {
  FerrariModel,
  ShowroomFloor,
  StudioLights,
  AnimatedGrid,
  CarLoadingFallback,
} from '../components/CarScene3D'

/**
 * ConfiguratorPage - 3D Vehicle Configurator Studio
 * Ferrari 458 Italia · Virtual Tune Automotive Precision System
 * Model by vicent091036 · Official Three.js GLTF Model
 */

// ─── Color presets ────────────────────────────────────────────────────────────
const BODY_COLORS = [
  { hex: '#CC0000', name: 'Rosso Corsa', finish: 'Metallic' },
  { hex: '#0A1A6E', name: 'Blu Tour de France', finish: 'Metallic' },
  { hex: '#FAFAFA', name: 'Bianco Avus', finish: 'Pearl' },
  { hex: '#1A1A1A', name: 'Nero Daytona', finish: 'Matte' },
  { hex: '#F5C400', name: 'Giallo Modena', finish: 'Metallic' },
  { hex: '#1B4D1B', name: 'Verde Britannique', finish: 'Satin' },
  { hex: '#B87A2A', name: 'Bronzo Fiorano', finish: 'Metallic' },
  { hex: '#7A7A7A', name: 'Grigio Silverstone', finish: 'Metallic' },
]

const RIM_COLORS = [
  { hex: '#CCCCCC', name: 'Argento' },
  { hex: '#1A1A1A', name: 'Nero Lucido' },
  { hex: '#B87A2A', name: 'Oro Spazzolato' },
  { hex: '#CC0000', name: 'Rosso Accento' },
  { hex: '#4A4A4A', name: 'Grigio Antracite' },
]

const GLASS_COLORS = [
  { hex: '#C8D8F0', name: 'Neutro' },
  { hex: '#1A1A1A', name: 'Fumé Scuro' },
  { hex: '#3A5A3A', name: 'Verde Fumé' },
  { hex: '#FAFAFA', name: 'Trasparente' },
]

// ─── Side panel config sections ───────────────────────────────────────────────
const SPEC_DATA = {
  performance: [
    { label: 'Engine', value: '4.5L V8 Naturally Aspirated' },
    { label: 'Power', value: '562 hp @ 9,000 rpm' },
    { label: 'Torque', value: '398 lb-ft @ 6,000 rpm' },
    { label: '0–100 km/h', value: '3.4 seconds' },
    { label: 'Top Speed', value: '325 km/h' },
    { label: 'Transmission', value: '7-speed Dual Clutch' },
    { label: 'Weight', value: '1,380 kg' },
  ],
  aerodynamics: [
    { label: 'Downforce', value: '140 kg @ 200 km/h' },
    { label: 'Front Splitter', value: 'Carbon Fibre Fixed' },
    { label: 'Diffuser', value: 'Active Variable' },
    { label: 'Cd', value: '0.33' },
    { label: 'Cl', value: '-0.26' },
  ],
  suspension: [
    { label: 'Front', value: 'Double Wishbone MagneRide' },
    { label: 'Rear', value: 'Multi-Link Adaptive' },
    { label: 'Dampers', value: 'Magneto-rheological' },
    { label: 'Springs', value: 'Coilover Adjustable' },
  ],
}

export default function ConfiguratorPage() {
  const navigate = useNavigate()
  const orbitRef = useRef()

  const [bodyColor, setBodyColor] = useState('#CC0000')
  const [rimColor, setRimColor] = useState('#CCCCCC')
  const [glassColor, setGlassColor] = useState('#C8D8F0')
  const [isAnimating, setIsAnimating] = useState(true)
  const [activeTab, setActiveTab] = useState('performance')
  const [activeSection, setActiveSection] = useState('color') // 'color' | 'specs' | 'options'
  const [selectedBody, setSelectedBody] = useState(BODY_COLORS[0])
  const [selectedRim, setSelectedRim] = useState(RIM_COLORS[0])
  const [selectedGlass, setSelectedGlass] = useState(GLASS_COLORS[0])

  const totalBuild = 328000

  const handleBodyColor = useCallback((color) => {
    setSelectedBody(color)
    setBodyColor(color.hex)
  }, [])

  const handleRimColor = useCallback((color) => {
    setSelectedRim(color)
    setRimColor(color.hex)
  }, [])

  const handleGlassColor = useCallback((color) => {
    setSelectedGlass(color)
    setGlassColor(color.hex)
  }, [])

  return (
    <div className="bg-[#0d0d12] text-white antialiased h-[calc(100vh-4rem)] flex flex-col w-full overflow-hidden select-none font-sans">

      {/* ── MAIN LAYOUT (Pure 2-Panel Split: 3D Viewport + Control Panel) ── */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* ── 3D CANVAS ───────────────────────────────────────────────────── */}
        <main className="flex-1 relative bg-[#0d0d12] overflow-hidden">

          {/* Vignette overlay */}
          <div className="absolute inset-0 pointer-events-none z-10"
            style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)' }} />

          {/* Car name watermark */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <div className="text-[11px] font-mono text-white/20 uppercase tracking-[0.3em]">Ferrari</div>
            <div className="text-3xl font-black text-white/6 uppercase tracking-tight leading-none">458 Italia</div>
          </div>

          {/* Instruction hint */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/40 text-[10px]">
              <span className="material-symbols-outlined text-sm">mouse</span>
              Drag to orbit · Scroll to zoom · Right-click to pan
            </div>
          </div>

          {/* THREE.JS CANVAS */}
          <Canvas
            camera={{ position: [4.5, 2, 7], fov: 40 }}
            shadows
            dpr={[1, 2]}
            gl={{ antialias: true, toneMapping: 3, toneMappingExposure: 1.2 }}
            style={{ background: 'transparent' }}
          >
            {/* Environment: venice sunset for realistic car reflections */}
            <Environment
              files="https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr"
              background={false}
            />

            <StudioLights />
            <AnimatedGrid isAnimating={isAnimating} />

            <Suspense fallback={<CarLoadingFallback />}>
              <FerrariModel
                bodyColor={bodyColor}
                detailsColor={rimColor}
                glassColor={glassColor}
                isAnimating={isAnimating}
              />
              <ShowroomFloor />
            </Suspense>

            <OrbitControls
              ref={orbitRef}
              enablePan={true}
              enableZoom={true}
              minDistance={3}
              maxDistance={15}
              maxPolarAngle={Math.PI / 2.1}
              target={[0, 0.5, 0]}
              autoRotate={false}
              enableDamping
              dampingFactor={0.05}
            />
          </Canvas>

          {/* ── BOTTOM VIEW CONTROLS ─────────────────────────────────────── */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2 py-1 rounded-xl bg-[#0d0d12]/90 backdrop-blur-md border border-white/10 shadow-xl">
            {[
              { label: 'Front 3/4', cam: [4.5, 1.8, 7] },
              { label: 'Side', cam: [8, 1.5, 0] },
              { label: 'Rear 3/4', cam: [-4.5, 1.8, -7] },
              { label: 'Top Down', cam: [0, 9, 0.1] },
              { label: 'Front', cam: [0, 1.5, 8] },
            ].map(view => (
              <button
                key={view.label}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white/50 hover:text-white hover:bg-white/8 transition-all"
              >
                {view.label}
              </button>
            ))}
          </div>
        </main>

        {/* ── SIDE PANEL (Always fits screen so both green boxes show together) ── */}
        <aside className="w-[330px] flex flex-col bg-[#0f0f16] border-l border-white/8 h-full shrink-0 z-20 min-h-0">

          {/* Header */}
          <div className="px-4 pt-3.5 pb-2.5 border-b border-white/8 shrink-0">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-black text-white tracking-wide uppercase">Ferrari 458 Italia</h2>
                <p className="text-[10px] text-white/40 mt-0.5 font-mono">4.5L V8 · 562hp · 0-100: 3.4s</p>
              </div>
              <div className="px-2 py-0.5 rounded-md bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                2009–2015
              </div>
            </div>

            {/* Section Tabs */}
            <div className="flex gap-1 mt-2.5 p-1 rounded-lg bg-white/5">
              {[
                { id: 'color', icon: 'palette', label: 'Color' },
                { id: 'specs', icon: 'speed', label: 'Specs' },
                { id: 'options', icon: 'tune', label: 'Options' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex-1 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
                    activeSection === tab.id
                      ? 'bg-primary text-on-primary shadow-lg shadow-primary/30'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content (Scrollable if needed on very small screens, compact by default) */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 min-h-0"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}>

            {/* ── COLOR TAB ───────────────────────────────────────────────── */}
            {activeSection === 'color' && (
              <div className="space-y-3">

                {/* Body Color */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50">Body Paint</h3>
                      <p className="text-xs font-bold text-white leading-tight">{selectedBody.name}</p>
                      <p className="text-[9px] font-mono text-white/30">{selectedBody.finish} · {selectedBody.hex}</p>
                    </div>
                    <div
                      className="w-8 h-8 rounded-lg border-2 border-white/20 shadow-md shrink-0"
                      style={{ backgroundColor: selectedBody.hex }}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {BODY_COLORS.map(c => (
                      <button
                        key={c.hex}
                        onClick={() => handleBodyColor(c)}
                        title={c.name}
                        className={`relative h-7 rounded-md transition-all duration-150 ${
                          selectedBody.hex === c.hex
                            ? 'ring-2 ring-primary ring-offset-1 ring-offset-[#0f0f16] scale-105'
                            : 'hover:scale-102 ring-1 ring-white/10'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {selectedBody.hex === c.hex && (
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
                      <p className="text-xs font-bold text-white leading-tight">{selectedRim.name}</p>
                    </div>
                    <div
                      className="w-6 h-6 rounded-md border border-white/20 shadow shrink-0"
                      style={{ backgroundColor: selectedRim.hex }}
                    />
                  </div>
                  <div className="flex gap-1.5">
                    {RIM_COLORS.map(c => (
                      <button
                        key={c.hex}
                        onClick={() => handleRimColor(c)}
                        title={c.name}
                        className={`flex-1 h-6 rounded-md transition-all ${
                          selectedRim.hex === c.hex
                            ? 'ring-2 ring-primary ring-offset-1 ring-offset-[#0f0f16] scale-105'
                            : 'hover:scale-102 ring-1 ring-white/10'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                <div className="h-px bg-white/6" />

                {/* Glass Color */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50">Glass Tint</h3>
                      <p className="text-xs font-bold text-white leading-tight">{selectedGlass.name}</p>
                    </div>
                    <div
                      className="w-6 h-6 rounded-md border border-white/20 shadow shrink-0"
                      style={{ backgroundColor: selectedGlass.hex, opacity: 0.8 }}
                    />
                  </div>
                  <div className="flex gap-1.5">
                    {GLASS_COLORS.map(c => (
                      <button
                        key={c.hex}
                        onClick={() => handleGlassColor(c)}
                        title={c.name}
                        className={`flex-1 h-6 rounded-md transition-all ${
                          selectedGlass.hex === c.hex
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
                      onChange={e => {
                        setBodyColor(e.target.value)
                        setSelectedBody({ hex: e.target.value, name: 'Custom', finish: 'Custom' })
                      }}
                      className="w-7 h-7 rounded border border-white/20 cursor-pointer bg-transparent"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={bodyColor}
                        onChange={e => {
                          const val = e.target.value
                          if (/^#[0-9a-fA-F]{6}$/.test(val)) {
                            setBodyColor(val)
                            setSelectedBody({ hex: val, name: 'Custom', finish: 'Custom' })
                          }
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs font-mono text-white/70 focus:outline-none focus:border-primary"
                        placeholder="#CC0000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── SPECS TAB ───────────────────────────────────────────────── */}
            {activeSection === 'specs' && (
              <div className="space-y-3">
                {/* Sub-tabs */}
                <div className="flex gap-1 p-0.5 rounded-lg bg-white/5">
                  {Object.keys(SPEC_DATA).map(key => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`flex-1 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all ${
                        activeTab === key ? 'bg-white/15 text-white' : 'text-white/30 hover:text-white/60'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  {SPEC_DATA[activeTab].map(item => (
                    <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                      <span className="text-[10px] text-white/40 font-medium">{item.label}</span>
                      <span className="text-[11px] text-white font-bold font-mono text-right max-w-[55%]">{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Ferrari badge */}
                <div className="p-3 rounded-lg bg-[#CC0000]/10 border border-[#CC0000]/30 text-center">
                  <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Ferrari S.p.A.</p>
                  <p className="text-lg font-black text-[#CC0000] mt-0.5">458 Italia</p>
                  <p className="text-[9px] text-white/30 mt-0.5 font-mono">Maranello, Italy · 2009–2015</p>
                </div>
              </div>
            )}

            {/* ── OPTIONS TAB ─────────────────────────────────────────────── */}
            {activeSection === 'options' && (
              <div className="space-y-2">
                {[
                  { icon: 'radio_button_checked', name: 'Carbon Ceramic Brakes', desc: 'Brembo CCM · 398mm front', price: '$12,800', active: true },
                  { icon: 'directions_car', name: 'Racing Exhaust System', desc: 'Akrapovič Titanium · -15kg', price: '$8,900', active: true },
                  { icon: 'tune', name: 'Sport Suspension', desc: 'Ferrari SCM-E II Adaptive', price: '$4,200', active: false },
                  { icon: 'speed', name: 'Track Package', desc: 'Roll cage, harness, data logger', price: '$22,500', active: false },
                  { icon: 'build', name: 'Carbon Interior', desc: 'Full Alcantara + Carbon Fibre', price: '$9,600', active: false },
                  { icon: 'shield', name: 'Paint Protection Film', desc: 'Stek DYNOshield 8.5 mil TPU', price: '$3,800', active: false },
                ].map(opt => (
                  <div key={opt.name} className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    opt.active
                      ? 'bg-primary/10 border-primary/40'
                      : 'bg-white/3 border-white/8 hover:border-white/20'
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <span className={`material-symbols-outlined text-base mt-0.5 ${opt.active ? 'text-primary' : 'text-white/30'}`}>
                          {opt.icon}
                        </span>
                        <div>
                          <p className={`text-xs font-bold ${opt.active ? 'text-white' : 'text-white/70'}`}>{opt.name}</p>
                          <p className="text-[9px] text-white/30 mt-0.5">{opt.desc}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold font-mono shrink-0 ${opt.active ? 'text-primary' : 'text-white/40'}`}>
                        {opt.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── FOOTER / CTA (Green Box 2: Always Fixed & Visible) ────────── */}
          <div className="px-4 py-2.5 border-t border-white/8 shrink-0 bg-[#0a0a0f]">
            {/* Color summary strip */}
            <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-white/5 border border-white/8">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded border border-white/15 shrink-0" style={{ backgroundColor: bodyColor }} title="Body" />
                <div className="w-4 h-4 rounded border border-white/15 shrink-0" style={{ backgroundColor: rimColor }} title="Rims" />
                <div className="w-4 h-4 rounded border border-white/15 opacity-75 shrink-0" style={{ backgroundColor: glassColor }} title="Glass" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] text-white/40 uppercase tracking-wider leading-none">Current Config</p>
                <p className="text-[11px] text-white font-semibold truncate mt-0.5">{selectedBody.name} · {selectedBody.finish}</p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Estimated Total</span>
              <span className="text-lg font-black text-primary font-mono">
                ${totalBuild.toLocaleString()}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate('/quotation')}
                className="flex-1 py-2 px-2.5 rounded-lg bg-white/8 border border-white/15 hover:border-white/30 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
              >
                <span className="material-symbols-outlined text-xs">bookmark</span>
                Save Build
              </button>
              <button
                onClick={() => navigate('/quotation')}
                className="flex-1 py-2 px-2.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-[11px] font-bold flex items-center justify-center gap-1 transition-all shadow-md shadow-primary/30"
              >
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
                Get Quote
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
