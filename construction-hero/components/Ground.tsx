'use client'

import { RigidBody } from '@react-three/rapier'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function Ground() {
  // For now, we'll use a simple concrete-like material
  // You can add actual textures later
  
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#8B7355"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
    </RigidBody>
  )
}