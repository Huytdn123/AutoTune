import React from 'react'
import { ContactShadows } from '@react-three/drei'

/**
 * ShowroomFloor - Clean Matte Infinite Studio Floor + Raised Turntable Podium
 * Includes chamfered bezel, ambient halo LED ring, infinite matte plane, and ground contact shadows.
 */
export default function ShowroomFloor({ isDark = true }) {
  return (
    <>
      {/* 1. Raised Turntable Podium Cylinder (diameter ~5.7m, height 0.06m) */}
      <mesh position={[0, -0.03, 0]} receiveShadow>
        <cylinderGeometry args={[2.85, 2.85, 0.06, 64]} />
        <meshStandardMaterial
          color={isDark ? '#101018' : '#e2e8f0'}
          metalness={isDark ? 0.3 : 0.15}
          roughness={0.78}
        />
      </mesh>

      {/* 2. Top Matte Surface (Clean studio finish, no mirror reflections) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <circleGeometry args={[2.84, 64]} />
        <meshStandardMaterial
          color={isDark ? '#161622' : '#f8fafc'}
          roughness={0.82}
          metalness={0.12}
        />
      </mesh>

      {/* 3. Chamfered Metallic Edge Bezel Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[2.82, 2.85, 64]} />
        <meshStandardMaterial
          color={isDark ? '#475569' : '#94a3b8'}
          metalness={0.85}
          roughness={0.3}
        />
      </mesh>

      {/* 4. Ambient Halo LED Ring under Podium */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.058, 0]}>
        <ringGeometry args={[2.80, 2.86, 64]} />
        <meshBasicMaterial
          color={isDark ? '#0213B2' : '#94a3b8'}
          transparent={true}
          opacity={isDark ? 0.6 : 0.25}
        />
      </mesh>

      {/* 5. Seamless Infinite Studio Outer Floor Plane (Matte architectural finish) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.061, 0]} receiveShadow>
        <circleGeometry args={[60, 64]} />
        <meshStandardMaterial
          color={isDark ? '#0a0a10' : '#edf0f5'}
          roughness={0.92}
          metalness={0.04}
        />
      </mesh>

      {/* 6. Contact shadow grounding vehicle firmly to the podium surface */}
      <ContactShadows
        position={[0, 0.003, 0]}
        opacity={isDark ? 0.82 : 0.45}
        scale={7.5}
        blur={2.0}
        far={4}
        color={isDark ? '#000000' : '#1e293b'}
      />
    </>
  )
}
