'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, useGLTF, PerspectiveCamera, Box } from '@react-three/drei'
import { useRef, Suspense, useState, useEffect } from 'react'
import * as THREE from 'three'

// Simple airplane placeholder
function PlaceholderAircraft() {
  const meshRef = useRef<THREE.Group>(null)
  const { mouse } = useThree()
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z = mouse.x * 0.2
      meshRef.current.rotation.x = -mouse.y * 0.1
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

// Boeing 737 component - fixed hooks usage
function Boeing737() {
  const meshRef = useRef<THREE.Group>(null)
  const { mouse } = useThree()
  
  // This will throw if model doesn't exist, caught by Suspense error boundary
  const { scene } = useGLTF('/models/boeing-737-800.glb')
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z = mouse.x * 0.15
      meshRef.current.rotation.x = -mouse.y * 0.1
      meshRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.2
    }
  })
  
  return (
    <group ref={meshRef} scale={0.01} rotation={[0, Math.PI, 0]}>
      <primitive object={scene} />
    </group>
  )
}

// Simple cloud layer
function CloudLayer({ y = 0, speed = 0.01, opacity = 0.8 }: any) {
  const groupRef = useRef<THREE.Group>(null)
  const clouds = useRef<{ x: number; z: number; scale: number }[]>([])
  
  // Generate cloud positions once
  if (clouds.current.length === 0) {
    for (let i = 0; i < 20; i++) {
      clouds.current.push({
        x: (Math.random() - 0.5) * 100,
        z: (Math.random() - 0.5) * 100,
        scale: Math.random() * 5 + 3
      })
    }
  }
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.z += speed
      if (groupRef.current.position.z > 50) {
        groupRef.current.position.z = -50
      }
    }
  })
  
  return (
    <group ref={groupRef}>
      {clouds.current.map((cloud, i) => (
        <mesh key={i} position={[cloud.x, y, cloud.z]}>
          <sphereGeometry args={[cloud.scale, 8, 6]} />
          <meshStandardMaterial 
            color="white"
            transparent
            opacity={opacity}
          />
        </mesh>
      ))}
    </group>
  )
}

// Error fallback component
function ErrorFallback() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="red" />
    </mesh>
  )
}

// Main scene
function AviationScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 30]} fov={50} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FFF5E6" />
      
      <color attach="background" args={['#87CEEB']} />
      
      {/* Try to load Boeing, fallback to placeholder */}
      <Suspense fallback={<PlaceholderAircraft />}>
        <Boeing737 />
      </Suspense>
      
      <CloudLayer y={-5} speed={0.02} opacity={0.6} />
      <CloudLayer y={-10} speed={0.015} opacity={0.4} />
      <CloudLayer y={-15} speed={0.01} opacity={0.3} />
      
      <fog attach="fog" args={['#ffffff', 50, 150]} />
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
      <Canvas className="absolute inset-0" shadows>
        <AviationScene />
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
                         shadow-2xl transform hover:scale-105">
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