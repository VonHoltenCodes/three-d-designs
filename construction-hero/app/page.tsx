'use client'

import { Canvas } from '@react-three/fiber'
import { Physics, RigidBody, useSphericalJoint } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import { OrbitControls, Cylinder } from '@react-three/drei'
import { Suspense, useState, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import Crane from '@/components/Crane'
import DestructibleWall from '@/components/DestructibleWall'

// Separate wrecking ball that swings independently
function SwingingWreckingBall({ isReleased, craneRotation }: { isReleased: boolean, craneRotation: number }) {
  const anchorRef = useRef<RapierRigidBody>(null)
  const ballRef = useRef<RapierRigidBody>(null)
  const cableRef = useRef<THREE.Mesh>(null)
  
  // Create spherical joint between anchor and ball
  useSphericalJoint(anchorRef, ballRef, [
    [0, 0, 0], // anchor point on anchor body
    [0, 8, 0], // anchor point on ball body (8 units above ball center)
  ])
  
  useFrame(() => {
    if (anchorRef.current && !isReleased) {
      // Use the actual crane rotation (already smoothed by the crane)
      // The jib extends 16 units in the positive X direction at rotation 0
      const jibLength = 16
      const x = Math.cos(-craneRotation) * jibLength
      const z = Math.sin(-craneRotation) * jibLength
      anchorRef.current.setTranslation({ x, y: 18, z }, true)
    }
    
    // Update cable visual to connect anchor to ball
    if (ballRef.current && anchorRef.current && cableRef.current) {
      const ballPos = ballRef.current.translation()
      const anchorPos = anchorRef.current.translation()
      
      // Position cable between anchor and ball
      cableRef.current.position.set(
        (anchorPos.x + ballPos.x) / 2,
        (anchorPos.y + ballPos.y) / 2,
        (anchorPos.z + ballPos.z) / 2
      )
      
      // Orient cable to point from anchor to ball
      const direction = new THREE.Vector3(
        ballPos.x - anchorPos.x,
        ballPos.y - anchorPos.y,
        ballPos.z - anchorPos.z
      )
      const length = direction.length()
      cableRef.current.scale.y = length / 8 // 8 is default cylinder height
      
      cableRef.current.lookAt(anchorPos.x, anchorPos.y, anchorPos.z)
      cableRef.current.rotateX(Math.PI / 2)
    }
  })
  
  return (
    <>
      {/* Anchor point (invisible, follows crane) */}
      <RigidBody ref={anchorRef} type="kinematicPosition" position={[16, 18, 0]}>
        <mesh>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial visible={false} />
        </mesh>
      </RigidBody>
      
      {/* Dynamic cable visual */}
      <mesh ref={cableRef}>
        <cylinderGeometry args={[0.05, 0.05, 8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      
      {/* Wrecking Ball */}
      <RigidBody 
        ref={ballRef}
        position={[16, 10, 0]} 
        type="dynamic"
        mass={500}
        colliders="ball"
        linearDamping={0.1}
        angularDamping={0.3}
      >
        <mesh castShadow>
          <sphereGeometry args={[1.5]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.2} />
        </mesh>
      </RigidBody>
    </>
  )
}

export default function Home() {
  const [isReleased, setIsReleased] = useState(false)
  const [craneRotation, setCraneRotation] = useState(0)

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#2a2a2a]">
      <Canvas 
        shadows 
        camera={{ position: [30, 20, 10], fov: 50 }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color(0x2a2a2a)
          scene.fog = new THREE.Fog(0x2a2a2a, 10, 100)
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 5]} intensity={1} castShadow />
        
        <OrbitControls 
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 5, 0]}
        />
        
        {/* Sky removed for dark background */}
        
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]}>
            {/* Ground */}
            <RigidBody type="fixed">
              <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial color="#8B4513" />
              </mesh>
            </RigidBody>
            
            {/* Crane */}
            <Crane 
              onRelease={() => setIsReleased(true)}
              isReleased={isReleased}
              onRotationChange={setCraneRotation}
            />
            
            {/* Swinging Wrecking Ball (separate from crane) */}
            <SwingingWreckingBall isReleased={isReleased} craneRotation={craneRotation} />
            
            {/* Destructible Wall - positioned where ball can hit it */}
            <DestructibleWall position={[13, 0, -9]} />
          </Physics>
        </Suspense>
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative h-full">
          <div className="absolute top-8 right-8 text-right">
            <h1 className="text-5xl font-bold text-white drop-shadow-2xl">
              Build Beyond Limits
            </h1>
            <p className="text-xl text-white/90 mt-4 drop-shadow-lg">
              Click to release the wrecking ball
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
