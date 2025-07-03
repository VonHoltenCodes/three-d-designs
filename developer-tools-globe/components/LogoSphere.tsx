'use client'

import { forwardRef, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Sphere } from '@react-three/drei'
import { LogoHTML } from './LogoHTML'
import { RotatingCore } from './RotatingCore'
import { developerLogos, calculateSpherePositions } from '@/lib/logos'

export const LogoSphere = forwardRef<THREE.Group>((props, ref) => {
  const sphereRef = useRef<THREE.Mesh>(null)
  const localRef = useRef<THREE.Group>(null)
  
  // Use the forwarded ref or local ref
  const groupRef = (ref as React.RefObject<THREE.Group>) || localRef
  
  // Calculate positions for all logos
  const logoPositions = useMemo(() => {
    return calculateSpherePositions(developerLogos.length)
  }, [])
  
  // Optional: Add subtle idle rotation when not being controlled
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Slightly faster idle rotation
      groupRef.current.rotation.y += delta * 0.08
    }
  })

  // Create a wireframe material for the base sphere with atomic green
  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: 0x00ff41, // Atomic green
      wireframe: true,
      transparent: true,
      opacity: 0.4,
      toneMapped: false,
    })
  }, [])

  return (
    <group ref={groupRef}>
      {/* Counter-rotating core */}
      <RotatingCore />
      
      {/* Main sphere - now with atomic green grid */}
      <Sphere ref={sphereRef} args={[2.5, 24, 24]} material={material} />
      
      {/* Inner glow sphere - subtle green tint */}
      <Sphere args={[2.4, 16, 16]}>
        <meshBasicMaterial
          color="#00ff41"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Outer atmosphere - blue with green tint */}
      <Sphere args={[2.8, 16, 16]}>
        <meshBasicMaterial
          color="#0080ff"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Logo sprites */}
      {developerLogos.map((logo, index) => {
        const pos = logoPositions[index]
        return (
          <LogoHTML
            key={logo.id}
            logo={logo}
            position={[pos.x, pos.y, pos.z]}
            delay={index * 0.05}
          />
        )
      })}
    </group>
  )
})