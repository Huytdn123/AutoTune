import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import VehicleModel3D, { preloadCarModel } from './scene/VehicleModel3D'
import ShowroomFloor from './scene/ShowroomFloor'
import StudioLights from './scene/StudioLights'
import {
  CAR_MODEL_FILES,
  PART_MODEL_FILES,
  WHEEL_FINISH_PRESETS,
  DRACO_PATH,
  FERRARI_AO
} from './scene/sceneConstants'

// Export all components & constants for 100% backward compatibility
export {
  VehicleModel3D,
  preloadCarModel,
  ShowroomFloor,
  StudioLights,
  CAR_MODEL_FILES,
  PART_MODEL_FILES,
  WHEEL_FINISH_PRESETS,
  DRACO_PATH,
  FERRARI_AO
}

// Backwards-compatibility alias
export const FerrariModel = VehicleModel3D

// Legacy AnimatedGrid compatibility placeholder
export function AnimatedGrid() {
  return null
}

// Wireframe loading placeholder during GLTF geometry hydration
export function CarLoadingFallback() {
  const meshRef = useRef()
  useFrame(state => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime()
    }
  })
  return (
    <group>
      <mesh ref={meshRef} position={[0, 0.5, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#0213B2" wireframe />
      </mesh>
    </group>
  )
}

// Resilient 3D Canvas Error Boundary for graceful model loading error handling
export class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.warn('3D Vehicle Model loading error caught gracefully:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <group position={[0, 0.5, 0]}>
          <mesh>
            <boxGeometry args={[2, 0.8, 4]} />
            <meshStandardMaterial color="#3B82F6" wireframe opacity={0.4} transparent />
          </mesh>
        </group>
      )
    }
    return this.props.children
  }
}
