'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, RigidBodyApi, useSphericalJoint, useRopeJoint } from '@react-three/rapier'
import { Sphere, Cylinder } from '@react-three/drei'
import * as THREE from 'three'

interface WreckingBallProps {
  isReleased: boolean
  cranePosition: [number, number, number]
}

export default function WreckingBall({ isReleased, cranePosition }: WreckingBallProps) {
  const ballRef = useRef<RigidBodyApi>(null)
  const anchorRef = useRef<RigidBodyApi>(null)
  
  // Starting position - hanging from crane
  const ballPosition: [number, number, number] = [16, 10, 0]
  const anchorPosition: [number, number, number] = [16, 18, 0]

  useEffect(() => {
    if (isReleased && ballRef.current) {
      // Apply initial swing force when released
      ballRef.current.applyImpulse({ x: -10, y: 0, z: 0 }, true)
    }
  }, [isReleased])

  return (
    <>
      {/* Anchor point (invisible, fixed to crane) */}
      <RigidBody 
        ref={anchorRef}
        type="fixed" 
        position={anchorPosition}
      >
        <mesh>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>
      </RigidBody>

      {/* Wrecking Ball */}
      <RigidBody
        ref={ballRef}
        position={ballPosition}
        type={isReleased ? "dynamic" : "fixed"}
        mass={500}
        restitution={0.2}
        friction={0.7}
        linearDamping={0.1}
        angularDamping={0.1}
        colliders="ball"
      >
        <Sphere args={[1.5]} castShadow>
          <meshStandardMaterial 
            color="#2a2a2a"
            metalness={0.9}
            roughness={0.2}
            envMapIntensity={1}
          />
        </Sphere>
      </RigidBody>

      {/* Chain visualization */}
      <ChainSegments 
        start={anchorPosition}
        end={ballPosition}
        segments={8}
      />
    </>
  )
}

// Simple chain visualization component
function ChainSegments({ 
  start, 
  end, 
  segments 
}: { 
  start: [number, number, number]
  end: [number, number, number]
  segments: number 
}) {
  const links = []
  
  for (let i = 0; i < segments; i++) {
    const t = i / (segments - 1)
    const x = start[0] + (end[0] - start[0]) * t
    const y = start[1] + (end[1] - start[1]) * t
    const z = start[2] + (end[2] - start[2]) * t
    
    links.push(
      <Cylinder
        key={i}
        args={[0.1, 0.1, 1]}
        position={[x, y - 0.5, z]}
        rotation={[0, 0, 0]}
      >
        <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.3} />
      </Cylinder>
    )
  }
  
  return <>{links}</>
}