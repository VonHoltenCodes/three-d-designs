'use client'

import { Canvas } from '@react-three/fiber'
import { Physics, RigidBody, useSphericalJoint } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import { Cylinder, Environment, useProgress, Html, OrbitControls } from '@react-three/drei'
import { Suspense, useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, DepthOfField, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import Crane from '@/components/Crane'
import DestructibleWall from '@/components/DestructibleWall'
import DustParticles from '@/components/DustParticles'
import PerformanceMonitor from '@/components/PerformanceMonitor'

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
    if (anchorRef.current) {
      // Always update anchor position based on crane rotation
      // The jib extends 16 units in the positive X direction at rotation 0
      const jibLength = 16
      const x = Math.cos(-craneRotation) * jibLength
      const z = Math.sin(-craneRotation) * jibLength
      
      // Keep anchor at crane tip position
      if (!isReleased) {
        anchorRef.current.setTranslation({ x, y: 18, z }, true)
      }
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
        mass={200}
        colliders="ball"
        linearDamping={0.05}
        angularDamping={0.1}
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
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high')

  // Handle spacebar press for releasing wrecking ball
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !isReleased) {
        event.preventDefault()
        setIsReleased(true)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isReleased])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
      <Canvas 
        style={{ width: '100%', height: '100%' }}
        shadows 
        camera={{ position: [25, 35, 25], fov: 75 }}
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
        
        {/* Camera Controls - limited to prevent interference */}
        <OrbitControls 
          enablePan={false}
          enableRotate={true}
          enableZoom={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={15}
          maxDistance={100}
          target={[0, 10, -5]}
        />
        
        {/* HDRI Environment */}
        <Environment
          files="/hdri/industrial_sunset_4k.hdr"
          background
          blur={0}
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
          
          {/* Post-processing Effects - quality dependent */}
          {quality !== 'low' && (
            <EffectComposer>
              <Bloom 
                intensity={quality === 'high' ? 0.8 : 0.5}
                luminanceThreshold={0.9}
                luminanceSmoothing={0.025}
                mipmapBlur={quality === 'high'}
              />
              {quality === 'high' && (
                <>
                  <DepthOfField 
                    focusDistance={0.02}
                    focalLength={0.02}
                    bokehScale={2}
                  />
                  <ChromaticAberration 
                    blendFunction={BlendFunction.NORMAL}
                    offset={[0.001, 0.001]}
                  />
                </>
              )}
              <Vignette offset={0.1} darkness={0.4} />
            </EffectComposer>
          )}
          
          {/* Performance Monitor - Comment out to disable auto quality adjustment */}
          {/* <PerformanceMonitor onQualityChange={setQuality} /> */}
        </Suspense>
      </Canvas>
      
      {/* UI Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '2rem', right: '2rem', textAlign: 'right' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            Build Beyond Limits
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', marginTop: '1rem', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            Press SPACE to release the wrecking ball
          </p>
        </div>
        
        {/* Quality indicator */}
        {quality !== 'high' && (
          <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', textAlign: 'right' }}>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
              Performance Mode: {quality.toUpperCase()}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}