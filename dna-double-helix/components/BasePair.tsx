'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { animated, useSpring } from '@react-spring/three';
import { Text } from '@react-three/drei';
import { nucleotides, helixParams } from '@/lib/dnaStructure';

interface BasePairProps {
  type: 'AT' | 'TA' | 'GC' | 'CG';
  position: THREE.Vector3;
  rotation: number;
  delay: number;
  isAssembled: boolean;
}

export default function BasePair({ type, position, rotation, delay, isAssembled }: BasePairProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [base1, base2] = type.split('') as [string, string];
  
  // Animation for assembly
  const { scale, opacity } = useSpring({
    scale: isAssembled ? 1 : 0,
    opacity: isAssembled ? 1 : 0,
    delay: isAssembled ? delay * 1000 : 0,
    config: { tension: 200, friction: 20 },
  });
  
  // Connection line between bases
  const connectionGeometry = useMemo(() => {
    const points = [
      new THREE.Vector3(-helixParams.radius, 0, 0),
      new THREE.Vector3(helixParams.radius, 0, 0),
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);
  
  return (
    <animated.group
      ref={groupRef}
      position={position}
      rotation={[0, rotation, 0]}
      scale={scale}
    >
      {/* Base 1 */}
      <mesh position={[-helixParams.radius, 0, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial 
          color={nucleotides[base1].color}
          emissive={nucleotides[base1].color}
          emissiveIntensity={0.3}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      
      {/* Base 2 */}
      <mesh position={[helixParams.radius, 0, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial 
          color={nucleotides[base2].color}
          emissive={nucleotides[base2].color}
          emissiveIntensity={0.3}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      
      {/* Connection (hydrogen bonds) */}
      <line geometry={connectionGeometry}>
        <lineBasicMaterial 
          color={0x00ffff}
          transparent
          opacity={0.5}
          linewidth={2}
        />
      </line>
      
      {/* Base labels */}
      <Text
        position={[-helixParams.radius, 0.35, 0]}
        fontSize={0.18}
        color="white"
        outlineWidth={0.02}
        outlineColor={nucleotides[base1].color}
        anchorX="center"
        anchorY="middle"
      >
        {base1}
      </Text>
      
      <Text
        position={[helixParams.radius, 0.35, 0]}
        fontSize={0.18}
        color="white"
        outlineWidth={0.02}
        outlineColor={nucleotides[base2].color}
        anchorX="center"
        anchorY="middle"
      >
        {base2}
      </Text>
    </animated.group>
  );
}