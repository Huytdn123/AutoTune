import React, { useState, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { INTERIOR_COLORS } from '../constants/configuratorPresets'
import { useBuildPricing } from '../hooks/useBuildPricing'
import { useCameraGlide } from '../hooks/useCameraGlide'
import { useBuildConfig } from '../hooks/useBuildConfig'
import { useBuildPersistence } from '../hooks/useBuildPersistence'
import ConfiguratorViewport from '../components/configurator/ConfiguratorViewport'
import ConfiguratorSidebar from '../components/configurator/ConfiguratorSidebar'
import SaveBuildModal from '../components/configurator/SaveBuildModal'

export { INTERIOR_COLORS }

/**
 * ConfiguratorPage - 3D Vehicle Customization & Virtual Tune Studio.
 * Modular composition orchestrating camera transitions, build configuration,
 * 3D studio viewport, and interactive sidebar customizers.
 */
export default function ConfiguratorPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isDark } = useTheme()
  const orbitRef = useRef()

  // ── 1. Camera Glide & Controls Hook ───────────────────────────────────────
  const {
    autoRotate,
    setAutoRotate,
    hasInteracted,
    prefersReducedMotion,
    cameraGoal,
    isCameraTransitioning,
    setIsCameraTransitioning,
    glideCameraTo,
    handleCameraPreset,
    handleManualInteraction,
    handleToggleAutoRotate,
  } = useCameraGlide(orbitRef)

  // ── 2. Vehicle Build Configuration & Part Swapping Hook ────────────────────
  const buildConfig = useBuildConfig({
    glideCameraTo,
    setAutoRotate,
  })

  // ── 3. Viewer Tabs & UI Navigation State ───────────────────────────────────
  const [activeTab, setActiveTab] = useState('performance')
  const [activeSection, setActiveSection] = useState('model')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Dynamic options total strictly from selected database parts via useBuildPricing hook
  // We need activeCar from persistence, so we instantiate pricing with activeCar
  // ── 4. Build Persistence & Database Synchronization Hook ───────────────────
  // First compute pricing dynamically
  // Note: activeCar is determined inside useBuildPersistence based on database car fleet
  const persistence = useBuildPersistence({
    searchParams,
    buildConfig,
    optionsTotal: 0, // initial, updated via pricing hook
    totalEstimatedCost: 0,
  })

  const { activeCar } = persistence
  const { optionsTotal, totalEstimatedCost } = useBuildPricing(activeCar, buildConfig.selectedParts)

  // Switch car model handler
  const handleModelSwitch = useCallback((car) => {
    persistence.setSelectedModelId(car.slug || car.id)
    buildConfig.resetCarConfig(car)
    setActiveSection('color')
    glideCameraTo([4.6, 1.9, 5.5], [0, 0.45, 0], '3/4 Front')
  }, [persistence, buildConfig, glideCameraTo])

  // ── Loading state while fetching cars from backend database ────────────────
  if (persistence.loadingCars) {
    return (
      <div className="bg-[#0d0d12] text-white h-[calc(100vh-4rem)] flex flex-col items-center justify-center w-full font-sans select-none">
        <div className="w-14 h-14 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
        <h3 className="text-sm font-bold tracking-widest uppercase text-white/90">Initializing 3D Studio</h3>
        <p className="text-xs text-white/40 mt-1 font-mono">Loading vehicle 3D models and technical specs...</p>
      </div>
    )
  }

  // ── Error state if backend car fetch fails ──────────────────────────────────
  if (persistence.carError && !activeCar) {
    return (
      <div className="bg-[#0d0d12] text-white h-[calc(100vh-4rem)] flex flex-col items-center justify-center w-full font-sans select-none text-center p-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
          <span className="material-symbols-outlined text-2xl">cloud_off</span>
        </div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">3D Vehicle Catalog Error</h3>
        <p className="text-xs text-white/50 max-w-md mb-5 leading-relaxed">{persistence.carError}</p>
        <button
          onClick={persistence.fetchCars}
          className="px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Retry Connection
        </button>
      </div>
    )
  }

  if (!activeCar) {
    return null
  }

  return (
    <div className={`antialiased h-[calc(100vh-4rem)] flex flex-col w-full overflow-hidden select-none font-sans transition-colors duration-300 ${
      isDark ? 'bg-[#0a0a10] text-white' : 'bg-[#edf0f5] text-slate-900'
    }`}>
      {/* ── MAIN LAYOUT (Pure 2-Panel Split: 3D Viewport + Narrowed Customizer Panel ~72% Width) ── */}
      <div className="flex flex-1 overflow-hidden min-h-0 relative [--panel-w:min(92vw,360px)] sm:[--panel-w:340px] md:[--panel-w:380px] lg:[--panel-w:420px] xl:[--panel-w:448px] 2xl:[--panel-w:456px]">

        {/* ── 3D CANVAS VIEWPORT ───────────────────────────────────────────── */}
        <ConfiguratorViewport
          activeCar={activeCar}
          isDark={isDark}
          hasInteracted={hasInteracted}
          orbitRef={orbitRef}
          autoRotate={autoRotate}
          cameraGoal={cameraGoal}
          isCameraTransitioning={isCameraTransitioning}
          setIsCameraTransitioning={setIsCameraTransitioning}
          prefersReducedMotion={prefersReducedMotion}
          handleManualInteraction={handleManualInteraction}
          handleCameraPreset={handleCameraPreset}
          handleToggleAutoRotate={handleToggleAutoRotate}
          bodyColor={buildConfig.bodyColor}
          rimColor={buildConfig.rimColor}
          glassColor={buildConfig.glassColor}
          interiorColor={buildConfig.interiorColor}
          selectedWheel={buildConfig.selectedWheel}
          wheelFinish={buildConfig.wheelFinish}
          selectedBodykit={buildConfig.selectedBodykit}
          selectedSpoiler={buildConfig.selectedSpoiler}
          selectedParts={buildConfig.selectedParts}
        />

        {/* ── SIDEBAR TOGGLE BUTTON (always visible at edge) ──────────────── */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          title={sidebarOpen ? 'Collapse panel' : 'Expand panel'}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-5 h-12 rounded-l-lg transition-all group cursor-pointer ${
            isDark
              ? 'bg-[#141420] border border-white/20 hover:bg-white/10 text-white/70 hover:text-white shadow-xl'
              : 'bg-white border-2 border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 shadow-md'
          }`}
          style={{
            right: sidebarOpen ? 'var(--panel-w, 448px)' : '0px',
            transition: 'right 0.35s cubic-bezier(0.4,0,0.2,1)'
          }}
        >
          <span
            className="material-symbols-outlined text-sm transition-transform duration-300"
            style={{ transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}
          >
            chevron_right
          </span>
        </button>

        {/* ── NARROWED SIDE PANEL (Target ~70-75% width: 420-456px on desktop) ── */}
        <ConfiguratorSidebar
          activeCar={activeCar}
          isDark={isDark}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          carList={persistence.carList}
          selectedModelId={persistence.selectedModelId}
          handleModelSwitch={handleModelSwitch}
          bodyColor={buildConfig.bodyColor}
          rimColor={buildConfig.rimColor}
          glassColor={buildConfig.glassColor}
          interiorColor={buildConfig.interiorColor}
          selectedBody={buildConfig.selectedBody}
          selectedRim={buildConfig.selectedRim}
          selectedGlass={buildConfig.selectedGlass}
          selectedInterior={buildConfig.selectedInterior}
          handleBodyColor={buildConfig.handleBodyColor}
          handleRimColor={buildConfig.handleRimColor}
          handleInteriorColor={buildConfig.handleInteriorColor}
          handleGlassColor={buildConfig.handleGlassColor}
          handleCustomBodyColor={buildConfig.handleCustomBodyColor}
          partsCatalog={persistence.partsCatalog}
          selectedWheel={buildConfig.selectedWheel}
          selectedBodykit={buildConfig.selectedBodykit}
          selectedSpoiler={buildConfig.selectedSpoiler}
          selectedParts={buildConfig.selectedParts}
          handleSelectWheel={buildConfig.handleSelectWheel}
          handleToggleBodykit={buildConfig.handleToggleBodykit}
          handleToggleSpoiler={buildConfig.handleToggleSpoiler}
          handleToggleHardware={buildConfig.handleToggleHardware}
          optionsTotal={optionsTotal}
          totalEstimatedCost={totalEstimatedCost}
          handleOpenSaveModal={persistence.handleOpenSaveModal}
          navigate={navigate}
          savedBuildData={persistence.savedBuildData}
        />
      </div>

      {/* ── SAVE & SHARE BUILD MODAL ───────────────────────────────────────── */}
      <SaveBuildModal
        isOpen={persistence.showSaveModal}
        onClose={() => persistence.setShowSaveModal(false)}
        activeCar={activeCar}
        savedBuildData={persistence.savedBuildData}
        buildNameInput={persistence.buildNameInput}
        onBuildNameChange={persistence.setBuildNameInput}
        onSaveBuild={persistence.handleSaveBuild}
        savingBuild={persistence.savingBuild}
        totalEstimatedCost={totalEstimatedCost}
        bodyColor={buildConfig.bodyColor}
        selectedBody={buildConfig.selectedBody}
        interiorColor={buildConfig.interiorColor}
        selectedInterior={buildConfig.selectedInterior}
        selectedWheel={buildConfig.selectedWheel}
        selectedSpoiler={buildConfig.selectedSpoiler}
        copiedLink={persistence.copiedLink}
        onCopyShareLink={persistence.handleCopyShareLink}
        isCurrentConfigSaved={persistence.isCurrentConfigSaved}
        onCreateNewCode={() => {
          persistence.setSavedBuildData(null)
          persistence.setBuildNameInput(`${activeCar.name} Custom Tune (New)`)
        }}
        onRequestQuote={(shareCode) => navigate(`/quotation?build=${shareCode}`)}
      />

      {/* ── TOAST NOTIFICATION ─────────────────────────────────────────────── */}
      {persistence.toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#1c1c28]/95 border border-primary/40 text-white text-xs font-medium shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span>{persistence.toastMessage}</span>
        </div>
      )}
    </div>
  )
}
