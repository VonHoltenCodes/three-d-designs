'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, useGLTF, PerspectiveCamera } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { useRef, useMemo, Suspense, useState, useEffect } from 'react'
import * as THREE from 'three'

// Simple airplane placeholder
function PlaceholderAircraft() {
  const meshRef = useRef<THREE.Group>(null)
  const { mouse } = useThree()
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        mouse.x * 0.2,
        0.05
      )
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        -mouse.y * 0.1,
        0.05
      )
    }
  })
  
  return (
    <group ref={meshRef}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 8, 32]} />
        <meshStandardMaterial color="#f8f8f8" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.2, 10, 2]} />
        <meshStandardMaterial color="#f8f8f8" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1, -3.5]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial color="#f8f8f8" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

// Boeing 737 component
function Boeing737() {
  const meshRef = useRef<THREE.Group>(null)
  const { mouse } = useThree()
  const { scene } = useGLTF('/models/boeing-737-800.glb')
  
  const clonedScene = useMemo(() => {
    const cloned = scene.clone()
    // Ensure materials are properly set up
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
        if (child.material) {
          child.material.envMapIntensity = 1
          child.material.needsUpdate = true
        }
      }
    })
    return cloned
  }, [scene])
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        mouse.x * 0.15,
        0.05
      )
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        -mouse.y * 0.1,
        0.05
      )
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })
  
  return (
    <group ref={meshRef} scale={0.01} rotation={[0, Math.PI, 0]}>
      <primitive object={clonedScene} />
    </group>
  )
}

// Improved cloud layer
function SimpleCloudLayer({ y = 0, speed = 0.01, opacity = 0.8 }) {
  const groupRef = useRef<THREE.Group>(null)
  
  const clouds = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      x: (Math.random() - 0.5) * 120,
      y: y + (Math.random() - 0.5) * 2,
      z: (Math.random() - 0.5) * 120,
      scale: Math.random() * 8 + 4,
      scaleY: 0.4 + Math.random() * 0.3,
      rotation: Math.random() * Math.PI,
      opacity: opacity * (0.7 + Math.random() * 0.3),
      id: i
    }))
  }, [y, opacity])
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.z += speed
      if (groupRef.current.position.z > 60) {
        groupRef.current.position.z = -60
      }
    }
  })
  
  return (
    <group ref={groupRef}>
      {clouds.map((cloud) => (
        <group key={cloud.id} position={[cloud.x, cloud.y, cloud.z]} rotation={[0, cloud.rotation, 0]}>
          {/* Main cloud body */}
          <mesh scale={[1, cloud.scaleY, 1]}>
            <sphereGeometry args={[cloud.scale, 12, 8]} />
            <meshStandardMaterial 
              color="#ffffff"
              transparent
              opacity={cloud.opacity}
              emissive="#FFE5B4"
              emissiveIntensity={0.05}
              roughness={1}
              metalness={0}
            />
          </mesh>
          {/* Additional cloud puffs for variation */}
          <mesh position={[cloud.scale * 0.5, 0, 0]} scale={[0.7, cloud.scaleY * 0.8, 0.7]}>
            <sphereGeometry args={[cloud.scale * 0.7, 8, 6]} />
            <meshStandardMaterial 
              color="#ffffff"
              transparent
              opacity={cloud.opacity * 0.8}
              emissive="#FFE5B4"
              emissiveIntensity={0.03}
              roughness={1}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// Main scene
function AviationScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 30]} fov={50} />
      
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        color="#FFF5E6"
        castShadow
      />
      
      <color attach="background" args={['#87CEEB']} />
      
      {/* Add HDRI environment */}
      <Environment 
        files="/hdri/kloppenheim_06_8k.exr"
        background={false}
        blur={0.02}
      />
      
      <Suspense fallback={<PlaceholderAircraft />}>
        <Boeing737 />
      </Suspense>
      
      <SimpleCloudLayer y={-5} speed={0.02} opacity={0.6} />
      <SimpleCloudLayer y={-10} speed={0.015} opacity={0.4} />
      <SimpleCloudLayer y={-15} speed={0.01} opacity={0.3} />
      
      <fog attach="fog" args={['#ffffff', 50, 150]} />
      
      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom 
          intensity={0.5}
          luminanceThreshold={0.8}
          luminanceSmoothing={0.9}
        />
        <Vignette 
          offset={0.1}
          darkness={0.4}
        />
        <ChromaticAberration 
          offset={[0.0005, 0.0005]}
          radialModulation={false}
        />
      </EffectComposer>
    </>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return <div className="w-full h-screen bg-sky-400" />
  }
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Canvas 
        className="absolute inset-0"
        shadows
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <AviationScene />
        </Suspense>
      </Canvas>
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="flex flex-col justify-center items-center h-full text-white">
          <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-4 drop-shadow-2xl">
            Fly Beyond Limits
          </h1>
          <p className="text-xl md:text-2xl font-light opacity-90 mb-12 drop-shadow-lg">
            Experience luxury aviation redefined
          </p>
          <button className="pointer-events-auto px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 
                         rounded-full text-lg font-light hover:bg-white/20 transition-all duration-300
                         shadow-2xl hover:shadow-3xl transform hover:scale-105">
            Book Your Journey
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-8 text-white/60 text-sm">
        <p>Move your mouse to control the aircraft</p>
      </div>
    </div>
  )
}

// Preload model
useGLTF.preload('/models/boeing-737-800.glb')