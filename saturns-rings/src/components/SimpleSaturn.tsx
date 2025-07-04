'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function SaturnSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
    }
  })
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color="#D2B48C" />
    </mesh>
  )
}

function SimpleRing() {
  const ringRef = useRef<THREE.Mesh>(null)
  
  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.05
    }
  })
  
  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[3, 5, 64]} />
      <meshStandardMaterial color="#E0F2FF" side={THREE.DoubleSide} transparent opacity={0.7} />
    </mesh>
  )
}

export default function SimpleSaturn() {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls enablePan={false} />
        
        <SaturnSphere />
        <SimpleRing />
      </Canvas>
    </div>
  )
}