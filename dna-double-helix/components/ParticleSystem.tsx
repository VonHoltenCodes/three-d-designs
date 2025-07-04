'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateWaterMolecules } from '@/lib/dnaStructure';

export default function ParticleSystem() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 50;
  
  // Generate water molecule positions
  const { positions, colors } = useMemo(() => {
    const waterPositions = generateWaterMolecules(particleCount, 20);
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);
    
    waterPositions.forEach((pos, i) => {
      posArray[i * 3] = pos.x;
      posArray[i * 3 + 1] = pos.y;
      posArray[i * 3 + 2] = pos.z;
      
      // Water molecules - bluish white
      colorArray[i * 3] = 0.7;     // R
      colorArray[i * 3 + 1] = 0.9; // G
      colorArray[i * 3 + 2] = 1;   // B
    });
    
    return { positions: posArray, colors: colorArray };
  }, []);
  
  // Animate particles
  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];
        
        // Gentle floating motion
        positions[i3 + 1] = y + Math.sin(time + i) * 0.01;
        
        // Slight rotation around helix
        const angle = Math.atan2(z, x) + 0.001;
        const radius = Math.sqrt(x * x + z * z);
        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 2] = Math.sin(angle) * radius;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}