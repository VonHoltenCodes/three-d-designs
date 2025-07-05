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
    </group>
  )
}

// Boeing 737 component with error handling
function Boeing737() {
  const [error, setError] = useState(false)
  
  try {
    const meshRef = useRef<THREE.Group>(null)
    const { mouse } = useThree()
    const { scene } = useGLTF('/models/boeing-737-800.glb')
    
    useFrame(() => {
      if (meshRef.current) {
        meshRef.current.rotation.z = mouse.x * 0.15
        meshRef.current.rotation.x = -mouse.y * 0.1
      }
    })
    
    return (
      <group ref={meshRef} scale={0.01} rotation={[0, Math.PI, 0]}>
        <primitive object={scene} />
      </group>
    )
  } catch (err) {
    console.error('Error loading Boeing model:', err)
    return <PlaceholderAircraft />
  }
}

// Fixed cloud layer - no red colors
function CloudLayer({ y = 0, speed = 0.01, opacity = 0.8 }: any) {
  const groupRef = useRef<THREE.Group>(null)
  
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
      {[...Array(15)].map((_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * 100,
            y,
            (Math.random() - 0.5) * 100
          ]}
        >
          <sphereGeometry args={[Math.random() * 5 + 3, 8, 6]} />
          <meshBasicMaterial 
            color="white"
            transparent
            opacity={opacity}
          />
        </mesh>
      ))}
    </group>
  )
}

// Loading component
function LoadingBox() {
  return (
    <Box args={[2, 2, 2]}>
      <meshStandardMaterial color="orange" />
    </Box>
  )
}

// Main scene
function AviationScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 30]} fov={50} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="white" />
      
      <color attach="background" args={['skyblue']} />
      
      <Suspense fallback={<PlaceholderAircraft />}>
        <Boeing737 />
      </Suspense>
      
      <CloudLayer y={-5} speed={0.02} opacity={0.6} />
      <CloudLayer y={-10} speed={0.015} opacity={0.4} />
      <CloudLayer y={-15} speed={0.01} opacity={0.3} />
    </>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    console.log('Page mounted')
  }, [])
  
  if (!mounted) {
    return <div className="w-full h-screen bg-sky-400 flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>
  }
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Canvas className="absolute inset-0">
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
                         rounded-full text-lg font-light hover:bg-white/20 transition-all duration-300">
            Book Your Journey
          </button>
        </div>
      </div>
    </div>
  )
}

// Preload model
useGLTF.preload('/models/boeing-737-800.glb')