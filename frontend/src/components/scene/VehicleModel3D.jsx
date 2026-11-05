import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useFBX } from '@react-three/drei'
import * as THREE from 'three'
import {
  CAR_MODEL_FILES,
  PART_MODEL_FILES,
  DRACO_PATH,
  FERRARI_AO
} from './sceneConstants'
import { useVehicleMaterials } from './hooks/useVehicleMaterials'
import { useAftermarketParts } from './hooks/useAftermarketParts'
import { classifyAndApplyMaterials, orientAndNormalizeVehicle } from './utils/vehicleModelUtils'

// Preload vehicle models to ensure instant 3D studio mount without waiting
useGLTF.preload(CAR_MODEL_FILES['ferrari-458'], DRACO_PATH)
useGLTF.preload(CAR_MODEL_FILES['vinfast-vf3'], DRACO_PATH)
useGLTF.preload(PART_MODEL_FILES['wheel-work-vsxx-19'])
useGLTF.preload(PART_MODEL_FILES['wheel-bbs-lm-20'])
useGLTF.preload(PART_MODEL_FILES['spoiler-bcl-wing'])
useFBX.preload(PART_MODEL_FILES['spoiler-gt3-wing'])
useGLTF.preload(PART_MODEL_FILES['brakes-brembo-gt'])
useGLTF.preload(PART_MODEL_FILES['exhaust-akrapovic'])

/**
 * Preload a vehicle model on-demand (e.g. when user hovers car selector card)
 */
export function preloadCarModel(modelPath) {
  if (modelPath) {
    useGLTF.preload(modelPath, DRACO_PATH)
  }
}

/**
 * Universal Vehicle 3D Model Component
 * Renders GLB automotive geometries, dynamic PBR paints, custom interior leather,
 * and handles physical aftermarket wheel & aero component swaps with GPU material cleanup.
 */
export default function VehicleModel3D({
  modelPath = '/models/ferrari.glb',
  modelId = 'ferrari-458',
  bodyColor = '#CC0000',
  detailsColor = '#CCCCCC',
  glassColor = '#C8D8F0',
  interiorColor = '#1A1A1A',
  selectedWheel = null,
  wheelFinish = 'GLOSS_BLACK',
  selectedBodykit = null,
  selectedSpoiler = null,
  selectedParts = [],
  autoRotate = false,
  autoRotateSpeed = 0.4
}) {
  const { scene } = useGLTF(modelPath || CAR_MODEL_FILES['ferrari-458'], DRACO_PATH)
  const workVsxxGLB = useGLTF(PART_MODEL_FILES['wheel-work-vsxx-19'])
  const bbsLmGLB    = useGLTF(PART_MODEL_FILES['wheel-bbs-lm-20'])
  const bclWingGLB  = useGLTF(PART_MODEL_FILES['spoiler-bcl-wing'])
  const gt3WingFBX  = useFBX(PART_MODEL_FILES['spoiler-gt3-wing'])
  const bremboGLB   = useGLTF(PART_MODEL_FILES['brakes-brembo-gt'])
  const exhaustGLB  = useGLTF(PART_MODEL_FILES['exhaust-akrapovic'])
  const groupRef = useRef()

  // Clone scene deep so each model instance is isolated from the global cache
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  // Custom PBR Materials management hook
  const materials = useVehicleMaterials({
    bodyColor,
    detailsColor,
    glassColor,
    interiorColor
  })

  // 1. One-time base car normalization (fixed dimensions, orientation, floor contact)
  // Runs once per model instance so vehicle size & coordinates are 100% frozen and uniform
  useEffect(() => {
    if (!clonedScene) return
    orientAndNormalizeVehicle(clonedScene, modelPath)
  }, [clonedScene, modelPath])

  // 2. Mesh classification and material assignment (runs reactively on color/material changes)
  useEffect(() => {
    if (!clonedScene) return
    classifyAndApplyMaterials(clonedScene, modelPath, materials, glassColor)
  }, [clonedScene, modelPath, materials, glassColor])

  // Physical Aftermarket Parts Swapping Engine hook
  useAftermarketParts({
    clonedScene,
    modelPath,
    selectedWheel,
    wheelFinish,
    selectedBodykit,
    selectedSpoiler,
    selectedParts,
    detailsColor,
    partModels: {
      workVsxxGLB,
      bbsLmGLB,
      bclWingGLB,
      gt3WingFBX,
      bremboGLB,
      exhaustGLB
    }
  })

  // Turntable Auto-Rotate
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * autoRotateSpeed
    }
  })

  // Baked AO shadow plane for Ferrari
  const isFerrari = (modelPath || '').includes('ferrari')
  const aoTexture = useMemo(() => {
    if (!isFerrari) return null
    const loader = new THREE.TextureLoader()
    return loader.load(FERRARI_AO)
  }, [isFerrari])

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />

      {isFerrari && aoTexture && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} renderOrder={2}>
          <planeGeometry args={[0.655 * 4.4, 1.3 * 4.4]} />
          <meshBasicMaterial
            map={aoTexture}
            blending={THREE.MultiplyBlending}
            toneMapped={false}
            transparent={true}
          />
        </mesh>
      )}
    </group>
  )
}
