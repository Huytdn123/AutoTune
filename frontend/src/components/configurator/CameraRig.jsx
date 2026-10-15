import React, { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * CameraRig - Smooth camera glide controller inside Three.js Canvas.
 * Smoothly interpolates camera position and OrbitControls target to presets or focused parts.
 * Cancels automated glide immediately when user manually orbits, pans, or zooms.
 * Snaps instantly if user has prefers-reduced-motion active.
 */
export default function CameraRig({
  targetPosition,
  targetLookAt,
  isTransitioning,
  setIsTransitioning,
  orbitRef,
  prefersReducedMotion,
  onManualInteraction,
  autoRotate
}) {
  const targetPosVec = useMemo(() => new THREE.Vector3(), [])
  const targetLookVec = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    if (!orbitRef?.current) return
    const controls = orbitRef.current

    const onControlsStart = () => {
      if (setIsTransitioning) {
        setIsTransitioning(false)
      }
      if (onManualInteraction) {
        onManualInteraction()
      }
    }

    controls.addEventListener('start', onControlsStart)
    return () => {
      controls.removeEventListener('start', onControlsStart)
    }
  }, [orbitRef, setIsTransitioning, onManualInteraction])

  useFrame((state, delta) => {
    // If 360 auto-rotate is active, CameraRig yields completely so OrbitControls can rotate without conflict
    if (autoRotate) return
    if (!isTransitioning || !targetPosition || !orbitRef?.current) return

    if (prefersReducedMotion) {
      state.camera.position.set(...targetPosition)
      if (targetLookAt) {
        orbitRef.current.target.set(...targetLookAt)
      }
      orbitRef.current.update()
      setIsTransitioning(false)
      return
    }

    targetPosVec.set(...targetPosition)
    targetLookVec.set(...(targetLookAt || [0, 0.45, 0]))

    const factor = Math.min(delta * 4.5, 0.22)
    state.camera.position.lerp(targetPosVec, factor)
    orbitRef.current.target.lerp(targetLookVec, factor)
    orbitRef.current.update()

    const posDist = state.camera.position.distanceTo(targetPosVec)
    const lookDist = orbitRef.current.target.distanceTo(targetLookVec)
    if (posDist < 0.05 && lookDist < 0.02) {
      state.camera.position.copy(targetPosVec)
      orbitRef.current.target.copy(targetLookVec)
      orbitRef.current.update()
      setIsTransitioning(false)
    }
  })

  return null
}
