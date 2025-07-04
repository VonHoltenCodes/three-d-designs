'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { helixParams } from '@/lib/dnaStructure';

interface PhosphateBackboneProps {
  radius: number;
  height: number;
}

export default function PhosphateBackbone({ radius, height }: PhosphateBackboneProps) {
  const group1Ref = useRef<THREE.Group>(null);
  const group2Ref = useRef<THREE.Group>(null);
  
  // Create multiple curves for braided effect
  const curves = useMemo(() => {
    const curveArray = [];
    const segments = 100;
    const braidRadius = 0.15; // How far each sub-strand is from the main path
    
    // Create 3 sub-strands for each backbone
    for (let strand = 0; strand < 3; strand++) {
      const points = [];
      const braidOffset = (strand * 2 * Math.PI) / 3; // 120 degrees apart
      
      for (let i = 0; i <= segments; i++) {
        const t = (i / segments) * 2 * Math.PI * (height / helixParams.pitch);
        const y = (i / segments - 0.5) * height;
        
        // Main helix position
        const mainX = Math.cos(t) * radius;
        const mainZ = Math.sin(t) * radius;
        
        // Add braiding effect
        const braidAngle = t * 3 + braidOffset; // Faster rotation for braiding
        const braidX = mainX + Math.cos(braidAngle) * braidRadius * Math.cos(t);
        const braidZ = mainZ + Math.cos(braidAngle) * braidRadius * Math.sin(t);
        
        points.push(new THREE.Vector3(braidX, y, braidZ));
      }
      
      curveArray.push(new THREE.CatmullRomCurve3(points));
    }
    
    return curveArray;
  }, [radius, height]);
  
  // Create tube geometries for each sub-strand
  const tubeGeometries = useMemo(() => {
    return curves.map(curve => new THREE.TubeGeometry(curve, 100, 0.03, 6, false));
  }, [curves]);
  
  // Materials for each strand - metallic antenna-like
  const material1 = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.3,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.9,
    });
  }, []);
  
  const material2 = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0x0080ff,
      emissive: 0x0080ff,
      emissiveIntensity: 0.3,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.9,
    });
  }, []);
  
  // Subtle animation for the braids
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (group1Ref.current && group2Ref.current) {
      // Subtle pulsing effect on opacity
      const pulse = Math.sin(time * 2) * 0.05 + 0.9;
      group1Ref.current.children.forEach((mesh: any) => {
        if (mesh.material) mesh.material.opacity = pulse;
      });
      group2Ref.current.children.forEach((mesh: any) => {
        if (mesh.material) mesh.material.opacity = pulse;
      });
    }
  });
  
  return (
    <>
      {/* First backbone - Red (3 braided strands) */}
      <group ref={group1Ref}>
        {tubeGeometries.map((geometry, index) => (
          <mesh key={`red-${index}`} geometry={geometry} material={material1} />
        ))}
      </group>
      
      {/* Second backbone - Blue (3 braided strands, 180 degrees offset) */}
      <group ref={group2Ref} rotation={[0, Math.PI, 0]}>
        {tubeGeometries.map((geometry, index) => (
          <mesh key={`blue-${index}`} geometry={geometry} material={material2} />
        ))}
      </group>
    </>
  );
}