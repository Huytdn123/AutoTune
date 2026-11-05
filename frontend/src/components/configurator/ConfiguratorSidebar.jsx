import React from 'react'
import ModelSelector from './ModelSelector'
import SpecsViewer from './SpecsViewer'
import ColorSelector from './ColorSelector'
import WheelSelector from './WheelSelector'
import BodyAeroSelector from './BodyAeroSelector'
import SpoilerSelector from './SpoilerSelector'
import PerformanceHardwareSelector from './PerformanceHardwareSelector'
import ConfiguratorFooterSummary from './ConfiguratorFooterSummary'
import {
  BODY_COLORS,
  RIM_COLORS,
  GLASS_COLORS,
  INTERIOR_COLORS,
} from '../../constants/configuratorPresets'

/**
 * ConfiguratorSidebar - Encapsulates right customizer panel, section tabs,
 * color & hardware selectors, and fixed quote/cart summary footer.
 */
export default function ConfiguratorSidebar({
  activeCar,
  isDark,
  sidebarOpen,
  setSidebarOpen,
  activeSection,
  setActiveSection,
  activeTab,
  setActiveTab,
  carList,
  selectedModelId,
  handleModelSwitch,
  bodyColor,
  rimColor,
  glassColor,
  interiorColor,
  selectedBody,
  selectedRim,
  selectedGlass,
  selectedInterior,
  handleBodyColor,
  handleRimColor,
  handleInteriorColor,
  handleGlassColor,
  handleCustomBodyColor,
  partsCatalog,
  selectedWheel,
  selectedBodykit,
  selectedSpoiler,
  selectedParts,
  handleSelectWheel,
  handleToggleBodykit,
  handleToggleSpoiler,
  handleToggleHardware,
  optionsTotal,
  totalEstimatedCost,
  handleOpenSaveModal,
  navigate,
  savedBuildData,
}) {
  return (
    <aside
      data-preserve-bg="true"
      className={`flex flex-col border-l h-full shrink-0 z-20 min-h-0 overflow-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-[#0f0f16] border-white/10 text-white'
          : 'bg-[#F4F6FA] border-l-2 border-slate-300 text-slate-900 shadow-2xl shadow-slate-400/20'
      }`}
      style={{
        width: 'var(--panel-w, 448px)',
        maxWidth: '92vw',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        position: sidebarOpen ? 'relative' : 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
      }}
    >
      {/* Header */}
      <div
        data-preserve-white="true"
        className={`px-4 pt-3.5 pb-2.5 border-b shrink-0 ${
          isDark ? 'border-white/10 bg-[#0f0f16]' : 'border-slate-300 bg-white shadow-2xs'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="min-w-0 pr-2">
            <div className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
              isDark ? 'text-white/40' : 'text-slate-500'
            }`}>
              {activeCar.brand}
            </div>
            <h2 className={`text-base font-black tracking-tight uppercase truncate ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              {activeCar.model}
            </h2>
            <p className={`text-[11px] mt-0.5 font-mono truncate font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {activeCar.tagline}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className={`px-2.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider font-mono ${
              isDark
                ? 'border-white/20 bg-white/10 text-white'
                : 'border-slate-300 bg-slate-100 text-slate-800'
            }`}>
              {activeCar.year}
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`sm:hidden p-1 rounded-md cursor-pointer border ${
                isDark
                  ? 'border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                  : 'border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Close panel"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className={`flex gap-1 mt-2.5 p-1 rounded-xl border ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-slate-200/80 border-slate-300'
        }`}>
          {[
            { id: 'model',    icon: 'directions_car', label: 'Models' },
            { id: 'color',    icon: 'palette',         label: 'Paint & Trim' },
            { id: 'hardware', icon: 'tune',            label: 'Wheels & Aero' },
            { id: 'specs',    icon: 'speed',           label: 'Specs' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              data-preserve-white="true"
              className={`flex-1 py-1.5 px-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer border ${
                activeSection === tab.id
                  ? 'bg-[#0213B2] text-white border-2 border-[#0213B2] shadow-md shadow-[#0213B2]/30'
                  : isDark
                    ? 'bg-white/[0.03] border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25'
                    : 'bg-white border border-slate-300 text-slate-800 hover:text-slate-950 hover:border-slate-400 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <span className="material-symbols-outlined text-xs">{tab.icon}</span>
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3.5 space-y-3.5 min-h-0 pb-6"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: isDark ? '#333 transparent' : '#cbd5e1 transparent'
        }}
      >
        {/* MODEL SELECTOR TAB */}
        {activeSection === 'model' && (
          <ModelSelector
            carList={carList}
            selectedModelId={selectedModelId}
            onSelectModel={handleModelSwitch}
            isDark={isDark}
          />
        )}

        {/* COLOR TAB */}
        {activeSection === 'color' && (
          <ColorSelector
            bodyColors={BODY_COLORS}
            rimColors={RIM_COLORS}
            interiorColors={INTERIOR_COLORS}
            glassColors={GLASS_COLORS}
            selectedBody={selectedBody}
            selectedRim={selectedRim}
            selectedInterior={selectedInterior}
            selectedGlass={selectedGlass}
            bodyColor={bodyColor}
            onBodyColorChange={handleBodyColor}
            onRimColorChange={handleRimColor}
            onInteriorColorChange={handleInteriorColor}
            onGlassColorChange={handleGlassColor}
            onCustomBodyColorChange={handleCustomBodyColor}
            isDark={isDark}
          />
        )}

        {/* SPECS TAB */}
        {activeSection === 'specs' && (
          <SpecsViewer
            activeCar={activeCar}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isDark={isDark}
          />
        )}

        {/* HARDWARE TAB */}
        {activeSection === 'hardware' && (
          <div className="space-y-4">
            <div className={`p-2.5 rounded-lg border ${
              isDark
                ? 'bg-blue-500/10 border-blue-500/25'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className={`flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider mb-0.5 ${
                isDark ? 'text-blue-300' : 'text-blue-900'
              }`}>
                <span className="material-symbols-outlined text-xs">verified</span>
                <span>3D Customization & Technical Fitment</span>
              </div>
              <p className={`text-[9px] leading-relaxed font-mono ${
                isDark ? 'text-blue-200/80' : 'text-blue-700'
              }`}>
                Real-time 3D geometry modification: Wheels · Bodykit · Aero Wing · Interior. 100% verified database data.
              </p>
            </div>

            <WheelSelector
              partsCatalog={partsCatalog}
              selectedWheel={selectedWheel}
              onSelectWheel={handleSelectWheel}
              isDark={isDark}
            />

            <div className={`h-px ${isDark ? 'bg-white/6' : 'bg-slate-200'}`} />

            <BodyAeroSelector
              partsCatalog={partsCatalog}
              selectedBodykit={selectedBodykit}
              onToggleBodykit={handleToggleBodykit}
              isDark={isDark}
            />

            <div className={`h-px ${isDark ? 'bg-white/6' : 'bg-slate-200'}`} />

            <SpoilerSelector
              partsCatalog={partsCatalog}
              selectedSpoiler={selectedSpoiler}
              onToggleSpoiler={handleToggleSpoiler}
              isDark={isDark}
            />

            <div className={`h-px ${isDark ? 'bg-white/6' : 'bg-slate-200'}`} />

            <PerformanceHardwareSelector
              partsCatalog={partsCatalog}
              selectedParts={selectedParts}
              onToggleHardware={handleToggleHardware}
              isDark={isDark}
            />
          </div>
        )}
      </div>

      {/* FOOTER / CTA */}
      <ConfiguratorFooterSummary
        bodyColor={bodyColor}
        rimColor={rimColor}
        interiorColor={interiorColor}
        glassColor={glassColor}
        selectedBody={selectedBody}
        selectedInterior={selectedInterior}
        selectedWheel={selectedWheel}
        selectedBodykit={selectedBodykit}
        selectedSpoiler={selectedSpoiler}
        optionsTotal={optionsTotal}
        selectedPartsCount={selectedParts.length}
        totalEstimatedCost={totalEstimatedCost}
        activeCar={activeCar}
        onOpenSaveModal={handleOpenSaveModal}
        isDark={isDark}
        onGetQuote={() => {
          if (savedBuildData?.shareCode) {
            navigate(`/quotation?build=${savedBuildData.shareCode}`)
          } else {
            navigate('/quotation')
          }
        }}
      />
    </aside>
  )
}

