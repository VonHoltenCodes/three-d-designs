'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, PerspectiveCamera, Environment } from '@react-three/drei'
import { useRef, Suspense, useState, useEffect } from 'react'
import * as THREE from 'three'

// Boeing 737 component
function Boeing737() {
  const meshRef = useRef<THREE.Group>(null)
  const { mouse } = useThree()
  const { scene } = useGLTF('/models/boeing-737-800.glb')
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        -mouse.x * 0.15,
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
    <group ref={meshRef} scale={0.01} rotation={[0, 0, 0]}>
      <group position={[-3.3, 0.6, 4.5]}>
        <primitive object={scene} />
      </group>
    </group>
  )
}

// Main scene
function AviationScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 10, 60]} fov={50} />
      
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        castShadow
      />
      
      <color attach="background" args={['#87CEEB']} />
      
      <Environment 
        files="/hdri/kloppenheim_06_8k.exr"
        background
        blur={0}
      />
      
      <Suspense fallback={null}>
        <Boeing737 />
      </Suspense>
    </>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [scale, setScale] = useState(0.01)
  
  useEffect(() => {
    setMounted(true)
    // Transition scale after mounting
    const timer = setTimeout(() => {
      setScale(0.0001)
    }, 1000)
    
    return () => clearTimeout(timer)
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
        <group scale={scale}>
          <AviationScene />
        </group>
      </Canvas>
      
      <div className="absolute top-8 right-8 text-right text-white">
        <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-2 drop-shadow-2xl">
          Fly Beyond Limits
        </h1>
        <p className="text-lg md:text-xl font-light opacity-90 drop-shadow-lg">
          Experience luxury aviation redefined
        </p>
        <button className="pointer-events-auto px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 
                       rounded-full text-base font-light hover:bg-white/20 transition-all duration-300
                       shadow-2xl hover:shadow-3xl transform hover:scale-105 mt-4">
          Book Your Journey
        </button>
      </div>
      
      <div className="absolute bottom-8 left-8 text-white/60 text-sm">
        <p>Move your mouse to control the aircraft</p>
      </div>
    </div>
  )
}

// Preload model
useGLTF.preload('/models/boeing-737-800.glb')