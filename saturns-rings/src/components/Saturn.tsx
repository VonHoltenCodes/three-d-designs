import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createNoise3D } from 'simplex-noise'

export function Saturn() {
  const meshRef = useRef<THREE.Mesh>(null)
  const noise3D = useMemo(() => createNoise3D(), [])
  
  // Create Saturn's banded texture procedurally
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!
    
    // Saturn's characteristic bands
    const bands = [
      { color: '#FAEBD7', width: 0.15 },  // Light beige
      { color: '#D2B48C', width: 0.10 },  // Tan
      { color: '#F5DEB3', width: 0.08 },  // Wheat
      { color: '#DEB887', width: 0.12 },  // Burlywood
      { color: '#D2B48C', width: 0.10 },  // Tan
      { color: '#8B7355', width: 0.08 },  // Light brown
      { color: '#FAEBD7', width: 0.12 },  // Light beige
      { color: '#F5DEB3', width: 0.10 },  // Wheat
      { color: '#D2B48C', width: 0.15 },  // Tan
    ]
    
    let y = 0
    bands.forEach((band, i) => {
      const gradient = ctx.createLinearGradient(0, y, 0, y + canvas.height * band.width)
      
      // Add subtle variations to each band
      gradient.addColorStop(0, band.color)
      gradient.addColorStop(0.5, adjustBrightness(band.color, 0.9))
      gradient.addColorStop(1, adjustBrightness(band.color, 1.1))
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, y, canvas.width, canvas.height * band.width)
      
      // Add noise for more realism
      for (let x = 0; x < canvas.width; x += 10) {
        for (let ny = y; ny < y + canvas.height * band.width; ny += 10) {
          const noiseVal = noise3D(x * 0.001, ny * 0.001, i * 0.1)
          if (noiseVal > 0.3) {
            ctx.fillStyle = adjustBrightness(band.color, 1 + noiseVal * 0.2)
            ctx.fillRect(x, ny, 10, 10)
          }
        }
      }
      
      y += canvas.height * band.width
    })
    
    // Add Great Red Spot analog (storm)
    const stormX = canvas.width * 0.3
    const stormY = canvas.height * 0.6
    const stormGradient = ctx.createRadialGradient(stormX, stormY, 0, stormX, stormY, 60)
    stormGradient.addColorStop(0, '#CD853F')
    stormGradient.addColorStop(0.5, '#A0522D')
    stormGradient.addColorStop(1, 'transparent')
    ctx.fillStyle = stormGradient
    ctx.fillRect(stormX - 60, stormY - 30, 120, 60)
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
  }, [noise3D])
  
  // Subtle rotation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02
    }
  })
  
  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[3, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.8}
        metalness={0.1}
        emissive="#8B7355"
        emissiveIntensity={0.02}
      />
    </mesh>
  )
}

// Helper function to adjust color brightness
function adjustBrightness(color: string, factor: number): string {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  const newR = Math.min(255, Math.floor(r * factor))
  const newG = Math.min(255, Math.floor(g * factor))
  const newB = Math.min(255, Math.floor(b * factor))
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}