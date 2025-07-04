'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense } from 'react';
import GridBackground from './GridBackground';
import DoubleHelix from './DoubleHelix';
import LoadingScreen from './LoadingScreen';
import HelixControls from './HelixControls';

export default function DNA3D() {
  return (
    <div className="relative w-full h-screen">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={60} />
        
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        
        <Suspense fallback={<LoadingScreen />}>
          <GridBackground />
          <DoubleHelix />
        </Suspense>
        
        <OrbitControls 
          enablePan={false}
          minDistance={8}
          maxDistance={30}
          autoRotate
          autoRotateSpeed={0.5}
        />
        
        <EffectComposer>
          <Bloom 
            intensity={0.3}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.9}
            radius={0.4}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
      
      <HelixControls />
      
      <div className="absolute top-8 left-8 text-white">
        <h1 className="text-4xl font-bold mb-2">DNA Double Helix</h1>
        <p className="text-gray-400">Interactive 3D visualization of DNA structure</p>
      </div>
    </div>
  );
}