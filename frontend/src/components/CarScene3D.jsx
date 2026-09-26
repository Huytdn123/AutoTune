import { useRef, useEffect, useMemo, Suspense } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, MeshReflectorMaterial, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

// ─── Ferrari 458 Italia – Official Three.js Model ──────────────────────────
// Model by vicent091036 (Sketchfab), bundled locally in /models/ with local Draco decoder
const FERRARI_GLB = '/models/ferrari.glb'
const FERRARI_AO  = '/models/ferrari_ao.png'
const DRACO_PATH  = '/draco/gltf/'

// Preload the model locally
useGLTF.preload(FERRARI_GLB, DRACO_PATH)

// ─── Ferrari Model Component ──────────────────────────────────────────────
export function FerrariModel({ bodyColor, detailsColor, glassColor, isAnimating }) {
  const { scene } = useGLTF(FERRARI_GLB, DRACO_PATH)
  const wheelsRef = useRef([])
  const carRef = useRef()

  // Materials
  const bodyMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(bodyColor),
    metalness: 1.0,
    roughness: 0.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    envMapIntensity: 1.5,
  }), [])

  const detailsMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(detailsColor),
    metalness: 1.0,
    roughness: 0.5,
  }), [])

  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(glassColor),
    metalness: 0.25,
    roughness: 0,
    transmission: 1.0,
    transparent: true,
    opacity: 0.85,
  }), [])

  // Update colors reactively
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

  // Apply materials to Ferrari mesh parts + collect wheel refs
  useEffect(() => {
    if (!scene) return
    const car = scene.children[0]
    if (!car) return

    // Body paint
    const body = car.getObjectByName('body')
    if (body) body.material = bodyMaterial

    // Rims
    ;['rim_fl', 'rim_fr', 'rim_rr', 'rim_rl', 'trim'].forEach(name => {
      const obj = car.getObjectByName(name)
      if (obj) obj.material = detailsMaterial
    })

    // Glass
    const glass = car.getObjectByName('glass')
    if (glass) glass.material = glassMaterial

    // Wheels for animation
    wheelsRef.current = ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr']
      .map(name => car.getObjectByName(name))
      .filter(Boolean)

    // Enable shadows on all meshes
    scene.traverse(obj => {
      if (obj.isMesh) {
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })
  }, [scene, bodyMaterial, detailsMaterial, glassMaterial])

  // Wheel spin animation
  useFrame((state) => {
    if (!isAnimating) return
    const time = -state.clock.getElapsedTime()
    wheelsRef.current.forEach(wheel => {
      if (wheel) wheel.rotation.x = time * Math.PI * 2
    })
  })

  // AO shadow plane
  const aoTexture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    return loader.load(FERRARI_AO)
  }, [])

  return (
    <group ref={carRef}>
      <primitive object={scene} />
      {/* Baked AO shadow plane underneath the car */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} renderOrder={2}>
        <planeGeometry args={[0.655 * 4, 1.3 * 4]} />
        <meshBasicMaterial
          map={aoTexture}
          blending={THREE.MultiplyBlending}
          toneMapped={false}
          transparent={true}
        />
      </mesh>
    </group>
  )
}

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
      {/* Contact shadow */}
      <ContactShadows
        position={[0, -0.005, 0]}
        opacity={0.6}
        scale={12}
        blur={2.5}
        far={10}
      />
    </>
  )
}

// ─── Studio Lighting Rig ─────────────────────────────────────────────────────
export function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.2} color="#ffffff" />
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

// ─── Grid Floor (animated) ───────────────────────────────────────────────────
export function AnimatedGrid({ isAnimating }) {
  const gridRef = useRef()
  useFrame((state) => {
    if (gridRef.current && isAnimating) {
      gridRef.current.position.z = (-state.clock.getElapsedTime()) % 1
    }
  })
  return (
    <gridHelper
      ref={gridRef}
      args={[20, 40, '#ffffff', '#ffffff']}
      position={[0, -0.005, 0]}
      material-opacity={0.08}
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
      <mesh ref={meshRef} position={[0, 0.4, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#3060ff" wireframe />
      </mesh>
    </group>
  )
}
