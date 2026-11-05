import * as THREE from 'three'

/**
 * Classify meshes and apply brand-specific materials for Ferrari, VinFast, Lamborghini, Porsche, etc.
 */
export function classifyAndApplyMaterials(clonedScene, modelPath, materials, glassColor) {
  if (!clonedScene) return

  const { bodyMaterial, detailsMaterial, glassMaterial, interiorMaterial } = materials

  const isFerrari = modelPath.includes('ferrari')
  const isLambo   = modelPath.includes('lamborghini')
  const isPorsche = modelPath.includes('porsche')
  const isMcLaren = modelPath.includes('mclaren')
  const isBMW     = modelPath.includes('bmw')
  const isVinFast = modelPath.includes('vinfast') || modelPath.includes('vf3')

  const platesToRemove = []

  clonedScene.traverse(child => {
    if (!child.isMesh) return

    child.castShadow = true
    child.receiveShadow = true

    const mat = child.material
    const matName = mat ? (mat.name || '').toLowerCase() : ''
    const nodeName = (child.name || '').toLowerCase()

    // ── 1. FERRARI 458 SPIDER: EXPLICIT ZERO-GUESSWORK CLASSIFICATION ──
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
        child.material = detailsMaterial
      }
      return
    }

    // ── 2. VINFAST VF3 PLUS 2026: PRECISE MATERIAL CLASSIFICATION ──
    if (isVinFast) {
      if (nodeName === 'object_5' || matName.includes('paint') || matName.includes('car_paint')) {
        child.material = bodyMaterial
      } else if (nodeName === 'object_6' || matName === 'material.012') {
        if (glassColor && glassColor !== '#141c24') {
          child.material = new THREE.MeshPhysicalMaterial({
            name: 'vf3_tinted_glass',
            color: new THREE.Color(glassColor),
            metalness: 0.15,
            roughness: 0.05,
            clearcoat: 1.0,
            clearcoatRoughness: 0.04,
            envMapIntensity: 2.0,
          })
        }
      }
      return
    }

    // ── 3. OTHER CAR BRANDS ──
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
  })

  // Detach license plates
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
}

/**
 * Orient vehicle facing camera correctly, normalize dimensions, center on X/Z, and place tires on floor Y=0.
 * Guarantees 100% deterministic, immutable size across aftermarket part modifications.
 */
export function orientAndNormalizeVehicle(clonedScene, modelPath) {
  if (!clonedScene) return

  // Prevent re-normalizing an already normalized clonedScene instance
  // This guarantees vehicle size and coordinates NEVER jitter or resize when swapping parts!
  if (clonedScene.userData && clonedScene.userData.isNormalized) {
    return
  }

  // Ensure aftermarket parts group is never included in the base car's bounding box calculation
  const customGroup = clonedScene.getObjectByName('VirtualTune_Custom_Parts')
  if (customGroup) {
    clonedScene.remove(customGroup)
  }

  // Reset transforms before measuring bounds
  clonedScene.position.set(0, 0, 0)
  clonedScene.scale.set(1, 1, 1)
  clonedScene.rotation.set(0, 0, 0)

  const isFerrari = modelPath.includes('ferrari')
  const isVinFast = modelPath.includes('vinfast') || modelPath.includes('vf3')

  // Auto-orient
  if (isFerrari) {
    clonedScene.rotation.y = Math.PI
  } else if (isVinFast) {
    clonedScene.rotation.y = 0
  } else {
    const rawBox = new THREE.Box3().setFromObject(clonedScene)
    const rawSize = rawBox.getSize(new THREE.Vector3())
    const isFacingX = rawSize.x > rawSize.z * 1.2
    if (isFacingX) {
      clonedScene.rotation.y = Math.PI / 2
    }
  }

  // Unified studio target scale: supercars at 4.85 units (heroic, prominent studio presence), compact EV at 4.2 units
  const orientedBox = new THREE.Box3().setFromObject(clonedScene)
  const orientedSize = orientedBox.getSize(new THREE.Vector3())
  const length = Math.max(orientedSize.x, orientedSize.z)
  const targetLength = isVinFast ? 4.2 : 4.85
  const scale = targetLength / Math.max(length, 0.01)
  clonedScene.scale.set(scale, scale, scale)

  // Center on X & Z
  clonedScene.updateMatrixWorld(true)
  const finalBox = new THREE.Box3().setFromObject(clonedScene)
  const center = finalBox.getCenter(new THREE.Vector3())
  clonedScene.position.x = -center.x
  clonedScene.position.z = -center.z

  // Find true contact point of tires with the floor (Y = 0)
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

  // Mark this instance as normalized so future part swaps will never re-calculate or glitch
  clonedScene.userData.isNormalized = true

  // Re-attach custom parts group if it was detached
  if (customGroup) {
    clonedScene.add(customGroup)
  }
}

