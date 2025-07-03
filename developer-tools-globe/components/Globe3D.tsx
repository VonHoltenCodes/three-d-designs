'use client'

import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, Stars } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { LogoSphere } from './LogoSphere'
import { GlobeControls } from './GlobeControls'
import { LoadingScreen } from './LoadingScreen'

export function Globe3D() {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-black">
      <Canvas>
        <Suspense fallback={<LoadingScreen />}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />
          
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          {/* Stars background */}
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
          />
          
          {/* Globe with controls */}
          <GlobeWithControls />
          
          {/* Post-processing effects */}
          <EffectComposer>
            <Bloom 
              intensity={0.3}
              luminanceThreshold={0.5}
              luminanceSmoothing={0.9}
              radius={0.3}
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}

function GlobeWithControls() {
  const globeRef = useRef<THREE.Group>(null)
  
  return (
    <>
      <LogoSphere ref={globeRef} />
      <GlobeControls globeRef={globeRef} />
    </>
  )
}