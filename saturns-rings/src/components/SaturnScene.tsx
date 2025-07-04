'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { Saturn } from './Saturn'
import { SaturnRings } from './SaturnRings'
import { Suspense } from 'react'

export default function SaturnScene() {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[15, 8, 15]} fov={45} />
      <OrbitControls
        enablePan={false}
        minDistance={10}
        maxDistance={50}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.5}
      />
      
      {/* Lighting for realism */}
      <ambientLight intensity={0.05} />
      
      {/* Main sun light */}
      <directionalLight
        position={[50, 30, 20]}
        intensity={1.5}
        color="#FFF5E6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Rim lighting for Saturn */}
      <directionalLight
        position={[-20, 10, -10]}
        intensity={0.3}
        color="#87CEEB"
      />
      
      {/* Background stars */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      
      <Suspense fallback={null}>
        {/* Saturn planet */}
        <Saturn />
        
        {/* Ring system with developer tools */}
        <SaturnRings />
      </Suspense>
      
      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.8}
          luminanceSmoothing={0.9}
          radius={0.8}
        />
        <Vignette eskil={false} offset={0.1} darkness={0.8} />
      </EffectComposer>
    </Canvas>
  )
}