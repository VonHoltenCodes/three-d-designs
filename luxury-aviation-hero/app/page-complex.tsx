'use client'

import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, PerspectiveCamera, Float } from '@react-three/drei'
import { useRef, useMemo, Suspense, useState, useEffect } from 'react'
import * as THREE from 'three'
import { createNoise3D } from 'simplex-noise'

// Placeholder aircraft component until model is loaded
function PlaceholderAircraft() {
  const meshRef = useRef<THREE.Group>(null)
  const { mouse } = useThree()
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth mouse following
      const targetRotationZ = mouse.x * 0.2
      const targetRotationX = -mouse.y * 0.1
      
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        targetRotationZ,
        0.05
      )
      
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        targetRotationX,
        0.05
      )
    }
  })
  
  return (
    <group ref={meshRef}>
      {/* Fuselage */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 8, 32]} />
        <meshStandardMaterial 
          color="#f8f8f8" 
          metalness={0.8} 
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Wings */}
      <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.2, 10, 2]} />
        <meshStandardMaterial 
          color="#f8f8f8" 
          metalness={0.8} 
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Tail */}
      <mesh position={[0, 1, -3.5]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial 
          color="#f8f8f8" 
          metalness={0.8} 
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>
    </group>
  )
}

// Boeing 737-800 component
function Boeing737() {
  const meshRef = useRef<THREE.Group>(null)
  const { mouse } = useThree()
  
  // Load the actual model
  const { scene } = useGLTF('/models/boeing-737-800.glb')
  
  // Clone the scene to avoid mutations
  const clonedScene = useMemo(() => scene.clone(), [scene])
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth mouse following with banking
      const targetRotationZ = mouse.x * 0.15  // Banking
      const targetRotationX = -mouse.y * 0.1  // Pitch
      
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        targetRotationZ,
        0.05
      )
      
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        targetRotationX,
        0.05
      )
      
      // Subtle floating motion
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })
  
  return (
    <group ref={meshRef} scale={0.01} rotation={[0, Math.PI, 0]}>
      <primitive object={clonedScene} />
    </group>
  )
}

// Procedural cloud layer
function CloudLayer({ y = 0, speed = 0.01, opacity = 0.8 }) {
  const groupRef = useRef<THREE.Group>(null)
  const noise = useMemo(() => createNoise3D(), [])
  
  const clouds = useMemo(() => {
    const cloudArray = []
    const cloudCount = 30
    
    for (let i = 0; i < cloudCount; i++) {
      const x = (Math.random() - 0.5) * 200
      const z = (Math.random() - 0.5) * 200
      const scale = Math.random() * 10 + 5
      
      cloudArray.push({ x, y, z, scale, id: i })
    }
    
    return cloudArray
  }, [y])
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.z += speed
      
      // Reset position for infinite scrolling
      if (groupRef.current.position.z > 100) {
        groupRef.current.position.z = -100
      }
    }
  })
  
  return (
    <group ref={groupRef}>
      {clouds.map((cloud) => {
        // Create more realistic cloud shapes
        const geometry = new THREE.SphereGeometry(cloud.scale, 12, 8)
        const positions = geometry.attributes.position
        
        // Distort sphere to look more cloud-like
        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i)
          const y = positions.getY(i) 
          const z = positions.getZ(i)
          
          const noiseValue = noise([x * 0.1, y * 0.1, z * 0.1])
          positions.setX(i, x + noiseValue * cloud.scale * 0.3)
          positions.setY(i, y + noiseValue * cloud.scale * 0.2)
          positions.setZ(i, z + noiseValue * cloud.scale * 0.3)
        }
        
        geometry.computeVertexNormals()
        
        return (
          <mesh key={cloud.id} position={[cloud.x, cloud.y, cloud.z]} geometry={geometry}>
            <meshStandardMaterial 
              color="#ffffff"
              transparent
              opacity={opacity * (0.8 + Math.random() * 0.2)}
              emissive="#FFE5B4"
              emissiveIntensity={0.1}
              roughness={1}
              metalness={0}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// Sky gradient background
function SkyGradient() {
  const { gl } = useThree()
  
  useEffect(() => {
    gl.setClearColor(new THREE.Color('#87CEEB'), 1)
  }, [gl])
  
  return null
}

// Main scene component
function AviationScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 30]} fov={50} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        color="#FFF5E6"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* Sky gradient */}
      <SkyGradient />
      
      {/* Environment with HDRI */}
      <Environment files="/hdri/kloppenheim_06_8k.exr" />
      
      {/* Aircraft */}
      <Suspense fallback={<PlaceholderAircraft />}>
        <Boeing737 />
      </Suspense>
      
      {/* Cloud layers */}
      <CloudLayer y={-5} speed={0.02} opacity={0.6} />
      <CloudLayer y={-10} speed={0.015} opacity={0.4} />
      <CloudLayer y={-15} speed={0.01} opacity={0.3} />
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#ffffff', 50, 200]} />
    </>
  )
}

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) {
    return <div className="w-full h-screen bg-sky-400" />
  }
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 3D Canvas */}
      <Canvas 
        className="absolute inset-0"
        shadows
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <Suspense fallback={null}>
          <AviationScene />
        </Suspense>
      </Canvas>
      
      {/* Hero Overlay */}
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
      
      {/* Instructions */}
      <div className="absolute bottom-8 left-8 text-white/60 text-sm">
        <p>Move your mouse to control the aircraft</p>
      </div>
    </div>
  )
}

// Preload the model
useGLTF.preload('/models/boeing-737-800.glb')
