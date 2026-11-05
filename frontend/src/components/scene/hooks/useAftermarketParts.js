import { useEffect } from 'react'
import * as THREE from 'three'
import { WHEEL_FINISH_PRESETS } from '../sceneConstants'

/**
 * useAftermarketParts - Manages real physical 3D aftermarket parts mounting,
 * scaling, hub alignment, and dynamic recoloring on the vehicle model.
 */
export function useAftermarketParts({
  clonedScene,
  modelPath,
  selectedWheel,
  wheelFinish = 'GLOSS_BLACK',
  selectedBodykit,
  selectedSpoiler,
  selectedParts = [],
  detailsColor,
  partModels: {
    workVsxxGLB,
    bbsLmGLB,
    bclWingGLB,
    gt3WingFBX,
    bremboGLB,
    exhaustGLB,
  } = {},
}) {
  useEffect(() => {
    if (!clonedScene) return
    const isFerrariCar = (modelPath || '').includes('ferrari')
    if (!isFerrariCar) return

    // Clean up previous custom parts group to prevent GPU leaks and mesh duplication
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

    // ── A. WHEEL SWAP: OEM ↔ AFTERMARKET WHEELS (WORK VS-XX, BBS LM) ──
    const wheelSku = typeof selectedWheel === 'string'
      ? selectedWheel
      : (selectedWheel?.sku || selectedWheel?.name || '')

    const isWorkVsxx = Boolean(
      wheelSku === 'WORK-VSXX-19-F458' ||
      wheelSku === 'work-vsxx-19' ||
      wheelSku.toLowerCase().includes('work') ||
      wheelSku.toLowerCase().includes('vsxx')
    )

    const isBbsLm = Boolean(
      wheelSku === 'BBS-FIR-992-TITAN' ||
      wheelSku === 'wheel-bbs-lm-20' ||
      wheelSku.toLowerCase().includes('bbs') ||
      wheelSku.toLowerCase().includes('fir') ||
      wheelSku.toLowerCase().includes('lm')
    )

    const isAftermarketWheel = isWorkVsxx || isBbsLm

    // Hide/show OEM wheels
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

    if (isAftermarketWheel) {
      const finishPreset = WHEEL_FINISH_PRESETS[wheelFinish] || WHEEL_FINISH_PRESETS['GLOSS_BLACK']
      const wheelMounts = [
        { name: 'FL', pos: [-0.956, 0.358, -1.155], rotY: -Math.PI / 2 },
        { name: 'FR', pos: [0.943, 0.360, -1.154],  rotY: Math.PI / 2 },
        { name: 'RL', pos: [-0.947, 0.358, 1.495],  rotY: -Math.PI / 2 },
        { name: 'RR', pos: [0.950, 0.358, 1.496],   rotY: Math.PI / 2 },
      ]

      if (isWorkVsxx && workVsxxGLB?.scene) {
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
      } else if (isBbsLm && bbsLmGLB?.scene) {
        // BBS LM Wheels 20"
        wheelMounts.forEach(mount => {
          const mountContainer = new THREE.Group()
          mountContainer.name = `custom_bbs_lm_${mount.name}`
          mountContainer.position.set(...mount.pos)
          mountContainer.rotation.set(0, mount.rotY, 0)

          const wheelClone = bbsLmGLB.scene.clone(true)
          const bbsScale = 0.1387
          wheelClone.scale.set(bbsScale, bbsScale, bbsScale)
          wheelClone.rotation.set(Math.PI / 2, 0, 0)
          wheelClone.position.set(0, 0, -0.0216)

          wheelClone.traverse(c => {
            if (c.isMesh) {
              const n = (c.name || '').toLowerCase()
              if (n.includes('cylinder') || (c.material && c.material.name === 'Material.003')) {
                c.visible = false
                return
              }

              c.castShadow = true
              c.receiveShadow = true

              if (c.material && c.material.name === 'Material.002') {
                c.material = c.material.clone()
                c.material.map = null
                c.material.color.set(detailsColor || finishPreset.hex)
                c.material.metalness = finishPreset.metalness ?? 0.85
                c.material.roughness = finishPreset.roughness ?? 0.22
                c.material.needsUpdate = true
              }
            }
          })

          mountContainer.add(wheelClone)
          customGroup.add(mountContainer)
        })
      }
    }

    // ── B. REAR SPOILER: OEM ↔ OPTION 1: CARBON AERO GT WING ↔ OPTION 2: GT3 CARBON AERO WING ──
    const isBCLWing = Boolean(
      selectedSpoiler && (
        selectedSpoiler === 'bcl-gt-wing' ||
        selectedSpoiler === 'big-country-labs-style-wing' ||
        selectedSpoiler === 'carbon-gt-wing' ||
        selectedSpoiler === 'GEN-GTWING-F458' ||
        selectedSpoiler?.sku === 'GEN-GTWING-F458' ||
        (selectedSpoiler?.assetUrl || '').includes('big-country-labs') ||
        (typeof selectedSpoiler === 'string' && !selectedSpoiler.toLowerCase().includes('gt3') && !selectedSpoiler.toLowerCase().includes('vorsteiner') && (
          selectedSpoiler.toLowerCase().includes('bcl') ||
          selectedSpoiler.toLowerCase().includes('country') ||
          selectedSpoiler.toLowerCase().includes('gen-gtwing')
        ))
      )
    )

    const isGT3Wing = Boolean(
      selectedSpoiler && (
        selectedSpoiler === 'VOR-CF-AERO-992' ||
        selectedSpoiler === 'gt3-carbon-aero-wing' ||
        selectedSpoiler === 'free_gt3_spoiler_v01' ||
        selectedSpoiler?.sku === 'VOR-CF-AERO-992' ||
        (selectedSpoiler?.assetUrl || '').includes('free_gt3_spoiler') ||
        (typeof selectedSpoiler === 'string' && (
          selectedSpoiler.toLowerCase().includes('gt3') ||
          selectedSpoiler.toLowerCase().includes('vorsteiner') ||
          selectedSpoiler.toLowerCase().includes('vor-cf-aero')
        )) ||
        (typeof selectedSpoiler?.name === 'string' && (
          selectedSpoiler.name.toLowerCase().includes('gt3') ||
          selectedSpoiler.name.toLowerCase().includes('vorsteiner')
        ))
      )
    )

    // Option 1: Carbon Aero GT Wing (Preserved 100% Intact)
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

    // Option 2: GT3 Carbon Aero Wing (Real 3D FBX Swan-Neck Downforce Wing)
    if (isGT3Wing && gt3WingFBX) {
      const gt3MountGroup = new THREE.Group()
      gt3MountGroup.name = 'custom_spoiler_gt3_wing'

      const wingClone = gt3WingFBX.clone(true)

      const carbonBladeMaterial = new THREE.MeshPhysicalMaterial({
        name: 'gt3_carbon_blade',
        color: new THREE.Color('#18181c'),
        metalness: 0.85,
        roughness: 0.22,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        envMapIntensity: 1.5,
      })

      const bracketMaterial = new THREE.MeshStandardMaterial({
        name: 'gt3_swan_neck_brackets',
        color: new THREE.Color('#151517'),
        metalness: 0.88,
        roughness: 0.28,
        envMapIntensity: 1.2,
      })

      wingClone.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          const meshName = (child.name || '').toLowerCase()
          if (meshName.includes('plane007') || meshName.includes('plane004') || meshName.includes('plane008')) {
            child.material = bracketMaterial
          } else {
            child.material = carbonBladeMaterial
          }
        }
      })

      const scale = 0.0090
      wingClone.scale.set(scale, scale, scale)
      wingClone.rotation.y = Math.PI
      wingClone.position.set(0, -88.192 * scale, 12.69 * scale)

      gt3MountGroup.add(wingClone)
      gt3MountGroup.position.set(0, 0.885, 1.82)
      customGroup.add(gt3MountGroup)
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

    clonedScene.traverse(child => {
      const name = (child.name || '').toLowerCase()
      if (name.includes('brake') || name.includes('caliper') || name.includes('disc')) {
        child.visible = !isBremboBrakes
      }
    })

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
        if (Math.abs(x) < 0.22 && y > 0.35 && y < 0.52 && z > 2.05) {
          hasExhaust = true
          if (isAkrapovicExhaust) {
            pos.setXYZ(i, 0, 0, 0)
          } else {
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
    bbsLmGLB,
    bclWingGLB,
    gt3WingFBX,
    bremboGLB,
    exhaustGLB,
    detailsColor,
  ])
}

