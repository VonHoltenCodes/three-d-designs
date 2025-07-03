'use client'

import { Html, useProgress } from '@react-three/drei'

export function LoadingScreen() {
  const { progress } = useProgress()
  
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-white mt-4 text-lg">Loading 3D Globe... {Math.round(progress)}%</p>
      </div>
    </Html>
  )
}