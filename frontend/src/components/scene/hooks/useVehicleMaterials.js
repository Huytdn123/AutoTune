import { useMemo, useEffect } from 'react'
import * as THREE from 'three'

/**
 * useVehicleMaterials - Manages lifecycle, reactive PBR properties, and GPU disposal
 * for custom vehicle materials (body paint, rim metal details, tinted glass, interior leather).
 */
export function useVehicleMaterials({
  bodyColor = '#CC0000',
  detailsColor = '#CCCCCC',
  glassColor = '#C8D8F0',
  interiorColor = '#1A1A1A',
}) {
  // Studio-grade PBR Car Paint Material
  const bodyMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    name: 'custom_body_paint',
    color: new THREE.Color(bodyColor),
    metalness: 0.65,
    roughness: 0.28,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    envMapIntensity: 1.4,
  }), [])

  // Wheel Rims & Metal Trim Material
  const detailsMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    name: 'custom_rim_details',
    color: new THREE.Color(detailsColor || '#CCCCCC'),
    metalness: 0.88,
    roughness: 0.24,
    envMapIntensity: 1.4,
  }), [])

  // Realistic Automotive Glass Material (tinted, transparent, anti-blowout)
  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    name: 'custom_automotive_glass',
    color: new THREE.Color(glassColor || '#141c24'),
    metalness: 0.1,
    roughness: 0.04,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
    envMapIntensity: 1.8,
    ior: 1.52,
  }), [])

  // Luxury Cockpit & Interior Leather Material (applied strictly to seats & steering leather)
  const interiorMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    name: 'custom_interior_leather',
    color: new THREE.Color(interiorColor || '#1A1A1A'),
    roughness: 0.72,
    metalness: 0.08,
  }), [])

  // Dispose generated materials on unmount to prevent WebGL resource leaks
  useEffect(() => {
    return () => {
      bodyMaterial.dispose()
      detailsMaterial.dispose()
      glassMaterial.dispose()
      interiorMaterial.dispose()
    }
  }, [bodyMaterial, detailsMaterial, glassMaterial, interiorMaterial])

  // Reactively update body paint finish
  useEffect(() => {
    const c = new THREE.Color(bodyColor)
    bodyMaterial.color.copy(c)
    // Automotive paint finish tuning: light/white coats get refined specular balance for rich pearl gloss
    const luminance = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b
    if (luminance > 0.82) {
      bodyMaterial.metalness = 0.35
      bodyMaterial.roughness = 0.22
    } else {
      bodyMaterial.metalness = 0.65
      bodyMaterial.roughness = 0.28
    }
    bodyMaterial.needsUpdate = true
  }, [bodyColor, bodyMaterial])

  // Reactively update rim & detail metal trim
  useEffect(() => {
    if (detailsColor) {
      detailsMaterial.color.set(detailsColor)
      detailsMaterial.needsUpdate = true
    }
  }, [detailsColor, detailsMaterial])

  // Reactively update glass tint & transparency
  useEffect(() => {
    glassMaterial.color.set(glassColor || '#141c24')
    const isDarkTint = glassColor === '#0a0d12' || glassColor === '#1A1A1A'
    glassMaterial.opacity = isDarkTint ? 0.78 : 0.38
    glassMaterial.needsUpdate = true
  }, [glassColor, glassMaterial])

  // Reactively update cockpit interior leather
  useEffect(() => {
    interiorMaterial.color.set(interiorColor || '#1A1A1A')
    interiorMaterial.needsUpdate = true
  }, [interiorColor, interiorMaterial])

  return useMemo(() => ({
    bodyMaterial,
    detailsMaterial,
    glassMaterial,
    interiorMaterial,
  }), [bodyMaterial, detailsMaterial, glassMaterial, interiorMaterial])
}

