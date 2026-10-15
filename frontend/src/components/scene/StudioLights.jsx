import React from 'react'

/**
 * StudioLights - Dual-Mode Automotive Lighting Rig
 * Supports both Daylight Showroom and Dark Studio with key light, soft fills, and contour spotlights.
 */
export default function StudioLights({ isDark = true }) {
  if (!isDark) {
    // ── Daylight Showroom Lighting ──
    return (
      <>
        {/* Soft daylight ambient fill */}
        <ambientLight intensity={1.1} color="#ffffff" />

        {/* Primary Key Light */}
        <spotLight
          position={[6, 9, 6]}
          angle={0.5}
          penumbra={0.8}
          intensity={2.4}
          color="#fffdf8"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        />

        {/* Flank Fill Light */}
        <spotLight
          position={[-6, 7, 4]}
          angle={0.55}
          penumbra={0.9}
          intensity={1.8}
          color="#f1f5f9"
        />

        {/* Roof & Rear Hip Contour Light */}
        <spotLight
          position={[-3, 6, -6]}
          angle={0.5}
          penumbra={0.7}
          intensity={1.4}
          color="#e2e8f0"
        />

        {/* Front-quarter clarity */}
        <spotLight
          position={[4, 4, -5]}
          angle={0.55}
          penumbra={0.8}
          intensity={1.1}
          color="#f8fafc"
        />

        {/* Overhead softbox diffuser */}
        <spotLight
          position={[0, 10, 0]}
          angle={0.8}
          penumbra={1.0}
          intensity={1.6}
          color="#ffffff"
        />
      </>
    )
  }

  // ── Dark Studio Lighting ──
  return (
    <>
      {/* Neutral Studio Ambient Fill */}
      <ambientLight intensity={0.55} color="#F4F6F9" />

      {/* Primary Key Light: Overhead angled 5500K daylight white with soft shadow */}
      <spotLight
        position={[6, 8, 6]}
        angle={0.45}
        penumbra={0.7}
        intensity={3.2}
        color="#FFFDF8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />

      {/* Balanced Soft Fill Light */}
      <spotLight
        position={[-6, 6, 4]}
        angle={0.5}
        penumbra={0.85}
        intensity={1.6}
        color="#F2F5FA"
      />

      {/* Contour Rim / Backlight */}
      <spotLight
        position={[-3, 5, -6]}
        angle={0.45}
        penumbra={0.6}
        intensity={2.2}
        color="#EDF1F7"
      />

      {/* Secondary Rim Light */}
      <spotLight
        position={[4, 3, -5]}
        angle={0.5}
        penumbra={0.7}
        intensity={1.2}
        color="#F5F7FA"
      />

      {/* Overhead Softbox */}
      <spotLight
        position={[0, 9, 0]}
        angle={0.75}
        penumbra={1.0}
        intensity={1.4}
        color="#FFFFFF"
      />
    </>
  )
}
