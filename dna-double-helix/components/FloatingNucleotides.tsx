'use client';

import { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import { generateFloatingNucleotides } from '@/lib/dnaStructure';

interface FloatingNucleotidesProps {
  sequence: string;
  onComplete: () => void;
}

export default function FloatingNucleotides({ sequence, onComplete }: FloatingNucleotidesProps) {
  const nucleotides = useMemo(() => generateFloatingNucleotides(sequence), [sequence]);
  
  return (
    <>
      {nucleotides.map((nucleotide, index) => (
        <FloatingNucleotide
          key={index}
          {...nucleotide}
          delay={index * 20}
          onComplete={index === nucleotides.length - 1 ? onComplete : undefined}
        />
      ))}
    </>
  );
}

interface FloatingNucleotideProps {
  base: string;
  startPosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
  color: string;
  delay: number;
  onComplete?: () => void;
}

function FloatingNucleotide({ 
  base, 
  startPosition, 
  targetPosition, 
  color, 
  delay,
  onComplete 
}: FloatingNucleotideProps) {
  const { position } = useSpring({
    from: { position: startPosition.toArray() },
    to: { position: targetPosition.toArray() },
    delay,
    config: { mass: 1, tension: 50, friction: 20 },
    onRest: onComplete,
  });
  
  return (
    <animated.group position={position as any}>
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      <Text
        position={[0, 0.25, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {base}
      </Text>
    </animated.group>
  );
}