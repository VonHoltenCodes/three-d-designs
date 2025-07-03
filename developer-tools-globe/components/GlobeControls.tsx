'use client'

import { useFrame } from '@react-three/fiber'
import { useGlobeControls } from '@/hooks/useGlobeControls'
import * as THREE from 'three'

interface GlobeControlsProps {
  globeRef: React.RefObject<THREE.Group>
}

export function GlobeControls({ globeRef }: GlobeControlsProps) {
  const { rotationSpeed } = useGlobeControls()
  
  useFrame(() => {
    // Apply rotation to the globe group only
    if (globeRef.current && (rotationSpeed.current.x !== 0 || rotationSpeed.current.y !== 0)) {
      globeRef.current.rotation.y += rotationSpeed.current.x
      globeRef.current.rotation.x += rotationSpeed.current.y
      
      // Apply damping
      rotationSpeed.current.x *= 0.95
      rotationSpeed.current.y *= 0.95
      
      // Stop if very small
      if (Math.abs(rotationSpeed.current.x) < 0.001) rotationSpeed.current.x = 0
      if (Math.abs(rotationSpeed.current.y) < 0.001) rotationSpeed.current.y = 0
    }
  })
  
  return null
}