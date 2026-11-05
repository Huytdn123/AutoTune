import { useState, useCallback } from 'react'
import {
  BODY_COLORS,
  RIM_COLORS,
  GLASS_COLORS,
  INTERIOR_COLORS,
} from '../constants/configuratorPresets'

/**
 * useBuildConfig - Manages vehicle color selections, aftermarket part selections,
 * mutually exclusive part toggling, and camera targeting upon part selection.
 */
export function useBuildConfig({ glideCameraTo, setAutoRotate }) {
  // Visual Tuning & Material states
  const [bodyColor, setBodyColor]   = useState('#CC0000')
  const [rimColor,  setRimColor]    = useState('#CCCCCC')
  const [glassColor, setGlassColor] = useState(GLASS_COLORS[0].hex)
  const [interiorColor, setInteriorColor] = useState('#1A1A1A')
  const [selectedBody,  setSelectedBody]  = useState(() => BODY_COLORS[0])
  const [selectedRim,   setSelectedRim]   = useState(() => RIM_COLORS[0])
  const [selectedGlass, setSelectedGlass] = useState(GLASS_COLORS[0])
  const [selectedInterior, setSelectedInterior] = useState(INTERIOR_COLORS[0])

  // Selected Parts
  const [selectedParts, setSelectedParts] = useState([])

  // 3D Physical Customization States
  const [selectedWheel,   setSelectedWheel]   = useState(null)
  const [wheelFinish,     setWheelFinish]     = useState('GLOSS_BLACK')
  const [selectedBodykit, setSelectedBodykit] = useState(null)
  const [selectedSpoiler, setSelectedSpoiler] = useState(null)

  // Color handlers with dedicated part-focus camera glide
  const handleBodyColor = useCallback((color) => {
    setAutoRotate(false)
    setSelectedBody(color)
    setBodyColor(color.hex)
    glideCameraTo([4.6, 1.9, 5.5], [0, 0.45, 0], '3/4 Front')
  }, [glideCameraTo, setAutoRotate])

  const handleRimColor = useCallback((color) => {
    setAutoRotate(false)
    setSelectedRim(color)
    setRimColor(color.hex)
    // Close-up on front-left wheel dish, rim finish, and brake caliper
    glideCameraTo([2.15, 0.58, 2.05], [0.92, 0.36, 1.18], null)
  }, [glideCameraTo, setAutoRotate])

  const handleGlassColor = useCallback((color) => {
    setAutoRotate(false)
    setSelectedGlass(color)
    setGlassColor(color.hex)
    glideCameraTo([2.8, 1.25, 2.2], [0, 0.65, 0.2], null)
  }, [glideCameraTo, setAutoRotate])

  const handleInteriorColor = useCallback((color) => {
    setAutoRotate(false)
    setSelectedInterior(color)
    setInteriorColor(color.hex)
    // Angle looking directly through driver window into cabin seats and steering wheel
    glideCameraTo([0.98, 1.28, 0.55], [-0.15, 0.72, 0.05], null)
  }, [glideCameraTo, setAutoRotate])

  const handleCustomBodyColor = useCallback((hex) => {
    setAutoRotate(false)
    setBodyColor(hex)
    setSelectedBody({ hex, name: 'Custom', finish: 'Custom' })
    glideCameraTo([4.6, 1.9, 5.5], [0, 0.45, 0], '3/4 Front')
  }, [glideCameraTo, setAutoRotate])

  // Mutually exclusive wheel and toggleable aero/spoiler handlers with dedicated part-focus camera glide
  const handleSelectWheel = useCallback((part) => {
    setAutoRotate(false)
    if (!part) {
      setSelectedWheel(null)
      setSelectedParts(prev => prev.filter(p => !p.category?.toLowerCase().includes('wheel') && !p.sku?.includes('WORK') && !p.sku?.includes('NOV') && !p.sku?.includes('BBS') && !p.sku?.includes('RAYS')))
      glideCameraTo([4.6, 1.9, 5.5], [0, 0.45, 0], '3/4 Front')
    } else {
      const sku = part.sku || 'WORK-VSXX-19-F458'
      setSelectedWheel(sku)
      setSelectedParts(prev => {
        const filtered = prev.filter(p => !p.category?.toLowerCase().includes('wheel') && !p.sku?.includes('WORK') && !p.sku?.includes('NOV') && !p.sku?.includes('BBS') && !p.sku?.includes('RAYS'))
        return [...filtered, part]
      })
      // Glides directly to close-up on front wheel dish, deep rim lip, and brake caliper
      glideCameraTo([2.15, 0.58, 2.05], [0.92, 0.36, 1.18], null)
    }
  }, [glideCameraTo, setAutoRotate])

  const handleToggleBodykit = useCallback((part) => {
    setAutoRotate(false)
    setSelectedBodykit(prev => {
      const willBeActive = !prev
      if (!willBeActive) {
        setSelectedParts(pList => pList.filter(p => !p.category?.toLowerCase().includes('aero') && !p.sku?.includes('CARB-AERO') && p.sku !== 'VOR-CF-AERO-992'))
        return null
      } else {
        const targetPart = part || {
          sku: 'CARB-AERO-F458',
          partName: 'Carbon Fiber Aerodynamics Package',
          name: 'Carbon Fiber Aerodynamics Package',
          category: 'Carbon Aero Kits',
          brand: 'Track Aerodynamics',
          priceUsd: 3200,
          priceVnd: 80000000,
        }
        setSelectedParts(pList => {
          const filtered = pList.filter(p => !p.category?.toLowerCase().includes('aero') && !p.sku?.includes('CARB-AERO'))
          return [...filtered, targetPart]
        })
        glideCameraTo([1.95, 0.52, 3.1], [0, 0.32, 1.75], null)
        return 'carbon-aero'
      }
    })
  }, [glideCameraTo, setAutoRotate])

  const handleToggleSpoiler = useCallback((part) => {
    setAutoRotate(false)
    setSelectedSpoiler(prev => {
      const targetSku = part?.sku || 'GEN-GTWING-F458'
      const isAlreadyActive = prev === targetSku || (prev && prev === 'big-country-labs-style-wing' && targetSku === 'GEN-GTWING-F458')
      if (isAlreadyActive) {
        setSelectedParts(pList => pList.filter(p => !p.category?.toLowerCase().includes('spoiler') && !p.sku?.includes('WING') && !p.sku?.includes('GTWING') && p.sku !== 'VOR-CF-AERO-992'))
        return null
      } else {
        const targetPart = part || {
          sku: 'GEN-GTWING-F458',
          partName: 'Carbon Aero GT Wing',
          name: 'Carbon Aero GT Wing',
          category: 'Rear Spoilers',
          brand: 'Track Aerodynamics',
          priceUsd: 2450,
          priceVnd: 61250000,
          assetUrl: '/models/parts/ferrari-458/spoilers/big-country-labs-style-wing.glb'
        }
        setSelectedParts(pList => {
          const filtered = pList.filter(p => !p.category?.toLowerCase().includes('spoiler') && !p.sku?.includes('WING') && !p.sku?.includes('GTWING') && p.sku !== 'VOR-CF-AERO-992')
          return [...filtered, targetPart]
        })
        glideCameraTo([1.85, 1.65, -3.2], [0, 1.0, -1.75], null)
        return targetSku === 'GEN-GTWING-F458' ? 'big-country-labs-style-wing' : targetSku
      }
    })
  }, [glideCameraTo, setAutoRotate])

  const handleToggleHardware = useCallback((part) => {
    setAutoRotate(false)
    setSelectedParts(prev => {
      const exists = prev.some(p => (p.partId || p.id) === (part.partId || part.id))
      if (exists) {
        return prev.filter(p => (p.partId || p.id) !== (part.partId || part.id))
      } else {
        const rawName = (part.name || part.partName || '').toLowerCase()
        const category = (part.category || '').toLowerCase()
        if (rawName.includes('akrapov') || category.includes('exhaust')) {
          glideCameraTo([0.65, 0.48, -3.35], [0, 0.35, -2.1], null)
        } else if (rawName.includes('brembo') || category.includes('brake')) {
          glideCameraTo([2.15, 0.58, 2.05], [0.92, 0.36, 1.18], null)
        } else if (rawName.includes('kw') || category.includes('coilover') || category.includes('suspension')) {
          glideCameraTo([3.25, 0.65, 0.75], [0.9, 0.45, 0.2], null)
        } else {
          glideCameraTo([3.4, 1.2, 3.4], [0, 0.45, 0], null)
        }
        return [...prev, part]
      }
    })
  }, [glideCameraTo, setAutoRotate])

  const resetCarConfig = useCallback((car) => {
    const defBody = car.defaultBodyColor || car.defaultBody || '#CC0000'
    const defRim = car.defaultRimColor || car.defaultRim || '#CCCCCC'
    const defGlass = GLASS_COLORS[0].hex
    setBodyColor(defBody)
    setRimColor(defRim)
    setGlassColor(defGlass)
    setSelectedBody(BODY_COLORS.find(c => c.hex.toLowerCase() === defBody.toLowerCase()) || { hex: defBody, name: 'OEM Color', finish: 'OEM' })
    setSelectedRim(RIM_COLORS.find(c => c.hex.toLowerCase() === defRim.toLowerCase()) || { hex: defRim, name: 'OEM Rim' })
    setSelectedGlass(GLASS_COLORS[0])
    setInteriorColor(INTERIOR_COLORS[0].hex)
    setSelectedInterior(INTERIOR_COLORS[0])
    setSelectedWheel(null)
    setSelectedBodykit(null)
    setSelectedSpoiler(null)
    setSelectedParts([])
  }, [])

  return {
    bodyColor,
    setBodyColor,
    rimColor,
    setRimColor,
    glassColor,
    setGlassColor,
    interiorColor,
    setInteriorColor,
    selectedBody,
    setSelectedBody,
    selectedRim,
    setSelectedRim,
    selectedGlass,
    setSelectedGlass,
    selectedInterior,
    setSelectedInterior,
    selectedParts,
    setSelectedParts,
    selectedWheel,
    setSelectedWheel,
    wheelFinish,
    setWheelFinish,
    selectedBodykit,
    setSelectedBodykit,
    selectedSpoiler,
    setSelectedSpoiler,
    handleBodyColor,
    handleRimColor,
    handleGlassColor,
    handleInteriorColor,
    handleCustomBodyColor,
    handleSelectWheel,
    handleToggleBodykit,
    handleToggleSpoiler,
    handleToggleHardware,
    resetCarConfig,
  }
}

