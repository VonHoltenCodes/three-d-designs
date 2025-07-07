'use client'

import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Environment, OrbitControls, PerspectiveCamera, Sky } from '@react-three/drei'
import { Suspense, useState } from 'react'
import Crane from './Crane'
import WreckingBall from './WreckingBall'
import DestructibleWall from './DestructibleWall'
import Ground from './Ground'
import { Fog } from 'three'
import * as THREE from 'three'

export default function ConstructionScene() {
  const [isWreckingBallReleased, setIsWreckingBallReleased] = useState(false)

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        onCreated={({ scene }) => {
          scene.fog = new Fog(0x2a2a2a, 10, 100)
          scene.background = new THREE.Color(0x2a2a2a)
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[15, 10, 15]}
          fov={60}
        />
        
        <OrbitControls
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={10}
          maxDistance={30}
          target={[0, 5, 0]}
        />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 20, 5]}
          intensity={1.5}
          castShadow
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          shadow-mapSize={[2048, 2048]}
        />

        {/* Sky and Environment - Removed Sky for dark background */}
        
        <Environment
          preset="city"
          blur={0.5}
        />

        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]}>
            {/* Ground */}
            <Ground />
            
            {/* Crane with Wrecking Ball */}
            <Crane 
              onRelease={() => setIsWreckingBallReleased(true)}
              isReleased={isWreckingBallReleased}
            />
            
            {/* Wrecking Ball - attached to crane */}
            <WreckingBall 
              isReleased={isWreckingBallReleased}
              cranePosition={[0, 0, 0]}
            />
            
            {/* Destructible Wall */}
            <DestructibleWall position={[8, 0, 0]} />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  )
}