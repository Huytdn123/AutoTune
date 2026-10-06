import React, { useState, useEffect, useCallback, Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  VehicleModel3D,
  FerrariModel,
  ShowroomFloor,
  StudioLights,
  AnimatedGrid,
  CarLoadingFallback,
  CAR_MODEL_FILES,
} from '../components/CarScene3D'
import { carApi, buildApi } from '../services/api'

/**
 * ConfiguratorPage - 3D Vehicle Configurator Studio
 * Real 3D Production Supercars & Sports Cars
 * Precision CAD Fitment & Automotive Customization Platform
 */

// ─── Shared color presets ─────────────────────────────────────────────────────
const BODY_COLORS = [
  { hex: '#CC0000', name: 'Rosso Corsa', finish: 'Metallic' },
  { hex: '#0A1A6E', name: 'Blu Tour de France', finish: 'Metallic' },
  { hex: '#FAFAFA', name: 'Bianco Avus', finish: 'Pearl' },
  { hex: '#1A1A1A', name: 'Nero Daytona', finish: 'Matte' },
  { hex: '#F5C400', name: 'Giallo Modena', finish: 'Metallic' },
  { hex: '#1B4D1B', name: 'Verde Britannique', finish: 'Satin' },
  { hex: '#B87A2A', name: 'Bronzo Fiorano', finish: 'Metallic' },
  { hex: '#7A7A7A', name: 'Grigio Silverstone', finish: 'Metallic' },
  { hex: '#FF6B00', name: 'McLaren Papaya Orange', finish: 'Metallic' },
  { hex: '#1B4D8E', name: 'Le Mans Blue', finish: 'Metallic' },
  { hex: '#2D5A27', name: 'Racing Green', finish: 'Satin' },
  { hex: '#8B0000', name: 'Midnight Burgundy', finish: 'Pearl' },
]

const RIM_COLORS = [
  { hex: '#CCCCCC', name: 'Argento' },
  { hex: '#1A1A1A', name: 'Nero Lucido' },
  { hex: '#B87A2A', name: 'Oro Spazzolato' },
  { hex: '#CC0000', name: 'Rosso Accento' },
  { hex: '#4A4A4A', name: 'Grigio Antracite' },
  { hex: '#0066CC', name: 'BMW Blau' },
  { hex: '#2D2D2D', name: 'Gunmetal' },
]

const GLASS_COLORS = [
  { hex: '#C8D8F0', name: 'Neutro' },
  { hex: '#1A1A1A', name: 'Fumé Scuro' },
  { hex: '#3A5A3A', name: 'Verde Fumé' },
  { hex: '#FAFAFA', name: 'Trasparente' },
]

export default function ConfiguratorPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orbitRef = useRef()

  // ── Car model selection (100% Backend DB Driven) ───────────────────────────
  const [carList, setCarList] = useState([])
  const [loadingCars, setLoadingCars] = useState(true)
  const [carError, setCarError] = useState(null)
  const [selectedModelId, setSelectedModelId] = useState(null)
  const activeCar = carList.find(c => c.id === selectedModelId || c.slug === selectedModelId) || carList[0] || null

  // ── Build persistence state ────────────────────────────────────────────────
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [buildNameInput, setBuildNameInput] = useState('')
  const [savedBuildData, setSavedBuildData] = useState(null)
  const [savingBuild, setSavingBuild] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [lastSavedConfig, setLastSavedConfig] = useState(null)

  // ── Color state ────────────────────────────────────────────────────────────
  const [bodyColor, setBodyColor]   = useState('#CC0000')
  const [rimColor,  setRimColor]    = useState('#CCCCCC')
  const [glassColor, setGlassColor] = useState('#C8D8F0')
  const [selectedBody,  setSelectedBody]  = useState(() => BODY_COLORS[0])
  const [selectedRim,   setSelectedRim]   = useState(() => RIM_COLORS[0])
  const [selectedGlass, setSelectedGlass] = useState(GLASS_COLORS[0])

  // Fetch cars directly from backend database
  const fetchCars = useCallback(async () => {
    setLoadingCars(true)
    setCarError(null)
    try {
      const cars = await carApi.getAll()
      if (Array.isArray(cars) && cars.length > 0) {
        setCarList(cars)
        const buildCode = searchParams.get('build') || searchParams.get('share')
        if (!buildCode) {
          const firstCar = cars[0]
          setSelectedModelId(firstCar.slug || firstCar.id)
          const defBody = firstCar.defaultBodyColor || firstCar.defaultBody || '#CC0000'
          const defRim = firstCar.defaultRimColor || firstCar.defaultRim || '#CCCCCC'
          const defGlass = firstCar.defaultGlassColor || firstCar.defaultGlass || '#C8D8F0'
          setBodyColor(defBody)
          setRimColor(defRim)
          setGlassColor(defGlass)
          setSelectedBody(BODY_COLORS.find(c => c.hex.toLowerCase() === defBody.toLowerCase()) || { hex: defBody, name: 'OEM Color', finish: 'OEM' })
          setSelectedRim(RIM_COLORS.find(c => c.hex.toLowerCase() === defRim.toLowerCase()) || { hex: defRim, name: 'OEM Rim' })
        }
      } else {
        setCarError('Không tìm thấy danh mục xe trong cơ sở dữ liệu. Vui lòng kiểm tra dịch vụ Backend.')
      }
    } catch (err) {
      console.error('Backend car fetch failed:', err)
      setCarError('Không thể kết nối đến máy chủ danh mục xe Backend (/api/cars). Vui lòng thử lại.')
    } finally {
      setLoadingCars(false)
    }
  }, [searchParams])

  useEffect(() => {
    fetchCars()
  }, [fetchCars])

  // ── Load build from ?build=CODE or ?share=CODE URL param ──────────────────
  useEffect(() => {
    const buildCode = searchParams.get('build') || searchParams.get('share')
    if (buildCode) {
      buildApi.getByCode(buildCode).then(build => {
        if (build) {
          const carIdentifier = build.car?.slug || build.car?.id || build.carSlug || build.carId
          if (carIdentifier) {
            setSelectedModelId(carIdentifier)
          }
          if (build.bodyColor) {
            setBodyColor(build.bodyColor)
            setSelectedBody(
              BODY_COLORS.find(c => c.hex.toLowerCase() === build.bodyColor.toLowerCase()) || 
              { hex: build.bodyColor, name: 'Custom Paint', finish: build.bodyFinish || 'Custom' }
            )
          }
          if (build.rimColor) {
            setRimColor(build.rimColor)
            setSelectedRim(
              RIM_COLORS.find(c => c.hex.toLowerCase() === build.rimColor.toLowerCase()) || 
              { hex: build.rimColor, name: 'Custom Rim' }
            )
          }
          if (build.glassColor) {
            setGlassColor(build.glassColor)
            setSelectedGlass(
              GLASS_COLORS.find(c => c.hex.toLowerCase() === build.glassColor.toLowerCase()) || 
              { hex: build.glassColor, name: 'Custom Tint' }
            )
          }
          setLastSavedConfig({
            carId: carIdentifier,
            bodyColor: build.bodyColor,
            rimColor: build.rimColor,
            glassColor: build.glassColor,
            buildData: build
          })
          setToastMessage(`Đã khôi phục bản độ 3D: ${build.buildName || build.shareCode} (${build.shareCode})`)
          setTimeout(() => setToastMessage(null), 4000)
        }
      }).catch(err => {
        console.warn('Could not load build from code:', err)
      })
    }
  }, [searchParams])

  // ── Viewer controls ────────────────────────────────────────────────────────
  const [activeTab,    setActiveTab]    = useState('performance')
  const [activeSection, setActiveSection] = useState('model')  // 'model'|'color'|'specs'|'options'
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Switch car model → reset colors to that car's defaults
  const handleModelSwitch = useCallback((car) => {
    setSelectedModelId(car.slug || car.id)
    const defBody = car.defaultBodyColor || car.defaultBody || '#CC0000'
    const defRim = car.defaultRimColor || car.defaultRim || '#CCCCCC'
    const defGlass = car.defaultGlassColor || car.defaultGlass || '#C8D8F0'
    setBodyColor(defBody)
    setRimColor(defRim)
    setGlassColor(defGlass)
    setSelectedBody(BODY_COLORS.find(c => c.hex.toLowerCase() === defBody.toLowerCase()) || { hex: defBody, name: 'OEM Color', finish: 'OEM' })
    setSelectedRim(RIM_COLORS.find(c => c.hex.toLowerCase() === defRim.toLowerCase()) || { hex: defRim, name: 'OEM Rim' })
    setSelectedGlass(GLASS_COLORS[0])
    setActiveSection('color')
  }, [])

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

  // Camera preset view switcher (snaps camera smoothly to pre-configured angles)
  const handleCameraPreset = useCallback((cam) => {
    if (orbitRef.current) {
      orbitRef.current.object.position.set(cam[0], cam[1], cam[2])
      orbitRef.current.target.set(0, 0.5, 0)
      orbitRef.current.update()
    }
  }, [])

  // ── Build Save & Share Handlers ───────────────────────────────────────────
  const isCurrentConfigSaved = Boolean(
    activeCar &&
    lastSavedConfig &&
    lastSavedConfig.carId === activeCar.id &&
    lastSavedConfig.bodyColor?.toLowerCase() === bodyColor?.toLowerCase() &&
    lastSavedConfig.rimColor?.toLowerCase() === rimColor?.toLowerCase() &&
    lastSavedConfig.glassColor?.toLowerCase() === glassColor?.toLowerCase()
  )

  const handleOpenSaveModal = useCallback(() => {
    if (!activeCar) return
    if (isCurrentConfigSaved && lastSavedConfig?.buildData) {
      setSavedBuildData(lastSavedConfig.buildData)
      setCopiedLink(false)
      setShowSaveModal(true)
    } else {
      setBuildNameInput(`${activeCar.name} Custom Tune`)
      setSavedBuildData(null)
      setCopiedLink(false)
      setShowSaveModal(true)
    }
  }, [isCurrentConfigSaved, lastSavedConfig, activeCar])

  const handleSaveBuild = useCallback(async (e, forceNew = false) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()
    if (!activeCar) return
    setSavingBuild(true)
    try {
      const payload = {
        carId: activeCar.carId || (typeof activeCar.id === 'number' ? activeCar.id : null),
        carSlug: activeCar.slug || activeCar.id,
        buildName: buildNameInput.trim() || `${activeCar.name} Custom Build`,
        bodyColor,
        bodyFinish: selectedBody?.finish || 'OEM',
        rimColor,
        glassColor,
        forceNew: Boolean(forceNew),
        selectedPartsJson: JSON.stringify({
          carName: activeCar.name,
          bodyColorName: selectedBody?.name,
          rimColorName: selectedRim?.name,
          basePrice: activeCar.price
        }),
        totalEstimatedCost: activeCar.price
      }
      const res = await buildApi.create(payload)
      setSavedBuildData(res)
      setLastSavedConfig({
        carId: activeCar.id,
        bodyColor,
        rimColor,
        glassColor,
        buildData: res
      })
      setToastMessage(`Đã lưu bản độ thành công! Mã: ${res.shareCode}`)
      setTimeout(() => setToastMessage(null), 4000)
    } catch (err) {
      console.warn('Backend save build failed, using offline fallback:', err)
      const fallbackCode = `VT-${(activeCar.slug || 'CAR').toUpperCase().slice(0, 4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      const fallbackBuild = {
        shareCode: fallbackCode,
        buildName: buildNameInput.trim() || `${activeCar.name} Custom Build`,
        bodyColor,
        bodyFinish: selectedBody?.finish || 'OEM',
        rimColor,
        glassColor,
        createdAt: new Date().toISOString()
      }
      setSavedBuildData(fallbackBuild)
      setLastSavedConfig({
        carId: activeCar.id,
        bodyColor,
        rimColor,
        glassColor,
        buildData: fallbackBuild
      })
      setToastMessage(`Đã lưu bản độ! Mã: ${fallbackCode}`)
      setTimeout(() => setToastMessage(null), 4000)
    } finally {
      setSavingBuild(false)
    }
  }, [activeCar, buildNameInput, bodyColor, selectedBody, rimColor, selectedRim, glassColor])

  const handleCopyShareLink = useCallback(() => {
    if (!savedBuildData?.shareCode) return
    const url = `${window.location.origin}/configurator?share=${savedBuildData.shareCode}`
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    }).catch(err => {
      console.error('Clipboard copy failed:', err)
    })
  }, [savedBuildData])

  // ── Loading state while fetching cars from backend database ────────────────
  if (loadingCars) {
    return (
      <div className="bg-[#0d0d12] text-white h-[calc(100vh-4rem)] flex flex-col items-center justify-center w-full font-sans select-none">
        <div className="w-14 h-14 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
        <h3 className="text-sm font-bold tracking-widest uppercase text-white/90">Nạp danh mục xe từ Database</h3>
        <p className="text-xs text-white/40 mt-1 font-mono">Connecting to backend /api/cars...</p>
      </div>
    )
  }

  // ── Error state if backend car fetch fails ──────────────────────────────────
  if (carError && !activeCar) {
    return (
      <div className="bg-[#0d0d12] text-white h-[calc(100vh-4rem)] flex flex-col items-center justify-center w-full font-sans select-none text-center p-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
          <span className="material-symbols-outlined text-2xl">cloud_off</span>
        </div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Lỗi nạp danh mục xe Backend</h3>
        <p className="text-xs text-white/50 max-w-md mb-5 leading-relaxed">{carError}</p>
        <button
          onClick={fetchCars}
          className="px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Thử kết nối lại
        </button>
      </div>
    )
  }

  if (!activeCar) {
    return null
  }

  return (
    <div className="bg-[#0d0d12] text-white antialiased h-[calc(100vh-4rem)] flex flex-col w-full overflow-hidden select-none font-sans">

      {/* ── MAIN LAYOUT (Pure 2-Panel Split: 3D Viewport + Control Panel) ── */}
      <div className="flex flex-1 overflow-hidden min-h-0 relative">

        {/* ── 3D CANVAS ───────────────────────────────────────────────────── */}
        <main className="flex-1 relative bg-[#0d0d12] overflow-hidden">

          {/* Vignette overlay */}
          <div className="absolute inset-0 pointer-events-none z-10"
            style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)' }} />

          {/* Car name watermark */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <div className="text-[11px] font-mono text-white/20 uppercase tracking-[0.3em]">{activeCar.brand}</div>
            <div className="text-3xl font-black text-white/6 uppercase tracking-tight leading-none">{activeCar.model}</div>
          </div>

          {/* Instruction hint */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/40 text-[10px]">
              <span className="material-symbols-outlined text-sm">mouse</span>
              Drag to orbit · Scroll to zoom · Right-click to pan
            </div>
          </div>

          {/* THREE.JS CANVAS (Zoomed closer into car by default) */}
          <Canvas
            camera={{ position: [3.3, 1.4, 4.8], fov: 40 }}
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
            <AnimatedGrid />

            <Suspense fallback={<CarLoadingFallback />}>
              <VehicleModel3D
                key={activeCar.id}
                modelPath={activeCar.modelPath}
                modelId={activeCar.id}
                bodyColor={bodyColor}
                detailsColor={rimColor}
                glassColor={glassColor}
              />
              <ShowroomFloor />
            </Suspense>

            <OrbitControls
              ref={orbitRef}
              enablePan={true}
              enableZoom={true}
              minDistance={1.8}
              maxDistance={12}
              maxPolarAngle={Math.PI / 2.1}
              target={[0, 0.5, 0]}
              autoRotate={false}
              enableDamping
              dampingFactor={0.05}
            />
          </Canvas>

          {/* ── BOTTOM VIEW CONTROLS (Tightly Framed Camera Presets) ──────── */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2 py-1 rounded-xl bg-[#0d0d12]/90 backdrop-blur-md border border-white/10 shadow-xl">
            {[
              { label: 'Front 3/4', cam: [3.3, 1.4, 4.8] },
              { label: 'Side',      cam: [5.2, 1.2, 0] },
              { label: 'Rear 3/4',  cam: [-3.3, 1.4, -4.8] },
              { label: 'Top Down',  cam: [0, 6.0, 0.1] },
              { label: 'Front',     cam: [0, 1.2, 5.0] },
            ].map(view => (
              <button
                key={view.label}
                onClick={() => handleCameraPreset(view.cam)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white/50 hover:text-white hover:bg-white/8 transition-all cursor-pointer"
              >
                {view.label}
              </button>
            ))}
          </div>
        </main>

        {/* ── SIDEBAR TOGGLE BUTTON (always visible at edge) ──────────────── */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          title={sidebarOpen ? 'Collapse panel' : 'Expand panel'}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-5 h-12 bg-[#0f0f16] border border-white/10 rounded-l-lg shadow-xl hover:bg-white/10 transition-all group"
          style={{
            right: sidebarOpen ? '330px' : '0px',
            transition: 'right 0.35s cubic-bezier(0.4,0,0.2,1)'
          }}
        >
          <span
            className="material-symbols-outlined text-sm text-white/50 group-hover:text-white transition-transform duration-300"
            style={{ transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}
          >
            chevron_right
          </span>
        </button>

        {/* ── SIDE PANEL ─────────────────────────────────────────────────────── */}
        <aside
          className="flex flex-col bg-[#0f0f16] border-l border-white/8 h-full shrink-0 z-20 min-h-0 overflow-hidden"
          style={{
            width: '330px',
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
            position: sidebarOpen ? 'relative' : 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
          }}
        >

          {/* Header */}
          <div className="px-4 pt-3.5 pb-2.5 border-b border-white/8 shrink-0">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-black text-white tracking-wide uppercase">{activeCar.brand} {activeCar.model}</h2>
                <p className="text-[10px] text-white/40 mt-0.5 font-mono">{activeCar.tagline}</p>
              </div>
              <div className="px-2 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-wider" style={{ borderColor: activeCar.accentColor + '50', color: activeCar.accentColor, backgroundColor: activeCar.accentColor + '15' }}>
                {activeCar.year}
              </div>
            </div>

            {/* Section Tabs */}
            <div className="flex gap-1 mt-2.5 p-1 rounded-lg bg-white/5">
              {[
                { id: 'model',   icon: 'directions_car', label: 'Models' },
                { id: 'color',   icon: 'palette',         label: 'Color' },
                { id: 'specs',   icon: 'speed',            label: 'Specs' },
                { id: 'options', icon: 'tune',             label: 'Options' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex-1 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-0.5 transition-all ${
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

            {/* ── MODEL SELECTOR TAB ──────────────────────────────────────── */}
            {activeSection === 'model' && (
              <div className="space-y-2">
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">Select Vehicle</p>
                {carList.map(car => (
                  <button
                    key={car.id}
                    id={`car-model-${car.id}`}
                    onClick={() => handleModelSwitch(car)}
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
            )}

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
                  {Object.keys(activeCar.specs).map(key => (
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
                  {(activeCar.specs[activeTab] || []).map(item => (
                    <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                      <span className="text-[10px] text-white/40 font-medium">{item.label}</span>
                      <span className="text-[11px] text-white font-bold font-mono text-right max-w-[55%]">{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Car brand badge */}
                <div className="p-3 rounded-lg text-center border" style={{ backgroundColor: activeCar.accentColor + '15', borderColor: activeCar.accentColor + '40' }}>
                  <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{activeCar.badge}</p>
                  <p className="text-lg font-black mt-0.5" style={{ color: activeCar.accentColor }}>{activeCar.model}</p>
                  <p className="text-[9px] text-white/30 mt-0.5 font-mono">{activeCar.brand} · {activeCar.year}</p>
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
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Base MSRP</span>
              <span className="text-lg font-black font-mono" style={{ color: activeCar.accentColor }}>
                ${activeCar.price.toLocaleString()}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleOpenSaveModal}
                className="flex-1 py-2 px-2.5 rounded-lg bg-white/8 border border-white/15 hover:border-white/30 hover:bg-white/12 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-sm text-primary">bookmark_add</span>
                Lưu bản độ 3D
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

      {/* ── SAVE & SHARE BUILD MODAL ───────────────────────────────────────── */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#12121a] border border-white/15 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative text-left">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg">tune</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide uppercase">Lưu & Chia sẻ Bản độ 3D</h3>
                  <p className="text-[10px] text-white/50">{activeCar.name} · Virtual Tune Database</p>
                </div>
              </div>
              <button
                onClick={() => setShowSaveModal(false)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {!savedBuildData ? (
                <form onSubmit={handleSaveBuild} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">
                      Tên cấu hình độ xe
                    </label>
                    <input
                      type="text"
                      value={buildNameInput}
                      onChange={(e) => setBuildNameInput(e.target.value)}
                      placeholder="Ví dụ: Ferrari 458 GT3 Stealth Edition"
                      maxLength={60}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/15 focus:border-primary text-white text-xs outline-none transition-all placeholder:text-white/30"
                      autoFocus
                    />
                  </div>

                  {/* Build Spec Summary Badges */}
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Thông số cấu hình hiện tại</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5 flex flex-col items-center text-center">
                        <div className="w-4 h-4 rounded-full border border-white/30 mb-1" style={{ backgroundColor: bodyColor }} />
                        <span className="text-[10px] text-white/50">Màu sơn</span>
                        <span className="text-[10px] font-bold text-white truncate max-w-full">{selectedBody.name}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5 flex flex-col items-center text-center">
                        <div className="w-4 h-4 rounded-full border border-white/30 mb-1" style={{ backgroundColor: rimColor }} />
                        <span className="text-[10px] text-white/50">Mâm xe</span>
                        <span className="text-[10px] font-bold text-white truncate max-w-full">{selectedRim.name}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5 flex flex-col items-center text-center">
                        <div className="w-4 h-4 rounded-full border border-white/30 mb-1" style={{ backgroundColor: glassColor }} />
                        <span className="text-[10px] text-white/50">Kính xe</span>
                        <span className="text-[10px] font-bold text-white truncate max-w-full">{selectedGlass.name}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-white/40 leading-relaxed">
                    Bản độ sẽ được mã hóa và lưu vĩnh viễn trên hệ thống. Bạn có thể gửi liên kết cho bạn bè hoặc salon độ xe để tái hiện lại chính xác bản 3D này.
                  </p>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSaveModal(false)}
                      className="flex-1 py-2.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold transition-all"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={savingBuild}
                      className="flex-1 py-2.5 px-3 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-primary/25 disabled:opacity-50"
                    >
                      {savingBuild ? (
                        <>
                          <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                          Đang lưu vào DB...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">cloud_upload</span>
                          Lưu & Tạo mã vĩnh viễn
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {/* Success Alert */}
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-300">Đã lưu bản độ thành công!</p>
                      <p className="text-[10px] text-emerald-400/70">{savedBuildData.buildName}</p>
                    </div>
                  </div>

                  {/* Share Code Card */}
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                      Mã bản độ vĩnh viễn (Share Code)
                    </span>
                    <div className="flex items-center justify-between bg-black/40 px-3 py-2 rounded-lg border border-white/10">
                      <span className="text-base font-black font-mono tracking-wider text-primary">
                        {savedBuildData.shareCode}
                      </span>
                      <span className="text-[10px] text-white/40 uppercase">Database Verified</span>
                    </div>
                  </div>

                  {/* Share Link Input */}
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 mb-1.5 uppercase tracking-wider">
                      Đường dẫn chia sẻ trực tuyến
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`${window.location.origin}/configurator?share=${savedBuildData.shareCode}`}
                        className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white/80 text-[11px] font-mono select-all outline-none"
                      />
                      <button
                        onClick={handleCopyShareLink}
                        className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                          copiedLink
                            ? 'bg-emerald-500 text-white'
                            : 'bg-primary hover:bg-primary/90 text-on-primary shadow-sm'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {copiedLink ? 'check' : 'content_copy'}
                        </span>
                        {copiedLink ? 'Đã sao chép' : 'Sao chép'}
                      </button>
                    </div>
                  </div>

                  {/* Reuse Indicator and Fork button */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-[11px]">
                    <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      {isCurrentConfigSaved ? 'Tái sử dụng link bản độ hiện tại' : 'Đã ghi nhận bản độ vào DB'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSavedBuildData(null)
                        setBuildNameInput(`${activeCar.name} Custom Tune (Bản mới)`)
                      }}
                      className="text-primary hover:text-primary/80 font-bold hover:underline transition-all"
                    >
                      Tạo thêm mã mới riêng biệt →
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => navigate(`/quotation?build=${savedBuildData.shareCode}`)}
                      className="flex-1 py-2 px-3 rounded-lg bg-white/8 hover:bg-white/15 border border-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">request_quote</span>
                      Yêu cầu báo giá bản độ
                    </button>
                    <button
                      onClick={() => setShowSaveModal(false)}
                      className="py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold transition-all"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST NOTIFICATION ─────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#1c1c28]/95 border border-primary/40 text-white text-xs font-medium shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
