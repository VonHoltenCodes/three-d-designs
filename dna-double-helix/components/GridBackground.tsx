'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GridBackground() {
  const gridRef = useRef<THREE.GridHelper>(null);
  
  // Create multiple grid planes for 3D effect
  const gridConfig = {
    size: 50,
    divisions: 50,
    color1: 0x00ffff,
    color2: 0x00ffff,
  };
  
  useFrame((state) => {
    if (gridRef.current) {
      // Subtle pulsing effect
      const pulse = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + 0.3;
      gridRef.current.material.opacity = pulse;
    }
  });
  
  return (
    <>
      {/* XZ Plane (floor) */}
      <gridHelper 
        ref={gridRef}
        args={[gridConfig.size, gridConfig.divisions, gridConfig.color1, gridConfig.color2]}
        position={[0, -10, 0]}
        material-transparent={true}
        material-opacity={0.3}
      />
      
      {/* YZ Plane (side) */}
      <gridHelper 
        args={[gridConfig.size, gridConfig.divisions, gridConfig.color1, gridConfig.color2]}
        position={[0, 0, -15]}
        rotation={[Math.PI / 2, 0, 0]}
        material-transparent={true}
        material-opacity={0.2}
      />
      
      {/* XY Plane (back) */}
      <gridHelper 
        args={[gridConfig.size, gridConfig.divisions, gridConfig.color1, gridConfig.color2]}
        position={[-20, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        material-transparent={true}
        material-opacity={0.15}
      />
    </>
  );
}