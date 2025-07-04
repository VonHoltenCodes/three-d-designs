'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateDNASequence, generateHelixPositions, helixParams } from '@/lib/dnaStructure';
import BasePair from './BasePair';
import PhosphateBackbone from './PhosphateBackbone';
import ParticleSystem from './ParticleSystem';
import FloatingNucleotides from './FloatingNucleotides';

export default function DoubleHelix() {
  const groupRef = useRef<THREE.Group>(null);
  const [isAssembled, setIsAssembled] = useState(false);
  
  // Generate DNA sequence
  const sequence = useMemo(() => generateDNASequence(30), []);
  const basePairs = useMemo(() => generateHelixPositions(sequence), [sequence]);
  
  // Start assembly animation after mount
  useEffect(() => {
    const timer = setTimeout(() => setIsAssembled(true), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Gentle rotation
  useFrame((state, delta) => {
    if (groupRef.current && isAssembled) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Phosphate backbones */}
      <PhosphateBackbone radius={helixParams.radius} height={helixParams.helixHeight} />
      
      {/* Base pairs */}
      {basePairs.map((pair, index) => (
        <BasePair
          key={index}
          type={pair.type}
          position={pair.position}
          rotation={pair.rotation}
          delay={index * 0.05}
          isAssembled={isAssembled}
        />
      ))}
      
      {/* Floating nucleotides for assembly */}
      {!isAssembled && (
        <FloatingNucleotides sequence={sequence} onComplete={() => setIsAssembled(true)} />
      )}
      
      {/* Particle system (water molecules) */}
      <ParticleSystem />
    </group>
  );
}