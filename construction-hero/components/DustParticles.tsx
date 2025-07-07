'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Points, PointMaterial } from '@react-three/drei'

interface DustParticlesProps {
  count?: number
  isActive?: boolean
  impactPosition?: THREE.Vector3
}

export default function DustParticles({ count = 1000, isActive = false, impactPosition }: DustParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const velocitiesRef = useRef<Float32Array>()
  
  // Initialize particle positions and velocities
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Start particles at ground level in a spread area
      positions[i3] = (Math.random() - 0.5) * 20
      positions[i3 + 1] = Math.random() * 0.5
      positions[i3 + 2] = (Math.random() - 0.5) * 20
      
      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.2
      velocities[i3 + 1] = Math.random() * 0.5 + 0.1
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.2
      
      // Dusty brown colors with variation
      const brightness = 0.6 + Math.random() * 0.4
      colors[i3] = brightness * 0.8
      colors[i3 + 1] = brightness * 0.7
      colors[i3 + 2] = brightness * 0.5
    }
    
    velocitiesRef.current = velocities
    return [positions, colors]
  }, [count])
  
  // Update particles when impact occurs
  useEffect(() => {
    if (isActive && impactPosition && pointsRef.current && velocitiesRef.current) {
      const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array
      const velocities = velocitiesRef.current
      
      // Reset particles near impact point
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        
        // Place particles around impact point
        positionsArray[i3] = impactPosition.x + (Math.random() - 0.5) * 4
        positionsArray[i3 + 1] = impactPosition.y + Math.random() * 2
        positionsArray[i3 + 2] = impactPosition.z + (Math.random() - 0.5) * 4
        
        // Explosion velocities
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 0.5 + 0.2
        velocities[i3] = Math.cos(angle) * speed
        velocities[i3 + 1] = Math.random() * 1.5 + 0.5
        velocities[i3 + 2] = Math.sin(angle) * speed
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  }, [isActive, impactPosition, count])
  
  useFrame((state, delta) => {
    if (!isActive || !pointsRef.current || !velocitiesRef.current) return
    
    const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array
    const velocities = velocitiesRef.current
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Update positions based on velocity
      positionsArray[i3] += velocities[i3] * delta * 60
      positionsArray[i3 + 1] += velocities[i3 + 1] * delta * 60
      positionsArray[i3 + 2] += velocities[i3 + 2] * delta * 60
      
      // Apply gravity
      velocities[i3 + 1] -= 9.81 * delta * 0.1
      
      // Apply air resistance
      velocities[i3] *= 0.98
      velocities[i3 + 1] *= 0.98
      velocities[i3 + 2] *= 0.98
      
      // Reset particles that fall below ground
      if (positionsArray[i3 + 1] < 0) {
        positionsArray[i3 + 1] = 0
        velocities[i3 + 1] = 0
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })
  
  return (
    <Points ref={pointsRef} positions={positions} colors={colors}>
      <PointMaterial 
        size={0.15} 
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}