'use client'

import { useRef, useState, useMemo } from 'react'
import { RigidBody } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import { Box } from '@react-three/drei'
import * as THREE from 'three'

interface DestructibleWallProps {
  position: [number, number, number]
}

interface Brick {
  id: string
  position: [number, number, number]
  rotation: [number, number, number]
  isDestroyed: boolean
}

export default function DestructibleWall({ position }: DestructibleWallProps) {
  const [bricks, setBricks] = useState<Brick[]>(() => {
    const brickList: Brick[] = []
    const brickWidth = 2      // Bigger bricks
    const brickHeight = 1      // Bigger bricks
    const brickDepth = 1       // Bigger bricks
    const rows = 15            // Less rows but same total height
    const columns = 4          // Less columns but same total width
    const layers = 2           // 2 layers instead of 3
    
    // Create a wall of bricks with multiple layers
    for (let layer = 0; layer < layers; layer++) {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          // Offset every other row for realistic brick pattern
          const offset = row % 2 === 0 ? 0 : brickWidth / 2
          
          brickList.push({
            id: `brick-${layer}-${row}-${col}`,
            position: [
              position[0] + col * brickWidth + offset - (columns * brickWidth) / 2,
              position[1] + row * brickHeight + brickHeight / 2,
              position[2] + layer * brickDepth - (layers * brickDepth) / 2
            ],
            rotation: [0, 0, 0],
            isDestroyed: false
          })
        }
      }
    }
    
    return brickList
  })

  return (
    <>
      {bricks.map((brick) => (
        <Brick
          key={brick.id}
          {...brick}
          onDestroy={() => {
            setBricks(prev => 
              prev.map(b => 
                b.id === brick.id ? { ...b, isDestroyed: true } : b
              )
            )
          }}
        />
      ))}
    </>
  )
}

interface BrickProps extends Brick {
  onDestroy: () => void
}

function Brick({ position, rotation, isDestroyed, onDestroy }: BrickProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  
  // Enhanced brick material with realistic variations
  const brickMaterial = useMemo(() => {
    const baseColors = [
      new THREE.Color(0.54, 0.27, 0.07), // Saddle brown
      new THREE.Color(0.63, 0.32, 0.18), // Sienna  
      new THREE.Color(0.74, 0.56, 0.56), // Rosy brown
      new THREE.Color(0.80, 0.52, 0.25), // Peru
    ]
    const color = baseColors[Math.floor(Math.random() * baseColors.length)]
    
    // Add slight random variation to each brick
    const hsl = { h: 0, s: 0, l: 0 }
    color.getHSL(hsl)
    hsl.l += (Math.random() - 0.5) * 0.1
    color.setHSL(hsl.h, hsl.s, hsl.l)
    
    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.85 + Math.random() * 0.1,
      metalness: 0.05,
      envMapIntensity: 0.5,
    })
  }, [])

  if (isDestroyed) return null

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      rotation={rotation}
      type="dynamic"
      mass={10}
      restitution={0.4}
      friction={0.8}
      onCollisionEnter={(event) => {
        // Check if hit by wrecking ball (high impact force)
        const impulse = event.totalForceMagnitude
        if (impulse > 1000) {  // Lower threshold for easier breaking
          // Apply explosion force
          if (rigidBodyRef.current) {
            const force = {
              x: (Math.random() - 0.5) * 100,
              y: Math.random() * 50,
              z: (Math.random() - 0.5) * 100
            }
            rigidBodyRef.current.applyImpulse(force, true)
            
            // Mark as destroyed after a delay
            setTimeout(() => onDestroy(), 5000)
          }
        }
      }}
    >
      <Box args={[2, 1, 1]} castShadow receiveShadow material={brickMaterial} />
    </RigidBody>
  )
}