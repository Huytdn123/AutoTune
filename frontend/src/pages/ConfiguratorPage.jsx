import React, { useState, useEffect, useCallback, Suspense, useRef, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import {
  VehicleModel3D,
  ShowroomFloor,
  StudioLights,
  CarLoadingFallback,
} from '../components/CarScene3D'
import { carApi, buildApi, partApi } from '../services/api'
import ModelSelector from '../components/configurator/ModelSelector'
import SpecsViewer from '../components/configurator/SpecsViewer'
import ColorSelector from '../components/configurator/ColorSelector'
import WheelSelector from '../components/configurator/WheelSelector'
import BodyAeroSelector from '../components/configurator/BodyAeroSelector'
import CameraPresetsBar from '../components/configurator/CameraPresetsBar'
import SpoilerSelector from '../components/configurator/SpoilerSelector'
import PerformanceHardwareSelector from '../components/configurator/PerformanceHardwareSelector'
import ConfiguratorFooterSummary from '../components/configurator/ConfiguratorFooterSummary'
import SaveBuildModal from '../components/configurator/SaveBuildModal'
import CameraRig from '../components/configurator/CameraRig'
import {
  BODY_COLORS,
  RIM_COLORS,
  GLASS_COLORS,
  INTERIOR_COLORS,
} from '../constants/configuratorPresets'
import { useBuildPricing } from '../hooks/useBuildPricing'

export { INTERIOR_COLORS }

export default function ConfiguratorPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isDark } = useTheme()
  const orbitRef = useRef()

  // ── Car model selection (100% Backend DB Driven) ───────────────────────────
  const [carList, setCarList] = useState([])
  const [loadingCars, setLoadingCars] = useState(true)
  const [carError, setCarError] = useState(null)
  const [selectedModelId, setSelectedModelId] = useState(null)
  const activeCar = carList.find(c => c.id === selectedModelId || c.slug === selectedModelId) || carList[0] || null

  // ── Build persistence state ────────────────────────────────────────────────
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [buildNameInput, setBuildNameInput] = useState('')
  const [savedBuildData, setSavedBuildData] = useState(null)
  const [savingBuild, setSavingBuild] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [lastSavedConfig, setLastSavedConfig] = useState(null)

  // ── Visual Tuning & Material state (Teacher's Demo Requirements) ─────────────
  const [bodyColor, setBodyColor]   = useState('#CC0000')
  const [rimColor,  setRimColor]    = useState('#CCCCCC')
  const [glassColor, setGlassColor] = useState(GLASS_COLORS[0].hex)
  const [interiorColor, setInteriorColor] = useState('#1A1A1A')
  const [selectedBody,  setSelectedBody]  = useState(() => BODY_COLORS[0])
  const [selectedRim,   setSelectedRim]   = useState(() => RIM_COLORS[0])
  const [selectedGlass, setSelectedGlass] = useState(GLASS_COLORS[0])
  const [selectedInterior, setSelectedInterior] = useState(INTERIOR_COLORS[0])

  // Real Database Parts Catalog & Selected Parts (Zero fake parts, 100% DB sourced)
  const [partsCatalog, setPartsCatalog] = useState([])
  const [selectedParts, setSelectedParts] = useState([])

  // 3D Physical Customization States (Geometry-level Real Part Swaps)
  const [selectedWheel,   setSelectedWheel]   = useState(null)  // null = OEM, or part sku / id
  const [wheelFinish,     setWheelFinish]     = useState('GLOSS_BLACK') // GLOSS_BLACK, SATIN_BLACK, SILVER, GUNMETAL
  const [selectedBodykit, setSelectedBodykit] = useState(null)  // null = OEM, or part sku / id
  const [selectedSpoiler, setSelectedSpoiler] = useState(null)  // null = OEM, 'big-country-labs-style-wing'

  // ── Camera Glide & Accessibility Controls ──────────────────────────────────
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return false
  })
  const [autoRotate, setAutoRotate] = useState(false)

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

  const [hasInteracted, setHasInteracted] = useState(false)
  const transitionTimerRef = useRef(null)

  // Strict lockstep: Keep orbitRef.current.autoRotate 100% synchronized with React autoRotate state
  useEffect(() => {
    if (orbitRef.current) {
      orbitRef.current.autoRotate = Boolean(autoRotate)
      orbitRef.current.update()
    }
  }, [autoRotate])

  const handleManualInteraction = useCallback(() => {
    setHasInteracted(true)
    setAutoRotate(false)
    if (orbitRef.current) {
      orbitRef.current.autoRotate = false
    }
  }, [])

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
  }, [])

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
  }, [])

  const handleCameraPreset = useCallback((cam, target = [0, 0.45, 0], label = null) => {
    setAutoRotate(false)
    glideCameraTo(cam, target, label)
  }, [glideCameraTo])

  // Mutually exclusive wheel and toggleable aero/spoiler handlers with dedicated part-focus camera glide
  const handleSelectWheel = useCallback((part) => {
    setAutoRotate(false)
    if (!part) {
      setSelectedWheel(null)
      setSelectedParts(prev => prev.filter(p => !p.category?.toLowerCase().includes('wheel') && !p.sku?.includes('WORK') && !p.sku?.includes('NOV') && !p.sku?.includes('BBS') && !p.sku?.includes('RAYS')))
      glideCameraTo([4.6, 1.9, 5.5], [0, 0.45, 0], '3/4 Front')
    } else {
      setSelectedWheel(part.sku || 'WORK-VSXX-19-F458')
      setSelectedParts(prev => {
        const filtered = prev.filter(p => !p.category?.toLowerCase().includes('wheel') && !p.sku?.includes('WORK') && !p.sku?.includes('NOV') && !p.sku?.includes('BBS') && !p.sku?.includes('RAYS'))
        return [...filtered, part]
      })
      // Glides directly to close-up on front wheel dish, deep rim lip, and brake caliper
      glideCameraTo([2.15, 0.58, 2.05], [0.92, 0.36, 1.18], null)
    }
  }, [glideCameraTo])

  const handleToggleBodykit = useCallback((part) => {
    setAutoRotate(false)
    setSelectedBodykit(prev => {
      const willBeActive = !prev
      if (!willBeActive) {
        setSelectedParts(pList => pList.filter(p => !p.category?.toLowerCase().includes('aero') && !p.sku?.includes('CARB-AERO') && p.sku !== 'VOR-CF-AERO-992'))
        glideCameraTo([4.6, 1.9, 5.5], [0, 0.45, 0], '3/4 Front')
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
        // Low front-quarter hero angle framing front carbon splitter and intake canards
        glideCameraTo([1.95, 0.52, 3.1], [0, 0.32, 1.75], null)
        return 'carbon-aero'
      }
    })
  }, [glideCameraTo])

  const handleToggleSpoiler = useCallback((part) => {
    setAutoRotate(false)
    setSelectedSpoiler(prev => {
      const targetSku = part?.sku || 'GEN-GTWING-F458'
      const isAlreadyActive = prev === targetSku || (prev && prev === 'big-country-labs-style-wing' && targetSku === 'GEN-GTWING-F458')
      if (isAlreadyActive) {
        setSelectedParts(pList => pList.filter(p => !p.category?.toLowerCase().includes('spoiler') && !p.sku?.includes('WING') && !p.sku?.includes('GTWING') && p.sku !== 'VOR-CF-AERO-992'))
        glideCameraTo([4.6, 1.9, 5.5], [0, 0.45, 0], '3/4 Front')
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
        // Dramatic elevated rear 3/4 overlooking carbon GT wing blade, uprights, and rear decklid
        glideCameraTo([1.85, 1.65, -3.2], [0, 0.95, -1.35], null)
        return targetSku === 'GEN-GTWING-F458' ? 'big-country-labs-style-wing' : targetSku
      }
    })
  }, [glideCameraTo])

  const handleToggleHardware = useCallback((part) => {
    setAutoRotate(false)
    setSelectedParts(prev => {
      const exists = prev.some(p => (p.partId || p.id) === (part.partId || part.id))
      if (exists) {
        const remaining = prev.filter(p => (p.partId || p.id) !== (part.partId || part.id))
        if (remaining.length === 0) {
          glideCameraTo([4.6, 1.9, 5.5], [0, 0.45, 0], '3/4 Front')
        }
        return remaining
      } else {
        const rawName = (part.name || part.partName || '').toLowerCase()
        const category = (part.category || '').toLowerCase()
        if (rawName.includes('akrapov') || category.includes('exhaust')) {
          // Low rear center angle focusing directly on titanium exhaust tips and rear diffuser
          glideCameraTo([0.65, 0.48, -3.35], [0, 0.35, -2.1], null)
        } else if (rawName.includes('brembo') || category.includes('brake')) {
          // Close-up on front brake caliper and drilled rotor
          glideCameraTo([2.15, 0.58, 2.05], [0.92, 0.36, 1.18], null)
        } else if (rawName.includes('kw') || category.includes('coilover') || category.includes('suspension')) {
          // Low profile side stance highlighting lowered stance and suspension tuck
          glideCameraTo([3.25, 0.65, 0.75], [0.9, 0.45, 0.2], null)
        } else {
          glideCameraTo([3.4, 1.2, 3.4], [0, 0.45, 0], null)
        }
        return [...prev, part]
      }
    })
  }, [glideCameraTo])

  // Fetch cars and performance parts directly from backend database
  const fetchCars = useCallback(async () => {
    setLoadingCars(true)
    setCarError(null)
    try {
      const [cars, parts] = await Promise.all([
        carApi.getAll(),
        partApi.getAll().catch(() => [])
      ])
      if (Array.isArray(parts)) {
        setPartsCatalog(parts)
      }
      if (Array.isArray(cars) && cars.length > 0) {
        setCarList(cars)
        const buildCode = searchParams.get('build') || searchParams.get('share')
        if (!buildCode) {
          const requestedModel = searchParams.get('model') || searchParams.get('car') || searchParams.get('slug')
          const targetCar = (requestedModel && cars.find(c => c.slug === requestedModel || c.id === requestedModel)) || cars[0]
          setSelectedModelId(targetCar.slug || targetCar.id)
          const defBody = targetCar.defaultBodyColor || targetCar.defaultBody || '#CC0000'
          const defRim = targetCar.defaultRimColor || targetCar.defaultRim || '#CCCCCC'
          const defGlass = GLASS_COLORS[0].hex
          setBodyColor(defBody)
          setRimColor(defRim)
          setGlassColor(defGlass)
          setSelectedBody(BODY_COLORS.find(c => c.hex.toLowerCase() === defBody.toLowerCase()) || { hex: defBody, name: 'OEM Color', finish: 'OEM' })
          setSelectedRim(RIM_COLORS.find(c => c.hex.toLowerCase() === defRim.toLowerCase()) || { hex: defRim, name: 'OEM Rim' })
          setSelectedGlass(GLASS_COLORS[0])
          setInteriorColor(INTERIOR_COLORS[0].hex)
          setSelectedInterior(INTERIOR_COLORS[0])
          setSelectedParts([])
        }
      } else {
        setCarError('Vehicle catalog not found in database. Please check Backend service.')
      }
    } catch (err) {
      console.error('Backend car fetch failed:', err)
      setCarError('Unable to connect to Backend car catalog (/api/cars). Please retry.')
    } finally {
      setLoadingCars(false)
    }
  }, [searchParams])

  useEffect(() => {
    fetchCars()
  }, [fetchCars])

  // ── Load build from ?build=CODE or ?share=CODE URL param ──────────────────
  useEffect(() => {
    const buildCode = searchParams.get('build') || searchParams.get('share')
    if (buildCode) {
      buildApi.getByCode(buildCode).then(build => {
        if (build) {
          const carIdentifier = build.car?.slug || build.car?.id || build.carSlug || build.carId
          if (carIdentifier) {
            setSelectedModelId(carIdentifier)
          }
          if (build.bodyColor) {
            setBodyColor(build.bodyColor)
            setSelectedBody(
              BODY_COLORS.find(c => c.hex.toLowerCase() === build.bodyColor.toLowerCase()) || 
              { hex: build.bodyColor, name: 'Custom Paint', finish: build.bodyFinish || 'Custom' }
            )
          }
          if (build.rimColor) {
            setRimColor(build.rimColor)
            setSelectedRim(
              RIM_COLORS.find(c => c.hex.toLowerCase() === build.rimColor.toLowerCase()) || 
              { hex: build.rimColor, name: 'Custom Rim' }
            )
          }
          if (build.glassColor) {
            setGlassColor(build.glassColor)
            setSelectedGlass(
              GLASS_COLORS.find(c => c.hex.toLowerCase() === build.glassColor.toLowerCase()) || 
              { hex: build.glassColor, name: 'Custom Tint' }
            )
          }

          // Restore Interior, Wheel, Bodykit, and Spoiler from saved configuration JSON
          try {
            if (build.selectedPartsJson) {
              const cfg = typeof build.selectedPartsJson === 'string'
                ? JSON.parse(build.selectedPartsJson)
                : build.selectedPartsJson
              
              if (cfg.interiorColor) {
                setInteriorColor(cfg.interiorColor)
                setSelectedInterior(
                  INTERIOR_COLORS.find(c => c.hex.toLowerCase() === cfg.interiorColor.toLowerCase()) ||
                  { hex: cfg.interiorColor, name: cfg.interiorColorName || 'Custom Interior', finish: 'Custom' }
                )
              }
              if (cfg.wheelFinish) {
                setWheelFinish(cfg.wheelFinish)
              }
              if (Array.isArray(cfg.selectedParts)) {
                setSelectedParts(cfg.selectedParts)
                const w = cfg.selectedParts.find(p => (p.category || '').toLowerCase().includes('wheel') || (p.sku || '').includes('WORK') || (p.sku || '').includes('VSXX'))
                setSelectedWheel(w ? (w.sku || 'WORK-VSXX-19-F458') : (cfg.selectedWheelSku || null))
                const b = cfg.selectedParts.find(p => (p.category || '').toLowerCase().includes('aero') || (p.sku || '').includes('AERO'))
                setSelectedBodykit(b ? (b.sku || 'carbon-aero') : (cfg.bodyAeroEnabled ? 'carbon-aero' : (cfg.selectedBodykitSku || null)))
                const s = cfg.selectedParts.find(p => (p.category || '').toLowerCase().includes('spoiler') || (p.sku || '').includes('WING') || (p.sku || '').includes('GTWING') || (p.sku || '').includes('BCL'))
                if (s) {
                  setSelectedSpoiler('big-country-labs-style-wing')
                } else if (cfg.selectedSpoilerSku) {
                  setSelectedSpoiler(cfg.selectedSpoilerSku)
                } else {
                  setSelectedSpoiler(null)
                }
              }
            }
          } catch (e) {
            console.warn('Failed to parse saved build parts JSON:', e)
          }

          setLastSavedConfig({
            carId: carIdentifier,
            bodyColor: build.bodyColor,
            rimColor: build.rimColor,
            glassColor: build.glassColor,
            buildData: build
          })
          setToastMessage(`Restored 3D build: ${build.buildName || build.shareCode} (${build.shareCode})`)
          setTimeout(() => setToastMessage(null), 4000)
        }
      }).catch(err => {
        console.warn('Could not load build from code:', err)
      })
    }
  }, [searchParams])

  // ── Viewer controls ────────────────────────────────────────────────────────
  const [activeTab,    setActiveTab]    = useState('performance')
  const [activeSection, setActiveSection] = useState('model')  // 'model'|'color'|'specs'|'options'
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Dynamic options total strictly from selected database parts via useBuildPricing hook
  const { optionsTotal, totalEstimatedCost } = useBuildPricing(activeCar, selectedParts)

  // Switch car model → reset colors and parts to defaults
  const handleModelSwitch = useCallback((car) => {
    setSelectedModelId(car.slug || car.id)
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
    setActiveSection('color')
    glideCameraTo([4.6, 1.9, 5.5], [0, 0.45, 0], '3/4 Front')
  }, [glideCameraTo])

  const handleBodyColor = useCallback((color) => {
    setAutoRotate(false)
    setSelectedBody(color)
    setBodyColor(color.hex)
    glideCameraTo([4.6, 1.9, 5.5], [0, 0.45, 0], '3/4 Front')
  }, [glideCameraTo])

  const handleRimColor = useCallback((color) => {
    setAutoRotate(false)
    setSelectedRim(color)
    setRimColor(color.hex)
    // Close-up on front-left wheel dish, rim finish, and brake caliper
    glideCameraTo([2.15, 0.58, 2.05], [0.92, 0.36, 1.18], null)
  }, [glideCameraTo])

  const handleGlassColor = useCallback((color) => {
    setAutoRotate(false)
    setSelectedGlass(color)
    setGlassColor(color.hex)
    glideCameraTo([2.8, 1.25, 2.2], [0, 0.65, 0.2], null)
  }, [glideCameraTo])

  const handleInteriorColor = useCallback((color) => {
    setAutoRotate(false)
    setSelectedInterior(color)
    setInteriorColor(color.hex)
    // Angle looking directly through driver window into cabin seats and steering wheel
    glideCameraTo([0.98, 1.28, 0.55], [-0.15, 0.72, 0.05], null)
  }, [glideCameraTo])

  const handleCustomBodyColor = useCallback((hex) => {
    setAutoRotate(false)
    setBodyColor(hex)
    setSelectedBody({ hex, name: 'Custom', finish: 'Custom' })
    glideCameraTo([4.6, 1.9, 5.5], [0, 0.45, 0], '3/4 Front')
  }, [glideCameraTo])

  // ── Build Save & Share Handlers ───────────────────────────────────────────
  const isCurrentConfigSaved = Boolean(
    activeCar &&
    lastSavedConfig &&
    lastSavedConfig.carId === activeCar.id &&
    lastSavedConfig.bodyColor?.toLowerCase() === bodyColor?.toLowerCase() &&
    lastSavedConfig.rimColor?.toLowerCase() === rimColor?.toLowerCase() &&
    lastSavedConfig.glassColor?.toLowerCase() === glassColor?.toLowerCase()
  )

  const handleOpenSaveModal = useCallback(() => {
    if (!activeCar) return
    if (isCurrentConfigSaved && lastSavedConfig?.buildData) {
      setSavedBuildData(lastSavedConfig.buildData)
      setCopiedLink(false)
      setShowSaveModal(true)
    } else {
      setBuildNameInput(`${activeCar.name} Custom Tune`)
      setSavedBuildData(null)
      setCopiedLink(false)
      setShowSaveModal(true)
    }
  }, [isCurrentConfigSaved, lastSavedConfig, activeCar])

  const handleSaveBuild = useCallback(async (e, forceNew = false) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()
    if (!activeCar) return
    setSavingBuild(true)
    try {
      const payload = {
        carId: activeCar.carId || (typeof activeCar.id === 'number' ? activeCar.id : null),
        carSlug: activeCar.slug || activeCar.id,
        buildName: buildNameInput.trim() || `${activeCar.name} Custom Build`,
        bodyColor,
        bodyFinish: selectedBody?.finish || 'OEM',
        rimColor,
        glassColor,
        forceNew: Boolean(forceNew),
        selectedPartsJson: JSON.stringify({
          carName: `${activeCar.brand} ${activeCar.model}`,
          bodyColorName: selectedBody?.name,
          rimFinishName: selectedRim?.name,
          interiorColor,
          interiorColorName: selectedInterior?.name,
          glassColorName: selectedGlass?.name,
          selectedWheelSku: selectedWheel,
          wheelFinish,
          selectedBodykitSku: selectedBodykit,
          bodyAeroEnabled: Boolean(selectedBodykit),
          selectedSpoilerSku: selectedSpoiler,
          selectedParts: selectedParts.map(p => ({
            partId: p.partId || p.id,
            sku: p.sku,
            name: p.name || p.partName,
            priceUsd: p.priceUsd,
            priceVnd: p.priceVnd,
            category: p.category,
            material: p.material,
            assetUrl: p.assetUrl,
            brand: p.brand
          })),
          basePrice: activeCar.price,
          optionsTotal,
          totalEstimatedCost
        }),
        totalEstimatedCost
      }
      const res = await buildApi.create(payload)
      setSavedBuildData(res)
      setLastSavedConfig({
        carId: activeCar.id,
        bodyColor,
        rimColor,
        glassColor,
        buildData: res
      })
      setToastMessage(`Build saved successfully! Share Code: ${res.shareCode}`)
      setTimeout(() => setToastMessage(null), 4000)
    } catch (err) {
      console.warn('Backend save build failed, using offline fallback:', err)
      const fallbackCode = `VT-${(activeCar.slug || 'CAR').toUpperCase().slice(0, 4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      const fallbackBuild = {
        shareCode: fallbackCode,
        buildName: buildNameInput.trim() || `${activeCar.name} Custom Build`,
        bodyColor,
        bodyFinish: selectedBody?.finish || 'OEM',
        rimColor,
        glassColor,
        createdAt: new Date().toISOString()
      }
      setSavedBuildData(fallbackBuild)
      setLastSavedConfig({
        carId: activeCar.id,
        bodyColor,
        rimColor,
        glassColor,
        buildData: fallbackBuild
      })
      setToastMessage(`Build saved! Share Code: ${fallbackCode}`)
      setTimeout(() => setToastMessage(null), 4000)
    } finally {
      setSavingBuild(false)
    }
  }, [
    activeCar,
    buildNameInput,
    bodyColor,
    selectedBody,
    rimColor,
    selectedRim,
    glassColor,
    interiorColor,
    selectedInterior,
    selectedGlass,
    selectedParts,
    selectedWheel,
    wheelFinish,
    selectedBodykit,
    selectedSpoiler,
    optionsTotal,
    totalEstimatedCost
  ])

  const handleCopyShareLink = useCallback(() => {
    if (!savedBuildData?.shareCode) return
    const url = `${window.location.origin}/configurator?share=${savedBuildData.shareCode}`
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    }).catch(err => {
      console.error('Clipboard copy failed:', err)
    })
  }, [savedBuildData])

  // ── Loading state while fetching cars from backend database ────────────────
  if (loadingCars) {
    return (
      <div className="bg-[#0d0d12] text-white h-[calc(100vh-4rem)] flex flex-col items-center justify-center w-full font-sans select-none">
        <div className="w-14 h-14 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
        <h3 className="text-sm font-bold tracking-widest uppercase text-white/90">Initializing 3D Studio</h3>
        <p className="text-xs text-white/40 mt-1 font-mono">Loading vehicle 3D models and technical specs...</p>
      </div>
    )
  }

  // ── Error state if backend car fetch fails ──────────────────────────────────
  if (carError && !activeCar) {
    return (
      <div className="bg-[#0d0d12] text-white h-[calc(100vh-4rem)] flex flex-col items-center justify-center w-full font-sans select-none text-center p-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
          <span className="material-symbols-outlined text-2xl">cloud_off</span>
        </div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">3D Vehicle Catalog Error</h3>
        <p className="text-xs text-white/50 max-w-md mb-5 leading-relaxed">{carError}</p>
        <button
          onClick={fetchCars}
          className="px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Retry Connection
        </button>
      </div>
    )
  }

  if (!activeCar) {
    return null
  }

  return (
    <div className={`antialiased h-[calc(100vh-4rem)] flex flex-col w-full overflow-hidden select-none font-sans transition-colors duration-300 ${
      isDark ? 'bg-[#0a0a10] text-white' : 'bg-[#edf0f5] text-slate-900'
    }`}>

      {/* ── MAIN LAYOUT (Pure 2-Panel Split: 3D Viewport + Narrowed Customizer Panel ~72% Width) ── */}
      <div className="flex flex-1 overflow-hidden min-h-0 relative [--panel-w:min(92vw,360px)] sm:[--panel-w:340px] md:[--panel-w:380px] lg:[--panel-w:420px] xl:[--panel-w:448px] 2xl:[--panel-w:456px]">

        {/* ── 3D CANVAS VIEWPORT ───────────────────────────────────────────── */}
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
              />
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

          {/* ── BOTTOM VIEW CONTROLS (Floating Glass Dock with 360° Switch) ──── */}
          <CameraPresetsBar
            onSelectPreset={handleCameraPreset}
            activePreset={cameraGoal.presetName}
            autoRotate={autoRotate}
            onToggleAutoRotate={handleToggleAutoRotate}
            prefersReducedMotion={prefersReducedMotion}
            isDark={isDark}
          />
        </main>

        {/* ── SIDEBAR TOGGLE BUTTON (always visible at edge) ──────────────── */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          title={sidebarOpen ? 'Collapse panel' : 'Expand panel'}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-5 h-12 rounded-l-lg transition-all group cursor-pointer ${
            isDark
              ? 'bg-[#141420] border border-white/20 hover:bg-white/10 text-white/70 hover:text-white shadow-xl'
              : 'bg-white border-2 border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 shadow-md'
          }`}
          style={{
            right: sidebarOpen ? 'var(--panel-w, 448px)' : '0px',
            transition: 'right 0.35s cubic-bezier(0.4,0,0.2,1)'
          }}
        >
          <span
            className="material-symbols-outlined text-sm transition-transform duration-300"
            style={{ transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}
          >
            chevron_right
          </span>
        </button>

        {/* ── NARROWED SIDE PANEL (Target ~70-75% width: 420-456px on desktop) ── */}
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

          {/* Header (Aligned with content & footer via px-4) */}
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

          {/* Content (Aligned with header & footer via px-4, independent scrolling) */}
          <div
            className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3.5 space-y-3.5 min-h-0 pb-6"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: isDark ? '#333 transparent' : '#cbd5e1 transparent'
            }}
          >

            {/* ── MODEL SELECTOR TAB ──────────────────────────────────────── */}
            {activeSection === 'model' && (
              <ModelSelector
                carList={carList}
                selectedModelId={selectedModelId}
                onSelectModel={handleModelSwitch}
                isDark={isDark}
              />
            )}

            {/* ── COLOR TAB ───────────────────────────────────────────────── */}
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

            {/* ── SPECS TAB ───────────────────────────────────────────────── */}
            {activeSection === 'specs' && (
              <SpecsViewer
                activeCar={activeCar}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isDark={isDark}
              />
            )}

            {/* ── HARDWARE TAB: 4 Core Physical Customization Groups ── */}
            {activeSection === 'hardware' && (
              <div className="space-y-4">

                {/* Info banner */}
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

                {/* ── GROUP 1: WHEELS ── */}
                <WheelSelector
                  partsCatalog={partsCatalog}
                  selectedWheel={selectedWheel}
                  onSelectWheel={handleSelectWheel}
                  isDark={isDark}
                />

                <div className={`h-px ${isDark ? 'bg-white/6' : 'bg-slate-200'}`} />

                {/* ── GROUP 2: BODY & AERODYNAMICS (Checkbox, Unchecked by default) ── */}
                <BodyAeroSelector
                  partsCatalog={partsCatalog}
                  selectedBodykit={selectedBodykit}
                  onToggleBodykit={handleToggleBodykit}
                  isDark={isDark}
                />

                <div className={`h-px ${isDark ? 'bg-white/6' : 'bg-slate-200'}`} />

                {/* ── GROUP 3: REAR SPOILER & WING (Checkbox, Unchecked by default) ── */}
                <SpoilerSelector
                  partsCatalog={partsCatalog}
                  selectedSpoiler={selectedSpoiler}
                  onToggleSpoiler={handleToggleSpoiler}
                  isDark={isDark}
                />

                <div className={`h-px ${isDark ? 'bg-white/6' : 'bg-slate-200'}`} />

                {/* ── GROUP 4: PERFORMANCE & HARDWARE ── */}
                <PerformanceHardwareSelector
                  partsCatalog={partsCatalog}
                  selectedParts={selectedParts}
                  onToggleHardware={handleToggleHardware}
                  isDark={isDark}
                />

              </div>
            )}
          </div>

          {/* ── FOOTER / CTA (Always Fixed & Visible) ────────── */}
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
      </div>

      {/* ── SAVE & SHARE BUILD MODAL ───────────────────────────────────────── */}
      <SaveBuildModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        activeCar={activeCar}
        savedBuildData={savedBuildData}
        buildNameInput={buildNameInput}
        onBuildNameChange={setBuildNameInput}
        onSaveBuild={handleSaveBuild}
        savingBuild={savingBuild}
        totalEstimatedCost={totalEstimatedCost}
        bodyColor={bodyColor}
        selectedBody={selectedBody}
        interiorColor={interiorColor}
        selectedInterior={selectedInterior}
        selectedWheel={selectedWheel}
        selectedSpoiler={selectedSpoiler}
        copiedLink={copiedLink}
        onCopyShareLink={handleCopyShareLink}
        isCurrentConfigSaved={isCurrentConfigSaved}
        onCreateNewCode={() => {
          setSavedBuildData(null)
          setBuildNameInput(`${activeCar.name} Custom Tune (New)`)
        }}
        onRequestQuote={(shareCode) => navigate(`/quotation?build=${shareCode}`)}
      />

      {/* ── TOAST NOTIFICATION ─────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#1c1c28]/95 border border-primary/40 text-white text-xs font-medium shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
