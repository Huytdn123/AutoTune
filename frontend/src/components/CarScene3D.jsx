import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

// ─── Supported 3D Real-Life Car Models ─────────────────────────────────────────
export const CAR_MODEL_FILES = {
  'ferrari-458':           '/models/ferrari.glb',
  'lamborghini-aventador': '/models/lamborghini.glb',
  'porsche-gt3':           '/models/porsche.glb',
  'porsche-carrera-991':   '/models/porsche.glb',
  'mclaren-720s':          '/models/mclaren.glb',
  'bmw-m4-csl':            '/models/bmw.glb',
  'bmw-vision':            '/models/bmw.glb',
}

// ─── Official Real-Life Aftermarket 3D Part Assets ───────────────────────────
export const PART_MODEL_FILES = {
  'wheel-work-vsxx-19': '/models/parts/ferrari-458/wheels/work-vs-xx.glb',
  'spoiler-bcl-wing':   '/models/parts/ferrari-458/spoilers/big-country-labs-style-wing.glb',
}

// ─── Dynamic Aftermarket Wheel Finishes ───────────────────────────────────────
export const WHEEL_FINISH_PRESETS = {
  'GLOSS_BLACK': { id: 'GLOSS_BLACK', name: 'Gloss Black', hex: '#111111', metalness: 0.85, roughness: 0.15 },
  'SATIN_BLACK': { id: 'SATIN_BLACK', name: 'Satin Black', hex: '#222222', metalness: 0.60, roughness: 0.45 },
  'SILVER':      { id: 'SILVER',      name: 'Silver',      hex: '#d8d8d8', metalness: 0.90, roughness: 0.25 },
  'GUNMETAL':    { id: 'GUNMETAL',    name: 'Gunmetal',    hex: '#3e4146', metalness: 0.85, roughness: 0.30 },
}

const DRACO_PATH = '/draco/gltf/'
const FERRARI_AO = '/models/ferrari_ao.png'

// Preload all real car models for seamless zero-latency switching
Object.values(CAR_MODEL_FILES).forEach(url => {
  useGLTF.preload(url, DRACO_PATH)
})

// Preload real physical customization part assets
Object.values(PART_MODEL_FILES).forEach(url => {
  useGLTF.preload(url)
})

// ─── Universal Vehicle 3D Model Component ─────────────────────────────────────
export function VehicleModel3D({
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
  autoRotate = false,
  autoRotateSpeed = 0.4
}) {
  const { scene } = useGLTF(modelPath || CAR_MODEL_FILES['ferrari-458'], DRACO_PATH)
  const workVsxxGLB = useGLTF(PART_MODEL_FILES['wheel-work-vsxx-19'])
  const bclWingGLB  = useGLTF(PART_MODEL_FILES['spoiler-bcl-wing'])
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
    // Dark tint options receive higher opacity for realistic privacy tint
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
            // Body paint: strictly painted exterior body panels only
            child.material = bodyMaterial
          } else if (nodeName === 'glass') {
            // Glass: windshield, side windows, rear engine bay glass
            child.material = glassMaterial
          } else if (nodeName === 'leather' || nodeName === 'steering_leather') {
            // Interior upholstery: bucket seats & steering wheel leather grip
            child.material = interiorMaterial
          } else if (['rim_fl', 'rim_fr', 'rim_rr', 'rim_rl', 'wheel', 'trim'].includes(nodeName)) {
            // OEM Wheel rims & 5-spoke star assemblies: 4 alloy wheels
            child.material = detailsMaterial
          }
          // ALL OTHER 53 MESHES PRESERVE AUTHENTIC OEM GLB MATERIALS:
          // - yellow_trim, centre (x4), steering_centre: Ferrari_Yellow (#F8CC00 Scuderia shields & center caps)
          // - carbon fibre, carbon_fibre_trim, steering_carbon: Carbon_Fiber (front winglets & diffuser)
          // - interior_dark, interior_light, steering_column: dark cockpit structure/plastics
          // - carpet: floor carpet
          // - lights: Projector_Glass
          // - lights_red, brakes, steering_red_lights: Taillight_Glass (red)
          // - leds: Turn_Signal_LED
          // - chrome: metal_chrome (Cavallino Rampante horse & exhaust)
          // - grills, wipers, tire (x4): Tires (rubber & aero mesh)
          // - brake (x4): metal_gray (brake calipers & discs)
          // - nuts (x4): Interior_dark (lug nuts)
          // - wheel (x4): metal_gray (inner wheel barrel)
          // - trim, steering_trim: Leather_red (accent stitching)
          return
        }

        // ── 2. OTHER CAR BRANDS ──
        // Hide and strip license plate meshes/materials across other cars
        const isLicensePlate =
          /license|registar|numberplate|number_plate|license_plate|targa|matricula/i.test(matName) ||
          /license|registar|numberplate|number_plate|license_plate|targa|matricula|chamferbox01|chamferbox04|plane\.005|plane\.006/i.test(nodeName)

        if (isLicensePlate) {
          platesToRemove.push(child)
          return
        }

        // Check for Interior & Cockpit Leather for other models
        const isInterior =
          /interior|seat|cockpit|cabin|leather|salon|chair|wheel_int|interier/i.test(nodeName) ||
          /interior|seat|cockpit|cabin|leather|salon|interier/i.test(matName)
        if (isInterior) {
          child.material = interiorMaterial
          return
        }

        if (isLambo) {
          // Hide secondary overlapping rims if present (keep primary T0A rims)
          if (nodeName.includes('_t0b_')) {
            child.visible = false
            return
          }
          // Side mirrors and body panels
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
    const finalBox = new THREE.Box3().setFromObject(clonedScene)
    const center = finalBox.getCenter(new THREE.Vector3())
    clonedScene.position.x = -center.x
    clonedScene.position.z = -center.z
    clonedScene.position.y = -finalBox.min.y
  }, [clonedScene, modelPath, bodyMaterial, detailsMaterial, glassMaterial, interiorMaterial])

  // ── 5. Real Physical Aftermarket Parts Swapping Engine ───────────────────────
  // Handles OEM ↔ Aftermarket wheels, bodykits, and mutually exclusive spoilers.
  // When OEM is selected, aftermarket meshes are cleanly removed and disposed.
  useEffect(() => {
    if (!clonedScene) return
    const isFerrariCar = (modelPath || '').includes('ferrari')
    if (!isFerrariCar) return

    // Find or create dedicated Custom Parts Group attached to car root
    let customGroup = clonedScene.getObjectByName('VirtualTune_Custom_Parts')
    if (customGroup) {
      clonedScene.remove(customGroup)
      // Traverse and dispose old temporary resources
      customGroup.traverse(child => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose()
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

    // Toggle OEM rim meshes, disc, and center caps (leaving rubber tire and brake caliper intact)
    // 1. Traverse all nodes in clonedScene matching OEM rim part names (case-insensitive)
    clonedScene.traverse(child => {
      const name = (child.name || '').toLowerCase()
      const isOemRimComponent =
        name.startsWith('rim_') ||
        name === 'wheel' ||
        name === 'centre' ||
        name === 'nuts'
      if (isOemRimComponent) {
        child.visible = !isAftermarketWheel
      }
    })

    // 2. Explicitly ensure all non-tire, non-brake children of the 4 wheel groups are hidden
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

    // Mount 4 calibrated WORK VS-XX 19" wheels if aftermarket is active
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
            // Apply selected rim color dynamically to rim spoke face
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

      // Filter out alternative showcase posts from the Sketchfab asset pack
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
          // Apply dark carbon / gloss black finish so the wing never appears white
          if (child.material) {
            child.material = child.material.clone()
            child.material.color.set('#18181c')
            child.material.metalness = 0.82
            child.material.roughness = 0.22
            child.material.needsUpdate = true
          }
        }
      })

      // Rotate 180 deg around Y so uprights slant rearward and blade extends over deck
      wingClone.rotation.y = Math.PI
      const scale = 0.22
      wingClone.scale.set(scale, scale, scale)

      wingMountGroup.add(wingClone)

      // Mount precisely on Ferrari 458 rear engine decklid:
      // Centered at X=0, feet resting firmly on decklid at Y=0.915, Z=1.25
      wingMountGroup.position.set(0, 0.915, 1.25)
      customGroup.add(wingMountGroup)
    }

    // ── C. BODY & AERO: OEM ↔ CARBON AERO PACKAGE (Front Splitter, Side Skirts, Rear Fins) ──
    const isCarbonAero = Boolean(selectedBodykit)
    clonedScene.traverse(child => {
      if (!child.isMesh) return

      const nodeName = (child.name || '').toLowerCase()
      const matName = (child.material?.name || '').toLowerCase()

      // EXCLUDE interior cabin nodes: strictly leave cockpit, dashboard, and steering leather untouched
      const isInteriorNode =
        /interior|seat|cockpit|cabin|leather|salon|steering|carbon_fibre_trim|carbon fibre/i.test(nodeName) ||
        /interior|seat|cockpit|cabin|leather|salon|steering/i.test(matName)

      if (isInteriorNode) return

      // In Ferrari 458: 'plastic_gray' is the authentic exterior lower aero suite:
      // Front chin splitter, front bumper aero whiskers, side sill skirts, and rear aerodynamic diffuser
      // In other cars: any exterior splitter, skirt, diffuser, or aero component
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
          // High-gloss pre-preg 2x2 twill carbon aero finish
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
    workVsxxGLB,
    bclWingGLB,
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

// Alias for backwards compatibility
export const FerrariModel = VehicleModel3D

// ─── Showroom Floor (Clean Matte Infinite Studio + Turntable Podium) ─────────
export function ShowroomFloor({ isDark = true }) {
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

// ─── Studio Lighting Rig (Dual-Mode: Dark Studio & Daylight Showroom) ─────────
export function StudioLights({ isDark = true }) {
  if (!isDark) {
    // ── Daylight Showroom Lighting ──
    return (
      <>
        {/* Soft daylight ambient fill */}
        <ambientLight intensity={1.1} color="#ffffff" />

        {/* Primary Key Light */}
        <spotLight
          position={[6, 9, 6]}
          angle={0.5}
          penumbra={0.8}
          intensity={2.4}
          color="#fffdf8"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        />

        {/* Flank Fill Light */}
        <spotLight
          position={[-6, 7, 4]}
          angle={0.55}
          penumbra={0.9}
          intensity={1.8}
          color="#f1f5f9"
        />

        {/* Roof & Rear Hip Contour Light */}
        <spotLight
          position={[-3, 6, -6]}
          angle={0.5}
          penumbra={0.7}
          intensity={1.4}
          color="#e2e8f0"
        />

        {/* Front-quarter clarity */}
        <spotLight
          position={[4, 4, -5]}
          angle={0.55}
          penumbra={0.8}
          intensity={1.1}
          color="#f8fafc"
        />

        {/* Overhead softbox diffuser */}
        <spotLight
          position={[0, 10, 0]}
          angle={0.8}
          penumbra={1.0}
          intensity={1.6}
          color="#ffffff"
        />
      </>
    )
  }

  // ── Dark Studio Lighting ──
  return (
    <>
      {/* Neutral Studio Ambient Fill */}
      <ambientLight intensity={0.55} color="#F4F6F9" />

      {/* Primary Key Light: Overhead angled 5500K daylight white with soft shadow */}
      <spotLight
        position={[6, 8, 6]}
        angle={0.45}
        penumbra={0.7}
        intensity={3.2}
        color="#FFFDF8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />

      {/* Balanced Soft Fill Light */}
      <spotLight
        position={[-6, 6, 4]}
        angle={0.5}
        penumbra={0.85}
        intensity={1.6}
        color="#F2F5FA"
      />

      {/* Contour Rim / Backlight */}
      <spotLight
        position={[-3, 5, -6]}
        angle={0.45}
        penumbra={0.6}
        intensity={2.2}
        color="#EDF1F7"
      />

      {/* Secondary Rim Light */}
      <spotLight
        position={[4, 3, -5]}
        angle={0.5}
        penumbra={0.7}
        intensity={1.2}
        color="#F5F7FA"
      />

      {/* Overhead Softbox */}
      <spotLight
        position={[0, 9, 0]}
        angle={0.75}
        penumbra={1.0}
        intensity={1.4}
        color="#FFFFFF"
      />
    </>
  )
}

// ─── Grid Floor (Disabled to preserve infinite seamless floor aesthetic) ──────
export function AnimatedGrid() {
  return null
}

// ─── Loading Placeholder ─────────────────────────────────────────────────────
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
        <meshStandardMaterial color="#0066ff" wireframe />
      </mesh>
    </group>
  )
}
