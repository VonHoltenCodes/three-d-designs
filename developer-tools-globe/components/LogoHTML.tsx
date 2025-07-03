'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Logo } from '@/lib/logos'
import { ParticleTrail } from './ParticleTrail'

interface LogoHTMLProps {
  logo: Logo
  position: [number, number, number]
  delay?: number
}

export function LogoHTML({ logo, position, delay = 0 }: LogoHTMLProps) {
  const parentRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [imageError, setImageError] = useState(false)
  
  // Animation from random position to final position
  const startPosition = useRef([
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20
  ])

  useFrame((state, delta) => {
    if (!parentRef.current) return
    
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
        <Html
          center
          sprite
          transform
          occlude={false}
          scale={0.4}
          distanceFactor={4}
          style={{
            transition: 'all 0.2s',
            transform: hovered ? 'scale(1.2)' : 'scale(1)',
          }}
        >
          <div
            className="relative cursor-pointer select-none"
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            style={{
              width: '96px',
              height: '96px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!imageError ? (
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: logo.color,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                  boxShadow: `0 6px 20px rgba(0,0,0,0.4)`,
                  border: '2px solid rgba(255,255,255,0.3)',
                }}
              >
                <img
                  src={`/logos/${logo.id}.svg`}
                  alt={logo.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1)', // Make SVG white
                  }}
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              // Fallback design
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: logo.color,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  boxShadow: `0 6px 20px rgba(0,0,0,0.4)`,
                  border: '2px solid rgba(255,255,255,0.3)',
                }}
              >
                {logo.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            
            {/* Tooltip on hover */}
            {hovered && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '-50px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '18px',
                  whiteSpace: 'nowrap',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                {logo.name}
              </div>
            )}
          </div>
        </Html>
      </group>
    </>
  )
}