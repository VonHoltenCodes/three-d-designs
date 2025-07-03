'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { Plane, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { Logo } from '@/lib/logos'

interface LogoImageProps {
  logo: Logo
  position: [number, number, number]
  delay?: number
}

export function LogoImage({ logo, position, delay = 0 }: LogoImageProps) {
  const parentRef = useRef<THREE.Group>(null)
  const billboardRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [imageTexture, setImageTexture] = useState<THREE.Texture | null>(null)
  
  // Animation from random position to final position
  const startPosition = useRef([
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20
  ])

  // Load texture
  useEffect(() => {
    const loader = new THREE.TextureLoader()
    
    // Try to load the actual logo image
    loader.load(
      `/logos/${logo.id}.svg`,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        setImageTexture(texture)
      },
      undefined,
      (error) => {
        // If loading fails, we'll use the fallback
        console.log(`Logo not found for ${logo.id}, using fallback`)
      }
    )
  }, [logo.id])

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
    billboardRef.current.lookAt(state.camera.position)
    
    // Hover effect
    const scale = hovered ? 1.2 : 1
    billboardRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
  })

  return (
    <group ref={parentRef}>
      <group 
        ref={billboardRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {imageTexture ? (
          // Logo with loaded image
          <Plane args={[0.4, 0.4]}>
            <meshStandardMaterial
              map={imageTexture}
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
            />
          </Plane>
        ) : (
          // Fallback with colored background
          <RoundedBox args={[0.4, 0.4, 0.05]} radius={0.05} smoothness={4}>
            <meshStandardMaterial
              color={logo.color}
              emissive={logo.color}
              emissiveIntensity={hovered ? 0.5 : 0.2}
            />
          </RoundedBox>
        )}
        
        {/* Logo name on hover */}
        {hovered && (
          <Plane args={[0.6, 0.15]} position={[0, -0.35, 0.1]}>
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={0.8}
            />
          </Plane>
        )}
      </group>
    </group>
  )
}