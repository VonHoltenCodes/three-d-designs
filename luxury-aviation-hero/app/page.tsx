'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, PerspectiveCamera, Html, Environment } from '@react-three/drei'
import { useRef, Suspense, useState, useEffect } from 'react'
import * as THREE from 'three'

// Enhanced placeholder with better visibility
function PlaceholderAircraft() {
  const meshRef = useRef<THREE.Group>(null)
  const { mouse } = useThree()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        -mouse.x * 0.2,  // Inverted X for intuitive control
        0.05
      )
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        -mouse.y * 0.1,
        0.05
      )
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })
  
  return (
    <group ref={meshRef}>
      {/* Fuselage */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 10, 32]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Wings */}
      <mesh position={[0, -0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.3, 12, 3]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Tail */}
      <mesh position={[0, 1.5, -4.5]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[3, 4, 0.2]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Engines */}
      <mesh position={[3, -0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 2, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-3, -0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 2, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

// Boeing loader with error handling
function BoeingLoader({ position = [0, 0, 0], showHelpers = true, modelOffset = [0, 0, 0], modelRotation = [0, 0, 0] }) {
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [modelBounds, setModelBounds] = useState<any>(null)
  
  const { scene } = useGLTF('/models/boeing-737-800.glb', (loader) => {
    loader.manager.onProgress = (item, loaded, total) => {
      setProgress((loaded / total) * 100)
    }
  })
  
  const meshRef = useRef<THREE.Group>(null)
  const { mouse } = useThree()
  
  useEffect(() => {
    if (scene) {
      console.log('Boeing model loaded:', scene)
      
      // Calculate bounding box
      const box = new THREE.Box3().setFromObject(scene)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())
      
      // Log the actual bounds to see the offset
      console.log('Box min:', box.min)
      console.log('Box max:', box.max)
      console.log('Box center:', center)
      
      const bounds = {
        size: { x: size.x, y: size.y, z: size.z },
        center: { x: center.x, y: center.y, z: center.z },
        maxDim: Math.max(size.x, size.y, size.z),
        min: { x: box.min.x, y: box.min.y, z: box.min.z },
        max: { x: box.max.x, y: box.max.y, z: box.max.z }
      }
      
      console.log('Model bounds:', bounds)
      setModelBounds(bounds)
      
      let meshCount = 0
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          meshCount++
          // Make sure all meshes are visible
          child.visible = true
          if (child.material) {
            child.material.side = THREE.DoubleSide
          }
        }
      })
      console.log(`Total meshes: ${meshCount}`)
    }
  }, [scene])
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        -mouse.x * 0.15,  // Inverted X for intuitive control
        0.05
      )
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        -mouse.y * 0.1,
        0.05
      )
    }
  })
  
  if (error) {
    return (
      <Html center>
        <div className="bg-red-500 text-white p-4 rounded">
          Error loading model: {error}
        </div>
      </Html>
    )
  }
  
  const scale = modelBounds ? 10 / modelBounds.maxDim : 0.01
  
  return (
    <group position={position}>
      {/* The Boeing model */}
      <group ref={meshRef} scale={scale} rotation={[
        modelRotation[0] * Math.PI / 180,
        modelRotation[1] * Math.PI / 180,
        modelRotation[2] * Math.PI / 180
      ]}>
        {/* Offset the model to center it */}
        <group position={modelBounds ? [
          -modelBounds.center.x + modelOffset[0], 
          -modelBounds.center.y + modelOffset[1], 
          -modelBounds.center.z + modelOffset[2]
        ] : [0, 0, 0]}>
          <primitive object={scene} />
        </group>
        
        {/* Visual helpers at 0,0,0 after centering */}
        {showHelpers && modelBounds && (
          <>
            {/* Bounding box centered */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[
                modelBounds.size.x,
                modelBounds.size.y,
                modelBounds.size.z
              ]} />
              <meshBasicMaterial color="yellow" wireframe />
            </mesh>
            
            {/* Axis helpers - much smaller */}
            <group position={[0, 0, 0]}>
              {/* X axis - red */}
              <mesh position={[modelBounds.size.x * 0.6, 0, 0]}>
                <boxGeometry args={[modelBounds.size.x * 0.2, 10, 10]} />
                <meshBasicMaterial color="red" opacity={0.5} transparent />
              </mesh>
              {/* Y axis - green */}
              <mesh position={[0, modelBounds.size.y * 0.6, 0]}>
                <boxGeometry args={[10, modelBounds.size.y * 0.2, 10]} />
                <meshBasicMaterial color="green" opacity={0.5} transparent />
              </mesh>
              {/* Z axis - blue (forward) */}
              <mesh position={[0, 0, modelBounds.size.z * 0.6]}>
                <boxGeometry args={[10, 10, modelBounds.size.z * 0.2]} />
                <meshBasicMaterial color="blue" opacity={0.5} transparent />
              </mesh>
            </group>
          </>
        )}
      </group>
      
      {/* Origin marker for our position */}
      {showHelpers && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="blue" />
        </mesh>
      )}
      
      {/* Info display */}
      <Html position={[0, -5, 0]}>
        <div className="bg-black/70 text-white p-2 rounded text-xs">
          <div>Scale: {scale.toFixed(4)}</div>
          {modelBounds && (
            <>
              <div>Size: {modelBounds.size.x.toFixed(1)} x {modelBounds.size.y.toFixed(1)} x {modelBounds.size.z.toFixed(1)}</div>
              <div>Max dimension: {modelBounds.maxDim.toFixed(1)}</div>
            </>
          )}
        </div>
      </Html>
    </group>
  )
}

function LoadingStatus({ progress }: { progress: number }) {
  return (
    <Html center>
      <div className="bg-black/50 text-white p-4 rounded">
        Loading Boeing 737: {Math.round(progress)}%
      </div>
    </Html>
  )
}


export default function DebugHome() {
  const [mounted, setMounted] = useState(false)
  const [showBoeing, setShowBoeing] = useState(true)
  const [globalScale, setGlobalScale] = useState(0.01)
  const [position, setPosition] = useState([0, 0, 0])
  const [showHelpers, setShowHelpers] = useState(false)
  const [modelOffset, setModelOffset] = useState([-3.3, 0.6, 4.5])
  const [modelRotation, setModelRotation] = useState([0, 0, 0])
  
  useEffect(() => {
    setMounted(true)
    // Transition scale after mounting
    const timer = setTimeout(() => {
      setGlobalScale(0.0001)
    }, 1000) // Wait 1 second then transition
    
    return () => clearTimeout(timer)
  }, [])
  
  if (!mounted) {
    return <div className="w-full h-screen bg-sky-400" />
  }
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Canvas 
        className="absolute inset-0"
        shadows
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 10, 60]} fov={50} />
        
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
          castShadow
        />
        
        <color attach="background" args={['#87CEEB']} />
        
        {/* Environment map for reflections and lighting */}
        <Environment 
          files="/hdri/kloppenheim_06_8k.exr"
          background
          blur={0}
        />
        
        {/* Aircraft with position control */}
        <group scale={globalScale} position={position}>
          {showBoeing ? (
            <Suspense fallback={<PlaceholderAircraft />}>
              <BoeingLoader position={[0, 0, 0]} showHelpers={showHelpers} modelOffset={modelOffset} modelRotation={modelRotation} />
            </Suspense>
          ) : (
            <group position={[0, 0, 0]}>
              <PlaceholderAircraft />
            </group>
          )}
        </group>
        
      </Canvas>
      
      {/* Debug controls */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white rounded-lg max-h-[90vh] w-80 overflow-hidden flex flex-col">
        <h3 className="text-lg p-4 pb-2 bg-black/50 border-b border-white/20">Debug Controls</h3>
        <div className="overflow-y-auto flex-1 p-4 pt-2">
        <button
          onClick={() => setShowBoeing(!showBoeing)}
          className="bg-white/20 px-4 py-2 rounded hover:bg-white/30 mb-2"
        >
          {showBoeing ? 'Show Placeholder' : 'Show Boeing'}
        </button>
        
        <div className="mt-2">
          <label className="text-sm block mb-1">Scale: {globalScale.toFixed(4)}</label>
          <input
            type="range"
            min="-4"
            max="1"
            step="0.01"
            value={Math.log10(globalScale)}
            onChange={(e) => setGlobalScale(Math.pow(10, parseFloat(e.target.value)))}
            className="w-full"
          />
          <input
            type="number"
            value={globalScale}
            onChange={(e) => setGlobalScale(parseFloat(e.target.value) || 0.01)}
            step="0.001"
            className="w-full mt-1 bg-white/10 text-white px-2 py-1 rounded text-xs"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setGlobalScale(0.001)}
              className="bg-white/20 px-2 py-1 rounded text-xs"
            >
              0.001x
            </button>
            <button
              onClick={() => setGlobalScale(0.01)}
              className="bg-white/20 px-2 py-1 rounded text-xs"
            >
              0.01x
            </button>
            <button
              onClick={() => setGlobalScale(0.1)}
              className="bg-white/20 px-2 py-1 rounded text-xs"
            >
              0.1x
            </button>
            <button
              onClick={() => setGlobalScale(1)}
              className="bg-white/20 px-2 py-1 rounded text-xs"
            >
              1x
            </button>
          </div>
        </div>
        
        <div className="mt-2 text-sm">
          <p>Model: {showBoeing ? 'Boeing 737' : 'Placeholder'}</p>
          <p>Check console for model bounds</p>
        </div>
        
        {/* Position controls */}
        <div className="mt-4 border-t border-white/30 pt-4">
          <label className="text-sm block mb-2">Position Controls</label>
          
          <div className="space-y-2">
            <div>
              <label className="text-xs">X: {position[0].toFixed(1)}</label>
              <input
                type="range"
                min="-50"
                max="50"
                step="0.5"
                value={position[0]}
                onChange={(e) => setPosition([parseFloat(e.target.value), position[1], position[2]])}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-xs">Y: {position[1].toFixed(1)}</label>
              <input
                type="range"
                min="-50"
                max="50"
                step="0.5"
                value={position[1]}
                onChange={(e) => setPosition([position[0], parseFloat(e.target.value), position[2]])}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-xs">Z: {position[2].toFixed(1)}</label>
              <input
                type="range"
                min="-100"
                max="100"
                step="1"
                value={position[2]}
                onChange={(e) => setPosition([position[0], position[1], parseFloat(e.target.value)])}
                className="w-full"
              />
            </div>
          </div>
          
          <button
            onClick={() => setPosition([0, 0, 0])}
            className="bg-white/20 px-3 py-1 rounded text-xs mt-2"
          >
            Reset Position
          </button>
          
          <div className="mt-2">
            <label className="flex items-center text-xs">
              <input
                type="checkbox"
                checked={showHelpers}
                onChange={(e) => setShowHelpers(e.target.checked)}
                className="mr-2"
              />
              Show Helpers
            </label>
          </div>
        </div>
        
        {/* Model offset controls */}
        <div className="mt-4 border-t border-white/30 pt-4">
          <label className="text-sm block mb-2">Model Offset (Fine-tune)</label>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs">Offset X: {modelOffset[0].toFixed(2)}</label>
              <input
                type="range"
                min="-2000"
                max="2000"
                step="0.5"
                value={modelOffset[0]}
                onChange={(e) => setModelOffset([parseFloat(e.target.value), modelOffset[1], modelOffset[2]])}
                className="w-full"
              />
              <input
                type="number"
                value={modelOffset[0]}
                onChange={(e) => setModelOffset([parseFloat(e.target.value) || 0, modelOffset[1], modelOffset[2]])}
                step="0.1"
                className="w-full mt-1 bg-white/10 text-white px-2 py-1 rounded text-xs"
              />
            </div>
            
            <div>
              <label className="text-xs">Offset Y: {modelOffset[1].toFixed(2)}</label>
              <input
                type="range"
                min="-2000"
                max="2000"
                step="0.5"
                value={modelOffset[1]}
                onChange={(e) => setModelOffset([modelOffset[0], parseFloat(e.target.value), modelOffset[2]])}
                className="w-full"
              />
              <input
                type="number"
                value={modelOffset[1]}
                onChange={(e) => setModelOffset([modelOffset[0], parseFloat(e.target.value) || 0, modelOffset[2]])}
                step="0.1"
                className="w-full mt-1 bg-white/10 text-white px-2 py-1 rounded text-xs"
              />
            </div>
            
            <div>
              <label className="text-xs">Offset Z: {modelOffset[2].toFixed(2)}</label>
              <input
                type="range"
                min="-2000"
                max="2000"
                step="0.5"
                value={modelOffset[2]}
                onChange={(e) => setModelOffset([modelOffset[0], modelOffset[1], parseFloat(e.target.value)])}
                className="w-full"
              />
              <input
                type="number"
                value={modelOffset[2]}
                onChange={(e) => setModelOffset([modelOffset[0], modelOffset[1], parseFloat(e.target.value) || 0])}
                step="0.1"
                className="w-full mt-1 bg-white/10 text-white px-2 py-1 rounded text-xs"
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setModelOffset([-3.3, 0.6, 4.5])}
              className="bg-white/20 px-2 py-1 rounded text-xs"
            >
              Reset
            </button>
            <button
              onClick={() => {
                const x = parseFloat(prompt('Enter X offset:') || '0');
                const y = parseFloat(prompt('Enter Y offset:') || '0');
                const z = parseFloat(prompt('Enter Z offset:') || '0');
                setModelOffset([x, y, z]);
              }}
              className="bg-white/20 px-2 py-1 rounded text-xs"
            >
              Set Custom
            </button>
          </div>
        </div>
        
        {/* Model rotation controls */}
        <div className="mt-4 border-t border-white/30 pt-4">
          <label className="text-sm block mb-2">Model Rotation (degrees)</label>
          
          <div className="space-y-2">
            <div>
              <label className="text-xs">Rot X: {modelRotation[0].toFixed(0)}°</label>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={modelRotation[0]}
                onChange={(e) => setModelRotation([parseFloat(e.target.value), modelRotation[1], modelRotation[2]])}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-xs">Rot Y: {modelRotation[1].toFixed(0)}°</label>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={modelRotation[1]}
                onChange={(e) => setModelRotation([modelRotation[0], parseFloat(e.target.value), modelRotation[2]])}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-xs">Rot Z: {modelRotation[2].toFixed(0)}°</label>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={modelRotation[2]}
                onChange={(e) => setModelRotation([modelRotation[0], modelRotation[1], parseFloat(e.target.value)])}
                className="w-full"
              />
            </div>
          </div>
          
          <button
            onClick={() => setModelRotation([0, 0, 0])}
            className="bg-white/20 px-3 py-1 rounded text-xs mt-2"
          >
            Reset Rotation
          </button>
        </div>
        </div>
      </div>
      
      {/* Title in top-right */}
      <div className="absolute top-8 right-8 text-right text-white">
        <h1 className="text-4xl font-light mb-2">Fly Beyond Limits</h1>
        <p className="text-lg opacity-90">Experience luxury aviation</p>
      </div>
      
      <div className="absolute bottom-8 left-8 text-white/60 text-sm">
        <p>Move your mouse to control the aircraft</p>
      </div>
    </div>
  )
}

// Preload
useGLTF.preload('/models/boeing-737-800.glb')