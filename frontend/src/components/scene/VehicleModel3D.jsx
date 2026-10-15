import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import {
  CAR_MODEL_FILES,
  PART_MODEL_FILES,
  WHEEL_FINISH_PRESETS,
  DRACO_PATH,
  FERRARI_AO
} from './sceneConstants'

// Preload the default vehicle model to ensure instant 3D studio mount without waiting
useGLTF.preload(CAR_MODEL_FILES['ferrari-458'], DRACO_PATH)
useGLTF.preload(PART_MODEL_FILES['wheel-work-vsxx-19'])
useGLTF.preload(PART_MODEL_FILES['spoiler-bcl-wing'])
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
  const bclWingGLB  = useGLTF(PART_MODEL_FILES['spoiler-bcl-wing'])
  const bremboGLB   = useGLTF(PART_MODEL_FILES['brakes-brembo-gt'])
  const exhaustGLB  = useGLTF(PART_MODEL_FILES['exhaust-akrapovic'])
  const groupRef = useRef()

  // Clone scene deep so each model instance is isolated from the global cache
  const clonedScene = useMemo(() => scene.clone(true), [scene])

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

  // Reactively update material colors
  useEffect(() => {
    bodyMaterial.color.set(bodyColor)
    bodyMaterial.needsUpdate = true
  }, [bodyColor, bodyMaterial])

  useEffect(() => {
    if (detailsColor) {
      detailsMaterial.color.set(detailsColor)
      detailsMaterial.needsUpdate = true
    }
  }, [detailsColor, detailsMaterial])

  useEffect(() => {
    glassMaterial.color.set(glassColor || '#141c24')
    const isDarkTint = glassColor === '#0a0d12' || glassColor === '#1A1A1A'
    glassMaterial.opacity = isDarkTint ? 0.78 : 0.38
    glassMaterial.needsUpdate = true
  }, [glassColor, glassMaterial])

  useEffect(() => {
    interiorMaterial.color.set(interiorColor || '#1A1A1A')
    interiorMaterial.needsUpdate = true
  }, [interiorColor, interiorMaterial])

  // Setup scene: remove license plates, apply materials, auto-orient and scale
  useEffect(() => {
    if (!clonedScene) return

    // Reset transforms before measuring bounds
    clonedScene.position.set(0, 0, 0)
    clonedScene.scale.set(1, 1, 1)
    clonedScene.rotation.set(0, 0, 0)

    const isFerrari = modelPath.includes('ferrari')
    const isLambo   = modelPath.includes('lamborghini')
    const isPorsche = modelPath.includes('porsche')
    const isMcLaren = modelPath.includes('mclaren')
    const isBMW     = modelPath.includes('bmw')

    const platesToRemove = []

    // 1. Precise mesh classification & material assignment
    clonedScene.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true

        const mat = child.material
        const matName = mat ? (mat.name || '').toLowerCase() : ''
        const nodeName = (child.name || '').toLowerCase()

        // ── 1. FERRARI 458 ITALIA: EXPLICIT ZERO-GUESSWORK CLASSIFICATION ──
        if (isFerrari) {
          if (nodeName === 'body') {
            child.material = bodyMaterial
          } else if (nodeName === 'glass') {
            child.material = glassMaterial
          } else if (nodeName === 'leather' || nodeName === 'steering_leather' || nodeName === 'trim' || nodeName === 'steering_trim') {
            child.material = interiorMaterial
          } else if (
            nodeName.startsWith('rim_') ||
            (nodeName.startsWith('wheel') && !['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'].includes(nodeName)) ||
            (child.parent && child.parent.name.toLowerCase().startsWith('wheel_') && (nodeName.includes('wheel') || nodeName.includes('rim')))
          ) {
            // Apply detailsMaterial (selected rim color/finish) uniformly to all 4 wheels' spokes and inner barrels
            child.material = detailsMaterial
          }
          return
        }

        // ── 2. OTHER CAR BRANDS ──
        const isLicensePlate =
          /license|registar|numberplate|number_plate|license_plate|targa|matricula/i.test(matName) ||
          /license|registar|numberplate|number_plate|license_plate|targa|matricula|chamferbox01|chamferbox04|plane\.005|plane\.006/i.test(nodeName)

        if (isLicensePlate) {
          platesToRemove.push(child)
          return
        }

        const isInterior =
          /interior|seat|cockpit|cabin|leather|salon|chair|wheel_int|interier/i.test(nodeName) ||
          /interior|seat|cockpit|cabin|leather|salon|interier/i.test(matName)
        if (isInterior) {
          child.material = interiorMaterial
          return
        }

        if (isLambo) {
          if (nodeName.includes('_t0b_')) {
            child.visible = false
            return
          }
          if (matName.includes('mt_body') || matName.includes('mt_mirrorcover') || nodeName.includes('orvm') || nodeName.includes('mirror')) {
            child.material = bodyMaterial
          }
          if (matName.includes('mt_alloywheels') || matName.includes('mt_brakecaliper')) child.material = detailsMaterial
          if (matName.includes('mt_windscreens') || matName.includes('mt_glass')) child.material = glassMaterial
        } else if (isPorsche) {
          const isGlass =
            nodeName.includes('boot004') ||
            nodeName.includes('boot.004') ||
            nodeName.includes('window') ||
            nodeName.includes('windshield') ||
            matName === 'window' ||
            matName === 'glass'

          if (isGlass) {
            child.material = glassMaterial
          } else if (
            (nodeName.includes('cylinder') || nodeName.includes('wheel') || nodeName.includes('rim')) &&
            matName === 'silver'
          ) {
            child.material = detailsMaterial
          } else if (
            matName === 'paint' ||
            /^(boot\.?00[1258]|plane\.?00[234])/i.test(nodeName)
          ) {
            child.material = bodyMaterial
          }
        } else if (isMcLaren) {
          if (matName === 'material' || matName === 'carpaint' || matName.includes('carpaint') || nodeName.includes('mirror') || matName.includes('mirror')) child.material = bodyMaterial
          if (matName === 'details' || matName === 'chrome' || nodeName.includes('rim')) child.material = detailsMaterial
          if (matName.includes('windows') || matName.includes('clear_glass')) child.material = glassMaterial
        } else if (isBMW) {
          if (matName.includes('car paint') || matName.includes('wire_228153184') || nodeName.includes('mirror')) child.material = bodyMaterial
          if (matName.includes('rims') || matName.includes('metalparts')) child.material = detailsMaterial
          if (matName.includes('glass') || matName.includes('stuklo')) child.material = glassMaterial
        }
      }
    })

    // Permanently detach and hide all license plates
    platesToRemove.forEach(mesh => {
      mesh.visible = false
      if (mesh.material) {
        mesh.material.visible = false
        mesh.material.opacity = 0
        mesh.material.transparent = true
      }
      if (mesh.parent) {
        mesh.parent.remove(mesh)
      }
    })

    // 2. Auto-orient: Ferrari has baked quaternion causing rear to face camera — fix with PI flip
    if (isFerrari) {
      clonedScene.rotation.y = Math.PI
    } else {
      const rawBox = new THREE.Box3().setFromObject(clonedScene)
      const rawSize = rawBox.getSize(new THREE.Vector3())
      const isFacingX = rawSize.x > rawSize.z * 1.2
      if (isFacingX) {
        clonedScene.rotation.y = Math.PI / 2
      }
    }

    // 3. Normalization: scale to standard supercar length (~4.4 units)
    const orientedBox = new THREE.Box3().setFromObject(clonedScene)
    const orientedSize = orientedBox.getSize(new THREE.Vector3())
    const length = Math.max(orientedSize.x, orientedSize.z)
    const scale = 4.4 / Math.max(length, 0.01)
    clonedScene.scale.set(scale, scale, scale)

    // 4. Center on X & Z, and place tires flush on the showroom floor (Y = 0)
    clonedScene.updateMatrixWorld(true)
    const finalBox = new THREE.Box3().setFromObject(clonedScene)
    const center = finalBox.getCenter(new THREE.Vector3())
    clonedScene.position.x = -center.x
    clonedScene.position.z = -center.z

    // Find the true contact point of the tires with the showroom floor
    let minTireY = Infinity
    clonedScene.traverse(child => {
      if (child.isMesh) {
        const name = (child.name || '').toLowerCase()
        const matName = (child.material?.name || '').toLowerCase()
        if (
          name.includes('tire') || name.includes('tyre') ||
          matName.includes('tire') || matName.includes('tyre')
        ) {
          const b = new THREE.Box3().setFromObject(child)
          if (b.min.y < minTireY) {
            minTireY = b.min.y
          }
        }
      }
    })

    if (minTireY !== Infinity && !isNaN(minTireY)) {
      clonedScene.position.y = -minTireY
    } else {
      clonedScene.position.y = -finalBox.min.y
    }
  }, [clonedScene, modelPath, bodyMaterial, detailsMaterial, glassMaterial, interiorMaterial])

  // ── 5. Real Physical Aftermarket Parts Swapping Engine ───────────────────────
  useEffect(() => {
    if (!clonedScene) return
    const isFerrariCar = (modelPath || '').includes('ferrari')
    if (!isFerrariCar) return

    let customGroup = clonedScene.getObjectByName('VirtualTune_Custom_Parts')
    if (customGroup) {
      clonedScene.remove(customGroup)
      customGroup.traverse(child => {
        if (child.isMesh && child.geometry) {
          child.geometry.dispose()
        }
      })
    }
    customGroup = new THREE.Group()
    customGroup.name = 'VirtualTune_Custom_Parts'
    clonedScene.add(customGroup)

    // ── A. WHEEL SWAP: OEM ↔ WORK VS-XX 19" AFTERMARKET WHEELS ──
    const isAftermarketWheel = Boolean(
      selectedWheel && (
        selectedWheel === 'work-vsxx-19' ||
        selectedWheel?.sku === 'WORK-VSXX-19-F458' ||
        (selectedWheel?.assetUrl || '').includes('work-vs-xx') ||
        (typeof selectedWheel === 'string' && (
          selectedWheel.toLowerCase().includes('work') ||
          selectedWheel.toLowerCase().includes('vsxx') ||
          selectedWheel.toLowerCase().includes('vs-xx')
        ))
      )
    )

    clonedScene.traverse(child => {
      const name = (child.name || '').toLowerCase()
      const isOemRimComponent =
        name.startsWith('rim_') ||
        (name.startsWith('wheel') && !['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'].includes(name)) ||
        name === 'centre' ||
        name === 'nuts'
      if (isOemRimComponent) {
        child.visible = !isAftermarketWheel
      }
    })

    const wheelGroupNames = ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr']
    wheelGroupNames.forEach(groupName => {
      const groupObj = clonedScene.getObjectByName(groupName)
      if (groupObj) {
        groupObj.traverse(child => {
          if (child === groupObj) return
          const name = (child.name || '').toLowerCase()
          const isTire = name.includes('tire') || name.includes('tyre')
          const isBrake = name.includes('brake') || name.includes('caliper') || name.includes('disc')
          if (!isTire && !isBrake) {
            child.visible = !isAftermarketWheel
          }
        })
      }
    })

    if (isAftermarketWheel && workVsxxGLB?.scene) {
      const finishPreset = WHEEL_FINISH_PRESETS[wheelFinish] || WHEEL_FINISH_PRESETS['GLOSS_BLACK']
      const wheelMounts = [
        { name: 'FL', pos: [-0.956, 0.358, -1.155], rotY: -Math.PI / 2 },
        { name: 'FR', pos: [0.943, 0.360, -1.154],  rotY: Math.PI / 2 },
        { name: 'RL', pos: [-0.947, 0.358, 1.495],  rotY: -Math.PI / 2 },
        { name: 'RR', pos: [0.950, 0.358, 1.496],   rotY: Math.PI / 2 },
      ]

      wheelMounts.forEach(mount => {
        const wheelClone = workVsxxGLB.scene.clone(true)
        wheelClone.name = `custom_work_vsxx_${mount.name}`
        wheelClone.position.set(...mount.pos)
        wheelClone.rotation.set(0, mount.rotY, 0)
        wheelClone.scale.set(1.15, 1.15, 1.15)
        wheelClone.traverse(c => {
          if (c.isMesh) {
            c.castShadow = true
            c.receiveShadow = true
            if (c.material && (c.material.name === 'paint' || c.material.name === 'material')) {
              c.material = c.material.clone()
              c.material.color.set(detailsColor || finishPreset.hex)
              c.material.metalness = finishPreset.metalness
              c.material.roughness = finishPreset.roughness
              c.material.needsUpdate = true
            }
          }
        })
        customGroup.add(wheelClone)
      })
    }

    // ── B. REAR SPOILER: OEM ↔ REAL BIG COUNTRY LABS STYLE GT WING ──
    const isBCLWing = Boolean(
      selectedSpoiler && (
        selectedSpoiler === 'bcl-gt-wing' ||
        selectedSpoiler === 'big-country-labs-style-wing' ||
        selectedSpoiler === 'carbon-gt-wing' ||
        selectedSpoiler?.sku === 'GEN-GTWING-F458' ||
        (selectedSpoiler?.assetUrl || '').includes('big-country-labs') ||
        (typeof selectedSpoiler === 'string' && (
          selectedSpoiler.toLowerCase().includes('wing') ||
          selectedSpoiler.toLowerCase().includes('spoiler') ||
          selectedSpoiler.toLowerCase().includes('bcl') ||
          selectedSpoiler.toLowerCase().includes('country')
        ))
      )
    )

    if (isBCLWing && bclWingGLB?.scene) {
      const wingMountGroup = new THREE.Group()
      wingMountGroup.name = 'custom_spoiler_bcl_wing'

      const wingClone = bclWingGLB.scene.clone(true)
      const UNWANTED_POST_NODES = [
        'Box003_6', 'Box007_7', 'Box001_9', 'bcl_type_wing004_4',
        'Object_12', 'Object_14', 'Object_18', 'Object_8'
      ]

      wingClone.traverse(child => {
        if (UNWANTED_POST_NODES.includes(child.name)) {
          child.visible = false
          return
        }

        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          if (child.material) {
            child.material = child.material.clone()
            child.material.color.set('#18181c')
            child.material.metalness = 0.82
            child.material.roughness = 0.22
            child.material.needsUpdate = true
          }
        }
      })

      wingClone.rotation.y = Math.PI
      const scale = 0.22
      wingClone.scale.set(scale, scale, scale)
      wingMountGroup.add(wingClone)
      wingMountGroup.position.set(0, 0.915, 1.25)
      customGroup.add(wingMountGroup)
    }

    // ── C. BODY & AERO: OEM ↔ CARBON AERO PACKAGE ──
    const isCarbonAero = Boolean(selectedBodykit)
    clonedScene.traverse(child => {
      if (!child.isMesh) return

      const nodeName = (child.name || '').toLowerCase()
      const matName = (child.material?.name || '').toLowerCase()

      const isInteriorNode =
        /interior|seat|cockpit|cabin|leather|salon|steering|carbon_fibre_trim|carbon fibre/i.test(nodeName) ||
        /interior|seat|cockpit|cabin|leather|salon|steering/i.test(matName)

      if (isInteriorNode) return

      const isAeroComponent =
        nodeName === 'plastic_gray' ||
        matName === 'plastic_gray' ||
        /splitter|diffuser|skirt|canard|front_lip|chin_spoiler|aero_fin/i.test(nodeName) ||
        /splitter|diffuser|skirt|canard|aero/i.test(matName)

      if (isAeroComponent) {
        if (!child.userData.origMaterial) {
          child.userData.origMaterial = child.material
        }
        if (isCarbonAero) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#0c0c10'),
            metalness: 0.88,
            roughness: 0.16,
            clearcoat: 1.0,
            clearcoatRoughness: 0.04,
            name: 'custom_carbon_aero_spec'
          })
        } else if (child.userData.origMaterial) {
          child.material = child.userData.origMaterial
        }
      }
    })

    // ── D. BRAKE SYSTEM: OEM ↔ REAL BREMBO GT-S 6-PISTON BIG BRAKE KIT ──
    const isBremboBrakes = Boolean(
      selectedParts && selectedParts.some(p =>
        p?.sku === 'BRM-1N1.9042A2' ||
        /brembo/i.test(p?.name || p?.partName || '') ||
        /brake/i.test(p?.category || '')
      )
    )

    // Hide/show stock brake meshes (rotors and calipers) depending on whether Brembo BBK is active
    clonedScene.traverse(child => {
      const name = (child.name || '').toLowerCase()
      if (name.includes('brake') || name.includes('caliper') || name.includes('disc')) {
        child.visible = !isBremboBrakes
      }
    })

    // Mount high-definition Brembo GT-S 6-Piston Caliper & 380mm Slotted Rotor at 4 wheel hubs
    // Proportioned to real-world dimensions (380mm front / 355mm rear) leaving authentic clearance inside the rim barrel
    if (isBremboBrakes && bremboGLB?.scene) {
      const brakeMounts = [
        { name: 'FL', pos: [-0.825, 0.358, -1.155], rotY: -Math.PI / 2, scale: 0.76 },
        { name: 'FR', pos: [ 0.825, 0.360, -1.154], rotY:  Math.PI / 2, scale: 0.76 },
        { name: 'RL', pos: [-0.820, 0.358,  1.495], rotY: -Math.PI / 2, scale: 0.72 },
        { name: 'RR', pos: [ 0.820, 0.358,  1.496], rotY:  Math.PI / 2, scale: 0.72 },
      ]

      brakeMounts.forEach(mount => {
        const brakeClone = bremboGLB.scene.clone(true)
        brakeClone.name = `custom_brembo_${mount.name}`
        brakeClone.position.set(...mount.pos)
        brakeClone.rotation.set(0, mount.rotY, 0)
        brakeClone.scale.set(mount.scale, mount.scale, mount.scale)
        brakeClone.traverse(c => {
          if (c.isMesh) {
            c.castShadow = true
            c.receiveShadow = true
          }
        })
        customGroup.add(brakeClone)
      })
    }

    // ── E. EXHAUST SYSTEM: OEM ↔ REAL AKRAPOVIČ EVOLUTION LINE TITANIUM EXHAUST ──
    const isAkrapovicExhaust = Boolean(
      selectedParts && selectedParts.some(p =>
        p?.sku === 'AKR-EVO-TITAN-992' ||
        /akrapov/i.test(p?.name || p?.partName || '') ||
        /exhaust/i.test(p?.category || '')
      )
    )

    // Hide the stock white exhaust pipes when Akrapovic is active so there is ZERO model nesting/stacking
    clonedScene.traverse(child => {
      if (!child.isMesh || !child.geometry || !child.geometry.attributes.position) return
      const pos = child.geometry.attributes.position
      if (!child.userData.origPositions) {
        child.userData.origPositions = new Float32Array(pos.array)
      }
      const orig = child.userData.origPositions

      let hasExhaust = false
      for (let i = 0; i < pos.count; i++) {
        const x = orig[i * 3]
        const y = orig[i * 3 + 1]
        const z = orig[i * 3 + 2]
        // Check if vertex belongs to the rear triple exhaust pipes inside the bumper oval
        if (Math.abs(x) < 0.22 && y > 0.35 && y < 0.52 && z > 2.05) {
          hasExhaust = true
          if (isAkrapovicExhaust) {
            // Collapse factory pipe vertex invisibly inside rear engine bay
            pos.setXYZ(i, 0, 0, 0)
          } else {
            // Restore factory pipe vertex
            pos.setXYZ(i, x, y, z)
          }
        }
      }
      if (hasExhaust) {
        pos.needsUpdate = true
        child.geometry.computeVertexNormals()
      }
    })

    if (isAkrapovicExhaust && exhaustGLB?.scene) {
      const exhaustClone = exhaustGLB.scene.clone(true)
      exhaustClone.name = 'custom_akrapovic_exhaust'
      // Perfectly aligned inside the Ferrari 458 bumper oval cutout
      exhaustClone.position.set(0, 0.428, 2.215)
      exhaustClone.rotation.set(0, 0, 0)
      exhaustClone.scale.set(1.0, 1.0, 1.0)
      exhaustClone.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true
          c.receiveShadow = true
        }
      })
      customGroup.add(exhaustClone)
    }



    return () => {
      if (customGroup && clonedScene) {
        clonedScene.remove(customGroup)
      }
    }
  }, [
    clonedScene,
    modelPath,
    selectedWheel,
    wheelFinish,
    selectedBodykit,
    selectedSpoiler,
    selectedParts,
    workVsxxGLB,
    bclWingGLB,
    bremboGLB,
    exhaustGLB,
    detailsMaterial,
    detailsColor
  ])

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
          <planeGeometry args={[0.655 * 4, 1.3 * 4]} />
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
