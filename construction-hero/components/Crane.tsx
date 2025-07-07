'use client'

import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Box, Cylinder } from '@react-three/drei'
import * as THREE from 'three'

interface CraneProps {
  onRelease: () => void
  isReleased: boolean
  onRotationChange: (rotation: number) => void
}

export default function Crane({ onRelease, isReleased, onRotationChange }: CraneProps) {
  const craneRef = useRef<THREE.Group>(null)
  const jibRef = useRef<THREE.Group>(null)
  const { mouse } = useThree()
  const [targetRotation, setTargetRotation] = useState(0)

  // Handle mouse movement for crane rotation
  useFrame((state, delta) => {
    if (craneRef.current && !isReleased) {
      // Smooth rotation based on mouse X position
      const mouseRotation = mouse.x * Math.PI * 0.3
      setTargetRotation(mouseRotation)
      
      // Lerp to target rotation for smooth movement
      craneRef.current.rotation.y = THREE.MathUtils.lerp(
        craneRef.current.rotation.y,
        targetRotation,
        delta * 2
      )
      
      // Report the actual rotation to parent
      onRotationChange(craneRef.current.rotation.y)
    }
  })

  const handleClick = () => {
    if (!isReleased) {
      onRelease()
    }
  }

  return (
    <group ref={craneRef} position={[0, 0, 0]} onClick={handleClick}>
      {/* Base */}
      <Box args={[4, 1, 4]} position={[0, 0.5, 0]} castShadow>
        <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
      </Box>
      
      {/* Mast (vertical tower) */}
      <Box args={[2, 20, 2]} position={[0, 10, 0]} castShadow>
        <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
      </Box>
      
      {/* Counter-jib (back arm) */}
      <group position={[0, 19, 0]}>
        <Box args={[8, 1, 1]} position={[-4, 0, 0]} castShadow>
          <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
        </Box>
        {/* Counterweight */}
        <Box args={[3, 2, 2]} position={[-7, -0.5, 0]} castShadow>
          <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.1} />
        </Box>
      </group>
      
      {/* Jib (front arm with hook) */}
      <group ref={jibRef} position={[0, 19, 0]}>
        <Box args={[16, 1, 1]} position={[8, 0, 0]} castShadow>
          <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
        </Box>
        
        {/* Hook position marker */}
        <group position={[16, -1, 0]}>
          <Cylinder args={[0.2, 0.2, 1]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <meshStandardMaterial color="#666666" metalness={0.9} roughness={0.1} />
          </Cylinder>
        </group>
      </group>
      
      {/* Support cables (visual only) */}
      <Cylinder 
        args={[0.05, 0.05, 22]} 
        position={[8, 9, 0]} 
        rotation={[0, 0, -Math.PI / 4]}
      >
        <meshStandardMaterial color="#444444" />
      </Cylinder>
      <Cylinder 
        args={[0.05, 0.05, 10]} 
        position={[-4, 14, 0]} 
        rotation={[0, 0, Math.PI / 4]}
      >
        <meshStandardMaterial color="#444444" />
      </Cylinder>
    </group>
  )
}