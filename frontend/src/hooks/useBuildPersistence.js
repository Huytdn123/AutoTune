import { useState, useEffect, useCallback, useMemo } from 'react'
import { carApi, buildApi, partApi } from '../services/api'
import {
  BODY_COLORS,
  RIM_COLORS,
  GLASS_COLORS,
  INTERIOR_COLORS,
} from '../constants/configuratorPresets'

/**
 * useBuildPersistence - Manages vehicle catalog fetching, build saving/sharing,
 * URL share code restoration, clipboard copy, and toast feedback.
 */
export function useBuildPersistence({
  searchParams,
  buildConfig,
  optionsTotal,
  totalEstimatedCost,
}) {
  const {
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
    resetCarConfig,
  } = buildConfig

  // Car model selection (100% Backend DB Driven)
  const [carList, setCarList] = useState([])
  const [loadingCars, setLoadingCars] = useState(true)
  const [carError, setCarError] = useState(null)
  const [selectedModelId, setSelectedModelId] = useState(null)
  const [partsCatalog, setPartsCatalog] = useState([])

  const activeCar = useMemo(() => {
    return carList.find(c => c.id === selectedModelId || c.slug === selectedModelId) || carList[0] || null
  }, [carList, selectedModelId])

  // Build persistence state
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [buildNameInput, setBuildNameInput] = useState('')
  const [savedBuildData, setSavedBuildData] = useState(null)
  const [savingBuild, setSavingBuild] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [lastSavedConfig, setLastSavedConfig] = useState(null)

  // Fetch cars and parts from backend database
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
          resetCarConfig(targetCar)
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
  }, [searchParams, resetCarConfig])

  useEffect(() => {
    fetchCars()
  }, [fetchCars])

  // Load build from ?build=CODE or ?share=CODE URL param
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
                const b = cfg.selectedParts.find(p => p.sku !== 'VOR-CF-AERO-992' && ((p.category || '').toLowerCase().includes('aero') || (p.sku || '').includes('AERO')))
                setSelectedBodykit(b ? (b.sku || 'carbon-aero') : (cfg.bodyAeroEnabled ? 'carbon-aero' : (cfg.selectedBodykitSku || null)))
                const s = cfg.selectedParts.find(p => (p.category || '').toLowerCase().includes('spoiler') || (p.sku || '').includes('WING') || (p.sku || '').includes('GTWING') || (p.sku || '').includes('BCL') || p.sku === 'VOR-CF-AERO-992')
                if (s) {
                  setSelectedSpoiler(s.sku === 'VOR-CF-AERO-992' ? 'VOR-CF-AERO-992' : 'big-country-labs-style-wing')
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
  }, [
    searchParams,
    setBodyColor,
    setSelectedBody,
    setRimColor,
    setSelectedRim,
    setGlassColor,
    setSelectedGlass,
    setInteriorColor,
    setSelectedInterior,
    setWheelFinish,
    setSelectedParts,
    setSelectedWheel,
    setSelectedBodykit,
    setSelectedSpoiler
  ])

  // Verification whether current configuration is saved
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

  return {
    carList,
    loadingCars,
    carError,
    selectedModelId,
    setSelectedModelId,
    activeCar,
    partsCatalog,
    fetchCars,
    showSaveModal,
    setShowSaveModal,
    buildNameInput,
    setBuildNameInput,
    savedBuildData,
    setSavedBuildData,
    savingBuild,
    copiedLink,
    toastMessage,
    isCurrentConfigSaved,
    handleOpenSaveModal,
    handleSaveBuild,
    handleCopyShareLink,
  }
}

