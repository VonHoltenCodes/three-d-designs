'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleTrailProps {
  startPosition: [number, number, number]
  endPosition: [number, number, number]
  progress: number
  color: string
}

export function ParticleTrail({ startPosition, endPosition, progress, color }: ParticleTrailProps) {
  const meshRef = useRef<THREE.Points>(null)
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(15 * 3) // Reduced from 30 to 15 particles
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [])
  
  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.05,
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    })
  }, [color])
  
  useFrame(() => {
    if (!meshRef.current) return
    
    const positions = geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < 15; i++) {
      const t = i / 14
      const adjustedT = t * progress
      
      positions[i * 3] = startPosition[0] + (endPosition[0] - startPosition[0]) * adjustedT
      positions[i * 3 + 1] = startPosition[1] + (endPosition[1] - startPosition[1]) * adjustedT
      positions[i * 3 + 2] = startPosition[2] + (endPosition[2] - startPosition[2]) * adjustedT
    }
    
    geometry.attributes.position.needsUpdate = true
    material.opacity = 0.6 * (1 - progress)
  })
  
  return <points ref={meshRef} geometry={geometry} material={material} />
}