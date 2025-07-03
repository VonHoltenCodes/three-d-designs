'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Icosahedron } from '@react-three/drei'
import * as THREE from 'three'

export function RotatingCore() {
  const coreRef = useRef<THREE.Group>(null)
  const innerCoreRef = useRef<THREE.Mesh>(null)
  
  useFrame((state, delta) => {
    if (coreRef.current) {
      // Counter-rotate the core (opposite direction)
      coreRef.current.rotation.x -= delta * 0.3
      coreRef.current.rotation.y -= delta * 0.5
      coreRef.current.rotation.z -= delta * 0.2
    }
    
    if (innerCoreRef.current) {
      // Pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      innerCoreRef.current.scale.setScalar(scale)
    }
  })
  
  // Create materials for the core
  const coreMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: 0xff6b00, // Retro orange
      transparent: true,
      opacity: 0.5,
      wireframe: true,
    })
  }, [])
  
  const innerCoreMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0x00ff41,
      emissive: 0x00ff41,
      emissiveIntensity: 2,
      toneMapped: false,
    })
  }, [])
  
  return (
    <group ref={coreRef}>
      {/* Outer core structure */}
      <Icosahedron args={[0.8, 1]} material={coreMaterial} />
      
      {/* Inner glowing core */}
      <Sphere ref={innerCoreRef} args={[0.3, 16, 16]} material={innerCoreMaterial} />
      
      {/* Core glow effect */}
      <Sphere args={[0.5, 16, 16]}>
        <meshBasicMaterial
          color="#00ff41"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  )
}