import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import {
  VehicleModel3D,
  ShowroomFloor,
  StudioLights,
  CarLoadingFallback,
  ModelErrorBoundary,
} from '../CarScene3D'
import CameraPresetsBar from './CameraPresetsBar'
import CameraRig from './CameraRig'

/**
 * ConfiguratorViewport - Encapsulates 3D Three.js Studio Canvas,
 * dynamic camera navigation, visual environment, and watermark telemetry.
 */
export default function ConfiguratorViewport({
  activeCar,
  isDark,
  hasInteracted,
  orbitRef,
  autoRotate,
  cameraGoal,
  isCameraTransitioning,
  setIsCameraTransitioning,
  prefersReducedMotion,
  handleManualInteraction,
  handleCameraPreset,
  handleToggleAutoRotate,
  bodyColor,
  rimColor,
  glassColor,
  interiorColor,
  selectedWheel,
  wheelFinish,
  selectedBodykit,
  selectedSpoiler,
  selectedParts,
}) {
  return (
    <main className={`flex-1 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#0a0a10]' : 'bg-[#edf0f5]'
    }`}>
      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)'
            : 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.06) 100%)'
        }}
      />

      {/* Car name watermark */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none select-none">
        <div className={`text-[11px] font-mono uppercase tracking-[0.25em] font-bold ${
          isDark ? 'text-white/40' : 'text-slate-600 font-extrabold'
        }`}>
          {activeCar.brand}
        </div>
        <div className={`text-3xl font-black uppercase tracking-tight leading-none mt-0.5 ${
          isDark ? 'text-white/20' : 'text-slate-800/60'
        }`}>
          {activeCar.model}
        </div>
        {activeCar.tagline && (
          <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border backdrop-blur-sm shadow-xs ${
            isDark
              ? 'bg-black/40 border-white/15 text-white/70'
              : 'bg-white/95 border border-slate-300 text-slate-800 font-semibold'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{activeCar.tagline}</span>
          </div>
        )}
      </div>

      {/* Instruction hint (bottom-left, unobtrusive, fades out after interaction) */}
      <div className={`absolute bottom-4 left-4 z-10 pointer-events-none transition-opacity duration-500 hidden sm:block ${
        hasInteracted ? 'opacity-25 hover:opacity-100' : 'opacity-80'
      }`}>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] border backdrop-blur-sm shadow-sm ${
          isDark
            ? 'bg-black/50 border-white/10 text-white/50'
            : 'bg-white/90 border-slate-200 text-slate-600'
        }`}>
          <span className="material-symbols-outlined text-sm">mouse</span>
          <span>Drag to orbit · Scroll to zoom · Right-click to pan</span>
        </div>
      </div>

      {/* THREE.JS CANVAS (Balanced Full-Car Studio Viewport) */}
      <Canvas
        camera={{ position: [4.6, 1.9, 5.5], fov: 42 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, toneMapping: 3, toneMappingExposure: isDark ? 1.2 : 1.05 }}
        style={{ background: isDark ? '#0a0a10' : '#edf0f5' }}
      >
        {/* Soft distance fog seamlessly dissolving floor into the infinite studio */}
        <fog attach="fog" args={[isDark ? '#0a0a10' : '#edf0f5', 10, 28]} />

        {/* Studio Environment map for realistic automotive reflections */}
        <Environment
          files="https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr"
          background={false}
        />

        <StudioLights isDark={isDark} />

        <Suspense fallback={<CarLoadingFallback />}>
          <ModelErrorBoundary>
            <VehicleModel3D
              key={activeCar.id}
              modelPath={activeCar.modelPath}
              modelId={activeCar.id}
              bodyColor={bodyColor}
              detailsColor={rimColor}
              glassColor={glassColor}
              interiorColor={interiorColor}
              selectedWheel={selectedWheel}
              wheelFinish={wheelFinish}
              selectedBodykit={selectedBodykit}
              selectedSpoiler={selectedSpoiler}
              selectedParts={selectedParts}
            />
          </ModelErrorBoundary>
          <ShowroomFloor isDark={isDark} />
        </Suspense>

        <OrbitControls
          ref={orbitRef}
          makeDefault
          enablePan={true}
          enableZoom={true}
          minDistance={2.8}
          maxDistance={12.0}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI / 2 - 0.05}
          target={[0, 0.45, 0]}
          autoRotate={autoRotate}
          autoRotateSpeed={2.2}
          enableDamping
          dampingFactor={0.06}
        />

        <CameraRig
          targetPosition={cameraGoal.position}
          targetLookAt={cameraGoal.target}
          isTransitioning={isCameraTransitioning}
          setIsTransitioning={setIsCameraTransitioning}
          orbitRef={orbitRef}
          prefersReducedMotion={prefersReducedMotion}
          onManualInteraction={handleManualInteraction}
          autoRotate={autoRotate}
        />
      </Canvas>

      {/* BOTTOM VIEW CONTROLS (Floating Glass Dock with 360° Switch) */}
      <CameraPresetsBar
        onSelectPreset={handleCameraPreset}
        activePreset={cameraGoal.presetName}
        autoRotate={autoRotate}
        onToggleAutoRotate={handleToggleAutoRotate}
        prefersReducedMotion={prefersReducedMotion}
        isDark={isDark}
      />
    </main>
  )
}

