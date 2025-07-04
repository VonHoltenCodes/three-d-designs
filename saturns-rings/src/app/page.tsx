'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Saturn() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  // Create banded texture
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!
    
    const bands = [
      { color: '#FAEBD7', width: 0.12 },
      { color: '#D2B48C', width: 0.08 },
      { color: '#F5DEB3', width: 0.10 },
      { color: '#DEB887', width: 0.15 },
      { color: '#D2B48C', width: 0.10 },
      { color: '#8B7355', width: 0.08 },
      { color: '#FAEBD7', width: 0.12 },
      { color: '#F5DEB3', width: 0.15 },
      { color: '#D2B48C', width: 0.10 },
    ]
    
    let y = 0
    bands.forEach((band) => {
      const height = canvas.height * band.width
      const gradient = ctx.createLinearGradient(0, y, 0, y + height)
      gradient.addColorStop(0, band.color)
      gradient.addColorStop(0.5, adjustBrightness(band.color, 0.95))
      gradient.addColorStop(1, band.color)
      ctx.fillStyle = gradient
      ctx.fillRect(0, y, canvas.width, height)
      y += height
    })
    
    // Add subtle storm
    const stormX = canvas.width * 0.3
    const stormY = canvas.height * 0.6
    const stormGradient = ctx.createRadialGradient(stormX, stormY, 0, stormX, stormY, 80)
    stormGradient.addColorStop(0, 'rgba(205, 133, 63, 0.3)')
    stormGradient.addColorStop(0.5, 'rgba(160, 82, 45, 0.2)')
    stormGradient.addColorStop(1, 'transparent')
    ctx.fillStyle = stormGradient
    ctx.fillRect(stormX - 80, stormY - 40, 160, 80)
    
    return new THREE.CanvasTexture(canvas)
  }, [])
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.015
    }
  })
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[10, 128, 64]} />
      <meshStandardMaterial 
        map={texture}
        roughness={0.8}
        metalness={0.1}
        emissive="#8B7355"
        emissiveIntensity={0.01}
      />
    </mesh>
  )
}

function DeveloperRings() {
  const ring1Ref = useRef<THREE.Points>(null)
  const ring2Ref = useRef<THREE.Points>(null)
  const ring3Ref = useRef<THREE.Points>(null)
  
  const rings = useMemo(() => {
    const ringData = [
      { 
        ref: ring1Ref, 
        inner: 15, 
        outer: 18, 
        particles: 80000, 
        speed: 0.02,
        tools: [
          { name: 'JavaScript', color: '#F7DF1E' },
          { name: 'TypeScript', color: '#3178C6' },
          { name: 'Python', color: '#3776AB' },
          { name: 'Rust', color: '#FF4444' },
          { name: 'Go', color: '#00ADD8' },
        ]
      },
      { 
        ref: ring2Ref, 
        inner: 20, 
        outer: 25, 
        particles: 120000, 
        speed: 0.015,
        tools: [
          { name: 'React', color: '#61DAFB' },
          { name: 'Vue', color: '#4FC08D' },
          { name: 'Node', color: '#339933' },
          { name: 'Next.js', color: '#FFFFFF' },
          { name: 'Angular', color: '#DD0031' },
        ]
      },
      { 
        ref: ring3Ref, 
        inner: 27, 
        outer: 33, 
        particles: 150000, 
        speed: 0.01,
        tools: [
          { name: 'AWS', color: '#FF9900' },
          { name: 'Docker', color: '#2496ED' },
          { name: 'GitHub', color: '#FFFFFF' },
          { name: 'Claude', color: '#D97706' },
          { name: 'Vercel', color: '#FFFFFF' },
        ]
      },
    ]
    
    return ringData.map((ring, ringIndex) => {
      const positions = new Float32Array(ring.particles * 3)
      const colors = new Float32Array(ring.particles * 3)
      const sizes = new Float32Array(ring.particles)
      
      // Create density variations
      const bands = 3 + Math.floor(Math.random() * 2)
      
      for (let i = 0; i < ring.particles; i++) {
        const angle = Math.random() * Math.PI * 2
        
        // Create banded structure
        const band = Math.floor(Math.random() * bands)
        const bandWidth = (ring.outer - ring.inner) / bands
        const bandStart = ring.inner + band * bandWidth
        const gapSize = 0.1
        const radius = bandStart + gapSize + Math.random() * (bandWidth - gapSize * 2)
        
        positions[i * 3] = Math.cos(angle) * radius
        positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3
        positions[i * 3 + 2] = Math.sin(angle) * radius
        
        // Size variation
        sizes[i] = Math.random() * 0.08 + 0.02
        
        // Color assignment
        if (i % 500 === 0 && ring.tools.length > 0) {
          // Developer tool particles (more frequent)
          const tool = ring.tools[Math.floor(Math.random() * ring.tools.length)]
          const toolColor = new THREE.Color(tool.color)
          colors[i * 3] = toolColor.r
          colors[i * 3 + 1] = toolColor.g
          colors[i * 3 + 2] = toolColor.b
          sizes[i] = 0.1 // Make tool particles larger
        } else {
          // Ice and rock particles
          if (Math.random() > 0.3) {
            // Ice particles (bluish-white)
            colors[i * 3] = 0.85 + Math.random() * 0.15
            colors[i * 3 + 1] = 0.9 + Math.random() * 0.1
            colors[i * 3 + 2] = 0.95 + Math.random() * 0.05
          } else {
            // Rock particles (brownish)
            colors[i * 3] = 0.5 + Math.random() * 0.2
            colors[i * 3 + 1] = 0.4 + Math.random() * 0.2
            colors[i * 3 + 2] = 0.3 + Math.random() * 0.2
          }
        }
      }
      
      return { 
        positions, 
        colors, 
        sizes, 
        ref: ring.ref, 
        speed: ring.speed 
      }
    })
  }, [])
  
  useFrame((state, delta) => {
    rings.forEach((ring) => {
      if (ring.ref.current) {
        ring.ref.current.rotation.y += delta * ring.speed
      }
    })
  })
  
  return (
    <>
      {rings.map((ring, index) => (
        <points key={index} ref={ring.ref}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={ring.positions.length / 3}
              array={ring.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={ring.colors.length / 3}
              array={ring.colors}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-size"
              count={ring.sizes.length}
              array={ring.sizes}
              itemSize={1}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.05}
            vertexColors
            transparent
            opacity={0.9}
            sizeAttenuation={true}
            blending={THREE.AdditiveBlending}
          />
        </points>
      ))}
    </>
  )
}

function SaturnMoons() {
  const moonsData = [
    // Major moons
    { name: 'Titan', radius: 0.8, distance: 40, speed: 0.005, color: '#D4A373' },
    { name: 'Rhea', radius: 0.4, distance: 45, speed: 0.007, color: '#E8E8E8' },
    { name: 'Iapetus', radius: 0.35, distance: 55, speed: 0.003, color: '#C0C0C0' },
    { name: 'Dione', radius: 0.3, distance: 38, speed: 0.008, color: '#F0F0F0' },
    { name: 'Tethys', radius: 0.3, distance: 42, speed: 0.009, color: '#FAFAFA' },
    // Inner moons
    { name: 'Enceladus', radius: 0.25, distance: 35, speed: 0.012, color: '#F8F8FF' },
    { name: 'Mimas', radius: 0.2, distance: 30, speed: 0.015, color: '#D3D3D3' },
    // Shepherd moons
    { name: 'Prometheus', radius: 0.1, distance: 22, speed: 0.02, color: '#DDD' },
    { name: 'Pandora', radius: 0.1, distance: 23, speed: 0.019, color: '#EEE' },
  ]
  
  const moonRefs = useRef<(THREE.Group | null)[]>([])
  
  useFrame((state, delta) => {
    moonRefs.current.forEach((ref, i) => {
      if (ref) {
        const moon = moonsData[i]
        ref.rotation.y += delta * moon.speed
      }
    })
  })
  
  return (
    <>
      {moonsData.map((moon, index) => (
        <group 
          key={moon.name} 
          ref={(el) => (moonRefs.current[index] = el)}
        >
          <mesh position={[moon.distance, 0, 0]}>
            <sphereGeometry args={[moon.radius, 32, 16]} />
            <meshStandardMaterial 
              color={moon.color}
              roughness={0.7}
              metalness={0.1}
              emissive={moon.name === 'Enceladus' ? '#F8F8FF' : moon.color}
              emissiveIntensity={moon.name === 'Enceladus' ? 0.1 : 0.02}
            />
          </mesh>
          {/* Orbital path */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[moon.distance - 0.1, moon.distance + 0.1, 64]} />
            <meshBasicMaterial 
              color="#444444" 
              transparent 
              opacity={0.2} 
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </>
  )
}

function adjustBrightness(color: string, factor: number): string {
  const hex = color.replace('#', '')
  const r = Math.min(255, Math.floor(parseInt(hex.substr(0, 2), 16) * factor))
  const g = Math.min(255, Math.floor(parseInt(hex.substr(2, 2), 16) * factor))
  const b = Math.min(255, Math.floor(parseInt(hex.substr(4, 2), 16) * factor))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', backgroundColor: '#000' }}>
      <div style={{ position: 'absolute', top: 16, left: 16, color: '#fbbf24', zIndex: 10, pointerEvents: 'none' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: 8 }}>Saturn's Developer Rings</h1>
        <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>350,000 particles • 9 moons • Drag to rotate • Scroll to zoom</p>
        <div style={{ marginTop: 16, fontSize: '0.75rem', opacity: 0.6 }}>
          <p>Inner Ring: Programming Languages</p>
          <p>Middle Ring: Frameworks & Libraries</p>
          <p>Outer Ring: Cloud & Tools</p>
          <p style={{ marginTop: 8 }}>Moons: Titan, Rhea, Enceladus, and more</p>
        </div>
      </div>
      
      <Canvas 
        style={{ width: '100%', height: '100%' }}
        camera={{ position: [50, 25, 50], fov: 60 }}
      >
        <color attach="background" args={['#000814']} />
        <ambientLight intensity={0.05} />
        <directionalLight 
          position={[100, 50, 50]} 
          intensity={1.8} 
          color="#FFF5E6"
          castShadow
        />
        <directionalLight 
          position={[-50, 20, -30]} 
          intensity={0.4} 
          color="#87CEEB" 
        />
        
        <Stars radius={300} depth={100} count={3000} factor={2} saturation={0} fade speed={0.5} />
        
        <Saturn />
        <DeveloperRings />
        <SaturnMoons />
        
        <OrbitControls 
          enablePan={false}
          minDistance={30}
          maxDistance={120}
          maxPolarAngle={Math.PI * 0.85}
          minPolarAngle={Math.PI * 0.15}
        />
      </Canvas>
    </div>
  )
}