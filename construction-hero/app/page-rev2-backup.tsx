'use client'

import { Canvas } from '@react-three/fiber'
import { Physics, RigidBody, useSphericalJoint } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import { OrbitControls, Cylinder, Environment, useProgress, Html } from '@react-three/drei'
import { Suspense, useState, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, DepthOfField, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import Crane from '@/components/Crane'
import DestructibleWall from '@/components/DestructibleWall'
import DustParticles from '@/components/DustParticles'

// Loading component
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="text-white text-xl font-bold">
        Loading... {progress.toFixed(0)}%
      </div>
    </Html>
  )
}

// Separate wrecking ball that swings independently
function SwingingWreckingBall({ 
  isReleased, 
  craneRotation,
  onImpact
}: { 
  isReleased: boolean, 
  craneRotation: number,
  onImpact: (position: THREE.Vector3) => void
}) {
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
        onCollisionEnter={(event) => {
          // Trigger dust effect on impact
          const impulse = event.totalForceMagnitude
          if (impulse > 500 && ballRef.current) {
            const pos = ballRef.current.translation()
            onImpact(new THREE.Vector3(pos.x, 0, pos.z))
          }
        }}
      >
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial 
            color={new THREE.Color(0.3, 0.25, 0.2)}
            metalness={0.7}
            roughness={0.8}
            envMapIntensity={0.8}
          />
        </mesh>
      </RigidBody>
    </>
  )
}

export default function Home() {
  const [isReleased, setIsReleased] = useState(false)
  const [craneRotation, setCraneRotation] = useState(0)
  const [dustActive, setDustActive] = useState(false)
  const [impactPosition, setImpactPosition] = useState<THREE.Vector3>()

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#2a2a2a]">
      <Canvas 
        shadows 
        camera={{ position: [30, 20, 10], fov: 50 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          powerPreference: 'high-performance'
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true
          gl.shadowMap.type = THREE.PCFSoftShadowMap
        }}
      >
        
        <OrbitControls 
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 5, 0]}
        />
        
        {/* HDRI Environment */}
        <Environment
          files="/hdri/industrial_sunset_4k.hdr"
          background
          blur={0.02}
        />
        
        {/* Atmospheric fog */}
        <fog attach="fog" args={['#d4a373', 20, 80]} />
        
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[20, 30, 10]} 
          intensity={2.5} 
          castShadow
          shadow-mapSize={[4096, 4096]}
          shadow-camera-near={0.1}
          shadow-camera-far={100}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
          shadow-bias={-0.001}
        />
        
        {/* Fill light */}
        <directionalLight position={[-20, 20, -10]} intensity={0.8} color="#ffaa44" />
        
        <Suspense fallback={<Loader />}>
          <Physics gravity={[0, -9.81, 0]}>
            {/* Ground */}
            <RigidBody type="fixed">
              <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial 
                  color={new THREE.Color(0.4, 0.35, 0.3)}
                  roughness={0.95}
                  metalness={0.0}
                />
              </mesh>
            </RigidBody>
            
            {/* Crane */}
            <Crane 
              onRelease={() => setIsReleased(true)}
              isReleased={isReleased}
              onRotationChange={setCraneRotation}
            />
            
            {/* Swinging Wrecking Ball (separate from crane) */}
            <SwingingWreckingBall 
              isReleased={isReleased} 
              craneRotation={craneRotation}
              onImpact={(position) => {
                setImpactPosition(position)
                setDustActive(true)
                // Reset dust after some time
                setTimeout(() => setDustActive(false), 3000)
              }}
            />
            
            {/* Destructible Wall - positioned where ball can hit it */}
            <DestructibleWall position={[13, 0, -9]} />
            
            {/* Dust Particles */}
            <DustParticles 
              count={500} 
              isActive={dustActive} 
              impactPosition={impactPosition}
            />
          </Physics>
          
          {/* Post-processing Effects */}
          <EffectComposer>
            <Bloom 
              intensity={0.8}
              luminanceThreshold={0.9}
              luminanceSmoothing={0.025}
              mipmapBlur
            />
            <DepthOfField 
              focusDistance={0.01}
              focalLength={0.04}
              bokehScale={4}
            />
            <Vignette offset={0.1} darkness={0.4} />
            <ChromaticAberration 
              blendFunction={BlendFunction.NORMAL}
              offset={[0.001, 0.001]}
            />
          </EffectComposer>
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
