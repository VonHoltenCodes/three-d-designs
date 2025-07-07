'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Box, Cylinder } from '@react-three/drei'
import * as THREE from 'three'

interface CraneProps {
  onRelease: () => void
  isReleased: boolean
  onRotationChange: (rotation: number) => void
}

export default function Crane({ onRelease, isReleased, onRotationChange }: CraneProps) {
  const craneRef = useRef<THREE.Group>(null)
  const jibRef = useRef<THREE.Group>(null)
  const mouseX = useRef(0)
  
  // Track mouse movement on the window with passive listener
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to -1 to 1
      mouseX.current = (event.clientX / window.innerWidth) * 2 - 1
    }
    
    // Use passive listener to not interfere with other mouse handlers
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  // Enhanced PBR materials
  const craneMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.9, 0.7, 0.1),
    metalness: 0.85,
    roughness: 0.4,
    envMapIntensity: 1.5,
  }), [])
  
  const cableMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.2, 0.2, 0.2),
    metalness: 0.9,
    roughness: 0.3,
  }), [])
  
  const counterweightMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.15, 0.15, 0.15),
    metalness: 0.7,
    roughness: 0.6,
  }), [])

  // Animate crane rotation based on mouse position
  useFrame((state, delta) => {
    if (craneRef.current && !isReleased) {
      // Calculate rotation based on mouse X position
      const targetRotation = mouseX.current * Math.PI * 0.3
      
      // Lerp to target rotation for smooth movement
      craneRef.current.rotation.y = THREE.MathUtils.lerp(
        craneRef.current.rotation.y,
        targetRotation,
        delta * 3
      )
      
      // Report the actual rotation to parent
      onRotationChange(craneRef.current.rotation.y)
    }
  })

  return (
    <group ref={craneRef} position={[0, 0, 0]}>
      {/* Base */}
      <Box args={[4, 1, 4]} position={[0, 0.5, 0]} castShadow receiveShadow material={craneMaterial} />
      
      {/* Mast (vertical tower) */}
      <Box args={[2, 20, 2]} position={[0, 10, 0]} castShadow receiveShadow material={craneMaterial} />
      
      {/* Counter-jib (back arm) */}
      <group position={[0, 19, 0]}>
        <Box args={[8, 1, 1]} position={[-4, 0, 0]} castShadow receiveShadow material={craneMaterial} />
        {/* Counterweight */}
        <Box args={[3, 2, 2]} position={[-7, -0.5, 0]} castShadow receiveShadow material={counterweightMaterial} />
      </group>
      
      {/* Jib (front arm with hook) */}
      <group ref={jibRef} position={[0, 19, 0]}>
        <Box args={[16, 1, 1]} position={[8, 0, 0]} castShadow receiveShadow material={craneMaterial} />
        
        {/* Hook position marker */}
        <group position={[16, -1, 0]}>
          <Cylinder args={[0.2, 0.2, 1]} rotation={[0, 0, Math.PI / 2]} castShadow material={cableMaterial} />
        </group>
      </group>
      
      {/* Support cables (visual only) */}
      <Cylinder 
        args={[0.05, 0.05, 22]} 
        position={[8, 9, 0]} 
        rotation={[0, 0, -Math.PI / 4]}
        material={cableMaterial}
      />
      <Cylinder 
        args={[0.05, 0.05, 10]} 
        position={[-4, 14, 0]} 
        rotation={[0, 0, Math.PI / 4]}
        material={cableMaterial}
      />
    </group>
  )
}