'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import the 3D scene to avoid SSR issues
const ConstructionScene = dynamic(() => import('@/components/ConstructionScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-orange-800 font-medium">Loading Construction Site...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* 3D Scene */}
      <Suspense fallback={null}>
        <ConstructionScene />
      </Suspense>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative h-full">
          {/* Hero Text */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
              Build Beyond Limits
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-lg">
              Revolutionizing construction with precision and power
            </p>
          </div>

          {/* CTA Button */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 pointer-events-auto">
            <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-2xl transition-all duration-300 transform hover:scale-105">
              Start Your Project
            </button>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-white/70 text-sm">
            <p>Move mouse to control crane • Click to release wrecking ball</p>
          </div>
        </div>
      </div>
    </main>
  )
}