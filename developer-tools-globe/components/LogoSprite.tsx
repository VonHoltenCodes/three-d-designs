'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import type { Logo } from '@/lib/logos'
import { ParticleTrail } from './ParticleTrail'

interface LogoSpriteProps {
  logo: Logo
  position: [number, number, number]
  delay?: number
}

export function LogoSprite({ logo, position, delay = 0 }: LogoSpriteProps) {
  const parentRef = useRef<THREE.Group>(null)
  const billboardRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  
  // Animation from random position to final position
  const startPosition = useRef([
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20
  ])

  useFrame((state, delta) => {
    if (!parentRef.current || !billboardRef.current) return
    
    // Wait for delay before starting animation
    const elapsedTime = state.clock.getElapsedTime()
    if (elapsedTime < delay) return
    
    // Assembly animation - move the parent group
    if (animationProgress < 1) {
      const newProgress = Math.min(animationProgress + delta * 0.5, 1)
      setAnimationProgress(newProgress)
      
      // Easing function
      const eased = 1 - Math.pow(1 - newProgress, 3)
      
      // Interpolate position of parent group
      parentRef.current.position.x = startPosition.current[0] + (position[0] - startPosition.current[0]) * eased
      parentRef.current.position.y = startPosition.current[1] + (position[1] - startPosition.current[1]) * eased
      parentRef.current.position.z = startPosition.current[2] + (position[2] - startPosition.current[2]) * eased
    } else {
      // Ensure final position is set
      parentRef.current.position.set(position[0], position[1], position[2])
    }
    
    // Billboard effect - only rotate the inner group to face camera
    const worldPosition = new THREE.Vector3()
    parentRef.current.getWorldPosition(worldPosition)
    billboardRef.current.lookAt(state.camera.position)
    
    // Hover effect
    const scale = hovered ? 1.2 : 1
    billboardRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
  })

  return (
    <>
      {/* Particle trail during assembly */}
      {animationProgress < 0.95 && (
        <ParticleTrail
          startPosition={startPosition.current as [number, number, number]}
          endPosition={position}
          progress={animationProgress}
          color={logo.color}
        />
      )}
      
      {/* Parent group that stays attached to globe position */}
      <group ref={parentRef}>
        {/* Billboard group that faces camera */}
        <group 
          ref={billboardRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {/* Logo background sphere */}
          <Sphere args={[0.15, 16, 16]}>
            <meshStandardMaterial 
              color={logo.color} 
              emissive={logo.color}
              emissiveIntensity={hovered ? 0.5 : 0.2}
            />
          </Sphere>
          
          {/* Logo text */}
          <Text
            position={[0, 0, 0.16]}
            fontSize={0.1}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {logo.name.substring(0, 2).toUpperCase()}
          </Text>
          
          {/* Hover label */}
          {hovered && (
            <Text
              position={[0, -0.3, 0]}
              fontSize={0.08}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {logo.name}
            </Text>
          )}
        </group>
      </group>
    </>
  )
}