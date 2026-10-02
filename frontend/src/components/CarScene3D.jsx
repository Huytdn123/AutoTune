import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, MeshReflectorMaterial, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

// ─── Supported 3D Real-Life Car Models ─────────────────────────────────────────
export const CAR_MODEL_FILES = {
  'ferrari-458':           '/models/ferrari.glb',
  'lamborghini-aventador': '/models/lamborghini.glb',
  'porsche-gt3':           '/models/porsche.glb',
  'mclaren-720s':          '/models/mclaren.glb',
  'bmw-m4-csl':            '/models/bmw.glb',
  'nissan-gtr':            '/models/nissan_gtr.glb',
}

const DRACO_PATH = '/draco/gltf/'
const FERRARI_AO = '/models/ferrari_ao.png'

// Preload all real car models for seamless zero-latency switching
Object.values(CAR_MODEL_FILES).forEach(url => {
  useGLTF.preload(url, DRACO_PATH)
})

// ─── Universal Vehicle 3D Model Component ─────────────────────────────────────
export function VehicleModel3D({
  modelPath = '/models/ferrari.glb',
  modelId = 'ferrari-458',
  bodyColor = '#CC0000',
  detailsColor = '#CCCCCC',
  glassColor = '#C8D8F0',
  isAnimating = false,
  autoRotate = false,
  autoRotateSpeed = 0.4
}) {
  const { scene } = useGLTF(modelPath || CAR_MODEL_FILES['ferrari-458'], DRACO_PATH)
  const wheelsRef = useRef([])
  const groupRef = useRef()

  // Clone scene deep so each model instance is isolated from the global cache
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  // Studio-grade PBR Car Paint Material
  const bodyMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    name: 'custom_body_paint',
    color: new THREE.Color(bodyColor),
    metalness: 0.9,
    roughness: 0.35,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    envMapIntensity: 1.6,
  }), [])

  // Wheel Rims & Metal Trim Material
  const detailsMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    name: 'custom_rim_details',
    color: new THREE.Color(detailsColor),
    metalness: 0.9,
    roughness: 0.35,
  }), [])

  // Automotive Glass Material with Realistic Optical Transmission
  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    name: 'custom_automotive_glass',
    color: new THREE.Color(glassColor || '#ffffff'),
    metalness: 0.1,
    roughness: 0.0,
    transmission: 0.96,
    ior: 1.5,
    thickness: 0.3,
  }), [])

  // Reactively update material colors
  useEffect(() => {
    bodyMaterial.color.set(bodyColor)
    bodyMaterial.needsUpdate = true
  }, [bodyColor, bodyMaterial])

  useEffect(() => {
    detailsMaterial.color.set(detailsColor)
    detailsMaterial.needsUpdate = true
  }, [detailsColor, detailsMaterial])

  useEffect(() => {
    glassMaterial.color.set(glassColor)
    glassMaterial.needsUpdate = true
  }, [glassColor, glassMaterial])

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
    const isNissan  = modelPath.includes('nissan')

    const wheels = []

    const platesToRemove = []

    // 1. Remove all license plates ("xóa hết biển số xe đi" - front & rear) + Apply custom materials
    clonedScene.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true

        const mat = child.material
        const matName = mat ? (mat.name || '').toLowerCase() : ''
        const nodeName = (child.name || '').toLowerCase()

        // Hide and strip license plate meshes/materials across all cars
        const isLicensePlate = 
          /license|registar|numberplate|number_plate|license_plate|targa|matricula/i.test(matName) ||
          /license|registar|numberplate|number_plate|license_plate|targa|matricula|chamferbox01|chamferbox04|plane\.005|plane\.006/i.test(nodeName)

        if (isLicensePlate) {
          platesToRemove.push(child)
          return
        }

        // Apply custom paint / materials per car brand
        if (isFerrari) {
          if (nodeName === 'body' || nodeName.includes('mirror')) child.material = bodyMaterial
          if (['rim_fl', 'rim_fr', 'rim_rr', 'rim_rl', 'trim'].includes(nodeName)) child.material = detailsMaterial
          if (nodeName === 'glass') child.material = glassMaterial
        } else if (isLambo) {
          // Hide secondary overlapping rims if present (keep primary T0A rims)
          if (nodeName.includes('_t0b_')) {
            child.visible = false
            return
          }
          // Side mirrors (Obj_ORVM / Mt_MirrorCover) and body panels inherit bodyMaterial
          if (matName.includes('mt_body') || matName.includes('mt_mirrorcover') || nodeName.includes('orvm') || nodeName.includes('mirror')) {
            child.material = bodyMaterial
          }
          if (matName.includes('mt_alloywheels') || matName.includes('mt_brakecaliper')) child.material = detailsMaterial
          if (matName.includes('mt_windscreens') || matName.includes('mt_glass')) child.material = glassMaterial
        } else if (isPorsche) {
          // 1. ALL Windows & Glass FIRST (Side windows boot004_0, rear window, windshield, headlight lenses)
          const isGlass = 
            nodeName.includes('boot004') ||
            nodeName.includes('boot.004') ||
            nodeName.includes('window') ||
            nodeName.includes('windshield') ||
            matName === 'window' ||
            matName === 'glass'

          if (isGlass) {
            child.material = glassMaterial
          }
          // 2. Wheel Rims (Cylinder meshes with silver material)
          else if (
            (nodeName.includes('cylinder') || nodeName.includes('wheel') || nodeName.includes('rim')) &&
            matName === 'silver'
          ) {
            child.material = detailsMaterial
          }
          // 3. Body Paint Panels & Side Mirrors ONLY
          // Meshes: boot001_0 (rear bumper), boot002_0 (roof/rear body), boot005_0 (doors/sides), boot008_0 (hood/front), plane002/003/004 (mirrors)
          else if (
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
        } else if (isNissan) {
          if (matName.includes('bodycolor') || nodeName.includes('body') || nodeName.includes('mirror')) child.material = bodyMaterial
          if (matName.includes('brakerotor') || nodeName.includes('wheel') || nodeName.includes('rim')) child.material = detailsMaterial
          if (nodeName.includes('glass') || nodeName.includes('window')) child.material = glassMaterial
        }
      }
    })

    // Permanently detach and hide all license plates (both front and rear)
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

    // 2. Auto-orient: if length was modeled along X axis, rotate 90 deg around Y so front faces Z.
    //    Ferrari has a baked quaternion [-0.5,-0.5,-0.5,0.5] in its root node that causes it to
    //    end up oriented along Z after Three.js parsing — rear facing +Z. Fix with explicit PI flip.
    if (isFerrari) {
      // Ferrari: parsed along Z but rear faces camera → rotate 180° to bring front forward
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
  }, [clonedScene, modelPath, bodyMaterial, detailsMaterial, glassMaterial])

  // Turntable Auto-Rotate (Stationary car on rotating platform)
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

// ─── Showroom Floor ──────────────────────────────────────────────────────────
export function ShowroomFloor() {
  return (
    <>
      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[12, 64]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#080810"
          metalness={0.6}
        />
      </mesh>
      {/* Dynamic contact shadow for any car shape */}
      <ContactShadows
        position={[0, -0.005, 0]}
        opacity={0.65}
        scale={12}
        blur={2.2}
        far={8}
      />
    </>
  )
}

// ─── Studio Lighting Rig ─────────────────────────────────────────────────────
export function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.3} color="#ffffff" />
      <spotLight
        position={[5, 8, -6]}
        angle={0.35}
        penumbra={0.6}
        intensity={4}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      <spotLight
        position={[-5, 6, 4]}
        angle={0.4}
        penumbra={0.7}
        intensity={2.5}
        color="#4060ff"
      />
      <spotLight
        position={[0, 10, 0]}
        angle={0.6}
        penumbra={1}
        intensity={1.5}
        color="#ffffff"
      />
      <pointLight position={[0, 1.5, -4]} intensity={0.6} color="#2040ff" />
      <pointLight position={[0, 0.5, 4]} intensity={0.4} color="#ff3010" />
    </>
  )
}

// ─── Grid Floor (Showroom floor grid) ─────────────────────────────────────────
export function AnimatedGrid() {
  return (
    <gridHelper
      args={[20, 40, '#ffffff', '#ffffff']}
      position={[0, -0.005, 0]}
      material-opacity={0.06}
      material-transparent={true}
      material-depthWrite={false}
    />
  )
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
