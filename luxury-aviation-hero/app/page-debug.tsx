'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, PerspectiveCamera, Html } from '@react-three/drei'
import { useRef, Suspense, useState, useEffect } from 'react'
import * as THREE from 'three'

// Enhanced placeholder with better visibility
function PlaceholderAircraft() {
  const meshRef = useRef<THREE.Group>(null)
  const { mouse } = useThree()
  
  useFrame((state) => {
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
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })
  
  return (
    <group ref={meshRef}>
      {/* Fuselage */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 10, 32]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Wings */}
      <mesh position={[0, -0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.3, 12, 3]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Tail */}
      <mesh position={[0, 1.5, -4.5]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[3, 4, 0.2]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Engines */}
      <mesh position={[3, -0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 2, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-3, -0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 2, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

// Boeing loader with error handling
function BoeingLoader() {
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  
  const { scene } = useGLTF('/models/boeing-737-800.glb', (loader) => {
    loader.manager.onProgress = (item, loaded, total) => {
      setProgress((loaded / total) * 100)
    }
  })
  
  const meshRef = useRef<THREE.Group>(null)
  const { mouse } = useThree()
  
  useEffect(() => {
    if (scene) {
      console.log('Boeing model loaded:', scene)
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          console.log('Mesh found:', child.name, child.geometry, child.material)
        }
      })
    }
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
  
  if (error) {
    return (
      <Html center>
        <div className="bg-red-500 text-white p-4 rounded">
          Error loading model: {error}
        </div>
      </Html>
    )
  }
  
  return (
    <group ref={meshRef} scale={0.01} rotation={[0, Math.PI, 0]}>
      <primitive object={scene} />
    </group>
  )
}

function LoadingStatus({ progress }: { progress: number }) {
  return (
    <Html center>
      <div className="bg-black/50 text-white p-4 rounded">
        Loading Boeing 737: {Math.round(progress)}%
      </div>
    </Html>
  )
}

// Simple clouds
function SimpleClouds() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.z += 0.01
      if (groupRef.current.position.z > 20) {
        groupRef.current.position.z = -20
      }
    }
  })
  
  return (
    <group ref={groupRef}>
      {Array.from({ length: 10 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 40,
            -5 - Math.random() * 10,
            (Math.random() - 0.5) * 40
          ]}
        >
          <sphereGeometry args={[3 + Math.random() * 2, 8, 6]} />
          <meshStandardMaterial 
            color="#ffffff"
            transparent
            opacity={0.6}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function DebugHome() {
  const [mounted, setMounted] = useState(false)
  const [showBoeing, setShowBoeing] = useState(true)
  
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
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 5, 30]} fov={50} />
        
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
          castShadow
        />
        
        <color attach="background" args={['#87CEEB']} />
        
        {/* Clouds in background */}
        <SimpleClouds />
        
        {/* Aircraft in foreground */}
        <group position={[0, 0, 0]}>
          {showBoeing ? (
            <Suspense fallback={<PlaceholderAircraft />}>
              <BoeingLoader />
            </Suspense>
          ) : (
            <PlaceholderAircraft />
          )}
        </group>
        
      </Canvas>
      
      {/* Debug controls */}
      <div className="absolute top-4 left-4 bg-black/50 text-white p-4 rounded">
        <h3 className="text-lg mb-2">Debug Controls</h3>
        <button
          onClick={() => setShowBoeing(!showBoeing)}
          className="bg-white/20 px-4 py-2 rounded hover:bg-white/30"
        >
          {showBoeing ? 'Show Placeholder' : 'Show Boeing'}
        </button>
        <div className="mt-2 text-sm">
          <p>Model: {showBoeing ? 'Boeing 737' : 'Placeholder'}</p>
          <p>Check console for loading info</p>
        </div>
      </div>
      
      {/* Title in top-right */}
      <div className="absolute top-8 right-8 text-right text-white">
        <h1 className="text-4xl font-light mb-2">Fly Beyond Limits</h1>
        <p className="text-lg opacity-90">Experience luxury aviation</p>
      </div>
      
      <div className="absolute bottom-8 left-8 text-white/60 text-sm">
        <p>Move your mouse to control the aircraft</p>
      </div>
    </div>
  )
}

// Preload
useGLTF.preload('/models/boeing-737-800.glb')