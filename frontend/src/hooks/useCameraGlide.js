import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * useCameraGlide - Manages camera presets, smooth glides to parts,
 * lockstep turntable auto-rotation, and accessibility motion preferences.
 */
export function useCameraGlide(orbitRef) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return false
  })
  const [autoRotate, setAutoRotate] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const transitionTimerRef = useRef(null)

  // Motion preference listener
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleMotionChange = (e) => {
      setPrefersReducedMotion(e.matches)
      if (e.matches) {
        setAutoRotate(false)
      }
    }

    if (mq.addEventListener) {
      mq.addEventListener('change', handleMotionChange)
    } else if (mq.addListener) {
      mq.addListener(handleMotionChange)
    }

    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', handleMotionChange)
      } else if (mq.removeListener) {
        mq.removeListener(handleMotionChange)
      }
    }
  }, [])

  // Strict lockstep: Keep orbitRef.current.autoRotate 100% synchronized with React autoRotate state
  useEffect(() => {
    if (orbitRef.current) {
      orbitRef.current.autoRotate = Boolean(autoRotate)
      orbitRef.current.update()
    }
  }, [autoRotate, orbitRef])

  const handleManualInteraction = useCallback(() => {
    setHasInteracted(true)
    setAutoRotate(false)
    if (orbitRef.current) {
      orbitRef.current.autoRotate = false
    }
  }, [orbitRef])

  const handleToggleAutoRotate = useCallback(() => {
    setAutoRotate(prev => {
      const next = !prev
      if (next) {
        // Turning ON: terminate any camera transition immediately so there is zero lockup
        setIsCameraTransitioning(false)
        if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)
        setCameraGoal(cg => ({ ...cg, presetName: null }))
        if (orbitRef.current) {
          // Re-center orbit target smoothly on car origin so turntable rotation is centered
          orbitRef.current.target.set(0, 0.45, 0)
          orbitRef.current.autoRotate = true
          orbitRef.current.update()
        }
      } else {
        if (orbitRef.current) {
          orbitRef.current.autoRotate = false
          orbitRef.current.update()
        }
      }
      return next
    })
  }, [orbitRef])

  // Camera transition state
  const [cameraGoal, setCameraGoal] = useState({
    position: [4.6, 1.9, 5.5],
    target: [0, 0.45, 0],
    presetName: '3/4 Front'
  })
  const [isCameraTransitioning, setIsCameraTransitioning] = useState(false)

  const glideCameraTo = useCallback((position, target = [0, 0.45, 0], presetName = null) => {
    setAutoRotate(false)
    if (orbitRef.current) {
      orbitRef.current.autoRotate = false
    }
    setCameraGoal({ position, target, presetName })
    setIsCameraTransitioning(true)

    // Failsafe timer: Ensure camera transition always finishes cleanly within 1.2s
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)
    transitionTimerRef.current = setTimeout(() => {
      setIsCameraTransitioning(false)
    }, 1200)
  }, [orbitRef])

  const handleCameraPreset = useCallback((cam, target = [0, 0.45, 0], label = null) => {
    setAutoRotate(false)
    glideCameraTo(cam, target, label)
  }, [glideCameraTo])

  return {
    autoRotate,
    setAutoRotate,
    hasInteracted,
    prefersReducedMotion,
    cameraGoal,
    setCameraGoal,
    isCameraTransitioning,
    setIsCameraTransitioning,
    glideCameraTo,
    handleCameraPreset,
    handleManualInteraction,
    handleToggleAutoRotate,
  }
}

