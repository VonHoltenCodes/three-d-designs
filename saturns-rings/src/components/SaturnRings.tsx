import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { developerTools, ringConfigs } from '@/lib/developerTools'

interface RingProps {
  innerRadius: number
  outerRadius: number
  particleCount: number
  rotationSpeed: number
  opacity: number
  ringIndex: number
}

function Ring({ innerRadius, outerRadius, particleCount, rotationSpeed, opacity, ringIndex }: RingProps) {
  const ringRef = useRef<THREE.Points>(null)
  const toolsInRing = developerTools.filter(tool => tool.ringIndex === ringIndex)
  
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    
    // Saturn's rings have variations in density creating bands
    const densityBands = Math.floor(Math.random() * 3) + 2
    
    for (let i = 0; i < particleCount; i++) {
      // Angle around the ring
      const angle = Math.random() * Math.PI * 2
      
      // Distance from center with band variations
      const bandIndex = Math.floor(Math.random() * densityBands)
      const bandWidth = (outerRadius - innerRadius) / densityBands
      const bandStart = innerRadius + bandIndex * bandWidth
      const bandEnd = bandStart + bandWidth
      
      // Add gaps between bands for realism
      const gapSize = 0.05
      const radius = bandStart + gapSize + Math.random() * (bandWidth - gapSize * 2)
      
      // Position
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.1 // Slight vertical variation
      positions[i * 3 + 2] = Math.sin(angle) * radius
      
      // Color variations - mix of ice and rock particles
      const isIce = Math.random() > 0.3
      if (isIce) {
        // Ice particles - bluish white
        colors[i * 3] = 0.9 + Math.random() * 0.1
        colors[i * 3 + 1] = 0.95 + Math.random() * 0.05
        colors[i * 3 + 2] = 1
      } else {
        // Rock/dust particles - brownish
        colors[i * 3] = 0.6 + Math.random() * 0.2
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.2
        colors[i * 3 + 2] = 0.2 + Math.random() * 0.1
      }
      
      // Size variation
      sizes[i] = Math.random() * 0.015 + 0.005
      
      // Make some particles represent developer tools
      if (i < toolsInRing.length * 1000 && i % 1000 === 0) {
        const toolIndex = Math.floor(i / 1000)
        const tool = toolsInRing[toolIndex]
        const toolColor = new THREE.Color(tool.color)
        
        // Create clusters of colored particles for each tool
        for (let j = 0; j < 50; j++) {
          const clusterIndex = i + j
          if (clusterIndex < particleCount) {
            const clusterAngle = angle + (Math.random() - 0.5) * 0.1
            const clusterRadius = radius + (Math.random() - 0.5) * 0.2
            
            positions[clusterIndex * 3] = Math.cos(clusterAngle) * clusterRadius
            positions[clusterIndex * 3 + 1] = (Math.random() - 0.5) * 0.1
            positions[clusterIndex * 3 + 2] = Math.sin(clusterAngle) * clusterRadius
            
            colors[clusterIndex * 3] = toolColor.r
            colors[clusterIndex * 3 + 1] = toolColor.g
            colors[clusterIndex * 3 + 2] = toolColor.b
            
            sizes[clusterIndex] = 0.02 + Math.random() * 0.01
          }
        }
      }
    }
    
    return { positions, colors, sizes }
  }, [particleCount, innerRadius, outerRadius, ringIndex, toolsInRing])
  
  // Rotate the ring
  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * rotationSpeed
    }
  })
  
  return (
    <points ref={ringRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.01}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export function SaturnRings() {
  return (
    <>
      {ringConfigs.map((config, index) => (
        <Ring
          key={index}
          innerRadius={config.innerRadius}
          outerRadius={config.outerRadius}
          particleCount={config.particles}
          rotationSpeed={config.rotationSpeed}
          opacity={config.opacity}
          ringIndex={index}
        />
      ))}
    </>
  )
}